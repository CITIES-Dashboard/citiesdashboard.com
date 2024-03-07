/* eslint-disable */
import { useEffect, useState } from 'react';
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { useTheme } from '@mui/material/styles';
import { Box, Chip } from '@mui/material';

import parse from 'html-react-parser';
import { replacePlainHTMLWithMuiComponents } from '../../Utils/Utils';

const addCommasToNumber = (number) => number.toLocaleString();

// Custom Tooltip Component
const HeatMapTooltip = ({ node, tooltipText, hoverTarget }) => {
    // Getting data required for the tooltip
    const rowCategory = node.cell.id.split('.')[0];
    const columnCategory = node.cell.id.split('.')[1];
    const value = addCommasToNumber(node.cell.data.y);
    const percentage = hoverTarget === 'row' ? node.cell.data.rowPercentage : node.cell.data.colPercentage;
    let rowOrColTotal = hoverTarget === 'row' ? node.cell.data.rowTotal : node.cell.data.colTotal;
    rowOrColTotal = addCommasToNumber(rowOrColTotal);
    const color = node.cell.color;

    // Replacing placeholders with actual values
    const updatedTooltipText = tooltipText
        .replace('{y}', value)
        .replace('{percentage}', percentage)
        .replace('{rowOrColTotal}', rowOrColTotal)
        .replace('{rowCategory}', rowCategory)
        .replace('{columnCategory}', columnCategory);

    return (
        <Box className='nivo-tooltip'>
            <Chip sx={{ backgroundColor: color, mr: 0.5, height: '10px', width: '10px', borderRadius: '50%' }} />
            {parse(updatedTooltipText, { replace: replacePlainHTMLWithMuiComponents })}
        </Box>
    );
};

// Function to find the range of y (numerical) values of the heatmap's data
const findRangeOfYValues = (data) => {
    let allYValues = data.flatMap(group => group.data.map(item => item.y));
    let minValue = Math.min(...allYValues);
    let maxValue = Math.max(...allYValues);
    return { minValue, maxValue };
};

export const NivoHeatMap = ({ data, width, isPortrait, options, tooltipTemplate }) => {
    const theme = useTheme();

    // --- Get Range of Data (Currently, for coloring labels for readability) ---
    const [yValueRange, setYValueRange] = useState({ minValue: null, maxValue: null });
    const [numColumns, setNumColumns] = useState(0);

    useEffect(() => {
        // Calculate the range of y values when data changes
        const range = findRangeOfYValues(data);
        setYValueRange(range);

        // Calculate the number of columns in the heatmap
        setNumColumns(data[0].data.length);
    }, [data]); // Dependency array: Recalculate when 'data' changes

    if (yValueRange.minValue === null || yValueRange.maxValue === null) {
        return null;
    }

    // Calculate the midpoint of the range
    const midPoint = (yValueRange.minValue + yValueRange.maxValue) / 2;

    // --- Get text for tooltip from provided (HTML) tooltip template ---
    const extractTooltipText = (tooltipTemplate) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(tooltipTemplate, 'text/html');
        return doc.body.innerHTML;
    };

    return (
        <ResponsiveHeatMap
            data={data}
            {...options?.nivoHeatMap}
            forceSquare={true}
            margin={
                isPortrait
                    ? { top: 70, right: 110, bottom: 60, left: 120 }
                    : { top: 100, right: 90, bottom: 60, left: 90 }
            }

            // --- Labels ---
            // Display both absolute and percentage values in cell labels
            label={({ data }) => {
                // Use a light label color if y value is greater than 50% of graph range
                // This is done to improve graph readability
                let fontColor = data.y > midPoint && '#cfd8dc';

                // Display label with the value and the appropriate percentage
                return (
                    <tspan fill={fontColor} fontSize="0.7rem">
                        {addCommasToNumber(data.y)}
                        <tspan
                            x="0"
                            dy="1.35em"
                            fill={fontColor}
                            fontSize="0.6rem"
                        >
                            ({
                                options?.nivoHeatMap?.hoverTarget === 'row'
                                    ? data.rowPercentage
                                    : data.colPercentage
                            })
                        </tspan>
                    </tspan>
                )
            }}

            // --- Chart Color Scheme ---
            colors={{
                type: 'diverging',
                scheme: 'purples',
                divergeAt: 0.2
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
                    length: Math.max(width, 500),
                    thickness: width / 100,
                    direction: 'row',
                    tickSpacing: width / 200,
                    tickOverlap: false,
                    tickFormat: '>-.1s',
                }
            ]}
            axisTop={{
                orient: "left",
                tickRotation: -90
            }}
            axisRight={isPortrait === true || numColumns <= 5}

            // --- Tooltip ---
            // Use custom tooltip component
            tooltip={node => (
                <HeatMapTooltip
                    node={node}
                    tooltipText={extractTooltipText(tooltipTemplate)}
                    hoverTarget={options?.nivoHeatMap?.hoverTarget}
                />
            )}
            animate={false}
        />
    );
};
