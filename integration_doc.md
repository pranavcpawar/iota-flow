# Integration Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend (Next.js)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    UI Components                           │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  • Merchant Dashboard (order-card.tsx)                    │  │
│  │  • Pools Page (pools/page.tsx)                            │  │
│  │  • Pool Detail (pools/[poolId]/page.tsx)                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React Hooks                             │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  • useReceiptNFT                                          │  │
│  │    - mintReceiptNFT()                                     │  │
│  │    - getReceiptDetails()                                  │  │
│  │                                                            │  │
│  │  • useReceivablePool                                      │  │
│  │    - createPool()                                         │  │
│  │    - investSenior() / investJunior()                      │  │
│  │    - processRepayment()                                   │  │
│  │    - getPoolDetails() / getAllPools()                     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              IOTA DApp Kit (@iota/dapp-kit)               │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  • IotaClientProvider                                     │  │
│  │  • WalletProvider (autoConnect)                           │  │
│  │  • Transaction Builder                                    │  │
│  │  • Sign & Execute                                         │  │
│  └───────────────────────────────────────────────────────────┘  │
│                           ↓                                       │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                  Contract Configuration                    │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │  Package ID: 0x3ec6...0b85                                │  │
│  │  Factory:    0xc8c0...af75                                │  │
│  │  Registry:   0xfd88...99d8                                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────────────┐
                    │  Wallet (User)  │
                    │  - Sign Tx      │
                    │  - Pay Gas      │
                    └─────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   IOTA Testnet Blockchain                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Smart Contracts (Move)                        │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │                                                            │  │
│  │  📄 receipt_nft.move                                      │  │
│  │     • mint_and_transfer()                                 │  │
│  │     • get_details()                                       │  │
│  │                                                            │  │
│  │  💰 receivable_pool.move                                  │  │
│  │     • create_pool()                                       │  │
│  │     • invest_senior()                                     │  │
│  │     • invest_junior()                                     │  │
│  │     • process_repayment()                                 │  │
│  │                                                            │  │
│  │  🏭 pool_factory.move                                     │  │
│  │     • init()                                              │  │
│  │     • register_pool()                                     │  │
│  │     • update_protocol_fee()                               │  │
│  │                                                            │  │
│  │  🪙 tranche_token.move                                    │  │
│  │     • create_metadata()                                   │  │
│  │     • update_repayment()                                  │  │
│  │                                                            │  │
│  │  🛠️  utils.move                                           │  │
│  │     • calculate_percentage()                              │  │
│  │     • calculate_bps()                                     │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Minting Receipt NFT

```
Merchant UI
    ↓
[Order Confirmed]
    ↓
useReceiptNFT.mintReceiptNFT()
    ↓
Transaction Builder
    • target: receipt_nft::mint_and_transfer
    • args: [amount, currency, due_date, customer_hash, invoice_number]
    ↓
Wallet Signature
    ↓
IOTA Testnet
    ↓
receipt_nft::mint_and_transfer()
    • Creates ReceiptNFT object
    • Transfers to merchant
    • Emits ReceiptMinted event
    ↓
Transaction Success
    ↓
UI Update (Order status → "minted")
```

### 2. Investing in Pool

```
Investor UI
    ↓
[Select Tranche & Amount]
    ↓
useReceivablePool.investSenior/Junior()
    ↓
Transaction Builder
    • target: receivable_pool::invest_senior
    • args: [pool_object, coin_object]
    ↓
Wallet Signature
    ↓
IOTA Testnet
    ↓
receivable_pool::invest_senior()
    • Adds funds to pool
    • Mints tranche tokens
    • Updates pool state
    • Emits InvestmentMade event
    ↓
Transaction Success
    ↓
UI Update (Tranche funded amount increases)
```

### 3. Creating Pool

```
Merchant UI
    ↓
[Select R-NFTs]
    ↓
useReceivablePool.createPool()
    ↓
Transaction Builder
    • target: receivable_pool::create_pool
    • args: [vector<ReceiptNFT>]
    ↓
Wallet Signature
    ↓
IOTA Testnet
    ↓
receivable_pool::create_pool()
    • Creates ReceivablePool object
    • Calculates total value
    • Sets tranche capacities
    • Emits PoolCreated event
    ↓
Transaction Success
    ↓
UI Update (Pool appears in list)
```

### 4. Processing Repayment

```
Merchant UI
    ↓
[Enter Repayment Amount]
    ↓
useReceivablePool.processRepayment()
    ↓
Transaction Builder
    • target: receivable_pool::process_repayment
    • args: [pool_object, coin_object]
    ↓
Wallet Signature
    ↓
IOTA Testnet
    ↓
receivable_pool::process_repayment()
    • Executes waterfall logic
    • Distributes to Senior tranche
    • Distributes to Junior tranche
    • Distributes remainder to Merchant
    • Emits RepaymentProcessed event
    ↓
Transaction Success
    ↓
UI Update (Repayment amounts updated)
```

## Component Hierarchy

```
App (layout.tsx)
├── Providers (providers/index.tsx)
│   ├── QueryClientProvider
│   ├── IotaClientProvider (testnet)
│   └── WalletProvider (autoConnect)
│
├── Navbar (navbar.tsx)
│   └── ConnectButton (from @iota/dapp-kit)
│
├── Home Page (page.tsx)
│   └── Workflow Display
│
├── Merchant Dashboard (/merchant/page.tsx)
│   ├── CreateSalesOrder
│   │   └── useReceiptNFT (import only)
│   └── SalesOrderList
│       └── OrderCard
│           ├── useReceiptNFT (mintReceiptNFT)
│           ├── QRCodeDisplay
│           └── OrderStatusTracker
│
├── Pools Page (/pools/page.tsx)
│   ├── useReceivablePool (getAllPools)
│   ├── PoolStats
│   └── PoolCard[]
│       └── Link to Pool Detail
│
└── Pool Detail Page (/pools/[poolId]/page.tsx)
    ├── useReceivablePool (getPoolDetails)
    ├── Pool Overview Stats
    ├── InvestmentForm (Senior)
    │   └── useReceivablePool (investSenior)
    ├── InvestmentForm (Junior)
    │   └── useReceivablePool (investJunior)
    └── Receivables List
```

## File Structure

```
iota-hack/
├── move_contracts/              # Smart Contracts
│   ├── Move.toml
│   └── sources/
│       ├── receipt_nft.move
│       ├── receivable_pool.move
│       ├── pool_factory.move
│       ├── tranche_token.move
│       └── utils.move
│
├── src/
│   ├── config/
│   │   └── contracts.ts        # ✨ Contract addresses & config
│   │
│   ├── hooks/
│   │   ├── index.ts            # ✨ Barrel export
│   │   ├── useReceiptNFT.ts    # ✨ Receipt NFT hook
│   │   └── useReceivablePool.ts # ✨ Pool hook
│   │
│   ├── providers/
│   │   └── index.tsx           # 🔧 Updated to testnet
│   │
│   ├── components/
│   │   └── merchant/
│   │       └── order-card.tsx  # 🔧 Added R-NFT minting
│   │
│   └── app/
│       ├── layout.tsx          # 🔧 Added DApp Kit CSS
│       ├── merchant/
│       │   └── page.tsx
│       └── pools/
│           ├── page.tsx        # 🔧 Added pool discovery
│           └── [poolId]/
│               └── page.tsx    # 🔧 Added investment
│
├── .env.local                  # ✨ Environment variables
├── INTEGRATION_GUIDE.md        # ✨ Detailed docs
├── INTEGRATION_SUMMARY.md      # ✨ Quick summary
└── INTEGRATION_ARCHITECTURE.md # ✨ This file

Legend:
✨ = New file
🔧 = Modified file
```

## Environment Variables Flow

```
.env.local
    ↓
Next.js (build time)
    ↓
process.env.NEXT_PUBLIC_*
    ↓
src/config/contracts.ts
    ↓
CONTRACTS & MODULES constants
    ↓
React Hooks (useReceiptNFT, useReceivablePool)
    ↓
Transaction Builder
    ↓
IOTA Testnet
```

## Transaction Lifecycle

```
1. User Action
   └─→ UI Component

2. Hook Function Call
   └─→ useReceiptNFT / useReceivablePool

3. Transaction Building
   ├─→ new Transaction()
   ├─→ tx.moveCall({ target, arguments })
   └─→ tx.splitCoins() [for payments]

4. Sign & Execute
   ├─→ signAndExecute(transaction)
   └─→ Wallet prompts user

5. User Approval
   └─→ Signs transaction

6. Blockchain Execution
   ├─→ Transaction sent to IOTA testnet
   ├─→ Move VM executes contract
   ├─→ State changes committed
   └─→ Events emitted

7. Response Handling
   ├─→ onSuccess callback
   │   ├─→ Update local state
   │   ├─→ Show success message
   │   └─→ Refresh UI
   └─→ onError callback
       ├─→ Log error
       └─→ Show error message
```

## Security Considerations

### Frontend
- ✅ Environment variables for sensitive config
- ✅ User must approve all transactions
- ✅ Amount validation before submission
- ✅ Error handling for failed transactions

### Smart Contracts
- ✅ Access control (merchant-only functions)
- ✅ Amount validation
- ✅ State consistency checks
- ✅ Event emission for transparency

### Wallet Integration
- ✅ User controls private keys
- ✅ Transaction preview before signing
- ✅ Gas estimation
- ✅ Network validation (testnet)

## Performance Optimizations

### Frontend
- React hooks for reusable logic
- Parallel tool calls where possible
- Efficient state management
- Lazy loading of components

### Blockchain
- Batch operations where possible
- Efficient Move code
- Minimal storage usage
- Event-based updates

## Testing Strategy

### Unit Tests
- React hooks (useReceiptNFT, useReceivablePool)
- Contract functions (Move tests)
- Utility functions

### Integration Tests
- End-to-end user flows
- Wallet connectivity
- Transaction execution
- State updates

### Manual Testing
1. Connect wallet
2. Mint R-NFT
3. Create pool
4. Invest in tranches
5. Process repayment

## Monitoring & Debugging

### Frontend
- Console logs for transaction status
- Error callbacks for failures
- React DevTools for state inspection

### Blockchain
- IOTA Explorer for transaction details
- Event logs for contract execution
- Gas usage tracking

### Tools
- Browser DevTools
- IOTA Wallet extension
- IOTA Explorer (testnet)
- React DevTools

## Summary

The integration architecture follows a clean separation of concerns:

1. **UI Components** - User interface and interaction
2. **React Hooks** - Business logic and contract interaction
3. **IOTA DApp Kit** - Wallet connectivity and transaction management
4. **Smart Contracts** - On-chain logic and state management

This architecture ensures:
- ✅ Maintainability (clear separation)
- ✅ Testability (isolated components)
- ✅ Scalability (modular design)
- ✅ Security (wallet-controlled transactions)
- ✅ User Experience (smooth transaction flow)

