import { Slider, Typography, Grid, Stack } from '@mui/material';

const extractContentInParentheses = (inputString) => {
  if (typeof inputString !== 'string') return null;

  const start = inputString.indexOf('(') + 1;
  const end = inputString.indexOf(')');
  return start && end > start ? inputString.slice(start, end) : null;
};

// eslint-disable-next-line max-len
function ModifiedCategoryFilterForTimeline({ onSliderChange, allCategories, currentCategoryIndex }) {
  if (allCategories.length === 0) return null;

  const valueLabelFormat = (index) => `${extractContentInParentheses(allCategories[index])}`;

  return (
    <Stack direction="column">
      <Grid container spacing={2}>
        <Grid item xs={2} textAlign="end">
          <Typography variant="caption" color="text.secondary">{valueLabelFormat(0)}</Typography>
        </Grid>

        <Grid item xs={8}>
          <Slider
            size="small"
            value={currentCategoryIndex}
            valueLabelFormat={valueLabelFormat(currentCategoryIndex)}
            valueLabelDisplay="auto"
            step={1}
            marks
            min={0}
            max={allCategories.length - 1}
            onChange={onSliderChange}
          />
        </Grid>

        <Grid item xs={2}>
          <Typography variant="caption" color="text.secondary">{valueLabelFormat(allCategories.length - 1)}</Typography>
        </Grid>
      </Grid>
      <Typography textAlign="center" variant="body2" color="text.secondary">
        <b>Showing data for:</b>
        &nbsp;
        {valueLabelFormat(currentCategoryIndex)}
      </Typography>
    </Stack>

  );
}

export default ModifiedCategoryFilterForTimeline;
