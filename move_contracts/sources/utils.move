/// Utility functions for Cascade Finance
module cascade_finance::utils {

    /// Calculate percentage of a value
    public fun calculate_percentage(value: u64, percentage: u64): u64 {
        (value * percentage) / 100
    }

    /// Calculate basis points (1 bp = 0.01%)
    public fun calculate_bps(value: u64, bps: u16): u64 {
        let bps_u64 = (bps as u64);
        (value * bps_u64) / 10000
    }

    /// Get minimum of two values
    public fun min(a: u64, b: u64): u64 {
        if (a < b) a else b
    }

    /// Get maximum of two values
    public fun max(a: u64, b: u64): u64 {
        if (a > b) a else b
    }
}

