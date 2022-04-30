import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { ethers, utils } from 'ethers';
import { getContract, getContractAddress, simpleProvider } from 'src/utils';
import { formatDecimalNumber } from 'src/utils/formatBalance';
import { TRIAL, OPPORTUNIST, RUNNER, VISIONARY } from 'src/utils/licenseInfo';
import { toast } from 'react-hot-toast';

const useSmartArmy = () => {
  const { account, chainId } = useWeb3React();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /** exchange license */
  const exchangeLicense = async (
    userName,
    telegramId,
    sponsorAddress,
    licenseName,
    ipfsUri
  ) => {
    try {
      // set default license level
      let licenseLevel = 1;
      const smartArmyContract = await getContract('SmartArmy', chainId);
      // const smartTokenContract = await getContract('SmartToken', chainId);
      /** get user smt balance */

      // let userSMTBalance = await smartTokenContract.balanceOf(account);
      // let realUserSMTBalance = parseInt(ethers.utils.formatEther(userSMTBalance));
      switch (licenseName) {
        case TRIAL:
          licenseLevel = 1;
          break;
        case OPPORTUNIST:
          licenseLevel = 2;
          break;
        case RUNNER:
          licenseLevel = 3;
          break;
        case VISIONARY:
          licenseLevel = 4;
          break;
        default:
          licenseLevel = 1;
          break;
      }
      // let licenseType = await smartArmyContract.licenseTypes(licenseLevel);
      // let licensePrice = parseInt(ethers.utils.formatEther(licenseType.price));
      /** compare user wallet and price of license */
      let tx = await smartArmyContract.registerLicense(
        licenseLevel,
        sponsorAddress,
        userName,
        telegramId,
        ipfsUri
      );
      await tx.wait();
      console.log('register license transaction ', tx.hash);
      return true;
    } catch (err) {
      console.error(err);
      alert('there is no enough balance in your wallet');
      return false;
    }
  };

  /** activate license */
  const initActivate = async () => {
    setIsLoading(true);
    const smartArmyAddress = getContractAddress('SmartArmy', chainId);
    const smartArmyContract = await getContract('SmartArmy', chainId);
    const smartTokenContract = await getContract('SmartToken', chainId);
    let licenseInfo = await smartArmyContract.licenseOf(account);
    try {
      const licenseType = await smartArmyContract.licenseTypes(
        licenseInfo.level
      );
      let price = utils.formatEther(licenseType.price);
      let tokenTx = await smartTokenContract.approve(
        smartArmyAddress,
        Number(price)
      );
      await tokenTx.wait();
      console.log('token transaction ', tokenTx.hash);
      let tx = await smartArmyContract.activateLicense();
      await tx.wait();
      console.log('active transaction: ', tx.hash);
      return true;
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  /** extend license */
  const extendLicense = async () => {
    const provider = simpleProvider;
    const walletBalance = formatDecimalNumber(
      await provider.getBalance(account),
      18
    );
    const smartArmyContract = await getContract('SmartArmy', chainId);
    let feeInfo = await smartArmyContract.feeInfo();
    let feeBNB = formatDecimalNumber(feeInfo.extendFeeBNB, 18);
    if (Number(walletBalance) > Number(feeBNB)) {
      let tx = await smartArmyContract.extendLicense();
      await tx.wait();
      console.log('extend transaction ', tx.hash);
      return true;
    } else {
      return false;
    }
  };

  /** liquidate license */
  const liquidateLicense = async () => {
    const smartArmyContract = await getContract('SmartArmy', chainId);
    let tx = await smartArmyContract.liquidateLicense();
    await tx.wait();
    console.log('liquidate transaction ', tx.hash);
    return true;
  };

  /**
   * @function upgrade license
   * @process liquidate -> register -> activate
   * @return boolean(true)
   */
  const upgradeLicense = async (licenseName) => {
    setIsLoading(true);
    const smartArmyAddress = getContractAddress('SmartArmy', chainId);
    const smartArmyContract = await getContract('SmartArmy', chainId);
    const smartTokenContract = await getContract('SmartToken', chainId);

    let licenseLevel = 1;
    switch (licenseName) {
      case TRIAL:
        licenseLevel = 1;
        break;
      case OPPORTUNIST:
        licenseLevel = 2;
        break;
      case RUNNER:
        licenseLevel = 3;
        break;
      case VISIONARY:
        licenseLevel = 4;
        break;
      default:
        licenseLevel = 1;
        break;
    }

    const licenseType = await smartArmyContract.licenseTypes(licenseLevel);
    let price = ethers.utils.formatEther(licenseType.price);
    let tokenTx = await smartTokenContract.approve(
      smartArmyAddress,
      ethers.utils.parseUnits(Number(price).toString(), 18)
    );
    await tokenTx.wait();
    console.log('token transaction ', tokenTx.hash);
    let tx = await smartArmyContract.upgradeLicense(licenseLevel);
    await tx.wait();
    console.log('upgrade license tx ', tx.hash);
    setIsLoading(false);
  };

  /**
   * get licenseOf
   * @param account
   * @return license info
   * */
  const fetchLicense = async (userAccount) => {
    const smartArmyContract = await getContract('SmartArmy', chainId);
    let licenseInfo = await smartArmyContract.licenseOf(userAccount);
    return licenseInfo;
  };

  /**
   * get userInfo
   * @param account
   * @return user info from account
   * */
  const fetchUserInfo = async (userAccount) => {
    const smartArmyContract = await getContract('SmartArmy', chainId);
    let userInfo = await smartArmyContract.userInfo(userAccount);
    return userInfo;
  };

  /**
   * get licenseTypeOf
   * @param license level
   * @return license title
   * */
  const fetchLicenseType = async (licenseLevel) => {
    const smartArmyContract = await getContract('SmartArmy', chainId);
    let licenseTypeInfo = await smartArmyContract.licenseTypeOf(licenseLevel);
    return licenseTypeInfo;
  };

  return {
    exchangeLicense,
    initActivate,
    extendLicense,
    liquidateLicense,
    upgradeLicense,
    fetchLicense,
    fetchUserInfo,
    fetchLicenseType,
    isLoading,
    setIsLoading
  };
};

export default useSmartArmy;
