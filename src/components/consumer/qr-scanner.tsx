'use client';

import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  onScanSuccess: (data: string) => void;
  onCancel: () => void;
}

export function QRScanner({ onScanSuccess, onCancel }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isScanning && containerRef.current) {
      const html5QrCode = new Html5Qrcode(containerRef.current.id);
      scannerRef.current = html5QrCode;

      html5QrCode
        .start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
          },
          (decodedText) => {
            // Successfully scanned
            handleScanSuccess(decodedText);
          },
          (errorMessage) => {
            // Ignore scanning errors (they're frequent)
          }
        )
        .catch((err) => {
          setError('Failed to start camera. Please check permissions.');
          console.error('QR Scanner error:', err);
        });

      return () => {
        if (html5QrCode && html5QrCode.isScanning) {
          html5QrCode.stop().catch(console.error);
        }
      };
    }
  }, [isScanning]);

  const handleScanSuccess = (data: string) => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(console.error);
    }
    setIsScanning(false);
    onScanSuccess(data);
  };

  const startScanning = () => {
    setError(null);
    setIsScanning(true);
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(console.error);
    }
    setIsScanning(false);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim());
    }
  };

  return (
    <div className="p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl">
      <div className="text-center mb-6">
        <h2 className="text-xl font-medium mb-2">QR Code Scanner</h2>
        <p className="text-sm text-muted-foreground">Position the QR code within the frame to scan</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Camera view */}
      <div className="relative bg-black rounded-lg mb-6 overflow-hidden">
        <div
          id="qr-reader"
          ref={containerRef}
          className="w-full"
          style={{ minHeight: '300px' }}
        />
        {!isScanning && (
          <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-4xl mb-4">📱</div>
              <p className="text-sm opacity-75">Camera not active</p>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="w-full bg-foreground text-background hover:opacity-90 py-3 px-4 rounded-lg transition-all font-medium"
          >
            Start Camera & Scan
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors"
          >
            Stop Scanning
          </button>
        )}

        {/* Manual input toggle */}
        <button
          onClick={() => setShowManualInput(!showManualInput)}
          className="w-full border border-border/40 hover:border-border hover:bg-muted/30 py-2 px-4 rounded-lg transition-all text-sm"
        >
          {showManualInput ? 'Hide Manual Input' : 'Enter Order Data Manually'}
        </button>

        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder='Paste order data here (e.g., {"orderId":"ORD-123","merchantId":"MERCHANT-001","amount":100,"timestamp":1234567890,"protocol":"iota-flow"})'
              className="w-full px-3 py-2 border border-border/40 rounded-lg focus:outline-none focus:ring-2 focus:ring-ring bg-background text-foreground h-24 text-sm font-mono"
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="w-full bg-foreground text-background hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed py-2 px-4 rounded-lg transition-all text-sm font-medium"
            >
              Process Order Data
            </button>
          </form>
        )}

        <button
          onClick={onCancel}
          className="w-full border border-border/40 hover:border-border hover:bg-muted/30 py-2 px-4 rounded-lg transition-all text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
