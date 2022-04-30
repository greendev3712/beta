import { useWeb3React } from '@web3-react/core';
import { getContract } from 'src/utils';
import { utils } from 'ethers';

const useView = () => {
  const { chainId, library } = useWeb3React();

  async function fetchBNB() {
    const smartAchievement = await getContract('SmartOtherAchievement', chainId);
    let balance = await library.getBalance(smartAchievement.address);
    console.log('bnb balance ', utils.formatEther(balance));
  }

  async function fetchNobilityAchBNB() {
    const smartAchievement = await getContract('SmartNobilityAchievement', chainId);
    // let balance = await library.getBalance(smartAchievement.address);
    // console.log('nobility bnb ', utils.formatEther(balance));

    
    const smartBNBContract = await getContract('WBNBToken', chainId);
    let balance = await smartBNBContract.balanceOf(smartAchievement.address);
    console.log(utils.formatEther(balance));
    // const smartSmtContract = await getContract('SmartToken', chainId);
    // let smt = await smartSmtContract.balanceOf(smartAchievement.address);
    // console.log('smt balance ', utils.formatEther(smt));
  }

  async function fetchBUSD() {
    const smartGoldenTreePool = await getContract('GoldenTreePool', chainId);
    const busdContract = await getContract('BUSDToken', chainId);
    let balance = await busdContract.balanceOf(smartGoldenTreePool.address);
    console.log('busd balance ', utils.formatEther(balance));
  }

  return { fetchBNB, fetchBUSD, fetchNobilityAchBNB };
};

export default useView;
