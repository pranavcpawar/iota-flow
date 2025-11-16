export interface Tranche {
  id: string;
  name: 'Senior' | 'Junior';
  description: string;
  riskLevel: 'Low' | 'High';
  minInvestment: number;
  currentTVL: number;
  apy: number;
  discount: number;
  claimPriority: number;
  funded: number;
  capacity: number;
  status: 'funding' | 'active' | 'completed';
}

export interface Investment {
  id: string;
  investorAddress: string;
  trancheId: string;
  poolId: string;
  amount: number;
  investmentDate: Date;
  status: 'active' | 'withdrawn';
  expectedReturn: number;
}

export interface ReceivablePool {
  id: string;
  name: string;
  description: string;
  totalValue: number;
  status: 'funding' | 'active' | 'completed';
  createdAt: Date;
  maturityDate: Date;
  seniorTranche: Tranche;
  juniorTranche: Tranche;
  receivables: import('./index').ReceivableNFT[];
}

export interface PoolStats {
  totalPools: number;
  totalValue: number;
  seniorFunding: number;
  juniorFunding: number;
  activePools: number;
  fundingPools: number;
  completedPools: number;
}
