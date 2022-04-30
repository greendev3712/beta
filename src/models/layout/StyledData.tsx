import { styled } from '@mui/material/styles';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { Switch, Button } from '@mui/material';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}
export const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));

export const AntSwitch = styled(Switch)(({ theme }) => ({
  width: 60,
  height: 32,
  padding: 0,
  borderRadius: '20px',
  display: 'flex',
  '&:active': {
    '& .MuiSwitch-thumb': {
      width: 32,
      color: '#FFF',
      backgroundColor: '#FFF'
    },
    '& .MuiSwitch-switchBase.Mui-checked': {
      transform: 'translateX(9px)',
      color: '#FFF',
      backgroundColor: '#FFF'
    }
  },
  '& .MuiSwitch-switchBase': {
    padding: 0,
    '&.Mui-checked': {
      transform: 'translateX(26px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#E0A501' : '#695400'
      }
    }
  },
  '& .MuiSwitch-thumb': {
    boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
    width: 32,
    height: 32,
    borderRadius: 16,
    color: '#FFF',
    backgroundColor: '#FFF',
    transition: theme.transitions.create(['width'], {
      duration: 200
    })
  },
  '& .MuiSwitch-track': {
    borderRadius: 16,
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? '#695400' : 'rgba(0,0,0,.25)',
    boxSizing: 'border-box'
  }
}));

export const ProfileButtonGroup = styled(Button)({
  padding: '7px 10px',
  background: 'linear-gradient(180deg, #5A5A5A 0%, #212121 100%)',
  borderRadius: '10px',
  width: '280px',
  height: '30px',
  fontSize: '14px',
  fontWeight: '600',
  textAlign: 'center',
  color: '#EDEDED',
  marginTop: '10px',
  '&:hover': {
    background: '#E0A501'
  }
});

export const UploadPhotoButton = styled(Button)({
  padding: '9px 20px',
  background: 'linear-gradient(180deg, #212121 0%, #000000 100%)',
  border: '3px solid #323232',
  borderRadius: '20px',
  height: '42px',
  fontSize: '20px',
  textAlign: 'center',
  color: '#E0A501',
  marginTop: '6px',
  '&:hover': {
    background: '#E0A501'
  }
});

export const SaveButton = styled(Button)({
  padding: '9px 20px',
  background: '#E0A501',
  boxShadow: '21.7832px 21.7832px 10.8916px rgba(0, 0, 0, 0.5)',
  borderRadius: '35px',
  width: '240px',
  height: '50px',
  fontSize: '24px',
  textAlign: 'center',
  color: '#212121',
  marginTop: '60px',
  '&:hover': {
    background: '#E0A501'
  }
});
