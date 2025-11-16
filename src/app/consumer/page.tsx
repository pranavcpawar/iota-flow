'use client';

import { useState } from 'react';
import { QRScanner, OrderVerification } from '@/components/consumer';
import { SalesOrder } from '@/types';

export default function ConsumerPage() {
  const [scannedOrder, setScannedOrder] = useState<SalesOrder | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleOrderScanned = (orderData: string) => {
    try {
      const parsedData = JSON.parse(orderData);

      // Simulate fetching full order details from the parsed QR data
      const mockOrder: SalesOrder = {
        orderId: parsedData.orderId,
        merchantId: parsedData.merchantId,
        amount: parsedData.amount,
        createDate: new Date(parsedData.timestamp || Date.now()),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: 'verified',
        qrCode: orderData,
      };

      setScannedOrder(mockOrder);
      setIsScanning(false);
    } catch (error) {
      console.error('Invalid QR code data:', error);
      alert('Invalid QR code. Please scan a valid order QR code.');
    }
  };

  const handleOrderApproved = (order: SalesOrder) => {
    setScannedOrder({ ...order, status: 'approved' });
    // In a real app, you'd send this approval to the backend
    console.log('Order approved:', order.orderId);
  };

  const handleScanAnother = () => {
    setScannedOrder(null);
    setIsScanning(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Consumer Portal</h1>
          <p className="text-muted-foreground">Scan QR codes to verify and approve sales orders</p>
        </div>

        {!scannedOrder && !isScanning && (
          <div className="text-center">
            <div className="bg-card border rounded-lg p-8 mb-6">
              <div className="text-6xl mb-4">📱</div>
              <h2 className="text-xl font-semibold mb-2">Ready to Scan</h2>
              <p className="text-muted-foreground mb-6">
                Tap the button below to start scanning a merchant&apos;s QR code
              </p>
              <button
                onClick={() => setIsScanning(true)}
                className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Start QR Scanner
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
              <ol className="text-sm text-blue-800 space-y-1 text-left">
                <li>1. Scan the merchant&apos;s QR code</li>
                <li>2. Review the order details</li>
                <li>3. Approve or reject the order</li>
                <li>4. Wait for merchant confirmation</li>
              </ol>
            </div>
          </div>
        )}

        {isScanning && (
          <QRScanner onScanSuccess={handleOrderScanned} onCancel={() => setIsScanning(false)} />
        )}

        {scannedOrder && (
          <OrderVerification
            order={scannedOrder}
            onApprove={handleOrderApproved}
            onReject={() => setScannedOrder(null)}
            onScanAnother={handleScanAnother}
          />
        )}
      </div>
    </div>
  );
}
