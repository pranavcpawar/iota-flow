'use client';

import QRCodeSVG from 'react-qr-code';

interface QRCodeDisplayProps {
  data: string;
  size?: number;
}

export function QRCodeDisplay({ data, size = 200 }: QRCodeDisplayProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-border/40">
      <div className="text-center mb-3">
        <div className="text-xs text-muted-foreground font-medium">Scan to verify order</div>
      </div>
      <div
        className="flex items-center justify-center bg-white rounded border border-border/20 p-2"
        style={{ width: size, height: size }}
      >
        <QRCodeSVG
          value={data}
          size={size - 16}
          level="M"
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          viewBox={`0 0 ${size - 16} ${size - 16}`}
        />
      </div>
      <div className="text-center mt-3">
        <button
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => {
            navigator.clipboard.writeText(data);
            // You could add a toast notification here
          }}
        >
          Copy order data
        </button>
      </div>
    </div>
  );
}
