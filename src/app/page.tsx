'use client';

export default function Home() {
  const workflow = [
    {
      step: 1,
      title: 'Merchant creates sales order',
      description: 'Order details entered and QR code generated',
      icon: '🏪',
    },
    {
      step: 2,
      title: 'Customer scans/taps QR code',
      description: 'Order verification begins',
      icon: '📱',
    },
    {
      step: 3,
      title: 'Customer approves order',
      description: 'Approval sent to merchant',
      icon: '✅',
    },
    {
      step: 4,
      title: 'Merchant confirms order',
      description: 'Order confirmed and ready for minting',
      icon: '✓',
    },
    { step: 5, title: 'R-NFT minted', description: 'Receivable NFT created on IOTA', icon: '🪙' },
    {
      step: 6,
      title: 'Deposited to pool',
      description: 'R-NFT added to receivable pool',
      icon: '💰',
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-background to-background/80">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold bg-linear-to-r from-primary to-chart-1 bg-clip-text text-transparent mb-6">
              Welcome to IOTA Flow
            </h1>
            <p className="text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Streamlined receivables management powered by IOTA blockchain technology
            </p>

            <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-2xl p-8 text-left max-w-5xl mx-auto backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-8 text-center text-foreground">How it works</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {workflow.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-xl bg-linear-to-br from-primary/5 to-chart-1/5 border border-primary/10 hover:border-primary/20 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-linear-to-r from-primary to-chart-1 text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold shrink-0 shadow-lg">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-2xl">{item.icon}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-linear-to-br from-card to-card/80 border border-border/50 rounded-2xl p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-8 text-center text-foreground">System Overview</h2>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-6 bg-linear-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
                <div className="text-4xl font-bold text-blue-400 mb-2">0</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  Active Orders
                </div>
              </div>
              <div className="text-center p-6 bg-linear-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                <div className="text-4xl font-bold text-emerald-400 mb-2">0</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  Completed Orders
                </div>
              </div>
              <div className="text-center p-6 bg-linear-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl hover:shadow-lg hover:shadow-purple-500/5 transition-all duration-300">
                <div className="text-4xl font-bold text-purple-400 mb-2">0</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  R-NFTs Minted
                </div>
              </div>
              <div className="text-center p-6 bg-linear-to-br from-orange-500/10 to-orange-600/5 border border-orange-500/20 rounded-xl hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300">
                <div className="text-4xl font-bold text-orange-400 mb-2">$0.00</div>
                <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                  Total Pool Value
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
