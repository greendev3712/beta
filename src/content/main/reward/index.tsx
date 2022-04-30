import { useEffect, useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Box, Typography } from '@mui/material';
import { useTheme, Theme } from '@mui/material';
import Hero from './Hero';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';
import CustomButton from 'src/components/Button';
import CustomTooltip from 'src/components/Tooltip';
import { rewardList } from 'src/models/SampleData';
import { IndexStyles } from 'src/models/main/reward/CustomStyle';
import { StyledBadge } from 'src/models/main/reward/StyledStyle';
import useSmartAchievement from 'src/hooks/useSmartAchievement';
import { useWeb3React } from '@web3-react/core';
import useTimeCount from 'src/hooks/useTimeCount';
import { NobilityTitleArray } from 'src/models/main/achievement/SampleData';

const Reward = () => {
  const theme: Theme = useTheme();
  const classes = IndexStyles(theme);
  const isMount = useRef<boolean>(false);
  const navigate = useNavigate();

  const { account, chainId } = useWeb3React();
  const { getNobilityTypeOf } = useSmartAchievement();
  const { pastTime } = useTimeCount('h');

  const [nobilityTitles, setNobilityTitles] = useState<string>('');

  useEffect(() => {
    isMount.current = true;
    async function init() {
      let titleOfValues = await getNobilityTypeOf(account);
      setNobilityTitles(titleOfValues);
    }
    if (account && chainId && isMount.current) init();
    
    return () => {
      isMount.current = false;
      setNobilityTitles('');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  const renderContent = (title) => {
    switch (title) {
      case 'Daily farming rewards':
        return `${pastTime ? pastTime : '1'} / 365`;
      case 'Golden Tree Phases Rewards':
        if (!nobilityTitles) return 'no rewards available yet';
        else return '1 nobility rewards available';
      case 'Nobility title rewards':
        if (!nobilityTitles) return 'no rewards available yet';
        else {
          let index = NobilityTitleArray.findIndex(
            (row) => row.name === nobilityTitles
          );
          return `${index + 1} nobility rewards available`;
        }
      case 'Surprise rewards':
        return '';
      default:
        return 'no rewards available yet';
    }
  };

  return (
    <>
      <Helmet>
        <title>Main | Rewards</title>
      </Helmet>
      <Hero />
      <Container maxWidth="xl" className={classes.customPadding}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
        >
          <Grid item xs={12}>
            <Box className={classes.customOutBoxStyle}>
              {rewardList.map((rows, idx) => (
                <ColumnBox key={idx} maxWidth="240px">
                  {rows.map((row, index) => (
                    <ColumnBox key={index} marginBottom="50px">
                      <RowBox
                        justifyContent="center"
                        textAlign="center"
                        marginBottom="20px"
                      >
                        <Typography
                          variant="h2"
                          className={classes.boxHeadingStyle}
                        >
                          {row.title}
                        </Typography>
                        <CustomTooltip
                          content={row.tooltip}
                          iconWidth="16px"
                          iconHeight="16px"
                          height="86px"
                          width="250px"
                        />
                      </RowBox>
                      {row.title === 'Golden Tree Phases Rewards' ? (
                        <Box className={classes.treePhaseStyle}>
                          <Box
                            component="img"
                            src={row.path}
                            alt={row.title}
                            className={classes.treePhaseImageStyle}
                          />
                        </Box>
                      ) : (
                        <Box component="img" src={row.path} alt={row.title} />
                      )}

                      {/* {row.badge !== 'none' && <StyledBadge badgeContent={1} />} */}

                      <Typography variant="h4" margin="20px 0" fontWeight="400">
                        {renderContent(row.title)}
                      </Typography>

                      <CustomButton
                        width="160px"
                        height="30px"
                        background={
                          (!nobilityTitles &&
                            (row.title === 'Nobility title rewards' ||
                              row.title === 'Golden Tree Phases Rewards')) ||
                          row.title === 'Airdrop rewards' ||
                          row.title === 'Quest Rewards'
                            ? '#5A5A5A'
                            : '#E0A501'
                        }
                        color={theme.colors.black.main}
                        fontSize="14px"
                        fontWeight="600"
                        borderRadius="20px"
                        boxShadow="4px 4px 4px rgba(0, 0, 0, 0.25), inset -1px -3px 4px rgba(0, 0, 0, 0.25)"
                        onHandleClick={() =>
                          navigate(
                            `${
                              (!nobilityTitles &&
                                (row.title === 'Nobility title rewards' ||
                                  row.title ===
                                    'Golden Tree Phases Rewards')) ||
                              row.title === 'Airdrop rewards' ||
                              row.title === 'Quest Rewards'
                                ? '#'
                                : row.url
                            }`
                          )
                        }
                      >
                        {(!nobilityTitles &&
                          (row.title === 'Nobility title rewards' ||
                            row.title === 'Golden Tree Phases Rewards')) ||
                        row.title === 'Airdrop rewards' ||
                        row.title === 'Quest Rewards'
                          ? 'Unavailable'
                          : 'Available'}
                      </CustomButton>
                    </ColumnBox>
                  ))}
                </ColumnBox>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Reward;
