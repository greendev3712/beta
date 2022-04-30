import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CustomCard from 'src/components/Card';
import CustomTitle from 'src/components/Title/BadgeTitle';
import { styled } from '@mui/material/styles';

import { useWeb3React } from '@web3-react/core';
import useRequest from 'src/hooks/useRequest';
import { getContractAddress } from 'src/utils';
import { txShorter } from 'src/utils';

const Root = styled('div')(
  ({ theme }) => `
    table {
      border-collapse: collapse;
      width: 100%;
      text-align: center;
    }
    table tbody tr:last-child td:first-of-type {
      border-bottom-left-radius: 13px;
    }
    table tbody tr:last-child td:last-child {
      border-bottom-right-radius: 13px;
    }
    table thead tr:first-of-type th:first-of-type {
      border-top-left-radius: 13px;
    }
    table thead tr:first-of-type th:last-child {
      border-top-right-radius: 13px;
    }
    thead tr {
      border-bottom: 2px solid #000;
      background: #212121;
      color: #E0A501;
      font-size: 14px;
      font-weight: 600;
    }
    tbody tr {
      border-bottom: 1px solid #000;
      background: #212121;
      font-weight: 600;
      color: #EDEDED;
      font-size: 12px;
    }
    table tr td {
      padding: 6px 5px;
    }
    table tr th {
      padding: 7px;
    }
    table tr th, table tr td {
      border-right: 2px solid #000;
    } 

    margin-top: 10px;
    width: 100%;
  `
);

const EarningHistoryTable = () => {
  const { account, chainId } = useWeb3React();
  const { fetchTransaction } = useRequest();

  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function init() {
      const farmContactAddress = getContractAddress('SmartFarm', chainId);
      let cArray = [];
      let cArray1 = [];
      let result = await fetchTransaction(account);
      cArray = result['data']['result'].filter((row) => {
        return row.to === farmContactAddress;
      });
      cArray1 = cArray.map((row, idx) => {
        return {
          transaction: row.hash,
          date: new Date(parseInt(row.timeStamp + '000')).toLocaleDateString(
            'en-US'
          ),
          earning: '1 SMT'
        };
      });
      setHistory(cArray1);
    }
    if (account && chainId) init();
    return () => {
      setHistory([]);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <CustomCard
      width="100%"
      height="auto"
      background="#000000"
      marginTop="10px"
    >
      <Box padding="10px">
        <Typography
          variant="h3"
          fontWeight="700"
          color="#E0A501"
          textAlign="center"
        >
          Earning History
        </Typography>
        <Root>
          <table aria-label="custom pagination table" cellSpacing="0">
            <thead>
              <tr>
                <th>No</th>
                <th>Transaction ID</th>
                <th>Date</th>
                <th>Earning</th>
              </tr>
            </thead>
            <tbody>
              {history.map((row, idx) => (
                <tr key={idx}>
                  <td>{idx + 1}</td>
                  <td>{txShorter(row.transaction)}</td>
                  <td>{row.date}</td>
                  <td>{row.earning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Root>
        <Box display="flex" justifyContent="space-between" marginTop="5px">
          <Box display="flex" justifyContent="space-between" width="60%">
            <Box display="flex" alignItems="center">
              <Typography variant="h4">Show</Typography>
              <Box height="100%" marginLeft="5px">
                <CustomTitle
                  width="32px"
                  height="21px"
                  fontSize="12px"
                  fontWeight="600"
                  color="#323232"
                  background="#E0A501"
                  borderRadius="5px"
                  title="10"
                />
              </Box>
              <Box height="100%" marginLeft="5px">
                <CustomTitle
                  width="32px"
                  height="21px"
                  fontSize="12px"
                  fontWeight="600"
                  color="#EDEDED"
                  background="#5A5A5A"
                  borderRadius="5px"
                  title="50"
                />
              </Box>
              <Box height="100%" marginLeft="5px">
                <CustomTitle
                  width="32px"
                  height="21px"
                  fontSize="12px"
                  fontWeight="600"
                  color="#EDEDED"
                  background="#5A5A5A"
                  borderRadius="5px"
                  title="100"
                />
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              <Box height="100%" marginLeft="5px">
                <CustomTitle
                  width="21px"
                  height="21px"
                  fontSize="12px"
                  fontWeight="600"
                  color="#323232"
                  background="#E0A501"
                  borderRadius="20px"
                  title="1"
                />
              </Box>
              <Box height="100%" marginLeft="5px">
                <CustomTitle
                  width="21px"
                  height="21px"
                  fontSize="12px"
                  fontWeight="600"
                  color="#EDEDED"
                  background="#5A5A5A"
                  borderRadius="20px"
                  title="2"
                />
              </Box>
              <Box height="100%" marginLeft="5px">
                <CustomTitle
                  width="21px"
                  height="21px"
                  fontSize="12px"
                  fontWeight="600"
                  color="#EDEDED"
                  background="#5A5A5A"
                  borderRadius="20px"
                  title="3"
                />
              </Box>
              <Box height="100%" marginLeft="5px">
                <CustomTitle
                  width="21px"
                  height="21px"
                  fontSize="12px"
                  fontWeight="600"
                  color="#EDEDED"
                  background="#5A5A5A"
                  borderRadius="20px"
                  title="4"
                />
              </Box>
              <Box height="100%" marginLeft="5px">
                <CustomTitle
                  width="21px"
                  height="21px"
                  fontSize="12px"
                  fontWeight="600"
                  color="#EDEDED"
                  background="#5A5A5A"
                  borderRadius="20px"
                  title=">"
                />
              </Box>
            </Box>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center">
            <Typography fontSize="12px" fontWeight="600" color="#E0A501">
              10/
            </Typography>
            <Typography fontSize="12px" fontWeight="600" color="#EDEDED">
              50
            </Typography>
          </Box>
        </Box>
      </Box>
    </CustomCard>
  );
};

export default EarningHistoryTable;
