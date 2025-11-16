#!/bin/bash

# Quick mint script - simplest way to mint an R-NFT
# Usage: ./scripts/quick-mint.sh

PACKAGE_ID="0x3ec613443e83172bebc6b6663a6dc3ddf8d99bf15b76a105e2918a07ba2f0b85"

# Generate defaults
AMOUNT=1000000  # 1 IOTA
CURRENCY="IOTA"
DUE_DATE=$(($(date +%s) + 2592000))  # 30 days
CUSTOMER="customer_$(date +%s)"
INVOICE="INV-$(date +%s)"

echo "🚀 Quick Mint Receipt NFT"
echo "=========================="
echo ""

# Convert to hex
CURRENCY_HEX=$(echo -n "$CURRENCY" | xxd -p | tr -d '\n')
CUSTOMER_HEX=$(echo -n "$CUSTOMER" | xxd -p | tr -d '\n')
INVOICE_HEX=$(echo -n "$INVOICE" | xxd -p | tr -d '\n')

iota client call \
  --package "$PACKAGE_ID" \
  --module receipt_nft \
  --function mint_and_transfer \
  --args "$AMOUNT" "$CURRENCY" "$DUE_DATE" "$CUSTOMER" "$INVOICE" \
  --gas-budget 10000000

echo ""
echo "✅ Check your wallet for the new Receipt NFT!"

