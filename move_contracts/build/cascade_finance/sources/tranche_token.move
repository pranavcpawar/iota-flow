/// Tranche Token Module
/// Fungible tokens representing Senior and Junior tranches
module cascade_finance::tranche_token {
    use iota::coin;
    use iota::tx_context;
    use iota::transfer;
    use iota::object;
    use std::string;

    /// Senior Tranche Token
    public struct SENIOR_TOKEN has drop {}

    /// Junior Tranche Token  
    public struct JUNIOR_TOKEN has drop {}

    /// Tranche metadata
    public struct TrancheMetadata has key, store {
        id: object::UID,
        name: string::String,
        symbol: string::String,
        face_value: u64,
        amount_repaid: u64,
        pool_id: address,
    }

    /// Event emitted when tranche tokens are minted
    public struct TrancheMinted has copy, drop {
        tranche_type: string::String,
        amount: u64,
        face_value: u64,
        pool_id: address,
    }

    /// Initialize Senior Token
    fun init_senior(witness: SENIOR_TOKEN, ctx: &mut tx_context::TxContext) {
        let (treasury_cap, metadata) = coin::create_currency(
            witness,
            6, // decimals
            b"CASCADE-SENIOR",
            b"Cascade Senior Tranche",
            b"Senior tranche token with priority repayment",
            option::none(),
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    }

    /// Initialize Junior Token
    fun init_junior(witness: JUNIOR_TOKEN, ctx: &mut tx_context::TxContext) {
        let (treasury_cap, metadata) = coin::create_currency(
            witness,
            6, // decimals
            b"CASCADE-JUNIOR",
            b"Cascade Junior Tranche",
            b"Junior tranche token with higher yield potential",
            option::none(),
            ctx
        );
        transfer::public_freeze_object(metadata);
        transfer::public_transfer(treasury_cap, tx_context::sender(ctx));
    }

    /// Create tranche metadata
    public fun create_tranche_metadata(
        name: vector<u8>,
        symbol: vector<u8>,
        face_value: u64,
        pool_id: address,
        ctx: &mut tx_context::TxContext
    ): TrancheMetadata {
        TrancheMetadata {
            id: object::new(ctx),
            name: string::utf8(name),
            symbol: string::utf8(symbol),
            face_value,
            amount_repaid: 0,
            pool_id,
        }
    }

    /// Update amount repaid
    public fun update_amount_repaid(metadata: &mut TrancheMetadata, amount: u64) {
        metadata.amount_repaid = metadata.amount_repaid + amount;
    }

    // Getter functions
    public fun get_face_value(metadata: &TrancheMetadata): u64 {
        metadata.face_value
    }

    public fun get_amount_repaid(metadata: &TrancheMetadata): u64 {
        metadata.amount_repaid
    }

    public fun get_pool_id(metadata: &TrancheMetadata): address {
        metadata.pool_id
    }

    public fun get_remaining_claim(metadata: &TrancheMetadata): u64 {
        metadata.face_value - metadata.amount_repaid
    }
}

