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
    <div className="min-h-screen bg-linear-to-br from-background to-background/80">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold bg-linear-to-r from-primary to-chart-1 bg-clip-text text-transparent mb-4">
              Consumer Portal
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Scan QR codes to verify and approve sales orders with blockchain security
            </p>
          </div>

          {!scannedOrder && !isScanning && (
            <div className="text-center">
              <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-2xl p-12 mb-8 backdrop-blur-sm">
                <div className="text-8xl mb-6">📱</div>
                <h2 className="text-3xl font-bold mb-4 text-foreground">Ready to Scan</h2>
                <p className="text-muted-foreground mb-8 text-lg leading-relaxed max-w-md mx-auto">
                  Tap the button below to start scanning a merchant&apos;s QR code
                </p>
                <button
                  onClick={() => setIsScanning(true)}
                  className="bg-linear-to-r from-primary to-chart-1 text-primary-foreground px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 text-lg font-semibold"
                >
                  Start QR Scanner
                </button>
              </div>

              <div className="bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-2xl p-8 backdrop-blur-sm">
                <h3 className="font-bold text-xl text-foreground mb-6 flex items-center gap-3 justify-center">
                  <span className="text-2xl">ℹ️</span>
                  How it works
                </h3>
                <ol className="text-muted-foreground space-y-4 text-left max-w-md mx-auto">
                  <li className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      1
                    </div>
                    <span>Scan the merchant&apos;s QR code</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      2
                    </div>
                    <span>Review the order details</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      3
                    </div>
                    <span>Approve or reject the order</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                      4
                    </div>
                    <span>Wait for merchant confirmation</span>
                  </li>
                </ol>
              </div>
            </div>
          )}

          {isScanning && (
            <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-2xl p-8 backdrop-blur-sm">
              <QRScanner onScanSuccess={handleOrderScanned} onCancel={() => setIsScanning(false)} />
            </div>
          )}

          {scannedOrder && (
            <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-2xl p-8 backdrop-blur-sm">
              <OrderVerification
                order={scannedOrder}
                onApprove={handleOrderApproved}
                onReject={() => setScannedOrder(null)}
                onScanAnother={handleScanAnother}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
