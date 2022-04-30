import React from 'react';
import { Box, Typography, Divider, Hidden } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomButton from 'src/components/Button';
import RowBox from 'src/components/Box/RowBox';
import ColumnBox from 'src/components/Box/ColumnBox';
import { GotPopoverStyle } from 'src/models/main/smart-army/CustomStyle';
import { privilege } from 'src/models/layout/SampleData';
import { licenseNameToLevel } from 'src/utils/licenseInfo';

interface ParentProps {
  onHandleVisionaryClose: (e: React.MouseEvent) => void;
  onHandleVisionaryNext: (e: React.MouseEvent, value: string) => void;
  desireLicense: string;
  curLicense: string;
}

const gotImage = {
  name: 'got',
  path: '/static/img/main_smart/visionary/got.png',
  desc: 'got background'
};
const rightImage = {
  name: 'right',
  path: '/static/img/main_smart/right.svg',
  desc: 'right'
};

const GotPopover = (props: ParentProps) => {
  const classes = GotPopoverStyle();

  return (
    <Box className={classes.customOutBoxStyle}>
      <CloseIcon
        onClick={props.onHandleVisionaryClose}
        className={classes.closeIconStyle}
      />
      <Hidden mdDown>
        <Box
          component="img"
          src={gotImage.path}
          alt={gotImage.name}
          sx={{
            position: 'absolute',
            top: '0',
            left: '0'
          }}
        />
      </Hidden>
      <Box className={classes.customInnerBoxStyle}>
        <Hidden mdUp>
          <Typography className={classes.customHeadingTitle}>
            This upgrade works by liquidating your previous license & exchange &
            activate new license. The liquidation rate & exchange fee is going
            to be charged
          </Typography>
        </Hidden>
        <Hidden mdDown>
          <Typography variant="h2" color="#E0A501" fontWeight="700">
            Look! Additional privileges have been added to your account. You
            look super cool now!
          </Typography>
        </Hidden>
        <RowBox marginTop="30px" justifyContent="space-evenly">
          <ColumnBox>
            <Box
              component="img"
              src={
                '/static/img/main_smart/' +
                props.curLicense.toLowerCase() +
                '.png'
              }
              alt="current-img"
              sx={{
                width: '150px'
              }}
            />
            <Typography variant="h3" fontWeight="700" color="#E0A501">
              Before
            </Typography>
          </ColumnBox>
          <Box component="img" src={rightImage.path} alt={rightImage.name} />
          <ColumnBox>
            <Box
              component="img"
              src={
                '/static/img/main_smart/' +
                props.desireLicense.toLowerCase() +
                '.png'
              }
              alt="desire-img"
              sx={{
                width: '150px'
              }}
            />
            <Typography variant="h3" fontWeight="700" color="#E0A501">
              After
            </Typography>
          </ColumnBox>
        </RowBox>
        <Hidden mdDown>
          <RowBox marginTop="10px" justifyContent="center">
            <Box textAlign="left" marginRight="20px" width="280px">
              <Typography variant="h4" color="#E0A501">
                &#8226; Teamwork ladder lv.
                {privilege[licenseNameToLevel(props.curLicense) - 1]['ladder']}
              </Typography>
              <Typography variant="h4" color="#E0A501">
                &#8226; Entitled to be an SMT intermediary
              </Typography>
              <Typography variant="h4" color="#E0A501">
                &#8226; Farming rewards:
              </Typography>
              {privilege[licenseNameToLevel(props.curLicense) - 1]['rewards']}
              <Typography variant="h4" color="#E0A501">
                &#8226; Access to Smart Academy, Smart Living, Smart Utilities,
                Smart Wealth (
                {privilege[licenseNameToLevel(props.curLicense) - 1]['title']})
              </Typography>
            </Box>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ height: '100%', border: '2px solid #E0A501' }}
            />
            <Box textAlign="left" marginLeft="30px" width="280px">
              <Typography variant="h4" color="#E0A501">
                &#8226; Teamwork ladder lv.
                {
                  privilege[licenseNameToLevel(props.desireLicense) - 1][
                    'ladder'
                  ]
                }
              </Typography>
              <Typography variant="h4" color="#E0A501">
                &#8226; Entitled to be an SMT intermediary
              </Typography>
              <Typography variant="h4" color="#E0A501">
                &#8226; Farming rewards:
              </Typography>
              {
                privilege[licenseNameToLevel(props.desireLicense) - 1][
                  'rewards'
                ]
              }
              <Typography variant="h4" color="#E0A501">
                &#8226; Access to Smart Academy, Smart Living, Smart Utilities,
                Smart Wealth (
                {
                  privilege[licenseNameToLevel(props.desireLicense) - 1][
                    'title'
                  ]
                }
                )
              </Typography>
            </Box>
          </RowBox>
        </Hidden>
        <CustomButton
          width="240px"
          height="50px"
          background="#E0A501"
          color="#212121"
          fontSize="20px"
          fontWeight="600"
          boxShadow="21.7832px 21.7832px 10.8916px rgba(0, 0, 0, 0.5)"
          borderRadius="35px"
          marginTop="40px"
          onHandleClick={(e) =>
            props.onHandleVisionaryNext(e, 'visionary_thank')
          }
        >
          Got it
        </CustomButton>
      </Box>
    </Box>
  );
};

export default GotPopover;
