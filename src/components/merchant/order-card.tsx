'use client';

import { SalesOrder } from '@/types';
import { QRCodeDisplay } from './qr-code-display';
import { OrderStatusTracker } from './order-status-tracker';

interface OrderCardProps {
  order: SalesOrder;
  onConfirm: () => void;
}

export function OrderCard({ order, onConfirm }: OrderCardProps) {
  // Note: Consumer mints the NFT, not the merchant
  // Merchant just displays order status and can add to pool

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusColor = (status: SalesOrder['status']) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'verified':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'approved':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'confirmed':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'minted':
        return 'text-indigo-600 bg-indigo-50 border-indigo-200';
      case 'deposited':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-background">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-lg">{order.orderId}</h3>
          <p className="text-sm text-muted-foreground">Merchant: {order.merchantId}</p>
        </div>
        <div
          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            order.status,
          )}`}
        >
          {order.status.toUpperCase()}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Amount:</span>
            <span className="text-sm">{order.amount} IOTA</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Created:</span>
            <span className="text-sm">{formatDate(order.createDate)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm font-medium">Due:</span>
            <span className="text-sm">{formatDate(order.dueDate)}</span>
          </div>
          {order.customerAddress && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Customer:</span>
              <span className="text-xs font-mono">
                {order.customerAddress.slice(0, 8)}...{order.customerAddress.slice(-8)}
              </span>
            </div>
          )}
        </div>

        {order.qrCode && (
          <div className="flex justify-center">
            <QRCodeDisplay data={order.qrCode} size={120} />
          </div>
        )}
      </div>

      <OrderStatusTracker order={order} />

      {order.status === 'approved' && (
        <div className="mt-4 pt-4 border-t">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-3">
            <div className="text-sm text-green-800 font-medium mb-1">✅ Customer Approved!</div>
            <p className="text-xs text-green-700">
              Receipt NFT has been minted by the customer. You can now add this to a receivable pool.
            </p>
            {order.nftTokenId && (
              <p className="text-xs text-green-600 mt-2 font-mono break-all">
                Tx: {order.nftTokenId}
              </p>
            )}
          </div>
          <button
            onClick={() => {
              // TODO: Navigate to pool creation or add to existing pool
              alert('Pool integration coming soon! For now, use the CLI to create pools.');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
          >
            Add to Receivable Pool
          </button>
        </div>
      )}

      {order.status === 'deposited' && order.nftTokenId && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm text-green-600 font-medium">✅ R-NFT Deposited to Pool</div>
          <div className="text-xs text-muted-foreground mt-1">Token ID: {order.nftTokenId}</div>
        </div>
      )}
    </div>
  );
}
