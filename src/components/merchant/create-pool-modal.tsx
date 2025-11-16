'use client';

import { useState, useEffect } from 'react';
import { useCurrentAccount } from '@iota/dapp-kit';
import { useReceiptNFT, useReceivablePool } from '@/hooks';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface CreatePoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreatePoolModal({ isOpen, onClose, onSuccess }: CreatePoolModalProps) {
  const account = useCurrentAccount();
  const { getOwnedReceiptNFTs } = useReceiptNFT();
  const { createPool } = useReceivablePool();
  
  const [availableNFTs, setAvailableNFTs] = useState<any[]>([]);
  const [selectedNFTs, setSelectedNFTs] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const loadNFTs = async () => {
      if (!account?.address || !isOpen) return;

      try {
        // Only loads NFTs currently owned by the merchant
        // NFTs already in pools are transferred to the pool, so they won't appear here
        // This ensures each NFT can only be in one pool (enforced by blockchain ownership)
        const nfts = await getOwnedReceiptNFTs(account.address);
        setAvailableNFTs(nfts.data || []);
      } catch (error) {
        console.error('Error loading NFTs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadNFTs();
    }
  }, [account?.address, isOpen, getOwnedReceiptNFTs]);

  const toggleNFT = (nftId: string) => {
    const newSelected = new Set(selectedNFTs);
    if (newSelected.has(nftId)) {
      newSelected.delete(nftId);
    } else {
      newSelected.add(nftId);
    }
    setSelectedNFTs(newSelected);
  };

  const calculatePoolStats = () => {
    const selected = availableNFTs.filter(nft => selectedNFTs.has(nft.receiptId));
    const totalValue = selected.reduce((sum, nft) => sum + (nft.receivableAmount || 0), 0) / 1_000_000;
    const advance = totalValue * 0.8; // 80% LTV
    const seniorCapacity = advance * 0.75; // 75% of advance
    const juniorCapacity = advance * 0.25; // 25% of advance

    return {
      nftCount: selected.length,
      totalValue,
      advance,
      seniorCapacity,
      juniorCapacity,
    };
  };

  const handleCreatePool = async () => {
    if (selectedNFTs.size === 0) {
      alert('Please select at least one Receipt NFT');
      return;
    }

    setIsCreating(true);

    try {
      const nftIds = Array.from(selectedNFTs);
      
      await createPool(
        nftIds,
        (result) => {
          console.log('Pool created successfully:', result);
          alert('Pool created successfully! It will appear in the Pools page.');
          onSuccess?.();
          onClose();
          setIsCreating(false);
        },
        (error) => {
          console.error('Failed to create pool:', error);
          alert('Failed to create pool. Please try again.');
          setIsCreating(false);
        }
      );
    } catch (error) {
      console.error('Error creating pool:', error);
      alert('Error creating pool. Please try again.');
      setIsCreating(false);
    }
  };

  const stats = calculatePoolStats();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background rounded-xl border border-border/40 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border/40 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Create Receivable Pool</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select Receipt NFTs to pool together for funding
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Pool Stats Preview */}
          {selectedNFTs.size > 0 && (
            <div className="p-4 rounded-xl border border-border/40 bg-muted/20">
              <h3 className="font-medium mb-3">Pool Preview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <div className="text-xs text-muted-foreground">NFTs</div>
                  <div className="text-lg font-semibold">{stats.nftCount}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Total Value</div>
                  <div className="text-lg font-semibold">{stats.totalValue.toFixed(2)} IOTA</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Your Advance (80%)</div>
                  <div className="text-lg font-semibold text-emerald-600">{stats.advance.toFixed(2)} IOTA</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Funding Needed</div>
                  <div className="text-lg font-semibold">{stats.advance.toFixed(2)} IOTA</div>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/40 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Senior Tranche (75%):</span>
                  <span className="ml-2 font-medium">{stats.seniorCapacity.toFixed(2)} IOTA</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Junior Tranche (25%):</span>
                  <span className="ml-2 font-medium">{stats.juniorCapacity.toFixed(2)} IOTA</span>
                </div>
              </div>
            </div>
          )}

          {/* NFT Selection */}
          <div>
            <h3 className="font-medium mb-3">
              Select Receipt NFTs ({selectedNFTs.size} selected)
            </h3>
            
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 rounded-lg border border-border/40 animate-pulse">
                    <div className="h-4 bg-muted/50 rounded mb-2"></div>
                    <div className="h-3 bg-muted/30 rounded"></div>
                  </div>
                ))}
              </div>
            ) : availableNFTs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-4xl mb-2">📄</div>
                <p>No Receipt NFTs available</p>
                <p className="text-sm mt-1">Wait for customers to approve orders</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {availableNFTs.map((nft) => {
                  const isSelected = selectedNFTs.has(nft.receiptId);
                  const invoiceNumber = nft.object?.data?.content?.fields?.invoice_number || 'Unknown';
                  
                  return (
                    <div
                      key={nft.receiptId}
                      onClick={() => toggleNFT(nft.receiptId)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5'
                          : 'border-border/40 hover:border-border hover:bg-muted/20'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'border-primary bg-primary'
                                  : 'border-border/40'
                              }`}
                            >
                              {isSelected && (
                                <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div className="text-sm font-medium">
                              {(nft.receivableAmount / 1_000_000).toFixed(2)} IOTA
                            </div>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <div>Order: {invoiceNumber}</div>
                            <div>Due: {new Date(nft.dueDate).toLocaleDateString()}</div>
                            <div className="font-mono text-xs">
                              {nft.receiptId.slice(0, 8)}...{nft.receiptId.slice(-6)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-background border-t border-border/40 p-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedNFTs.size === 0 ? (
              'Select at least one NFT to create a pool'
            ) : (
              `${selectedNFTs.size} NFT${selectedNFTs.size > 1 ? 's' : ''} selected`
            )}
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreatePool}
              disabled={selectedNFTs.size === 0 || isCreating}
              className="bg-foreground text-background hover:opacity-90"
            >
              {isCreating ? 'Creating Pool...' : 'Create Pool'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

