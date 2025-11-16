#[test_only]
module cascade_finance::test_utils {
    use cascade_finance::utils;

    #[test]
    fun test_calculate_percentage() {
        let value = 1000;
        let percentage = 80;

        let result = utils::calculate_percentage(value, percentage);
        assert!(result == 800, 1);
    }

    #[test]
    fun test_calculate_bps() {
        let value = 10000;
        let bps = 100; // 1%

        let result = utils::calculate_bps(value, bps);
        assert!(result == 100, 1);
    }

    #[test]
    fun test_min() {
        let a = 100;
        let b = 200;

        let result = utils::min(a, b);
        assert!(result == 100, 1);

        let result2 = utils::min(b, a);
        assert!(result2 == 100, 2);
    }

    #[test]
    fun test_max() {
        let a = 100;
        let b = 200;

        let result = utils::max(a, b);
        assert!(result == 200, 1);

        let result2 = utils::max(b, a);
        assert!(result2 == 200, 2);
    }

    #[test]
    fun test_percentage_100() {
        let value = 1000;
        let result = utils::calculate_percentage(value, 100);
        assert!(result == 1000, 1);
    }

    #[test]
    fun test_percentage_zero() {
        let value = 1000;
        let result = utils::calculate_percentage(value, 0);
        assert!(result == 0, 1);
    }

    #[test]
    fun test_bps_precision() {
        // Test that basis points calculation maintains precision
        let value = 1000000; // 1 IOTA
        let bps = 625; // 6.25%

        let result = utils::calculate_bps(value, bps);
        assert!(result == 62500, 1); // 0.0625 * 1000000
    }
}

