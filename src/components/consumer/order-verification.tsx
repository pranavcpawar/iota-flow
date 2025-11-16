'use client';

import { useState } from 'react';
import { SalesOrder } from '@/types';

interface OrderVerificationProps {
  order: SalesOrder;
  onApprove: (order: SalesOrder) => void;
  onReject: () => void;
  onScanAnother: () => void;
}

export function OrderVerification({
  order,
  onApprove,
  onReject,
  onScanAnother,
}: OrderVerificationProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleApprove = async () => {
    setIsProcessing(true);
    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));
    onApprove(order);
    setIsProcessing(false);
  };

  const getStatusDisplay = () => {
    switch (order.status) {
      case 'verified':
        return {
          text: 'Awaiting Your Approval',
          color: 'text-blue-600 bg-blue-50 border-blue-200',
        };
      case 'approved':
        return {
          text: 'Approved - Awaiting Merchant',
          color: 'text-green-600 bg-green-50 border-green-200',
        };
      default:
        return {
          text: order.status.toUpperCase(),
          color: 'text-gray-600 bg-gray-50 border-gray-200',
        };
    }
  };

  const statusDisplay = getStatusDisplay();

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="text-center mb-6">
        <div className="text-4xl mb-2">📋</div>
        <h2 className="text-xl font-semibold mb-2">Order Verification</h2>
        <div
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${statusDisplay.color}`}
        >
          {statusDisplay.text}
        </div>
      </div>

      <div className="bg-background border rounded-lg p-6 mb-6">
        <h3 className="font-semibold text-lg mb-4">Order Details</h3>

        <div className="grid gap-4">
          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Order ID:</span>
            <span className="font-mono text-sm">{order.orderId}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Merchant:</span>
            <span className="font-medium">{order.merchantId}</span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Amount:</span>
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(order.amount)} IOTA
            </span>
          </div>

          <div className="flex justify-between items-center py-2 border-b border-border">
            <span className="text-sm font-medium text-muted-foreground">Created:</span>
            <span className="text-sm">{formatDate(order.createDate)}</span>
          </div>

          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-medium text-muted-foreground">Due Date:</span>
            <span className="text-sm">{formatDate(order.dueDate)}</span>
          </div>
        </div>
      </div>

      {order.status === 'verified' && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">⚠️ Verify Order Details</h4>
            <p className="text-sm text-yellow-700">
              Please carefully review the order details above. Once you approve, the merchant will
              be notified and can proceed with confirmation.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onReject}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-colors"
            >
              ❌ Reject Order
            </button>
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-colors"
            >
              {isProcessing ? 'Processing...' : '✅ Approve Order'}
            </button>
          </div>
        </div>
      )}

      {order.status === 'approved' && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="text-2xl mb-2">✅</div>
            <h4 className="font-medium text-green-800 mb-2">Order Approved!</h4>
            <p className="text-sm text-green-700">
              Your approval has been sent to the merchant. They will confirm the order and mint an
              R-NFT for the receivable pool.
            </p>
          </div>

          <button
            onClick={onScanAnother}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors"
          >
            📱 Scan Another Order
          </button>
        </div>
      )}
    </div>
  );
}
