import { Helmet } from 'react-helmet-async';
import { Container, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Hero from './Hero';
import LicenseMenu from './LicenseMenu';
import History from './History';
import HelpCard from './HelpCard';
import TimeCounter from './TimeCounter';

const useStyles = makeStyles((theme) => ({
  // CONTAINER CUSTOM STYLE
  customPadding: {
    position: 'relative',
    padding: '258px 50px 60px 40px !important',
    '@media (max-width: 1280px)': {
      padding: '230px 20px !important'
    }
  }
}));

const SmartArmy = () => {
  const classes = useStyles();

  return (
    <>
      <Helmet>
        <title>Main | Smart Army License</title>
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
            <TimeCounter />
          </Grid>

          <Grid item xs={12}>
            <LicenseMenu />
          </Grid>

          <Grid item xs={12} md={7}>
            <History />
          </Grid>

          <Grid item xs={12} md={5}>
            <HelpCard />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SmartArmy;
