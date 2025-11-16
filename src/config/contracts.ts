/**
 * Cascade Finance Smart Contract Configuration
 * Deployed on IOTA Testnet
 */

export const CONTRACTS = {
  // Package ID - Same for all modules
  PACKAGE_ID: process.env.NEXT_PUBLIC_RECEIPT_NFT_PACKAGE_ID || '0x3ec613443e83172bebc6b6663a6dc3ddf8d99bf15b76a105e2918a07ba2f0b85',
  
  // Shared Objects
  FACTORY_OBJECT_ID: process.env.NEXT_PUBLIC_FACTORY_OBJECT_ID || '0xc8c085195e7144c418a59fde932045c3b9d57fd3354ccfce4413b358813daf75',
  REGISTRY_OBJECT_ID: process.env.NEXT_PUBLIC_REGISTRY_OBJECT_ID || '0xfd881dd16ccfd53a2418f3c8c9cb93b134e7db424f822ef084e3e874fdad99d8',
} as const;

export const PROTOCOL_CONFIG = {
  PROTOCOL_FEE_BPS: Number(process.env.NEXT_PUBLIC_PROTOCOL_FEE_BPS) || 10,
  LTV_PERCENTAGE: Number(process.env.NEXT_PUBLIC_LTV_PERCENTAGE) || 80,
  SENIOR_PERCENTAGE: Number(process.env.NEXT_PUBLIC_SENIOR_PERCENTAGE) || 75,
  JUNIOR_PERCENTAGE: Number(process.env.NEXT_PUBLIC_JUNIOR_PERCENTAGE) || 25,
} as const;

export const NETWORK_CONFIG = {
  network: (process.env.NEXT_PUBLIC_IOTA_NETWORK || 'testnet') as 'testnet' | 'mainnet',
  rpcUrl: process.env.NEXT_PUBLIC_IOTA_RPC_URL || 'https://api.testnet.iota.cafe',
} as const;

// Module paths for contract calls
export const MODULES = {
  RECEIPT_NFT: `${CONTRACTS.PACKAGE_ID}::receipt_nft`,
  RECEIVABLE_POOL: `${CONTRACTS.PACKAGE_ID}::receivable_pool`,
  POOL_FACTORY: `${CONTRACTS.PACKAGE_ID}::pool_factory`,
  TRANCHE_TOKEN: `${CONTRACTS.PACKAGE_ID}::tranche_token`,
} as const;

