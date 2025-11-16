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
        return 'bg-orange-100 text-orange-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-2">{pool.name}</h3>
          <p className="text-gray-600 text-sm">{pool.description}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(pool.status)}`}
        >
          {pool.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-blue-600">${pool.totalValue.toLocaleString()}</div>
          <div className="text-xs text-gray-600">Total Value</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-green-600">{overallProgress.toFixed(1)}%</div>
          <div className="text-xs text-gray-600">Funded</div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {/* Senior Tranche */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-sm font-medium">Senior Tranche</span>
            </div>
            <span className="text-sm font-bold text-blue-600">{pool.seniorTranche.apy}% APY</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width: `${Math.min(
                  (pool.seniorTranche.funded / pool.seniorTranche.capacity) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-blue-700 mt-1">
            <span>${pool.seniorTranche.funded.toLocaleString()}</span>
            <span>${pool.seniorTranche.capacity.toLocaleString()}</span>
          </div>
        </div>

        {/* Junior Tranche */}
        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span className="text-sm font-medium">Junior Tranche</span>
            </div>
            <span className="text-sm font-bold text-purple-600">{pool.juniorTranche.apy}% APY</span>
          </div>
          <div className="w-full bg-purple-200 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full"
              style={{
                width: `${Math.min(
                  (pool.juniorTranche.funded / pool.juniorTranche.capacity) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-purple-700 mt-1">
            <span>${pool.juniorTranche.funded.toLocaleString()}</span>
            <span>${pool.juniorTranche.capacity.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          {pool.receivables.length} receivables | Due: {pool.maturityDate.toLocaleDateString()}
        </div>
        <Link href={`/pools/${pool.id}`}>
          <Button size="sm">Invest Now</Button>
        </Link>
      </div>
    </div>
  );
}

function PoolStats({ stats, isLoading }: { stats: PoolStatsType; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white border rounded-lg p-4 animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Pools</p>
            <p className="text-2xl font-bold">{stats.totalPools}</p>
          </div>
          <Activity className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Value</p>
            <p className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</p>
          </div>
          <DollarSign className="w-8 h-8 text-green-500" />
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Senior Funding</p>
            <p className="text-2xl font-bold">${stats.seniorFunding.toLocaleString()}</p>
          </div>
          <TrendingUp className="w-8 h-8 text-blue-500" />
        </div>
      </div>

      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Junior Funding</p>
            <p className="text-2xl font-bold">${stats.juniorFunding.toLocaleString()}</p>
          </div>
          <Users className="w-8 h-8 text-purple-500" />
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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Receivable Pools</h1>
          <p className="text-gray-600">Browse and invest in tokenized receivable pools</p>
        </div>

        {/* Pool Statistics */}
        <PoolStats stats={stats} isLoading={isLoading} />

        {/* Active Pools */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">Available Pools</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                All Pools
              </Button>
              <Button variant="outline" size="sm">
                Funding
              </Button>
              <Button variant="outline" size="sm">
                Active
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white border rounded-lg p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="space-y-2 mb-4">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pools.map((pool) => (
                <PoolCard key={pool.id} pool={pool} />
              ))}
            </div>
          )}
        </div>

        {/* Information Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">How Investment Works</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Senior Tranche</h4>
              <ul className="space-y-1">
                <li>• Lower risk, stable returns</li>
                <li>• Priority claim on receivables</li>
                <li>• Typically 7-10% APY</li>
                <li>• Higher minimum investment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Junior Tranche</h4>
              <ul className="space-y-1">
                <li>• Higher risk, higher returns</li>
                <li>• Subordinate claim</li>
                <li>• Typically 14-18% APY</li>
                <li>• Lower minimum investment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
