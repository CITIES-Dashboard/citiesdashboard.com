import { useState, useEffect, createContext, useMemo } from 'react';
import { Grid, Typography } from '@mui/material';
import ChartComponent from '../Graphs/ChartComponent';

// import data
import JSONData from '../temp_database.json';

// create context
export const HomeDataContext = createContext();

// context provider
export function HomePageProvider({ children }) {
  // state to store data
  const [homeData, setHomeData] = useState({});

  const returnTeaserChartForHomepage = (item) => {
    if (!item.embeddedWebsite) {
      return (item.isActive
        ? (
          <ChartComponent
            chartData={{
              sheetId: item.sheetId,
              ...item.charts[0],
            }}
            chartHeight="100%"
            isHomepage
          />
        ) : <ComingSoonBanner />
      );
    }
    return null;
  };

  useEffect(() => {
    const data = {};
    // loop through temp_database.json
    JSONData.forEach((item) => {
      data[item.id] = {
        isActive: item.isActive,
        id: item.id,
        title: item.title,
        owner: item.owner,
        chartCounts: item.chartCounts || item.charts?.length,
        chart: returnTeaserChartForHomepage(item),
        embeddedWebsite: item.embeddedWebsite,
        externalWebsite: item.externalWebsite
      };

      setHomeData(data);
    });
  }, []);

  // Memoize the value to be provided to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({ homeData, setHomeData }), [homeData]);

  // return context provider
  return (
    <HomeDataContext.Provider value={providerValue}>
      {children}
    </HomeDataContext.Provider>
  );
}

// banner for coming soon
function ComingSoonBanner() {
  return (
    <Grid container height="100%" justifyContent="center" alignItems="center">
      <Grid item>
        <Typography variant="h5" fontWeight={400} color="text.secondary">
          Coming Soon
        </Typography>
      </Grid>
    </Grid>
  );
}
