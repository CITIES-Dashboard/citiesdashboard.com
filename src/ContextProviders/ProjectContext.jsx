// import libraries
import { useState, createContext, useMemo, useEffect, useContext, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import data from '../temp_database.json';
import { LinkContext } from './LinkContext';
import { TabContext } from './TabContext';

// create context
export const ProjectContext = createContext();

// context provider
export function ProjectProvider({ children }) {
  const { id } = useParams();

  const [projectID, setProjectID] = useState();
  const [project, setProject] = useState();
  const navigate = useNavigate();

  const { setCurrentPage, setChartsTitlesList } = useContext(LinkContext);
  const { setTab } = useContext(TabContext);

  // Memoize `setTab` and `navigate` to avoid unnecessary re-renders
  const memoizedSetTab = useCallback((value) => setTab(value), [setTab]);
  const memoizedNavigate = useCallback((path) => navigate(path, { replace: true }), [navigate]);

  // Update the currentPage with the project's ID
  // and the chartsTitle with all the charts' titles of the project
  useEffect(() => {
    // find the project with the matching id
    const project = data.find((project) => project.id === id);

    let chartsTitles = [];
    if (project) {
      setProjectID(id);
      setProject({ ...project });

      let temp = {};
      for (let i = 0; i < project.charts.length; i++) {
        temp[i] = 0;
      }
      memoizedSetTab(temp);
      // Populate the array with all the charts' titles of the project
      chartsTitles = project.charts.map((element, index) => ({ chartTitle: element.title, chartID: `chart-${index + 1}` }));
    } else {
      setCurrentPage('404');
      memoizedNavigate('/404');
      return;
    }

    setCurrentPage("project");
    setChartsTitlesList(chartsTitles);

  }, [id, setCurrentPage, setChartsTitlesList, memoizedSetTab, memoizedNavigate]);

  // Memoize the value to be provided to avoid unnecessary re-renders
  const providerValue = useMemo(() => ({
    project, projectID
  }), [project, projectID]);

  return (
    <ProjectContext.Provider value={providerValue}>
      {children}
    </ProjectContext.Provider>
  );
}
