'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ReceivablePool, Tranche, Investment } from '@/types/pools';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';
import { useReceivablePool } from '@/hooks';

interface InvestmentFormProps {
  tranche: Tranche;
  poolId: string;
  onInvestment: (investment: Omit<Investment, 'id' | 'investmentDate' | 'status'>) => void;
}

function InvestmentForm({ tranche, poolId, onInvestment }: InvestmentFormProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { investSenior, investJunior } = useReceivablePool();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const investmentAmount = parseFloat(amount);
      if (investmentAmount < tranche.minInvestment) {
        alert(`Minimum investment for ${tranche.name} tranche is $${tranche.minInvestment}`);
        setIsLoading(false);
        return;
      }

      // Convert to micro units (IOTA uses 6 decimals)
      const amountInMicro = Math.floor(investmentAmount * 1_000_000);

      // Call the appropriate contract function
      const investFunction = tranche.id === 'senior' ? investSenior : investJunior;
      
      await investFunction(
        poolId,
        amountInMicro,
        (result) => {
          console.log('Investment successful:', result);
          
          const expectedReturn = investmentAmount * (1 + tranche.apy / 100);
          const investment = {
            investorAddress: '0x1234...5678', // This would come from connected wallet
            trancheId: tranche.id,
            poolId,
            amount: investmentAmount,
            expectedReturn,
          };

          onInvestment(investment);
          setAmount('');
          alert(`Successfully invested $${investmentAmount} in ${tranche.name} tranche!`);
          setIsLoading(false);
        },
        (error) => {
          console.error('Investment failed:', error);
          alert('Failed to process investment. Please try again.');
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error creating investment:', error);
      alert('Failed to create investment. Please try again.');
      setIsLoading(false);
    }
  };

  const fundingPercentage = (tranche.funded / tranche.capacity) * 100;

  return (
    <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-2xl p-8 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-4 h-4 rounded-full shadow-lg ${
              tranche.name === 'Senior'
                ? 'bg-linear-to-r from-blue-400 to-blue-500 shadow-blue-500/30'
                : 'bg-linear-to-r from-purple-400 to-purple-500 shadow-purple-500/30'
            }`}
          />
          <h3 className="text-2xl font-bold text-foreground">{tranche.name} Tranche</h3>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border">
          {tranche.riskLevel === 'Low' ? (
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          ) : (
            <TrendingUp className="w-4 h-4 text-orange-400" />
          )}
          <span
            className={`text-sm font-medium ${
              tranche.riskLevel === 'Low'
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-orange-400 bg-orange-500/10 border-orange-500/20'
            } px-2 py-0.5 rounded-full`}
          >
            {tranche.riskLevel} Risk
          </span>
        </div>
      </div>

      <p className="text-muted-foreground mb-6 leading-relaxed">{tranche.description}</p>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div
          className={`text-center p-6 rounded-xl border backdrop-blur-sm ${
            tranche.name === 'Senior'
              ? 'bg-linear-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20'
              : 'bg-linear-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20'
          }`}
        >
          <div
            className={`text-3xl font-bold mb-2 ${
              tranche.name === 'Senior' ? 'text-blue-400' : 'text-purple-400'
            }`}
          >
            {tranche.apy}%
          </div>
          <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
            APY
          </div>
        </div>
        <div className="text-center p-6 bg-linear-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl backdrop-blur-sm">
          <div className="text-3xl font-bold text-emerald-400 mb-2">
            ${tranche.minInvestment.toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
            Min Investment
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-3 font-medium">
          <span className="text-foreground">Funding Progress</span>
          <span className={tranche.name === 'Senior' ? 'text-blue-400' : 'text-purple-400'}>
            {fundingPercentage.toFixed(1)}%
          </span>
        </div>
        <div
          className={`w-full rounded-full h-3 ${
            tranche.name === 'Senior' ? 'bg-blue-900/20' : 'bg-purple-900/20'
          }`}
        >
          <div
            className={`h-3 rounded-full shadow-lg transition-all duration-300 ${
              tranche.name === 'Senior'
                ? 'bg-linear-to-r from-blue-400 to-blue-500 shadow-blue-500/30'
                : 'bg-linear-to-r from-purple-400 to-purple-500 shadow-purple-500/30'
            }`}
            style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs mt-2 font-medium">
          <span className={tranche.name === 'Senior' ? 'text-blue-300' : 'text-purple-300'}>
            ${tranche.funded.toLocaleString()}
          </span>
          <span className="text-muted-foreground">${tranche.capacity.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor={`amount-${tranche.id}`}
            className="block text-sm font-semibold text-foreground mb-3"
          >
            Investment Amount ($)
          </label>
          <input
            type="number"
            id={`amount-${tranche.id}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={tranche.minInvestment}
            step="0.01"
            placeholder={`Min $${tranche.minInvestment}`}
            className="w-full px-4 py-3 bg-input border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 text-foreground placeholder:text-muted-foreground"
            required
          />
        </div>

        {amount && parseFloat(amount) >= tranche.minInvestment && (
          <div
            className={`p-6 rounded-xl border backdrop-blur-sm ${
              tranche.name === 'Senior'
                ? 'bg-linear-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20'
                : 'bg-linear-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20'
            }`}
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Investment:</span>
                <span className="font-bold text-foreground">
                  ${parseFloat(amount).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Expected Return:</span>
                <span className="font-bold text-foreground">
                  ${(parseFloat(amount) * (1 + tranche.apy / 100)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border/50">
                <span className="font-semibold text-foreground">Profit:</span>
                <span className="font-bold text-emerald-400 text-lg">
                  +${(parseFloat(amount) * (tranche.apy / 100)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !amount || parseFloat(amount) < tranche.minInvestment}
          className={`w-full py-6 text-xl font-bold rounded-xl transition-all duration-300 shadow-2xl transform hover:scale-[1.02] disabled:hover:scale-100 disabled:opacity-50 ${
            tranche.name === 'Senior'
              ? 'bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/30 text-white'
              : 'bg-linear-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 hover:shadow-purple-500/30 text-white'
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">💰</span>
            <span>
              {isLoading ? 'Processing Investment...' : `Invest in ${tranche.name} Tranche`}
            </span>
            {!isLoading && <span className="text-lg">→</span>}
          </div>
        </Button>
      </form>
    </div>
  );
}

export default function PoolDetailPage() {
  const params = useParams();
  const poolId = params.poolId as string;
  const [pool, setPool] = useState<ReceivablePool | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate] = useState(() => new Date());

  useEffect(() => {
    // Mock data - in real app, this would fetch from API
    const loadPool = () => {
      const mockPool: ReceivablePool = {
        id: poolId,
        name: `Pool ${poolId.toUpperCase()}`,
        description: 'Diversified receivables pool with tokenized assets from verified merchants',
        totalValue: 157000,
        status: 'funding',
        createdAt: new Date('2024-11-05'),
        maturityDate: new Date('2024-12-20'),
        seniorTranche: {
          id: 'senior',
          name: 'Senior',
          description: 'Lower risk, stable returns with priority claim on receivables',
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
        receivables: [
          {
            tokenId: 'RNFT-001',
            orderId: 'ORD-2024-001',
            merchantId: 'MERCHANT-001',
            amount: 50000,
            mintDate: new Date('2024-11-01'),
            dueDate: new Date('2024-12-01'),
            status: 'active',
          },
          {
            tokenId: 'RNFT-002',
            orderId: 'ORD-2024-002',
            merchantId: 'MERCHANT-002',
            amount: 75000,
            mintDate: new Date('2024-11-03'),
            dueDate: new Date('2024-12-15'),
            status: 'active',
          },
          {
            tokenId: 'RNFT-003',
            orderId: 'ORD-2024-003',
            merchantId: 'MERCHANT-003',
            amount: 32000,
            mintDate: new Date('2024-11-05'),
            dueDate: new Date('2024-12-10'),
            status: 'active',
          },
        ],
      };

      setTimeout(() => {
        setPool(mockPool);
        setIsLoading(false);
      }, 500);
    };

    loadPool();
  }, [poolId]);

  const handleInvestment = (investment: Omit<Investment, 'id' | 'investmentDate' | 'status'>) => {
    const newInvestment: Investment = {
      ...investment,
      id: `inv-${Date.now()}`,
      investmentDate: new Date(),
      status: 'active',
    };

    setInvestments([...investments, newInvestment]);

    // Update pool funding
    if (pool) {
      const updatedPool = { ...pool };
      if (investment.trancheId === 'senior') {
        updatedPool.seniorTranche.funded += investment.amount;
        updatedPool.seniorTranche.currentTVL += investment.amount;
      } else {
        updatedPool.juniorTranche.funded += investment.amount;
        updatedPool.juniorTranche.currentTVL += investment.amount;
      }
      setPool(updatedPool);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background to-background/80">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-7xl mx-auto animate-pulse">
            <div className="h-8 bg-muted/50 rounded-xl w-1/4 mb-4"></div>
            <div className="h-4 bg-muted/30 rounded-xl w-1/2 mb-12"></div>
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="h-96 bg-linear-to-br from-card to-card/80 border border-border/50 rounded-2xl"></div>
              <div className="h-96 bg-linear-to-br from-card to-card/80 border border-border/50 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="min-h-screen bg-linear-to-br from-background to-background/80">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-2xl p-12 backdrop-blur-sm">
              <div className="text-6xl mb-6">🚫</div>
              <h1 className="text-4xl font-bold mb-4 text-foreground">Pool Not Found</h1>
              <p className="text-xl text-muted-foreground mb-8">
                The requested pool could not be found.
              </p>
              <Link href="/pools">
                <Button className="bg-linear-to-r from-primary to-chart-1 hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 px-8 py-3 text-lg">
                  Back to Pools
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const totalFunded = pool.seniorTranche.funded + pool.juniorTranche.funded;
  const totalCapacity = pool.seniorTranche.capacity + pool.juniorTranche.capacity;
  const overallProgress = (totalFunded / totalCapacity) * 100;

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-background/80">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/pools">
              <Button
                variant="outline"
                size="sm"
                className="bg-card/50 hover:bg-accent/50 border-border/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Pools
              </Button>
            </Link>
          </div>

          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold bg-linear-to-r from-primary to-chart-1 bg-clip-text text-transparent mb-4">
              {pool.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {pool.description}
            </p>
          </div>

          {/* Pool Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-2">
                    Total Value
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    ${pool.totalValue.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-linear-to-br from-blue-500/20 to-blue-600/10 rounded-lg">
                  <DollarSign className="w-8 h-8 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-2">
                    Total Funded
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    ${totalFunded.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 bg-linear-to-br from-emerald-500/20 to-emerald-600/10 rounded-lg">
                  <TrendingUp className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 hover:shadow-lg hover:shadow-chart-1/5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-2">
                    Progress
                  </p>
                  <p className="text-3xl font-bold text-foreground">
                    {overallProgress.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-linear-to-br from-chart-1/20 to-chart-2/10 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-linear-to-r from-chart-1 to-chart-2 flex items-center justify-center shadow-lg">
                    <div className="w-4 h-4 bg-primary-foreground rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-xl p-6 hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-2">
                    Receivables
                  </p>
                  <p className="text-3xl font-bold text-foreground">{pool.receivables.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Due: {pool.maturityDate.toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 bg-linear-to-br from-purple-500/20 to-purple-600/10 rounded-lg">
                  <div className="relative">
                    <Users className="w-8 h-8 text-purple-400" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Investment Forms */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 text-foreground">
              Investment Tranches
            </h2>
            <div className="grid lg:grid-cols-2 gap-8">
              <InvestmentForm
                tranche={pool.seniorTranche}
                poolId={pool.id}
                onInvestment={handleInvestment}
              />
              <InvestmentForm
                tranche={pool.juniorTranche}
                poolId={pool.id}
                onInvestment={handleInvestment}
              />
            </div>
          </div>

          {/* Receivables in Pool */}
          <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h3 className="text-3xl font-bold text-foreground flex items-center gap-4 mb-2">
                  <div className="p-3 bg-linear-to-r from-purple-500/20 to-blue-500/20 rounded-xl border border-purple-500/30">
                    <span className="text-3xl">🪙</span>
                  </div>
                  Receivable NFTs in Pool
                </h3>
                <p className="text-muted-foreground ml-16">
                  Tokenized receivables with blockchain verification
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 rounded-xl">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-emerald-300">
                    {pool.receivables.length} Active NFTs
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/20 rounded-xl">
                  <span className="text-blue-400 text-sm">📅</span>
                  <span className="text-sm font-medium text-blue-300">
                    Due: {pool.maturityDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {pool.receivables.map((receivable, index) => {
                const daysUntilDue = Math.ceil(
                  (receivable.dueDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24),
                );
                const isUrgent = daysUntilDue <= 7;

                return (
                  <div
                    key={receivable.tokenId}
                    className="bg-linear-to-br from-muted/5 to-muted/10 border border-border/40 rounded-2xl p-8 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
                  >
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 bg-linear-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-2xl flex items-center justify-center shadow-lg">
                            <span className="text-2xl font-bold text-purple-400">#{index + 1}</span>
                          </div>
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-linear-to-r from-emerald-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                            {receivable.tokenId}
                          </h4>
                          <p className="text-muted-foreground text-sm">
                            Order ID:{' '}
                            <span className="font-medium text-foreground">
                              {receivable.orderId}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-3xl font-bold text-foreground mb-2">
                          ${receivable.amount.toLocaleString()}
                        </div>
                        <div
                          className={`px-4 py-2 rounded-xl inline-flex items-center gap-2 font-semibold text-sm border ${
                            receivable.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                              : receivable.status === 'matured'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                              : 'bg-red-500/20 text-red-300 border-red-500/30'
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              receivable.status === 'active'
                                ? 'bg-emerald-400'
                                : receivable.status === 'matured'
                                ? 'bg-blue-400'
                                : 'bg-red-400'
                            }`}
                          ></div>
                          {receivable.status.toUpperCase()}
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                      <div className="bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-blue-400 text-sm">🏪</span>
                          </div>
                          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Merchant
                          </span>
                        </div>
                        <div className="font-bold text-foreground">{receivable.merchantId}</div>
                      </div>

                      <div className="bg-linear-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center">
                            <span className="text-orange-400 text-sm">📅</span>
                          </div>
                          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Minted
                          </span>
                        </div>
                        <div className="font-bold text-foreground">
                          {receivable.mintDate.toLocaleDateString()}
                        </div>
                      </div>

                      <div
                        className={`rounded-xl p-4 border ${
                          isUrgent
                            ? 'bg-linear-to-br from-red-500/10 to-red-600/5 border-red-500/20'
                            : 'bg-linear-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20'
                        }`}
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                              isUrgent ? 'bg-red-500/20' : 'bg-emerald-500/20'
                            }`}
                          >
                            <span
                              className={`text-sm ${
                                isUrgent ? 'text-red-400' : 'text-emerald-400'
                              }`}
                            >
                              ⏰
                            </span>
                          </div>
                          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                            Due Date
                          </span>
                        </div>
                        <div className="font-bold text-foreground">
                          {receivable.dueDate.toLocaleDateString()}
                        </div>
                        <div
                          className={`text-xs font-medium mt-1 ${
                            isUrgent ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        >
                          {daysUntilDue > 0 ? `${daysUntilDue} days remaining` : 'Overdue'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                      <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-chart-1/20 rounded border border-chart-1/30 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-chart-1 rounded-full"></div>
                          </div>
                          <span>Blockchain Verified</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-purple-500/20 rounded border border-purple-500/30 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          </div>
                          <span>Tokenized Asset</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button className="px-4 py-2 bg-linear-to-r from-primary/20 to-chart-1/20 border border-primary/30 text-primary hover:bg-primary/30 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-lg hover:shadow-primary/20">
                          View Details
                        </button>
                        <button className="px-4 py-2 bg-linear-to-r from-muted/20 to-muted/10 border border-border/30 text-muted-foreground hover:text-foreground hover:border-border/50 rounded-lg text-sm font-medium transition-all duration-200">
                          Export
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
