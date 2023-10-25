/* eslint-disable */

import { ResponsiveCalendar } from '@nivo/calendar';
import { useTheme } from '@mui/material/styles';
import { Chip, Typography } from '@mui/material';

const CalendarChart = ({ data }) => {
    const theme = useTheme();

    // Function to extract tooltip text from HTML tooltip
    const extractTooltipText = (tooltip) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(tooltip, 'text/html');
        return doc.body.innerHTML;
    };

    return (
        <ResponsiveCalendar
            data={data}
            from="2021-01-01"
            to="2023-12-31"
            emptyColor={theme.palette.mode === 'dark' ? '#2b2b2b' : '#dfdbdb'}
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
            tooltip={({ day, value, color }) => {
                const tooltipData = data.find(item => item.day === day);
                const tooltipText = tooltipData ? extractTooltipText(tooltipData.tooltip) : '';
                return (
                    <div style={{
                        padding: '12px',
                        background: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        color: theme.palette.text.primary
                    }}>
                        <Chip style={{ backgroundColor: color, marginRight: '8px', height: '14px', width: '14px', borderRadius: '50%' }} />
                        <Typography variant="body2" component="span" dangerouslySetInnerHTML={{ __html: tooltipText }} />
                    </div>
                );
            }}
        />
    );
};

export default CalendarChart;
