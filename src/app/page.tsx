'use client';

import Link from 'next/link';

export default function Home() {
  const features = [
    {
      title: 'Merchant Portal',
      description: 'Create sales orders and generate QR codes for customer verification',
      icon: '🏪',
      href: '/merchant',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    },
    {
      title: 'Consumer Portal',
      description: 'Scan QR codes to verify and approve sales orders',
      icon: '📱',
      href: '/consumer',
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
    },
    {
      title: 'Receivable Pools',
      description:
        'Browse and invest in tokenized receivable pools with senior and junior tranches',
      icon: '🏦',
      href: '/pools',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    },
  ];

  const workflow = [
    {
      step: 1,
      title: 'Merchant creates sales order',
      description: 'Order details entered and QR code generated',
    },
    { step: 2, title: 'Customer scans/taps QR code', description: 'Order verification begins' },
    { step: 3, title: 'Customer approves order', description: 'Approval sent to merchant' },
    {
      step: 4,
      title: 'Merchant confirms order',
      description: 'Order confirmed and ready for minting',
    },
    { step: 5, title: 'R-NFT minted', description: 'Receivable NFT created on IOTA' },
    { step: 6, title: 'Deposited to pool', description: 'R-NFT added to receivable pool' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to IOTA Flow</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Streamlined receivables management powered by IOTA blockchain
          </p>
          <div className="bg-card border rounded-lg p-6 text-left max-w-4xl mx-auto">
            <h2 className="text-lg font-semibold mb-4">How it works:</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {workflow.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {features.map((feature, index) => (
            <Link
              key={index}
              href={feature.href}
              className={`block p-6 rounded-lg border transition-colors ${feature.color}`}
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">System Overview</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-sm text-muted-foreground">Active Orders</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-muted-foreground">Completed Orders</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-muted-foreground">R-NFTs Minted</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">0.00</div>
              <div className="text-sm text-muted-foreground">Total Pool Value</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
