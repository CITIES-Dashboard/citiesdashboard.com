# Pages

The application has three main pages:
- [Home](#home): The landing page of the application, which provides an overview of the project and its goals.
- [Project](#project): Each project has its own page, which displays the visualizations and data relevant to that project.
- [404 Page](#404-page): A simple page that is displayed when a user navigates to a page that does not exist.

## Home

The Home page serves as the landing page for the CITIES data visualization dashboard and is composed of several key components to provide a comprehensive overview of the dashboard, its goals, its projects and ways to engage with the team.

### The Home page is composed of the following components:

- [Home.jsx](./Home/Home.jsx): Acts as the landing page's main layout, using Material-UI for styling and a responsive grid to showcase project cards. Each card represents a project, featuring either a teaser chart or an embedded website preview. Cards include brief details on the name and dataset owner of the project, number of charts available in the project and the count of user comments on the project. Navigation to detailed project pages or external sites is enabled through MUI's `Card` elements. User interactions with these cards are tracked for analytics, offering insights into engagement. Additionally, the page integrates `About` and `Get In Touch` sections as distinct components, enriching the landing page's informational breadth.

- [About.jsx]('./Home/About.jsx'): Presents an overview of the project, sourcing its content from `section_data.json`. It uses Material-UI's `Stack`, `Typography`, and `Paper` for layout and styling, and our custom utility functions (defined in [src/Utils](../Utils)) for text formatting and HTML to MUI conversion.

- [AtAGlance.jsx](./Home/AtAGlance.jsx): Offers a quick overview of some statistics relevant to the dashboard, using icons and a grid layout for a clear and responsive presentation. Data is sourced from `section_data.json`, and the `ByTheNumber` subcomponent is used for each statistic. It is currently hidden in `Home.jsx`, but can be of use in the future.

- [GetInTouch.jsx](./Home/GetInTouch.jsx): Facilitates user engagement by incorporating a feedback form that collects user emails, dataset contributions, and improvement suggestions. The form submits data directly to a Google Form via a `GET` request to the Form's `FormResponse` path, and automatically resets one second after submission for convenience. The introductory text above the form is dynamically loaded from `section_data.json`.

## Project

The Project page is dedicated to showcasing detailed visualizations and data for each specific project within the CITIES dashboard. 

This page dynamically generates content based on the project selected by the user, utilizing the `useParams` hook from `react-router-dom` to identify the project ID from the URL. The path to the project page is defined in [App.jsx](../App.jsx) as follows:

```jsx
// Route for the project page, with the project ID as a parameter
<Route
  path="/project/:id"
  element={<Project />}
/>
```

The `Project` component performs several key functions:

- **Loading Project Data**: Upon mount, the [Project.jsx](./Project.jsx) component searches `temp_database.json` for a project entry that matches the retrieved `id`. This is done within a `useEffect()` hook to ensure the project data is renewed upon URL change. If the project is not found, the component redirects to the [404 page](#404-page).

- **Displaying Project Overview and Key Information**: Each project page has an `<h4>` heading rendered through the [UppercaseTitle](../Components/UppercaseTitle.jsx) component, along with dataset ownership, contact, and last update information presented via custom-styled `Chip` components with tooltips, and a count of charts and comments related to the project. This is followed by a `Typography` component for the project's description, sourced from the `temp_database.json` file, and converted to MUI format using our `replacePlainHTMLWithMuiComponents` utility function.

- **State Management**: The `Project` component employs `useState` to manage the state of the project data (`project`), loading status (`loading`), and tab state for subcharts (`tab`). On Component mount, the project's state is updated with the found project data, triggering a re-render to display the newly loaded project details.
  
- **Displaying Charts and Subcharts**: Each project may contain multiple charts, detailed in the project data under the `charts` array. The component maps over this array to render a `ChartComponent` for each chart, passing relevant data props, including chart details and the parent project's `sheetId` for data fetching.
  
- **Handling Subcharts**: For charts with subcharts, the `tab` state controls which subchart is currently active or displayed. The component dynamically adjusts to user interaction, updating the active tab state and consequently the displayed subchart. 
  
In essence, `Project.jsx` serves as a dynamic container for individual project data, enabling users to explore detailed visualizations, understand project specifics, and interact with various charts and subcharts, all derived from the `temp_database.json` based on the project `id` specified in the URL.

## 404 Page

The 404 page is a simple page that is displayed when a user navigates to a page that does not exist. It does so via the following `Router` setup in [App.jsx](../App.jsx):

```jsx
// Route for the 404 page
<Route path="/404" element={<FourOhFour title="Page Not Found | CITIES Dashboard" />} />
// Redirects any paths not specified in the Router to the 404 page
<Route path="*" element={<Navigate replace to="/404" />} /> 
```

Upon rendering, it updates the page title and sets the current page context to '404' to reflect the error state.