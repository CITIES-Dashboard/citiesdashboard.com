import { useEffect, useContext } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import CITIESlogoLinkToHome from '../../Components/Header/CITIESlogoLinkToHome';
import { ScreenContext } from '../../ContextProviders/ScreenContext';
import BlackScreen from './BlackScreen';
import QRCode from 'react-qr-code';
import { ProjectContext } from '../../ContextProviders/ProjectContext';
import LatestFoodWaste from './FoodWaste/LatestFoodWaste';
import RecentHistoricalGraph from './FoodWaste/RecentHistoricalGraph';
import { FoodWasteProvider } from './FoodWaste/FoodWasteContext';

const Screen = () => {
  const { isLayoutReversed, shouldDisplayScreen } = useContext(ScreenContext);
  const { project, projectID } = useContext(ProjectContext);

  // Update the page's title
  useEffect(() => {
    if (project.title) {
      document.title = `${project.title} Screen | CITIES Dashboard`;
    }
  }, [project]);
  if (!shouldDisplayScreen) return <BlackScreen />

  return (
    <FoodWasteProvider>
      <Grid
        container
        alignContent="stretch"
        alignItems="stretch"
        height="100vh"
        sx={{
          cursor: 'none',
          overflow: 'hidden',
          background: "white",
          '& *': {
            fontWeight: '500 !important'
          },
          '& .condensedFont': {
            fontFamily: 'IBM Plex Sans Condensed, sans-serif !important',
            '& *': {
              fontFamily: 'IBM Plex Sans Condensed, sans-serif !important'
            }
          }
        }}
      >
        <Grid
          item
          xs={6}
          sx={{
            order: isLayoutReversed ? 1 : 0,
            background: '#212529'
          }}
        >
          {projectID === "food-waste" && <LatestFoodWaste />}
        </Grid>

        <Grid item xs={6} sx={{ order: isLayoutReversed ? 0 : 1 }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: !isLayoutReversed && 0,
              left: isLayoutReversed && 0,
              width: '5vw',
              height: '5vw',
              m: 1
            }}
          >
            <CITIESlogoLinkToHome />
          </Box>
          <Grid
            container
            alignContent="space-between"
            justifyContent="center"
            height="100%"
            textAlign="center"
          >
            <Grid item xs={12} sx={{ pt: 3, px: 2 }}>
              <Typography variant="h2" sx={{ color: 'black' }}>
                CITIES Dashboard
              </Typography>
            </Grid>

            <Grid item xs={2}>
              <Box height="auto" width="90%">
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                  value={`https://citiesdashboard.com/project/${projectID}`}
                  viewBox={`0 0 256 256`}
                />
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              height="70%"
              className='condensedFont'
              sx={{ '& *': { fontWeight: '600 !important' } }}
            >
              {projectID === "food-waste" && <RecentHistoricalGraph />}
            </Grid>
          </Grid>

        </Grid>
      </Grid>
    </FoodWasteProvider>

  )
};

export default Screen;
