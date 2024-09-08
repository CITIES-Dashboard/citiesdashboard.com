import { Button } from '@mui/material';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import { useTheme } from '@mui/material/styles';

function StackedBarToggle({ onToggle, isStacked, isPortrait }) {
  const theme = useTheme();

  return (
    <Button
      variant="outlined"
      startIcon={isStacked ? <BarChartIcon /> : <StackedBarChartIcon />}
      sx={{
        width: isPortrait ? '100%' : 'auto',
        minWidth: '200px',
        borderRadius: theme.spacing(0.5),
        borderColor: theme.palette.text.disabled,
        color: theme.palette.text.secondary,
      }}
      onClick={onToggle}
      size="small"
    >
      {isStacked ? 'Unstack Bars' : 'Stack Bars'}
    </Button>
  );
}

export default StackedBarToggle;
