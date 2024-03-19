# Header

The `Header` directory contains components that are used to build the header section of the dashboard. The header is a key part of the dashboard's user interface, providing navigation, branding, and other essential features.

The Header components include:

[CITIESlogoLinkToHome.jsx](CITIESlogoLinkToHome.jsx) - Provides a clickable logo that serves as a navigational shortcut to the Home page. Wrapped in a `Tooltip` for added user guidance, it features event tracking for analytics purposes.

- Encloses the CITIES Dashboard logo within a `Link` component, facilitating direct navigation back to the Home page when clicked.
- Implements event tracking with `Tracking.sendEventAnalytics` to monitor interactions with the logo, aiding in the analysis of user navigation patterns.
- Styles the logo for consistent appearance and accessibility, ensuring it is easily recognizable as a clickable element.

[Header.jsx](Header.jsx) - Serves as the primary navigation component, integrating a dynamically hidable AppBar for efficient space utilization and enhanced user experience. It incorporates responsive design principles, adapting to device orientations for optimal display and interaction.

- Utilizes `useScrollTrigger` for a hide-on-scroll AppBar, improving page readability as users navigate content.
- Features a mobile-responsive menu activated by a `MenuIcon`, revealing a drawer with navigation links and settings.
- Incorporates a settings icon, opening a drawer for theme selection through `ThemeSelector`.
- Embeds the CITIES Dashboard logo as a clickable element, redirecting users to the Home page, with analytics tracking for clicks.
- Implements utility functions `showInMobile` and `showInDesktop` to toggle visibility of elements based on the device's screen size.
- Smooth Includes links with smooth scroll functionality to sections within the page, equipped with event tracking to analyze user navigation patterns.

[MenuItemAsNavLink.jsx](MenuItemAsNavLink.jsx) - Crafts a versatile menu item component capable of executing different navigation behaviors: navigating to a new page, scrolling to a specified section within a page, or performing no action. This adaptability makes it a fundamental building block for constructing navigational menus within the application.

- Implements `styled` from `@mui/material/styles` to apply custom styles to `MenuItem` and icons, ensuring consistency with the application's design language.
- Integrates `NavLinkBehavior` to determine the action taken upon item selection, supporting direct page navigation, in-page scrolling, or disabling the item.
- Incorporates event tracking via `Tracking.sendEventAnalytics` for insights into user navigation patterns, capturing the origin, destination, and label of navigational actions.
- Utilizes `scrollToSection` for smooth scrolling functionality, enhancing user experience by facilitating easy access to different page sections.
- Accepts icons and custom styles (`sx`) as props, allowing for visually distinct menu items tailored to specific UI requirements.

[NavLinkBehavior.jsx](NavLinkBehavior.jsx) - Defines an enumeration for specifying the types of navigational actions a link can perform within the application. This simple yet effective approach categorizes link behaviors into three distinct types:

- `toNewPage`: Directs the user to a new page within the application.
- `scrollTo`: Scrolls the page to a specific section identified by an ID.
- `doNothing`: Disables any action, making the link non-interactive.

This enumeration enhances code readability and maintainability by providing a clear and centralized definition of possible navigation behaviors.

[ThemeSelector.jsx](ThemeSelector.jsx) - Allows users to switch between different theme modes (light, dark, or system default) for the application. It provides a dropdown menu for theme selection, persisting the choice in local storage and applying the selected theme across the application.

- Users can choose between `light`, `dark`, or `system` preferences. The selection is saved to local storage and used to set the application's theme accordingly.
- Adapts its layout (`FormControl`) to the available width, supporting both grid and default layouts.
- Utilizes `styled` for custom styling of the `FormControl` and `MenuItem` components, ensuring the dropdown blends seamlessly with the theme and application design.
- Listens for changes in the system's theme preference (light or dark) and automatically adjusts the application's theme if set to `system`.
- Incorporates analytics tracking for theme changes, helping in understanding user preferences and interactions with the theme selector.