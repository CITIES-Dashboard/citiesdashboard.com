// SubChart.jsx (Main component to decide which SubChart to render)
import React from 'react';
import GoogleSubChart from './GoogleSubChart';
import NivoSubChart from './NivoSubChart';
import { useMemo } from 'react';
// import NivoSubChart from './NivoSubChart';
import GoogleSheetEmbedVisualization from '../GoogleSheetEmbedVisualization';
import { Box } from '@mui/material';

const NewSubChart = (props) => {
  const { chartData, subchartIndex } = props;

  const className = useMemo(() => {
    return chartData.customClassName ? `${chartData.chartType} ${chartData.customClassName}` : chartData.chartType;
  }, [chartData.customClassName, chartData.chartType]);

  if (chartData.chartType === 'GoogleSheetEmbedVisualization') {
    return (
      <Box
        position="relative"
        className={className}
        height={chartData.height}
        maxWidth={chartData.maxWidth ? chartData.maxWidth : '100%'}
        width="100%"
        sx={{ pt: 2, pb: 2, margin: 'auto' }}
      >
        <GoogleSheetEmbedVisualization
          publishedSheetId={chartData.publishedSheetId}
          gid={chartData.gid || chartData.subcharts[subchartIndex]?.gid || null}
          range={chartData.range || chartData.subcharts[subchartIndex]?.range || null}
        />
      </Box>
    );
  }

  if (['Calendar', 'HeatMap'].includes(chartData.chartType)) {
    return <NivoSubChart {...props} />;
  }

  // Default to GoogleSubChart for all other chart types
  return <GoogleSubChart {...props} />;
};

export default NewSubChart;