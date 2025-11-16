'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@iota/dapp-kit';
import { QRScanner, OrderVerification } from '@/components/consumer';
import { SalesOrder } from '@/types';
import { useReceiptNFT } from '@/hooks';

function ConsumerDashboard() {
  const account = useCurrentAccount();
  const { queryReceiptMintedEvents } = useReceiptNFT();
  const [mintedNFTs, setMintedNFTs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMintedNFTs = async () => {
      if (!account?.address) {
        setIsLoading(false);
        return;
      }

      try {
        // Query all ReceiptMinted events
        const events = await queryReceiptMintedEvents();
        
        // Filter events where the consumer (tx sender) is the current user
        // Note: This is a simplified approach - in production, you'd track consumer addresses
        const userNFTs = events.data.slice(0, 5); // Show last 5 for now
        
        setMintedNFTs(userNFTs);
      } catch (error) {
        console.error('Error loading minted NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMintedNFTs();
  }, [account?.address, queryReceiptMintedEvents]);

  if (!account) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="mb-8 p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl animate-pulse">
        <div className="h-6 bg-muted/50 rounded mb-4"></div>
        <div className="h-4 bg-muted/30 rounded"></div>
      </div>
    );
  }

  if (mintedNFTs.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl">
        <h3 className="text-lg font-medium mb-4">Your Recent Approvals</h3>
        <div className="space-y-3">
          {mintedNFTs.map((event: any, i: number) => (
            <div
              key={i}
              className="p-3 rounded-lg border border-border/40 bg-muted/10 flex items-center justify-between"
            >
              <div>
                <div className="text-sm font-medium">
                  {(event.parsedJson?.receivable_amount / 1_000_000 || 0).toFixed(2)} IOTA
                </div>
                <div className="text-xs text-muted-foreground">
                  Merchant: {event.parsedJson?.merchant_id?.slice(0, 8)}...
                </div>
              </div>
              <div className="px-2 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                ✓ Approved
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

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
            <div>
              {/* Consumer Dashboard */}
              <ConsumerDashboard />
              
              <div className="text-center mt-8">
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
