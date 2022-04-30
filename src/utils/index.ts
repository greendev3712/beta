import { Contract } from '@ethersproject/contracts';
import { Provider } from '@ethersproject/abstract-provider';
import { BigNumber, ethers } from 'ethers';
import Web3Modal from 'web3modal';

import IBEP20ABI from 'src/updatedContracts/libs/IBEP20.sol/IBEP20.json';
import MulticallABI from 'src/contracts/abi/Multicall.json';
import SmartTokenCashABI from 'src/updatedContracts/SmartTokenCash.sol/SmartTokenCash.json';
import SMTBridgeABI from 'src/updatedContracts/SMTBridge.sol/SMTBridge.json';
import SmartCompABI from 'src/updatedContracts/SmartComp.sol/SmartComp.json';
import GoldenTreePoolABI from 'src/updatedContracts/GoldenTreePool.sol/GoldenTreePool.json';
import SmartNobilityAchievementABI from 'src/updatedContracts/SmartNobilityAchievement.sol/SmartNobilityAchievement.json';
import SmartOtherAchievementABI from 'src/updatedContracts/SmartOtherAchievement.sol/SmartOtherAchievement.json';
import SmartArmyABI from 'src/updatedContracts/SmartArmy.sol/SmartArmy.json';
import SmartFarmABI from 'src/updatedContracts/SmartFarm.sol/SmartFarm.json';
import SmartLadderABI from 'src/updatedContracts/SmartLadder.sol/SmartLadder.json';
import SmartTokenABI from 'src/updatedContracts/SmartToken.sol/SmartToken.json';
import IUniswapV2Router02ABI from 'src/updatedContracts/interfaces/IUniswapRouter.sol/IUniswapV2Router02.json';

export const Networks = {
  MainNet: 56,
  Testnet: 97
};

export const ALL_SUPPORTED_CHAIN_IDS: number[] = [
  Networks.MainNet,
  Networks.Testnet
];

interface ContractInfo {
  address: string;
  abi: any;
}

export const CONTRACTS_BY_NETWORK: {
  [key: number]: { [key: string]: ContractInfo };
} = {
  [Networks.MainNet]: {
    BUSDToken: {
      address: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      abi: IBEP20ABI.abi
    },
    SmartComp: {
      address: '0xF5a2F35c97cbfabd5ac9efAE4cC6cC021F6Bb19c',
      abi: SmartCompABI.abi
    },
    SMTBridge: {
      address: '0x93c2Cd7221f8930f4C7B1Cc146D6e24D73aAC694',
      abi: SMTBridgeABI.abi
    },
    GoldenTreePool: {
      address: '0x5Ee32C58766C288323b7de14F52b87ca4274fD55',
      abi: GoldenTreePoolABI.abi
    },
    SmartNobilityAchievement: {
      address: '0x37a0E7335Ede4859F86809433a6786d1B2FeA406',
      abi: SmartNobilityAchievementABI.abi
    },
    SmartOtherAchievement: {
      address: '0xaB7F3B06f132E028820071ec408ABCF9514BEFf5',
      abi: SmartOtherAchievementABI.abi
    },
    SmartArmy: {
      address: '0xd46F6e865B112223D62a97fF86ebd1c20be6cBA4',
      abi: SmartArmyABI.abi
    },
    SmartFarm: {
      address: '0xfEDF921A8A0535b966b2Dc13D2c4582E6CB8B383',
      abi: SmartFarmABI.abi
    },
    SmartLadder: {
      address: '0x5eA1eF3E7ecAABdC381F5866EB76202Ebcaf008D',
      abi: SmartLadderABI.abi
    },
    SmartTokenCash: {
      address: '0x6aedC09AE456651FccBBE357B57CA77A44f9da51',
      abi: SmartTokenCashABI.abi
    },
    SmartToken: {
      address: '0xf3F9B44b88CA47Ea583F6Fde50A8C853e3c09c28',
      abi: SmartTokenABI.abi
    },
    SMT_BNB_LP: {
      address: '0x2A5834B777Fe6e2a9830C04Ba7C215BBa649C8D3',
      abi: IBEP20ABI.abi
    },
    SMT_BUSD_LP: {
      address: '0xfbeC5B4878E6401522D98459FcF9B2E0bF8bbac5',
      abi: IBEP20ABI.abi
    },
    WBNBToken: {
      address: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      abi: IBEP20ABI.abi
    },
    Router: {
      address: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
      abi: IUniswapV2Router02ABI.abi
    },
    Multicall: {
      address: '0xfF6FD90A470Aaa0c1B8A54681746b07AcdFedc9B',
      abi: MulticallABI
    }
  },
  [Networks.Testnet]: {
    BUSDToken: {
      address: '0xF655fcF48c0f62d4Da945c8efAb50C6DcFEe0da8',
      abi: IBEP20ABI.abi
    },
    SmartComp: {
      address: '0x00805aBD8D711c1dBd1A67b1DB6c976e6414CC72',
      abi: SmartCompABI.abi
    },
    SMTBridge: {
      address: '0x8CAB5D338cD734876901b31D6888A7f9C9237B3F',
      abi: SMTBridgeABI.abi
    },
    GoldenTreePool: {
      address: '0x5B6adC100B73e2B91daf98DfD818428c1E4f890d',
      abi: GoldenTreePoolABI.abi
    },
    SmartNobilityAchievement: {
      address: '0xCEC4Aa68Aa69E6e3318426208842e30A9E6f6186',
      abi: SmartNobilityAchievementABI.abi
    },
    SmartOtherAchievement: {
      address: '0xa8E150A678A2eb74C893fD1110bBC222Ef1a5231',
      abi: SmartOtherAchievementABI.abi
    },
    SmartArmy: {
      address: '0xD6Fc21a62ACD7B514A6c89cA9d9E89A5d24d1656',
      abi: SmartArmyABI.abi
    },
    SmartFarm: {
      address: '0x47Cb6A839DF045d6663249828b9BD91976899CA4',
      abi: SmartFarmABI.abi
    },
    SmartLadder: {
      address: '0xA446a536Fd20569e879945fC04eef1569F698ae4',
      abi: SmartLadderABI.abi
    },
    SmartTokenCash: {
      address: '0x8ACD0e813e30a6b55cB27d974787F4AEaDB0B9a0',
      abi: SmartTokenCashABI.abi
    },
    SmartToken: {
      address: '0x1F498dB7Df03c6BCa6b05D198dF77dF21D7F9b69',
      abi: SmartTokenABI.abi
    },
    SMT_BNB_LP: {
      address: '0x8FAbB2158ec50c31571DEFD4B7A361D7fc319658',
      abi: IBEP20ABI.abi
    },
    SMT_BUSD_LP: {
      address: '0x432810b466E5Fb8Ed9f9df7496aD438EF0D71cC7',
      abi: IBEP20ABI.abi
    },
    WBNBToken: {
      address: '0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd',
      abi: IBEP20ABI.abi
    },
    Router: {
      address: '0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3',
      abi: IUniswapV2Router02ABI.abi
    },
    Multicall: {
      address: '0x8F3273Fb89B075b1645095ABaC6ed17B2d4Bc576',
      abi: MulticallABI
    }
  }
};

export const BIG_ZERO = BigNumber.from(0);
export const ZERO_ADDRESS = ethers.constants.AddressZero;

export const currentNetwork: number =
  parseInt(process.env.REACT_APP_NETWORK_ID || '') || 56;

export const simpleProvider: Provider = new ethers.providers.JsonRpcProvider(
  process.env.REACT_APP_NODE_1
);

export interface Currency {
  id: string;
  name: string;
  address: string;
  symbol: string;
  chainId: number;
  decimals: number;
  icon?: string;
  fullName?: string;
  projectName?: string;
  link?: string;
  category?: string;
  highlight?: boolean;
  disabled?: boolean;
  new?: boolean;
}

export const Currencies: { [key: number]: Currency[] } = {
  [Networks.MainNet]: [
    {
      id: 'binancecoin',
      name: 'BNB',
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'BNB',
      chainId: 56,
      decimals: 18,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/200x200/7009.png',
      fullName: 'Binance Coin',
      projectName: 'Binance',
      link: 'https://www.binance.com',
      category: 'BSC',
      highlight: true,
      disabled: false
    },
    {
      id: 'binance-usd',
      name: 'BUSD',
      address: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
      symbol: 'BUSD',
      chainId: 56,
      decimals: 18,
      icon: 'https://s2.coinmarketcap.com/static/img/coins/200x200/4687.png',
      fullName: 'Binance USD',
      projectName: 'Binance',
      link: 'https://www.binance.com',
      category: 'Stable coin',
      highlight: true,
      disabled: false
    }
  ],
  [Networks.Testnet]: [
    {
      id: 'binancecoin',
      name: 'BNB',
      address: '0x0000000000000000000000000000000000000000',
      symbol: 'BNB',
      chainId: 56,
      decimals: 18,
      icon: ''
    }
  ]
};

export function getCurrencyFromAddressOrId(idOrAddress: string) {
  const currencies = Currencies?.[currentNetwork];
  if (currencies && idOrAddress) {
    const currency = currencies.find(
      (item) =>
        item.id === idOrAddress ||
        item.address.toLowerCase() === idOrAddress.toLowerCase()
    );
    return currency;
  }
  return null;
}

export function getContractInfo(
  name: string,
  chainId: number | undefined = undefined
) {
  if (!chainId) chainId = currentNetwork;

  const contracts = CONTRACTS_BY_NETWORK?.[chainId];
  if (contracts) {
    return contracts?.[name];
  } else {
    return null;
  }
}

export function getContractAddress(
  name: string,
  chainId: number | undefined = undefined
) {
  if (!chainId) chainId = currentNetwork;

  const contracts = CONTRACTS_BY_NETWORK?.[chainId];
  if (contracts) {
    return contracts?.[name]?.address?.toLowerCase();
  } else {
    return null;
  }
}

export function getContractObj(
  name: string,
  chainId: number | undefined,
  provider: Provider | undefined
) {
  const info = getContractInfo(name, chainId);
  return info
    ? new Contract(info.address, info.abi, provider || simpleProvider)
    : null;
}

export function getCurrencyContractObj(
  idOrAddress: string,
  provider: Provider | undefined
) {
  const currency = getCurrencyFromAddressOrId(idOrAddress);
  if (
    !currency ||
    currency?.address === '0x0000000000000000000000000000000000000000'
  ) {
    return null;
  }
  return new Contract(currency.address, IBEP20ABI.abi, provider);
}

export function getMulticallContract(
  chainId: number | undefined,
  provider: Provider | undefined = undefined
) {
  const info = getContractInfo('Multicall', chainId);
  return info
    ? new Contract(info.address, info.abi, provider || simpleProvider)
    : null;
}

export const getProvider = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  return provider;
};

export const getSigner = async () => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  return signer;
};

export const getContract = async (
  name: string,
  chainId: number | undefined
) => {
  const web3Modal = new Web3Modal();
  const connection = await web3Modal.connect();
  const provider = new ethers.providers.Web3Provider(connection);
  const signer = provider.getSigner();
  const info = getContractInfo(name, chainId);
  return new ethers.Contract(info.address, info.abi, signer);
};

export function numberWithCommas(x: number) {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function letteredNumber(num: number) {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million
  } else if (num > 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'; // convert to M for number from > 1 million
  } else if (num > 1000000000000) {
    return (num / 1000000000000).toFixed(1) + 'T'; // convert to M for number from > 1 million
  } else if (num < 900) {
    return num; // if value < 1000, nothing to do
  }
}

export function replaceToNumber(value) {
  return value.replace(/[^0-9.]/g, '');
}

export const shorter = (str: string) =>
  str?.length > 8 ? str.slice(0, 6) + '...' + str.slice(-4) : str;

export const txShorter = (str: string) =>
  str?.length > 26 ? str.slice(0, 26) + '...' + str.slice(-4) : str;
