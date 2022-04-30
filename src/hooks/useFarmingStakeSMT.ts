import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getContract } from 'src/utils';
import { ethers } from 'ethers';
import { toast } from 'react-hot-toast';

export enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  SUCCESS = 'success',
  FAILED = 'failed',
  LOADING = 'loading'
}

const useFarmingStakeSMT = () => {
  const { account, chainId } = useWeb3React();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchAddSMT = async (amount) => {
    try {
      setIsLoading(true);
      let amountIn = ethers.utils.parseUnits(Number(amount).toString(), 18);
      const smtFarming = await getContract('SmartFarm', chainId);
      const smtContract = await getContract('SmartToken', chainId);
      let tx = await smtContract.approve(smtFarming.address, amountIn);
      await tx.wait();
      console.log('approved tx: ', tx.hash);

      tx = await smtFarming.stakeSMT(account, amountIn);
      await tx.wait();
      console.log('transaction tx: ', tx.hash);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.message);
      setIsLoading(false);
      return false;
    }
  };

  return { fetchAddSMT, isLoading };
};

export default useFarmingStakeSMT;
