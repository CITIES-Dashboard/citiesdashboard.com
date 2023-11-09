/* eslint-disable */

import { ResponsiveCalendar } from '@nivo/calendar';
import { useTheme } from '@mui/material/styles';
import { Box, Chip, Typography } from '@mui/material';

export const CalendarChart = ({ data, isPortrait, colors }) => {
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
            colors={colors}
            margin={isPortrait
                ? { top: 30, right: 10, bottom: 10, left: 20 }
                : { top: 40, right: 40, bottom: 40, left: 40 }
            }
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

export const GradientBox = ({ minValue, maxValue, calendarColors }) => {
    const theme = useTheme();

    const containerStyle = {
        position: 'relative',
        width: 'fit-content',
        marginTop: '1rem',
        left: '74%',
    }

    const gradientStyle = {
        background: `linear-gradient(to right, ${calendarColors[0]}, ${calendarColors[calendarColors.length - 1]})`,
        color: theme.palette.text.primary,
        border: `1.5px solid ${theme.palette.text.primary}`,
        minWidth: '150px',
        height: '1.1rem',
        maxHeight: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
    };

    const labelStyle = {
        position: 'relative',
        top: '-1.15rem',
        fontSize: '0.8rem',
    };

    return (
        <Box style={containerStyle}>
            <Box style={gradientStyle}>
                <span style={labelStyle}>{minValue}</span>
                <span style={labelStyle}>{maxValue}</span>
            </Box>
        </Box>
    );
};
