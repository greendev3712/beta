import React from 'react';
import { Box, Typography, useTheme, Theme } from '@mui/material';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';
import CustomCard from 'src/components/Card';
import CustomTooltip from 'src/components/Tooltip';
import { CurrentTaxStyle } from 'src/models/main/dashboard/CustomStyles';
import { sellContent } from 'src/models/SampleData';

const Sell = (props) => {
  const theme: Theme = useTheme();
  const classes = CurrentTaxStyle(theme);
  const { info, intermediary } = props;

  return (
    <>
      <Box display="flex" width="100%">
        <ColumnBox width="35%" padding="0 5px">
          <CustomCard
            height="48%"
            width="100%"
            border="none"
            background="linear-gradient(180deg, #C59100 -5%, #4B3C00 72%)"
          >
            <Box padding="12px 0 10px 0">
              <Typography variant="h1" className={classes.numTitleStyle}>
                {intermediary
                  ? info?._sellIntermediaryTaxFee?.toString()
                  : info?._sellNormalTaxFee.toString()}
                %
              </Typography>
              <RowBox width="48px" margin="1px auto" height="13px">
                <Typography variant="h4" color="#24ae5f">
                  10%
                </Typography>
                <CustomTooltip
                  content="When you swap using intermediary, you will get reduced tax (10%)"
                  width="220px"
                />
              </RowBox>
              <Typography variant="h3" className={classes.totalTaxTitleStyle1}>
                Total tax
              </Typography>
            </Box>
          </CustomCard>
          <CustomCard
            height="48%"
            width="100%"
            border="none"
            background="linear-gradient(180deg, #5A5A5A 0%, #212121 100%)"
          >
            <ColumnBox padding="10px 3px 10px 3px" height="100%">
              <Typography variant="h1" className={classes.numTitleStyle}>
                {info?._sellFarmingFee?.toString()}%
              </Typography>
              <Typography variant="h5" className={classes.descTitleStyle}>
                Goes to sell tax distribution for farming rewards
              </Typography>
            </ColumnBox>
          </CustomCard>
        </ColumnBox>

        <Box className={classes.outBoxStyle2}>
          {sellContent.map((rows, idx) => (
            <ColumnBox key={idx} width="50%" padding="0 5px">
              {rows.map((row, index) => (
                <CustomCard
                  key={index}
                  height="48%"
                  width="100%"
                  border="none"
                  background={theme.colors.gradients.grey}
                >
                  <ColumnBox padding="10px 3px 10px 3px" height="100%">
                    <Typography variant="h1" className={classes.numTitleStyle}>
                      {info?.[row.key]?.toString()} %
                    </Typography>
                    <Typography variant="h5" className={classes.descTitleStyle}>
                      {row.desc}
                    </Typography>
                  </ColumnBox>
                </CustomCard>
              ))}
            </ColumnBox>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default React.memo(Sell);
