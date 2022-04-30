import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { tooltipImages } from 'src/models/main/achievement/SampleData';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';

const NobilityTooltip = ({ nextNobleInfo }) => {
  return (
    <>
      <RowBox>
        <Box
          component="img"
          width="71px"
          height="53px"
          alt={tooltipImages[nextNobleInfo.name].name}
          src={tooltipImages[nextNobleInfo.name].path}
        />
        <Box textAlign="left" width="100%" marginLeft="10px">
          <Typography component="div" variant="h2" color="#E0A501">
            {nextNobleInfo.name + "'s"}
          </Typography>
          <Typography component="div" variant="h4">
            Privileges
          </Typography>
          <Divider sx={{ border: '2px solid #323232', marginTop: '6px' }} />
        </Box>
      </RowBox>

      <Box marginTop="20px">
        <RowBox>
          <ColumnBox width="110px" height="130px">
            <Box
              component="img"
              src={tooltipImages['tree'].path0}
              alt={tooltipImages['tree'].name}
              width="60px"
              height="71px"
            />
            <Box
              component="img"
              src={tooltipImages['tree'].path1}
              alt={tooltipImages['tree'].name}
              width="34px"
              height="34px"
              sx={{
                position: 'absolute',
                top: '45px',
                right: '22px'
              }}
            />
            <Typography textAlign="center" variant="h4">
              {tooltipImages['tree'].desc0}
            </Typography>
            <Typography textAlign="center" variant="h3" color="#E0A501">
              {tooltipImages[nextNobleInfo.name].smtc}
            </Typography>
          </ColumnBox>
          <ColumnBox width="110px" height="130px">
            <Box
              component="img"
              src={tooltipImages['share'].path}
              alt={tooltipImages['share'].name}
              width="92px"
              height="74px"
            />
            <Typography textAlign="center" variant="h4">
              {tooltipImages['share'].desc0}
            </Typography>
            <Typography textAlign="center" variant="h3" color="#E0A501">
              {tooltipImages[nextNobleInfo.name].passive}
            </Typography>
          </ColumnBox>
        </RowBox>
      </Box>

      <Box marginTop="4px">
        <ColumnBox width="110px" height="130px">
          <Box
            component="img"
            src={tooltipImages['reward'].path}
            alt={tooltipImages['reward'].name}
            width="78px"
            height="76px"
          />
          <Typography textAlign="center" variant="h4">
            {tooltipImages['reward'].desc0}
          </Typography>
          <Typography textAlign="center" variant="h3" color="#E0A501">
            weekly
          </Typography>
        </ColumnBox>
      </Box>
    </>
  );
};

export default React.memo(NobilityTooltip);
