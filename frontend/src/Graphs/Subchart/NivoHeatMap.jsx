/* eslint-disable */
import { useEffect, useState } from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { useTheme } from '@mui/material/styles';
import { Box, Chip } from '@mui/material';

// Custom Tooltip Component
const HeatMapTooltip = ({ node }) => {
    // Getting data required for the tooltip
    const userCategory = node.cell.serieId;
    const { percentage, x, y } = node.cell.data;
    const color = node.cell.color;

    return (
        <Box className='nivo-tooltip'>
            <Chip sx={{ backgroundColor: color, mr: 0.5, height: '10px', width: '10px', borderRadius: '50%' }} />
            <span><strong>{x}</strong>: {y}</span>
            <div>{percentage} of all pages used by {userCategory}</div>
        </Box>
    );
};

const findRangeOfYValues = (data) => {
    let allYValues = data.flatMap(group => group.data.map(item => item.y));
    let minValue = Math.min(...allYValues);
    let maxValue = Math.max(...allYValues);
    return { minValue, maxValue };
};

export const NivoHeatMap = ({ data, width, isPortrait, options }) => {
    const theme = useTheme();
    const [yValueRange, setYValueRange] = useState({ minValue: null, maxValue: null });

    useEffect(() => {
        // Calculate the range of y values when data changes
        const range = findRangeOfYValues(data);
        setYValueRange(range);
    }, [data]); // Dependency array: Recalculate when 'data' changes

    if (yValueRange.minValue === null || yValueRange.maxValue === null) {
        return null;
    }

    // Calculate the midpoint of the range
    const midPoint = (yValueRange.minValue + yValueRange.maxValue) / 2;

    return (
        <ResponsiveHeatMap
            data={data}
            {...options?.nivoHeatMap}
            forceSquare={true}
            margin={
                isPortrait
                    ? { top: 100, right: 125, bottom: 50, left: 125 }
                    : { top: 100, right: 90, bottom: 60, left: 90 }
            }

            // borderWidth={1}
            // borderColor={theme.palette.customBackground}

            // // Custom theming for Dark mode
            // opacity={theme.palette.mode === 'dark' ? 0.7 : 1}
            // activeOpacity={theme.palette.mode === 'dark' ? 0.7 : 1}

            // --- Labels ---
            // Display both absolute and percentage values in cell labels
            label={({ data }) => {
                // Use a light label color if y value is greater than 50% of graph range
                // This is done to improve graph readability
                let fontColor = data.y > midPoint && '#cfd8dc';

                return (
                    <tspan fill={fontColor}>
                        {data.y}
                        <tspan
                            x="0"
                            dy="1.2em"
                            fill={fontColor}
                        >
                            ({data.percentage})
                        </tspan>
                    </tspan>
                )
            }}

            // --- Chart Color Scheme ---
            colors={{
                type: 'diverging',
                scheme: 'purples',
                divergeAt: 0.3
            }}

            emptyColor={theme.palette.background.default}
            theme={{
                text: {
                    fill: theme.palette.text.secondary,
                }
            }}

            // --- Axes + Legends ---
            legends={[
                {
                    title: options?.nivoHeatMap?.legends?.[0].title,
                    anchor: 'bottom',
                    translateX: 0,
                    translateY: 35,
                    length: width / 2,
                    thickness: width / 100,
                    direction: 'row',
                    tickSpacing: width / 200,
                    tickOverlap: false,
                    tickFormat: '>-.2s',
                }
            ]}
            axisTop={{
                orient: "left",
                tickRotation: -90
            }}
            axisRight={isPortrait === true || null}

            // --- Tooltip ---
            // Use custom tooltip component
            tooltip={node => <HeatMapTooltip node={node} />}
            animate={false}
        />
    );
};
