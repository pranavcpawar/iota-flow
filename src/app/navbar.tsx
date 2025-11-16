'use client';

import Link from 'next/link';
import { ConnectButton } from '@iota/dapp-kit';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-b border-border/50">
      <nav className="w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-2xl flex items-center gap-3 group">
            <div className="w-8 h-8 bg-linear-to-r from-primary to-chart-1 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
              <span className="text-primary-foreground font-bold text-sm">IF</span>
            </div>
            <span className="bg-linear-to-r from-primary to-chart-1 bg-clip-text text-transparent">
              IOTA Flow
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/merchant"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 font-medium"
            >
              Merchant
            </Link>
            <Link
              href="/consumer"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 font-medium"
            >
              Consumer
            </Link>
            <Link
              href="/pools"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-lg transition-all duration-200 font-medium"
            >
              Pools
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
}
