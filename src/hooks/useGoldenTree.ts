import { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';
import { getContract } from 'src/utils';

const useGoldenTree = () => {
  const { chainId } = useWeb3React();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /** get smtc circulation */
  const fetchCirculation = async () => {
    // smtc in circulation = total supply - burned smtc
    const goldenTreeContract = await getContract('GoldenTreePool', chainId);
    const tokenCashContract = await getContract('SmartTokenCash', chainId);

    const totalSupply = await goldenTreeContract.smtcTotalSupply();
    const burnedAmount = await tokenCashContract.balanceOf(
      '0x000000000000000000000000000000000000dEaD'
    );

    return (
      Number(utils.formatEther(totalSupply)) -
      Number(utils.formatEther(burnedAmount))
    );
  };

  /** get threshold price of smtc */
  const fetchThreshold = async () => {
    const goldenTreeContract = await getContract('GoldenTreePool', chainId);
    const thresholdPrice = await goldenTreeContract.thresholdPrice();

    return thresholdPrice;
  };

  /** get growth token of account */
  const fetchGrowth = async (userAccount) => {
    const goldenTreeContract = await getContract('GoldenTreePool', chainId);
    let growthAmount = await goldenTreeContract.growthBalanceOf(userAccount);

    return growthAmount;
  };

  /** get global growth token */
  const fetchGlobalGrowth = async () => {
    const goldenTreeContract = await getContract('GoldenTreePool', chainId);
    let totalGrowth = await goldenTreeContract.currentTotalGrowth();

    return totalGrowth;
  };

  /**
   * get golden tree phase
   * @param
   * @returns golden tree phase
   */
  const fetchGoldenTreePhase = async () => {
    const goldenTreeContract = await getContract('GoldenTreePool', chainId);
    let treePhase = await goldenTreeContract.currentPhaseOfGoldenTree();

    return treePhase;
  };

  const fetchContributionOf = async (userAccount) => {
    const goldenTreeContract = await getContract('GoldenTreePool', chainId);
    let growthBalance = await goldenTreeContract.growthBalanceOf(userAccount);
    let totalGrowth = await goldenTreeContract.currentTotalGrowth();
    let percent =
      (Number(utils.formatEther(growthBalance)) * 100) /
      Number(utils.formatEther(totalGrowth));

    return percent.toFixed(2);
  };

  /** sell smtc */
  const sellSmtc = async (amount) => {
    try {
      setIsLoading(true);
      const smtcContract = await getContract('SmartTokenCash', chainId);
      const smtBridgeContract = await getContract('SMTBridge', chainId);
      const goldenTreeContract = await getContract('GoldenTreePool', chainId);

      let amountIn = utils.parseUnits(Number(amount).toString(), 18);

      let smtcTx = await smtcContract.approve(
        smtBridgeContract.address,
        amountIn
      );
      await smtcTx.wait();
      console.log('approved SMTtoBNB tx: ', smtcTx.hash);

      let tx = await goldenTreeContract.sellSmtc(amountIn);
      await tx.wait();
      console.log('sell smtc tx ', tx.hash);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  /**
   * get noble leader status
   * @param userAccount
   * @return boolean
   */
  const fetchIsNobleLeader = async (userAddress) => {
    const goldenTreeContract = await getContract(
      'SmartNobilityAchievement',
      chainId
    );
    let result = await goldenTreeContract.isNobleLeader(userAddress);

    return result;
  };

  return {
    fetchCirculation,
    fetchThreshold,
    fetchGrowth,
    fetchGlobalGrowth,
    sellSmtc,
    fetchGoldenTreePhase,
    fetchContributionOf,
    fetchIsNobleLeader,
    isLoading
  };
};

export default useGoldenTree;
