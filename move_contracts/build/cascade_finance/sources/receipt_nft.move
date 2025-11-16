/// Receipt NFT (R-NFT) Module
/// Represents a tokenized receivable/invoice as an NFT
module cascade_finance::receipt_nft {
    use iota::object;
    use iota::transfer;
    use iota::tx_context;
    use std::string::{Self, String};
    use iota::event;

    /// Receipt NFT representing a single receivable
    public struct ReceiptNFT has key, store {
        id: object::UID,
        receivable_amount: u64,
        currency: String,
        due_date: u64,
        merchant_id: address,
        customer_hash: vector<u8>,
        invoice_number: String,
        created_at: u64,
    }

    /// Event emitted when a new R-NFT is minted
    public struct ReceiptMinted has copy, drop {
        receipt_id: address,
        merchant_id: address,
        receivable_amount: u64,
        due_date: u64,
    }

    /// Mint a new Receipt NFT
    public fun mint(
        receivable_amount: u64,
        currency: vector<u8>,
        due_date: u64,
        customer_hash: vector<u8>,
        invoice_number: vector<u8>,
        ctx: &mut tx_context::TxContext
    ): ReceiptNFT {
        let merchant_id = tx_context::sender(ctx);
        let receipt = ReceiptNFT {
            id: object::new(ctx),
            receivable_amount,
            currency: string::utf8(currency),
            due_date,
            merchant_id,
            customer_hash,
            invoice_number: string::utf8(invoice_number),
            created_at: tx_context::epoch(ctx),
        };

        event::emit(ReceiptMinted {
            receipt_id: object::uid_to_address(&receipt.id),
            merchant_id,
            receivable_amount,
            due_date,
        });

        receipt
    }

    /// Public entry function to mint and transfer R-NFT to sender
    public entry fun mint_and_transfer(
        receivable_amount: u64,
        currency: vector<u8>,
        due_date: u64,
        customer_hash: vector<u8>,
        invoice_number: vector<u8>,
        ctx: &mut tx_context::TxContext
    ) {
        let receipt = mint(
            receivable_amount,
            currency,
            due_date,
            customer_hash,
            invoice_number,
            ctx
        );
        transfer::public_transfer(receipt, tx_context::sender(ctx));
    }

    // Getter functions
    public fun get_receivable_amount(receipt: &ReceiptNFT): u64 {
        receipt.receivable_amount
    }

    public fun get_currency(receipt: &ReceiptNFT): String {
        receipt.currency
    }

    public fun get_due_date(receipt: &ReceiptNFT): u64 {
        receipt.due_date
    }

    public fun get_merchant_id(receipt: &ReceiptNFT): address {
        receipt.merchant_id
    }

    public fun get_invoice_number(receipt: &ReceiptNFT): String {
        receipt.invoice_number
    }

    public fun get_created_at(receipt: &ReceiptNFT): u64 {
        receipt.created_at
    }
}

