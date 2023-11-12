/* eslint-disable */

import { useState, useRef, useEffect, useContext, useMemo, useCallback, memo } from 'react';

import { GoogleContext } from '../../ContextProviders/GoogleContext';

import { Box, Stack, Tooltip, Typography } from '@mui/material/';

import { useTheme } from '@mui/material/styles';
import HeatMap from '../HeatMap';
import SeriesSelector from './SeriesSelector';

import { fetchDataFromSheet, generateRandomID, returnGenericOptions, returnCalendarChartOptions, returnChartControlUI, ChartControlType, addTouchEventListenerForChartControl } from '../GoogleChartHelper';

import GoogleChartStyleWrapper from './GoogleChartStyleWrapper';

import LoadingAnimation from '../../Components/LoadingAnimation';

import ChartSubstituteComponentLoader from '../ChartSubstituteComponents/ChartSubstituteComponentLoader';

import { isMobile } from 'react-device-detect';

import { transformDataForNivo } from '../GoogleChartHelper'

import { CalendarChart } from './NivoCalendarChart';

function SubChart(props) {
  // Props
  const { chartData, subchartIndex, windowSize, isPortrait, isHomepage, height, maxHeight } = props;

  // Early return if this doesn't contain a normal Google Chart but a chartSubstituteComponent
  const chartSubstituteComponentName = chartData.subcharts?.[subchartIndex].chartSubstituteComponentName;
  if (chartSubstituteComponentName) {
    return <ChartSubstituteComponentLoader chartSubstituteComponentName={chartSubstituteComponentName} />;
  }

  // Formulate the className
  const className = useMemo(() => {
    return chartData.customClassName ? `${chartData.chartType} ${chartData.customClassName}` : chartData.chartType;
  }, [chartData.customClassName, chartData.chartType]);


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
  // Get the current theme
  const theme = useTheme();

  // Get the options object for chart
  let options = useMemo(() => {
    let opts = returnGenericOptions({ ...props, theme });
    if (chartData.chartType === 'Calendar') {
      opts = returnCalendarChartOptions(opts);
    }
    return opts;
  }, [props, theme, chartData.chartType]);
  // State to store transformed data for CalendarChart
  const [calendarData, setCalendarData] = useState(null);
  // Early exit for 'Calendar' chartType
  if (chartData.chartType === 'Calendar') {
    useEffect(() => {
      if (!google) return;
      fetchDataFromSheet({ chartData: chartData, subchartIndex: subchartIndex })
        .then(response => {
          const rawData = response.getDataTable();
          const dataColumn = chartData.columns ? chartData.columns[1] : 1
            || chartData.subcharts[subchartIndex].columns ? chartData.subcharts[subchartIndex].columns[1] : 1;

          const getTooltipColumn = (chartData, subchartIndex) => {
            // Search in top-level columns
            let tooltipColumn = chartData.columns && chartData.columns.find(col => typeof col === 'object' && col.role === 'tooltip');

            // If not found, search in subcharts
            if (!tooltipColumn && chartData.subcharts && chartData.subcharts[subchartIndex]) {
              tooltipColumn = chartData.subcharts[subchartIndex].columns.find(col => typeof col === 'object' && col.role === 'tooltip');
            }

            return tooltipColumn;
          }

          const tooltipColumn = getTooltipColumn(chartData, subchartIndex).sourceColumn;
          const transformedData = transformDataForNivo(rawData, dataColumn, tooltipColumn);
          setCalendarData({ ...transformedData, options: options });
        })
        .catch(error => {
          console.log(error);
        });
    }, [google]);

    if (!calendarData) {
      return (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <LoadingAnimation />
        </Box>
      )
    }

    return (
      <GoogleChartStyleWrapper
        isPortrait={isPortrait}
        className={className}
        position="relative"
        minWidth="700px"
        height={isPortrait ? '400px' : '500px'}
      >
        <CalendarChart
          data={calendarData.data}
          dateRange={calendarData.dateRange}
          valueRange={calendarData.valueRange}
          isPortrait={isPortrait}
          options={options}
        />
      </GoogleChartStyleWrapper>
    );
  }

  // States of the Google Charts
  const [dataTable, setDataTable] = useState();
  const [chartWrapper, setChartWrapper] = useState();
  const [dashboardWrapper, setDashboardWrapper] = useState();
  const [controlWrapper, setControlWrapper] = useState();

  // To determine the first time the chart renders to show/hide the LoadingAnimation
  const [isFirstRender, setIsFirstRender] = useState(true);

  // Keep track of the columns (series) of the chart
  const [allInitialColumns, setAllInitialColumns] = useState();
  const [dataColumns, setDataColumns] = useState();
  const [initialVAxisRange, setInitialVAxisRage] = useState();

  // Define the DOM container's ID for drawing the google chart inside
  const [chartID, __] = useState(generateRandomID());

  // Calendar chart's properties
  const [chartTotalHeight, setChartTotalHeight] = useState(200);

  // Properties for chart control (if existed)
  const chartControl = chartData.control || chartData.subcharts?.[subchartIndex].control;

  // Memoize the computation of chartControlOptions
  const chartControlOptions = useMemo(() => {
    if (!chartControl || isHomepage) return null;

    return {
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
  }, [chartControl, chartData, options, subchartIndex, theme, isPortrait, isHomepage]);

  // Only show the chart control if:
  // It exists in the database (either for all subcharts or just for a particular subchart)
  // And if the chart is currently not shown on homePage
  const hasChartControl = Boolean(chartControl && !isHomepage);

  // Separate useEffect for touch event logic
  useEffect(() => {
    if (chartControl?.controlType === 'ChartRangeFilter') {
      const cleanupTouchEventListener = addTouchEventListenerForChartControl({ controlWrapper, chartID });
      return cleanupTouchEventListener;
    }
  }, [chartControl, controlWrapper, chartID]);

  // Properties for selecting (showing or hiding) the serie(s)
  const seriesSelector = options.seriesSelector || false;

  // Set new options prop and re-render the chart if theme or isPortrait changes
  useEffect(() => {
    if (!seriesSelector) {
      chartWrapper?.setOptions({
        ...options,
        ...(chartData.chartType === 'Calendar' && { height: chartTotalHeight })
      });
      chartWrapper?.draw();

      if (hasChartControl) {
        controlWrapper?.setOptions(chartControlOptions);
        controlWrapper?.draw();
      }
    } else {
      handleSeriesSelection(dataColumns);
    }

    // Set new initialColumnsColors if the theme changes
    // This only applies to when seriesSelector.method == "setViewColumn"
    if (dataColumns && seriesSelector?.method === "setViewColumn") {
      setInitialColumnsColors(dataColumns);
    }
  }, [theme, isPortrait, windowSize, chartTotalHeight]);

  const getInitialColumns = useCallback(({ chartWrapper, dataTable, seriesSelector }) => {
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
      // A column can either be a number (that denotes the index of the sourceColumn) or an object
      // The code below harmonize all columns to be an object to store crucial data to toggle their visibility
      if (typeof col === 'number') col = {
        role: shouldAssignDomainRoleToFistColumn ? 'domain' : 'data',
        sourceColumn: col
      }
      col.label = dataTable.getColumnLabel(col.sourceColumn);
      col.indexInAllInitialColumns = index;

      shouldAssignDomainRoleToFistColumn = shouldAssignDomainRoleToFistColumn && false;

      // Set the visibility of data column, 
      if (col.role === 'data') {
        // initially, all data columns are selected if multiple series are selectable
        if (seriesSelector?.allowMultiple) {
          col.selected = true;
        } else {
          // else for single serie selector, only first data column is selected
          if (dataSeriesIndex === 0) {
            col.selected = true;
          } else {
            col.selected = false;
          }
        }
        col.seriesIndex = dataSeriesIndex;
        dataSeriesIndex++;
      }
      return col;
    });
    setAllInitialColumns(allInitialColumns);
    const initialVAxisRange = getInitialVAxisRange({ dataTable: dataTable, allInitialColumns: allInitialColumns });
    setInitialVAxisRage(initialVAxisRange);
    // To track selection, only get the columns that are:
    // role === 'data'
    // visibleInLegend !== false
    const dataColumns = allInitialColumns.filter((col) => {
      return col.role === 'data' && options.series?.[col.seriesIndex]?.visibleInLegend !== false;
    });

    if (dataColumns && seriesSelector.method === "setViewColumn") setInitialColumnsColors({ dataColumns: dataColumns });

    setDataColumns(dataColumns);
    return dataColumns;
  }, [google, options, seriesSelector]);

  // Utility function for setting colors to dataColumns
  const setInitialColumnsColors = useCallback(({ dataColumns }) => {
    dataColumns?.forEach((col) => {
      // Assign inherit color to this data column
      col.color = options.colors[col.seriesIndex % options.colors.length];
      // Assign other inherit attributes from its serie object (if existed)
      col.serieAttribute = options.series?.[col.seriesIndex];
    });
  }, [options]);

  const getInitialVAxisRange = useCallback(({ dataTable, allInitialColumns }) => {
    let vAxisMin, vAxisMax;
    allInitialColumns.forEach((col, index) => {
      if (index === 0) return; // the first column is the domain (hAxis)
      const range = dataTable.getColumnRange(col.sourceColumn);
      if (!isNaN(range.min) && range.min) vAxisMin = vAxisMin ? Math.min(vAxisMin, range.min) : range.min;
      if (!isNaN(range.max) && range.max) vAxisMax = vAxisMax ? Math.max(vAxisMax, range.max) : range.max;
    });
    return { min: vAxisMin, max: vAxisMax };
  }, []);

  const handleSeriesSelection = useCallback((newDataColumns, _chartWrapper = chartWrapper) => {
    if (!allInitialColumns) return;

    setDataColumns(newDataColumns);

    if (seriesSelector.method === "toggleVisibility" || seriesSelector.method === null) {
      const hiddenSeriesObject = {};
      newDataColumns.forEach((col) => {
        if (!col.selected)
          hiddenSeriesObject[col.seriesIndex] = {
            color: 'transparent',
            enableInteractivity: false,
            visibleInLegend: false
          }; // 'hide' the serie by making it transparent
      });

      _chartWrapper?.setOptions({
        ...options,
        series: {
          ...options.series,
          ...hiddenSeriesObject
        }
      });
    }
    else if (seriesSelector.method === "setViewColumn") {
      let newViewColumns = [];
      newViewColumns.push(0); // this is the domain column
      newDataColumns.forEach((dataColumn) => {
        if (dataColumn.selected) {
          newViewColumns.push(dataColumn);
          // Find this dataColumn's supporting columns (whose role !== 'data')
          // A dataColumn has its supporting columns (can be many) follow it immediately
          for (let i = dataColumn.indexInAllInitialColumns + 1; i < allInitialColumns.length; i++) {
            if (allInitialColumns[i].role !== 'data') {
              newViewColumns.push(allInitialColumns[i]);
            }
            // If this loop encounter the next dataColumn, break the loop, all supporting columns for this dataColumn have been discovered
            else {
              break;
            }
          }
        }
      });
      _chartWrapper?.setView({ columns: newViewColumns });

      const newOptions = { ...options };
      // Preserve the initial vAxis range so that the vAxis doesn't shift based on the visible serie(s)
      // newOptions.vAxis.viewWindow = {
      //   min: (options.vAxis.viewWindow.min == null) ? initialVAxisRange.min : options.vAxis.viewWindow.min,
      //   max: (options.vAxis.viewWindow.max == null) ? initialVAxisRange.max : options.vAxis.viewWindow.max,
      // }
      // Set the new color array
      newOptions.colors = newDataColumns.filter((col) => col.selected).map((col) => col.color);
      // Set the new series object (if any)
      // this contains other series' attributes (lineWidth, seriesType...)
      const series = {};
      let selectedSeriesCount = 0;
      newDataColumns.forEach((col) => {
        if (!col.selected) return;
        if (col.serieAttribute != null) {
          series[selectedSeriesCount] = col.serieAttribute;
        }
        selectedSeriesCount++;
      })
      newOptions.series = series;
      _chartWrapper?.setOptions(newOptions);
    }

    // Call draw to apply the new DataView and 'refresh' the chart
    _chartWrapper?.draw();

    if (hasChartControl) {
      controlWrapper?.draw();
    }
  }, [allInitialColumns, options, seriesSelector, chartWrapper, controlWrapper, initialVAxisRange, hasChartControl]);

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

          // Run the seriesSelector for the first time
          if (seriesSelector) {
            const initColumns = getInitialColumns({ chartWrapper: thisChartWrapper, dataTable: thisDataTable, seriesSelector: seriesSelector });
            handleSeriesSelection(initColumns, thisChartWrapper);
          }

        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [google]);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [tooltipClosed, setTooltipClosed] = useState(false);

  const handleControlBoxClick = useCallback(() => {
    setTooltipOpen(false);
    setTooltipClosed(true);
  }, []);

  const shouldShowTooltip = useMemo(() => !tooltipClosed && !isMobile, [tooltipClosed, isMobile]);
  const rangeFilterTooltipText = 'Use the sliders to interact with the graph';

  const chartControlBox = useMemo(() => (
    <Box
      id={`control-${chartID}`}
      sx={{
        height: `calc(${height} / 8)`,
        mt: 1,
        opacity: 0.8,
        filter: 'saturate(0.3)'
      }}
      // Disable tooltip on click or drag
      onClick={handleControlBoxClick}
      // Show tooltip on hover if it hasn't been closed yet
      onMouseEnter={() => shouldShowTooltip && setTooltipOpen(true)}
    />
  ), [chartID, height, handleControlBoxClick, shouldShowTooltip]);

  const renderChartControlBox = () => {
    if (chartControl.controlType !== "ChartRangeFilter") {
      return chartControlBox;
    }

    return (
      <>
        {isMobile && !isFirstRender && (
          <Typography
            variant="caption"
            color={theme.palette.text.secondary}
            sx={{ textAlign: 'center', mt: 1 }}
          >
            {rangeFilterTooltipText}
          </Typography>
        )}
        <Tooltip
          title={rangeFilterTooltipText}
          placement="bottom"
          arrow
          open={tooltipOpen}
          onClose={() => setTooltipOpen(false)}
        >
          {chartControlBox}
        </Tooltip>
      </>
    );
  };

  const renderChart = () => {
    if (hasChartControl) {
      return (
        <Stack
          id={`dashboard-${chartID}`}
          direction={ChartControlType[chartControl.controlType]?.stackDirection || 'column-reverse'}
          sx={{ height: '100%' }}
        >
          {renderChartControlBox()}
          <Box id={chartID} sx={{ height: height, maxHeight: maxHeight }} />
        </Stack>
      );
    }
    return <Box id={chartID} sx={{ height: height, maxHeight: maxHeight }} />;
  };

  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => isMounted.current = false;
  }, []);

  const onChartReady = () => {
    if (!isMounted.current) return;

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
          allowMultiple={seriesSelector.allowMultiple}
          selectorID={`${chartData.title}-selector`}
          onSeriesSelection={handleSeriesSelection}
        />
      )}

      {/* Display chart here */}
      {renderChart()}
    </GoogleChartStyleWrapper>
  );
}

export default memo(SubChart);