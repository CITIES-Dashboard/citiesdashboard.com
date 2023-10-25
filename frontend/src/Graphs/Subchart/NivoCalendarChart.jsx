/* eslint-disable */

import { ResponsiveCalendar } from '@nivo/calendar'
import { useTheme } from '@mui/material/styles';

const CalendarChart = ({ data }) => {
    const theme = useTheme();

    return (
        <ResponsiveCalendar
            data={data}
            from="2021-01-01"
            to="2023-12-31"
            emptyColor = {theme.palette.mode === 'dark' ? '#2b2b2b' : '#e8e8e8'}
            theme={{
                textColor: theme.palette.text.primary,
                fontSize: 11,
                tooltip: {
                    container: {
                        background: theme.palette.mode === 'dark' ? '#2b2b2b' : '#fff',
                        color: theme.palette.text.primary,
                    },
                },
                axis: {
                    ticks: {
                        line: {
                            stroke: theme.palette.mode === 'dark' ? '#2b2b2b' : '#fff',
                        },
                        text: {
                            fill: theme.palette.text.primary,
                        },
                    },
                },
                grid: {
                    line: {
                        stroke: theme.palette.mode === 'dark' ? '#2b2b2b' : '#fff',
                    },
                },
            }}
            colors={['#61cdbb', '#97e3d5', '#e8c1a0', '#f47560']}
            margin={{ top: 40, right: 40, bottom: 40, left: 40 }}
            yearSpacing={40}
            monthBorderColor="#ffffff"
            dayBorderWidth={2}
            dayBorderColor="#ffffff"
        />
    );
};

export default CalendarChart;