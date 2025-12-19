// import libraries
import { useState, createContext, useMemo, useEffect, useContext } from 'react';
import { fetchDataFromSheet } from '../../../Graphs/GoogleChartHelper';
import { GoogleContext } from '../../../ContextProviders/GoogleContext';
import data from "../../../temp_database.json";

// create context
export const FoodWasteContext = createContext();

// context provider
export function FoodWasteProvider({ children }) {
  const project = useMemo(
    () => data.find(p => p.id === "food-waste"),
    [data]
  );

  const { google } = useContext(GoogleContext);
  const [historical, setHistorical] = useState();
  const [lastWeek, setLastWeek] = useState();
  const [lastSemester, setLastSemester] = useState();
  const [dailyGoal, setDailyGoal] = useState();

  useEffect(() => {
    if (!google) return;
    // Fetch daily food waste goal
    fetchDataFromSheet({
      chartData: {
        ...project.screen.dailyFoodWasteGoal,
        sheetId: project.sheetId
      },
      google: google
    })
      .then(response => {
        setDailyGoal(
          Math.round(response?.Ta?.Wf?.[0]?.c?.[0]?.v)
        );
      })
      .catch(error => {
        console.log(error);
      });

    // Fetch last month food waste data
    fetchDataFromSheet({
      chartData: {
        ...project.screen.historical,
        sheetId: project.sheetId
      },
      google: google
    })
      .then(response => {
        const data = response?.Ta?.Wf || [];
        const historical = data.map(item => ({
          timestamp: new Date(item?.c?.[0]?.v),
          value: Math.round(item?.c?.[1]?.v)
        }));
        setHistorical(historical);
      })
      .catch(error => {
        console.log(error);
      });

    // Fetch last week food waste
    fetchDataFromSheet({
      chartData: {
        ...project.screen.lastWeek,
        sheetId: project.sheetId
      }, google: google
    })
      .then(response => {
        setLastWeek(response?.Ta?.Wf?.[0]?.c?.[0]?.v);
      })
      .catch(error => {
        console.log(error);
      });
  }, [google]);

  // Memoize the value to be provided to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({
    historical, lastWeek, lastSemester, dailyGoal
  }), [historical, lastWeek, lastSemester, dailyGoal]);

  return (
    <FoodWasteContext.Provider value={providerValue}>
      {children}
    </FoodWasteContext.Provider>
  );
}
