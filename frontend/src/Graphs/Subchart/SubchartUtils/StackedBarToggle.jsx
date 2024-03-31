import { Button } from '@mui/material';
import StackedBarChartIcon from '@mui/icons-material/StackedBarChart';
import BarChartIcon from '@mui/icons-material/BarChart';

function StackedBarToggle({ onToggle, isStacked, isPortrait, theme }) {
  return (
    <Button
      variant="outlined"
      startIcon={isStacked ? <BarChartIcon /> : <StackedBarChartIcon />}
      sx={{
        width: isPortrait ? '100%' : 'auto',
        minWidth: '200px',
        mt: theme.spacing(1),
        mb: theme.spacing(-1),
        borderRadius: theme.spacing(1),
        borderColor: theme.palette.grey[700],
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
