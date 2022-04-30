import { FC, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

const PageTitle = styled(Box)(
  ({ theme }) => `
    margin-top: 10px
`
);

interface PageTitleWrapperProps {
  children?: ReactNode;
}

const PageTitleWrapper = ({ children }: PageTitleWrapperProps) => {
  return (
    <>
      <PageTitle>{children}</PageTitle>
    </>
  );
};

PageTitleWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default PageTitleWrapper;
