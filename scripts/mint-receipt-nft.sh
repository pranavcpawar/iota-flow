#!/bin/bash

# Mint a Receipt NFT using IOTA CLI
# Usage: ./scripts/mint-receipt-nft.sh [amount] [currency] [due_date_timestamp] [customer_hash] [invoice_number]

PACKAGE_ID="0x3ec613443e83172bebc6b6663a6dc3ddf8d99bf15b76a105e2918a07ba2f0b85"
FUNCTION="mint_and_transfer"

AMOUNT=${1:-1000000}  # Default: 1 IOTA in micro units (6 decimals)
CURRENCY=${2:-"IOTA"}
DUE_DATE=${3:-$(($(date +%s) + 2592000))}  # Default: 30 days from now
CUSTOMER_HASH=${4:-"customer_$(date +%s)"}
INVOICE_NUMBER=${5:-"INV-$(date +%s)"}

echo "Minting Receipt NFT..."
echo "Package: $PACKAGE_ID"
echo "Amount: $AMOUNT micro IOTA ($(echo "scale=6; $AMOUNT/1000000" | bc) IOTA)"
echo "Currency: $CURRENCY"
echo "Due Date: $(date -r $DUE_DATE 2>/dev/null || date -d @$DUE_DATE 2>/dev/null || echo "$DUE_DATE")"
echo "Customer Hash: $CUSTOMER_HASH"
echo "Invoice Number: $INVOICE_NUMBER"
echo ""

# Convert strings to hex bytes for vector<u8>
CURRENCY_HEX=$(echo -n "$CURRENCY" | xxd -p | tr -d '\n')
CUSTOMER_HEX=$(echo -n "$CUSTOMER_HASH" | xxd -p | tr -d '\n')
INVOICE_HEX=$(echo -n "$INVOICE_NUMBER" | xxd -p | tr -d '\n')

echo "Calling contract..."
echo ""

iota client call \
  --package "$PACKAGE_ID" \
  --module receipt_nft \
  --function "$FUNCTION" \
  --args u64:"$AMOUNT" "vector<u8>:[0x$CURRENCY_HEX]" u64:"$DUE_DATE" "vector<u8>:[0x$CUSTOMER_HEX]" "vector<u8>:[0x$INVOICE_HEX]" \
  --gas-budget 10000000

