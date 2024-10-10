// GoogleSubChart.jsx
import React, { useState, useEffect, useContext, useMemo, useCallback } from 'react';
import { GoogleContext } from '../../ContextProviders/GoogleContext';
import { Box, Stack, Tooltip, Typography } from '@mui/material/';
import { useTheme } from '@mui/material/styles';
import SeriesSelector from './SubchartUtils/SeriesSelector';
import StackedBarToggle from './SubchartUtils/StackedBarToggle';
import { fetchDataFromSheet, generateRandomID, returnGenericOptions, returnChartControlUI, ChartControlType, addTouchEventListenerForChartControl } from '../GoogleChartHelper';
import GoogleChartStyleWrapper from './SubchartUtils/GoogleChartStyleWrapper';
import LoadingAnimation from '../../Components/LoadingAnimation';
import { isMobile } from 'react-device-detect';
import ModifiedCategoryFilterForTimeline from './SubchartUtils/ModifiedCategoryFilterForTimeline';

const GoogleSubChart = ({ chartData, subchartIndex, windowSize, isPortrait, isHomepage, height, maxHeight, currentSubchart }) => {
  const google = useContext(GoogleContext);
  const theme = useTheme();
  const options = useMemo(() => returnGenericOptions({ chartData, subchartIndex, theme, isHomepage, isPortrait }), [chartData, subchartIndex, theme, isHomepage, isPortrait]);

  const [dataTable, setDataTable] = useState();
  const [chartWrapper, setChartWrapper] = useState();
  const [dashboardWrapper, setDashboardWrapper] = useState();
  const [controlWrapper, setControlWrapper] = useState();
  const [isFirstRender, setIsFirstRender] = useState(true);
  const [allInitialColumns, setAllInitialColumns] = useState();
  const [dataColumns, setDataColumns] = useState();
  const [initialVAxisRange, setInitialVAxisRange] = useState();
  const [chartID] = useState(generateRandomID());
  const [chartTotalHeight, setChartTotalHeight] = useState(200);

  const chartControl = chartData.control || chartData.subcharts?.[subchartIndex]?.control;
  const hasChartControl = Boolean(chartControl && !isHomepage);

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

  const seriesSelector = options.seriesSelector || false;
  const toggleStackedBars = options.toggleStackedBars || false;
  const [isStacked, setIsStacked] = useState(options.isStacked || false);
  const isSlider = hasChartControl ? chartControl.options?.isSlider : false;
  const [allCategoriesForCategoryFilter, setAllCategoriesForCategoryFilter] = useState([]);
  const [currentCategoryIndexForCategoryFilter, setCurrentCategoryIndexForCategoryFilter] = useState([]);

  useEffect(() => {
    if (chartControl?.controlType === 'ChartRangeFilter') {
      return addTouchEventListenerForChartControl({ controlWrapper, chartID });
    }
  }, [chartControl, controlWrapper, chartID]);

  useEffect(() => {
    if (seriesSelector) {
      handleSeriesSelection({ newDataColumns: dataColumns });
    } else {
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

  useEffect(() => {
    if (!dataColumns) return;
    if (seriesSelector && seriesSelector.method === "setViewColumn") {
      setInitialColumnsColors({ dataColumns: dataColumns });
      handleSeriesSelection({ newDataColumns: dataColumns });
    }
  }, [theme]);

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
        // initially, all data columns are selected
        col.selected = true;
        col.seriesIndex = dataSeriesIndex;
        dataSeriesIndex++;
      }
      return col;
    });
    setAllInitialColumns(allInitialColumns);
    const initialVAxisRange = getInitialVAxisRange({ dataTable: dataTable, allInitialColumns: allInitialColumns });
    setInitialVAxisRange(initialVAxisRange);
    // To track selection, only get the columns that are:
    // role === 'data'
    // visibleInLegend !== false
    const dataColumns = allInitialColumns.filter((col) => {
      return col.role === 'data' && options.series?.[col.seriesIndex]?.visibleInLegend !== false;
    });

    if (dataColumns && seriesSelector.method === "setViewColumn") setInitialColumnsColors({ dataColumns: dataColumns });

    setDataColumns(dataColumns);
    return { initAllInitialColumns: allInitialColumns, initDataColumns: dataColumns };
  }, [google, options, seriesSelector]);

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

  const handleSeriesSelection = useCallback(({
    newDataColumns,
    _allInitialColumns = allInitialColumns,
    _chartWrapper = chartWrapper,
    _controlWrapper = controlWrapper
  }) => {
    if (!_allInitialColumns) return;

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

      if (hasChartControl) {
        const currentControlOptions = _controlWrapper?.getOptions();
        _controlWrapper?.setOptions({
          ...currentControlOptions,
          ui: {
            ...currentControlOptions.ui,
            chartOptions: {
              ...currentControlOptions.ui.chartOptions,
              series: {
                ...options.series,
                ...hiddenSeriesObject
              }
            }
          }
        });
      }
    }
    else if (seriesSelector.method === "setViewColumn") {
      let newViewColumns = [];
      newViewColumns.push(0); // this is the domain column
      newDataColumns.forEach((dataColumn) => {
        if (dataColumn.selected) {
          newViewColumns.push(dataColumn);
          // Find this dataColumn's supporting columns (whose role !== 'data')
          // A dataColumn has its supporting columns (can be many) follow it immediately
          for (let i = dataColumn.indexIn_ + 1; i < _allInitialColumns.length; i++) {
            if (_allInitialColumns[i].role !== 'data') {
              newViewColumns.push(_allInitialColumns[i]);
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

      if (hasChartControl) {
        const currentControlOptions = _controlWrapper?.getOptions();
        _controlWrapper?.setOptions({
          ...currentControlOptions,
          ui: {
            ...currentControlOptions.ui,
            chartOptions: {
              ...currentControlOptions.ui.chartOptions,
              colors: newOptions.colors,
              series: newOptions.series
            },
            chartView: {
              columns: newViewColumns
            }
          }
        });
      }
    }

    // Call draw to apply the new DataView and 'refresh' the chart
    _chartWrapper?.draw();

    if (hasChartControl) {
      _controlWrapper?.draw();
    }
  }, [allInitialColumns, options, seriesSelector, chartWrapper, controlWrapper, initialVAxisRange, hasChartControl]);

  const reconstructFunctionFromJSONstring = (columns) => {
    if (!columns) return;

    const evaluatedColumns = [];
    for (const column of columns) {
      if (typeof column === 'number') {
        // If it's a number, add it as-is
        evaluatedColumns.push(column);
      } else if (typeof column === 'object') {
        if (column.calc && column.calc !== 'stringify') {
          // If it's an object with a 'calc' property, evaluate the 'calc' function
          // using new Function() and add the result to the evaluatedColumns array
          const calcFunction = new Function("dataTable", "rowNum", column.calc);
          evaluatedColumns.push({
            ...column,
            calc: calcFunction,
          });
        } else {
          // If it's an object without a 'calc' property, or with calc = 'stringify', add it as-is
          evaluatedColumns.push(column);
        }
      }
    }
    return evaluatedColumns;
  };

  useEffect(() => {
    if (google && !chartWrapper) {
      fetchDataFromSheet({ chartData: chartData, subchartIndex: subchartIndex, google: google })
        .then(response => {
          const thisDataTable = response.getDataTable();
          setDataTable(thisDataTable);

          // Get dataColumn views
          const columns = chartData.columns
            || (chartData.subcharts
              && chartData.subcharts[subchartIndex].columns)
            || null
            || null;
          const reconstructedColumns = reconstructFunctionFromJSONstring(columns);

          const thisChartWrapper = new google.visualization.ChartWrapper({
            chartType: chartData.chartType,
            dataTable: (!hasChartControl) ? thisDataTable : undefined,
            options: options,
            view: {
              columns: reconstructedColumns
            },
            containerId: chartID
          });
          setChartWrapper(thisChartWrapper);

          let thisControlWrapper;
          if (hasChartControl) {
            const thisDashboardWrapper = new google.visualization.Dashboard(
              document.getElementById(`dashboard-${chartID}`));
            setDashboardWrapper(thisDashboardWrapper);
            google.visualization.events.addListener(thisDashboardWrapper, 'ready', onChartReady);

            thisControlWrapper = new google.visualization.ControlWrapper({
              controlType: chartControl.controlType,
              options: chartControlOptions,
              containerId: `control-${chartID}`
            });
            setControlWrapper(thisControlWrapper);

            // Set all of the available distinct categories for the CategoryFilter if isSlider is true
            if (isSlider) {
              const uniqueCategories = thisDataTable
                .getDistinctValues(chartControlOptions.filterColumnIndex)
                .filter(c => c !== null);

              setAllCategoriesForCategoryFilter(uniqueCategories);
              setCurrentCategoryIndexForCategoryFilter(uniqueCategories.length - 1);
            }

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
            const { initAllInitialColumns, initDataColumns } = getInitialColumns({ chartWrapper: thisChartWrapper, dataTable: thisDataTable, seriesSelector: seriesSelector });
            handleSeriesSelection({
              _allInitialColumns: initAllInitialColumns,
              newDataColumns: initDataColumns,
              _chartWrapper: thisChartWrapper,
              _controlWrapper: thisControlWrapper
            });
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
        opacity: chartControl?.controlType === 'ChartRangeFilter' ? 0.8 : 1,
        filter: 'saturate(0.3)'
      }}
      onClick={handleControlBoxClick}
      onMouseEnter={() => shouldShowTooltip && setTooltipOpen(true)}
    />
  ), [chartID, height, handleControlBoxClick, shouldShowTooltip]);

  const renderChartControlBox = () => {
    if (chartControl.controlType === "CategoryFilter") {
      return isSlider ? (
        <>
          <ModifiedCategoryFilterForTimeline
            allCategories={allCategoriesForCategoryFilter}
            currentCategoryIndex={currentCategoryIndexForCategoryFilter}
            onSliderChange={handleCategoryChange}
          />
          <Box display="none">{chartControlBox}</Box>
        </>
      ) : chartControlBox;
    }

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

  const handleStackedBarChart = useCallback(() => {
    if (chartWrapper) {
      const newOptions = {
        ...options,
        isStacked: !isStacked
      };
      chartWrapper.setOptions(newOptions);
      chartWrapper.draw();
      setIsStacked(!isStacked);
    }
  }, [chartWrapper, isStacked, options]);

  const handleCategoryChange = (_, newValue) => {
    if (!isSlider || !controlWrapper) return;
    controlWrapper.setState({
      selectedValues: [allCategoriesForCategoryFilter[newValue]]
    });
    setCurrentCategoryIndexForCategoryFilter(newValue);
    controlWrapper.draw();
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

  const onChartReady = () => {
    if (!isFirstRender) return;
    setIsFirstRender(false);
  };

  return (
    <GoogleChartStyleWrapper
      isPortrait={isPortrait}
      className={chartData.customClassName ? `${chartData.chartType} ${chartData.customClassName}` : chartData.chartType}
      position="relative"
      height="100%"
      minHeight={chartData.chartType === 'Calendar' && '200px'}
      overflow={isHomepage ? 'hidden' : 'visible'}
    >
      {isFirstRender && (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <LoadingAnimation />
        </Box>
      )}
      {(seriesSelector && !isFirstRender && !isHomepage) && (
        <SeriesSelector
          items={dataColumns}
          allowMultiple={seriesSelector.allowMultiple}
          selectorID={`${chartData.title}-selector`}
          onSeriesSelection={handleSeriesSelection}
        />
      )}
      {(toggleStackedBars && !isHomepage && !isFirstRender) && (
        <StackedBarToggle
          onToggle={handleStackedBarChart}
          isStacked={isStacked}
          isPortrait={isPortrait}
          theme={theme}
        />
      )}
      {renderChart()}
    </GoogleChartStyleWrapper>
  );
};

export default GoogleSubChart;