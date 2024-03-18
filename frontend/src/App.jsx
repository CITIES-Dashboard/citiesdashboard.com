// React components
import { useState, useMemo, useContext, lazy, Suspense } from 'react';
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
import DeviceOrientationNotification from './Components/SnackBarNotifications';
import LoadingAnimation from './Components/LoadingAnimation';

import { LinkContext } from './ContextProviders/LinkContext';
import jsonData from './section_data.json';
import SpeedDialButton from './Components/SpeedDialButton';

// Lazy load pages
const Home = lazy(() => import('./Pages/Home/Home'));
const Project = lazy(() => import('./Pages/Project'));

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
  // Set theme preference state based on localStorage or system preference
  const [themePreference, setThemePreference] = useState(
    localStorage.getItem('theme')
    || (window.matchMedia('(prefers-color-scheme: dark)').matches
      ? ThemePreferences.dark : ThemePreferences.light)
  );

  // Create theme using getDesignTokens
  const theme = useMemo(
    () => createTheme(getDesignTokens(themePreference)),
    [themePreference]
  );

  // set backgroundColor of 'body' element depending on theme.
  // this is to set bg-color of left/right padding on landscape iOS devices
  document.body.style.background = theme.palette.customAlternateBackground;

  // eslint-disable-next-line no-unused-vars
  const [currentPage, _, chartsTitlesList, __] = useContext(LinkContext);

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
          <DeviceOrientationNotification />

          <SpeedDialButton
            chartsTitlesList={chartsTitlesList}
            topAnchorID={jsonData.topAnchor.id}
          />

          {useMemo(
            () => (
              <Header setThemePreference={setThemePreference} />
            ),
            []
          )}
          <Box flex={1} display="flex" width="100%">
            <Suspense fallback={<LoadingAnimation optionalText="Loading Dashboard" />}>
              <Routes>
                <Route
                  path="/"
                  element={<Home themePreference={themePreference} title="CITIES Dashboard" />}
                />
                <Route
                  path="/project/:id"
                  element={<Project themePreference={themePreference} />}
                />
                <Route path="/404" element={<FourOhFour title="Page Not Found | CITIES Dashboard" />} />
                <Route path="*" element={<Navigate replace to="/404" />} />
              </Routes>
            </Suspense>
          </Box>
          {useMemo(
            () => (
              <Footer />
            ),
            []
          )}
        </Box>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
