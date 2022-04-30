import { useState, useCallback, useEffect } from 'react';
import { Box, Popover, Typography, Backdrop } from '@mui/material';
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useWeb3React } from '@web3-react/core';
import useSmartArmy from 'src/hooks/useSmartArmy';
import { userAvatar, nonProfileImage } from 'src/models/ImageUrl';
import {
  ProfileButtonGroup,
  UploadPhotoButton,
  SaveButton
} from 'src/models/layout/StyledData';
import { CustomProfileStyle } from 'src/models/layout/CustomStyle';

const useToogleCustomProfileButton = (initialState) => {
  const [isCustoProfile, setCustoProfile] = useState<boolean>(initialState);
  const onHandleCustoProfileClick = useCallback(
    () => setCustoProfile(true),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCustoProfile]
  );
  const onHandleCustoClose = useCallback(
    () => setCustoProfile(false),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isCustoProfile]
  );

  return [
    isCustoProfile,
    onHandleCustoProfileClick,
    onHandleCustoClose
  ] as const;
};

const CustomizeProfile = () => {
  const classes = CustomProfileStyle();
  const { account, chainId } = useWeb3React();
  const [isCustoProfile, onHandleCustoProfileClick, onHandleCustoClose] =
    useToogleCustomProfileButton(false);
  const { fetchLicense, fetchUserInfo } = useSmartArmy();

  const [userInfo, setUserInfo] = useState({
    userName: '',
    telegram: '',
    pictureUrl: ''
  });
  const [lStatus, setLstatus] = useState<number>(0);

  useEffect(() => {
    async function init() {
      let licenseInfo = await fetchLicense(account);
      let user = await fetchUserInfo(account);
      setUserInfo({
        userName: user.username,
        telegram: user.telegram,
        pictureUrl: licenseInfo.tokenUri
      });
      setLstatus(licenseInfo.status);
    }
    if (account && chainId) init();
    return () => {
      setUserInfo((prev) => ({ ...prev }));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, chainId, lStatus]);

  return (
    <>
      <ProfileButtonGroup onClick={onHandleCustoProfileClick}>
        Customize Profile
      </ProfileButtonGroup>

      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isCustoProfile}
      >
        <Popover
          anchorReference={'none'}
          classes={{
            root: classes.popoverRoot
          }}
          onClose={onHandleCustoClose}
          open={isCustoProfile}
          PaperProps={{
            style: {
              width: '450px',
              boxShadow: 'none'
            }
          }}
        >
          <Box className={classes.outBoxStyle}>
            <CloseIcon
              onClick={onHandleCustoClose}
              sx={{
                cursor: 'pointer',
                position: 'absolute',
                top: '16px',
                right: '16px',
                color: '#EDEDED'
              }}
            />
            <Box>
              <Typography
                variant="h2"
                sx={{
                  color: '#E0A501',
                  padding: '0 30px'
                }}
              >
                Customize Profile
              </Typography>
              {lStatus === 0 || !account ? (
                <Box
                  component="img"
                  alt={userAvatar.name}
                  src={nonProfileImage.avatar}
                  sx={{
                    width: '150px',
                    height: '150px',
                    cursor: 'pointer',
                    margin: 'auto',
                    marginTop: '30px'
                  }}
                />
              ) : (
                <Box
                  component="img"
                  alt={userAvatar.name}
                  src={userInfo.pictureUrl}
                  sx={{
                    width: '150px',
                    height: '150px',
                    cursor: 'pointer',
                    margin: 'auto',
                    borderRadius: '50%',
                    marginTop: '30px'
                  }}
                />
              )}
              <Typography variant="h4">Customize Profile</Typography>
              <UploadPhotoButton onClick={onHandleCustoProfileClick}>
                Upload photo
              </UploadPhotoButton>
            </Box>
            <Box width="100%">
              <Box textAlign="left" marginTop="16px">
                <Typography
                  component="span"
                  sx={{
                    fontSize: '13px',
                    height: '16px',
                    color: '#EDEDED',
                    textAlign: 'center'
                  }}
                >
                  Username
                </Typography>
                <Typography
                  component="span"
                  sx={{
                    fontSize: '13px',
                    height: '16px',
                    color: '#F84343',
                    textAlign: 'center',
                    marginLeft: '5px'
                  }}
                >
                  (cannot be modified)
                </Typography>
                <Box className={classes.disabledNameBox}>
                  <Typography
                    component="span"
                    sx={{
                      fontSize: '20px',
                      height: '25px',
                      color: '#EDEDED',
                      textAlign: 'center',
                      marginLeft: '20px'
                    }}
                  >
                    {userInfo.userName ? userInfo.userName : 'User Name'}
                  </Typography>
                </Box>
              </Box>
              <Box textAlign="left" marginTop="16px">
                <Typography
                  component="span"
                  sx={{
                    fontSize: '13px',
                    height: '16px',
                    color: '#EDEDED',
                    textAlign: 'center'
                  }}
                >
                  Your telegram account
                </Typography>
                <FormControl
                  variant="outlined"
                  className={classes.searchBarStyle}
                >
                  <OutlinedInput
                    id="outlined-adornment-weight"
                    placeholder="t.me/mark77 or @mark77"
                    aria-describedby="outlined-weight-helper-text"
                    inputProps={{
                      'aria-label': 'weight'
                    }}
                    className={classes.inputStyle}
                    value={userInfo.telegram}
                  />
                </FormControl>
              </Box>
            </Box>
            <SaveButton onClick={onHandleCustoClose}>Save</SaveButton>
          </Box>
        </Popover>
      </Backdrop>
    </>
  );
};

export default CustomizeProfile;
