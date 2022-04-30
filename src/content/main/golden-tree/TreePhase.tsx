import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';

import CustomCard from 'src/components/Card';
import CustomButton from 'src/components/Button';
import ColumnBox from 'src/components/Box/ColumnBox';

import { treePhaseStyle } from 'src/models/main/golden-tree/CustomStyle';
import { growNum, growTreeImage } from 'src/models/main/golden-tree/SampleData';

import { useWeb3React } from '@web3-react/core';
import useGoldenTree from 'src/hooks/useGoldenTree';

const TreePhase = () => {
  const classes = treePhaseStyle();
  const { account, chainId } = useWeb3React();
  const { fetchGoldenTreePhase } = useGoldenTree();

  const [treePhase, setTreePhase] = useState<number>(0);

  useEffect(() => {
    async function init() {
      let result = await fetchGoldenTreePhase();
      setTreePhase(result.toString());
    }
    if (account && chainId) init();

    return () => setTreePhase(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <CustomCard height="450px">
      <Box className={classes.customCardOutBoxStyle}>
        <Box width="70%" position="relative">
          {growNum
            .toString()
            .split('')
            .map(
              (num, idx) =>
                9 - treePhase === idx && (
                  <Box
                    key={idx}
                    sx={{
                      position: 'absolute',
                      top: '24px',
                      left: '0',
                      bottom: '24px',
                      right: '0',
                      display: 'flex',
                      justifyContent: 'center'
                    }}
                  >
                    <Box
                      component="img"
                      sx={{
                        width: 'auto',
                        height: 'auto',
                        position: 'absolute',
                        bottom: '0',
                        alignItems: 'flex-end'
                      }}
                      alt={growTreeImage[idx].name}
                      src={growTreeImage[idx].path}
                    />
                  </Box>
                )
            )}
        </Box>
        <ColumnBox
          justifyContent="space-around"
          textAlign="center"
          maxWidth="107px"
          width="30%"
        >
          {growNum
            .toString()
            .split('')
            .map((num, idx) => (
              <CustomButton
                key={idx}
                width="100%"
                height="34px"
                title={'Phase ' + num}
                background={9 - treePhase === idx ? '#E0A501' : '#323232'}
                color={9 - treePhase === idx ? '#212121' : '#EDEDED'}
                borderRadius="20px"
                fontSize="18px"
                fontWeight="600"
              />
            ))}
        </ColumnBox>
      </Box>
    </CustomCard>
  );
};

export default React.memo(TreePhase);
