/* eslint-disable */

import { useState, useEffect, useContext } from 'react';

import { GoogleContext } from '../../ContextProviders/GoogleContext';

import { Box, Stack } from '@mui/material/';

import { useTheme } from '@mui/material/styles';
import HeatMap from '../HeatMap';
import SeriesSelector from './SeriesSelector';

import { fetchDataFromSheet, generateRandomID, returnGenericOptions, returnCalendarChartOptions, returnChartControlUI, ChartControlType, addTouchEventListenerForChartControl } from '../GoogleChartHelper';

import GoogleChartStyleWrapper from './GoogleChartStyleWrapper';

import LoadingAnimation from '../../Components/LoadingAnimation';

import ChartSubstituteComponentLoader from '../ChartSubstituteComponents/ChartSubstituteComponentLoader';

export default function SubChart(props) {
  // Props
  const { chartData, subchartIndex, windowSize, isPortrait, isHomepage, height, maxHeight } = props;

  // Early return if this doesn't contain a normal Google Chart but a chartSubstituteComponent
  const chartSubstituteComponentName = chartData.subcharts?.[subchartIndex].chartSubstituteComponentName;
  if (chartSubstituteComponentName) {
    return <ChartSubstituteComponentLoader chartSubstituteComponentName={chartSubstituteComponentName} />;
  }

  // Formulate the className
  const className = chartData.customClassName ? `${chartData.chartType} ${chartData.customClassName}` : chartData.chartType;

  // Early return for 'HeatMap' chartType
  if (chartData.chartType === 'HeatMap') {
    return (
      <Box
        position="relative"
        className={className}
        height={chartData.height}
        maxWidth={chartData.maxWidth ? chartData.maxWidth : '100%'}
        width="100%"
        sx={{ pt: 2, pb: 2, margin: 'auto' }}
      >
        <HeatMap
          publishedSheetId={chartData.publishedSheetId}
          gid={chartData.gid || chartData.subcharts[subchartIndex].gid || null}
          range={
            chartData.range || chartData.subcharts[subchartIndex].range || null
          }
        />
      </Box>
    );
  }

  // Use GoogleContext for loading and manipulating the Google Charts
  const [google, _] = useContext(GoogleContext);

  // States of the Google Charts
  const [dataTable, setDataTable] = useState();
  const [chartWrapper, setChartWrapper] = useState();
  const [dashboardWrapper, setDashboardWrapper] = useState();
  const [controlWrapper, setControlWrapper] = useState();

  // Get the current theme
  const theme = useTheme();

  // To determine the first time the chart renders to show/hide the LoadingAnimation
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Keep track of the columns (series) of the chart
  const [dataColumns, setDataColumns] = useState([]);

  // Define the DOM container's ID for drawing the google chart inside
  const [chartID, __] = useState(generateRandomID());

  // Calendar chart's properties
  const [chartTotalHeight, setChartTotalHeight] = useState(200);

  // Get the options object for chart
  let options = returnGenericOptions({ ...props, theme });
  if (chartData.chartType === 'Calendar') options = returnCalendarChartOptions(options);

  // Properties for chart control (if existed)
  let hasChartControl = false;
  let chartControlOptions;
  // Only show the chart control if:
  // It exists in the database (either for all subcharts or just for a particular subchart)
  // And if the chart is currently not shown on homePage
  let chartControl = chartData.control || chartData.subcharts?.[subchartIndex].control;
  if (chartControl && (isHomepage !== true)) {
    hasChartControl = true;

    // Get the options for chartControl if hasChartControl
    chartControlOptions = {
      ...chartControl.options,
      ui: returnChartControlUI({
        chartControl,
        mainChartData: chartData,
        mainChartOptions: options,
        subchartIndex,
        theme,
        isPortrait
      })
    };

    // Swap touch events for mouse events on ChartRangeControl
    // as it doesn't support touch events on mobile
    if (chartControl.controlType === 'ChartRangeFilter') {
      useEffect(() => {
        const cleanupTouchEventListener = addTouchEventListenerForChartControl({ controlWrapper, chartID });
        return cleanupTouchEventListener;
      }, [controlWrapper]);
    }
  }

  // Properties for selecting (showing or hiding) the serie(s)
  const seriesSelector = options.seriesSelector || false;

  // Set new options prop and re-render the chart if theme or isPortrait changes
  useEffect(() => {
    if (seriesSelector) handleSeriesSelection(dataColumns); // this function set new options, too
    else {
      chartWrapper?.setOptions({
        ...options,
        ...(chartData.chartType === 'Calendar' && { height: chartTotalHeight })
      });

      chartWrapper?.draw();
      if (hasChartControl) {
        controlWrapper?.setOptions(chartControlOptions);
        controlWrapper?.draw();
      }
    }
  }, [theme, isPortrait, windowSize, chartTotalHeight]);


  const getInitialColumns = ({ chartWrapper, dataTable }) => {
    // Update the initial DataView's columns (often, all of the series are displayed initially)
    var initialView = chartWrapper.getView();
    // If (optional) columns is not specified in database
    // Assign it from DataTable
    if (initialView.columns == null) {
      const viewFromDataTable = new google.visualization.DataView(dataTable);
      chartWrapper.setView({
        columns: viewFromDataTable.columns
      });
      initialView = chartWrapper.getView();
    }

    let shouldAssignDomainRoleToFistColumn = true; // variable to only assign type: 'domain' to the very first column
    let dataSeriesIndex = 0;
    const allInitialColumns = initialView.columns.map((col, index) => {
      const sourceColumn = (typeof col === 'number') ? col : col.sourceColumn;
      const columnLabel = dataTable.getColumnLabel(sourceColumn);

      // A column can either be a number (that denotes the index of the sourceColumn) or an object
      // The code below harmonize all columns to be an object to store crucial data to toggle their visibility
      let newCol = (typeof col === 'number')
        ? {
          label: columnLabel,
          role: shouldAssignDomainRoleToFistColumn ? 'domain' : 'data',
          sourceColumn: sourceColumn
        }
        : { label: columnLabel, ...col };
      shouldAssignDomainRoleToFistColumn = shouldAssignDomainRoleToFistColumn && false;

      // Set the visibility of data column, initially, all data columns are selected
      if (newCol.role === 'data') {
        newCol.selected = true;
        newCol.seriesIndex = dataSeriesIndex;
        dataSeriesIndex++
      }
      return newCol;
    });


    // To track selection, only get the columns that are:
    // role === 'data'
    // visibleInLegend !== false
    const dataColumns = allInitialColumns.filter((col, index) => {
      return col.role === 'data' && options.series?.[index - 1]?.visibleInLegend !== false;
    });
    setDataColumns(dataColumns);
  };

  const handleSeriesSelection = (newDataColumns) => {
    setDataColumns(newDataColumns);

    const hiddenSeriesObject = {};
    newDataColumns.forEach((col) => {
      if (!col.selected)
        hiddenSeriesObject[col.seriesIndex] = {
          color: 'transparent',
          enableInteractivity: false,
          visibleInLegend: false
        }; // 'hide' the serie by making it transparent
    });

    chartWrapper?.setOptions({
      ...options,
      series: {
        ...options.series,
        ...hiddenSeriesObject
      }
    });

    // Call draw to apply the new DataView and 'refresh' the chart
    chartWrapper?.draw();

    if (hasChartControl) {
      controlWrapper?.draw();
    }
  };

  // Call this function to fetch the data and draw the initial chart
  useEffect(() => {
    if (google && !chartWrapper) {
      fetchDataFromSheet({ chartData: chartData, subchartIndex: subchartIndex })
        .then(response => {
          const thisDataTable = response.getDataTable();
          setDataTable(thisDataTable);
          const thisChartWrapper = new google.visualization.ChartWrapper({
            chartType: chartData.chartType,
            dataTable: (!hasChartControl) ? thisDataTable : undefined,
            options: options,
            view: {
              columns:
                chartData.columns
                || (chartData.subcharts
                  && chartData.subcharts[subchartIndex].columns)
                || null
                || null,
            },
            containerId: chartID
          });
          setChartWrapper(thisChartWrapper);

          if (hasChartControl) {
            const thisDashboardWrapper = new google.visualization.Dashboard(
              document.getElementById(`dashboard-${chartID}`));
            setDashboardWrapper(thisDashboardWrapper);

            google.visualization.events.addListener(thisDashboardWrapper, 'ready', onChartReady);

            const thisControlWrapper = new google.visualization.ControlWrapper({
              controlType: chartControl.controlType,
              options: chartControlOptions,
              containerId: `control-${chartID}`
            });
            setControlWrapper(thisControlWrapper);

            // Establish dependencies
            thisDashboardWrapper.bind(thisControlWrapper, thisChartWrapper);

            thisDashboardWrapper.draw(thisDataTable);
          }
          else {
            google.visualization.events.addListener(thisChartWrapper, 'ready', onChartReady);
            thisChartWrapper.draw();
          }

          if (seriesSelector) getInitialColumns({ chartWrapper: thisChartWrapper, dataTable: thisDataTable });

        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [google]);

  const renderChart = () => {
    if (hasChartControl) {
      return (
        <Stack
          id={`dashboard-${chartID}`}
          direction={ChartControlType[chartControl.controlType]?.stackDirection || 'column-reverse'}
          sx={{ height: '100%' }}
        >
          <Box
            id={`control-${chartID}`}
            sx={{
              height: `calc(${height} / 8)`,
              opacity: 0.8,
              filter: 'saturate(0.3)'
            }}
          />
          <Box id={chartID} sx={{ height: height, maxHeight: maxHeight }} />
        </Stack>
      )
    }
    else return <Box id={chartID} sx={{ height: height, maxHeight: maxHeight }} />;
  }

  const onChartReady = () => {
    if (chartData.chartType === 'Calendar') {
      // querySelector is used to select the first 'g' element in the svg
      // this is to get the height of the non-responsive element
      // to set the CalendarChart's height to make it resonsive
      const chartDOMContainer = document.getElementById(chartID).querySelector('svg > g:nth-of-type(1)');
      let renderedHeight = chartDOMContainer.getBBox().height;
      if (options.legend.position === 'none') renderedHeight += 50;
      setChartTotalHeight(renderedHeight);
    }

    if (!isFirstRender) return;
    // Hide the circleProgress when chart finishes rendering the first time
    setIsFirstRender(false);
  };

  return (
    <GoogleChartStyleWrapper
      isPortrait={isPortrait}
      className={className}
      position="relative"
      height="100%"
      minHeight={chartData.chartType === 'Calendar' && '200px'}
    >
      {/* Conditionally display loading animation here */}
      {isFirstRender && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <LoadingAnimation />
        </Box>
      )}

      {/* Conditionally display seriesSelector here */}
      {(seriesSelector && !isFirstRender) && (
        <SeriesSelector
          items={dataColumns}
          selectorID={`${chartData.title}-selector`}
          onSeriesSelection={handleSeriesSelection}
          isPortrait={isPortrait}
        />
      )}

      {/* Display chart here */}
      {renderChart()}
    </GoogleChartStyleWrapper>
  );
}