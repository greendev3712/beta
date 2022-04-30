import { useState } from 'react';
import { Box, Hidden, useTheme, Theme } from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import { makeStyles } from '@mui/styles';
import {
  sliderImages,
  mobileHeroSlide
} from 'src/models/main/dashboard/SampleData';

const useStyles = makeStyles((theme) => ({
  heroCustomStyle: {
    height: '300px',
    display: 'block',
    overflow: 'hidden',
    width: '100%',
    '@media (max-width: 1280px)': {
      marginTop: '100px'
    }
  },
  heroMobileCustomStyle: {
    height: '100%',
    display: 'block',
    overflow: 'hidden',
    width: '100%',
    '@media (max-width: 1280px)': {
      marginTop: '100px'
    }
  }
}));

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

function ImageSlider() {
  const theme: Theme = useTheme();
  const classes = useStyles();

  const [activeStep, setActiveStep] = useState<number>(0);

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Hidden lgDown>
        <AutoPlaySwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {sliderImages.map((step, index) => (
            <div key={index}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  component="img"
                  className={classes.heroCustomStyle}
                  src={step.path}
                  alt={step.name}
                />
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
      </Hidden>
      <Hidden lgUp>
        <AutoPlaySwipeableViews
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={activeStep}
          onChangeIndex={handleStepChange}
          enableMouseEvents
        >
          {mobileHeroSlide.map((step, index) => (
            <div key={index}>
              {Math.abs(activeStep - index) <= 2 ? (
                <Box
                  component="img"
                  className={classes.heroMobileCustomStyle}
                  src={step.path}
                  alt={step.name}
                />
              ) : null}
            </div>
          ))}
        </AutoPlaySwipeableViews>
      </Hidden>
    </Box>
  );
}

export default ImageSlider;
