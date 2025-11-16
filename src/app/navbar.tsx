'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ConnectButton } from '@iota/dapp-kit';

export function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home' },
    { href: '/merchant', label: 'Merchant' },
    { href: '/consumer', label: 'Consumer' },
    { href: '/pools', label: 'Pools' },
  ];

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-6 h-6 rounded-md bg-foreground flex items-center justify-center transition-transform group-hover:scale-110">
              <div className="w-3 h-3 rounded-sm bg-background" />
            </div>
            <span className="font-medium text-sm">IOTA Flow</span>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-px bg-foreground" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <ConnectButton />
        </div>
      </nav>
    </header>
  );
}
