import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography } from '@mui/material';

import TreePhase from './TreePhase';
import TreeReward from './TreeReward';
import TreeLearn from './TreeLearn';

import { treeSectionStyle } from 'src/models/main/golden-tree/CustomStyle';
import { phaseInfo } from 'src/models/main/golden-tree/SampleData';
import { BorderLinearProgress } from 'src/models/StyledData';

import { useWeb3React } from '@web3-react/core';
import useGoldenTree from 'src/hooks/useGoldenTree';
import { utils } from 'ethers';

const maxImage = {
  name: 'maxImage',
  path: '/static/img/main_golden/max.svg',
  desc: 'maxBackground'
};

const TreeSection = () => {
  const classes = treeSectionStyle();
  const { account, chainId } = useWeb3React();
  const { fetchGoldenTreePhase, fetchGlobalGrowth } = useGoldenTree();

  const [phase, setPhase] = useState<number>(0);
  const [growth, setGrowth] = useState<string>('0');

  useEffect(() => {
    async function init() {
      let result = await fetchGoldenTreePhase();
      setPhase(result.toString());
      let globalGrowth = await fetchGlobalGrowth();
      setGrowth(parseFloat(utils.formatEther(globalGrowth)).toFixed(4));
    }
    if (account && chainId) init();

    return () => {
      setPhase(0);
      setGrowth('0');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <>
      <Grid item xs={12}>
        <Box
          height="60px"
          marginTop="20px"
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
        >
          <Box
            sx={{
              maxWidth: '800px',
              width: '80%',
              height: '100%',
              background: 'linear-gradient(180deg, #212121 0%, #000000 100%)',
              border: '2px solid #323232',
              borderRadius: '14px'
            }}
          >
            <BorderLinearProgress
              variant="determinate"
              value={(Number(growth) / Number(phaseInfo[phase].require)) * 100}
            />
            <Box display="flex" justifyContent="space-between" padding="0 10px">
              <Typography className={classes.progressTitleStyle}>
                {phaseInfo[phase].phase}
              </Typography>
              <Typography className={classes.progressTitleStyle}>
                {phaseInfo[phase].status}
              </Typography>
            </Box>
          </Box>
          <Box width="80px" height="100%" position="relative">
            <Box component="img" src={maxImage.path} alt={maxImage.name} />
            <Typography
              variant="h2"
              sx={{
                position: 'absolute',
                color: '#212121',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              {phaseInfo[phase].buttonPhase}
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Box className={classes.treeCustomOutBoxStyle}>
        <Box className={classes.treeCustomInnerBoxStyle}>
          <TreePhase />
        </Box>
        <Box className={classes.treeCustomInnerBoxStyle}>
          <Box className={classes.treeRewardOutStyle}>
            <TreeReward />
            <TreeLearn />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default React.memo(TreeSection);
