/* eslint-disable */
import { ResponsiveHeatMap } from '@nivo/heatmap';
import { useTheme } from '@mui/material/styles';

// TODO: Pass width as prop
export const NivoHeatMap = ({ data }) => {
    const theme = useTheme();
    return (
        <ResponsiveHeatMap
            data={data}
            forceSquare={true}
            margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
            // Display both absolute and percentage values in the label
            label={({ data }) => (
                <tspan>
                    {data.y}
                    <tspan x="0" dy="1.2em">
                        ({data.percentage})
                    </tspan>
                </tspan>
            )}
            labelTextColor={{
                from: 'color',
                modifiers: [['darker', 3]]
            }}
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
            // Display the Y axis on the right side of the chart
            axisRight={{
                orient: 'right',
            }}
            legends={[
                {
                    anchor: 'bottom',
                    translateX: 0,
                    translateY: 35,
                    length: 450, // Make this width / 2
                    thickness: 9, // Make this width / 100
                    direction: 'row', 
                    tickSpacing: 4.5, // Make this width / 200
                    tickOverlap: false,
                    tickFormat: '>-.2s',
                }
            ]}
        />
    );
};
