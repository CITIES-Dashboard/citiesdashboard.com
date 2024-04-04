# Subchart

The `SubChart` component is an integral part of the CITIES dashboard, designed to dynamically render various subcharts in a chart. Its architecture allows it to support a wide array of chart types, including both Google Charts and Nivo Charts, accommodating the specific requirements of different datasets and visualization preferences. 

### Imports
- **React Hooks and Contexts**: Utilizes standard React hooks (`useState`, `useRef`, `useEffect`, `useContext`, `useMemo`, `useCallback`, `memo`) for state management, referencing DOM elements, performing side effects, memoization, and optimizing re-renders. The `memo` function wraps the component to prevent unnecessary re-renders.
- **ContextProviders**: `GoogleContext` is used to load the Google Charts library and provide access to Google Charts components and functions. The library can only be loaded once during the entire life cycle of the web app; therefore, it is implemented in a Context Provider.
- **Chart Components and Helpers**: ([Detailed documentation for these functions](../readme.md))
  1.  `fetchDataFromSheet`: Fetches data from a Google Sheet for chart rendering. This data is then used by Google Charts and Nivo Charts to generate visualizations.

  2. **Google Charts Components and Helpers**:
   - `generateRandomID`: Generates unique IDs for Google Charts containers.
   - `returnGenericOptions`: Parses `chartData` (constructed from `temp_database.json` file), together with some other props such as `subchartIndex`, `isPortrait`, and `isHomepage`, to return the appropriate `options` property for the Google charts.
   - `returnChartControlUI`: Returns formatting options for the appearance of the chart controls
   - `ChartControlType`: Enumerates different types of chart controls available.
   - `addTouchEventListenerForChartControl`: Enhances chart controls with touch event listeners for improved mobile interaction.
   - `GoogleChartStyleWrapper`: A wrapper component for styling Google Charts.
  
  3. **Nivo Charts Helper Functions**:
   - `transformDataForNivo`: Transforms data into a format compatible with Nivo charts.
   - `convertToNivoHeatMapData`: Specifically prepares data for rendering Nivo HeatMap charts.
  
  4. **General Utility Functions and Components for Chart Loading and Control**:
   - `LoadingAnimation`: Displays a loading animation while chart data is being fetched or processed.
   - `getCalendarChartMargin`, `yearSpacing`: Utility functions specific to calendar chart layout adjustments.
   - `ModifiedCategoryFilterForTimeline`: A customized component for filtering categories, often used with timeline or category-based charts.
- **Device Detection**: `isMobile` from `react-device-detect` helps adjust the component's behavior or layout based on the device type, enhancing responsiveness and user experience.

### Props
- `chartData`: The data for the chart to be rendered (parsed and modified from [temp_database.json](../../temp_database.json)). This is the core information that dictates what type of chart and how it is configured.
- `subchartIndex`: Used to locate the specific subchart within the chartData array, ensuring the correct subchart is rendered.
- `windowSize`: Information about the current window size for responsive charts (Google Charts is partially responsive, but not 100%)
- `isPortrait`: A boolean indicating if the device orientation is portrait, influencing chart layout decisions. For example, in portrait mode, the legend is displayed on top of the chart while in landscape mode, it is on the right side.
- `isHomepage`: A flag to indicate if the chart is being rendered on the homepage (as a promo teaser). This is used to determine if certain features like chart controls, tooltips, [SeriesSelector](./SubchartUtils/SeriesSelector.jsx), etc., should be displayed or not, since the chart on the home page must be stripped down for simplicity.
- `height`, `maxHeight`: Specify the desired height constraints for the chart.

### Early Return Conditions
The `SubChart` component employs several early return conditions, primarily when we want to render special kinds of charts that do not follow the general configurations of the majority of Google Charts.

*Class Name Configuration*: Before proceeding with the early exits, the component constructs a `className` for the chart container using `useMemo`. This class name might include a custom class defined in `chartData` along with the chart type, ensuring that each chart can be styled further via CSS.

1. **GoogleSheetEmbedVisualization Early Exit**: If the chart type is identified as a `GoogleSheetEmbedVisualization`, the component renders such component directly and exits early. This bypass is specific to handling heat map charts, utilizing props such as `publishedSheetId`, `gid`, and `range` from `chartData` to configure the heat map. Technically, a `GoogleSheetEmbedVisualization` is not a chart but an `<iframe>` embed of a Google Sheet. Its documentation can be found [here](../README.md#googlesheetembedvisualizationjsx).

2. **Nivo Calendar Chart Early Exit**: Similarly, if the chart type is `Calendar`, it returns early and renders a (Nivo) `CalendarChart` component. This process involves fetching data from a Google Sheet, transforming it into a format suitable for a Nivo `CalendarChart`, and calculating the chart's height based on the number of years covered by the data. This dynamic height calculation ensures that the calendar chart responsively accommodates all data points across different years.

3. **Nivo HeatMap Early Exit**: For `HeatMap` chart types, the component similarly fetches and processes data specifically for rendering with the `NivoHeatMap` component. 

### Google Charts Rendering and Interactive Features
After handling early exits for specific chart types, the component focuses on rendering standard Google Charts and enhancing them with interactive features such as SeriesSelector, Stacked Bar Toggle, and various Chart Controls. This section delves into the setup, rendering, and interaction management for Google Charts within the `SubChart` component.

#### Setup and Initial Render
- **Google Visualization API**: The component utilizes the Google Visualization API, made accessible through the `GoogleContext`, to dynamically load and render Google Charts based on `chartData`.
- **Dynamic ID and State Management**: A unique ID for each chart instance is generated to prevent DOM conflicts. States for the chart wrapper, data table, and control wrappers are managed to handle the chart's lifecycle and interactions efficiently.
- **Chart Options and Configuration**: Chart options are computed based on the provided `chartData`, `options`, and the application's current theme and orientation, ensuring a responsive and visually consistent rendering.

#### Rendering Process
- **Data Fetching and Transformation**: Data required for chart rendering is fetched asynchronously from Google Sheets, and, if necessary, transformed to fit the specific requirements of the chart being rendered.
- **Chart and Dashboard Wrapper Initialization**: Depending on whether the chart includes interactive controls, a dashboard wrapper may be initialized to bind control wrappers to the chart wrapper, facilitating interactive data filtering and manipulation.

#### Interactive Features
- **Series Selector**: Allows users to dynamically select which data series are visible on the chart, enhancing the chart's interactivity and user engagement. This feature is implemented by manipulating the chart's view columns or toggling series visibility. ([*Detailed documentation for SeriesSelector can be found here*](./SubchartUtils/README.md))
- **Stacked Bar Toggle**: Offers the ability to switch between stacked and unstacked representations for bar charts, providing different perspectives on the dataset. This is achieved by toggling the `isStacked` option in the chart's configuration. ([*Detailed documentation for `StackedBarToggle` can be found here*](./SubchartUtils/README.md))
- **Chart Controls**: Supports the integration of various Google Chart controls (e.g., range filters, category filters) to enable dynamic data exploration. Custom UI adjustments and enhancements, such as touch event listeners for mobile responsiveness, are applied to these controls for an improved user experience. These controls can be enabled via the subchart's `options` configuration in `temp_database.json`. ([*Documentation for Google Charts Chart Controls*](https://developers.google.com/chart/interactive/docs/gallery/controls))
- **Tooltip Management for Chart Controls**: Implements logic to display informative tooltips for certain chart controls (e.g., ChartRangeFilter), guiding users on their functionality. This includes managing tooltip visibility based on user interactions and device type. For instance, tooltips for `ChartRangeFilter` are displayed on hover for desktop users and by default for mobile users under the chart range filter.

#### Lifecycle and Re-render Optimization
- **Memoization and Callbacks**: The component uses `useMemo` and `useCallback` hooks to optimize the computation of chart options and control configurations, preventing unnecessary re-renders and computations.
- **Responsive Adjustments**: Reacts to changes in theme, device orientation, and window size, dynamically adjusting chart options and control configurations to ensure an optimal visual presentation and user experience across devices.