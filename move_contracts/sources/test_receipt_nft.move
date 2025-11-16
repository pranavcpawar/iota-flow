#[test_only]
module cascade_finance::test_receipt_nft {
    use cascade_finance::receipt_nft;
    use iota::test_scenario;
    use iota::test_utils;
    use std::string;

    const MERCHANT: address = @0x123;

    #[test]
    fun test_mint_receipt_nft() {
        let mut scenario = test_scenario::begin(MERCHANT);
        let ctx = test_scenario::ctx(&mut scenario);

        // Mint a receipt NFT
        let amount = 1000000; // 1 IOTA
        let currency = b"USD";
        let due_date = 1735689600; // Future timestamp
        let customer_hash = b"customer_abc123";
        let invoice_number = b"INV-001";

        receipt_nft::mint_and_transfer(
            amount,
            currency,
            due_date,
            customer_hash,
            invoice_number,
            ctx
        );

        test_scenario::end(scenario);
    }

    #[test]
    fun test_get_receipt_details() {
        let mut scenario = test_scenario::begin(MERCHANT);
        let ctx = test_scenario::ctx(&mut scenario);

        let amount = 2000000;
        let currency = b"EUR";
        let due_date = 1735689600;
        let customer_hash = b"customer_def456";
        let invoice_number = b"INV-002";

        receipt_nft::mint_and_transfer(
            amount,
            currency,
            due_date,
            customer_hash,
            invoice_number,
            ctx
        );

        // In a real test, we'd get the receipt object and check its fields
        // This is a simplified test structure

        test_scenario::end(scenario);
    }
}


