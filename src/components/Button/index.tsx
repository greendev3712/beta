import { ReactNode } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

interface CustomButtonProps {
  children?: ReactNode;
  title?: string;
  boxShadow?: string;
  border?: string;
  padding?: string;
  hoverBackground?: string;
  hoverColor?: string;
  height: string;
  width: string;
  background: string;
  color: string;
  borderRadius: string;
  marginTop?: string;
  fontSize: string;
  fontWeight: string;
  onHandleClick?: (
    e: React.MouseEvent<HTMLButtonElement>,
    value?: string
  ) => void;
}

const CustomButton = (props: CustomButtonProps) => {
  const StyledButton = styled(Button)({
    ...props,
    lineHeight: '100%',
    paddingLeft: '0',
    paddingRight: '0',
    '&:hover': {
      background: props.hoverBackground || '#695400',
      color: props.hoverColor || '#EDEDED'
    }
  });

  return (
    <StyledButton onClick={props.onHandleClick} type="submit">
      {props.children || props.title}
    </StyledButton>
  );
};

export default CustomButton;
