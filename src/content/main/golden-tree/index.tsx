import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Hero from './Hero';
import { Container, Grid, Hidden } from '@mui/material';
import { makeStyles } from '@mui/styles';
import StatisticHeader from './StatisticHeader';
import TreeSection from './TreeSection';
import HistoryTable from './HistoryTable';
import RewardQualification from './RewardQualification';

const useStyles = makeStyles((theme) => ({
  // CONTAINER CUSTOM STYLE
  customPadding: {
    padding: '30px 80px !important',
    '@media (max-width: 1280px)': {
      padding: '20px !important'
    }
  }
}));

const GoldenTree = () => {
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>Main | Golden Tree</title>
      </Helmet>
      <Hero />
      <Container maxWidth="xl" className={classes.customPadding}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
        >
          <Grid item xs={12}>
            <StatisticHeader />
          </Grid>

          <Grid item xs={12}>
            <TreeSection />
          </Grid>

          <Hidden mdDown>
            <Grid item xs={12} md={7}>
              <HistoryTable />
            </Grid>

            <Grid item xs={12} md={5}>
              <RewardQualification />
            </Grid>
          </Hidden>
        </Grid>
      </Container>
    </>
  );
};

export default GoldenTree;
