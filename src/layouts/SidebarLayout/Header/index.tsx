import { useContext } from 'react';
import { Box, Hidden, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { SidebarContext } from 'src/contexts/SidebarContext';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone';
import HeaderMenu from './Menu';
import HeaderButtons from './Buttons';
import HeaderUserbox from './Userbox';
import Logo from 'src/components/Logo';

const useStyles = makeStyles({
  headerRightPadding: {
    paddingRight: '34px',
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 1280px)': {
      paddingRight: '4px'
    }
  }
});

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
    padding: ${theme.spacing(0, 2)};
    right: 0;
    z-index: 5;
    position: fixed;
    justify-content: space-between;
    width: 100%;
    height: 100px;
    background: #2f2f2f;
    display: flex;
    align-items: center;
    @media (min-width: 1280px) {
      width: auto;
      left: 300px;
      height: 90px;
      background: linear-gradient(180deg, #212121 0%, rgba(33, 33, 33, 0) 100%);
    }
    @media (max-width: 1280px) {
      padding-top: 50px;
    }
`
);

const Header = () => {
  const classes = useStyles();
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);

  return (
    <HeaderWrapper>
      <Box display="flex" alignItems="center" paddingLeft='3px'>
        <Hidden lgUp>
          <Tooltip arrow title="Toggle Menu">
            <IconButton
              color="primary"
              onClick={toggleSidebar}
              sx={{ color: '#E0A501' }}
            >
              {!sidebarToggle ? <MenuTwoToneIcon /> : <CloseTwoToneIcon />}
            </IconButton>
          </Tooltip>
        </Hidden>
        <Hidden lgDown>
          <HeaderMenu />
        </Hidden>
      </Box>

      <Hidden lgUp>
        <Box display="flex" alignItems="center">
          <Logo />
        </Box>
      </Hidden>

      <Box className={classes.headerRightPadding}>
        <HeaderButtons />
        <Hidden lgUp>
          <HeaderUserbox />
        </Hidden>
      </Box>
    </HeaderWrapper>
  );
};

export default Header;
