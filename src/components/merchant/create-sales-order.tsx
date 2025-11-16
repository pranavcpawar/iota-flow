'use client';

import { useState } from 'react';
import { SalesOrder } from '@/types';

interface CreateSalesOrderProps {
  onOrderCreated: (order: SalesOrder) => void;
}

export function CreateSalesOrder({ onOrderCreated }: CreateSalesOrderProps) {
  const [formData, setFormData] = useState({
    merchantId: '',
    amount: '',
    dueDate: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const createDate = new Date();
      const dueDate = new Date(formData.dueDate);

      const newOrder: SalesOrder = {
        orderId,
        merchantId: formData.merchantId,
        amount: parseFloat(formData.amount),
        createDate,
        dueDate,
        status: 'pending',
        qrCode: generateQRCodeData(orderId, formData.merchantId, parseFloat(formData.amount)),
      };

      onOrderCreated(newOrder);

      // Reset form
      setFormData({
        merchantId: '',
        amount: '',
        dueDate: '',
      });
    } catch (error) {
      console.error('Error creating order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateQRCodeData = (orderId: string, merchantId: string, amount: number) => {
    return JSON.stringify({
      orderId,
      merchantId,
      amount,
      timestamp: Date.now(),
      protocol: 'iota-flow',
    });
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Create Sales Order</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="merchantId" className="block text-sm font-medium mb-1">
            Merchant ID
          </label>
          <input
            type="text"
            id="merchantId"
            value={formData.merchantId}
            onChange={(e) => setFormData((prev) => ({ ...prev, merchantId: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Enter merchant ID"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount (IOTA)
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="0.00"
            required
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
            Due Date
          </label>
          <input
            type="datetime-local"
            id="dueDate"
            value={formData.dueDate}
            onChange={(e) => setFormData((prev) => ({ ...prev, dueDate: e.target.value }))}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Creating Order...' : 'Create Sales Order'}
        </button>
      </form>
    </div>
  );
}
