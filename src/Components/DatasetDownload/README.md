# Dataset Download Components

This directory contains components essential to the Dataset Download functionality within the project. These components work together to provide a user-friendly interface for accessing and downloading different versions of datasets associated with a project.

## Components Overview

### DatasetCalendar.jsx

The `DatasetCalendar.jsx` component enriches the dataset download functionality by offering a visual interface for selecting dataset versions based on their modification dates. This component integrates seamlessly with the dataset download dialog, providing a user-friendly method to navigate through different versions of datasets.

**Key Features:**

- **Date Navigation**: Allows users to visually identify and select different versions of a dataset based on dates, highlighted within the calendar.
- **Material-UI and dayjs**: Built using Material-UI components for consistency and aesthetics, and utilizes the `dayjs` library for efficient date manipulation.
- **Highlighted Dates**: Dates with available dataset versions are highlighted, offering clear visual cues to users about the available data points.
- **Adaptive Design**: Responsive to screen size, ensuring a coherent user experience across desktop and mobile devices.
- **Seamless Integration**: Works in conjunction with `DatasetDownloadDialog` and `DatasetFetcher` to provide a cohesive workflow for dataset preview and download.
- **Performance Optimization**: By highlighting only the dates with available versions and caching selected dates, it enhances the performance and user experience without redundant fetches.

### DatasetFetcher.jsx

The `DatasetFetcher.jsx` component is responsible for the retrieval of datasets from specified URLs. It is designed to handle different file formats and ensure the data is fetched and parsed correctly for use within the application.

**Key Features:**

- **`fetchDataFromURL`**: An asynchronous function that fetches data from a provided URL. It supports `.csv` and `.json` files, parsing them accordingly.
- **File Extension Support**: Currently, it handles `.csv` and `.json` extensions, returning the content in a parsed format. Other file types are returned as-is, without parsing.
- **Error Handling**: Includes checks to verify the URL points to a valid file, enhancing the robustness of the data fetching process.

### DatasetDownloadDialog.jsx

At the heart of the dataset download UI, `DatasetDownloadDialog.jsx` facilitates user interaction with the raw datasets, including versions and previews.

**Key Features:**

- **Dialog Interface**: Utilizes a Material-UI dialog with a `maxWidth` of `lg`, providing a pop-up experience on desktops and a full-screen display on smaller devices.
- **Nested Components**: Incorporates several nested components for a cohesive experience, including `DatasetSelectorAndPreviewer` and `DatasetsTable`.
- **Metadata Utilization**: Leverages metadata from `RawDatasetsMetadataContext` to display appropriate datasets and their versions.
- **Version Handling**: Defines versions based on modification dates (YYYY-MM-DD) for simplicity and clarity.
- **Initial Display and Interaction**: On initial dialog opening, displays a preview of the latest version of the first dataset, updating as users select different datasets or versions.
- **DatasetCalendar Integration**: For datasets with more than three versions, a calendar component (`DatasetCalendar`) is used to navigate between versions effectively.
- **Optimized Downloading**: Implements Blob for direct downloads without needing to redirect users or re-fetch data, enhancing efficiency.
- **Memory Optimization**: Caches fetched datasets to minimize redundant fetches, improving performance and user experience.