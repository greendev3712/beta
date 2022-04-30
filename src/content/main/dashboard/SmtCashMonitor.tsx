import React, { useState, useEffect } from 'react';
import {
  CardContent,
  Typography,
  Box,
  Collapse,
  CardActions,
  useTheme,
  Theme
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

import CustomCard from 'src/components/Card';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';
import PageTitle from './PageTitle';
import MultiTabButton from 'src/components/MultiTab';

import { IndexStyles } from 'src/models/main/dashboard/CustomStyles';
import { upImage, key, nokey } from 'src/models/ImageUrl';
import { ExpandMore } from 'src/models/StyledData';

import { formatDecimalNumber } from 'src/utils/formatBalance';
import { getContract, getContractAddress, txShorter } from 'src/utils';
import { nFormatter } from 'src/utils/formatBalance';

import { useWeb3React } from '@web3-react/core';
import { utils } from 'ethers';
import useRequest from 'src/hooks/useRequest';
import useTokenRatio from 'src/hooks/useTokenRatio';
import { useFetchToken } from 'src/hooks/useTokenBalances';
import useGoldenTree from 'src/hooks/useGoldenTree';

const SmtCashMonitor = () => {
  const theme: Theme = useTheme();
  const classes = IndexStyles(theme);
  const { account, chainId } = useWeb3React();
  const { fetchTokenHolder, fetchBusdPrice, fetchTokenTransactionNumber } =
    useRequest();
  const { fetchRatioBUSD } = useTokenRatio();
  const { fetchTokenBalance } = useFetchToken();
  const { fetchThreshold } = useGoldenTree();

  const [expanded, setExpanded] = useState(false);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [tabSmtValue, tabSmtSetState] = useState<string>('SMT');
  const handleClickSmtTab = (e: React.MouseEvent, value: string): void => {
    tabSmtSetState(value);
  };

  const [monitorInfo, setMonitorInfo] = useState({
    contractAddress: '',
    pooledSmt: '',
    pooledBUSD: '',
    totalLiqValue: '',
    totalMarketCap: '',
    totalTransaction: '',
    holders: '',
    dailyVolumn: '',
    smtvsTokenPrice: '',

    chestRewards: '',
    farmingSupply: '',
    supriseRewards: '',
    userWallet: '',
    marketingDevWallet: ''
  });

  useEffect(() => {
    async function init() {
      let smtOrsmtcContract;
      let busdContract;
      let smtBusdLpAddress;
      let poolSmtorSmtc;
      let poolBusd;
      let tokenHolders = '0';
      let busdPrice;
      let totalLiqValue;
      let totalTransaction = '0';
      let smtOrSmtcPrice = '0';

      /**
       * monitor detail info
       */
      let userSmtorSmtcBalance = '0';
      let chestBalance = '0';
      let surpriseBalance = '0';
      let farmBalance = '0';
      let marketingDevBalance = '0';

      busdContract = await getContract('BUSDToken', chainId);
      busdPrice = await fetchBusdPrice();

      /**
       * monitor detail info
       */
      const smtFarmAddress = getContractAddress('SmartFarm', chainId);
      const otherAchievementAddress = getContractAddress(
        'SmartOtherAchievement',
        chainId
      );
      const nobilityAchievementAddress = getContractAddress(
        'SmartNobilityAchievement',
        chainId
      );
      const marketingDevAddress = '0xCe64Bb454cBf1195D9Fd32611c76C768Aac02Ac2';

      if (tabSmtValue === 'SMT') {
        smtBusdLpAddress = getContractAddress('SMT_BUSD_LP', chainId);
        smtOrsmtcContract = await getContract('SmartToken', chainId);
        poolSmtorSmtc = await smtOrsmtcContract.balanceOf(smtBusdLpAddress); // ------- smt-busd lp 's smt amount
        poolBusd = await busdContract.balanceOf(smtBusdLpAddress); // -------- smt-busd lp' s busd amount
        totalLiqValue = Number(utils.formatEther(poolBusd)) * Number(busdPrice);
        totalTransaction = await fetchTokenTransactionNumber(
          smtOrsmtcContract.address
        );
        smtOrSmtcPrice = await fetchRatioBUSD();
        // tokenHolders = await fetchTokenHolder(smtOrsmtcContract.address);

        /**
         * monitor detail info
         */
        userSmtorSmtcBalance = await fetchTokenBalance(smtOrsmtcContract);
        marketingDevBalance = await smtOrsmtcContract.balanceOf(
          marketingDevAddress
        );
        chestBalance = await smtOrsmtcContract.balanceOf(
          nobilityAchievementAddress
        );
        surpriseBalance = await smtOrsmtcContract.balanceOf(
          otherAchievementAddress
        );
        farmBalance = await smtOrsmtcContract.balanceOf(smtFarmAddress);
      } else {
        const goldenTreePoolAddress = getContractAddress(
          'GoldenTreePool',
          chainId
        );
        smtOrsmtcContract = await getContract('SmartTokenCash', chainId);
        poolSmtorSmtc = await smtOrsmtcContract.balanceOf(
          goldenTreePoolAddress
        ); // ---------- golden tree pool 's smt amount
        poolBusd = await busdContract.balanceOf(goldenTreePoolAddress); // ------- golden tree pool's busd amount
        totalLiqValue = Number(utils.formatEther(poolBusd)) * Number(busdPrice);
        totalTransaction = await fetchTokenTransactionNumber(
          smtOrsmtcContract.address
        );
        smtOrSmtcPrice = await fetchThreshold();
        // tokenHolders = await fetchTokenHolder(smtOrsmtcContract.address);

        /**
         * monitor detail info
         */
        userSmtorSmtcBalance = await fetchTokenBalance(smtOrsmtcContract);
        marketingDevBalance = await smtOrsmtcContract.balanceOf(
          marketingDevAddress
        );
        chestBalance = await smtOrsmtcContract.balanceOf(
          nobilityAchievementAddress
        );
        surpriseBalance = await smtOrsmtcContract.balanceOf(
          otherAchievementAddress
        );
        farmBalance = await smtOrsmtcContract.balanceOf(smtFarmAddress);
      }
      setMonitorInfo((prev) => ({
        ...prev,
        contractAddress: smtOrsmtcContract.address,
        pooledSmt: formatDecimalNumber(poolSmtorSmtc, 18),
        pooledBUSD: formatDecimalNumber(poolBusd, 18),
        totalLiqValue: nFormatter(totalLiqValue, 4),
        totalMarketCap: '0',
        totalTransaction: totalTransaction['data']
          ? totalTransaction['data']['result'].length
          : '0',
        holders: tokenHolders,
        dailyVolumn: '0',
        smtvsTokenPrice: formatDecimalNumber(smtOrSmtcPrice, 18),
        // liquidityPool: nFormatter(utils.formatEther(liquidityBalance), 4),
        chestRewards: nFormatter(utils.formatEther(chestBalance), 4),
        farmingSupply: nFormatter(utils.formatEther(farmBalance), 4),
        supriseRewards: nFormatter(utils.formatEther(surpriseBalance), 4),
        userWallet: userSmtorSmtcBalance,
        marketingDevWallet: nFormatter(
          utils.formatEther(marketingDevBalance),
          4
        )
      }));
    }
    if (account && chainId) init();

    return () =>
      setMonitorInfo((prev) => ({
        ...prev
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, tabSmtValue]);

  return (
    <>
      <RowBox marginTop="20px">
        {/* SMT & SMT Cash monitor page title */}
        <PageTitle
          title="SMT & SMT Cash Monitor"
          content="Monitor & track SMT & SMTC Cash to minimize the risk & maximize the profit"
        />
        {/* Switch bar */}
        <Box className={classes.smtCashMonitorOutBoxStyle}>
          <RowBox className={classes.smtCashMonitorInnerBoxStyle}>
            <MultiTabButton
              titles="SMT, SMT Cash"
              currentValue={tabSmtValue}
              onHandleClick={handleClickSmtTab}
            />
          </RowBox>
        </Box>
      </RowBox>
      <CustomCard height="auto" marginTop="10px">
        <Box margin="20px 30px 26px 30px">
          <RowBox justifyContent="flex-end">
            <Typography
              variant="h2"
              className={classes.scmHeadingLeftTitleStyle}
            >
              {tabSmtValue === 'SMT' ? `SMT` : `SMTC`} - BUSD
            </Typography>
            <Box
              component="img"
              alt={upImage.name}
              src={upImage.path}
              sx={{ width: '16px', height: '16px', marginRight: '160px' }}
            />
            <Typography
              variant="h2"
              className={classes.scmHeadintRightTitleStyle}
            >
              $ {nFormatter(monitorInfo.smtvsTokenPrice, 4)}
            </Typography>
          </RowBox>

          <ColumnBox alignItems="stretch" marginTop="10px" width="100%">
            <RowBox className={classes.scmContentOutBoxStyle}>
              <Typography
                variant="h4"
                className={classes.scmContentTitleLeftStyle}
              >
                &#8226; Token contract
              </Typography>
              <Typography
                variant="h4"
                className={classes.scmContentTitleRightStyle}
              >
                : {txShorter(monitorInfo.contractAddress)}
              </Typography>
            </RowBox>
            <RowBox className={classes.scmContentOutBoxStyle}>
              <Typography
                variant="h4"
                className={classes.scmContentTitleLeftStyle}
              >
                &#8226; Pooled {tabSmtValue}
              </Typography>
              <Typography
                variant="h4"
                className={classes.scmContentTitleRightStyle}
              >
                : {monitorInfo.pooledSmt}
              </Typography>
            </RowBox>
            <RowBox className={classes.scmContentOutBoxStyle}>
              <Typography
                variant="h4"
                className={classes.scmContentTitleLeftStyle}
              >
                &#8226; Pooled BUSD
              </Typography>
              <Typography
                variant="h4"
                className={classes.scmContentTitleRightStyle}
              >
                : {monitorInfo.pooledBUSD}
              </Typography>
            </RowBox>
            <RowBox className={classes.scmContentOutBoxStyle}>
              <Typography
                variant="h4"
                className={classes.scmContentTitleLeftStyle}
              >
                &#8226; Total liquidity value
              </Typography>
              <Typography
                variant="h4"
                className={classes.scmContentTitleRightStyle}
              >
                : {monitorInfo.totalLiqValue}
              </Typography>
            </RowBox>
            <RowBox className={classes.scmContentOutBoxStyle}>
              <Typography
                variant="h4"
                className={classes.scmContentTitleLeftStyle}
              >
                &#8226; Total marketcap
              </Typography>
              <Typography
                variant="h4"
                className={classes.scmContentTitleRightStyle}
              >
                : {monitorInfo.totalMarketCap}
              </Typography>
            </RowBox>
            <RowBox className={classes.scmContentOutBoxStyle}>
              <Typography
                variant="h4"
                className={classes.scmContentTitleLeftStyle}
              >
                &#8226; Total transaction
              </Typography>
              <Typography
                variant="h4"
                className={classes.scmContentTitleRightStyle}
              >
                : {monitorInfo.totalTransaction}
              </Typography>
            </RowBox>
            <RowBox className={classes.scmContentOutBoxStyle}>
              <Typography
                variant="h4"
                className={classes.scmContentTitleLeftStyle}
              >
                &#8226; Holders
              </Typography>
              <Typography
                variant="h4"
                className={classes.scmContentTitleRightStyle}
              >
                : {monitorInfo.holders}
              </Typography>
            </RowBox>
            <RowBox className={classes.scmContentOutBoxStyle}>
              <Typography
                variant="h4"
                className={classes.scmContentTitleLeftStyle}
              >
                &#8226; Daily volumn
              </Typography>
              <Typography
                variant="h4"
                className={classes.scmContentTitleRightStyle}
              >
                : {txShorter(monitorInfo.contractAddress)}
              </Typography>
            </RowBox>
          </ColumnBox>
        </Box>
      </CustomCard>
      <Box className={classes.smcDetailOutBoxStyle}>
        <CardActions
          className={classes.smcDetailCAStyle}
          onClick={handleExpandClick}
        >
          <Typography variant="h4" className={classes.smcDetailCATitleStyle}>
            Token Circulation
          </Typography>
          <ExpandMore expand={expanded} aria-expanded={expanded}>
            <ArrowDropDownIcon sx={{ color: theme.colors.primary.main }} />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent className={classes.smcDetailCCStyle}>
            <ColumnBox alignItems="stretch" width="50%">
              <RowBox className={classes.scmContentOutBoxStyle}>
                <RowBox justifyContent="flex-start" width="60%">
                  <Typography
                    variant="h5"
                    className={classes.smtCashDetailTitleStyle}
                  >
                    Liquidity Pool
                  </Typography>
                  <Box
                    component="img"
                    alt={key.name}
                    src={key.path}
                    className={classes.scmDetailIconStyle}
                  />
                </RowBox>
                <RowBox justifyContent="flex-start" width="40%">
                  <Typography
                    variant="h5"
                    className={classes.smtCashDetailTitleStyle}
                  >
                    {monitorInfo.pooledSmt}
                  </Typography>
                  <Box
                    component="img"
                    alt={nokey.name}
                    src={nokey.path}
                    className={classes.scmDetailIconStyle}
                  />
                </RowBox>
              </RowBox>
              <RowBox className={classes.scmContentOutBoxStyle}>
                <RowBox justifyContent="flex-start" width="60%">
                  <Typography
                    variant="h5"
                    className={classes.smtCashDetailTitleStyle}
                  >
                    Chest rewards
                  </Typography>
                  <Box
                    component="img"
                    alt={key.name}
                    src={key.path}
                    className={classes.scmDetailIconStyle}
                  />
                </RowBox>
                <RowBox justifyContent="flex-start" width="40%">
                  <Typography
                    variant="h5"
                    className={classes.smtCashDetailTitleStyle}
                  >
                    {monitorInfo.chestRewards}
                  </Typography>
                  <Box
                    component="img"
                    alt={nokey.name}
                    src={nokey.path}
                    className={classes.scmDetailIconStyle}
                  />
                </RowBox>
              </RowBox>
              <RowBox className={classes.scmContentOutBoxStyle}>
                <RowBox justifyContent="flex-start" width="60%">
                  <Typography
                    variant="h5"
                    className={classes.smtCashDetailTitleStyle}
                  >
                    Farming supply
                  </Typography>
                  <Box
                    component="img"
                    alt={key.name}
                    src={key.path}
                    className={classes.scmDetailIconStyle}
                  />
                </RowBox>
                <RowBox justifyContent="flex-start" width="40%">
                  <Typography
                    variant="h5"
                    className={classes.smtCashDetailTitleStyle}
                  >
                    {monitorInfo.farmingSupply}
                  </Typography>
                  <Box
                    component="img"
                    alt={nokey.name}
                    src={nokey.path}
                    className={classes.scmDetailIconStyle}
                  />
                </RowBox>
              </RowBox>
            </ColumnBox>
            <ColumnBox alignItems="stretch" width="50%">
              <RowBox className={classes.scmContentOutBoxStyle}>
                <RowBox justifyContent="flex-start" width="60%">
                  <Typography
                    variant="h5"
                    className={classes.smtCashDetailTitleStyle}
                  >
                    Surprise rewards
                  </Typography>
                  <Box
                    component="img"
                    alt={key.name}
                    src={key.path}
                    className={classes.scmDetailIconStyle}
                  />
                </RowBox>
                <RowBox justifyContent="flex-start" width="40%">
                  <Typography
                    variant="h5"
                    className={classes.smtCashDetailTitleStyle}
                  >
                    {monitorInfo.supriseRewards}
                  </Typography>
                  <Box
                    component="img"
                    alt={nokey.name}
                    src={nokey.path}
                    className={classes.scmDetailIconStyle}
                  />
                </RowBox>
              </RowBox>
              <RowBox className={classes.scmContentOutBoxStyle}>
                <RowBox justifyContent="flex-start" width="60%">
                  <Typography
                    variant="h5"
                    className={classes.smtCashDetailTitleStyle}
                  >
                    User’s wallet
                  </Typography>
                  <Box
                    component="img"
                    alt={key.name}
                    src={key.path}
                    className={classes.scmDetailIconStyle}
                  />
                </RowBox>
                <RowBox justifyContent="flex-start" width="40%">
                  <Typography
                    variant="h5"
                    className={classes.smtCashDetailTitleStyle}
                  >
                    {monitorInfo.userWallet}
                  </Typography>
                  <Box
                    component="img"
                    alt={nokey.name}
                    src={nokey.path}
                    className={classes.scmDetailIconStyle}
                  />
                </RowBox>
              </RowBox>
              <RowBox className={classes.scmContentOutBoxStyle}>
                <RowBox justifyContent="flex-start" width="60%">
                  <Typography
                    variant="h5"
                    className={classes.smtCashDetailTitleStyle}
                  >
                    Marketing & dev wallet
                  </Typography>
                  <Box
                    component="img"
                    alt={key.name}
                    src={key.path}
                    className={classes.scmDetailIconStyle}
                  />
                </RowBox>
                <RowBox justifyContent="flex-start" width="40%">
                  <Typography
                    variant="h5"
                    className={classes.smtCashDetailTitleStyle}
                  >
                    {monitorInfo.marketingDevWallet}
                  </Typography>
                  <Box
                    component="img"
                    alt={nokey.name}
                    src={nokey.path}
                    className={classes.scmDetailIconStyle}
                  />
                </RowBox>
              </RowBox>
            </ColumnBox>
          </CardContent>
        </Collapse>
      </Box>
    </>
  );
};

export default React.memo(SmtCashMonitor);
