'use client';

import { useState } from 'react';
import { CreateSalesOrder, SalesOrderList } from '@/components/merchant';
import { SalesOrder } from '@/types';
import { useOrderSync } from '@/hooks/useOrderSync';

export default function MerchantPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);

  const handleOrderCreated = (order: SalesOrder) => {
    setOrders((prev) => [order, ...prev]);
  };

  // Sync orders with blockchain - detects when consumer mints NFT
  useOrderSync({
    orders,
    onOrderUpdate: setOrders,
    enabled: true,
    pollInterval: 5000, // Check every 5 seconds
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-background/80">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold bg-linear-to-r from-primary to-chart-1 bg-clip-text text-transparent mb-4">
              Merchant Dashboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Create and manage your sales orders with blockchain-powered security
            </p>
          </div>

          <div className="grid lg:grid-cols-1 gap-12">
            {/* Create Order Section */}
            <div className="space-y-8 mx-auto max-w-3xl w-full">
              <CreateSalesOrder onOrderCreated={handleOrderCreated} />
            </div>

            {/* Orders List Section */}
            <div className="space-y-8 mx-auto max-w-3xl w-full">
              <SalesOrderList orders={orders} onOrderUpdate={setOrders} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
