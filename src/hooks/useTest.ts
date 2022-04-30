import { utils } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import { getContract, getContractAddress } from 'src/utils';

const useTest = () => {
  const { account, chainId } = useWeb3React();

  async function getLicensedUsers() {
    const smartArmyContract = await getContract('SmartArmy', chainId);
    let result = smartArmyContract.licensedUsers();

    return result;
  }

  async function licensePortionOf(userAddress) {
    const smartArmyContract = await getContract('SmartArmy', chainId);
    let result = smartArmyContract.licensePortionOf(userAddress);
    return result;
  }

  async function currentUserSellTaxStatus(userAddress) {
    const smartArmyContract = await getContract(
      'SmartOtherAchievement',
      chainId
    );
    let result = smartArmyContract.rewardsInfoOf(userAddress);

    let status = result;
    return status;
  }

  async function getBNBOfFarmingPool() {
    const bnbContract = await getContract('WBNBToken', chainId);
    const smartFarmingAddress = getContractAddress('SmartFarm', chainId);

    let result = await bnbContract.balanceOf(smartFarmingAddress);
    return result;
  }

  async function getBNBOfOtherAch() {
    const bnbContract = await getContract('WBNBToken', chainId);
    const smartOtherAchAddress = getContractAddress(
      'SmartOtherAchievement',
      chainId
    );

    let result = await bnbContract.balanceOf(smartOtherAchAddress);
    return result;
  }

  async function getBNBOfNobilityAch() {
    const bnbContract = await getContract('WBNBToken', chainId);
    const smartOtherAchAddress = getContractAddress(
      'SmartNobilityAchievement',
      chainId
    );

    let result = await bnbContract.balanceOf(smartOtherAchAddress);
    return result;
  }

  async function getSmtArmyContractBalance() {
    const smtContract = await getContract('SmartToken', chainId);
    const smartArmyAddress = getContractAddress('SmartArmy', chainId);

    let balance = await smtContract.balanceOf(smartArmyAddress);
    return balance;
  }

  return {
    getLicensedUsers,
    licensePortionOf,
    currentUserSellTaxStatus,
    getBNBOfFarmingPool,
    getBNBOfOtherAch,
    getBNBOfNobilityAch,
    getSmtArmyContractBalance
  };
};

export default useTest;
