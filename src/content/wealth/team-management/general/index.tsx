import React, { useLayoutEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Grid, Box } from '@mui/material';
import CustomButton from 'src/components/Button';
import TableContainer from './TableContainer';
import Hero from '../Hero';
import { TeamGeneralStyle } from 'src/models/wealth/team/CustomStyle';

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([
        window.innerWidth < 600 ? 91 : 120,
        window.innerWidth < 600 ? 26 : 34
      ]);
    }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

const General = () => {
  const classes = TeamGeneralStyle();
  const [width, height] = useWindowSize();
  const [curVal, setCurVal] = useState<number>(0);
  const onHandleClickLadder = (value) => {
    setCurVal(value);
  };

  return (
    <>
      <Helmet>
        <title>Wealth | Team - General</title>
      </Helmet>
      <Hero />
      <Container maxWidth="xl" className={classes.customPadding}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
        >
          {/* LEVEL GROUP */}
          <Grid item xs={12} className={classes.customScrollStyle}>
            <Box
              display="flex"
              justifyContent="space-between"
              className={classes.customLevelStyle}
            >
              {Array(7)
                .fill(0)
                .map((con, idx) => (
                  <CustomButton
                    key={idx}
                    width={width + 'px'}
                    height={height + 'px'}
                    background={curVal === idx ? '#695400' : '#E0A501'}
                    color={curVal === idx ? '#EDEDED' : '#212121'}
                    fontSize="18px"
                    fontWeight="600"
                    boxShadow="4px 4px 4px rgba(0, 0, 0, 0.25), inset -1px -3px 4px rgba(0, 0, 0, 0.25)"
                    borderRadius="20px"
                    onHandleClick={() => onHandleClickLadder(idx)}
                  >
                    {'Level ' + (1 + idx)}
                  </CustomButton>
                ))}
            </Box>
          </Grid>
          <TableContainer curLadderLevel={curVal} />
        </Grid>
      </Container>
    </>
  );
};

export default React.memo(General);
