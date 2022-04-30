import React, { useState, useEffect } from 'react';
import { Typography, Box, useTheme, Theme } from '@mui/material';

import ColumnBox from 'src/components/Box/ColumnBox';
import RowBox from 'src/components/Box/RowBox';
import CustomTooltip from 'src/components/Tooltip';
import CustomCard from 'src/components/Card';
import MultiTabButton from 'src/components/MultiTab';
import BuyComponent from './tax-component/Buy';
import SellComponent from './tax-component/Sell';
import WalletComponent from './tax-component/Wallet';
import FarmingComponent from './tax-component/Farming';

import { CurrentTaxStyle } from 'src/models/main/dashboard/CustomStyles';

import { getContract } from 'src/utils';

import useSMTInfo from 'src/hooks/useSMTInfo';
import useSmartFarmInfo from 'src/hooks/useSmartFarmInfo';
import { useWeb3React } from '@web3-react/core';

const CurrentTax = () => {
  const theme: Theme = useTheme();
  const classes = CurrentTaxStyle(theme);
  const { account, chainId } = useWeb3React();
  const { info } = useSMTInfo();
  const { info: farmInfo } = useSmartFarmInfo();

  const [tabValue, tabSetState] = useState<string>('Buy');
  const handleClickTab = (e: React.MouseEvent, value: string): void => {
    tabSetState(value);
  };

  const [Content, setContent] = useState({});

  useEffect(() => {
    async function init() {
      const smtContract = await getContract('SmartToken', chainId);
      const isIntermediary = await smtContract.enabledIntermediary(account);
      setContent({
        Buy: <BuyComponent info={info} intermediary={isIntermediary} />,
        Sell: <SellComponent info={info} intermediary={isIntermediary} />,
        'Wallet transaction': (
          <WalletComponent info={info} intermediary={isIntermediary} />
        ),
        Farming: (
          <FarmingComponent info={farmInfo} intermediary={isIntermediary} />
        )
      });
    }
    if (account && chainId) init();
    return () => {
      setContent({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, info, farmInfo]);

  return (
    <CustomCard height="auto" marginTop="20px">
      <ColumnBox padding="10px 5px 10px 5px" height="100%">
        <Box
          sx={{
            padding: '0px 5px 0px 5px',
            height: '70px',
            position: 'relative',
            width: '100%'
          }}
        >
          <RowBox justifyContent="flex-start" height="28px">
            <Typography variant="h2" className={classes.taxHearingTitleStyle}>
              Current Tax
            </Typography>
            <CustomTooltip content="Sell tax & wallet transaction tax can increase when emergency tax is triggered" />
          </RowBox>
          <Box className={classes.headingTooltipBox}>
            <Typography variant="h5" className={classes.emergencyTitleStyle}>
              {info.emergency_tax
                ? 'Emergency tax is active'
                : 'Emergency tax is inactive'}
            </Typography>
            <CustomTooltip
              content="Emergency tax is set to be active in certain condition: Price impact on SMT ≥ 25% within 24 hours Increase tax +10% Emergency tax duration: 24 hours"
              width="220px"
            />
          </Box>

          <Box className={classes.multiMenuBox}>
            <MultiTabButton
              titles="Buy, Sell, Wallet transaction, Farming"
              currentValue={tabValue}
              onHandleClick={handleClickTab}
            />
          </Box>
        </Box>
        <RowBox className={classes.taxMainContentStyle}>
          {Content[tabValue]}
        </RowBox>
      </ColumnBox>
    </CustomCard>
  );
};

export default React.memo(CurrentTax);
