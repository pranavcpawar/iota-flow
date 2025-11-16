'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@iota/dapp-kit';
import { useReceiptNFT, useReceivablePool } from '@/hooks';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function UserDashboard() {
  const account = useCurrentAccount();
  const { getOwnedReceiptNFTs } = useReceiptNFT();
  const { getAllPools } = useReceivablePool();
  
  const [nfts, setNfts] = useState<any[]>([]);
  const [pools, setPools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      if (!account?.address) {
        setIsLoading(false);
        return;
      }

      try {
        // Load user's Receipt NFTs
        const userNFTs = await getOwnedReceiptNFTs(account.address);
        setNfts(userNFTs.data || []);

        // Load all pools
        const allPools = await getAllPools();
        setPools(allPools.data || []);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, [account?.address, getOwnedReceiptNFTs, getAllPools]);

  if (!account) {
    return (
      <div className="text-center py-16 fade-in-up">
        <div className="text-6xl mb-4">🔐</div>
        <h3 className="text-2xl font-medium mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground mb-6">
          Connect your IOTA wallet to view your dashboard
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-6 rounded-xl border border-border/40 bg-card/50 animate-pulse"
          >
            <div className="h-6 bg-muted/50 rounded mb-4"></div>
            <div className="h-4 bg-muted/30 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const totalNFTs = nfts.length;
  const totalPools = pools.length;
  const totalValue = nfts.reduce((sum, nft) => sum + (nft.receivableAmount || 0), 0) / 1_000_000;

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 fade-in-up">
        <div className="p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl hover:border-border transition-all hover:scale-[1.01]">
          <div className="text-3xl font-semibold mb-2">{totalNFTs}</div>
          <div className="text-sm text-muted-foreground">Receipt NFTs Owned</div>
        </div>
        <div className="p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl hover:border-border transition-all hover:scale-[1.01]">
          <div className="text-3xl font-semibold mb-2">{totalValue.toFixed(2)}</div>
          <div className="text-sm text-muted-foreground">Total Value (IOTA)</div>
        </div>
        <div className="p-6 rounded-xl border border-border/40 bg-card/50 backdrop-blur-xl hover:border-border transition-all hover:scale-[1.01]">
          <div className="text-3xl font-semibold mb-2">{totalPools}</div>
          <div className="text-sm text-muted-foreground">Active Pools</div>
        </div>
      </div>

      {/* NFTs Section */}
      {totalNFTs > 0 && (
        <div className="fade-in-up">
          <h3 className="text-xl font-medium mb-4">Your Receipt NFTs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nfts.slice(0, 4).map((nft, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-border/40 bg-card/50 backdrop-blur-xl hover:border-border transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="text-sm font-mono text-muted-foreground">
                    {nft.receiptId?.slice(0, 8)}...{nft.receiptId?.slice(-6)}
                  </div>
                  <div className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                    Minted
                  </div>
                </div>
                <div className="text-lg font-semibold mb-1">
                  {(nft.receivableAmount / 1_000_000).toFixed(2)} IOTA
                </div>
                <div className="text-xs text-muted-foreground">
                  Due: {new Date(nft.dueDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          {totalNFTs > 4 && (
            <div className="text-center mt-4">
              <Link href="/merchant">
                <Button variant="outline" size="sm">
                  View All {totalNFTs} NFTs
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {totalNFTs === 0 && (
        <div className="text-center py-12 fade-in-up">
          <div className="text-5xl mb-4">📄</div>
          <h3 className="text-xl font-medium mb-2">No Receipt NFTs Yet</h3>
          <p className="text-muted-foreground mb-6">
            Start by creating a sales order or approving one as a consumer
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/merchant">
              <Button className="bg-foreground text-background hover:opacity-90">
                Create Order
              </Button>
            </Link>
            <Link href="/consumer">
              <Button variant="outline">
                Scan QR Code
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

