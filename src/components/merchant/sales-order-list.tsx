'use client';

import { SalesOrder } from '@/types';
import { OrderCard } from './order-card';

interface SalesOrderListProps {
  orders: SalesOrder[];
  onOrderUpdate: (orders: SalesOrder[]) => void;
}

export function SalesOrderList({ orders, onOrderUpdate }: SalesOrderListProps) {
  const handleStatusUpdate = (orderId: string, newStatus: SalesOrder['status']) => {
    const updatedOrders = orders.map((order) =>
      order.orderId === orderId ? { ...order, status: newStatus } : order,
    );
    onOrderUpdate(updatedOrders);
  };

  const handleConfirmOrder = (orderId: string) => {
    handleStatusUpdate(orderId, 'confirmed');
    // Here you would typically integrate with IOTA to mint the R-NFT
    setTimeout(() => {
      handleStatusUpdate(orderId, 'minted');
      // Then deposit into receivable pool
      setTimeout(() => {
        handleStatusUpdate(orderId, 'deposited');
      }, 2000);
    }, 3000);
  };

  if (orders.length === 0) {
    return (
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Sales Orders</h2>
        <div className="text-center py-8">
          <p className="text-muted-foreground">No sales orders yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Create your first sales order to get started
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Sales Orders ({orders.length})</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <OrderCard
            key={order.orderId}
            order={order}
            onConfirm={() => handleConfirmOrder(order.orderId)}
          />
        ))}
      </div>
    </div>
  );
}
