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

TODO: Add documentation for the Project page.

## 404 Page

The 404 page is a simple page that is displayed when a user navigates to a page that does not exist. Upon rendering, it updates the page title and sets the current page context to '404' to reflect the error state. The page presents a clear message ("Page not found") with a lighthearted note ("Bad links happen to good people") and an option for users to return to the homepage via a Button component linked to the root path. This setup ensures users facing navigation errors are informed and can easily navigate back to a valid page.