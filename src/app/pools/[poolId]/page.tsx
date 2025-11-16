'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ReceivablePool, Tranche, Investment } from '@/types/pools';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';

interface InvestmentFormProps {
  tranche: Tranche;
  poolId: string;
  onInvestment: (investment: Omit<Investment, 'id' | 'investmentDate' | 'status'>) => void;
}

function InvestmentForm({ tranche, poolId, onInvestment }: InvestmentFormProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const investmentAmount = parseFloat(amount);
      if (investmentAmount < tranche.minInvestment) {
        alert(`Minimum investment for ${tranche.name} tranche is $${tranche.minInvestment}`);
        return;
      }

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
    } catch (error) {
      console.error('Error creating investment:', error);
      alert('Failed to create investment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fundingPercentage = (tranche.funded / tranche.capacity) * 100;

  return (
    <div className="bg-white rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`w-3 h-3 rounded-full ${
              tranche.name === 'Senior' ? 'bg-blue-500' : 'bg-purple-500'
            }`}
          />
          <h3 className="text-xl font-semibold">{tranche.name} Tranche</h3>
        </div>
        <div className="flex items-center gap-1 text-sm">
          {tranche.riskLevel === 'Low' ? (
            <TrendingDown className="w-4 h-4 text-green-500" />
          ) : (
            <TrendingUp className="w-4 h-4 text-red-500" />
          )}
          <span className={tranche.riskLevel === 'Low' ? 'text-green-600' : 'text-red-600'}>
            {tranche.riskLevel} Risk
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{tranche.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{tranche.apy}%</div>
          <div className="text-sm text-gray-600">APY</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            ${tranche.minInvestment.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Min Investment</div>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Funding Progress</span>
          <span>{fundingPercentage.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              tranche.name === 'Senior' ? 'bg-blue-500' : 'bg-purple-500'
            }`}
            style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>${tranche.funded.toLocaleString()}</span>
          <span>${tranche.capacity.toLocaleString()}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor={`amount-${tranche.id}`}
            className="block text-sm font-medium text-gray-700 mb-2"
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {amount && parseFloat(amount) >= tranche.minInvestment && (
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Investment:</span>
                <span>${parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Expected Return:</span>
                <span>${(parseFloat(amount) * (1 + tranche.apy / 100)).toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Profit:</span>
                <span className="text-green-600">
                  +${(parseFloat(amount) * (tranche.apy / 100)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !amount || parseFloat(amount) < tranche.minInvestment}
          className="w-full"
        >
          {isLoading ? 'Processing...' : `Invest in ${tranche.name} Tranche`}
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
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="h-96 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!pool) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Pool Not Found</h1>
          <p className="text-gray-600 mb-8">The requested pool could not be found.</p>
          <Link href="/pools">
            <Button>Back to Pools</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalFunded = pool.seniorTranche.funded + pool.juniorTranche.funded;
  const totalCapacity = pool.seniorTranche.capacity + pool.juniorTranche.capacity;
  const overallProgress = (totalFunded / totalCapacity) * 100;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/pools">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Pools
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{pool.name}</h1>
          <p className="text-gray-600">{pool.description}</p>
        </div>

        {/* Pool Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">${pool.totalValue.toLocaleString()}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Funded</p>
                <p className="text-2xl font-bold">${totalFunded.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold">{overallProgress.toFixed(1)}%</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Receivables</p>
                <p className="text-2xl font-bold">{pool.receivables.length}</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Investment Forms */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Investment Tranches</h2>
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
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Receivables in Pool</h3>
          <div className="space-y-4">
            {pool.receivables.map((receivable) => (
              <div
                key={receivable.tokenId}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div>
                  <div className="font-semibold">{receivable.tokenId}</div>
                  <div className="text-sm text-gray-600">
                    Merchant: {receivable.merchantId} | Due:{' '}
                    {receivable.dueDate.toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${receivable.amount.toLocaleString()}</div>
                  <div
                    className={`text-sm px-2 py-1 rounded-full inline-block ${
                      receivable.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : receivable.status === 'matured'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {receivable.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
