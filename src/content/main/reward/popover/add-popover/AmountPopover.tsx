import React, { useState, useCallback, useEffect, useRef } from 'react';

import { Box, Typography, Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import CustomCard from 'src/components/Card';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { toast } from 'react-hot-toast';

import CustomTitle from 'src/components/Title/BadgeTitle';
import CustomButton from 'src/components/Button';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';

import { useWeb3React } from '@web3-react/core';
import useFarmHarvest from 'src/hooks/useFarmHarvest';
import { useFetchToken } from 'src/hooks/useTokenBalances';
import { formatDecimalNumber } from 'src/utils/formatBalance';
import { getContract, replaceToNumber } from 'src/utils';
import { calculatePercent } from 'src/utils/percent';

interface ParentProps {
  onHandleAddClose: (e: React.MouseEvent) => void;
  onHandleAddNext: (value: string, smtVal: number) => void;
}

const useStyles = makeStyles((theme) => ({
  // SEARCH BAR CUSTOM STYLE
  searchCustomStyle: {
    width: '100%',
    height: '40px',
    position: 'relative',
    justifyContent: 'center',
    '@media (max-width: 968px)': {}
  }
}));

const percentValues = ['10%', '25%', '50%', '75%', '100%'];

const AmountPopover = (props: ParentProps) => {
  const classes = useStyles();
  const isMount = useRef<boolean>(false);
  const { account, chainId } = useWeb3React();
  const { fetchFarmUserInfo } = useFarmHarvest();
  const { fetchTokenBalance } = useFetchToken();

  const [smtVal, setSmtVal] = useState<string>('');
  const [userSmtVal, setUserSmtVal] = useState<string>('0');
  const [farmPercent, setFarmPercent] = useState(0);
  const [farmValue, setFarmValue] = useState<string>('0');

  const handleChange = (e) => {
    setSmtVal(e.target.value);
    setFarmPercent(
      (parseFloat(e.target.value) / replaceToNumber(userSmtVal)) * 100
    );
  };

  const onHandleConfirm = useCallback(() => {
    if (!smtVal || Number(smtVal) === 0) {
      toast.error('Please input farming amount!');
      return;
    }
    if (Number(userSmtVal) - parseFloat(smtVal) < 0) {
      toast.error('There is no enough money to add farm!');
      return;
    }
    props.onHandleAddNext('proceed', Number(smtVal));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [smtVal]);

  useEffect(() => {
    isMount.current = true;
    async function init() {
      let farmUserInfo = await fetchFarmUserInfo(account);
      let userStackedSmt = formatDecimalNumber(farmUserInfo.tokenBalance, 18);
      setFarmValue(userStackedSmt);
      const smtTokenContract = await getContract('SmartToken', chainId);
      let amount = await fetchTokenBalance(smtTokenContract);
      setUserSmtVal(amount);
    }
    if (account && chainId && isMount.current) init();

    return () => {
      isMount.current = false;
      setFarmValue('0');
      setUserSmtVal('0');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <Box
      sx={{
        padding: '30px 30px 50px 30px !important',
        position: 'relative',
        background: 'linear-gradient(180deg, #212121 0%, #000000 100%)',
        boxSizing: 'border-box',
        borderRadius: '10px',
        width: '100%',
        textAlign: 'center'
      }}
    >
      <CloseIcon
        onClick={props.onHandleAddClose}
        sx={{
          cursor: 'pointer',
          position: 'absolute',
          top: '31px',
          right: '31px',
          color: '#EDEDED'
        }}
      />
      <Typography
        variant="h2"
        color="#E0A501"
        fontWeight="700"
        marginBottom="20px"
      >
        Add amount
      </Typography>
      <Divider
        sx={{
          border: '2px solid #323232'
        }}
      />
      <Box padding="20px 55px 0 55px">
        <Typography variant="h4" padding="0 82px">
          How many SMT do you want to add to farmed amount?
        </Typography>
        <RowBox marginTop="20px" height="156px">
          <CustomCard
            width="200px"
            height="100%"
            background="linear-gradient(180deg, #5A5A5A 0%, #212121 100%)"
            border="none"
          >
            <ColumnBox padding="20px 5px" height="100%">
              <Typography variant="h4" textAlign="center" height="17px">
                Your SMT balance
              </Typography>
              <Typography
                variant="h1"
                color="#E0A501"
                textAlign="center"
                width="100%"
              >
                {userSmtVal}
              </Typography>
              <Typography
                variant="h3"
                color="#E0A501"
                textAlign="center"
                fontWeight="700"
                height="17px"
              >
                SMT
              </Typography>
            </ColumnBox>
          </CustomCard>
          <Box width="300px" display="flex" flexDirection="column">
            <Typography variant="h4" marginBottom="5px" textAlign="left">
              Add Farming Amount
            </Typography>
            <FormControl
              variant="outlined"
              className={classes.searchCustomStyle}
            >
              <OutlinedInput
                id="outlined-adornment-weight"
                placeholder="1,000"
                aria-describedby="outlined-weight-helper-text"
                inputProps={{
                  'aria-label': 'weight'
                }}
                sx={{
                  padding: '9px 60px 9px 20px',
                  height: '100%',
                  borderRadius: '10px',
                  background: '#EDEDED',
                  color: '#5A5A5A',
                  fontSize: '18px'
                }}
                type="number"
                value={smtVal}
                onChange={handleChange}
              />
              <Typography
                variant="h3"
                sx={{
                  margin: '0 auto',
                  position: 'absolute',
                  right: '20px',
                  color: '#323232'
                }}
              >
                SMT
              </Typography>
            </FormControl>
            <RowBox marginTop="10px">
              {percentValues.map((con, idx) => (
                <CustomTitle
                  key={idx}
                  title={con}
                  background={calculatePercent(farmPercent, con)}
                  borderRadius="20px"
                  width="50px"
                  height="32px"
                  color="#EDEDED"
                  fontSize="14px"
                />
              ))}
            </RowBox>
            <Typography
              variant="h5"
              color="#EDEDED"
              marginTop="20px"
              textAlign="center"
            >
              Your total farming amount after confirmation:
            </Typography>
            <Typography variant="h4" color="#E0A501" textAlign="center">
              {Number(replaceToNumber(farmValue)) +
                (Number(smtVal) - Number(smtVal) * 0.15)}{' '}
              SMT
            </Typography>
          </Box>
        </RowBox>
        <RowBox padding="0 30px" marginTop="30px">
          <Typography variant="h4">
            *Farming tax (15%) will be charged, and the rest of 85% will be
            locked in Smart Contract as LP Token
          </Typography>
        </RowBox>
        <RowBox marginTop="48px" height="50px">
          <CustomButton
            width="240px"
            height="100%"
            background="#E0A501"
            color="#212121"
            fontSize="22px"
            fontWeight="600"
            boxShadow="21.7832px 21.7832px 10.8916px rgba(0, 0, 0, 0.5)"
            borderRadius="35px"
            onHandleClick={onHandleConfirm}
          >
            Confirm
          </CustomButton>
          <CustomButton
            width="240px"
            height="100%"
            background="#936900"
            color="#FFFFFF"
            fontSize="22px"
            fontWeight="600"
            boxShadow="21.7832px 21.7832px 10.8916px rgba(0, 0, 0, 0.5)"
            borderRadius="35px"
            onHandleClick={props.onHandleAddClose}
          >
            Cancel
          </CustomButton>
        </RowBox>
      </Box>
    </Box>
  );
};

export default React.memo(AmountPopover);
