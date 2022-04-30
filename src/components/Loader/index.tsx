import React from 'react';
import { Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  loading: {
    '&, &:after, &:before': {
      background: '#212121',
      animation: '$flicker 1.2s infinite ease-in-out',
      width: '3px',
      height: '12px'
    },
    '&:before, &:after': {
      position: 'absolute',
      top: '0',
      content: '""'
    },
    '&:before': {
      left: '-7px',
      animationDelay: '-0.32s'
    },
    '&:after': {
      left: '7px'
    },
    '&': {
      color: '#212121',
      textIndent: '-9999em',
      position: 'relative',
      fontSize: '5px !important',
      transform: 'translateZ(0)',
      animationDelay: '-0.16s',
      margin: '0 15px !important'
    }
  },
  '@keyframes flicker': {
    '0%': {
      boxShadow: '0 0',
      height: '12px'
    },
    '80%': {
      boxShadow: '0 0',
      height: '12px'
    },
    '100%': {
      boxShadow: '0 0',
      height: '12px'
    },
    '40%': {
      boxShadow: '0 -2em',
      height: '16px'
    }
  }
});

const Loader = () => {
  const classes = useStyles();

  return <Typography className={classes.loading}></Typography>;
};

export default Loader;
