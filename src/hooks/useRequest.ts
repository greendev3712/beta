import { useState } from 'react';
import axios from 'axios';
import { useWeb3React } from '@web3-react/core';
import { getContractAddress } from 'src/utils';

const useRequest = () => {
  const { chainId } = useWeb3React();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const apiKey = 'HHR9QFFQ1MXAKRQF5Z1QK5SVXRIC1ACFAI';
  let scanNet = '';
  if (chainId === 56) scanNet = 'https://api.bscscan.com/';
  else scanNet = 'https://api-testnet.bscscan.com/';
  let pancakeApi = 'https://api.pancakeswap.info/api/v2/tokens/';
  let binanceApi = 'https://api.binance.com/api/v3/ticker/price';

  async function fetchTransaction(userAddress: string) {
    let result = '';
    const smartBridgeAddress = getContractAddress('SMTBridge', chainId);
    try {
      // get normal transaction by address
      result = await axios.get(
        scanNet +
          'api?module=account&action=txlist&address=' +
          userAddress +
          '&sort=desc&apikey=' +
          apiKey
      );

      //get bep-20 token transaction by account and smart contract address
      // result = await axios.get(
      //   scanNet +
      //     'api?module=account&action=tokentx&from=' +
      //     smartBridgeAddress +
      //     '&address=' +
      //     userAddress +
      //     '&sort=desc&apikey=' +
      //     apiKey
      // );
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unexpected Error!');
    } finally {
      return result;
    }
  }

  /**
   * get token holders (now the apikey is not pro so this is not working)
   * @param tokenAddress
   * @returns
   */
  async function fetchTokenHolder(tokenAddress) {
    let result = '';
    try {
      if (chainId === 56) {
        result = await axios.get(
          scanNet +
            'api?module=token&action=tokenholderlist&contractaddress' +
            tokenAddress +
            '&apikey=' +
            apiKey
        );
      } else result = '0';
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unexpected Error!');
    } finally {
      return result;
    }
  }

  /**
   * get token(bnb) price
   */
  async function fetchBnbPrice() {
    let result = '';
    try {
      result = await axios.get(binanceApi + '?symbol=BNBBUSD');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unexpected Error!');
    } finally {
      return result['data']['price'];
    }
  }

  /**
   *
   * get busd token price
   * @returns
   */
  async function fetchBusdPrice() {
    const busdAddress = getContractAddress('BUSDToken', 56);
    let result = '';
    try {
      result = await axios.get(pancakeApi + '' + busdAddress);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unexpected Error!');
    } finally {
      return result['data']['data']['price'];
    }
  }

  /**
   * get transaction number of smt
   */
  async function fetchTokenTransactionNumber(tokenAddress) {
    let result = '';
    try {
      result = await axios.get(
        scanNet +
          'api?module=account&action=tokentx&contractaddress=' +
          tokenAddress +
          '&sort=desc&apikey=' +
          apiKey
      );
    } catch (err) {
      console.error(err);
      setError(err.message || 'Unexpected Error!');
    } finally {
      return result;
    }
  }

  /**
   * get transcation info from tx hash
   * Now it is not working well on free plan
   */
  async function fetchTransactionInfo(txHash) {
    // txlistinternal
    let result = '';
    try {
      result = await axios.get(
        scanNet +
          'api?module=account&action=txlistinternal&txhash=' +
          txHash +
          '&apikey=' +
          apiKey
      );
    } catch (err) {
      console.error(err);
    } finally {
      return result;
    }
  }

  return {
    fetchTransaction,
    fetchTokenHolder,
    fetchBnbPrice,
    fetchTokenTransactionNumber,
    fetchTransactionInfo,
    isLoading,
    fetchBusdPrice,
    error
  };
};

export default useRequest;
