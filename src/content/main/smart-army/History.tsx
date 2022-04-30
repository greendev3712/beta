import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import CustomCard from 'src/components/Card';
import { makeStyles } from '@mui/styles';
import { useWeb3React } from '@web3-react/core';
import useRequest from 'src/hooks/useRequest';
import useSmartArmy from 'src/hooks/useSmartArmy';
import { getContractAddress } from 'src/utils';
import { TRIAL, OPPORTUNIST, RUNNER, VISIONARY } from 'src/utils/licenseInfo';

const useStyles = makeStyles((theme) => ({
  customOutBoxStyle: {
    paddingRight: '30px',
    marginTop: '30px',
    '@media (max-width: 968px)': {
      paddingRight: '0px'
    }
  }
}));

const History = () => {
  const classes = useStyles();
  const { account, chainId } = useWeb3React();
  const { fetchTransaction } = useRequest();
  const { fetchLicense } = useSmartArmy();
  const [licenseHistory, setLicenseHistory] = useState([]);

  useEffect(() => {
    async function init() {
      const smartArmyAddress = getContractAddress('SmartArmy', chainId);

      let licenseInfo = await fetchLicense(account);
      let licenseLevel = licenseInfo.level.toString();
      let licenseName = 'null';
      switch (licenseLevel) {
        case '0':
          licenseName = 'null';
          break;
        case '1':
          licenseName = TRIAL;
          break;
        case '2':
          licenseName = OPPORTUNIST;
          break;
        case '3':
          licenseName = RUNNER;
          break;
        case '4':
          licenseName = VISIONARY;
          break;
        default:
          licenseName = 'null';
          break;
      }

      let result = await fetchTransaction(account);
      if (result['data']) {
        let licenseArray = [TRIAL, OPPORTUNIST, RUNNER, VISIONARY];
        let licenseTitle = [];
        let licenseIndex = licenseArray.findIndex(
          (row, idx) => row === licenseName
        );
        licenseTitle = licenseArray
          .filter((row, idx) => idx <= licenseIndex)
          .reverse();
        let cArray = [];
        let cArray1 = [];
        cArray = result['data']['result'].filter((row) => {
          return row.to === smartArmyAddress;
        });
        let to =
          cArray.length - 1 >= licenseTitle.length
            ? licenseTitle.length
            : cArray.length - 1;
        for (let i = 0; i < to; i++) {
          if (
            (cArray.length - 1 > 1 && licenseTitle.length > 1 && i === 0) ||
            i !== to - 1
          ) {
            cArray1.push({
              transaction: cArray[i].hash,
              date: new Date(
                parseInt(cArray[i].timeStamp + '000')
              ).toLocaleDateString('en-US'),
              licenseName: licenseTitle[i],
              action: 'upgraded'
            });
          } else {
            cArray1.push({
              transaction: cArray[i].hash,
              date: new Date(
                parseInt(cArray[i].timeStamp + '000')
              ).toLocaleDateString('en-US'),
              licenseName: licenseTitle[i],
              action: 'exchanged'
            });
          }
        }
        setLicenseHistory(cArray1);
      }
    }
    if (account && chainId) init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <>
      <Box className={classes.customOutBoxStyle}>
        <CustomCard width="100%" height="380px" borderRadius="20px">
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <Typography
              marginTop="20px"
              marginLeft="20px"
              color="#E0A501"
              fontSize="36px"
              fontWeight="700"
            >
              History
            </Typography>
            <Box position="absolute" bottom="0" width="100%">
              <CustomCard width="100%" height="296px" borderRadius="20px">
                <Box
                  padding="20px"
                  display="flex"
                  flexDirection="column"
                  height="100%"
                >
                  {licenseHistory.length > 0 ? (
                    licenseHistory.map((con, idx) => (
                      <Typography
                        key={idx}
                        sx={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#EDEDED',
                          marginBottom: '20px',
                          lineHeight: '100%'
                        }}
                      >
                        You have successfully {con.action} your SMT with{' '}
                        {con.licenseName} License on {con.date}
                      </Typography>
                    ))
                  ) : (
                    <Typography variant="h4">
                      You don’t have any license yet
                    </Typography>
                  )}
                </Box>
              </CustomCard>
            </Box>
          </Box>
        </CustomCard>
      </Box>
    </>
  );
};

export default History;
