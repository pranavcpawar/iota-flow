'use client';

import { ReceivableNFT } from '@/types';

interface ReceivablePoolProps {
  receivables: ReceivableNFT[];
  isLoading: boolean;
  onReceivableUpdate: (receivables: ReceivableNFT[]) => void;
}

export function ReceivablePool({
  receivables,
  isLoading,
  onReceivableUpdate,
}: ReceivablePoolProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusColor = (status: ReceivableNFT['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'matured':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'defaulted':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDaysUntilDue = (dueDate: Date) => {
    const now = new Date();
    const diffTime = dueDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleClaimMatured = (tokenId: string) => {
    const updatedReceivables = receivables.map((nft) =>
      nft.tokenId === tokenId ? { ...nft, status: 'matured' as const } : nft,
    );
    onReceivableUpdate(updatedReceivables);
  };

  if (isLoading) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Receivable Pool</h2>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (receivables.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Receivable Pool</h2>
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🏦</div>
          <p className="text-muted-foreground">No R-NFTs in the pool yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            R-NFTs will appear here once orders are confirmed and minted
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Receivable Pool ({receivables.length})</h2>
        <button className="text-sm text-blue-600 hover:text-blue-800">Refresh Pool</button>
      </div>

      <div className="space-y-4">
        {receivables.map((nft) => {
          const daysUntilDue = getDaysUntilDue(nft.dueDate);

          return (
            <div key={nft.tokenId} className="border rounded-lg p-4 bg-background">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{nft.tokenId}</h3>
                  <p className="text-sm text-muted-foreground">Order: {nft.orderId}</p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                    nft.status,
                  )}`}
                >
                  {nft.status.toUpperCase()}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Value:</span>
                    <span className="text-sm font-bold text-green-600">
                      {formatCurrency(nft.amount)} IOTA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Merchant:</span>
                    <span className="text-sm">{nft.merchantId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Minted:</span>
                    <span className="text-sm">{formatDate(nft.mintDate)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Due Date:</span>
                    <span className="text-sm">{formatDate(nft.dueDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Days to Due:</span>
                    <span
                      className={`text-sm font-medium ${
                        daysUntilDue < 0
                          ? 'text-red-600'
                          : daysUntilDue <= 3
                          ? 'text-orange-600'
                          : 'text-green-600'
                      }`}
                    >
                      {daysUntilDue < 0
                        ? `${Math.abs(daysUntilDue)} days overdue`
                        : `${daysUntilDue} days`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons based on status */}
              <div className="flex gap-2 pt-3 border-t">
                {nft.status === 'active' && daysUntilDue <= 0 && (
                  <button
                    onClick={() => handleClaimMatured(nft.tokenId)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded text-sm transition-colors"
                  >
                    Mark as Matured
                  </button>
                )}

                {nft.status === 'matured' && (
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded text-sm transition-colors">
                    Claim Payment
                  </button>
                )}

                <button className="px-4 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
