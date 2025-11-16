'use client';

interface QRCodeDisplayProps {
  data: string;
  size?: number;
}

export function QRCodeDisplay({ data, size = 200 }: QRCodeDisplayProps) {
  // For now, we'll create a simple placeholder
  // In a real implementation, you'd use a QR code library like 'qrcode' or 'react-qr-code'

  return (
    <div className="bg-white p-4 rounded-lg border">
      <div className="text-center mb-2">
        <div className="text-xs text-muted-foreground">Scan to verify order</div>
      </div>
      <div
        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <div className="text-center">
          <div className="text-2xl mb-2">📱</div>
          <div className="text-xs text-gray-500">QR Code</div>
          <div className="text-xs text-gray-400 mt-1">{data.substring(0, 20)}...</div>
        </div>
      </div>
      <div className="text-center mt-2">
        <button
          className="text-xs text-blue-600 hover:text-blue-800"
          onClick={() => navigator.clipboard.writeText(data)}
        >
          Copy order data
        </button>
      </div>
    </div>
  );
}
