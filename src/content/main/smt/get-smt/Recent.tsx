import React, { useState, useEffect } from 'react';
import { Box, Divider, Popover, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import useRequest from 'src/hooks/useRequest';
import ColumnBox from 'src/components/Box/ColumnBox';
import RowBox from 'src/components/Box/RowBox';
import { useWeb3React } from '@web3-react/core';
import { txShorter } from 'src/utils';
import { getContractAddress } from 'src/utils';

// REFRESH ICON IMAGE
const refreshIcon = {
  name: 'refresh',
  path: '/static/img/main_smt/get_smt/refresh.svg',
  desc: 'refreshIcon'
};

const Recent = () => {
  const [isRecentOpen, setRecentOpen] = useState<boolean>(false);
  const { account, chainId } = useWeb3React();
  const { fetchTransaction, isLoading } = useRequest();

  const onHandleRecentClick = (): void => {
    setRecentOpen(true);
  };
  const handleRecentClose = (): void => {
    setRecentOpen(false);
  };

  const [txArray, setTxArray] = useState([]);

  useEffect(() => {
    async function init() {
      let result = await fetchTransaction(account);
      let cArray = [];
      let smtBridgeAddress = getContractAddress('SMTBridge', chainId);
      cArray = result['data']['result'].filter((row) => {
        return row.to === smtBridgeAddress;
      });
      setTxArray(cArray);
    }
    if (account && chainId && isRecentOpen) init();

    return () => setTxArray([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, isRecentOpen]);

  return (
    <>
      <Box
        component="img"
        sx={{ float: 'right', cursor: 'pointer' }}
        width="21px"
        height="21px"
        alt={refreshIcon.name}
        src={refreshIcon.path}
        onClick={onHandleRecentClick}
      ></Box>
      <Popover
        anchorReference="anchorPosition"
        anchorPosition={{ top: 280, left: 500 }}
        onClose={handleRecentClose}
        open={isRecentOpen}
      >
        <Box
          sx={{
            padding: '20px 20px 30px 20px !important',
            background: 'linear-gradient(180deg, #212121 0%, #000000 100%)',
            border: '2px solid #5A5A5A',
            boxSizing: 'border-box',
            borderRadius: '10px',
            height: '445px',
            width: '445px',
            overflowY: 'auto'
          }}
        >
          <RowBox>
            <Typography variant="h2" color="#E0A501">
              Recent
            </Typography>
            <CloseIcon
              onClick={handleRecentClose}
              sx={{ cursor: 'pointer', color: '#EDEDED' }}
            />
          </RowBox>
          <Divider
            sx={{
              border: '2px solid #323232',
              height: '2px',
              marginTop: '10px'
            }}
          />
          <ColumnBox marginTop="30px" height="auto">
            {isLoading && <Typography variant="h4">loading...</Typography>}
            {!isLoading &&
              txArray.length > 0 &&
              txArray.map((tx, idx) => (
                <Typography key={idx} variant="h4" padding="5px">
                  {txShorter(tx.hash)}
                </Typography>
              ))}
            {!isLoading && txArray.length === 0 && (
              <Typography variant="h4">No transaction...</Typography>
            )}
          </ColumnBox>
        </Box>
      </Popover>
    </>
  );
};

export default React.memo(Recent);
