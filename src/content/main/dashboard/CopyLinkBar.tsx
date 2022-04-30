import { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Theme } from '@mui/material';
import { toast } from 'react-hot-toast';

import { IndexStyles } from 'src/models/main/dashboard/CustomStyles';
import { m_d_copyImage } from 'src/models/ImageUrl';

import { useWeb3React } from '@web3-react/core';

const CopyLinkBar = () => {
  const theme: Theme = useTheme();
  const classes = IndexStyles(theme);
  const { account } = useWeb3React();

  const [referralLink, setReferralLink] = useState<string>('');

  useEffect(() => {
    if (account) {
      setReferralLink(`${window.location.origin}/p-id=${account}`);
    }

    return () => {
      setReferralLink('');
    };
  }, [account]);

  const handleCopy = (): void => {
    toast.success('copied');
    navigator.clipboard.writeText(referralLink);
  };

  return (
    <Box className={classes.copyLinkCardActionStyle}>
      <Typography component="span" className={classes.copyLinkTextStyle}>
        Your ref link:
      </Typography>
      <Typography component="span" className={classes.copyLinkTextValueStyle}>
        {account ? `Smart-Ecosystem/p-id=${account.slice(0, 8)}` : ''}
      </Typography>
      <Box
        component="img"
        onClick={handleCopy}
        src={m_d_copyImage.path}
        alt={m_d_copyImage.name}
        className={classes.copyImageStyle}
      />
    </Box>
  );
};

export default CopyLinkBar;
