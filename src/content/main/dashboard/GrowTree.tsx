import { useState, useEffect } from 'react';
import { Typography, Box, Hidden, useTheme, Theme } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import CustomCard from 'src/components/Card';
import CustomTooltip from 'src/components/Tooltip';
import GrowTreeDetail from './GrowTreeDetail';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';

import { GrowTreeStyle } from 'src/models/main/dashboard/CustomStyles';
import {
  growTreetabTitleStyle,
  growTreetabTitleStyle1,
  growTreetabTitleStyle2,
  BorderLinearProgress
} from 'src/models/StyledData';
import { m_d_growTreeImage } from 'src/models/ImageUrl';
import { phaseInfo } from 'src/models/main/golden-tree/SampleData';

import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';
import useGoldenTree from 'src/hooks/useGoldenTree';

const growNum = 9876543210;

const GrowTree = () => {
  const theme: Theme = useTheme();
  const classes = GrowTreeStyle(theme);
  const { account, chainId } = useWeb3React();
  const {
    fetchGrowth,
    fetchContributionOf,
    fetchGoldenTreePhase,
    fetchGlobalGrowth
  } = useGoldenTree();

  // Tree grow details button click event
  const [expandedGrowTreeDetail, setExpandedGrowTreeDetail] =
    useState<boolean>(false);
  const handleExpandGrowTreeDetailClick = (): void => {
    setExpandedGrowTreeDetail(
      (expandedGrowTreeDetail) => !expandedGrowTreeDetail
    );
  };

  const [treePhase, setTreePhase] = useState<number>(0);
  const [growth, setGrowth] = useState({
    personal: '0',
    global: '0',
    percent: '0'
  });

  useEffect(() => {
    async function init() {
      let result = await fetchGoldenTreePhase();
      setTreePhase(result.toString());
      let growthAmount = await fetchGrowth(account);
      let globalGrowth = await fetchGlobalGrowth();
      let growthPercent = await fetchContributionOf(account);
      setGrowth({
        personal: parseFloat(utils.formatEther(growthAmount)).toFixed(6),
        percent: growthPercent.toString(),
        global: parseFloat(utils.formatEther(globalGrowth)).toFixed(6)
      });
    }
    if (account && chainId) init();

    return () => {
      setTreePhase(0);
      setGrowth((prev) => ({
        ...prev
      }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <>
      <Box className={classes.outBoxCustomStyle}>
        <CustomCard height="100%">
          <ColumnBox padding="20px 20px 15px 20px" height="100%">
            <RowBox justifyContent="flex-start">
              <Typography
                variant="h2"
                color={theme.colors.primary.main}
                width="180px"
              >
                Smart Army's Golden Tree
              </Typography>
              <CustomTooltip content="Golden Tree’s Phases of Growth" />
            </RowBox>
            <Typography variant="h4" className={classes.growthTitleStyle}>
              Growth
            </Typography>
            <Box className={classes.growTreeButtonGroupBox}>
              {growNum
                .toString()
                .split('')
                .map((num, idx) => {
                  switch (idx) {
                    case 0:
                      return (
                        <Typography
                          key={idx}
                          className={
                            9 - treePhase === idx ? classes.activeTab : ''
                          }
                          style={growTreetabTitleStyle1}
                        />
                      );
                    case 9:
                      return (
                        <Typography
                          key={idx}
                          className={
                            9 - treePhase === idx ? classes.activeTab : ''
                          }
                          style={growTreetabTitleStyle2}
                        />
                      );
                    default:
                      return (
                        <Typography
                          key={idx}
                          className={
                            9 - treePhase === idx ? classes.activeTab : ''
                          }
                          style={growTreetabTitleStyle}
                        />
                      );
                  }
                })}
            </Box>
            {growNum
              .toString()
              .split('')
              .map(
                (num, idx) =>
                  9 - treePhase === idx && (
                    <Box key={idx} height="100%">
                      <Box className={classes.treeCustomBoxStyle}>
                        <Box
                          component="img"
                          className={classes.treeCustomStyle}
                          alt={m_d_growTreeImage[idx].name}
                          src={m_d_growTreeImage[idx].path}
                        />
                      </Box>
                      <Box className={classes.treeStatusBoxStyle}>
                        <Typography variant="h3" color="#EDEDED">
                          {phaseInfo[treePhase].phase}
                        </Typography>
                        <BorderLinearProgress
                          variant="determinate"
                          value={
                            (Number(growth.global) /
                              Number(phaseInfo[treePhase].require)) *
                            100
                          }
                        />
                        <Typography variant="h4" textAlign="right">
                          {phaseInfo[treePhase].status}
                        </Typography>
                      </Box>
                    </Box>
                  )
              )}
            <Typography variant="h4" className={classes.treeDetailCustomStyle}>
              You have been contributing {growth.personal} Growth (
              {growth.percent}%) so far. Click the arrow below to see why Golden
              Tree is amazing!
            </Typography>
          </ColumnBox>
        </CustomCard>

        <Hidden mdUp>
          <GrowTreeDetail
            expanded={expandedGrowTreeDetail}
            onHandleClick={handleExpandGrowTreeDetailClick}
          />
        </Hidden>
      </Box>

      {/* Grow Tree detail icon */}
      <ArrowDropDownIcon
        className={classes.dropdownIconStyle}
        onClick={handleExpandGrowTreeDetailClick}
      />

      <Hidden mdDown>
        <GrowTreeDetail
          expanded={expandedGrowTreeDetail}
          onHandleClick={handleExpandGrowTreeDetailClick}
        />
      </Hidden>
    </>
  );
};

export default GrowTree;
