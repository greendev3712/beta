import { useState, useEffect } from 'react';
import { utils } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import useSmartArmy from 'src/hooks/useSmartArmy';
import { convertMiliseconds } from 'src/utils/licenseInfo';

const useTimeCount = (limit: string) => {
  const { account, chainId } = useWeb3React();
  const [pastTime, setPastTime] = useState<string>('');
  const { fetchLicense } = useSmartArmy();

  useEffect(() => {
    let interval;
    async function init() {
      let licenseInfo = await fetchLicense(account);
      if (licenseInfo.status < 2) return;
      let dif = Date.now() - parseInt((licenseInfo.activeAt - 3600 * 48).toString() + '000');
      interval = setInterval(() => {
        // 1s = 1000 milis
        dif += 1000;
        if (limit) setPastTime(convertMiliseconds(dif, limit));
        else setPastTime(convertMiliseconds(dif));
      }, 1000);
    }
    if (account && chainId) init();
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return { pastTime };
};

export const useTimeDiscount = (limit: string) => {
  const { account, chainId } = useWeb3React();
  const { fetchLicense } = useSmartArmy();
  const [remain, setRemain] = useState<string>('');

  useEffect(() => {
    let interval;
    async function init() {
      let licenseInfo = await fetchLicense(account);
      if (licenseInfo.status < 2) return;
      let dif = parseInt(licenseInfo.expireAt.toString() + '000') - Date.now();
      interval = setInterval(() => {
        // 1s = 1000 milis
        dif -= 1000;
        if (limit) setRemain(convertMiliseconds(dif, limit));
        else setRemain(convertMiliseconds(dif));
      }, 1000);
    }
    if (account && chainId) init();
    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return { remain };
};

export default useTimeCount;
