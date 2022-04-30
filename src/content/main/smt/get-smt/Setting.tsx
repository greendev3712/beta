import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, Popover, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import CloseIcon from '@mui/icons-material/Close';
import { AntSwitch } from 'src/models/layout/StyledData';

// SettingSave BUTTON CUSTOMIZE
const SettingSaveButton = styled(Button)({
  backgroundColor: '#E0A501',
  borderRadius: '20px',
  width: '260px',
  height: '40px',
  fontSize: '18px',
  fontWeight: '600',
  textAlign: 'center',
  color: '#212121',
  '&:hover': {
    backgroundColor: '#695400'
  }
});

// SETTING ICON IMAGE
const settingIcon = {
  name: 'setting',
  path: '/static/img/main_smt/get_smt/setting.svg',
  desc: 'settingIcon'
};

const Setting = () => {
  const [isSettingOpen, setSettingOpen] = useState<boolean>(false);
  // SETTING BUTTON CLICK EVENT
  const onHandleSettingClick = (): void => {
    setSettingOpen(true);
  };
  const handleSettingClose = (): void => {
    setSettingOpen(false);
  };

  // useEffect(() => {
  // }, [])

  return (
    <>
      <Box
        component="img"
        sx={{ float: 'left', cursor: 'pointer' }}
        width="21px"
        height="21px"
        alt={settingIcon.name}
        src={settingIcon.path}
        onClick={onHandleSettingClick}
      ></Box>
      <Popover
        anchorReference="anchorPosition"
        anchorPosition={{ top: 280, left: 500 }}
        onClose={handleSettingClose}
        open={isSettingOpen}
      >
        <Box
          sx={{
            padding: '20px 20px 30px 20px !important',
            background: 'linear-gradient(180deg, #212121 0%, #000000 100%)',
            border: '2px solid #5A5A5A',
            boxSizing: 'border-box',
            borderRadius: '10px',
            height: '445px',
            width: '445px'
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: '24px',
                fontWeight: '700',
                height: '29px',
                color: '#E0A501'
              }}
            >
              Settings
            </Typography>
            <CloseIcon
              onClick={handleSettingClose}
              sx={{ cursor: 'pointer', color: '#EDEDED' }}
            />
          </Box>
          <Divider
            sx={{
              border: '2px solid #323232',
              height: '2px',
              marginTop: '10px'
            }}
          />
          <Box
            position="relative"
            sx={{
              height: '16px',
              marginTop: '30px'
            }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontSize: '18px',
                color: '#EDEDED',
                lineHeight: '0px !important',
                letterSpacing: '1px'
              }}
            >
              Slippage tolerance
            </Typography>
            <Box sx={{ float: 'right' }}>
              <FormControlLabel
                value="end"
                control={
                  <Checkbox
                    sx={{
                      padding: '0 !important',
                      margin: '0 !important',
                      color: '#E0A501'
                    }}
                  />
                }
                label="Auto set to lowest tax"
                labelPlacement="end"
                sx={{
                  padding: '0 !important',
                  margin: '0 !important',
                  color: '#EDEDED'
                }}
              />
            </Box>
          </Box>
          <Box display="flex" alignItems="center" sx={{ marginTop: '20px' }}>
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontSize: '14px',
                color: '#212121',
                padding: '7px 20px',
                background: '#E0A501',
                borderRadius: '20px',
                width: '70px',
                height: '32px'
              }}
            >
              0.1%
            </Typography>
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontSize: '14px',
                color: '#EDEDED',
                padding: '7px 20px',
                background: '#5A5A5A',
                borderRadius: '20px',
                width: '70px',
                height: '32px',
                marginLeft: '20px'
              }}
            >
              0.5%
            </Typography>
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontSize: '14px',
                color: '#EDEDED',
                padding: '7px 20px',
                background: '#5A5A5A',
                borderRadius: '20px',
                width: '70px',
                height: '32px',
                marginLeft: '20px'
              }}
            >
              1.0%
            </Typography>
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontSize: '14px',
                color: '#EDEDED',
                padding: '7px 7px',
                background: '#5A5A5A',
                borderRadius: '20px',
                width: '100px',
                height: '32px',
                marginLeft: '20px'
              }}
            >
              ... %
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              marginTop: '22px',
              height: '32px'
            }}
          >
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontSize: '18px',
                color: '#EDEDED',
                letterSpacing: '1px'
              }}
            >
              Tx deadline (mins)
            </Typography>
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontSize: '18px',
                padding: '3px 17px',
                background: '#E0A501',
                borderRadius: '20px',
                width: '60px',
                height: '32px',
                color: '#212121'
              }}
            >
              20
            </Typography>
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              marginTop: '14px',
              height: '32px',
              letterSpacing: '1px'
            }}
          >
            <Typography
              variant="h3"
              component="span"
              sx={{ fontSize: '18px', color: '#EDEDED' }}
            >
              Expert mode
            </Typography>
            <AntSwitch inputProps={{ 'aria-label': 'setted' }} />
          </Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            sx={{ marginTop: '14px', height: '32px' }}
          >
            <Typography
              variant="h3"
              component="span"
              sx={{
                fontSize: '18px',
                color: '#EDEDED',
                lineHeight: '0px !important',
                letterSpacing: '1px'
              }}
            >
              Disable Mutihops
            </Typography>
            <AntSwitch inputProps={{ 'aria-label': 'setted' }} />
          </Box>
          <Box sx={{ marginTop: '70px', textAlign: 'center' }}>
            <SettingSaveButton>Save</SettingSaveButton>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default React.memo(Setting);
