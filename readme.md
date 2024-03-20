[Last update: March 8 2023 - some parts are not correct anymore, pending revisions]
# CITIES VISUALIZATION DASHBOARD

1. [Introduction](#1-introduction)
2. [Description](#2-description)  
    2.1. [React Components](#21-react-components-pages-and-context-providers)  
    2.2. [Google Sheets Database](#22-google-sheet-database)  
    2.3. [Front-end Database and Google Charts Data Visualization](#23-front-end-database-and-google-charts-data-visualization)
3. [Build and Test Locally](#3-build-and-test-locally)  
    3.1. [Prerequisites](#31-prerequisites)  
    3.2. [Install Dependencies](#32-install-dependencies)
4. [References](#4-references)

# 1. Introduction

The CITIES Dashboard serves as a data repository for community-wide actions on sustainability and well-being. This dashboard is created by and for the community of NYU Abu Dhabi, students, researchers, faculty, staff, and NYUAD partners alike. We highly encourage anyone interested to contribute to this open-source project by sharing new datasets, analyzing existing datasets, proposing projects, and promoting the dashboard to a wider audience. Ultimately, we envision the CITIES Dashboard as a handy tool to support research, education, and community outreach within the NYU Abu Dhabi campus and a precious instrument to support NYUAD partners in meeting their KPI (e.g., reducing food waste).

![homepage](/documentation/home-page.png)
*The Home page of the dashboard where all data sets / projects are prominently displayed*

![project-page](/documentation/project-page.png)
*The project page showing the general description of the data set, dataset metadata (such as owner and last update date)...*

![project-page-3](/documentation/project-page-3.png)
*...raw dataset download and version control...*

![project-page-2](/documentation/project-page-2.png)
*...and data visualizations (made with Google Charts and/or Nivo Charts)*

![about-page](/documentation/about-page.png)
*The About section of the dashboard, detailing CITIES' social network accounts and describing the rationale of the project, together with a Get In Touch form*


# 2. Description

The CITIES Dashboard is a web application that serves as a data repository and allows us to visualize and analyze data from various NYUAD campus sources. The front-end dashboard is built with React.js and Material UI for React (MUI). React Google Charts is used to visualize the data and the dashboard is currently hosted on Github Pages. For CI/CD , CircleCI is used to run tests and deploy the application to github pages. All references for third-party frameworks can be found at the bottom of this documentation.

## 2.1. React Components, Pages, and Context Providers

- [App.jsx](./frontend/src/App.jsx) - The main component that renders the dashboard.
- [Header.jsx](./frontend/src/Components/Header/Header.jsx) - The component that renders the title and the navigation bar.
- [Footer.jsx](./frontend/src/Components/Header/Footer.jsx) - The component that renders the footer of the dashboard.
- [Home.jsx](./frontend/src/Pages/Home/Home.jsx) - The component that renders the home page of the dashboard.
- [About.jsx](./frontend/src/Pages/About/About.jsx) - The component that renders the about page of the dashboard.
- [Projects.jsx](./frontend/src/Pages/Project/Project.jsx) - The component that renders the individual projects of the dashboard.
- [404.jsx](./frontend/src/Pages/404.jsx) - The component that renders the 404 page of the dashboard.
- [DataContext.js](./frontend/src/ContextProviders/DataContext.jsx) - The context provider that provides the data to the home page of the dashboard.
- [LinkContext.js](./frontend/src/ContextProviders/LinkContext.jsx) - The context provider that provides the links to the navigation bar of the dashboard.

## 2.2. Google Sheets database
Instead of the typical MERN stack, we use Google Sheets as the back-end database for our project. This is because the raw data set comes from different university departments who:
- Are not technically savvy
- Do not have an API for automatically interfacing the data

For example, [here](https://docs.google.com/spreadsheets/d/1jQYr20b4c93RmIT4M014YY-qSC-n-qpNMysy6Oz3J6U/edit#gid=2039201290) is the database for Food Waste. This link can also be found in the project's page. It is accessible to the public, but is edit-restricted to developers and university departments.

Below are some of the benefits of using Google Sheets as the database:
- It allows the different university departments to update data regularly on a *"sandbox"* sheet (not used to provide data for the actual dashboard). We then quickly check it for syntax or any abnormalities, before copying the new data to the *"live"* sheet where the website fetches data from.

  ![google-sheets-sandbox-base](/documentation/google-sheets-raw-data.png)  

  ![google-sheets-live-database](/documentation/google-sheets.png)
*__Example:__ sandbox raw database (top) vs. live database with further analysis and modifications (bottom)*

- It also allows us to perform data analysis on the raw data set by adding mulitple pivot tables to multiple sheets in the same document. Moreover, we can quickly make draft charts on Google Sheets itself which look very similar to charts visualized by Google Charts. This speeds up the prototyping process.  

  ![google-sheets-pivot-table](/documentation/google-sheets-pivot-table.png)  

  *__Example__: A pivot table grouping the food waste by week and a draft of the line chart in the same sheet. This kind of further analysis sheet is hidden by default and can only be seen and edited by the developers, not the public.*

- Data from the Google Sheets can be fetched and visualized by Google Charts; they are highly compatible. We use React-Google-Charts (v3.0.15) as a thin wrapper for React, see [documentation](https://www.react-google-charts.com/components/chart).

*NOTE: Version 3.0.15 is used because version 4+ produces error when fetching data from a Google Sheets document*

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
# 3. Build and Test Locally

## 3.1. Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://classic.yarnpkg.com/en/docs/install/#windows-stable)

## 3.2. Install Dependencies

Pull the repository from github.
Run the following commands in the front end directory of the project.
Use npm install if you are using npm or yarn install if you are using yarn.

```
npm install
```

or

```
yarn install
```

Run the following command to start the application.

```
npm start
```

or

```
yarn start
```

# 4. References

- [React.js](https://reactjs.org/)
- [CircleCI](https://circleci.com/)
- [React Google Charts](https://react-google-charts.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Material UI](https://material-ui.com/)
- [Html-React-Parser](https://www.npmjs.com/package/html-react-parser)
