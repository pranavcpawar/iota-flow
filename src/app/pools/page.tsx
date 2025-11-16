'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReceivablePool, PoolStats as PoolStatsType } from '@/types/pools';
import { TrendingUp, DollarSign, Users, Activity, ArrowRight } from 'lucide-react';
import { useReceivablePool } from '@/hooks';

function PoolCard({ pool }: { pool: ReceivablePool }) {
  const totalFunded = pool.seniorTranche.funded + pool.juniorTranche.funded;
  const totalCapacity = pool.seniorTranche.capacity + pool.juniorTranche.capacity;
  const overallProgress = (totalFunded / totalCapacity) * 100;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'funding':
        return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
      case 'active':
        return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
      case 'completed':
        return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
      default:
        return 'text-muted-foreground border-border/40 bg-muted/20';
    }
  };

  return (
    <div className="group relative p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl hover:border-border transition-all hover:scale-[1.01] fade-in-up">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-medium mb-2 text-foreground">
            {pool.name}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{pool.description}</p>
        </div>
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            pool.status,
          )} shrink-0 ml-4`}
        >
          {pool.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
          <div className="text-2xl font-semibold mb-1">
            ${pool.totalValue.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Total Value
          </div>
        </div>
        <div className="p-4 rounded-lg border border-border/40 bg-muted/20">
          <div className="text-2xl font-semibold mb-1">
            {overallProgress.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground uppercase tracking-wide">
            Funded
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {/* Senior Tranche */}
        <div className="p-4 rounded-lg border border-border/40 bg-muted/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-sm font-medium">Senior</span>
            </div>
            <span className="text-sm font-medium text-blue-400">
              {pool.seniorTranche.apy}% APY
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-1.5 mb-2">
            <div
              className="bg-blue-400 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (pool.seniorTranche.funded / pool.seniorTranche.capacity) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${pool.seniorTranche.funded.toLocaleString()}</span>
            <span>${pool.seniorTranche.capacity.toLocaleString()}</span>
          </div>
        </div>

        {/* Junior Tranche */}
        <div className="p-4 rounded-lg border border-border/40 bg-muted/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <span className="text-sm font-medium">Junior</span>
            </div>
            <span className="text-sm font-medium text-purple-400">
              {pool.juniorTranche.apy}% APY
            </span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-1.5 mb-2">
            <div
              className="bg-purple-400 h-1.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (pool.juniorTranche.funded / pool.juniorTranche.capacity) * 100,
                  100,
                )}%`,
              }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>${pool.juniorTranche.funded.toLocaleString()}</span>
            <span>${pool.juniorTranche.capacity.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 pt-4 border-t border-border/40">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{pool.receivables.length} NFTs</span>
          <span>•</span>
          <span>Due {pool.maturityDate.toLocaleDateString()}</span>
        </div>
        <Link href={`/pools/${pool.id}`} className="w-full">
          <Button
            className="w-full bg-foreground text-background hover:opacity-90 transition-all font-medium group"
          >
            <span className="flex items-center justify-center gap-2">
              Invest Now
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}

function PoolStats({ stats, isLoading }: { stats: PoolStatsType; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-xl border border-border/40 bg-card/50 animate-pulse"
          >
            <div className="h-8 bg-muted/50 rounded mb-3"></div>
            <div className="h-4 bg-muted/30 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 fade-in-up">
      <div className="p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl hover:border-border transition-all hover:scale-[1.01]">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Total Pools
        </p>
        <p className="text-3xl font-semibold">{stats.totalPools}</p>
      </div>

      <div className="p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl hover:border-border transition-all hover:scale-[1.01]">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Total Value
        </p>
        <p className="text-3xl font-semibold">
          ${stats.totalValue.toLocaleString()}
        </p>
      </div>

      <div className="p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl hover:border-border transition-all hover:scale-[1.01]">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Senior Funding
        </p>
        <p className="text-3xl font-semibold">
          ${stats.seniorFunding.toLocaleString()}
        </p>
      </div>

      <div className="p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl hover:border-border transition-all hover:scale-[1.01]">
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          Junior Funding
        </p>
        <p className="text-3xl font-semibold">
          ${stats.juniorFunding.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default function PoolsPage() {
  const [pools, setPools] = useState<ReceivablePool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getAllPools } = useReceivablePool();

  // Scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement;
            element.classList.add('animate-in');
            element.style.opacity = '1';
            observer.unobserve(element);
          }
        });
      },
      { 
        threshold: 0.01,
        rootMargin: '150px'
      }
    );

    const observeElements = () => {
      const elements = document.querySelectorAll('.fade-in-up');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight + 150 && rect.bottom > -150;
        
        if (isInView && !element.classList.contains('animate-in')) {
          element.classList.add('animate-in');
          element.style.opacity = '1';
        } else {
          observer.observe(element);
        }
      });
    };

    setTimeout(observeElements, 50);
    
    const handleScroll = () => {
      const elements = document.querySelectorAll('.fade-in-up:not(.animate-in)');
      elements.forEach((el) => {
        const element = el as HTMLElement;
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight + 150 && rect.bottom > -150;
        
        if (isInView) {
          element.classList.add('animate-in');
          element.style.opacity = '1';
          observer.unobserve(element);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Load pools from blockchain
    const loadPools = async () => {
      try {
        // Try to fetch real pools from blockchain
        const poolEvents = await getAllPools();
        
        // For now, use mock data if no pools found
        if (poolEvents.data.length === 0) {
          loadMockPools();
          return;
        }
        
        // TODO: Parse pool events and fetch pool details
        // For hackathon, we'll use mock data
        loadMockPools();
      } catch (error) {
        console.error('Error loading pools:', error);
        loadMockPools();
      }
    };

    const loadMockPools = () => {
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
  }, [getAllPools]);

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
    <div className="relative min-h-screen">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center fade-in-up">
            <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-medium tracking-tight mb-4">
              Receivable Pools
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Browse and invest in tokenized receivable pools with transparent, blockchain-secured
              returns
            </p>
          </div>

          {/* Pool Statistics */}
          <PoolStats stats={stats} isLoading={isLoading} />

          {/* Active Pools */}
          <div className="mb-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4 fade-in-up">
              <h2 className="text-2xl font-medium">Available Pools</h2>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/40 hover:border-border hover:bg-muted/30"
                >
                  All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/40 hover:border-border hover:bg-muted/30"
                >
                  Funding
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border/40 hover:border-border hover:bg-muted/30"
                >
                  Active
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-xl border border-border/40 bg-card/50 animate-pulse"
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pools.map((pool, i) => (
                  <div key={pool.id} style={{ animationDelay: `${i * 50}ms` }}>
                    <PoolCard pool={pool} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Information Section */}
          <div className="mt-24 p-8 rounded-2xl border border-border/40 bg-card/50 backdrop-blur-xl fade-in-up">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-medium mb-2">How Investment Works</h3>
              <p className="text-muted-foreground">
                Choose your risk level and investment strategy
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-border/40 bg-muted/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  <h4 className="font-medium text-lg">Senior Tranche</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    <span>Lower risk, stable returns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    <span>Priority claim on receivables</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    <span>Typically 7-10% APY</span>
                  </li>
                </ul>
              </div>
              <div className="p-6 rounded-xl border border-border/40 bg-muted/10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  <h4 className="font-medium text-lg">Junior Tranche</h4>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    <span>Higher risk, higher returns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
                    <span>Subordinate claim</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-primary"></div>
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
