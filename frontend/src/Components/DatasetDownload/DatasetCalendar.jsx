import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { styled } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { DayCalendarSkeleton } from '@mui/x-date-pickers/DayCalendarSkeleton';
import Card from '@mui/material/Card';
import ClickAwayListener from '@mui/base/ClickAwayListener';

const HighlightedDay = styled(PickersDay)(({ theme }) => ({
  // styles for dot
  '&:after, :hover::after': {
    content: '"."',
    fontSize: '1.5rem',
    bottom: '-0.5rem',
    position: 'absolute',
    color: theme.palette.primary.main,
    opacity: 0.5
  },
  '&:hover::after': {
    opacity: 1
  }
}));

function isValidDate(date, validDates) {
  return validDates.indexOf(dayjs(date).format('YYYY-MM-DD')) >= 0;
}

function isValidYear(date, earliestYear) {
  return dayjs(date).year() >= earliestYear;
}

// returns an the earliest year that has valid dates in it
function getEarliestYear(validDates) {
  console.log(validDates);
  return validDates.reduce((earliestYear, curDate) => {
    console.log(Math.min(earliestYear, parseInt(dayjs(curDate).format('YYYY'), 10)));
    return Math.min(earliestYear, parseInt(dayjs(curDate).format('YYYY'), 10));
  }, dayjs().year());
}

function ServerDay(props) {
  const { versionDates = [], day, ...other } = props;

  const isHighlighted = versionDates.indexOf(dayjs(day).format('YYYY-MM-DD')) >= 0;

  return (
    isHighlighted
      ? <HighlightedDay {...other} day={day} />
      : <PickersDay {...other} day={day} />
  );
}

export default function DatasetCalendar(props) {
  const { onChange, versions } = props;
  // const [earliestYear, setEarliestYear] = useState(dayjs().year());

  const versionDates = versions
    .filter((version) => version.version.length === 10) // valid date
    .map((version) => version.version);

  // useEffect(() => {
  //   setEarliestYear(getEarliestYear(versionDates));
  // }, [setEarliestYear, versionDates]);

  return (
    <ClickAwayListener onClickAway={() => onChange('close')}>
      <Card
        sx={{ position: 'absolute', right: 0, zIndex: 999 }}
        raised
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            loading={!versionDates}
            format="YYYY-MM-DD"
            renderLoading={() => <DayCalendarSkeleton />}
            slots={{
              day: ServerDay,
            }}
            onChange={(value, selectionState) => {
              if (selectionState === 'finish') {
                return onChange(dayjs(value).format('YYYY-MM-DD'));
              }
              return null;
            }}
            slotProps={{
              day: {
                versionDates
              }
            }}
            // disable the date if its not a valid date
            shouldDisableDate={(day) => !isValidDate(day, versionDates)}
            disableHighlightToday
            // shouldDisableYear={(year) => !isValidYear(year, earliestYear)}
            minDate={dayjs(versionDates.slice(-1)[0])}
            maxDate={dayjs(versionDates[0])}
          />
        </LocalizationProvider>
      </Card>
    </ClickAwayListener>
  );
}
