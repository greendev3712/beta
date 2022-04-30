import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import NobilityImageSlider from './Nobility_ImageSlider';
import NobilityProgress from './Nobility_Progress';
import NobilityTitle from './Nobility_Title';
import NobilityCollected from './Nobility_Collected';
import ColumnBox from 'src/components/Box/ColumnBox';
import useSmartAchievement from 'src/hooks/useSmartAchievement';
import { useWeb3React } from '@web3-react/core';

const useStyles = makeStyles({
  outBoxStyle: {
    paddingRight: '60px',
    '@media (max-width: 968px)': {
      paddingRight: '0px'
    }
  }
});

const Nobility = () => {
  const classes = useStyles();
  const { account, chainId } = useWeb3React();
  const { getNobilityTypeOf } = useSmartAchievement();

  const [nobilityTitles, setNobilityTitles] = useState<string>('');

  useEffect(() => {
    async function init() {
      let titleOfValues = await getNobilityTypeOf(account);
      setNobilityTitles(titleOfValues);
    }
    if (account && chainId) init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId]);

  return (
    <>
      <Grid item xs={12} md={6} lg={6} marginTop="30px">
        <ColumnBox className={classes.outBoxStyle}>
          <NobilityImageSlider />

          <NobilityProgress titles={nobilityTitles} />

          <NobilityTitle titles={nobilityTitles} />
        </ColumnBox>
      </Grid>

      <Grid item xs={12} md={6} lg={6} marginTop="30px">
        <NobilityCollected titles={nobilityTitles} />
      </Grid>
    </>
  );
};

export default Nobility;
