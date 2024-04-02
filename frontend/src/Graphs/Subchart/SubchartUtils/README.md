# SubchartUtils

This folder contains the utility functions for the subchart component.

### [`GoogleChartStyleWrapper.jsx`](GoogleChartStyleWrapper.jsx)
This provides a re-usable wrapper container for subcharts to alter its appearance through MUI's styled component. This is necessary, even with Google Chart's default `options` parameter which allows modifications of the chart's appearance, because some advanced stylings were hard-coded in the library and requires being overridden with additional CSS code. For example:
- Styling for the chart's tooltip when the user hovers over a series or a data point in the chart.
- Chart control's appearance, to make them look more consistent with the dashboard's theme, instead of the default Google Chart's look (that looks quite similar to plain HTML)

### [`StackedBarToggle.jsx`](StackedBarToggle.jsx)
This file contains the StackedBarToggle component, which is a toggle switch that allows the user to switch between a stacked bar chart and a grouped bar chart. It works by changing the `toggleStackedBars` boolean in the subchart's `options` object, which is then passed to the Google Charts component to determine whether to display a stacked bar chart or a grouped bar chart.

### [`SeriesSelector.jsx`](SeriesSelector.jsx)
This component is designed to enable users to select / deselect data series in visualizations, providing users with the ability to customize the data displayed according to their preferences. This component is particularly useful in contexts where visualizations involve multiple data series (like grouped bar charts) and where user control over the visibility of these series enhances the analysis experience.

#### Key Features and Implementation Details:

- **Flexible Selection Mechanism**: Supports both single and multiple selections, allowing users to choose one or several data series to be displayed. This flexibility is controlled through the `allowMultiple` prop.

- **Dynamic Series Population**: Series items are dynamically populated from the `itemsFromChart` prop, making the component adaptable to various data structures and visualization needs.

- **User Interaction**:
  - Single selection mode utilizes radio buttons for clear, exclusive choices.
  - Multiple selection mode employs checkboxes for each series item and includes a "Display All Series" option with a switch to quickly select or deselect all series.

- **Customized Menu Properties**: Utilizes `MenuProps` to style the dropdown menu, enhancing the user interface with custom heights, overflow behaviors, and background colors derived from the theme context.

- **State Management and Effects**:
  - The component maintains internal state for selected items and the "Select All" toggle, updating in response to user interactions and external prop changes.
  - Uses `useEffect` hooks to react to changes in props and to enforce rules like auto-selecting the first series in single-selection mode.

- **Theme Integration**: Leverages `useTheme` to apply consistent styling and to adapt visual elements such as checkboxes, radio buttons, and the "Select All" switch according to the application's theme.

- **Series Selection Callback**: Communicates user selections back to the parent component via the `onSeriesSelection` callback, facilitating responsive data visualization updates based on user-selected series.

- **Accessibility and Visibility**: Enhances accessibility and visual hierarchy by disabling the deselection of the last remaining selected item in single-selection mode, ensuring that at least one data series remains visible.

The exact props passed to the `SeriesSelector` component can be found in the [`Subchart.jsx`](../SubChart.jsx) file, where the component is integrated into the subchart visualization via subchart options.

### [`ModifiedCategoryFilterForTimeline.jsx`](ModifiedCategoryFilterForTimeline.jsx)
This component is implemented specifically for chart 2 in Printing data project, although it can be re-used if future charts need to:
- Leverage Google Chart's native `CategoryFilter` implementation logic to filter a chart based on some categories (from a column in the fetched Google Sheet data)
- Use MUI's beautiful components to make a slider so that the user can quickly navigate between different categories
- Only suitable for charts whose categories make sense to be laid out on a slider, for example:
   - Discrete date / month / time, sorted chronologically
   - Discrete non-time values, sorted in increasing order
   - Support for continuous slider has not been implemented

This component is used in `Subchart.jsx`, in the function `renderChartControlBox`, to replace the Google Chart's native `CategoryFilter`, if `isSlider` is specified to be true (in `control.options` in `temp_database.json` file). Together with the function `handleCategoryChange` in the same file, they help to propagate changes to the slider so it can display appropriate value in the `ModifiedCategoryFilterForTimeline` component.