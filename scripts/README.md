# IOTA CLI Scripts

Helper scripts to interact with the deployed Cascade Finance smart contracts on IOTA testnet.

## Prerequisites

1. IOTA CLI installed and configured
2. Active wallet with testnet IOTA tokens
3. Network set to testnet

## Setup

```bash
# Make scripts executable
chmod +x scripts/*.sh

# Verify IOTA CLI is configured
iota client active-address
```

## Contract Addresses

- **Package ID**: `0x3ec613443e83172bebc6b6663a6dc3ddf8d99bf15b76a105e2918a07ba2f0b85`
- **Factory Object**: `0xc8c085195e7144c418a59fde932045c3b9d57fd3354ccfce4413b358813daf75`
- **Registry Object**: `0xfd881dd16ccfd53a2418f3c8c9cb93b134e7db424f822ef084e3e874fdad99d8`

## Available Scripts

### 1. Check Balance
```bash
./scripts/check-balance.sh
```
Shows your current IOTA balance.

### 2. Mint Receipt NFT
```bash
./scripts/mint-receipt-nft.sh [amount] [currency] [due_date] [customer_hash] [invoice_number]
```

**Example:**
```bash
# Mint with defaults (1 IOTA, due in 30 days)
./scripts/mint-receipt-nft.sh

# Mint with custom values
./scripts/mint-receipt-nft.sh 5000000 "IOTA" $(($(date +%s) + 604800)) "customer_123" "INV-001"
```

**Parameters:**
- `amount`: Amount in micro IOTA (6 decimals). Default: 1000000 (1 IOTA)
- `currency`: Currency string. Default: "IOTA"
- `due_date`: Unix timestamp. Default: 30 days from now
- `customer_hash`: Customer identifier. Default: auto-generated
- `invoice_number`: Invoice number. Default: auto-generated

### 3. List Receipt NFTs
```bash
./scripts/list-receipt-nfts.sh
```
Lists all Receipt NFTs owned by your active address.

### 4. Get Pool Info
```bash
./scripts/get-pool-info.sh <pool_object_id>
```
Fetches detailed information about a specific pool.

## Manual CLI Commands

### Mint Receipt NFT (Manual)
```bash
iota client call \
  --package 0x3ec613443e83172bebc6b6663a6dc3ddf8d99bf15b76a105e2918a07ba2f0b85 \
  --module receipt_nft \
  --function mint_and_transfer \
  --args 1000000 "0x494f5441" $(($(date +%s) + 2592000)) "0x637573746f6d6572" "0x494e562d303031" \
  --gas-budget 10000000
```

### Get Object Details
```bash
iota client object <object_id>
```

### Get Balance
```bash
iota client balance <address>
```

### Transfer IOTA
```bash
iota client transfer-iota --to <recipient_address> --amount <amount_in_miota>
```

## Creating a Pool

To create a pool, you'll need to:
1. Mint multiple Receipt NFTs
2. Collect their object IDs
3. Call `receivable_pool::create_pool` with the receipt IDs

Example:
```bash
iota client call \
  --package 0x3ec613443e83172bebc6b6663a6dc3ddf8d99bf15b76a105e2918a07ba2f0b85 \
  --module receivable_pool \
  --function create_pool \
  --args "[<receipt_id_1>, <receipt_id_2>, ...]" \
  --gas-budget 10000000
```

## Investing in a Pool

```bash
iota client call \
  --package 0x3ec613443e83172bebc6b6663a6dc3ddf8d99bf15b76a105e2918a07ba2f0b85 \
  --module receivable_pool \
  --function invest_senior \
  --args <pool_object_id> <coin_object_id> \
  --gas-budget 10000000
```

## Troubleshooting

### "Insufficient gas"
- Check your balance: `./scripts/check-balance.sh`
- Increase gas budget in the script

### "Object not found"
- Verify the object ID is correct
- Check if the object exists: `iota client object <object_id>`

### "Package not found"
- Verify the package ID is correct
- Ensure you're on testnet: `iota client active-env`

## Network Configuration

Switch to testnet:
```bash
iota client switch --env testnet
```

Verify current network:
```bash
iota client active-env
```

## Next Steps

1. Mint a few Receipt NFTs
2. Create a pool from those NFTs
3. Invest in the pool (Senior or Junior tranche)
4. Check pool status and funding progress

