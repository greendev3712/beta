import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { formatEther, parseEther } from 'ethers/lib/utils';
import multicall from '../utils/multicall';
import {
  getContractAddress,
  getMulticallContract,
  getProvider
} from 'src/utils';

type UserTokenPriceState = {
  prices: any;
  fetchStatus: FetchStatus;
};

export enum FetchStatus {
  NOT_FETCHED = 'not-fetched',
  SUCCESS = 'success',
  FAILED = 'failed',
  LOADING = 'loading'
}

const useTokenPrices = () => {
  const { NOT_FETCHED, SUCCESS, FAILED, LOADING } = FetchStatus;
  const { account, chainId } = useWeb3React();

  const [priceState, setPriceState] = useState<UserTokenPriceState>({
    prices: {},
    fetchStatus: NOT_FETCHED
  });

  useEffect(() => {
    const fetchBalance = async () => {
      const provider = await getProvider();
      const smtAddress = getContractAddress('SmartToken', chainId);
      const busdAddress = getContractAddress('BUSDToken', chainId);
      const routerAddress = getContractAddress('Router', chainId);
      const goldenTreePoolAddress = getContractAddress(
        'GoldenTreePool',
        chainId
      );

      if (smtAddress) {
        const calls = [
          {
            address: routerAddress,
            name: 'getAmountsOut',
            params: [parseEther('1'), [smtAddress, busdAddress]]
          },
          {
            address: goldenTreePoolAddress,
            name: 'thresholdPrice',
            params: []
          }
        ];
        const multicallAddress = getContractAddress('Multicall', chainId);
        if (!multicallAddress) {
          setPriceState((prev) => ({
            ...prev,
            fetchStatus: FAILED
          }));
          return;
        }
        const multicallContract = getMulticallContract(chainId, provider);

        const abi = [
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'amountIn',
                type: 'uint256'
              },
              {
                internalType: 'address[]',
                name: 'path',
                type: 'address[]'
              }
            ],
            name: 'getAmountsOut',
            outputs: [
              {
                internalType: 'uint256[]',
                name: 'amounts',
                type: 'uint256[]'
              }
            ],
            stateMutability: 'view',
            type: 'function'
          },
          {
            inputs: [],
            name: 'thresholdPrice',
            outputs: [
              {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
              }
            ],
            stateMutability: 'view',
            type: 'function'
          }
        ];

        multicall(multicallContract, abi, calls)
          .then((res: any[]) => {
            setPriceState((prev) => ({
              ...prev,
              prices: {
                smtbusd: formatEther(res[0][0][1]),
                smtc: formatEther(res[1][0])
              },
              fetchStatus: SUCCESS
            }));
          })
          .catch((e) => {
            console.error('fetch price error', e);
            setPriceState((prev) => ({
              ...prev,
              fetchStatus: FAILED
            }));
          });
      }
    };

    if (account && chainId) {
      setPriceState((prev) => ({
        ...prev,
        fetchStatus: LOADING
      }));
      fetchBalance();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return priceState;
};

export default useTokenPrices;
