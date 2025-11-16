'use client';

import { useState } from 'react';
import { CreateSalesOrder, SalesOrderList } from '@/components/merchant';
import { SalesOrder } from '@/types';

export default function MerchantPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);

  const handleOrderCreated = (order: SalesOrder) => {
    setOrders((prev) => [order, ...prev]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Merchant Dashboard</h1>
          <p className="text-muted-foreground">Create and manage your sales orders</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Create Order Section */}
          <div className="space-y-6">
            <CreateSalesOrder onOrderCreated={handleOrderCreated} />
          </div>

          {/* Orders List Section */}
          <div className="space-y-6">
            <SalesOrderList orders={orders} onOrderUpdate={setOrders} />
          </div>
        </div>
      </div>
    </div>
  );
}
