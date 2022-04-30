import { useState, useEffect, useRef } from 'react';
import { Box, Typography } from '@mui/material';
import CustomCard from 'src/components/Card';
import CustomTitle from 'src/components/Title/BadgeTitle';
import { useWeb3React } from '@web3-react/core';
import useFarmHarvest from 'src/hooks/useFarmHarvest';
import useGoldenTree from 'src/hooks/useGoldenTree';
import { utils } from 'ethers';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';

const rewardImage = [
  {
    name: 'reward0',
    path: '/static/img/main_golden/reward0.svg',
    desc: 'reward0'
  },
  {
    name: 'reward1',
    path: '/static/img/main_golden/reward1.svg',
    desc: 'reward1'
  }
];

const RewardQualification = () => {
  const { account, chainId } = useWeb3React();
  const { fetchFarmUserInfo } = useFarmHarvest();
  const { fetchIsNobleLeader } = useGoldenTree();

  const [isFarm, setIsFarm] = useState<boolean>(false);
  const [isNobleLeader, setIsNobleLeader] = useState<boolean>(false);

  useEffect(() => {
    async function init() {
      let farmUserInfo = await fetchFarmUserInfo(account);
      let userStackedSmt = utils.formatEther(farmUserInfo.tokenBalance);
      if (Number(userStackedSmt) >= 100) setIsFarm(true);
      let nobleResult = await fetchIsNobleLeader(account);
      if (nobleResult) setIsNobleLeader(true);
    }
    if (account && chainId) init();

    return () => {
      setIsFarm(false);
      setIsNobleLeader(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <Box sx={{ paddingLeft: '20px', marginTop: '20px' }}>
      <CustomCard width="100%" height="328px" borderRadius="20px">
        <ColumnBox height="100%">
          <Typography
            variant="h2"
            marginTop="10px"
            marginLeft="20px"
            color="#E0A501"
            fontWeight="700"
          >
            Rewards Qualification
          </Typography>
          <Box position="absolute" bottom="0" width="100%">
            <CustomCard width="100%" height="269px" borderRadius="20px">
              <RowBox padding="20px 20px 30px 20px" height="100%">
                <ColumnBox width="160px" height="100%">
                  <Box
                    component="img"
                    alt={rewardImage[0].name}
                    src={rewardImage[0].path}
                    width="130px"
                    height="130px"
                  />
                  <Typography variant="h4">Farm ≥ 100 SMT</Typography>
                  <CustomTitle
                    width="80%"
                    height="30px"
                    background={isFarm ? '#E0A501' : '#5A5A5A'}
                    color="#212121"
                    title={isFarm ? 'Available' : 'Unavailable'}
                    fontSize="14px"
                    boxShadow="4px 4px 4px rgba(0, 0, 0, 0.25), inset -1px -3px 4px rgba(0, 0, 0, 0.25)"
                  />
                </ColumnBox>
                <ColumnBox width="160px" height="100%">
                  <Box
                    component="img"
                    alt={rewardImage[1].name}
                    src={rewardImage[1].path}
                    width="130px"
                    height="130px"
                  />
                  <Typography variant="h4" padding="0 30px" textAlign="center">
                    Achieve Nobility Title
                  </Typography>
                  <CustomTitle
                    width="80%"
                    height="30px"
                    background={isNobleLeader ? '#E0A501' : '#5A5A5A'}
                    color="#212121"
                    title={isNobleLeader ? 'Available' : 'Unavailable'}
                    fontSize="14px"
                    boxShadow="4px 4px 4px rgba(0, 0, 0, 0.25), inset -1px -3px 4px rgba(0, 0, 0, 0.25)"
                  />
                </ColumnBox>
              </RowBox>
            </CustomCard>
          </Box>
        </ColumnBox>
      </CustomCard>
    </Box>
  );
};

export default RewardQualification;
