# Context Providers: Facilitating State Management and Sharing

[CommentCountsContext](./CommentCountsContext.jsx): Facilitates the fetching and sharing of comment counts from the Hyvor Talk API across the application. This context ensures comment counts for different pages are fetched asynchronously upon component mount, stored, and made easily accessible to any component consuming this context.

[GoogleContext](./GoogleContext.jsx): Manages the loading of the Google Charts library, providing access to Google Charts functionalities throughout the application. It ensures the library is only loaded **once** and is accessible in any component that requires it.

[HomePageContext](./HomePageContext.jsx): Provides a centralized store for managing and sharing state relevant to the homepage, such as featured projects / datasets, ensuring that this data is fetched once and efficiently shared across homepage components, primarily the project cards.

[LinkContext](./LinkContext.jsx): Manages the state and behavior of links within the application to keep track of the current page's location and a list of all the charts' title of a given project.

[PreferenceContext](./PreferenceContext.jsx): Sets user theme preference based on localStorage or system preference, and ensures that theme preferences are stored and shared across the application.

[RawDatasetsMetadataContext](./RawDatasetsMetadataContext.jsx): Offers an application-wide access point for accessing dataset metadata from the [`datasets`](https://github.com/CITIES-Dashboard/datasets) repo, facilitating efficient data fetching, caching, and sharing of dataset details across project pages.

[SheetsDataContext](./SheetsDataContext.jsx) [DEPRECATED]: Provides access to the Google Sheets API, ensuring seamless integration and uniform access to spreadsheet data throughout the application. Supports accessing sheets metadata (to fetch the last update data of a project) and other services. **Deprecated** in favor of fetching the last update data from the [`datasets_metadata.json`](https://github.com/CITIES-Dashboard/datasets/blob/main/datasets_metadata.json) file from the datasets repo.

[TabContext](./TabContext.jsx): Controls tab state for projects with charts which have multiple subcharts.

[YearRangeContext](./YearRangeContext.jsx): This context is used in the implementation of the year range slider. It ensures that all subcharts in a chart share the same year range. The year range is modified by the slider in [SubChart.jsx](/src/Graphs/Subchart/SubChart.jsx).