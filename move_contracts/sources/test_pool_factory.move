#[test_only]
module cascade_finance::test_pool_factory {
    use cascade_finance::pool_factory;
    use iota::test_scenario;

    const ADMIN: address = @0x123;
    const NON_ADMIN: address = @0x456;

    #[test]
    fun test_factory_init() {
        let mut scenario = test_scenario::begin(ADMIN);
        let _ctx = test_scenario::ctx(&mut scenario);

        // Factory should be initialized automatically
        // In IOTA, init() is called on package publish

        test_scenario::end(scenario);
    }

    #[test]
    fun test_register_pool() {
        let mut scenario = test_scenario::begin(ADMIN);
        let _ctx = test_scenario::ctx(&mut scenario);

        let _pool_address = @0x999;
        let _merchant = @0x123;
        let _total_value = 1000000;

        // In real test, would get registry from scenario
        // pool_factory::register_pool(registry, pool_address, merchant, total_value, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_protocol_fee() {
        let mut scenario = test_scenario::begin(ADMIN);
        let _ctx = test_scenario::ctx(&mut scenario);

        let _new_fee = 15; // 0.15%

        // In real test, would get factory from scenario
        // pool_factory::update_protocol_fee(factory, new_fee, ctx);

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_fee_non_admin() {
        // TODO: Implement full test with actual fee update attempt by non-admin
        let mut scenario = test_scenario::begin(NON_ADMIN);
        let _ctx = test_scenario::ctx(&mut scenario);

        // This would test that fee update fails if sender is not admin
        // For now, this is a placeholder test

        test_scenario::end(scenario);
    }

    #[test]
    fun test_update_fee_too_high() {
        // TODO: Implement full test with actual invalid fee update
        let mut scenario = test_scenario::begin(ADMIN);
        let _ctx = test_scenario::ctx(&mut scenario);

        let _invalid_fee = 1500; // 15% - exceeds max of 10%

        // This would test that fee update fails if fee is too high
        // For now, this is a placeholder test

        test_scenario::end(scenario);
    }
}

