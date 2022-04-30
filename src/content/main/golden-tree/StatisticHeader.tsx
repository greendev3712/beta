import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, Popover } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDrowUpIcon from '@mui/icons-material/ArrowDropUp';
import CustomButton from 'src/components/Button';
import CustomCard from 'src/components/Card';
import SellSmtcPopover from './SellSmtcPopover';
import SellSmtcConfirmPopover from './SellSmtcConfirmPopover';
import CustomTooltip from 'src/components/Tooltip';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';
import { statisticHeaderStyle } from 'src/models/main/golden-tree/CustomStyle';
import { useWeb3React } from '@web3-react/core';
import useGoldenTree from 'src/hooks/useGoldenTree';
import { formatDecimalNumber } from 'src/utils/formatBalance';
import { getContractAddress, getContract } from 'src/utils';
import { utils } from 'ethers';
import { nFormatter } from 'src/utils/formatBalance';

const tooltipIcon = {
  name: 'tooltipIcon',
  path: '/static/img/main_dashboard/tooltipIcon.svg',
  desc: 'tooltipIcon'
};

const StatisticHeader = () => {
  const classes = statisticHeaderStyle();
  const ref = useRef();
  const { account, chainId } = useWeb3React();
  const {
    fetchGrowth,
    fetchGlobalGrowth,
    fetchCirculation,
    fetchThreshold,
    fetchGoldenTreePhase,
    fetchContributionOf
  } = useGoldenTree();

  const [isOpen, setOpen] = useState<boolean>(false);
  const onHandleSellSmt = (): void => {
    setOpen(true);
    setPopoverStatus(false);
  };
  const onHandleSellSmtcClose = (): void => {
    setOpen(false);
  };

  const [isStatisticOpen, setStatisticOpen] = useState<boolean>(false);
  // STATISTIC POPOVER CLICK
  const onHandleStatistic = (): void => {
    setStatisticOpen(true);
  };
  const onHandleStatisticClose = (): void => {
    setStatisticOpen(false);
  };

  const [pooverStatus, setPopoverStatus] = useState<boolean>(true);
  const onHandleSellSmtcClick = (): void => {
    setPopoverStatus(true);
  };

  const [growth, setGrowth] = useState({
    personal: '0',
    global: '0',
    percent: '0'
  });
  const [circSmtc, setCircSmtc] = useState<string>('0');
  const [busdPool, setBusdPool] = useState<string>('0');
  const [threshold, setThreshold] = useState<string>('0');
  const [goldenTreePhase, setGoldenTreePhase] = useState<string>('0');

  useEffect(() => {
    async function init() {
      /** growth */
      let growthAmount = await fetchGrowth(account);
      let globalGrowth = await fetchGlobalGrowth();
      ////////////////////////////////////////////////////////////////
      // Now there is error in mainnet
      let growthPercent = await fetchContributionOf(account);
      setGrowth({
        personal: formatDecimalNumber(growthAmount, 18),
        global: formatDecimalNumber(globalGrowth, 18),
        percent: growthPercent.toString()
      });
      /** golden tree phase */
      let goldenTreePhase = await fetchGoldenTreePhase();
      setGoldenTreePhase(goldenTreePhase.toString());

      /** smtc circlulation */
      let smtcAmount = await fetchCirculation();
      setCircSmtc(smtcAmount.toString());

      /** busd pool */
      let smtGoldenTreePoolAddress = getContractAddress(
        'GoldenTreePool',
        chainId
      );
      let busdContract = await getContract('BUSDToken', chainId);
      let busdAmount = await busdContract.balanceOf(smtGoldenTreePoolAddress);
      setBusdPool(nFormatter(utils.formatEther(busdAmount), 4));

      /** smtc price(threshold) */
      let smtcPrice = await fetchThreshold();
      setThreshold(formatDecimalNumber(smtcPrice, 18));
    }
    if (account && chainId) init();
    return () => {
      setGrowth((prev) => ({
        ...prev
      }));
      setGoldenTreePhase('0');
      setCircSmtc('0');
      setBusdPool('0');
      setThreshold('0');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <Box className={classes.customBoxStyle}>
      <Box className={classes.customInnerBoxStyle}>
        <CustomCard height="100%">
          <ColumnBox padding="10px 5px" height="100%">
            <Typography className={classes.mainTitleTopStyle}>
              Your contribution
            </Typography>
            <Typography className={classes.mainTitleDownStyle}>
              {growth.personal} Growth ({growth.percent}%)
            </Typography>
          </ColumnBox>
        </CustomCard>
      </Box>

      <Box className={classes.customInnerBoxStyle}>
        <CustomCard height="100%">
          <ColumnBox padding="20px 5px" height="100%">
            <Typography className={classes.mainTitleTopStyle}>
              Global contribution (current)
            </Typography>
            <Typography className={classes.mainTitleDownStyle}>
              {growth.global} Growth
            </Typography>
          </ColumnBox>
        </CustomCard>
      </Box>

      <Box className={classes.customInnerBoxStyle}>
        <CustomCard height="100%">
          <ColumnBox padding="20px 5px" height="100%">
            <Typography className={classes.mainTitleTopStyle}>
              Current Golden Tree Phase
            </Typography>
            <Typography className={classes.mainTitleDownStyle}>
              {goldenTreePhase}th
            </Typography>
          </ColumnBox>
        </CustomCard>
      </Box>

      <Box ref={ref}>
        <CustomCard height="120px" width="320px">
          <ColumnBox padding="20px 5px" height="100%">
            <Typography
              variant="h2"
              sx={{
                fontWeight: '700',
                height: '29px',
                color: '#E0A501',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              Golden Tree Pool
            </Typography>
            <RowBox height="40px" marginTop="16px" padding="0 10px">
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
                onClick={onHandleStatistic}
              >
                {isStatisticOpen ? (
                  <ArrowDrowUpIcon sx={{ color: '#E0A501' }} />
                ) : (
                  <ArrowDropDownIcon sx={{ color: '#E0A501' }} />
                )}
                <Typography
                  variant="h3"
                  textAlign="center"
                  height="22px"
                  lineHeight="22px"
                  color="#E0A501"
                >
                  Statistic
                </Typography>
              </Box>
              <CustomButton
                width="180px"
                height="40px"
                background="#E0A501"
                color="#212121"
                fontSize="14px"
                fontWeight="600"
                padding="6px 15px"
                borderRadius="20px"
                boxShadow="4px 4px 4px rgba(0, 0, 0, 0.25), inset -1px -3px 4px rgba(0, 0, 0, 0.25)"
                title="Sell SMTC at fixed threshold price"
                onHandleClick={onHandleSellSmt}
              />
            </RowBox>
          </ColumnBox>
        </CustomCard>
      </Box>
      <Popover
        anchorEl={ref.current}
        onClose={onHandleStatisticClose}
        open={isStatisticOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        PaperProps={{
          style: {
            background: 'linear-gradient(180deg, #212121 0%, #000000 100%)',
            borderRadius: '10px',
            width: '468px'
          }
        }}
      >
        <ColumnBox padding="35px">
          <Typography
            variant="h2"
            color="#E0A501"
            height="29px"
            textAlign="center"
          >
            Golden Tree Pool Statistic
          </Typography>
          <RowBox height="150px" marginTop="30px">
            <CustomCard
              width="45%"
              height="100%"
              background="linear-gradient(180deg, #5A5A5A 0%, #212121 100%)"
              border="none"
            >
              <ColumnBox height="100%" padding="20px 5px">
                <Typography
                  variant="h3"
                  color="#EDEDED"
                  textAlign="center"
                  lineHeight="100%"
                >
                  BUSD in Pool
                </Typography>
                <Typography
                  variant="h2"
                  color="#E0A501"
                  textAlign="center"
                  fontWeight="700"
                  lineHeight="100%"
                >
                  {busdPool}
                </Typography>
                <Typography
                  variant="h3"
                  color="#EDEDED"
                  textAlign="center"
                  lineHeight="100%"
                >
                  BUSD
                </Typography>
              </ColumnBox>
            </CustomCard>
            <CustomCard
              width="45%"
              height="100%"
              background="linear-gradient(180deg, #5A5A5A 0%, #212121 100%)"
              border="none"
            >
              <ColumnBox height="100%" padding="20px 5px">
                <Typography
                  variant="h3"
                  color="#EDEDED"
                  textAlign="center"
                  lineHeight="100%"
                >
                  SMTC in circulation
                </Typography>
                <Typography
                  variant="h2"
                  color="#E0A501"
                  textAlign="center"
                  fontWeight="700"
                  lineHeight="100%"
                >
                  {formatDecimalNumber(circSmtc, 0)}
                </Typography>
                <Typography
                  variant="h3"
                  color="#EDEDED"
                  textAlign="center"
                  lineHeight="100%"
                >
                  SMTC
                </Typography>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '11px',
                    right: '11px'
                  }}
                >
                  <CustomTooltip
                    content="SMTC in circulation is determined by total SMT supply - burned SMT (SMT in burn address)"
                    width="220px"
                  >
                    <Box
                      component="img"
                      sx={{ ml: 2, width: '13px', height: '13px' }}
                      alt={tooltipIcon.name}
                      src={tooltipIcon.path}
                    />
                  </CustomTooltip>
                </Box>
              </ColumnBox>
            </CustomCard>
          </RowBox>
          <Box height="60px" width="100%" marginTop="30px">
            <CustomCard
              height="100%"
              background="linear-gradient(180deg, #5A5A5A 0%, #212121 100%)"
              border="none"
            >
              <RowBox height="100%" padding="5px 20px">
                <Typography variant="h3" color="#EDEDED" textAlign="center">
                  Current SMTC Price
                </Typography>
                <Typography
                  variant="h2"
                  color="#E0A501"
                  textAlign="center"
                  fontWeight="700"
                  marginLeft="62px"
                >
                  {threshold}
                </Typography>
                <Typography variant="h3" color="#EDEDED" textAlign="center">
                  BUSD
                </Typography>
              </RowBox>
            </CustomCard>
          </Box>
        </ColumnBox>
      </Popover>

      <Popover
        anchorReference="none"
        classes={{
          root: classes.popoverRoot
        }}
        open={isOpen}
        PaperProps={{
          style: {
            width: '700px',
            boxShadow: 'none'
          }
        }}
      >
        {pooverStatus ? (
          <SellSmtcConfirmPopover
            onHandleSellSmtcClose={onHandleSellSmtcClose}
          />
        ) : (
          <SellSmtcPopover
            onHandleSellSmtcClose={onHandleSellSmtcClose}
            onHandleSellSmtcClick={onHandleSellSmtcClick}
            smtcPrice={threshold}
          />
        )}
      </Popover>
    </Box>
  );
};

export default React.memo(StatisticHeader);
