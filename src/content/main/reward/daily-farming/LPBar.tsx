import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Hidden, useTheme, Theme } from '@mui/material';
import { LPBarStyle } from 'src/models/main/reward/CustomStyle';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';
import CustomCard from 'src/components/Card';
import { useWeb3React } from '@web3-react/core';
import { useFetchToken } from 'src/hooks/useTokenBalances';
import { getContract } from 'src/utils';

const LPBar = () => {
  const theme: Theme = useTheme();
  const classes = LPBarStyle(theme);
  const isMount = useRef<boolean>(false);
  const { account, chainId } = useWeb3React();
  const { fetchTokenBalance } = useFetchToken();
  const [userBalance, setUserBalance] = useState({
    smtInLp: '0',
    bnbInLp: '0',
    lp: '0'
  });

  useEffect(() => {
    isMount.current = true;
    async function init() {
      /**
       * TODO: get lp balance, smt and bnb balance in lp of user
       */
      const smtBnbLpContract = await getContract('SMT_BNB_LP', chainId);
      let smtBnbLpBalance = await fetchTokenBalance(smtBnbLpContract);
      setUserBalance((prev) => ({
        ...prev,
        lp: smtBnbLpBalance
      }));
    }
    if (account && chainId && isMount.current) init();
    return () => {
      isMount.current = false;
      setUserBalance((prev) => ({
        ...prev
      }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <>
      <RowBox className={classes.outBoxStyle}>
        <Box className={classes.firstCardBoxStyle}>
          <CustomCard width="100%" height="100%">
            <ColumnBox className={classes.firstCardBoxGroup}>
              <Typography variant="h3" className={classes.mobileTitleStyle}>
                Your LP Token value
              </Typography>
              <Typography
                fontSize="28px"
                className={classes.mobileTitleNumStyle}
                fontWeight="700"
              >
                {userBalance.lp} SMT-BNB
              </Typography>
            </ColumnBox>
          </CustomCard>
        </Box>

        <Hidden mdDown>
          <ColumnBox width="30%" height="120px">
            <CustomCard width="100%" height="54px">
              <ColumnBox padding="10px">
                <Typography variant="h5" className={classes.mobileTitleStyle}>
                  Pooled SMT
                </Typography>
                <Typography
                  variant="h3"
                  className={classes.mobileTitleNumStyle}
                  fontWeight="700"
                >
                  $100,000
                </Typography>
              </ColumnBox>
            </CustomCard>

            <CustomCard width="100%" height="54px">
              <ColumnBox padding="10px">
                <Typography variant="h5" className={classes.mobileTitleStyle}>
                  Pooled BNB
                </Typography>
                <Typography
                  variant="h3"
                  className={classes.mobileTitleNumStyle}
                  fontWeight="700"
                >
                  $50,000
                </Typography>
              </ColumnBox>
            </CustomCard>
          </ColumnBox>
        </Hidden>

        <Box className={classes.lastCardBoxStyle}>
          <CustomCard width="100%" height="100%">
            <ColumnBox className={classes.lastCardBoxGroup}>
              <Typography variant="h3" className={classes.mobileTitleStyle}>
                Share of Pool
              </Typography>
              <Typography
                fontSize="30px"
                className={classes.mobileTitleNumStyle}
                fontWeight="700"
                marginTop="11px"
              >
                10%
              </Typography>
            </ColumnBox>
          </CustomCard>
        </Box>
      </RowBox>

      <Hidden mdUp>
        <RowBox justifyContent="space-evenly" marginTop="10px">
          <CustomCard width="45%" height="86px">
            <ColumnBox padding="20px 0">
              <Typography variant="h5" className={classes.mobileTitleStyle}>
                Pooled SMT
              </Typography>
              <Typography
                variant="h3"
                className={classes.mobileTitleNumStyle}
                fontWeight="700"
                marginTop="11px"
              >
                $100,000
              </Typography>
            </ColumnBox>
          </CustomCard>

          <CustomCard width="45%" height="86px">
            <ColumnBox padding="20px 0">
              <Typography variant="h5" className={classes.mobileTitleStyle}>
                Pooled BNB
              </Typography>
              <Typography
                variant="h3"
                className={classes.mobileTitleNumStyle}
                fontWeight="700"
                marginTop="11px"
              >
                $50,000
              </Typography>
            </ColumnBox>
          </CustomCard>
        </RowBox>
      </Hidden>
    </>
  );
};

export default LPBar;
