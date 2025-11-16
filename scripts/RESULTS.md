# 🎉 Contract Interaction Results

## Successfully Completed Actions

### ✅ 1. Minted Receipt NFTs

**First R-NFT:**
- **ID**: `0x05d40b9eeec9b5735f0011b17f129d0da9f70d673cbe80836e5c95804605ac8d`
- **Amount**: 1 IOTA (1,000,000 micro IOTA)
- **Currency**: IOTA
- **Due Date**: 1765917924 (Unix timestamp)
- **Invoice**: INV-001
- **Transaction**: `38jTqetexJi9SuDMdJk9xqfyiLFydUQ8YWGPNnxXeQ8H`

**Second R-NFT:**
- **ID**: `0x994badd1e3c79046ab0c14c17eaf403e313e4d84d5f2e89077563dbab2c4a168`
- **Amount**: 1 IOTA (1,000,000 micro IOTA)
- **Currency**: IOTA
- **Due Date**: 1765917959 (Unix timestamp)
- **Invoice**: INV-1763325959
- **Transaction**: `HPBYosHciknSywBgrdVtJbnJQMoaGdychu5cYjXRtGo2`

### ✅ 2. Created Receivable Pool

**Pool Details:**
- **Pool ID**: `0xd62d194504880ffa3e8926529268d8d1f32ec38f29d19c363f0868125784bfd0`
- **Total Receivable Value**: 2 IOTA (2,000,000 micro IOTA)
- **Advance Amount**: 1.6 IOTA (1,600,000 micro IOTA) - 80% LTV
- **Status**: Funding (ready for investments)
- **Receipt NFTs**: 2 NFTs deposited
- **Transaction**: `3ix5QMh6j91GQ8p9ASjc6rHDFgFt7e1njJvbXHaR918C`

**Pool Structure:**
- Senior Tranche: 75% of claim value
- Junior Tranche: 25% of claim value
- Merchant gets 80% advance immediately when pool is funded

## Your Wallet

- **Address**: `0x41db0d41dbb9d5cff603ea667d3bb979ed09f0f36c7d1cfca71334bb96cc6ad1`
- **Starting Balance**: 9.93 IOTA
- **Current Balance**: ~9.92 IOTA (after gas fees)
- **Gas Used**: ~0.01 IOTA total

## Next Steps

### 1. View Pool in Frontend
The pool should now appear in your frontend at `/pools`!

### 2. Invest in the Pool
You can invest in either tranche:
```bash
# Invest in Senior Tranche (need pool ID and coin object)
iota client call \
  --package 0x3ec613443e83172bebc6b6663a6dc3ddf8d99bf15b76a105e2918a07ba2f0b85 \
  --module receivable_pool \
  --function invest_senior \
  --args <pool_id> <coin_object_id> \
  --gas-budget 10000000
```

### 3. Check Pool Status
```bash
./scripts/get-pool-info.sh 0xd62d194504880ffa3e8926529268d8d1f32ec38f29d19c363f0868125784bfd0
```

## Contract Addresses

- **Package**: `0x3ec613443e83172bebc6b6663a6dc3ddf8d99bf15b76a105e2918a07ba2f0b85`
- **Factory**: `0xc8c085195e7144c418a59fde932045c3b9d57fd3354ccfce4413b358813daf75`
- **Registry**: `0xfd881dd16ccfd53a2418f3c8c9cb93b134e7db424f822ef084e3e874fdad99d8`


