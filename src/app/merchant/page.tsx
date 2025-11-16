'use client';

import { useState } from 'react';
import { CreateSalesOrder, SalesOrderList } from '@/components/merchant';
import { CreatePoolModal } from '@/components/merchant/create-pool-modal';
import { SalesOrder } from '@/types';
import { useOrderSync } from '@/hooks/useOrderSync';
import { Button } from '@/components/ui/button';

export default function MerchantPage() {
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [isPoolModalOpen, setIsPoolModalOpen] = useState(false);

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

  const approvedOrders = orders.filter(o => o.status === 'approved');

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-background/80">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="text-center mb-6">
              <h1 className="text-5xl font-bold bg-linear-to-r from-primary to-chart-1 bg-clip-text text-transparent mb-4">
                Merchant Dashboard
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Create and manage your sales orders with blockchain-powered security
              </p>
            </div>
            
            {/* Pool Creation CTA */}
            {approvedOrders.length > 0 && (
              <div className="max-w-3xl mx-auto mt-6 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-emerald-700">
                      {approvedOrders.length} Approved Order{approvedOrders.length > 1 ? 's' : ''} Ready
                    </div>
                    <div className="text-sm text-emerald-600/80">
                      Create a pool to get instant liquidity
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsPoolModalOpen(true)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    Create Pool
                  </Button>
                </div>
              </div>
            )}
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
      
      {/* Pool Creation Modal */}
      <CreatePoolModal
        isOpen={isPoolModalOpen}
        onClose={() => setIsPoolModalOpen(false)}
        onSuccess={() => {
          // Optionally refresh orders or show success message
          alert('Pool created! Check the Pools page to see it.');
        }}
      />
    </div>
  );
}
