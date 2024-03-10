# Context Providers: Facilitating State Management and Sharing

[CommentCountsContext](./CommentCountsContext.jsx): Facilitates the fetching and sharing of comment counts from the Hyvor Talk API across the application. This context ensures comment counts for different pages are fetched asynchronously upon component mount, stored, and made easily accessible to any component consuming this context.

[GoogleContext](./GoogleContext.jsx): Manages the loading of the Google Charts library, providing access to Google Charts functionalities throughout the application. It ensures the library is only loaded once and is accessible in any component that requires it.

[HomePageContext](./HomePageContext.jsx): Provides a centralized store for managing and sharing state relevant to the homepage, such as featured projects / datasets, ensuring that this data is fetched once and efficiently shared across homepage components, primarily the project cards.

[LinkContext](./LinkContext.jsx): Manages the state and behavior of links within the application, offering a unified approach to handling navigation and link tracking, making it easier to manage internal and external links dynamically.

[RawDatasetsMetadataContext](./RawDatasetsMetadataContext.jsx): Offers an application-wide access point for accessing dataset metadata from the `datasets` repo, facilitating efficient data fetching, caching, and sharing of dataset details across project pages, which allow for dataset download.

[SheetsDataContext](./SheetsDataContext.jsx): Provides access to the Google Sheets API, ensuring seamless integration and uniform access to spreadsheet data throughout the application. Supports accessing sheets metadata and other services.

[TabContext](./TabContext.jsx): Controls tab state and navigation within the application, allowing components to share and update tab-related state seamlessly, ensuring a consistent and synchronized user experience across tabbed interfaces.