import { useState, useEffect } from 'react';
import { Typography, Box, useTheme, Theme } from '@mui/material';

import CustomCard from 'src/components/Card';
import CustomTitle from 'src/components/Title/BadgeTitle';
import PageTitle from './PageTitle';
import ColumnBox from 'src/components/Box/ColumnBox';
import RowBox from 'src/components/Box/RowBox';

import { titleStyle } from 'src/models/StyledData';
import { AchieveStyle } from 'src/models/main/dashboard/CustomStyles';
import { NobilityTitleArray } from 'src/models/main/achievement/SampleData';

import { useWeb3React } from '@web3-react/core';
import useSmartAchievement from 'src/hooks/useSmartAchievement';

const Achievement = () => {
  const theme: Theme = useTheme();
  const classes = AchieveStyle(theme);
  const { account, chainId } = useWeb3React();
  const { getNobilityTypeOf } = useSmartAchievement();

  const [achieveTitleArray, setAchieveTitleArray] = useState([]);

  useEffect(() => {
    async function init() {
      let titleOfValues = await getNobilityTypeOf(account);
      let index = NobilityTitleArray.findIndex(
        (row) => row.name === titleOfValues
      );
      if (index !== -1) {
        let titleArray: any = [];
        titleArray = NobilityTitleArray.filter((row, idx) => idx <= index);
        setAchieveTitleArray(titleArray);
      }
    }
    if (account && chainId) init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  const seeMore = () => {
    window.open('https://smarttoken.finance/docTutorial.html');
  };

  return (
    <>
      <ColumnBox marginTop="20px" alignItems="flex-start">
        <PageTitle
          title="Your Achievement"
          content="Your current Achievement in Smart Ecosystem"
        />
        <RowBox className={classes.customOutBoxStyle} alignItems="flex-start">
          <Box className={classes.customInnerBoxStyle}>
            <Typography variant="h4" paddingLeft="10px" marginTop="10px">
              Last achieved
            </Typography>
            <CustomCard height="auto" marginTop="10px">
              <Box className={classes.titleBoxStyle}>
                {achieveTitleArray.length === 0 ? (
                  <Typography variant="h4">
                    There is no achieved history yet
                  </Typography>
                ) : (
                  achieveTitleArray
                    .filter((title, idx) => idx <= 8)
                    .map((title, idx) => (
                      <RowBox key={idx} className={classes.titleInnerBoxStyle}>
                        <Typography className={classes.achievedDotStyle}>
                          &#8226;
                        </Typography>
                        <Typography
                          variant="h4"
                          className={classes.achievedTitleStyle}
                        >
                          {title.name} title achieved!
                        </Typography>
                      </RowBox>
                    ))
                )}
              </Box>
            </CustomCard>
            {achieveTitleArray.length > 8 && (
              <Typography
                variant="h4"
                className={classes.seeMoreCustomStyle}
                onClick={seeMore}
              >
                See more &gt;&gt;
              </Typography>
            )}
          </Box>

          <Box className={classes.customInnerBoxStyle}>
            <Typography variant="h4" margin="10px 0 0 10px">
              Collected Badges
            </Typography>
            <CustomCard height="auto" marginTop="10px">
              <Box className={classes.badgeCustomBoxStyle}>
                {achieveTitleArray.length === 0 ? (
                  <Typography variant="h4">There is no badge yet</Typography>
                ) : (
                  achieveTitleArray
                    .filter((item, idx) => idx < 3)
                    .map((row, idx) => (
                      <Box
                        key={idx}
                        component="img"
                        alt={row.name}
                        src={row.path}
                        className={classes.customBadgeStyle}
                      />
                    ))
                )}
              </Box>
            </CustomCard>
            {achieveTitleArray.length > 3 && (
              <Typography
                variant="h4"
                className={classes.seeMoreCustomStyle}
                onClick={seeMore}
              >
                See more &gt;&gt;
              </Typography>
            )}

            <Typography variant="h4" margin="11px 0 0 10px">
              Collected Titles
            </Typography>
            {achieveTitleArray.length === 0 ? (
              <CustomTitle {...titleStyle} title="There is no title yet" />
            ) : (
              <>
                {achieveTitleArray
                  .filter((item, idx) => idx < 2)
                  .map((row, idx) => (
                    <CustomTitle {...titleStyle} key={idx} title={row.name} />
                  ))}
              </>
            )}

            {achieveTitleArray.length > 2 && (
              <Typography
                variant="h4"
                className={classes.seeMoreCustomStyle}
                onClick={seeMore}
              >
                See more &gt;&gt;
              </Typography>
            )}
          </Box>
        </RowBox>
      </ColumnBox>
    </>
  );
};

export default Achievement;
