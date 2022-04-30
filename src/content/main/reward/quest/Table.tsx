import { Box, Typography } from '@mui/material';
import CustomCard from 'src/components/Card';
import CustomTitle from 'src/components/Title/BadgeTitle';
import { styled } from '@mui/material/styles';

const Root = styled('div')(
  ({ theme }) => `
    table {
      border-collapse: collapse;
      width: 100%;
    }
    table tbody tr:last-child td:first-of-type {
      border-bottom-left-radius: 13px;
    }
    table tbody tr:last-child td:last-child {
      border-bottom-right-radius: 13px;
    }
    table thead tr:first-of-type th:first-of-type {
      border-top-left-radius: 13px;
    }
    table thead tr:first-of-type th:last-child {
      border-top-right-radius: 13px;
    }
    table tbody tr td:first-of-type {
      text-align: center;
    }
    thead tr {
      border-bottom: 2px solid #000;
      background: #212121;
      color: #E0A501;
      font-size: 14px;
      font-weight: 600;
    }
    tbody tr {
      border-bottom: 1px solid #000;
      background: #212121;
      font-weight: 600;
      color: #EDEDED;
      font-size: 12px;
    }
    table tr td {
      padding: 5px 10px;
    }
    table tr th {
      padding: 7px;
    }
    table tr th, table tr td {
      border-right: 2px solid #000;
    } 

    margin-top: 10px;
    width: 100%;
  `
);

function createData(quest, date, amount) {
  return { quest, date, amount };
}

const rows = [
  createData('Loremipsumquest', '13:30 10/22/2021', '0.5 SMTC'),
  createData('Loremipsumquest', '13:30 10/22/2021', '0.5 SMTC'),
  createData('Loremipsumquest', '13:30 10/22/2021', '0.5 SMTC'),
  createData('Loremipsumquest', '13:30 10/22/2021', '1 SMTC'),
  createData('Loremipsumquest', '13:30 10/22/2021', '1 SMTC'),
  createData('Loremipsumquest', '13:30 10/22/2021', '1 SMTC'),
  createData('Loremipsumquest', '13:30 10/22/2021', '1 SMTC'),
  createData('Loremipsumquest', '13:30 10/22/2021', '1 SMTC'),
  createData('Loremipsumquest', '13:30 10/22/2021', '1 SMTC'),
  createData('Loremipsumquest', '13:30 10/22/2021', '1 SMTC')
];

const swordPanelIcon = {
  name: 'swordpanel',
  path: '/static/img/main_achievement/swordPanel.svg',
  desc: 'sword with black background'
};

const Table = () => {
  return (
    <>
      <CustomCard
        width="100%"
        height="auto"
        background="#000000"
        marginTop="10px"
      >
        <Box padding="10px">
          <Typography
            fontSize="18px"
            fontWeight="700"
            color="#E0A501"
            textAlign="center"
            lineHeight="100%"
          >
            History
          </Typography>
          <Root>
            <table aria-label="custom pagination table" cellSpacing="0">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Quest Completed</th>
                  <th>Date</th>
                  <th>Earning</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <Box display="flex">
                        <Box
                          component="img"
                          src={swordPanelIcon.path}
                          alt={swordPanelIcon.name}
                        />
                        <Box marginLeft="10px">{row.quest}</Box>
                      </Box>
                    </td>
                    <td>
                      <Box textAlign="center">{row.date}</Box>
                    </td>
                    <td>
                      <Box textAlign="center">{row.amount}</Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Root>
          <Box display="flex" justifyContent="space-between" marginTop="5px">
            <Box display="flex" justifyContent="space-between" width="60%">
              <Box display="flex" alignItems="center">
                <Typography variant="h4">Show</Typography>
                <Box height="100%" marginLeft="5px">
                  <CustomTitle
                    width="32px"
                    height="21px"
                    fontSize="12px"
                    fontWeight="600"
                    color="#323232"
                    background="#E0A501"
                    borderRadius="5px"
                    title="10"
                  />
                </Box>
                <Box height="100%" marginLeft="5px">
                  <CustomTitle
                    width="32px"
                    height="21px"
                    fontSize="12px"
                    fontWeight="600"
                    color="#EDEDED"
                    background="#5A5A5A"
                    borderRadius="5px"
                    title="50"
                  />
                </Box>
                <Box height="100%" marginLeft="5px">
                  <CustomTitle
                    width="32px"
                    height="21px"
                    fontSize="12px"
                    fontWeight="600"
                    color="#EDEDED"
                    background="#5A5A5A"
                    borderRadius="5px"
                    title="100"
                  />
                </Box>
              </Box>
              <Box display="flex" alignItems="center">
                <Box height="100%" marginLeft="5px">
                  <CustomTitle
                    width="21px"
                    height="21px"
                    fontSize="12px"
                    fontWeight="600"
                    color="#323232"
                    background="#E0A501"
                    borderRadius="20px"
                    title="1"
                  />
                </Box>
                <Box height="100%" marginLeft="5px">
                  <CustomTitle
                    width="21px"
                    height="21px"
                    fontSize="12px"
                    fontWeight="600"
                    color="#EDEDED"
                    background="#5A5A5A"
                    borderRadius="20px"
                    title="2"
                  />
                </Box>
                <Box height="100%" marginLeft="5px">
                  <CustomTitle
                    width="21px"
                    height="21px"
                    fontSize="12px"
                    fontWeight="600"
                    color="#EDEDED"
                    background="#5A5A5A"
                    borderRadius="20px"
                    title="3"
                  />
                </Box>
                <Box height="100%" marginLeft="5px">
                  <CustomTitle
                    width="21px"
                    height="21px"
                    fontSize="12px"
                    fontWeight="600"
                    color="#EDEDED"
                    background="#5A5A5A"
                    borderRadius="20px"
                    title="4"
                  />
                </Box>
                <Box height="100%" marginLeft="5px">
                  <CustomTitle
                    width="21px"
                    height="21px"
                    fontSize="12px"
                    fontWeight="600"
                    color="#EDEDED"
                    background="#5A5A5A"
                    borderRadius="20px"
                    title=">"
                  />
                </Box>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography fontSize="12px" fontWeight="600" color="#E0A501">
                10/
              </Typography>
              <Typography fontSize="12px" fontWeight="600" color="#EDEDED">
                50
              </Typography>
            </Box>
          </Box>
        </Box>
      </CustomCard>
    </>
  );
};

export default Table;
