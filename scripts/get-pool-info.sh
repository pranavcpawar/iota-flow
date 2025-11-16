#!/bin/bash

# Get information about a pool
# Usage: ./scripts/get-pool-info.sh <pool_object_id>

POOL_ID=${1}

if [ -z "$POOL_ID" ]; then
  echo "Usage: ./scripts/get-pool-info.sh <pool_object_id>"
  exit 1
fi

echo "Fetching pool information for: $POOL_ID"
echo ""

iota client object "$POOL_ID"

