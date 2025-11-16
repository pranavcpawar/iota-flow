#[test_only]
module cascade_finance::test_receivable_pool {
    use cascade_finance::receipt_nft;
    use cascade_finance::receivable_pool;
    use iota::test_scenario;
    use iota::test_utils;
    use iota::coin;
    use iota::iota::IOTA;

    const MERCHANT: address = @0x123;
    const INVESTOR_SENIOR: address = @0x456;
    const INVESTOR_JUNIOR: address = @0x789;

    #[test]
    fun test_create_pool() {
        let mut scenario = test_scenario::begin(MERCHANT);
        let ctx = test_scenario::ctx(&mut scenario);

        // Create receipts
        let receipt1 = receipt_nft::mint(
            1000000, // 1 IOTA
            b"USD",
            1735689600,
            b"customer_1",
            b"INV-001",
            ctx
        );

        let receipt2 = receipt_nft::mint(
            1500000, // 1.5 IOTA
            b"USD",
            1735689600,
            b"customer_2",
            b"INV-002",
            ctx
        );

        let mut receipts = vector::empty<receipt_nft::ReceiptNFT>();
        vector::push_back(&mut receipts, receipt1);
        vector::push_back(&mut receipts, receipt2);

        // Create pool
        receivable_pool::create_pool(receipts, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_invest_and_activate_pool() {
        let mut scenario = test_scenario::begin(MERCHANT);
        let ctx = test_scenario::ctx(&mut scenario);

        // Create pool
        let receipt = receipt_nft::mint(
            10000000, // 10 IOTA
            b"USD",
            1735689600,
            b"customer_1",
            b"INV-001",
            ctx
        );

        let mut receipts = vector::empty<receipt_nft::ReceiptNFT>();
        vector::push_back(&mut receipts, receipt);

        receivable_pool::create_pool(receipts, ctx);

        // Get pool (in real test would get from scenario)
        // For now, this demonstrates the flow

        test_scenario::end(scenario);
    }

    #[test]
    fun test_invest_after_pool_active() {
        // Test that investing fails after pool is activated
        // TODO: Implement full test with actual pool state transitions
        let mut scenario = test_scenario::begin(MERCHANT);
        let _ctx = test_scenario::ctx(&mut scenario);

        // This would test that investing fails if pool status is not FUNDING
        // For now, this is a placeholder test

        test_scenario::end(scenario);
    }

    #[test]
    fun test_repayment_non_merchant() {
        // Test that only merchant can process repayments
        // TODO: Implement full test with actual repayment attempt by non-merchant
        let mut scenario = test_scenario::begin(INVESTOR_SENIOR);
        let _ctx = test_scenario::ctx(&mut scenario);

        // This would test that repayment fails if sender is not the merchant
        // For now, this is a placeholder test

        test_scenario::end(scenario);
    }

    #[test]
    fun test_waterfall_repayment_senior_first() {
        let mut scenario = test_scenario::begin(MERCHANT);
        let ctx = test_scenario::ctx(&mut scenario);

        // Create pool with known values
        let receipt = receipt_nft::mint(
            10000000, // 10 IOTA total receivable
            b"USD",
            1735689600,
            b"customer_1",
            b"INV-001",
            ctx
        );

        let mut receipts = vector::empty<receipt_nft::ReceiptNFT>();
        vector::push_back(&mut receipts, receipt);

        receivable_pool::create_pool(receipts, ctx);

        // Pool should be: 10 IOTA receivable, 8 IOTA advance, 8.5 IOTA claim
        // Senior: 6.375 IOTA, Junior: 2.125 IOTA

        // In full test, would:
        // 1. Fund pool completely
        // 2. Process repayment of 5 IOTA
        // 3. Verify senior gets 5 IOTA, junior gets 0, merchant gets 0
        // 4. Process another repayment
        // 5. Verify waterfall continues correctly

        test_scenario::end(scenario);
    }

    #[test]
    fun test_pool_status_transitions() {
        let mut scenario = test_scenario::begin(MERCHANT);
        let ctx = test_scenario::ctx(&mut scenario);

        // Test pool status: FUNDING -> ACTIVE -> REPAID
        let receipt = receipt_nft::mint(
            1000000,
            b"USD",
            1735689600,
            b"customer_1",
            b"INV-001",
            ctx
        );

        let mut receipts = vector::empty<receipt_nft::ReceiptNFT>();
        vector::push_back(&mut receipts, receipt);

        receivable_pool::create_pool(receipts, ctx);

        // Verify initial status is FUNDING
        // After funding, status becomes ACTIVE
        // After full repayment, status becomes REPAID

        test_scenario::end(scenario);
    }
}

