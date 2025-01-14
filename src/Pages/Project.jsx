// disable eslint for this file
import { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { LinkContext } from '../ContextProviders/LinkContext';
import { TabContext } from '../ContextProviders/TabContext';
import { useNavigate } from 'react-router-dom';
import parse from 'html-react-parser';
import ChartComponent from '../Graphs/ChartComponent';
import UppercaseTitle from '../Components/UppercaseTitle';
import CommentSection from '../Components/CommentSection';
import { Box, Typography, Container, Divider, Chip, Grid, Tooltip } from '@mui/material';

import { useTheme } from '@mui/material/styles';

import ThemePreferences from '../Themes/ThemePreferences';

import data from '../temp_database.json';
import jsonData from '../section_data.json';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PublishedWithChangesIcon from '@mui/icons-material/PublishedWithChanges';
import BarChartIcon from '@mui/icons-material/BarChart';
import CommentIcon from '@mui/icons-material/Comment';

import { replacePlainHTMLWithMuiComponents } from '../Utils/UtilFunctions';
import DatasetDownloadDialog from '../Components/DatasetDownload/DatasetDownloadDialog';

import { scrollToSection } from '../Components/Header/MenuItemAsNavLink';
import FullWidthBox from '../Components/FullWidthBox';

import * as Tracking from '../Utils/Tracking';

import { CommentCountsContext } from '../ContextProviders/CommentCountsContext';

import { RawDatasetsMetadataContext } from '../ContextProviders/RawDatasetsMetadataContext';

// Might be used in the future to display a customized table instead of the regular ChartComponent
// import ChartSubstituteComponentLoader from '../../Graphs/ChartSubstituteComponents/ChartSubstituteComponentLoader';

import CollapsibleSubtitle from '../Components/CollapsibleSubtitle';
import { PreferenceContext } from '../ContextProviders/PreferenceContext';

// Custom Chip component to display metadata
const CustomChip = (props) => {
  const { tooltipTitle, ...otherProps } = props;
  return (
    <Tooltip title={tooltipTitle} enterDelay={0} leaveDelay={200}>
      <Chip
        size="small"
        {...otherProps}
      />
    </Tooltip>
  );
}

const Project = () => {
  const { themePreference } = useContext(PreferenceContext);
  const { setCurrentPage, chartsTitlesList, setChartsTitlesList } = useContext(LinkContext);
  const { tab, setTab } = useContext(TabContext);

  const { id } = useParams();
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const commentCounts = useContext(CommentCountsContext);
  const thisProjectCommentCount = commentCounts[project.id];

  const rawDatasetsMetadata = useContext(RawDatasetsMetadataContext);
  const [lastUpdate, setLastUpdate] = useState(null);

  const theme = useTheme();

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
      setProject({ ...project });
      let temp = {};
      for (let i = 0; i < project.charts.length; i++) {
        temp[i] = 0;
      }
      memoizedSetTab(temp);
      setLoading(true);
      // Populate the array with all the charts' titles of the project
      chartsTitles = project.charts.map((element, index) => ({ chartTitle: element.title, chartID: `chart-${index + 1}` }));
    } else {
      setCurrentPage('404');
      memoizedNavigate('/404');
    }

    setCurrentPage("project");
    setChartsTitlesList(chartsTitles);

  }, [id, setCurrentPage, setChartsTitlesList, memoizedSetTab, memoizedNavigate]);

  // Update the page's title
  useEffect(() => {
    if (project.title) {
      document.title = `${project.title} | CITIES Dashboard`;
    }
  }, [project]);

  // Update the project's last update date based on dataset versions
  useEffect(() => {
    if (!rawDatasetsMetadata) return;

    const projectDatasets = rawDatasetsMetadata[project.id];
    if (!projectDatasets) return;

    // Get the latest version of each dataset
    const datasetVersions = projectDatasets.flatMap(dataset => dataset.versions ? dataset.versions[0].version : [])

    // Find the latest version
    const lastUpdate = datasetVersions.length > 0 ? datasetVersions.reduce((a, b) => a > b ? a : b) : null;

    setLastUpdate(lastUpdate);

  }, [rawDatasetsMetadata, project.id]);

  return (
    <>
      {loading && (
        <Box width="100%">
          <FullWidthBox backgroundColor='customAlternateBackground'>
            <Container sx={{ pt: 5, pb: 3 }}>

              <UppercaseTitle text={project.title} />

              <Grid container spacing={1} sx={{ pb: 3, mt: -3 }}>
                <Grid item>
                  <CustomChip
                    icon={<PersonIcon />}
                    label={project.owner}
                    tooltipTitle="Dataset Owner"
                  />
                </Grid>

                <Grid item>
                  <CustomChip
                    icon={<EmailIcon />}
                    label={project.contact}
                    tooltipTitle="Contact"
                    component="a"
                    href={`mailto:${project.contact}`}
                    clickable
                  />
                </Grid>

                <Grid item>
                  <CustomChip
                    icon={<BarChartIcon />}
                    label={`${project.charts.length} Chart${project.charts.length > 1 && "s"}`}
                    tooltipTitle="Number of Charts"
                    onClick={() => {
                      scrollToSection(jsonData.charts.id);
                      Tracking.sendEventAnalytics(Tracking.Events.internalNavigation,
                        {
                          destination_id: jsonData.charts.id,
                          destination_label: jsonData.project.toString(),
                          origin_id: 'chip'
                        })
                    }}
                  />
                </Grid>

                {
                  lastUpdate &&
                  <Grid item>
                    <CustomChip
                      icon={<PublishedWithChangesIcon />}
                      label={`Last update: ${lastUpdate}`}
                      tooltipTitle="Last Update" />
                  </Grid>
                }

                {thisProjectCommentCount !== null ?
                  (
                    <Grid item>
                      <CustomChip
                        icon={<CommentIcon />}
                        label={`${thisProjectCommentCount} Comment${thisProjectCommentCount > 1 ? "s" : ""}`}
                        tooltipTitle="Number of Comments"
                        onClick={() => {
                          scrollToSection(jsonData.commentSection.id);
                          Tracking.sendEventAnalytics(Tracking.Events.internalNavigation,
                            {
                              destination_id: jsonData.commentSection.id,
                              destination_label: jsonData.commentSection.toString(),
                              origin_id: 'chip'
                            })
                        }}
                      />
                    </Grid>
                  ) : null}
              </Grid>

              <Typography
                component="div"
                variant="body1"
                color="text.secondary"
                sx={{
                  textAlign: 'justify', pb: 3, mb: 0, "& table *": {
                    color: `${theme.palette.text.secondary}`
                  }
                }}
                gutterBottom
              >
                {project.description ? parse(project.description, {
                  replace: replacePlainHTMLWithMuiComponents,
                }) : "No project description"}
              </Typography>

              <DatasetDownloadDialog project={project} />
            </Container>
          </FullWidthBox>

          <Box id={jsonData.charts.id}>
            {project.charts.map((element, index) => (
              <FullWidthBox
                id={chartsTitlesList[index].chartID} // set the chartWrapper's ID to help Navbar in Header scroll to
                key={index}
                backgroundColor={
                  index % 2 !== 0 && 'customAlternateBackground'
                }
              >
                <Container
                  sx={{ pt: 4, pb: 4 }}
                  height="auto"
                  className={themePreference === ThemePreferences.dark ? 'dark' : ''}
                >
                  <Typography variant="h6" color="text.primary">
                    {index + 1}. {element.title}
                  </Typography>

                  {/* For future reference: Either display the regular ChartComponent, or substitute 
                  with a customized component in ../../Graphs/ChartSubstituteComponents/ (if specified) */}
                  {/* {element.chartSubstituteComponentName ?
                    <ChartSubstituteComponentLoader chartSubstituteComponentName={element.chartSubstituteComponentName} />
                    : (
                      <ChartComponent
                        chartData={{
                          chartIndex: index,
                          sheetId: project.sheetId,
                          ...element,
                        }}
                      />
                    )} */}

                  <ChartComponent
                    chartData={{
                      chartIndex: index,
                      sheetId: project.sheetId,
                      ...element,
                    }}
                  />
                  <Box sx={{ my: 3 }}>
                    <Typography
                      component="div"
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {element.subtitle &&
                        <CollapsibleSubtitle
                          text={element.subtitle}
                          reference={element.reference ? element.reference : undefined}
                        />
                      }
                      {Number(Object.keys(tab)[index]) === index &&
                        element.subcharts &&
                        element.subcharts[Object.values(tab)[index]].subchartSubtitle &&
                        <CollapsibleSubtitle
                          text={element.subcharts[Object.values(tab)[index]].subchartSubtitle}
                          reference={element.subcharts[Object.values(tab)[index]].reference ? element.subcharts[Object.values(tab)[index]].reference : undefined}
                        />
                      }
                    </Typography>
                  </Box>
                </Container>
              </FullWidthBox>
            ))}
          </Box>

          <Divider />

          <FullWidthBox id={jsonData.commentSection.id} sx={{ pt: 3, pb: 4 }}>
            <CommentSection pageID={project.id} />
          </FullWidthBox>
        </Box>
      )}
    </>
  );
};

export default Project;
