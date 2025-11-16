#!/bin/bash

# Check IOTA balance for active address

ADDRESS=$(iota client active-address 2>/dev/null | grep -oE '0x[a-fA-F0-9]+' | head -1)

if [ -z "$ADDRESS" ]; then
  echo "Error: Could not get active address"
  echo "Make sure IOTA CLI is configured and you have an active address"
  exit 1
fi

echo "Checking balance for: $ADDRESS"
echo ""

iota client balance "$ADDRESS"

