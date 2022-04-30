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

const useFarmHarvest = () => {
  const { account, chainId } = useWeb3React();

  /**
   * Claim rewards
   * @param amount
   * @returns
   */
  const fetchHarvest = async (amount) => {
    let amountIn = ethers.utils.parseUnits(Number(amount).toString(), 18);
    const smtFarming = await getContract('SmartFarm', chainId);
    let rewards = await smtFarming.earned(account);
    rewards = ethers.utils.formatEther(rewards);
    if (amount <= rewards) {
      let tx = await smtFarming.claimReward(amountIn);
      await tx.wait();
      console.log('transaction tx: ', tx.hash);
      return true;
    } else {
      toast.error('There is no enough reward amount to harvest');
      return false;
    }
  };

  /**
   * Get Current Farming Supply
   * @param
   * @returns Current Farming supply
   */
  const fetchCurrentFarmingSupply = async () => {
    const smtFarming = await getContract('SmartFarm', chainId);
    const smtContract = await getContract('SmartToken', chainId);
    const amount = await smtContract.balanceOf(smtFarming.address);

    return amount;
  };

  /**
   * @param userAccount
   * @returns earnedPassive amount
   */
  const fetchEarnedPassive = async (userAccount) => {
    const smartFarmContract = await getContract('SmartFarm', chainId);
    let result = await smartFarmContract.earnedPassive(userAccount);
    return result;
  };

  /**
   *
   * @param userAccount
   * @returns earned amount
   */
  const fetchEarned = async (userAccount) => {
    const smartFarmContract = await getContract('SmartFarm', chainId);
    let result = await smartFarmContract.earned(userAccount);
    return result;
  };

  /**
   * get user info in the farm
   * @param user account
   * @return userInfo
   */
  const fetchFarmUserInfo = async (userAccount) => {
    const smartFarmContract = await getContract('SmartFarm', chainId);
    let farmuUserInfo = await smartFarmContract.userInfoOf(userAccount);

    return farmuUserInfo;
  };

  return {
    fetchHarvest,
    fetchFarmUserInfo,
    fetchEarned,
    fetchEarnedPassive,
    fetchCurrentFarmingSupply
  };
};

export default useFarmHarvest;
