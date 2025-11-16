'use client';

import Link from 'next/link';
import { ConnectButton } from '@iota/dapp-kit';

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <nav className="w-full px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl flex items-center gap-2">
            <span>Cascade Protocol</span>
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/merchant"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Merchant
            </Link>
            <Link
              href="/consumer"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Consumer
            </Link>
            <Link
              href="/pools"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
