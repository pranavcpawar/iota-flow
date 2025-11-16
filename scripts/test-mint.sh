#!/bin/bash

# Test mint - simple version
PACKAGE_ID="0x3ec613443e83172bebc6b6663a6dc3ddf8d99bf15b76a105e2918a07ba2f0b85"

AMOUNT=1000000  # 1 IOTA
DUE_DATE=$(($(date +%s) + 2592000))  # 30 days

echo "Testing mint function..."
echo "Package: $PACKAGE_ID"
echo ""

# Try with simple string format
iota client call \
  --package "$PACKAGE_ID" \
  --module receipt_nft \
  --function mint_and_transfer \
  --args "$AMOUNT" "IOTA" "$DUE_DATE" "customer123" "INV-001" \
  --gas-budget 10000000

