import React from 'react';
import { Box, Typography, useTheme, Theme } from '@mui/material';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';
import CustomCard from 'src/components/Card';
import CustomTooltip from 'src/components/Tooltip';
import { CurrentTaxStyle } from 'src/models/main/dashboard/CustomStyles';
import { buyContent } from 'src/models/SampleData';

const Buy = (props) => {
  const theme: Theme = useTheme();
  const classes = CurrentTaxStyle(theme);
  const { info, intermediary } = props;

  return (
    <>
      <Box className={classes.outBoxStyle1}>
        <CustomCard
          height="100%"
          width="100%"
          border="none"
          background="linear-gradient(180deg, #C59100 -5%, #4B3C00 72%)"
        >
          <Box className={classes.innerBoxStyle1}>
            <Typography className={classes.percentTitleStyle}>
              {intermediary
                ? info?._buyIntermediaryTaxFee?.toString()
                : info?._buyNormalTaxFee?.toString()}
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
            <Typography variant="h3" className={classes.totalTaxTitleStyle}>
              Total tax
            </Typography>
          </Box>
        </CustomCard>
      </Box>
      <Box className={classes.outBoxStyle2}>
        {buyContent.map((rows, idx) => (
          <ColumnBox key={idx} width="50%" padding="0 5px">
            {rows.map((row, index) => (
              <CustomCard
                key={index}
                height="48%"
                width="100%"
                border="none"
                background={theme.colors.gradients.grey}
              >
                <ColumnBox padding="10px 2px 10px 2px" height="100%">
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
    </>
  );
};

export default React.memo(Buy);
