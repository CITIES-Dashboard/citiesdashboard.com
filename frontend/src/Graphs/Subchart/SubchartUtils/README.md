# SubchartUtils

This folder contains the utility functions for the subchart component.

[StackedBarToggle.jsx](StackedBarToggle.jsx): This file contains the StackedBarToggle component, which is a toggle switch that allows the user to switch between a stacked bar chart and a grouped bar chart. This component is used in the Subchart component to toggle between the two types of bar charts. It works by changing the `toggleStackedBars` boolean in the subchart's `options` object, which is then passed to the Google Charts component to determine whether to display a stacked bar chart or a grouped bar chart.