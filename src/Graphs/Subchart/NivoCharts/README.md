# NivoCharts

The components in this folder are used to display visualizations using the [Nivo](https://nivo.rocks/) library. Nivo is a data visualization library built on top of D3.js and React. It provides a rich set of components for creating charts, including responsive calendar charts and heatmaps. **Nivo Charts are occasionally used in place of Google Charts because they are more robust.**

### [NivoCalendarChart.jsx](NivoCalendarChart.jsx)
This component integrates Nivo's `ResponsiveCalendar` component for displaying a performant and resposnive calendar chart. It enhances user interaction through custom tooltips and supports theming to match the application's aesthetic.

- **Data Visualization**: Leverages Nivo's `ResponsiveCalendar` to present data in a calendar format, enabling users to visually track data trends across days, months, or years.
- **Custom Tooltips**: Implements dynamic tooltips that display additional data or insights when hovering over calendar cells. Tooltips adjust their positioning based on the cell's location to enhance readability.
- **Theme Integration**: Utilizes the application's theme settings (`useTheme`) to style the calendar and tooltips, ensuring consistency with the overall design.
- **Responsive Design**: Adapts the calendar's margin and layout (`getCalendarChartMargin`) based on the device orientation, optimizing the display for both portrait and landscape views.
- **Legend Display**: Optionally includes a gradient legend (`GradientBox`) to illustrate the range of values displayed on the calendar, providing context for the data visualization.
- **Utility Functions**: Employs utility functions like `generateColorGradient` to dynamically generate color gradients for the calendar based on specified color ranges, adding visual depth to the data representation.

**Note**: We decided to use Nivo's calendar chart instead of Google Charts primarily due to its performance. Google Charts' calendar chart was not as performant as Nivo's, causing lag and rendering issues. Nivo's calendar chart is better optimized, preventing performance bottlenecks when rendering calendar charts.

### [NivoHeatmap.jsx](NivoHeatmap.jsx)
This component integrates a responsive heatmap chart using Nivo's `ResponsiveHeatMap` for visualizing complex data matrices with both absolute and percentage values. Tailored for adaptability, it enhances user experience with custom tooltips and dynamic coloring for readability.

- **Data Visualization**: Utilizes `ResponsiveHeatMap` to display data based on provided `data` prop, adjusting to both portrait and landscape orientations.
- **Custom Tooltips**: Employs a `HeatMapTooltip` component for enriched tooltip content, dynamically displaying detailed data points upon hover.
- **Adaptive Styling**: Integrates with the application's theme (`useTheme`) for consistent styling, and employs `styled` for additional CSS adjustments.
- **Dynamic Range Calculation**: Automatically calculates and adjusts the range of y values within the dataset to inform coloring and labeling strategies for enhanced clarity and user interpretation.
- **Tooltip Content Extraction**: Parses provided HTML tooltip templates using `DOMParser`, allowing for flexible and accessible tooltip content customization.
- **Labeling Strategy**: Conditions label color within cells based on value thresholds, improving readability against varying background intensities.