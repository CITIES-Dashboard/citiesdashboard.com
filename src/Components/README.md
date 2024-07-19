# Components

The `Components` directory contains reusable components that are used across multiple pages and sections of the dashboard. These components are designed to be modular and flexible, allowing for easy integration and customization.

[Click here for detailed documentation on the Dataset Download components](DatasetDownload/README.md)

[Click here for detailed documentation on the Header components](Header/README.md)

Some common UI components include:

[CollapsibleSubtitle.jsx](CollapsibleSubtitle.jsx) - Optimizes long text display, such as dataset descriptions, by showing a shortened version with a "See more" option on mobile devices. It expands to reveal the full text upon user interaction and collapses when the element or its associated visualization is tapped away from, or when toggled again.

- Utilizes `useState` for managing text expansion state and `useRef` for targeting the text container and the associated visualization.
- Incorporates click-away logic to maintain expanded state when interacting with related elements, like charts, and collapsing again when tapping away from the text or the associated visualization.
- Adapts to screen size with `useMediaQuery`, activating the collapsible feature only on mobile screens.
- Implements the `replacePlainHTMLWithMuiComponents` utility function to replace plain HTML tags with MUI components to ensure consistent styling and accessibility.

[CommentSection.jsx](CommentSection.jsx) - Integrates Hyvor Talk for adding an interactive comment section to each page, allowing users to engage in discussions related to the content. It dynamically loads and displays comments based on the `pageID` passed as a prop, ensuring discussions are relevant to the specific content being viewed.

- Configures Hyvor Talk comments with a `WEBSITE_ID` to identify the specific website within the Hyvor Talk system.
- Uses `styled` from `@mui/material/styles` to customize the appearance of the Hyvor Talk comment widget to match the application's theme.
- Includes `parse` from `html-react-parser` with custom utility functions for rendering the introductory text above the comment section, ensuring consistency with the rest of the application's content presentation.
- Encapsulated within `Container` and `Paper` components from `@mui/material` for layout consistency, providing a structured and visually contained area for user comments.

[CustomLink.jsx](CustomLink.jsx) - Creates a stylized hyperlink component, applying application-wide theme consistency to external links. It ensures that all links adopt the primary color on hover, enhancing the user interface with visual feedback.

- Uses `styled` from `@mui/material/styles` to apply custom styles to the `Link` component from `@mui/material`, particularly for hover state.
- Accepts `href` and `text` props to dynamically generate links, allowing for flexible use across different parts of the application.
- Configures links to open in a new tab (`target="_blank"`) with `rel="noreferrer"` for security.

[Click here for detailed documentation on the ExpandableSection.jsx component](ExpandableSectionDocumentation.md)

[FadeInButtonForSpeedDial.jsx](FadeInButtonForSpeedDial.jsx) - Provides a floating action button (FAB) that appears as users scroll down the page. It's designed to enhance navigation within long pages by offering a dynamically appearing button based on the scroll position.

- Utilizes `useScrollTrigger` from MUI for detecting scroll depth and triggering the FAB's visibility.
- Allows customization of the button's appearance threshold and position via props, ensuring flexibility across different use cases.

[Footer.jsx](Footer.jsx) - Provides a uniform footer across the application, featuring the CITIES Dashboard's branding, current year, and social media links. It uses MUI components for layout and styling, with `CustomLink` for external links.

- Displays the dashboard title and the Center for Interacting Urban Networks (CITIES) mention, updating the year dynamically with `getYear()`.
- Includes social media icons for Twitter, LinkedIn, Facebook, and Instagram, each wrapped in a `CustomLink` component for direct navigation.
- Utilizes `Stack` for organizing content vertically and horizontally, ensuring responsive alignment.
- The footer's style and background color are customized to fit the dashboard's theme, enhancing the overall user interface consistency.

[FullWidthBox.jsx](FullWidthBox.jsx) - Creates a styled component based on Material-UI's `Box` that automatically adjusts its padding to respect the device's safe area insets, ensuring content is optimally displayed across various devices and screen sizes.

- Utilizes CSS environment variables `safe-area-inset-left` and `safe-area-inset-right` for dynamic padding adjustment, accommodating notches and other interface elements on modern devices.

[LoadingAnimation.jsx](LoadingAnimation.jsx) - Presents a loading spinner animation to indicate that content is being fetched or processed. It uses MUI's `CircularProgress` component to display a circular loading indicator — optionally with a text message (e.g., "Loading..."). It is centered within the parent container for clear visibility and user feedback.

[SnackBarNotifications.jsx](SnackBarNotifications.jsx) - Leverages MUI components to present a dismissible Snackbar notification when the device is in portrait orientation, suggesting a switch to landscape or computer viewing for a better experience.

- Utilizes `window.matchMedia` to listen for changes in device orientation, displaying a Snackbar when in portrait mode.
- Employs the `Snackbar` component for notifications, customizable with `autoHideDuration` for timing and an action button for dismissal.
- Includes logic to prevent the Snackbar from closing on clickaway events, ensuring it only closes when the user explicitly interacts with the close button.

[SpeedDialButton.jsx](SpeedDialButton.jsx) - Implements a dynamic floating action button (FAB) that offers quick navigation options within a page, adapting its functionality based on the availability of charts. Utilizing a combination of MUI components and custom utility functions, it provides a user-friendly interface for accessing various sections of a project page, including charts and comments.

- Uses `PopupState` from `material-ui-popup-state` to manage hover and focus states for displaying a navigation menu.
- Dynamically generates menu items based on `chartsTitlesList`, allowing for direct navigation to individual charts within a page.
- Includes a "Scroll to Top" button, facilitating easy return to the top of the page, and a dedicated option for navigating to the comments section.
- Employs `FadeInButtonForSpeedDial` for a smooth appearance on the user interface, positioning the FAB relative to the bottom of the window.
- Leverages `html-react-parser` to safely render chart titles within menu items, enhancing readability.
- Incorporates analytics tracking for user interactions with navigation options, aiding in the understanding of user engagement patterns.

[UppercaseTitle.jsx](UppercaseTitle.jsx) - Renders text titles in uppercase using Material-UI's `Typography` component, styled to emphasize section headers or important titles within the application. It customizes the appearance with a medium weight, inline-block display, and adjusted line height for visual clarity.