import React, { useState, useEffect, useMemo, useContext } from 'react';
import { Box } from '@mui/material/';
import { useTheme } from '@mui/material/styles';
import GoogleChartStyleWrapper from './SubchartUtils/GoogleChartStyleWrapper';
import LoadingAnimation from '../../Components/LoadingAnimation';
import { transformDataForNivoCalendarChart, transformDataForNivoHeatMap } from './NivoCharts/NivoChartHelper';
import { fetchDataFromSheet, returnGenericOptions } from '../GoogleChartHelper';
import { GoogleContext } from '../../ContextProviders/GoogleContext';
import NivoCalendarChart from './NivoCharts/NivoCalendarChart/NivoCalendarChart';
import NivoHeatMap from './NivoCharts/NivoHeatMap';

const NivoSubChart = ({ chartData, subchartIndex, windowSize, isPortrait, isHomepage, height, maxHeight }) => {
  const theme = useTheme();
  const [nivoData, setNivoData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const google = useContext(GoogleContext);

  const options = useMemo(() => returnGenericOptions({ chartData, subchartIndex, theme }), [chartData, subchartIndex, theme]);

  useEffect(() => {
    if (!google) return;
    const fetchData = async () => {
      try {
        const response = await fetchDataFromSheet({ chartData: chartData, subchartIndex: subchartIndex, google: google });
        const rawData = response.getDataTable();
        
        let transformedData;
        if (chartData.chartType === 'Calendar') {
          const dataColumn = chartData.columns?.[1] ?? chartData.subcharts?.[subchartIndex]?.columns?.[1] ?? 1;
          const tooltipColumn = getTooltipColumn(chartData, subchartIndex);
          transformedData = transformDataForNivoCalendarChart(rawData, dataColumn, tooltipColumn?.sourceColumn);
        } else if (chartData.chartType === 'HeatMap') {
          transformedData = transformDataForNivoHeatMap(rawData);
        }
        
        setNivoData(transformedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [chartData, subchartIndex, google]);

  const getTooltipColumn = (chartData, subchartIndex) => {
    let tooltipColumn = chartData.columns?.find(col => typeof col === 'object' && col.role === 'tooltip');
    if (!tooltipColumn && chartData.subcharts?.[subchartIndex]) {
      tooltipColumn = chartData.subcharts[subchartIndex].columns?.find(col => typeof col === 'object' && col.role === 'tooltip');
    }
    return tooltipColumn;
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
          <LoadingAnimation />
        </Box>
      );
    }

    if (chartData.chartType === 'Calendar') {
      return (
        <NivoCalendarChart
          dataArray={nivoData}
          isPortrait={isPortrait}
          options={options}
        />
      );
    } else if (chartData.chartType === 'HeatMap') {
      return (
        <NivoHeatMap
          data={nivoData}
          width={windowSize[0]}
          isPortrait={isPortrait}
          options={options}
          tooltipTemplate={chartData.tooltipFormat || chartData.subcharts?.[subchartIndex]?.tooltipFormat}
        />
      );
    }

    return null;
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
      {renderChart()}
    </GoogleChartStyleWrapper>
  );
};

export default NivoSubChart;