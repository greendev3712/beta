import React, { useEffect, useState } from 'react';
import { Box, Typography, Divider, Hidden } from '@mui/material';
import { useTheme, Theme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomButton from 'src/components/Button';
import ColumnBox from 'src/components/Box/ColumnBox';
import RowBox from 'src/components/Box/RowBox';
import { ReceivePopoverStyle } from 'src/models/main/reward/CustomStyle';
import { useWeb3React } from '@web3-react/core';
import useFarmHarvest from 'src/hooks/useFarmHarvest';
import useRewards from 'src/hooks/useRewards';
import LoadingBar from 'src/components/Loader';

interface ParentProps {
  onHandleHarvestClose: (e: React.MouseEvent) => void;
  onHandleHarvestNext: (value: string, smtVal: number) => void;
  smtVal: number;
  title: string;
}

let entered: boolean = false;

const ReceivePopover = (props: ParentProps) => {
  const theme: Theme = useTheme();
  const classes = ReceivePopoverStyle(theme);

  const { account } = useWeb3React();
  const { fetchHarvest } = useFarmHarvest();
  const {
    claimNobleReward,
    claimFarmReward,
    claimPassiveReward,
    claimSellTaxReward
  } = useRewards();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onHandleProceed = async () => {
    if (account && !entered) {
      entered = true;
      try {
        setIsLoading(true);
        switch (props.title) {
          case 'daily':
            await fetchHarvest(props.smtVal);
            break;
          case 'sell':
            await claimSellTaxReward(props.smtVal);
            break;
          case 'farmer':
            await claimFarmReward(props.smtVal);
            // TODO: claim inputed amount for the farmer in the golden tree phases rewards
            break;
          case 'passive':
            await claimPassiveReward(props.smtVal);
            // TODO: claim inputed amount in the passive global share
            break;
          case 'noble':
            await claimNobleReward(props.smtVal);
            // TODO: claim inputed amount for the noble leaders in the golden tree phases rewards
            break;
          case 'quest':
            // TODO: claim inputed amount in the quest rewards
            break;
          default:
            await fetchHarvest(props.smtVal);
            break;
        }
        props.onHandleHarvestNext('sure', props.smtVal);
      } catch (err) {
        console.error(err);
      } finally {
        entered = false;
        setIsLoading(false);
      }
    }
  };

  const onHandleClose = (e) => {
    if (!isLoading) props.onHandleHarvestClose(e);
  };

  return (
    <Box className={classes.outBoxStyle}>
      <CloseIcon
        onClick={(e) => onHandleClose(e)}
        className={classes.closeIconStyle}
      />
      <Typography variant="h2" className={classes.headingTitle}>
        Enjoy your rewards!
      </Typography>
      <Divider
        sx={{
          border: '2px solid #323232'
        }}
      />
      <ColumnBox className={classes.innerBoxStyle}>
        <ColumnBox className={classes.innerBoxStyle1}>
          <Typography variant="h2" className={classes.contentHeadingTitle}>
            You will receive
          </Typography>
          <Typography className={classes.contentMiddleTitleStyle}>
            {props.smtVal}{' '}
            {props.title === 'noble' || props.title === 'farmer'
              ? 'SMTC'
              : 'SMT'}
          </Typography>
          <Typography variant="h3" className={classes.contentBottomTitleStyle}>
            This amount of rewards will be deducted from your reward
            accumulation. Are you sure to continue?
          </Typography>
        </ColumnBox>
        <Hidden mdDown>
          <RowBox marginTop="72px">
            <CustomButton
              width="240px"
              height="50px"
              background={isLoading ? '#936900' : '#E0A501'}
              color="#212121"
              fontSize="22px"
              fontWeight="600"
              boxShadow="21px 21px 10px rgba(0, 0, 0, 0.5)"
              borderRadius="35px"
              onHandleClick={onHandleProceed}
            >
              Yes {isLoading && <LoadingBar />}
            </CustomButton>
            <CustomButton
              width="240px"
              height="50px"
              background="#936900"
              color="#FFFFFF"
              fontSize="22px"
              fontWeight="600"
              boxShadow="21px 21px 10px rgba(0, 0, 0, 0.5)"
              borderRadius="35px"
              onHandleClick={(e) => onHandleClose(e)}
            >
              No
            </CustomButton>
          </RowBox>
        </Hidden>
        <Hidden mdUp>
          <RowBox justifyContent="space-around" marginTop="45px">
            <CustomButton
              width="150px"
              height="30px"
              background={isLoading ? '#936900' : '#E0A501'}
              color="#212121"
              fontSize="13px"
              fontWeight="600"
              boxShadow="21px 21px 10px rgba(0, 0, 0, 0.5)"
              borderRadius="35px"
              onHandleClick={onHandleProceed}
            >
              Yes {isLoading && <LoadingBar />}
            </CustomButton>
            <CustomButton
              width="150px"
              height="30px"
              background="#936900"
              color="#FFFFFF"
              fontSize="13px"
              fontWeight="600"
              boxShadow="21px 21px 10px rgba(0, 0, 0, 0.5)"
              borderRadius="35px"
              onHandleClick={(e) => onHandleClose(e)}
            >
              No
            </CustomButton>
          </RowBox>
        </Hidden>
      </ColumnBox>
    </Box>
  );
};

export default ReceivePopover;
