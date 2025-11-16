'use client';

interface PoolStatsData {
  totalValue: number;
  totalCount: number;
  activeCount: number;
  maturedCount: number;
  defaultedCount: number;
}

interface PoolStatsProps {
  stats: PoolStatsData;
  isLoading: boolean;
}

export function PoolStats({ stats, isLoading }: PoolStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const calculateUtilization = () => {
    if (stats.totalCount === 0) return 0;
    return Math.round((stats.activeCount / stats.totalCount) * 100);
  };

  if (isLoading) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Pool Statistics</h2>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Pool Value',
      value: `${formatCurrency(stats.totalValue)} IOTA`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total R-NFTs',
      value: stats.totalCount.toString(),
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
    {
      title: 'Active Receivables',
      value: stats.activeCount.toString(),
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    {
      title: 'Matured',
      value: stats.maturedCount.toString(),
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
    },
    {
      title: 'Pool Utilization',
      value: `${calculateUtilization()}%`,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
  ];

  return (
    <div className="bg-card border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-6">Pool Statistics</h2>

      <div className="space-y-4">
        {statCards.map((stat, index) => (
          <div key={index} className={`p-4 rounded-lg border ${stat.bgColor} ${stat.borderColor}`}>
            <div className="text-sm text-muted-foreground mb-1">{stat.title}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
          </div>
        ))}
      </div>

      {stats.totalCount > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-medium mb-3">Pool Health</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Active</span>
              <span>{Math.round((stats.activeCount / stats.totalCount) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${(stats.activeCount / stats.totalCount) * 100}%` }}
              />
            </div>

            <div className="flex justify-between text-sm">
              <span>Matured</span>
              <span>{Math.round((stats.maturedCount / stats.totalCount) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-orange-500 h-2 rounded-full"
                style={{ width: `${(stats.maturedCount / stats.totalCount) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
