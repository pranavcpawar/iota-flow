#!/bin/bash

# List all Receipt NFTs owned by the active address

ADDRESS=$(iota client active-address 2>/dev/null | grep -oE '0x[a-fA-F0-9]+' | head -1)

if [ -z "$ADDRESS" ]; then
  echo "Error: Could not get active address"
  exit 1
fi

echo "Listing Receipt NFTs for address: $ADDRESS"
echo ""

# Get all objects owned by this address
iota client objects "$ADDRESS" 2>/dev/null | grep -i "receipt\|nft" || echo "No Receipt NFTs found"

