'use client';

import { SalesOrder, OrderStatusStep } from '@/types';

interface OrderStatusTrackerProps {
  order: SalesOrder;
}

export function OrderStatusTracker({ order }: OrderStatusTrackerProps) {
  const steps: OrderStatusStep[] = [
    {
      status: 'pending',
      label: 'Order Created',
      description: 'Sales order generated',
      completed:
        ['verified', 'approved', 'confirmed', 'minted', 'deposited'].includes(order.status) ||
        order.status === 'pending',
      current: order.status === 'pending',
    },
    {
      status: 'verified',
      label: 'Customer Scanned',
      description: 'QR code scanned/tapped',
      completed:
        ['approved', 'confirmed', 'minted', 'deposited'].includes(order.status) ||
        order.status === 'verified',
      current: order.status === 'verified',
    },
    {
      status: 'approved',
      label: 'NFT Minted',
      description: 'Customer minted Receipt NFT',
      completed:
        ['confirmed', 'minted', 'deposited'].includes(order.status) || order.status === 'approved',
      current: order.status === 'approved',
    },
    {
      status: 'confirmed',
      label: 'Added to Pool',
      description: 'NFT added to receivable pool',
      completed: ['minted', 'deposited'].includes(order.status) || order.status === 'confirmed',
      current: order.status === 'confirmed',
    },
    {
      status: 'minted',
      label: 'Pool Funded',
      description: 'Investors funded the pool',
      completed: order.status === 'deposited' || order.status === 'minted',
      current: order.status === 'minted',
    },
    {
      status: 'deposited',
      label: 'Funds Released',
      description: 'Merchant received advance',
      completed: order.status === 'deposited',
      current: order.status === 'deposited',
    },
  ];

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-3">Order Progress</h4>
      <div className="relative">
        {steps.map((step, index) => (
          <div key={step.status} className="flex items-start mb-4 last:mb-0">
            {/* Step indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                  step.completed
                    ? 'bg-green-100 text-green-800 border-2 border-green-300'
                    : step.current
                    ? 'bg-blue-100 text-blue-800 border-2 border-blue-300 animate-pulse'
                    : 'bg-gray-100 text-gray-400 border-2 border-gray-200'
                }`}
              >
                {step.completed ? '✓' : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-0.5 h-8 mt-1 ${step.completed ? 'bg-green-300' : 'bg-gray-200'}`}
                />
              )}
            </div>

            {/* Step content */}
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2">
                <h5
                  className={`text-sm font-medium ${
                    step.completed
                      ? 'text-green-800'
                      : step.current
                      ? 'text-blue-800'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </h5>
                {step.current && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Current
                  </span>
                )}
              </div>
              <p
                className={`text-xs mt-1 ${
                  step.completed || step.current ? 'text-gray-600' : 'text-gray-400'
                }`}
              >
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
