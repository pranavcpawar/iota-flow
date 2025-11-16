/// Receivable Pool Module
/// Core logic for managing pools, tranches, and waterfall repayments
module cascade_finance::receivable_pool {
    use iota::object;
    use iota::transfer;
    use iota::tx_context;
    use iota::coin::{Self, Coin};
    use iota::balance::{Self, Balance};
    use iota::iota::IOTA;
    use iota::event;
    use cascade_finance::receipt_nft::{Self, ReceiptNFT};

    /// Pool status enum values
    const STATUS_FUNDING: u8 = 0;
    const STATUS_ACTIVE: u8 = 1;
    const STATUS_REPAID: u8 = 2;
    const STATUS_DEFAULTED: u8 = 3;

    /// Error codes
    const E_NOT_MERCHANT: u64 = 1;
    const E_POOL_NOT_FUNDING: u64 = 2;
    const E_POOL_NOT_ACTIVE: u64 = 3;
    const E_INSUFFICIENT_FUNDING: u64 = 4;
    const E_INVALID_AMOUNT: u64 = 5;
    const E_ALREADY_FUNDED: u64 = 6;

    /// Receivable Pool
    public struct ReceivablePool has key {
        id: object::UID,
        merchant: address,
        status: u8,
        total_receivable_value: u64,
        total_claim_value: u64,
        advance_amount: u64, // 80% LTV
        senior_face_value: u64, // 75% of claim
        junior_face_value: u64, // 25% of claim
        senior_amount_repaid: u64,
        junior_amount_repaid: u64,
        merchant_residual_paid: u64,
        pool_balance: Balance<IOTA>,
        receipts: vector<object::ID>,
        created_at: u64,
    }

    /// Investment record for tracking investor contributions
    public struct InvestmentRecord has key, store {
        id: object::UID,
        pool_id: address,
        investor: address,
        is_senior: bool,
        amount_invested: u64,
        tokens_received: u64,
    }

    /// Events
    public struct PoolCreated has copy, drop {
        pool_id: address,
        merchant: address,
        total_receivable_value: u64,
        advance_amount: u64,
    }

    public struct PoolFunded has copy, drop {
        pool_id: address,
        total_funded: u64,
    }

    public struct RepaymentProcessed has copy, drop {
        pool_id: address,
        amount: u64,
        senior_paid: u64,
        junior_paid: u64,
        merchant_paid: u64,
    }

    public struct AdvanceSent has copy, drop {
        pool_id: address,
        merchant: address,
        amount: u64,
    }

    /// Create a new receivable pool
    public entry fun create_pool(
        mut receipts: vector<ReceiptNFT>,
        ctx: &mut tx_context::TxContext
    ) {
        let merchant = tx_context::sender(ctx);
        let mut total_receivable_value = 0u64;
        let mut receipt_ids = vector::empty<object::ID>();

        // Calculate total receivable value
        let mut i = 0;
        let len = vector::length(&receipts);
        while (i < len) {
            let receipt = vector::borrow(&receipts, i);
            total_receivable_value = total_receivable_value + receipt_nft::get_receivable_amount(receipt);
            vector::push_back(&mut receipt_ids, object::id(receipt));
            i = i + 1;
        };

        // Calculate pool parameters
        // LTV = 80%, so advance = 80% of total receivable
        let advance_amount = (total_receivable_value * 80) / 100;
        
        // Total claim = advance + financing cost (assume 6.25% of advance for simplicity)
        let financing_cost = (advance_amount * 625) / 10000; // 6.25%
        let total_claim_value = advance_amount + financing_cost;
        
        // Senior = 75% of claim, Junior = 25% of claim
        let senior_face_value = (total_claim_value * 75) / 100;
        let junior_face_value = total_claim_value - senior_face_value;

        let pool = ReceivablePool {
            id: object::new(ctx),
            merchant,
            status: STATUS_FUNDING,
            total_receivable_value,
            total_claim_value,
            advance_amount,
            senior_face_value,
            junior_face_value,
            senior_amount_repaid: 0,
            junior_amount_repaid: 0,
            merchant_residual_paid: 0,
            pool_balance: balance::zero(),
            receipts: receipt_ids,
            created_at: tx_context::epoch(ctx),
        };

        let pool_id = object::uid_to_address(&pool.id);

        // Transfer receipts to pool (burn them as they're now part of the pool)
        while (!vector::is_empty(&receipts)) {
            let receipt = vector::pop_back(&mut receipts);
            transfer::public_transfer(receipt, pool_id);
        };
        vector::destroy_empty(receipts);

        event::emit(PoolCreated {
            pool_id,
            merchant,
            total_receivable_value,
            advance_amount,
        });

        transfer::share_object(pool);
    }

    /// Invest in senior tranche
    public entry fun invest_senior(
        pool: &mut ReceivablePool,
        payment: Coin<IOTA>,
        ctx: &mut tx_context::TxContext
    ) {
        assert!(pool.status == STATUS_FUNDING, E_POOL_NOT_FUNDING);
        
        let amount = coin::value(&payment);
        assert!(amount > 0, E_INVALID_AMOUNT);

        balance::join(&mut pool.pool_balance, coin::into_balance(payment));

        let investor = tx_context::sender(ctx);
        let record = InvestmentRecord {
            id: object::new(ctx),
            pool_id: object::uid_to_address(&pool.id),
            investor,
            is_senior: true,
            amount_invested: amount,
            tokens_received: amount, // 1:1 for simplicity, can be adjusted
        };

        transfer::public_transfer(record, investor);

        // Check if pool is fully funded
        check_and_activate_pool(pool, ctx);
    }

    /// Invest in junior tranche
    public entry fun invest_junior(
        pool: &mut ReceivablePool,
        payment: Coin<IOTA>,
        ctx: &mut tx_context::TxContext
    ) {
        assert!(pool.status == STATUS_FUNDING, E_POOL_NOT_FUNDING);
        
        let amount = coin::value(&payment);
        assert!(amount > 0, E_INVALID_AMOUNT);

        balance::join(&mut pool.pool_balance, coin::into_balance(payment));

        let investor = tx_context::sender(ctx);
        let record = InvestmentRecord {
            id: object::new(ctx),
            pool_id: object::uid_to_address(&pool.id),
            investor,
            is_senior: false,
            amount_invested: amount,
            tokens_received: amount,
        };

        transfer::public_transfer(record, investor);

        // Check if pool is fully funded
        check_and_activate_pool(pool, ctx);
    }

    /// Check if pool is fully funded and activate it
    fun check_and_activate_pool(pool: &mut ReceivablePool, ctx: &mut tx_context::TxContext) {
        let current_balance = balance::value(&pool.pool_balance);
        
        // Pool is funded when balance >= advance_amount
        if (current_balance >= pool.advance_amount) {
            pool.status = STATUS_ACTIVE;
            
            // Send advance to merchant
            let advance_coin = coin::from_balance(
                balance::split(&mut pool.pool_balance, pool.advance_amount),
                ctx
            );
            
            event::emit(AdvanceSent {
                pool_id: object::uid_to_address(&pool.id),
                merchant: pool.merchant,
                amount: pool.advance_amount,
            });

            event::emit(PoolFunded {
                pool_id: object::uid_to_address(&pool.id),
                total_funded: current_balance,
            });

            transfer::public_transfer(advance_coin, pool.merchant);
        }
    }

    /// Process repayment with waterfall logic
    public entry fun process_repayment(
        pool: &mut ReceivablePool,
        payment: Coin<IOTA>,
        ctx: &mut tx_context::TxContext
    ) {
        assert!(pool.status == STATUS_ACTIVE, E_POOL_NOT_ACTIVE);
        assert!(tx_context::sender(ctx) == pool.merchant, E_NOT_MERCHANT);

        let repayment_amount = coin::value(&payment);
        balance::join(&mut pool.pool_balance, coin::into_balance(payment));

        // Waterfall logic
        let mut remaining = repayment_amount;
        let mut senior_paid = 0u64;
        let mut junior_paid = 0u64;
        let mut merchant_paid = 0u64;

        // 1. Pay senior tranche first
        let senior_remaining = pool.senior_face_value - pool.senior_amount_repaid;
        if (senior_remaining > 0 && remaining > 0) {
            if (remaining >= senior_remaining) {
                senior_paid = senior_remaining;
                pool.senior_amount_repaid = pool.senior_face_value;
                remaining = remaining - senior_remaining;
            } else {
                senior_paid = remaining;
                pool.senior_amount_repaid = pool.senior_amount_repaid + remaining;
                remaining = 0;
            }
        };

        // 2. Pay junior tranche second
        let junior_remaining = pool.junior_face_value - pool.junior_amount_repaid;
        if (junior_remaining > 0 && remaining > 0) {
            if (remaining >= junior_remaining) {
                junior_paid = junior_remaining;
                pool.junior_amount_repaid = pool.junior_face_value;
                remaining = remaining - junior_remaining;
            } else {
                junior_paid = remaining;
                pool.junior_amount_repaid = pool.junior_amount_repaid + remaining;
                remaining = 0;
            }
        };

        // 3. Pay merchant residual
        if (remaining > 0) {
            merchant_paid = remaining;
            pool.merchant_residual_paid = pool.merchant_residual_paid + remaining;
            
            // Send residual to merchant
            let residual_coin = coin::from_balance(
                balance::split(&mut pool.pool_balance, remaining),
                ctx
            );
            transfer::public_transfer(residual_coin, pool.merchant);
        };

        event::emit(RepaymentProcessed {
            pool_id: object::uid_to_address(&pool.id),
            amount: repayment_amount,
            senior_paid,
            junior_paid,
            merchant_paid,
        });

        // Check if pool is fully repaid
        if (pool.senior_amount_repaid == pool.senior_face_value && 
            pool.junior_amount_repaid == pool.junior_face_value) {
            pool.status = STATUS_REPAID;
        }
    }

    /// Claim repayment for investors (simplified - in production would track per investor)
    public entry fun claim_repayment(
        pool: &mut ReceivablePool,
        record: &InvestmentRecord,
        ctx: &mut tx_context::TxContext
    ) {
        let investor = tx_context::sender(ctx);
        assert!(record.investor == investor, E_NOT_MERCHANT);
        
        // Calculate claimable amount based on investment proportion
        let claimable = if (record.is_senior) {
            let proportion = (record.tokens_received * 1000000) / pool.senior_face_value;
            (pool.senior_amount_repaid * proportion) / 1000000
        } else {
            let proportion = (record.tokens_received * 1000000) / pool.junior_face_value;
            (pool.junior_amount_repaid * proportion) / 1000000
        };

        if (claimable > 0) {
            let claim_coin = coin::from_balance(
                balance::split(&mut pool.pool_balance, claimable),
                ctx
            );
            transfer::public_transfer(claim_coin, investor);
        }
    }

    // Getter functions
    public fun get_status(pool: &ReceivablePool): u8 {
        pool.status
    }

    public fun get_total_receivable_value(pool: &ReceivablePool): u64 {
        pool.total_receivable_value
    }

    public fun get_advance_amount(pool: &ReceivablePool): u64 {
        pool.advance_amount
    }

    public fun get_senior_face_value(pool: &ReceivablePool): u64 {
        pool.senior_face_value
    }

    public fun get_junior_face_value(pool: &ReceivablePool): u64 {
        pool.junior_face_value
    }

    public fun get_merchant(pool: &ReceivablePool): address {
        pool.merchant
    }
}

