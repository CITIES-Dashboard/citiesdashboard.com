// React components
import { useMemo, useContext, lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

// MUI components
import { Box } from '@mui/material/';

// Theme
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ThemePreferences from './Themes/ThemePreferences';
import CustomThemes from './Themes/CustomThemes';

// UI components
import Header from './Components/Header/Header';
import Footer from './Components/Footer';
import FourOhFour from './Pages/404';
import LoadingAnimation from './Components/LoadingAnimation';

import jsonData from './section_data.json';
import SpeedDialButton from './Components/SpeedDial/SpeedDialButton';
import { PreferenceContext } from './ContextProviders/PreferenceContext';

import { GlobalStyles } from '@mui/system';
import { returnStylesForChartWrapper } from './Graphs/GoogleChartHelper';
import { ScreenProvider } from './ContextProviders/ScreenContext';
import { ProjectProvider } from './ContextProviders/ProjectContext';

// Lazy load pages
const Home = lazy(() => import('./Pages/Home/Home'));
const Project = lazy(() => import('./Pages/Project'));
const Screen = lazy(() => import('./Pages/Screens/Screen'));

// Create theme design tokens based on theme preference
const getDesignTokens = (themePreference) => ({
  palette: {
    mode: themePreference,
    ...(themePreference === ThemePreferences.dark
      ? {
        ...CustomThemes.dark.palette,
        ...CustomThemes.universal.palette,
        typography: CustomThemes.universal.palette,
      }
      : {
        ...CustomThemes.light.palette,
        ...CustomThemes.universal.palette,
        typography: CustomThemes.universal.palette,
      }),
  },
});

function App() {
  const { themePreference } = useContext(PreferenceContext);

  // Create theme using getDesignTokens
  const theme = useMemo(
    () => createTheme(getDesignTokens(themePreference)),
    [themePreference]
  );

  // set backgroundColor of 'body' element depending on theme.
  // this is to set bg-color of left/right padding on landscape iOS devices
  document.body.style.background = theme.palette.customAlternateBackground;

  return (
    <BrowserRouter basename="/">
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: '100vh',
            backgroundColor: 'customBackground',
          }}
        >
          <SpeedDialButton
            topAnchorID={jsonData.topAnchor.id}
          />

          <GlobalStyles
            styles={{
              '.treemap-tooltip': returnStylesForChartWrapper({ theme, isPortrait: false }),
            }}
          />

          <Suspense fallback={<LoadingAnimation optionalText="Loading Dashboard" />}>
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Header />
                    <Home title="CITIES Dashboard" />
                    <Footer />
                  </>
                }
              />

              <Route
                path="/project/:id"
                element={
                  <>
                    <Header />
                    <ProjectProvider>
                      <Project />
                    </ProjectProvider>
                    <Footer />
                  </>
                }
              />

              <Route
                path="/project/:id/screen"
                element={
                  <>
                    <ProjectProvider>
                      <ScreenProvider>
                        <Screen />
                      </ScreenProvider>
                    </ProjectProvider>
                  </>}
              />

              <Route
                path="/404"
                element={
                  <>
                    <Header />
                    <FourOhFour title="Page Not Found | CITIES Dashboard" />
                    <Footer />
                  </>
                }
              />

              <Route
                path="*"
                element={
                  <Navigate replace to="/404" />
                }
              />
            </Routes>
          </Suspense>
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
