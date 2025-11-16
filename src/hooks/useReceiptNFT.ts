/**
 * Hook for interacting with Receipt NFT contract
 */
import { useSignAndExecuteTransaction, useIotaClient } from '@iota/dapp-kit';
import { Transaction } from '@iota/iota-sdk/transactions';
import { MODULES } from '@/config/contracts';

export function useReceiptNFT() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const client = useIotaClient();

  const mintReceiptNFT = async (
    receivableAmount: number,
    currency: string,
    dueDate: number,
    customerHash: string,
    invoiceNumber: string,
    onSuccess?: (result: any) => void,
    onError?: (error: any) => void
  ) => {
    const tx = new Transaction();

    // Convert amount to micro units (IOTA uses 6 decimals)
    const amountInMicro = Math.floor(receivableAmount * 1_000_000);

    tx.moveCall({
      target: `${MODULES.RECEIPT_NFT}::mint_and_transfer`,
      arguments: [
        tx.pure.u64(amountInMicro),
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(currency))),
        tx.pure.u64(dueDate),
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(customerHash))),
        tx.pure.vector('u8', Array.from(new TextEncoder().encode(invoiceNumber))),
      ],
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log('Receipt NFT minted:', result);
          onSuccess?.(result);
        },
        onError: (error) => {
          console.error('Error minting Receipt NFT:', error);
          onError?.(error);
        },
      }
    );
  };

  const getReceiptDetails = async (receiptId: string) => {
    try {
      const object = await client.getObject({
        id: receiptId,
        options: {
          showContent: true,
          showOwner: true,
        },
      });
      return object;
    } catch (error) {
      console.error('Error fetching receipt details:', error);
      throw error;
    }
  };

  /**
   * Query for ReceiptMinted events
   * This allows merchants to detect when consumers mint NFTs
   */
  const queryReceiptMintedEvents = async (merchantAddress?: string) => {
    try {
      const events = await client.queryEvents({
        query: {
          MoveEventType: `${MODULES.RECEIPT_NFT}::ReceiptMinted`,
        },
        // Optional: filter by merchant address if provided
        // Note: IOTA SDK might not support filtering by event fields directly
      });
      return events;
    } catch (error) {
      console.error('Error querying ReceiptMinted events:', error);
      throw error;
    }
  };

  /**
   * Get all Receipt NFTs owned by an address
   * This is more reliable than events for detecting new NFTs
   */
  const getOwnedReceiptNFTs = async (ownerAddress: string) => {
    try {
      // Query for ReceiptMinted events filtered by merchant_id
      const events = await client.queryEvents({
        query: {
          MoveEventType: `${MODULES.RECEIPT_NFT}::ReceiptMinted`,
        },
      });

      // Filter events by merchant address and extract receipt IDs
      const merchantReceipts = events.data
        .filter((event: any) => {
          const parsedJson = event.parsedJson;
          return parsedJson?.merchant_id === ownerAddress;
        })
        .map((event: any) => ({
          receiptId: event.parsedJson?.receipt_id,
          merchantId: event.parsedJson?.merchant_id,
          receivableAmount: event.parsedJson?.receivable_amount,
          dueDate: event.parsedJson?.due_date,
          transactionDigest: event.id.txDigest,
        }));

      // For each receipt ID, fetch the full object to get invoice_number and check ownership
      const receiptObjects = await Promise.all(
        merchantReceipts.map(async (receipt) => {
          try {
            const object = await client.getObject({
              id: receipt.receiptId,
              options: {
                showContent: true,
                showOwner: true,
              },
            });
            
            // Check if merchant still owns this NFT (not in a pool)
            // If owner is the merchant address, it's available for pooling
            // If owner is a pool address, it's already in a pool
            const owner = object.data?.owner;
            const isOwnedByMerchant = 
              owner && 
              typeof owner === 'object' && 
              'AddressOwner' in owner &&
              owner.AddressOwner === ownerAddress;
            
            // Only return NFTs still owned by the merchant (not in pools)
            if (isOwnedByMerchant) {
              return {
                ...receipt,
                object,
              };
            }
            
            return null; // NFT is in a pool, don't include it
          } catch (error) {
            console.error(`Error fetching receipt ${receipt.receiptId}:`, error);
            return null;
          }
        })
      );

      return {
        data: receiptObjects.filter((obj) => obj !== null),
      };
    } catch (error) {
      console.error('Error fetching owned Receipt NFTs:', error);
      throw error;
    }
  };

  return {
    mintReceiptNFT,
    getReceiptDetails,
    queryReceiptMintedEvents,
    getOwnedReceiptNFTs,
  };
}

