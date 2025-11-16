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

  return {
    mintReceiptNFT,
    getReceiptDetails,
  };
}

