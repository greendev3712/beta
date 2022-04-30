import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { isAddress } from 'ethers/lib/utils';
import multicall from 'src/utils/multicall';
import smtAbi from 'src/updatedContracts/SmartToken.sol/SmartToken.json';
import {
  getContractAddress,
  getMulticallContract,
  getProvider
} from 'src/utils';

type SMTInfoState = {
  info: any;
  fetchStatus: FetchStatus;
};

export enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  SUCCESS = 'success',
  FAILED = 'failed',
  LOADING = 'loading'
}

const useSMTInfo = () => {
  const { NOT_FETCHED, SUCCESS, FAILED, LOADING } = FetchStatus;
  const { account, chainId } = useWeb3React();

  const [infoState, setInfoState] = useState<SMTInfoState>({
    info: {},
    fetchStatus: NOT_FETCHED
  });

  useEffect(() => {
    const fetchData = async () => {
      const smtAddress = getContractAddress('SmartToken', chainId);
      const provider = await getProvider();

      if (isAddress(smtAddress)) {
        const keys = [
          '_buyIntermediaryTaxFee',
          '_buyNormalTaxFee',
          '_sellIntermediaryTaxFee',
          '_sellNormalTaxFee',
          '_transferIntermediaryTaxFee',
          '_transferNormalTaxFee',
          '_buyReferralFee',
          '_buyGoldenPoolFee',
          '_buyDevFee',
          '_buyAchievementFee',
          '_sellDevFee',
          '_sellGoldenPoolFee',
          '_sellFarmingFee',
          '_sellBurnFee',
          '_sellAchievementFee',
          '_transferDevFee',
          '_transferAchievementFee',
          '_transferGoldenFee',
          '_transferFarmingFee'
        ];
        const calls = keys.map((key) => ({
          address: smtAddress,
          name: key,
          params: []
        }));
        const multicallAddress = getContractAddress('Multicall', chainId);
        if (!multicallAddress) {
          setInfoState((prev) => ({
            ...prev,
            fetchStatus: FAILED
          }));
          return;
        }
        const multicallContract = await getMulticallContract(chainId, provider);
        multicall(multicallContract, smtAbi.abi, calls)
          .then((res: any[]) => {
            let temp = {};
            for (let i = 0; i < keys.length; i++) {
              temp[keys[i]] = res[i]?.[0];
            }
            temp['emergency_tax'] =
              temp['_buyNormalTaxFee'].gt(15) ||
              temp['_sellNormalTaxFee'].gt(15) ||
              temp['_transferNormalTaxFee'].gt(15);
            setInfoState({
              info: temp,
              fetchStatus: SUCCESS
            });
          })
          .catch((e) => {
            console.error('fetch info error', e);
            setInfoState((prev) => ({
              ...prev,
              fetchStatus: FAILED
            }));
          });
      }
    };

    if (account && chainId) {
      setInfoState((prev) => ({
        ...prev,
        fetchStatus: LOADING
      }));
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return infoState;
};

export default useSMTInfo;
