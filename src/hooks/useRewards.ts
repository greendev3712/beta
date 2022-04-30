import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { getContract } from 'src/utils';
import { utils } from 'ethers';
import { toast } from 'react-hot-toast';

const useRewards = () => {
  const { chainId } = useWeb3React();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * get nobility title
   * @param userAddress
   * @return title
   */
  const fetchNobilityTitle = async (userAddress) => {
    const smartAchievementContract = await getContract(
      'SmartNobilityAchievement',
      chainId
    );
    let title = await smartAchievementContract.nobilityTitleOf(userAddress);
    return title;
  };

  /**
   * get total portion
   * @return total portion
   */
  const fetchGolbalPortion = async () => {
    // const Contract = await getContract(
    //   'SmartAchievement',
    //   chainId
    // );
  };

  /**
   * get noble rewards of account
   * @param user address
   * @return noble reward amount
   */
  const fetchNobleRewardAmount = async (userAddress) => {
    const smartAchievementContract = await getContract(
      'SmartNobilityAchievement',
      chainId
    );
    let amount = await smartAchievementContract.rewardsInfoOf(userAddress);
    let result = 0;
    if (amount.nobleRewards.length === 0) {
      result = 0;
    } else {
      result = amount.nobleRewards;
    }

    return result;
  };

  /**
   * get farmer rewards of account
   * @param user address
   * @return farm reward amount
   */
  const fetchFarmerRewardAmount = async (userAddress) => {
    const smartAchievementContract = await getContract(
      'SmartOtherAchievement',
      chainId
    );
    let amount = await smartAchievementContract.rewardsInfoOf(userAddress);
    let result = 0;
    if (amount.farmRewards.length === 0) {
      result = amount.farmRewards;
    } else {
      result = 0;
    }

    return result;
  };

  /**
   * claim noble rewards
   * @param amount
   * @return no return
   */
  const claimNobleReward = async (amount) => {
    let amountIn = utils.parseUnits(Number(amount).toString(), 18);
    const smartAchievementContract = await getContract(
      'SmartNobilityAchievement',
      chainId
    );
    await smartAchievementContract.claimNobleReward(amountIn);
  };

  /**
   * claim farm rewards
   * @param amount
   * @return no return
   */
  const claimFarmReward = async (amount) => {
    let amountIn = utils.parseUnits(Number(amount).toString(), 18);
    const smartAchievementContract = await getContract(
      'SmartOtherAchievement',
      chainId
    );
    await smartAchievementContract.claimFarmReward(amountIn);
  };

  /**
   * get chest smt reward amount
   * @param userAddress
   * @return smt amount
   */
  const fetchChestSMTRewards = async (userAddress) => {
    const smartAchievementContract = await getContract(
      'SmartNobilityAchievement',
      chainId
    );

    let amount = await smartAchievementContract.rewardsInfoOf(userAddress);
    let result = 0;
    if (amount.chestRewards.length === 0) {
      result = 0;
    } else {
      result = amount.chestRewards[0];
    }

    return result;
  };
  /**
   * get chest smtc reward amount
   * @param userAddress
   * @return smtc amount
   */
  const fetchChestSMTCRewards = async (userAddress) => {
    const smartAchievementContract = await getContract(
      'SmartNobilityAchievement',
      chainId
    );

    let amount = await smartAchievementContract.rewardsInfoOf(userAddress);
    let result = 0;
    if (amount.chestRewards.length === 0) {
      result = 0;
    } else {
      result = amount.chestRewards[1];
    }

    return result;
  };
  /**
   * claim chest smt reward
   * @param amount
   * @returns no return
   */
  const claimChestSMTReward = async (amount) => {
    let amountIn = utils.parseUnits(Number(amount).toString(), 18);
    try {
      setIsLoading(true);
      const smartAchievementContract = await getContract(
        'SmartNobilityAchievement',
        chainId
      );
      await smartAchievementContract.claimChestSMTReward(amountIn);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      if(err.code === 4001) {
        toast.error(err.message);
      }
    }
  };
  /**
   * claim chest smtc reward
   * @param amount
   * @returns no return
   */
  const claimChestSMTCReward = async (amount) => {
    let amountIn = utils.parseUnits(Number(amount).toString(), 18);
    try {
      setIsLoading(true);
      const smartAchievementContract = await getContract(
        'SmartNobilityAchievement',
        chainId
      );
      await smartAchievementContract.claimChestSMTCReward(amountIn);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      if(err.code === 4001) {
        toast.error(err.message);
      }
    }
  };

  /**
   * get surprise smt rewards amount
   * @parma userAddress
   * @return smt amount
   */
  const fetchSurpriseSMTRewards = async (userAddress) => {
    const smartAchievementContract = await getContract(
      'SmartOtherAchievement',
      chainId
    );

    let amount = await smartAchievementContract.rewardsInfoOf(userAddress);
    let result = 0;
    if (amount.surprizeRewards.length === 0) {
      result = 0;
    } else {
      result = amount.surprizeRewards[0];
    }

    return result;
  };
  /**
   * get surprise smtc rewards amount
   * @param userAddress
   * @return smtc amount
   */
  const fetchSurpriseSMTCRewards = async (userAddress) => {
    const smartAchievementContract = await getContract(
      'SmartOtherAchievement',
      chainId
    );

    let amount = await smartAchievementContract.rewardsInfoOf(userAddress);
    let result = 0;
    if (amount.surprizeRewards.length === 0) {
      result = 0;
    } else {
      result = amount.surprizeRewards[1];
    }

    return result;
  };
  /**
   * claim surprise smt reward
   * @param amount
   * @returns no return
   */
  const claimSurpriseSMTReward = async (amount) => {
    let amountIn = utils.parseUnits(Number(amount).toString(), 18);
    try {
      setIsLoading(true);
      const smartAchievementContract = await getContract(
        'SmartOtherAchievement',
        chainId
      );
      await smartAchievementContract.claimSurprizeSMTReward(amountIn);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      if(err.code === 4001) {
        toast.error(err.message);
      }
    }
  };
  /**
   * claim surprise smtc reward
   * @param amount
   * @returns no return
   */
  const claimSurpriseSMTCReward = async (amount) => {
    let amountIn = utils.parseUnits(Number(amount).toString(), 18);
    try {
      setIsLoading(true);
      const smartAchievementContract = await getContract(
        'SmartOtherAchievement',
        chainId
      );
      await smartAchievementContract.claimSurprizeSMTCReward(amountIn);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
      if(err.code === 4001) {
        toast.error(err.message);
      }
    }
  };

  /**
   * get passive rewards amount
   * @param userAddress
   * @return passive rewards amount
   */
  const fetchPassiveRewardsAmount = async (userAddress) => {
    const smartAchievementContract = await getContract(
      'SmartNobilityAchievement',
      chainId
    );
    let amount = await smartAchievementContract.rewardsInfoOf(userAddress);

    return amount.passiveShareRewards;
  };

  /**
   * claim passive rewards
   * @param amount
   * @return no return
   */
  const claimPassiveReward = async (amount) => {
    let amountIn = utils.parseUnits(Number(amount).toString(), 18);
    const smartAchievementContract = await getContract(
      'SmartNobilityAchievement',
      chainId
    );
    await smartAchievementContract.claimReward(amountIn);
  };

  /**
   * get sell tax distribution info
   * @param user account
   * @return reward info of account
   */
  const fetchSellRewardsAmount = async (userAccount) => {
    const smartAchievementContract = await getContract(
      'SmartOtherAchievement',
      chainId
    );
    let result = await smartAchievementContract.rewardsInfoOf(userAccount);

    return result.sellTaxRewards;
  };
  /**
   * claim sell rewards
   * @param amount
   */
  const claimSellTaxReward = async (amount) => {
    let amountIn = utils.parseUnits(Number(amount).toString(), 18);
    const smartAchievementContract = await getContract(
      'SmartOtherAchievement',
      chainId
    );
    await smartAchievementContract.claimSellTaxReward(amountIn);
  };

  return {
    fetchNobilityTitle,
    fetchGolbalPortion,
    fetchNobleRewardAmount,
    fetchFarmerRewardAmount,
    claimNobleReward,
    claimFarmReward,
    fetchChestSMTRewards,
    fetchChestSMTCRewards,
    claimChestSMTReward,
    claimChestSMTCReward,
    fetchSurpriseSMTRewards,
    fetchSurpriseSMTCRewards,
    claimSurpriseSMTReward,
    claimSurpriseSMTCReward,
    fetchPassiveRewardsAmount,
    claimPassiveReward,
    fetchSellRewardsAmount,
    claimSellTaxReward,
    isLoading
  };
};

export default useRewards;
