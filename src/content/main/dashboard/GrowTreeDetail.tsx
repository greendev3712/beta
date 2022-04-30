import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  CardContent,
  Fade,
  useTheme,
  Theme
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

import CustomCard from 'src/components/Card';
import CustomTooltip from 'src/components/Tooltip';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';

import { GrowTreeStyle } from 'src/models/main/dashboard/CustomStyles';
import { GetMoreSmtcButton } from 'src/models/StyledData';

import { useWeb3React } from '@web3-react/core';
import { useFetchToken } from 'src/hooks/useTokenBalances';
import useGoldenTree from 'src/hooks/useGoldenTree';
import { formatDecimalNumber } from 'src/utils/formatBalance';
import { getContract } from 'src/utils';

interface ParentProps {
  expanded: boolean;
  onHandleClick: (e: React.MouseEvent) => void;
}

const GrowTreeDetail = (props: ParentProps) => {
  const theme: Theme = useTheme();
  const classes = GrowTreeStyle(theme);
  const navigate = useNavigate();
  const { account, chainId } = useWeb3React();
  const { fetchTokenBalance } = useFetchToken();
  const { fetchThreshold } = useGoldenTree();

  const [walletSmtc, setWalletSmtc] = useState({
    amount: '0',
    price: '0'
  });

  useEffect(() => {
    async function init() {
      const smtcContract = await getContract('SmartTokenCash', chainId);
      let smtcAmount = await fetchTokenBalance(smtcContract);
      let smtcPrice = await fetchThreshold();
      setWalletSmtc({
        amount: smtcAmount,
        price: formatDecimalNumber(smtcPrice, 18)
      });
    }
    if (account && chainId) init();

    return () => {
      setWalletSmtc((prev) => ({
        ...prev
      }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <Fade in={props.expanded}>
      <CardContent className={classes.growTreeContentStyle}>
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="center"
          onClick={props.onHandleClick}
          sx={{ cursor: 'pointer' }}
        >
          <ArrowDropUpIcon sx={{ color: theme.colors.primary.main }} />
        </Box>
        <Typography
          variant="h4"
          component="div"
          className={classes.growTreeDetailTypoStyle}
        >
          As the Golden Tree passes & grows each phase, your SMTC asset will
          absolutely grow.
        </Typography>
        <RowBox alignItems="stretch" marginTop="20px">
          <Box width="35%">
            <CustomCard height="auto" background={theme.colors.gradients.grey}>
              <Box padding="10px 9px" height="auto" textAlign="center">
                <Typography
                  variant="h4"
                  textAlign="center"
                  color={theme.colors.primary.main}
                >
                  Your owned SMT Cash
                </Typography>
                <Typography
                  variant="h2"
                  marginTop="10px"
                  color={theme.colors.white.main}
                >
                  {walletSmtc.amount}
                </Typography>
                <RowBox justifyContent="center" marginTop="1px">
                  <Typography variant="h4">
                    ({walletSmtc.amount} USD)
                  </Typography>
                  <CustomTooltip content={'Your current SMTC asset value'} />
                </RowBox>
              </Box>
            </CustomCard>
            <GetMoreSmtcButton onClick={() => navigate('/main/smt')}>
              Get more SMTC
            </GetMoreSmtcButton>
          </Box>
          <ColumnBox width="58%">
            <Typography
              variant="h4"
              textAlign="right"
              color={theme.colors.primary.main}
            >
              Future scenario of your SMTC asset value
            </Typography>
            <Box
              marginTop="5px"
              display="flex"
              flexWrap="wrap"
              justifyContent="space-between"
              alignItems="center"
              height="100%"
            >
              {Array(9)
                .fill(0)
                .map((con, idx) => (
                  <CustomCard
                    key={idx}
                    height="40px"
                    background={theme.colors.white.main}
                  >
                    <Box padding="5px 10px" textAlign="center">
                      <Typography
                        variant="h5"
                        fontWeight="700"
                        color={theme.colors.black.main}
                      >
                        $000
                      </Typography>
                      <Typography
                        variant="h5"
                        fontWeight="400"
                        color={theme.colors.black.main}
                      >
                        Phase {idx + 1}
                      </Typography>
                    </Box>
                  </CustomCard>
                ))}
            </Box>
          </ColumnBox>
        </RowBox>
      </CardContent>
    </Fade>
  );
};

export default GrowTreeDetail;
