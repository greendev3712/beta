import { getContract } from 'src/utils';
import { useWeb3React } from '@web3-react/core';

const useSmartAchievement = () => {
  const { account, chainId } = useWeb3React();

  /**
   * Get User Nobility Info
   * @param userAccount 
   * @returns nobility info
   */
  const getNobilityOf = async (userAccount) => {
    const smtAchieveContract = await getContract('SmartNobilityAchievement', chainId);
    let nobilityOf = await smtAchieveContract.nobilityOf(userAccount);

    return nobilityOf;
  };

  /**
   * Get Nobility Title , User get
   * @param userAccount 
   * @returns title
   */
  const getNobilityTypeOf = async (userAccount) => {
    const smtAchieveContract = await getContract('SmartNobilityAchievement', chainId);
    let nobilityTitleOf = await smtAchieveContract.nobilityTitleOf(userAccount);

    return nobilityTitleOf;
  };

  return { getNobilityOf, getNobilityTypeOf, account };
};

export default useSmartAchievement;
