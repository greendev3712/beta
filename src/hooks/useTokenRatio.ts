import { useWeb3React } from '@web3-react/core';
import { getContractObj, simpleProvider, getContract } from 'src/utils';
import { ethers, utils } from 'ethers';

const useTokenRatio = () => {
  const { chainId } = useWeb3React();
  // let smartCompInstance = getContractObj('SmartComp', chainId, simpleProvider);
  // let routerInstance = getContractObj('Router', chainId, simpleProvider);

  // SMT to BNB compare
  const fetchRatioBNB = async () => {
    let smartCompContract = await getContract('SmartComp', chainId);
    let routerContract = await getContract('Router', chainId);

    let swapAmount = ethers.utils.parseUnits('1', 18);
    let amountsOut = await routerContract.getAmountsOut(swapAmount.toString(), [
      await smartCompContract.getSMT(),
      await routerContract.WETH()
    ]);
    localStorage.setItem('SMTtoBNB', ethers.utils.formatEther(amountsOut[1]));
    return ethers.utils.formatEther(amountsOut[1]);
  };
  const fetchRatioBUSD = async () => {
    let smartCompContract = await getContract('SmartComp', chainId);
    let routerContract = await getContract('Router', chainId);

    let swapAmount = ethers.utils.parseUnits('1', 18);
    let amountsOut = await routerContract.getAmountsOut(swapAmount.toString(), [
      await smartCompContract.getSMT(),
      await smartCompContract.getBUSD()
    ]);
    localStorage.setItem('SMTtoBUSD', ethers.utils.formatEther(amountsOut[1]));
    return amountsOut[1];
  };

  return { fetchRatioBNB, fetchRatioBUSD };
};

export default useTokenRatio;
