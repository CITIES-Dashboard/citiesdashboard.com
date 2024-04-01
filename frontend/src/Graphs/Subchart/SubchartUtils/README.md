# SubchartUtils

This folder contains the utility functions for the subchart component.

### [`GoogleChartStyleWrapper.jsx`](GoogleChartStyleWrapper.jsx)
This provides a re-usable wrapper container for subcharts to alter its appearance through MUI's styled component. This is necessary, even with Google Chart's default `options` parameter which allows modifications of the chart's appearance, because some advanced stylings were hard-coded in the library and requires being overridden with additional CSS code. For example:
- Styling for the chart's tooltip when the user hovers over a series or a data point in the chart.
- Chart control's appearance, to make them look more consistent with the dashboard's theme, instead of the default Google Chart's look (that looks quite similar to plain HTML)

### [StackedBarToggle.jsx](StackedBarToggle.jsx)
This file contains the StackedBarToggle component, which is a toggle switch that allows the user to switch between a stacked bar chart and a grouped bar chart. It works by changing the `toggleStackedBars` boolean in the subchart's `options` object, which is then passed to the Google Charts component to determine whether to display a stacked bar chart or a grouped bar chart.

### [`SeriesSelector.jsx`](SeriesSelector.jsx)

### [`ModifiedCategoryFilterForTimeline.jsx`](ModifiedCategoryFilterForTimeline.jsx)
This component is implemented specifically for chart 2 in Printing data project, although it can be re-used if future charts need to:
- Leverage Google Chart's native `CategoryFilter` implementation logic to filter a chart based on some categories (from a column in the fetched Google Sheet data)
- Use MUI's beautiful components to make a slider so that the user can quickly navigate between different categories
- Only suitable for charts whose categories make sense to be laid out on a slider, for example:
   - Discrete date / month / time, sorted chronologically
   - Discrete non-time values, sorted in increasing order
   - Support for continuous slider has not been implemented

This component is used in `Subchart.jsx`, in the function `renderChartControlBox`, to replace the Google Chart's native `CategoryFilter`, if `isSlider` is specified to be true (in `control.options` in `temp_database.json` file). Together with the function `handleCategoryChange` in the same file, they help to propagate changes to the slider so it can display appropriate value in the `ModifiedCategoryFilterForTimeline` component.