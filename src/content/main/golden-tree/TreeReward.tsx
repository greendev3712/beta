import { Box, Typography, Tooltip, Hidden } from '@mui/material';

import CustomTitle from 'src/components/Title/BadgeTitle';
import CustomCard from 'src/components/Card';
import ColumnBox from 'src/components/Box/ColumnBox';
import RowBox from 'src/components/Box/RowBox';

import { treeRewardStyle } from 'src/models/main/golden-tree/CustomStyle';
import { rewardContent } from 'src/models/main/golden-tree/SampleData';

const TreeReward = () => {
  const classes = treeRewardStyle();

  return (
    <Box className={classes.customOutBoxStyle}>
      <CustomCard
        width="100%"
        height="302px"
        background="linear-gradient(180deg, #212121 0%, #000000 100%)"
      >
        <Box padding="9px 18px">
          <Typography className={classes.customHeadingStyle}>
            Your current & upcoming rewards from Golden Tree
          </Typography>
          <ColumnBox>
            {rewardContent.map((con, idx) => (
              <RowBox key={idx} height="20px" marginBottom="2px">
                <RowBox height="100%" justifyContent="flex-start">
                  <Hidden mdDown>
                    <Tooltip
                      arrow
                      title={
                        <Box
                          component="img"
                          width="100%"
                          height="100%"
                          alt={con.name}
                          src={con.path}
                        />
                      }
                      placement="top"
                      componentsProps={{
                        tooltip: {
                          sx: {
                            display: 'flex',
                            alignItems: 'center',
                            textAlign: 'center',
                            background: '#EDEDED',
                            borderRadius: '10px',
                            width: '110px',
                            height: '110px',
                            padding: '5px',
                            zIndex: '9999'
                          }
                        }
                      }}
                    >
                      <Box
                        component="img"
                        sx={{ width: '20px', height: '20px' }}
                        alt={con.name}
                        src={con.path}
                      />
                    </Tooltip>
                  </Hidden>
                  <Typography variant="h4" marginLeft="5px">
                    &#8226; {con.content}
                  </Typography>
                </RowBox>
                <CustomTitle
                  width="120px"
                  height="100%"
                  fontSize="12px"
                  color={con.status === 'Claimed' ? '#EDEDED' : '#212121'}
                  background={con.status === 'Claimed' ? '#5A5A5A' : '#E0A501'}
                  boxShadow="4px 4px 4px rgba(0, 0, 0, 0.25), inset -1px -3px 4px rgba(0, 0, 0, 0.25)"
                  title={con.status}
                />
              </RowBox>
            ))}
          </ColumnBox>
        </Box>
      </CustomCard>
    </Box>
  );
};

export default TreeReward;
