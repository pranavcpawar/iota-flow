#!/bin/bash

# Create a pool from Receipt NFT IDs
# Usage: ./scripts/create-pool.sh <receipt_id_1> <receipt_id_2> [receipt_id_3] ...

PACKAGE_ID="0x3ec613443e83172bebc6b6663a6dc3ddf8d99bf15b76a105e2918a07ba2f0b85"

if [ $# -lt 2 ]; then
  echo "Usage: ./scripts/create-pool.sh <receipt_id_1> <receipt_id_2> [receipt_id_3] ..."
  echo ""
  echo "You need at least 2 Receipt NFT IDs to create a pool."
  echo ""
  echo "Your current Receipt NFTs:"
  echo "  1. 0x05d40b9eeec9b5735f0011b17f129d0da9f70d673cbe80836e5c95804605ac8d"
  echo "  2. 0x994badd1e3c79046ab0c14c17eaf403e313e4d84d5f2e89077563dbab2c4a168"
  exit 1
fi

echo "Creating pool from Receipt NFTs..."
echo "Package: $PACKAGE_ID"
echo "Receipt IDs:"
for id in "$@"; do
  echo "  - $id"
done
echo ""

# Build vector of receipt IDs - need to pass as individual object arguments
# IOTA CLI expects objects to be passed directly, not as a vector

echo "Calling create_pool..."
echo "Note: This function expects ReceiptNFT objects, not just IDs"
echo ""

# For now, we'll need to pass the objects directly
# The contract expects vector<ReceiptNFT>, so we pass them as separate arguments
RECEIPT_ARGS=""
for id in "$@"; do
  RECEIPT_ARGS="$RECEIPT_ARGS $id"
done

# Build vector argument - IOTA CLI expects comma-separated IDs in brackets
RECEIPT_LIST=""
for id in "$@"; do
  if [ -z "$RECEIPT_LIST" ]; then
    RECEIPT_LIST="$id"
  else
    RECEIPT_LIST="$RECEIPT_LIST,$id"
  fi
done

iota client call \
  --package "$PACKAGE_ID" \
  --module receivable_pool \
  --function create_pool \
  --args "[$RECEIPT_LIST]" \
  --gas-budget 10000000

echo ""
echo "✅ Pool created! Check the transaction output for the pool object ID."

