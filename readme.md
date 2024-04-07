**Last Update:** April 2024

### TODO for documentation
Section 2. Make a quick sketch on draw.io that can help explain the overall architecture of the dashboard better (interplay between frontend and sheet and raw dataset syncer for example) 

2.1 A brief overview of these files and directories that make up the application, and link to their documentation ✅

2.3.2 explain  "chartCounts": 6,
    "embeddedWebsite": "https://citiesair.com/nyuadmap",
    "externalWebsite": "https://citiesair.com/dashboard/nyuad?source=cities-dashboard"
as it's embedded iframe for the home tiles and not follow the standard chart like the other ones

2.3.2 add that owner is an array

2.3.2 rawDataTables is only used for dataset fetcher script now, not displayed in the project anymore. Instead, talk more about the new component: DatasetDownload component below

2.3.3 remove react google chart references (btw, do this for everywhere)

2.3.3 add the unique parameters for options that are not native to google charts, the one that we gradually added more because of nivo or stack/unstack button... try to be exhaustive here, all the custom parameters we added, perhaps also put a href link to the components that deal with each parameter as well

2.3.3 add mentions for control as well, but just shortly

# CITIES DASHBOARD
- [CITIES DASHBOARD](#cities-dashboard)
- [1. Introduction](#1-introduction)
- [2. General Technical Description](#2-general-technical-description)
  - [2.1. Main Files and Directories](#21-main-files-and-directories)
  - [2.2. Google Sheets database](#22-google-sheets-database)
  - [2.3. Front-end Database and Google Charts Data Visualization](#23-front-end-database-and-google-charts-data-visualization)
    - [2.3.1. JSON array level](#231-json-array-level)
    - [2.3.2. Data set level](#232-data-set-level)
    - [2.3.3. Chart level](#233-chart-level)
  - [2.4 Deployment Process](#24-deployment-process)
- [3. Build and Test Locally](#3-build-and-test-locally)
  - [3.1. Prerequisites](#31-prerequisites)
  - [3.2. Install Dependencies and Run the Application](#32-install-dependencies-and-run-the-application)

# 1. Introduction

The CITIES Dashboard offers interactive data visualizations on various aspects of living at NYU Abu Dhabi. Its prominent features include:

![homepage](/documentation/home-page.png)
*The Home page of the dashboard where all data sets / projects are displayed*

![project-page](/documentation/project-page.png)
*The project page showing the general description of the data set, dataset metadata (such as owner and last update date)...*

![project-page-3](/documentation/project-page-3.png)
*...raw dataset download and version control...*

![project-page-2](/documentation/project-page-2.png)
*...and data visualizations (made with Google Charts and/or Nivo Charts)*

![about-page](/documentation/about-page.png)
*The About section of the dashboard, detailing CITIES' social network accounts and describing the rationale of the project, together with a Get In Touch form*


# 2. General Technical Description

The CITIES Dashboard is built with [React.js](https://react.dev/) and [Material UI](https://mui.com/material-ui/all-components/). It utilizes (mostly) [Google Charts](https://developers.google.com/chart/interactive/docs/gallery) and (sometimes) [Nivo Charts](https://nivo.rocks/) for generating interactive data visualizations for different datasets.

Google Sheets are used as the database for all datasets, as a lot of departments, such as Dining and Printing, store their data in spreadsheets. This makes the pipeline for data entry and monthly data update much faster and more convenient for non-experts. The Dashboard implements [Google Visualization Query language](https://developers.google.com/chart/interactive/docs/querylanguage) to query chart data from said Google Sheets.

At the same time, the dashboard also utilizes the [Google Sheets API](https://developers.google.com/sheets/api/reference/rest) (documentation: [SheetsDataContext](frontend/src/ContextProviders/README.md)) to fetch metadata such as dataset's last update timestamp.

The Sheets API is also used for the raw dataset versioning (on GitHub) to allow users to download various versions of the raw datasets in CSV files. On the backend, the automatic dataset versioning and metadata generation process is implemented in a separate [GitHub datasets repo](https://github.com/CITIES-Dashboard/datasets). On the frontend, the raw dataset download feature is implemented via the [DatasetDownload](frontend/src/Components/DatasetDownload/README.md) components.

The Dashboard is hosted on GitHub Pages. [Section 2.4](#24-deployment-process) explains how the deployment process works for the dashboard.

## 2.1. Main Files and Directories

- `App.jsx` serves as the root component for the dashboard, orchestrating the overall layout, routing, and theme management of the application. It leverages React's ecosystem, including hooks and context, alongside Material-UI for styling and theming. Here's a breakdown of its functionality:

  - **React Router Setup**: Utilizes `BrowserRouter` from `react-router-dom` to map URLs to specific pages such as `Home` and `Project`. A `404` page is also set up to handle unmatched routes. These routes are defined within the `Routes` component, which renders the appropriate page based on the current URL path.

  - **Lazy Loading of Pages**: Uses React's `lazy` and `Suspense` utilities to lazy-load `Home` and `Project` pages, improving load times by splitting the code at designated points and only loading the components when needed.

  - **Theme Management**:
    - Uses `useState` to maintain `themePreference`, determining whether the app uses a dark or light theme based on user preference or system settings.
    - `useMemo` is applied to generate a theme object using `createTheme` and `getDesignTokens`, which adapts the theme based on the current `themePreference`.
    - Custom themes are defined in [`Themes/CustomThemes.jsx`](frontend/src/Themes/CustomThemes.jsx), allowing for a tailored look and feel that aligns with the CITIES Dashboard's aesthetic requirements.

  - **Global Style Adjustments**: Programmatically sets the background color of the `body` element to match the theme, enhancing the visual coherence of the application on devices with landscape orientation.

  - **Context Providers**: Utilizes the `LinkContext` to share state across components, particularly for managing navigation and dynamically updating the UI based on the current page or section. Documentation on the `LinkContext` can be found [here](frontend/src/ContextProviders/README.md).

  - **Main Application Structure**:
    - Encapsulates the application's main layout within a `Box` component, setting up a flex container that stretches to the viewport's height. This layout includes the `Header`, followed by the main content area (from the specific page based on the current `Route`), with the `Footer` occupying the bottom of the viewport.

  - **Header and Footer**:
    - The `Header` and `Footer` are rendered using `useMemo` to optimize performance, ensuring that they are only recalculated if specific dependencies change.
    - These components provide consistent navigation and information architecture across the dashboard, contributing to a cohesive user experience.

- `Components` directory contains reusable components that are used across multiple pages and sections of the dashboard. These components enable functionalities like raw dataset downloading in CSV format, presenting comments under projects, providing navigational aids like Speed Dial Buttons, etc. *For detailed documentation of all components, click [here](frontend/src/Components/README.md)*.
- `Pages` directory contains the main pages of the dashboard, including the `Home` page, a template `Project` page for each dataset, and a `404` page for undefined routes in the application. The `Routes` defined in [`App.jsx`](frontend/src/App.jsx) correspond to these pages. *For detailed documentation of all pages, click [here](frontend/src/Pages/README.md)*.
- `Graphs` directory contains the components responsible for rendering data visualizations using Google Charts and Nivo Charts. These components fetch data from Google Sheets, process it, and render the charts on the dashboard. *For detailed documentation of all graph components, click [here](frontend/src/Graphs/README.md)*.
- `ContextProviders` directory contains the context providers used to manage global state and share data across components. These providers include `LinkContext` for navigation state management and `SheetsDataContext` for fetching metadata from Google Sheets. *For detailed documentation of all context providers, click [here](frontend/src/ContextProviders/README.md)*.
- `Themes` directory contains the custom themes and color schemes used by the dashboard. *For detailed documentation of all themes, click [here](frontend/src/Themes/README.md)*.
- `Utils` directory contains utility functions and helper methods used throughout the application. These utilities include an HTML-to-MUI parser, Google Analytics Tracker, etc. *For detailed documentation of all utility functions, click [here](frontend/src/Utils/README.md)*.

## 2.2. Google Sheets database
The dashboard utilizes Google Sheets as a database. This is because the raw datasets for the projects come from different university departments who:
- May not be technically savvy
- Do not have an API for automatically interfacing the data

For example, [here](https://docs.google.com/spreadsheets/d/1jQYr20b4c93RmIT4M014YY-qSC-n-qpNMysy6Oz3J6U/edit#gid=2039201290) is the database for Food Waste. It is publicly view accessible (so no authentication is needed on the Dashboard to fetch the data). However, it is edit restricted to university departments (who provide raw data) and project developers who work with the data.

Using Google Sheets as a database allows the different university departments to update data regularly on a *"sandbox"* sheet (not used to provide data for the actual dashboard). We can then check the data for any invalid input or abnormalities, before copying the new data to *"live"* sheets where the website fetches data from.

![google-sheets-sandbox-base](/documentation/google-sheets-raw-data.png)  

![google-sheets-live-database](/documentation/google-sheets.png)
*__Example:__ sandbox raw database (top) vs. live database with further analysis and modifications (bottom)*

Google Sheets also allows us to perform data analysis on the raw dataset through pivot tables and filtering techniques. Moreover, we can quickly make draft charts on Google Sheets itself, which look very similar to charts visualized by Google Charts. This speeds up the prototyping process.  

![google-sheets-pivot-table](/documentation/google-sheets-pivot-table.png)  
*__Example__: A pivot table grouping the food waste by week and a draft of the line chart in the same sheet. This sheet is hidden by default; it can only be seen and edited by the developers, not the public nor the university departments.*

The data in Google Sheets is fetched and queried using the [Google Visualization Query language](https://developers.google.com/chart/interactive/docs/querylanguage) via the `fetchDataFromSheet` function [(more on it here)](frontend/src/Graphs/readme.md). The data can then be used by a Google Chart, or processed further for a Nivo Chart.

## 2.3. Front-end Database and Google Charts Data Visualization
The current dashboard prototype uses a temporary JSON database on the front-end, [temp_database.json](./frontend/src/temp_database.json), which contains metadata for the Google Charts data visualization (charts). The data structure of the database is as below:
```
[
  // Data set 1:
  {
    // Properties of this data set:
    "datasetProperty1": VALUE_1,
    "datasetProperty2": VALUE_2,
    ...

    // Data visualizations of this data set:
    "charts": [
      // Chart 1:
      {
        // Properties of this chart:
        "chartProperty1": VALUE_1,
        "chartProperty2": VALUE_2,
        ...

        // Subcharts of this chart
        "subcharts": [
          // subchart 1
          {
            // Properties of this specific subchart that are different or not mentioned in its parent chart object
            "subchartProperty1": VALUE_1,
            "subchartProperty2": VALUE_2,
            ...
          },

          // Subchart n:
          ...
        ]
      },

      // Chart n:
      ...
    ]
  },

  // Data set n:
  ...
]
```
### 2.3.1. JSON array level
The JSON file contains an array of object literals, each correspond to a data set or project.

### 2.3.2. Data set level
Each data set contains several pairs of keys and values to describe that dataset, below are the most common properties.

*Properties with an asterisk \* are mandatory, omissions of which will result in an error*

- **`"id"`\***: unique identifier of this data set, also used as its end point url for routing. For example: "food-waste" → https://cities-dashboard.github.io/project/food-waste
- **`"title"`**: title of the data set, to be displayed on the home and project pages
- **`"sheetId"`\***: the *alphanumeric id* of the Google Sheets database for this data set: https://docs.google.com/spreadsheets/d/[sheetID]/edit#gid=[gid]
- **`"publishedSheetId"`**: the *alphanumeric id* of a *__published__* Google Sheets database, only used together with **`"chartType":`** `"HeatMap"`
- **`"description"`**: the description of this data set, to be displayed on its project page
- **`"owner"`**: the name of the data set's owner
- **`"ownerContact"`**: email address of the owner
- **`"rawDataTables"`**: an array of object literal(s), each specify sample data table(s) of this data set. Each object's (raw data table) properties are similar to a chart's properties. However, the **`"chartType"`** property is automatically defaulted to `Table` in the [Project.jsx](./frontend/src/Pages/Project/Project.jsx) file.  

  **Example:**
  ```
  "rawDataTables": [
    {
      "gid": 195224,
      "headers": 1,
      "query": "SELECT A, B, C, D, E, F ORDER BY A DESC LIMIT 10"
    }
  ]
  ```
- **`"charts"`**: an array of object literal(s), each describing the chart(s) for this data set. If empty, then the data set is greyed out on the home page with a **`"Coming Soon"`** banner.

### 2.3.3. Chart level
- **`"title"`**: the title of the chart, not to be confused with the title of the data set above
- **`"subtitle"`**: the subtitle of the chart

Google Sheets parameters:
- **`"gid"`\***: the *numeric id* of the Google Sheets database for the sheet containing the raw data (https://docs.google.com/spreadsheets/d/[sheetID]/edit#gid=[gid])
- **`"chartType"`\***: the type of the chart. For example: `"ColumnChart"`, `"LineChart"` ... In addition to all the charts supported by [React-Google-Chart](https://www.react-google-charts.com/examples), it can also be `"HeatMap"`. This is a custom-built chart by embedding a color-formatted sheet from Google Sheets for embedding; where `"HeatMap"` is used, **`"publishedSheetId"`** property must also be used.
- **`"headers"`**: the row number of the header in the Google Sheets database
- **`"query"`**: to query the Google Sheets database and receive a  narrowed-down result of the fetched sheet. It works in a similar way compared to a database query language (MongoDB for example), see full [documentation](https://developers.google.com/chart/interactive/docs/querylanguage).
- **`"columns"`**: an array of items to specify which column of the fetched Google Sheets database to visualize (after being queried on). If it is omitted, then all the non-empty columns in the Google Sheets will be visualized. Else, it can be used to narrow down the visualized columns or assign special roles to the columns. Each column item can either be:
  - *An integer:* used for a normal data column. It should be the index of the column. For example:
    - By default if no query is used, the columns A, B, C... in a Google Sheets correspond to indexes 0, 1, 2...
    - If a query was applied, for example, "SELECT A, C, E, G", then the Google Sheets columns A, C, E, G correspond to indexes 0, 1, 2, 3.  
  - *An object literal:* to denote the specific role of this column, other than being a normal data column. It consists of:
    - **`"sourceColumn"`\***: an integer index of this column, discussed above
    - **`"role"`**: mostly used for annotation, tooltip, or interval, see [documentation](https://developers.google.com/chart/interactive/docs/roles)
    - **`"type"`**: `"number"`, `"string"`... see [documentation](https://developers.google.com/chart/interactive/docs/roles)  
      
  **Example:**
  ```
  "columns": [
    2,
    3,
    {
      "role": "interval",
      "sourceColumn": 9
    },
    {
      "role": "interval",
      "sourceColumn": 10
    },
    {
      "role": "tooltip",
      "type": "string",
      "sourceColumn": 15
    }
  ]
  ```
- **`"options"`**: an object literal corresponds to the `options` parameter of stock Google Charts, see [documentation](https://developers.google.com/chart/interactive/docs/customizing_charts). Anything that works there should also work here. It is used to customized the appearance of the chart, for example, adjusting the `width` or the `vAxis`. 

  **Example:**
  ```
  "options": {
    "isStacked": true,
    "vAxis": {
      "format": "#.##%"
    }
  }
  ```

- **`"subcharts"`**: sometimes, a chart can contain multiple subcharts for richer contextual data visualization.

  ![subcharts](/documentation/subcharts.png)
  *__Example:__ `Mean Daily Food Waste (kg) by Week` can have 2 different subcharts: one for total amount of food waste across all three meals and one for each meal stacked on top of each other. The user can switch between these subcharts using __\_\_tabs\_\___.*
  
  This property is optional; if omitted, the chart will have one single data visualization. If included, its value should be an array with object literals each correspond to a subchart. It has one mandatory property:
  
  - **`"subchartTitle"`\***: the title of this specific subchart, to be displayed on the tab for switching to this chart

  Other optional key-value pairs in each subchart element have the same format as a regular chart element, for example: **`"query"`**, **`"gid"`**, **`"options"`**... These properties should only be specified here if they are different across different subcharts; if similar, they should be included in the parent **`"charts"`** properties.

  **Example:**  
  If the subcharts' data are from different columns in the same sheet (same **`"gid"`**):
  ```
  "gid": 584789045, // similar among all subcharts
  "subcharts": [

    \\ subchart 1's unique properties
    {
      "query": "SELECT A, C",
      "subchartTitle": "Outdoor"
    },

    \\ subchart 2's unique properties
    {
      "query": "SELECT A, H",
      "subchartTitle": "Campus Center"
    },

    \\ subchart 3's unique properties
    {
      "query": "SELECT A, M",
      "subchartTitle": "Dining Hall D2"
    }
  ]
  ```

  **Another example:** 
  If the subcharts' data are from different sheets (different **`"gid"`**):
  ```
  "query": "SELECT * OFFSET 1", \\ similar among all subcharts
  "subcharts": [

    \\ subchart 1's unique properties
    {
      "gid": 782978538,
      "subchartTitle": "2022"
    },

    \\ subchart 2's unique properties
    {
      "gid": 1255989326,
      "subchartTitle": "2020"
    },

    \\ subchart 3's unique properties
    {
      "gid": 1644929856,
      "subchartTitle": "2021"
    }
  ],
  ```

## 2.4 Deployment Process

The front-end application is deployed on GitHub, in two separate but linked repositories:
- [Development repo](https://github.com/CITIES-Dashboard/cities-dashboard.github.io): for the **beta** frontend [website](https://beta.citiesdashboard.com/), redirected from [cities-dashboard.github.io](cities-dashboard.github.io).
- [Production repo](https://github.com/CITIES-Dashboard/citiesdashboard.com): for the main frontend [website](https://citiesdashboard.com/)

Both of these domains are managed in [name.com](https://www.name.com/).

To deploy changes from this development repo to the production website, the [push-to-prod-repo.yml](.github/workflows/push-to-prod-repo.yml) workflow must be manually triggered. It transfers the production-ready files from the `main` branch of this development repo to the production repo. There, the [deploy-to-gh-pages.yml](https://github.com/CITIES-Dashboard/citiesdashboard.com/blob/main/.github/workflows/deploy-to-gh-pages.yml) workflow is automatically triggered to deploy the changes to the production website on GitHub Pages.

Finally, as Google Sheets are used as database for the datasets, no separate backend is needed. Separately, as mentioned, another GitHub repo ([datasets repo](https://github.com/CITIES-Dashboard/datasets)) is implemented to fetch raw datasets on Google Sheets daily for version controlling.

# 3. Build and Test Locally

## 3.1. Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)

## 3.2. Install Dependencies and Run the Application

1. Clone the repository from GitHub.

2. Navigate to the `src/frontend` directory of the project and run the following command to install the dependencies:

  ```
  npm install
  ```

  or

  ```
  yarn install
  ```

3. Run the following command to start the application.

  ```
  npm start
  ```

  or

  ```
  yarn start
  ```