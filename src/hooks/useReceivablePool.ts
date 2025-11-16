/**
 * Hook for interacting with Receivable Pool contract
 */
import { useSignAndExecuteTransaction, useIotaClient } from '@iota/dapp-kit';
import { Transaction } from '@iota/iota-sdk/transactions';
import { MODULES } from '@/config/contracts';

export function useReceivablePool() {
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const client = useIotaClient();

  const createPool = async (
    receiptIds: string[],
    onSuccess?: (result: any) => void,
    onError?: (error: any) => void
  ) => {
    const tx = new Transaction();

    // Transfer receipts and create pool
    tx.moveCall({
      target: `${MODULES.RECEIVABLE_POOL}::create_pool`,
      arguments: [
        tx.makeMoveVec({
          elements: receiptIds.map(id => tx.object(id)),
        }),
      ],
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log('Pool created:', result);
          onSuccess?.(result);
        },
        onError: (error) => {
          console.error('Error creating pool:', error);
          onError?.(error);
        },
      }
    );
  };

  const investSenior = async (
    poolId: string,
    amount: number,
    onSuccess?: (result: any) => void,
    onError?: (error: any) => void
  ) => {
    const tx = new Transaction();

    const [coin] = tx.splitCoins(tx.gas, [amount]);

    tx.moveCall({
      target: `${MODULES.RECEIVABLE_POOL}::invest_senior`,
      arguments: [
        tx.object(poolId),
        coin,
      ],
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log('Senior investment successful:', result);
          onSuccess?.(result);
        },
        onError: (error) => {
          console.error('Error investing in senior tranche:', error);
          onError?.(error);
        },
      }
    );
  };

  const investJunior = async (
    poolId: string,
    amount: number,
    onSuccess?: (result: any) => void,
    onError?: (error: any) => void
  ) => {
    const tx = new Transaction();

    const [coin] = tx.splitCoins(tx.gas, [amount]);

    tx.moveCall({
      target: `${MODULES.RECEIVABLE_POOL}::invest_junior`,
      arguments: [
        tx.object(poolId),
        coin,
      ],
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log('Junior investment successful:', result);
          onSuccess?.(result);
        },
        onError: (error) => {
          console.error('Error investing in junior tranche:', error);
          onError?.(error);
        },
      }
    );
  };

  const processRepayment = async (
    poolId: string,
    amount: number,
    onSuccess?: (result: any) => void,
    onError?: (error: any) => void
  ) => {
    const tx = new Transaction();

    const [coin] = tx.splitCoins(tx.gas, [amount]);

    tx.moveCall({
      target: `${MODULES.RECEIVABLE_POOL}::process_repayment`,
      arguments: [
        tx.object(poolId),
        coin,
      ],
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          console.log('Repayment processed:', result);
          onSuccess?.(result);
        },
        onError: (error) => {
          console.error('Error processing repayment:', error);
          onError?.(error);
        },
      }
    );
  };

  const getPoolDetails = async (poolId: string) => {
    try {
      const object = await client.getObject({
        id: poolId,
        options: {
          showContent: true,
          showOwner: true,
        },
      });
      return object;
    } catch (error) {
      console.error('Error fetching pool details:', error);
      throw error;
    }
  };

  const getAllPools = async () => {
    try {
      // Query all ReceivablePool objects via events
      const pools = await client.queryEvents({
        query: {
          MoveEventType: `${MODULES.RECEIVABLE_POOL}::PoolCreated`,
        },
      });
      return pools;
    } catch (error) {
      console.error('Error fetching pools:', error);
      throw error;
    }
  };

  return {
    createPool,
    investSenior,
    investJunior,
    processRepayment,
    getPoolDetails,
    getAllPools,
  };
}

