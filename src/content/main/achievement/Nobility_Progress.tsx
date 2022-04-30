import React, { useState, useEffect } from 'react';
import { Box, Typography, Tooltip } from '@mui/material';
import NobilityTooltip from './Nobility_Tooltip';
import RowBox from 'src/components/Box/RowBox';
import CustomCard from 'src/components/Card';
import { BorderLinearProgress } from 'src/models/main/achievement/StyledStyle';
import { NobilityTitleArray } from 'src/models/main/achievement/SampleData';

import { useWeb3React } from '@web3-react/core';
import useGoldenTree from 'src/hooks/useGoldenTree';
import { utils } from 'ethers';

const maxImage = {
  name: 'maxImage',
  path: '/static/img/main_achievement/max.svg',
  desc: 'maxImage'
};

const NobilityProgress = ({ titles }) => {
  const { account, chainId } = useWeb3React();
  const { fetchGrowth } = useGoldenTree();

  const [nextTitleInfo, setNextTitleInfo] = useState(NobilityTitleArray[0]);
  const [curGrowth, setCurGrowth] = useState<string>('0');

  useEffect(() => {
    async function init() {
      let growthAmount = await fetchGrowth(account);
      setCurGrowth(parseFloat(utils.formatEther(growthAmount)).toFixed(4));
      let index = NobilityTitleArray.findIndex((row) => row.name === titles);
      let titleArray: any = [];
      if (index !== -1) {
        titleArray = NobilityTitleArray.find((row, idx) => idx === index + 1);
        setNextTitleInfo(titleArray);
      }
    }
    if (account && chainId) init();

    return () => {
      setCurGrowth('0');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, titles]);

  return (
    <RowBox height="60px" marginTop="20px">
      <CustomCard width="80%" height="100%">
        <BorderLinearProgress
          variant="determinate"
          value={(Number(curGrowth) / Number(nextTitleInfo?.require)) * 100}
        />
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          padding="3px 10px"
        >
          <Typography variant="h4" color="#E0A501">
            {Number(curGrowth)}
          </Typography>
          <Typography variant="h4">growth to achieve</Typography>
          <Typography variant="h4" color="#E0A501">
            {nextTitleInfo?.name}
          </Typography>
        </Box>
      </CustomCard>
      <Box width="60px" height="100%" position="relative">
        <Tooltip
          arrow
          title={<NobilityTooltip nextNobleInfo={nextTitleInfo} />}
          placement="right"
          componentsProps={{
            tooltip: {
              sx: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                background: 'linear-gradient(180deg, #212121 0%, #000000 100%)',
                borderRadius: '10px',
                width: '255px',
                height: '378px',
                padding: '20px',
                zIndex: '9999'
              }
            }
          }}
        >
          <Box
            component="img"
            src={maxImage.path}
            alt={maxImage.name}
            width="100%"
            height="100%"
          />
        </Tooltip>
      </Box>
    </RowBox>
  );
};

export default NobilityProgress;
