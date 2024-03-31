# Graphs

The components in `src/Graphs` are the heart and soul of CITIES Dashboard. They provide re-usable components to draw different kinds of charts, as well as interactive components to switch between different subcharts or filter and modify the appearance of the charts.

[GoogleChartHelper.jsx](GoogleChartHelper.jsx):

This file contains helper functions to fetch data from Google Sheets and format it for Google Charts, as well as to format the appearance of the charts. It also contains a function to add touch event listeners to the chart controls, as Google Charts do not natively support touch events.

Some sub-components / functions in this file include:

1. fetchDataFromSheet
   This function uses Google Visualization query language (link here) to **asynchronously** fetch data from a specified Google Sheet document to draw using Google Charts library.
   
   It gathers metadata such as headers, query, and gid for the query to return exactly what we want to visualize. These metadata are stored in temp_database.json and given to this function via the prop chartData, in ChartComponent and SubChart component.
   
   As this function depends on the Google Charts library to finish loading, it must not be called until after the `google` global variable has been initialized and assigned an appropriate value.

2. returnGenericOptions
   This function parses chartData (constructed from temp_database.json), together with some other props such as subchartIndex, isPortrait, and isHomepage, to return the appropriate `options` property for the Google charts. `options` mainly concerns the appearance of the charts, and not the underlying data. Therefore, this function can be understood as "formatting" the charts to the desired appearance.
   
   As temp_database.json is structured in such a way that for charts with subcharts, any properties in the subcharts `options` object will override duplicate properties in the main charts `options`, the function makes multiple modifications to `options` to arrive at the final, most complete one. It also supplies `options` with default properties which are shared among all charts, such as `theme: 'material'`. It also parses properties stored in temp_database.json which are not native to Google Charts, such as `serie.color = 'default'`, to match the React's application theme, avoiding hard-coding such values in the database, making the entire project more modular.

As Google Charts is inherently not 100% responsive, it also invokes other functions defined in this file GoogleChartHelper.jsx, such as `returnResponsiveFontSizeInPixels`, to make the charts more readable in mobile devices.

returnChartControlUI:

ChartControlType:
An object literal to centrally store some customized metadata for the chart control, such as the position with respect to the actual chart, depending on the chart control's type, for better user experience.

addTouchEventListenerForChartControl:
Unfortunately, by default, Google Chart's control `...` do not work for touch devices. Thus, this function is implemented as a work-around to allow touch interaction with this control. It uses...


ChartComponent.jsx
This is the wrapper component to display a visualization in the dashboard. This wrapper container also implements `Tabs` as a way to quickly navigate between different subcharts of the same chart, provided that they are available. Subcharts generally provide closely related data visualizations for one single metric for a given chart. Some examples include:
- Multiple subcharts for Calendar chart to visualize the absolute amount of food waste, each subchart represent one single meal's food waste (breakfast, lunch, dinner...)
- Multiple subcharts to visualize the number pages printed by 4 different user groups, the first subchart compares the Absolute number of pages among user groups, while the second subchart compares this data proportionally as percentage among user groups.

If subcharts are available, `Tabs` are shown and their navigation logic is implemented (via the TabContext). By default, the first subchart is shown after the user loads the page; tab positions do not persist between page loads as they are only saved in memory.

If subcharts are not available, one single chart is displayed instead, without any `Tabs`.

Special methods:
- handleWindowResize: added to a `resize` event listener, together with a debounce of 100ms, to resize the chart container upon window resize. This is due to the fact that Google Charts are not 100% responsive out of the box, and requires further customization, such as determining if the current window is portrait or not, to improve the charts' readability in small screen devices.
- handleChange: listen to changes in the selected tab for a given chart to update the display of its subcharts accordingly, via TabContext.


Heatmap.jsx
This component is only currently used for Athletic checkin project, in charts 3 and 4. Barely a chart, it simply provides a re-usable component to visually embed a Google Sheet on the dashboard. Any formatting (such as color, row and column size, text style...) must be done on the Google Sheet, as this component only embed the sheet via an `<iframe>` tag.

This component requires 3 simple prop:
- publishedSheetId: the ID of the entire Google Sheet document containing the desired sheet to be embedded
- gid: the id of the specific sheet to be embedded 
- range: the range of the cells to be embedded, following Google's format (insert link here)
... All of which can be added in and parsed from the temp_database.json file, similar to any other different kinds of charts.

ChartSubstituteComponents/readme.md
Currently unused but can come in handy in the future. This component provides a way to load a harmonized component in place of the default Chart component. The Loader provides a wrapper with Suspense to dynamically import a component with chartSubstituteComponentName given as the Loader's only argument.

GoogleChartStyleWrapper.jsx
This provides a re-usable wrapper container for subcharts to alter its appearance through MUI's styled component. This is necessary, even with Google Chart's default `options` parameter which allows modifications of the chart's appearance, because some advanced stylings were hard-coded in the library and requires being overridden with additional CSS code. For example:
- Styling for the chart's tooltip when the user hovers over a series or a data point in the chart.
- Chart control's apperance, to make them look more consistent with the dashboard's theme, instead of the default Google Chart's look (that looks quite similar to plain HTML)

ModifiedCategoryFilterForTimeline.jsx
This component is implemented specifically for chart 2 in Printing data project, although it can be re-used if future charts need to:
- Leverage Google Chart's native `CategoryFilter`implementation logic to filter a chart based on some categories (from a column in the fetched Google Sheet data)
- Use MUI's beautiful components to make a slider so that the user can quickly navigate between different categories
- Only suitable for charts whose categories make sense to be laid out on a slider, for example:
- Discrete date / month / time, sorted chronologically
- Discrete non-time values, sorted in increasing order
- Support for continuous slider has not been implemented

This component is used in Subchart.jsx, in the function renderChartControlBox, to replace the Google Chart's native `CategoryFilter`, if `isSlider` is specified to be true (in control.options in temp_database.json). Together with the function handleCategoryChange in the same file, they help to propagate changes to the slider so it can display appropriate value in the ModifiedCategoryFilterForTimeline component.
