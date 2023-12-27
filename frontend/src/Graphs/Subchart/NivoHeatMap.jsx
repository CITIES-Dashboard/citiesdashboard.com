/* eslint-disable */
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { useTheme } from '@mui/material/styles';

export const NivoHeatMap = ({ data, width, isPortrait }) => {
    const theme = useTheme();
    return (
        <ResponsiveHeatMap
            data={data}
            forceSquare={true}
            margin={
                isPortrait
                ? { top: 0, right: 125, bottom: 0, left: 125 }
                : { top: 60, right: 90, bottom: 60, left: 90 }
            }

            // --- Labels ---
            // Display both absolute and percentage values in the label
            label={({ data }) => (
                <tspan>
                    {data.y}
                    <tspan x="0" dy="1.2em">
                        ({data.percentage})
                    </tspan>
                </tspan>
            )}
            // Label text styling
            labelTextColor={{
                from: 'color',
                modifiers: [['darker', 3]]
            }}

            // --- Chart Color Scheme ---
            colors={{
                type: 'sequential',
                scheme: 'cool',
            }}
            emptyColor="#555555"
            theme={{
                text: {
                    fill: theme.palette.text.secondary,
                }
            }}

            // --- Axes + Legends ---
            // Display the Y axis on the right side of the chart
            axisRight={{
                orient: 'right',
            }}
            legends={[
                {
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
        />
    );
};
