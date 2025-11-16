/**
 * Hook for syncing order status with blockchain events
 * Polls for ReceiptMinted events and matches them to orders
 */
import { useEffect, useCallback } from 'react';
import { useIotaClient } from '@iota/dapp-kit';
import { useCurrentAccount } from '@iota/dapp-kit';
import { useReceiptNFT } from './useReceiptNFT';
import { SalesOrder } from '@/types';
import { MODULES } from '@/config/contracts';

interface UseOrderSyncOptions {
  orders: SalesOrder[];
  onOrderUpdate: (orders: SalesOrder[]) => void;
  enabled?: boolean;
  pollInterval?: number; // in milliseconds
}

export function useOrderSync({
  orders,
  onOrderUpdate,
  enabled = true,
  pollInterval = 5000, // Poll every 5 seconds
}: UseOrderSyncOptions) {
  const client = useIotaClient();
  const account = useCurrentAccount();
  const { getOwnedReceiptNFTs } = useReceiptNFT();

  const checkForNewNFTs = useCallback(async () => {
    if (!account?.address || !enabled) return;

    try {
      // Get all Receipt NFTs owned by the merchant
      const ownedNFTs = await getOwnedReceiptNFTs(account.address);

      // Match NFTs to orders by invoice_number (orderId)
      const updatedOrders = orders.map((order) => {
        // If order is already approved, skip
        if (order.status === 'approved' || order.nftTokenId) {
          return order;
        }

        // Find matching NFT by invoice_number
        const matchingNFT = ownedNFTs.data?.find((nftObj: any) => {
          const object = nftObj.object;
          if (!object) return false;
          
          const content = object.data?.content;
          if (!content || !content.fields) return false;

          // Check if invoice_number matches orderId
          const invoiceNumber = content.fields.invoice_number;
          return invoiceNumber === order.orderId;
        });

        if (matchingNFT) {
          // Found matching NFT! Update order status
          return {
            ...order,
            status: 'approved' as const,
            nftTokenId: matchingNFT.receiptId || matchingNFT.transactionDigest,
          };
        }

        return order;
      });

      // Check if any orders were updated
      const hasChanges = updatedOrders.some(
        (order, index) => order.status !== orders[index]?.status || order.nftTokenId !== orders[index]?.nftTokenId
      );

      if (hasChanges) {
        onOrderUpdate(updatedOrders);
      }
    } catch (error) {
      console.error('Error checking for new NFTs:', error);
    }
  }, [account?.address, orders, enabled, getOwnedReceiptNFTs, onOrderUpdate]);

  useEffect(() => {
    if (!enabled || !account?.address) return;

    // Initial check
    checkForNewNFTs();

    // Set up polling
    const interval = setInterval(() => {
      checkForNewNFTs();
    }, pollInterval);

    return () => {
      clearInterval(interval);
    };
  }, [checkForNewNFTs, enabled, account?.address, pollInterval]);

  return {
    checkForNewNFTs,
  };
}

