'use client';

import { useState } from 'react';

interface QRScannerProps {
  onScanSuccess: (data: string) => void;
  onCancel: () => void;
}

export function QRScanner({ onScanSuccess, onCancel }: QRScannerProps) {
  const [manualInput, setManualInput] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);

  // Mock QR scanning functionality
  const handleMockScan = () => {
    // Simulate scanning a QR code with sample order data
    const mockQRData = JSON.stringify({
      orderId: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      merchantId: 'MERCHANT-001',
      amount: 25.5,
      timestamp: Date.now(),
      protocol: 'iota-flow',
    });

    onScanSuccess(mockQRData);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onScanSuccess(manualInput.trim());
    }
  };

  return (
    <div className="bg-card border rounded-lg p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">QR Code Scanner</h2>
        <p className="text-muted-foreground">Position the QR code within the frame to scan</p>
      </div>

      {/* Mock camera view */}
      <div className="relative bg-gray-900 rounded-lg mb-6 overflow-hidden">
        <div className="aspect-square bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-white text-center">
            <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg flex items-center justify-center mb-4">
              <div className="text-4xl">📱</div>
            </div>
            <p className="text-sm opacity-75">Camera view (simulated)</p>
          </div>
        </div>

        {/* Scanning overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="w-56 h-56 border-2 border-green-400 rounded-lg relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-400 rounded-tl-lg"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-400 rounded-tr-lg"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-400 rounded-bl-lg"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-400 rounded-br-lg"></div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Mock scan button */}
        <button
          onClick={handleMockScan}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors"
        >
          🎯 Simulate QR Scan (Demo)
        </button>

        {/* Manual input toggle */}
        <button
          onClick={() => setShowManualInput(!showManualInput)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm"
        >
          {showManualInput ? 'Hide Manual Input' : 'Enter Order Data Manually'}
        </button>

        {showManualInput && (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <textarea
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="Paste order data here..."
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring h-24 text-sm font-mono"
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Process Order Data
            </button>
          </form>
        )}

        <button
          onClick={onCancel}
          className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
