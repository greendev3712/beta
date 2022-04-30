import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, Hidden } from '@mui/material';
import { useTheme, Theme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { makeStyles } from '@mui/styles';
import CustomCard from 'src/components/Card';
import CustomTitle from 'src/components/Title/BadgeTitle';
import CustomButton from 'src/components/Button';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';
import { useFetchToken } from 'src/hooks/useTokenBalances';
import useGoldenTree from 'src/hooks/useGoldenTree';
import { getContract } from 'src/utils';
import { useWeb3React } from '@web3-react/core';
import { formatDecimalNumber } from 'src/utils/formatBalance';
import { calculatePercent } from 'src/utils/percent';
import { replaceToNumber } from 'src/utils';
import LoadingBar from 'src/components/Loader';
import { toast } from 'react-hot-toast';

interface ParentProps {
  onHandleSellSmtcClose: (e: React.MouseEvent) => void;
  onHandleSellSmtcClick: (e: React.MouseEvent) => void;
  smtcPrice: string;
}

const useStyles = makeStyles((theme) => ({
  // SEARCH BAR CUSTOM STYLE
  searchCustomStyle: {
    width: '100%',
    height: '40px',
    position: 'relative',
    justifyContent: 'center',
    '@media (max-width: 968px)': {}
  },
  outBoxStyle: {
    padding: '30px 30px 50px 30px !important',
    position: 'relative',
    background: 'linear-gradient(180deg, #212121 0%, #000000 100%)',
    boxSizing: 'border-box',
    borderRadius: '10px',
    width: '100%',
    textAlign: 'center'
  },
  innerBoxStyle: {
    padding: '20px 55px 0 55px',
    '@media (max-width: 968px)': {
      padding: '20px 0'
    }
  },
  closeIconStyle: {
    cursor: 'pointer',
    position: 'absolute',
    top: '31px',
    right: '31px',
    color: '#EDEDED'
  },
  descStyle: {
    padding: '0 82px',
    '@media (max-width: 968px)': {
      padding: '0'
    }
  },
  cardBoxStyle: {
    width: '37%'
  },
  cardInnerBoxStyle: {
    padding: '20px 0',
    textAlign: 'center'
  },
  cardHeadingStyle: {
    '@media (max-width: 968px)': {
      fontSize: '8px !important'
    }
  },
  cardContentTitleStyle: (props: Theme) => ({
    color: props.colors.primary.main,
    fontSize: '40px !important',
    fontWeight: '700',
    height: '59px',
    lineHeight: '100% !important',
    marginTop: '10px !important',
    '@media (max-width: 968px)': {
      fontSize: '30px !important',
      height: '37px',
      marginTop: '6px !important'
    }
  }),
  noteStyle: {
    marginTop: '30px !important',
    '@media (max-width: 968px)': {
      marginTop: '17px !important',
      fontSize: '10px !important'
    }
  },
  innerInputStyle: (props: Theme) => ({
    padding: '9px 60px 9px 20px',
    height: '100%',
    borderRadius: '10px !important',
    background: '#EDEDED',
    color: '#5A5A5A !important',
    fontSize: '18px !important',
    fontWeight: '600 !important',
    '@media (max-width: 968px)': {
      fontSize: '14px !important',
      padding: '5px 60px 5px 0 !important'
    }
  }),
  innerInputTitleStyle: (props: Theme) => ({
    margin: '0 auto',
    position: 'absolute',
    right: '20px',
    color: props.colors.blackAlt.main,
    '@media (max-width: 968px)': {
      fontSize: '11px !important'
    }
  }),
  priceStyle: {
    marginTop: '20px',
    padding: '0 130px',
    '@media (max-width: 968px)': {
      padding: '0 20px'
    }
  }
}));

const percentValues = ['10%', '25%', '50%', '75%', '100%'];

const SellSmtcPopover = (props: ParentProps) => {
  const theme: Theme = useTheme();
  const classes = useStyles(theme);
  const { account, chainId } = useWeb3React();
  const { fetchTokenBalance } = useFetchToken();
  const { sellSmtc, isLoading } = useGoldenTree();

  const [smtcVal, setSmtcVal] = useState<string>('');
  const [farmPercent, setFarmPercent] = useState<number>(0);
  const [walletSmtc, setWalletSmtc] = useState<string>('0');

  const handleChange = (e) => {
    setSmtcVal(e.target.value);
    if (replaceToNumber(walletSmtc) > 0) {
      setFarmPercent(
        (parseFloat(e.target.value) / replaceToNumber(walletSmtc)) * 100
      );
    }
  };

  const onHandleSell = async (e) => {
    if (!smtcVal || Number(smtcVal) === 0) {
      toast.error('Please input desire smtc amount');
      return;
    }
    if (replaceToNumber(walletSmtc) - parseFloat(smtcVal) < 0) {
      toast.error('There is no enough smtc in your wallet');
      return;
    }
    /** sell smtc */
    if (await sellSmtc(replaceToNumber(smtcVal))) {
      props.onHandleSellSmtcClick(e);
    }
  };

  useEffect(() => {
    async function init() {
      const smtcContract = await getContract('SmartTokenCash', chainId);
      const val = await fetchTokenBalance(smtcContract);
      setWalletSmtc(val);
    }
    if (account && chainId) init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <Box className={classes.outBoxStyle}>
      <CloseIcon
        onClick={props.onHandleSellSmtcClose}
        className={classes.closeIconStyle}
      />
      <Typography
        variant="h2"
        color="#E0A501"
        fontWeight="700"
        marginBottom="20px"
      >
        How many SMTC that you want to sell?
      </Typography>
      <Divider
        sx={{
          border: '2px solid #323232'
        }}
      />
      <Box className={classes.innerBoxStyle}>
        <Typography variant="h4" className={classes.descStyle}>
          Selling SMTC at threshold price will burn the SMTC and be removed from
          circulation
        </Typography>
        <RowBox marginTop="20px">
          <Box className={classes.cardBoxStyle}>
            <CustomCard
              width="100%"
              height="100%"
              background={theme.colors.gradients.grey}
              border="none"
            >
              <Box className={classes.cardInnerBoxStyle}>
                <Typography variant="h4" className={classes.cardHeadingStyle}>
                  Total smtc amount
                </Typography>
                <Typography className={classes.cardContentTitleStyle}>
                  {walletSmtc}
                </Typography>
                <Typography
                  variant="h4"
                  color="#E0A501"
                  fontWeight="700"
                  className={classes.cardHeadingStyle}
                >
                  SMTC
                </Typography>
              </Box>
            </CustomCard>
          </Box>
          <Box width="57%" display="flex" flexDirection="column">
            <FormControl
              variant="outlined"
              className={classes.searchCustomStyle}
            >
              <OutlinedInput
                id="outlined-adornment-weight"
                placeholder="990"
                className={classes.innerInputStyle}
                value={smtcVal}
                onChange={handleChange}
              />
              <Typography variant="h3" className={classes.innerInputTitleStyle}>
                SMTC
              </Typography>
            </FormControl>
            <Hidden mdDown>
              <RowBox marginTop="10px">
                {percentValues.map((con, idx) => (
                  <CustomTitle
                    key={idx}
                    title={con}
                    background={calculatePercent(farmPercent, con)}
                    borderRadius="20px"
                    padding="8px 12px"
                    color="#EDEDED"
                    fontSize="14px"
                  />
                ))}
              </RowBox>
            </Hidden>
            <Hidden mdUp>
              <RowBox marginTop="10px">
                {percentValues.map((con, idx) => (
                  <CustomTitle
                    key={idx}
                    title={con}
                    background={calculatePercent(farmPercent, con)}
                    borderRadius="20px"
                    padding="5px"
                    color="#EDEDED"
                    fontSize="8px"
                  />
                ))}
              </RowBox>
            </Hidden>
          </Box>
        </RowBox>

        <ColumnBox className={classes.priceStyle}>
          <RowBox>
            <Typography variant="h4">Amount to receive:</Typography>
            <Typography variant="h4" color="#E0A501">
              {formatDecimalNumber(
                Number(smtcVal) * Number(props.smtcPrice),
                18
              )}{' '}
              BUSD
            </Typography>
          </RowBox>
          <RowBox>
            <Typography variant="h4">Current threshold price:</Typography>
            <Typography variant="h4" color="#E0A501">
              {props.smtcPrice} BUSD
            </Typography>
          </RowBox>
          <RowBox>
            <Typography variant="h4">Price on DEX:</Typography>
            <Typography variant="h4" color="#E0A501">
              120 BUSD
            </Typography>
          </RowBox>
        </ColumnBox>
        <RowBox marginTop="48px" height="50px">
          <CustomButton
            width="240px"
            height="100%"
            background={isLoading ? '#936900' : '#E0A501'}
            color="#212121"
            fontSize="22px"
            fontWeight="600"
            boxShadow="21px 21px 10px rgba(0, 0, 0, 0.5)"
            borderRadius="35px"
            onHandleClick={(e) => onHandleSell(e)}
          >
            Sell now {isLoading && <LoadingBar />}
          </CustomButton>
          <CustomButton
            width="240px"
            height="100%"
            background="#936900"
            color="#FFFFFF"
            fontSize="22px"
            fontWeight="600"
            boxShadow="21px 21px 10px rgba(0, 0, 0, 0.5)"
            borderRadius="35px"
            onHandleClick={props.onHandleSellSmtcClose}
          >
            Cancel
          </CustomButton>
        </RowBox>
      </Box>
    </Box>
  );
};

export default SellSmtcPopover;
