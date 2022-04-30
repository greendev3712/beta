import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import RowBox from 'src/components/Box/RowBox';
import { useTimeDiscount } from 'src/hooks/useTimeCount';

const useStyles = makeStyles((theme) => ({
  licenseTimeStyle: {
    height: '42px',
    width: '390px !important',
    background: '#323232',
    borderRadius: '20px',
    float: 'right',
    padding: '0 20px',
    '@media (max-width: 968px)': {
      float: 'none',
      margin: '0 auto'
    }
  }
}));

const TimeCounter = () => {
  const classes = useStyles();
  const { remain } = useTimeDiscount('');

  return (
    <RowBox className={classes.licenseTimeStyle} justifyContent="flex-start">
      <Typography variant="h4">Current license expires in:</Typography>
      <Typography variant="h4" color="#E0A501" marginLeft="3px">
        {remain}
      </Typography>
    </RowBox>
  );
};

export default TimeCounter;
