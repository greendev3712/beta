import { makeStyles } from '@mui/styles';

export const statisticHeaderStyle = makeStyles({
  // CUSTOM STATISTIC BOX STYLE
  customBoxStyle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    '@media (max-width: 968px)': {
      justifyContent: 'space-around',
      flexWrap: 'wrap'
    }
  },
  // INNER BOX OF CUSTOMCARD STYLE
  customInnerBoxStyle: {
    width: '200px',
    height: '120px',
    '@media (max-width: 968px)': {
      marginBottom: '20px'
    },
    '@media (max-width: 600px)': {
      width: '270px'
    }
  },
  // MAIN TITLE STYLE
  mainTitleTopStyle: {
    height: '40px',
    fontSize: '18px !important',
    fontWeight: '600 !important',
    color: '#EDEDED',
    lineHeight: '100% !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },
  mainTitleDownStyle: {
    height: '60px',
    fontSize: '20px !important',
    fontWeight: '700 !important',
    color: '#E0A501',
    padding: '0 10px',
    lineHeight: '100% !important',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
  },

  popoverRoot: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export const treeSectionStyle = makeStyles({
  progressTitleStyle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#EDEDED',
    '@media (max-width: 968px)': {
      fontSize: '14px'
    }
  },
  treeCustomOutBoxStyle: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    '@media (max-width: 968px)': {
      flexDirection: 'column'
    }
  },
  treeCustomInnerBoxStyle: {
    width: '50%',
    '@media (max-width: 968px)': {
      width: '100%'
    }
  },
  treeRewardOutStyle: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: '20px',
    '@media (max-width: 968px)': {
      paddingLeft: '0'
    }
  }
});

export const treeRewardStyle = makeStyles({
  customOutBoxStyle: {
    '@media (max-width: 968px)': {
      marginTop: '20px'
    }
  },
  customHeadingStyle: {
    padding: '0 70px',
    color: '#E0A501',
    fontSize: '18px !important',
    fontWeight: '700 !important',
    lineHeight: '100% !important',
    marginBottom: '10px !important',
    textAlign: 'center',
    '@media (max-width: 968px)': {
      padding: '0 50px'
    }
  }
});

export const treePhaseStyle = makeStyles({
  customCardOutBoxStyle: {
    padding: '10px 10px 10px 30px',
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    '@media (max-width: 968px)': {
      padding: '10px'
    }
  }
});
