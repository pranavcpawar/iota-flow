'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReceivablePool, PoolStats as PoolStatsType } from '@/types/pools';
import { TrendingUp, DollarSign, Users, Activity } from 'lucide-react';

function PoolCard({ pool }: { pool: ReceivablePool }) {
  const totalFunded = pool.seniorTranche.funded + pool.juniorTranche.funded;
  const totalCapacity = pool.seniorTranche.capacity + pool.juniorTranche.capacity;
  const overallProgress = (totalFunded / totalCapacity) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funding':
        return 'bg-gradient-to-r from-orange-500/20 to-orange-600/20 text-orange-300 border border-orange-500/30';
      case 'active':
        return 'bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-300 border border-emerald-500/30';
      case 'completed':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-300 border border-blue-500/30';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-300 border border-gray-500/30';
    }
  };

  return (
    <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300 group backdrop-blur-sm">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
            {pool.name}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">{pool.description}</p>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide ${getStatusColor(
            pool.status,
          )} shrink-0 ml-4`}
        >
          {pool.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-linear-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-lg backdrop-blur-sm">
          <div className="text-2xl font-bold text-primary mb-1">
            ${pool.totalValue.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Total Value
          </div>
        </div>
        <div className="text-center p-4 bg-linear-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-lg backdrop-blur-sm">
          <div className="text-2xl font-bold text-emerald-400 mb-1">
            {overallProgress.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            Funded
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {/* Senior Tranche */}
        <div className="bg-linear-to-r from-blue-500/10 to-blue-600/5 border border-blue-500/20 p-4 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-linear-to-r from-blue-400 to-blue-500 rounded-full shadow-lg shadow-blue-500/30"></div>
              <span className="text-sm font-semibold text-foreground">Senior Tranche</span>
            </div>
            <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {pool.seniorTranche.apy}% APY
            </div>
          </div>
          <div className="w-full bg-blue-900/20 rounded-full h-3 mb-2">
            <div
              className="bg-linear-to-r from-blue-400 to-blue-500 h-3 rounded-full shadow-lg shadow-blue-500/30 transition-all duration-300"
              style={{
                width: `${Math.min(
                  (pool.seniorTranche.funded / pool.seniorTranche.capacity) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-blue-300 font-medium">
            <span>${pool.seniorTranche.funded.toLocaleString()}</span>
            <span>${pool.seniorTranche.capacity.toLocaleString()}</span>
          </div>
        </div>

        {/* Junior Tranche */}
        <div className="bg-linear-to-r from-purple-500/10 to-purple-600/5 border border-purple-500/20 p-4 rounded-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-linear-to-r from-purple-400 to-purple-500 rounded-full shadow-lg shadow-purple-500/30"></div>
              <span className="text-sm font-semibold text-foreground">Junior Tranche</span>
            </div>
            <div className="bg-linear-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {pool.juniorTranche.apy}% APY
            </div>
          </div>
          <div className="w-full bg-purple-900/20 rounded-full h-3 mb-2">
            <div
              className="bg-linear-to-r from-purple-400 to-purple-500 h-3 rounded-full shadow-lg shadow-purple-500/30 transition-all duration-300"
              style={{
                width: `${Math.min(
                  (pool.juniorTranche.funded / pool.juniorTranche.capacity) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-purple-300 font-medium">
            <span>${pool.juniorTranche.funded.toLocaleString()}</span>
            <span>${pool.juniorTranche.capacity.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-sm font-medium text-purple-300">
                {pool.receivables.length} NFTs
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-lg">
              <span className="text-blue-400 text-xs">📅</span>
              <span className="text-sm font-medium text-blue-300">
                Due: {pool.maturityDate.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <Link href={`/pools/${pool.id}`} className="w-full">
          <Button
            size="lg"
            className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:scale-[1.02] font-semibold"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-lg">💰</span>
              <span>Invest Now</span>
              <span className="text-sm">→</span>
            </div>
          </Button>
        </Link>
      </div>
    </div>
  );
}

function PoolStats({ stats, isLoading }: { stats: PoolStatsType; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 animate-pulse"
          >
            <div className="h-8 bg-muted/50 rounded mb-3"></div>
            <div className="h-4 bg-muted/30 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-2">
              Total Pools
            </p>
            <p className="text-3xl font-bold text-foreground">{stats.totalPools}</p>
          </div>
          <div className="p-3 bg-linear-to-br from-blue-500/20 to-blue-600/10 rounded-lg">
            <Activity className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-500/5 hover:border-emerald-500/20 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-2">
              Total Value
            </p>
            <p className="text-3xl font-bold text-foreground">
              ${stats.totalValue.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-linear-to-br from-emerald-500/20 to-emerald-600/10 rounded-lg">
            <DollarSign className="w-8 h-8 text-emerald-400" />
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 hover:shadow-lg hover:shadow-blue-500/5 hover:border-blue-500/20 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-2">
              Senior Funding
            </p>
            <p className="text-3xl font-bold text-foreground">
              ${stats.seniorFunding.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-linear-to-br from-blue-500/20 to-blue-600/10 rounded-lg">
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/5 hover:border-purple-500/20 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-2">
              Junior Funding
            </p>
            <p className="text-3xl font-bold text-foreground">
              ${stats.juniorFunding.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-linear-to-br from-purple-500/20 to-purple-600/10 rounded-lg">
            <Users className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PoolsPage() {
  const [pools, setPools] = useState<ReceivablePool[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading pools from API
    const loadPools = () => {
      const mockPools: ReceivablePool[] = [
        {
          id: 'pool-001',
          name: 'Pool Alpha',
          description: 'Diversified receivables pool with high-quality merchants',
          totalValue: 157000,
          status: 'funding',
          createdAt: new Date('2024-11-05'),
          maturityDate: new Date('2024-12-20'),
          seniorTranche: {
            id: 'senior',
            name: 'Senior',
            description: 'Lower risk, stable returns with priority claim',
            riskLevel: 'Low',
            minInvestment: 1000,
            currentTVL: 24000,
            apy: 8,
            discount: 8,
            claimPriority: 1,
            funded: 24000,
            capacity: 30000,
            status: 'funding',
          },
          juniorTranche: {
            id: 'junior',
            name: 'Junior',
            description: 'Higher risk, higher returns with subordinate claim',
            riskLevel: 'High',
            minInvestment: 500,
            currentTVL: 9500,
            apy: 15,
            discount: 15,
            claimPriority: 2,
            funded: 9500,
            capacity: 10000,
            status: 'funding',
          },
          receivables: [],
        },
        {
          id: 'pool-002',
          name: 'Pool Beta',
          description: 'Active pool with established merchant relationships',
          totalValue: 250000,
          status: 'active',
          createdAt: new Date('2024-10-15'),
          maturityDate: new Date('2024-12-15'),
          seniorTranche: {
            id: 'senior',
            name: 'Senior',
            description: 'Lower risk, stable returns with priority claim',
            riskLevel: 'Low',
            minInvestment: 1000,
            currentTVL: 45000,
            apy: 7,
            discount: 7,
            claimPriority: 1,
            funded: 45000,
            capacity: 45000,
            status: 'active',
          },
          juniorTranche: {
            id: 'junior',
            name: 'Junior',
            description: 'Higher risk, higher returns with subordinate claim',
            riskLevel: 'High',
            minInvestment: 500,
            currentTVL: 15000,
            apy: 14,
            discount: 14,
            claimPriority: 2,
            funded: 15000,
            capacity: 15000,
            status: 'active',
          },
          receivables: [],
        },
        {
          id: 'pool-003',
          name: 'Pool Gamma',
          description: 'New funding opportunity with premium receivables',
          totalValue: 180000,
          status: 'funding',
          createdAt: new Date('2024-11-10'),
          maturityDate: new Date('2024-12-25'),
          seniorTranche: {
            id: 'senior',
            name: 'Senior',
            description: 'Lower risk, stable returns with priority claim',
            riskLevel: 'Low',
            minInvestment: 1000,
            currentTVL: 8500,
            apy: 9,
            discount: 9,
            claimPriority: 1,
            funded: 8500,
            capacity: 19200,
            status: 'funding',
          },
          juniorTranche: {
            id: 'junior',
            name: 'Junior',
            description: 'Higher risk, higher returns with subordinate claim',
            riskLevel: 'High',
            minInvestment: 500,
            currentTVL: 1820,
            apy: 16,
            discount: 16,
            claimPriority: 2,
            funded: 1820,
            capacity: 4800,
            status: 'funding',
          },
          receivables: [],
        },
      ];

      setTimeout(() => {
        setPools(mockPools);
        setIsLoading(false);
      }, 1000);
    };

    loadPools();
  }, []);

  const calculateStats = (): PoolStatsType => {
    const totalPools = pools.length;
    const totalValue = pools.reduce((sum, pool) => sum + pool.totalValue, 0);
    const seniorFunding = pools.reduce((sum, pool) => sum + pool.seniorTranche.funded, 0);
    const juniorFunding = pools.reduce((sum, pool) => sum + pool.juniorTranche.funded, 0);
    const activePools = pools.filter((pool) => pool.status === 'active').length;
    const fundingPools = pools.filter((pool) => pool.status === 'funding').length;
    const completedPools = pools.filter((pool) => pool.status === 'completed').length;

    return {
      totalPools,
      totalValue,
      seniorFunding,
      juniorFunding,
      activePools,
      fundingPools,
      completedPools,
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-background/80">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold bg-linear-to-r from-primary to-chart-1 bg-clip-text text-transparent mb-4">
              Receivable Pools
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Browse and invest in tokenized receivable pools with transparent, blockchain-secured
              returns
            </p>
          </div>

          {/* Pool Statistics */}
          <PoolStats stats={stats} isLoading={isLoading} />

          {/* Active Pools */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <h2 className="text-3xl font-bold text-foreground">Available Pools</h2>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-card/50 hover:bg-primary hover:text-primary-foreground border-border/50"
                >
                  All Pools
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-card/50 hover:bg-orange-500 hover:text-white border-border/50"
                >
                  Funding
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-card/50 hover:bg-emerald-500 hover:text-white border-border/50"
                >
                  Active
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 animate-pulse"
                  >
                    <div className="h-6 bg-muted/50 rounded mb-4"></div>
                    <div className="h-4 bg-muted/30 rounded mb-6"></div>
                    <div className="space-y-3 mb-6">
                      <div className="h-3 bg-muted/40 rounded"></div>
                      <div className="h-3 bg-muted/40 rounded"></div>
                    </div>
                    <div className="h-10 bg-muted/50 rounded"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pools.map((pool) => (
                  <PoolCard key={pool.id} pool={pool} />
                ))}
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-16 bg-linear-to-br from-primary/5 to-chart-1/5 border border-primary/20 rounded-2xl p-8 backdrop-blur-sm">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-foreground mb-3">How Investment Works</h3>
              <p className="text-muted-foreground">
                Choose your risk level and investment strategy
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-linear-to-r from-blue-400 to-blue-500 rounded-full shadow-lg shadow-blue-500/30"></div>
                  <h4 className="font-bold text-lg text-foreground">Senior Tranche</h4>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>Lower risk, stable returns</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>Priority claim on receivables</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                    <span>Typically 7-10% APY</span>
                  </li>
                </ul>
              </div>
              <div className="bg-linear-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 bg-linear-to-r from-purple-400 to-purple-500 rounded-full shadow-lg shadow-purple-500/30"></div>
                  <h4 className="font-bold text-lg text-foreground">Junior Tranche</h4>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span>Higher risk, higher returns</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span>Subordinate claim</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                    <span>Typically 14-18% APY</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
