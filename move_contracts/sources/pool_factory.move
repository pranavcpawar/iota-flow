/// Pool Factory Module
/// Factory for creating and managing receivable pools
module cascade_finance::pool_factory {
    use iota::object;
    use iota::transfer;
    use iota::tx_context;
    use iota::table;
    use iota::event;

    /// Factory configuration
    public struct PoolFactory has key {
        id: object::UID,
        protocol_fee_bps: u16, // basis points (e.g., 10 = 0.1%)
        total_pools_created: u64,
        admin: address,
    }

    /// Registry of all pools
    public struct PoolRegistry has key {
        id: object::UID,
        pools: table::Table<address, PoolInfo>,
    }

    /// Pool information
    public struct PoolInfo has store, drop, copy {
        merchant: address,
        pool_address: address,
        created_at: u64,
        total_receivable_value: u64,
    }

    /// Events
    public struct FactoryCreated has copy, drop {
        factory_id: address,
        admin: address,
    }

    public struct PoolRegistered has copy, drop {
        pool_address: address,
        merchant: address,
        total_receivable_value: u64,
    }

    /// Error codes
    const E_NOT_ADMIN: u64 = 1;
    const E_INVALID_FEE: u64 = 2;

    /// Initialize the factory
    fun init(ctx: &mut tx_context::TxContext) {
        let admin = tx_context::sender(ctx);
        
        let factory = PoolFactory {
            id: object::new(ctx),
            protocol_fee_bps: 10, // 0.1% default fee
            total_pools_created: 0,
            admin,
        };

        let registry = PoolRegistry {
            id: object::new(ctx),
            pools: table::new(ctx),
        };

        event::emit(FactoryCreated {
            factory_id: object::uid_to_address(&factory.id),
            admin,
        });

        transfer::share_object(factory);
        transfer::share_object(registry);
    }

    /// Register a newly created pool
    public entry fun register_pool(
        registry: &mut PoolRegistry,
        pool_address: address,
        merchant: address,
        total_receivable_value: u64,
        ctx: &mut tx_context::TxContext
    ) {
        let pool_info = PoolInfo {
            merchant,
            pool_address,
            created_at: tx_context::epoch(ctx),
            total_receivable_value,
        };

        table::add(&mut registry.pools, pool_address, pool_info);

        event::emit(PoolRegistered {
            pool_address,
            merchant,
            total_receivable_value,
        });
    }

    /// Update protocol fee (admin only)
    public entry fun update_protocol_fee(
        factory: &mut PoolFactory,
        new_fee_bps: u16,
        ctx: &mut tx_context::TxContext
    ) {
        assert!(tx_context::sender(ctx) == factory.admin, E_NOT_ADMIN);
        assert!(new_fee_bps <= 1000, E_INVALID_FEE); // Max 10%
        factory.protocol_fee_bps = new_fee_bps;
    }

    /// Increment pool counter
    public fun increment_pool_count(factory: &mut PoolFactory) {
        factory.total_pools_created = factory.total_pools_created + 1;
    }

    // Getter functions
    public fun get_protocol_fee(factory: &PoolFactory): u16 {
        factory.protocol_fee_bps
    }

    public fun get_total_pools_created(factory: &PoolFactory): u64 {
        factory.total_pools_created
    }

    public fun get_pool_info(registry: &PoolRegistry, pool_address: address): &PoolInfo {
        table::borrow(&registry.pools, pool_address)
    }
}

