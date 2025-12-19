// disable eslint for this file
/* eslint-disable */
import { useRef, useEffect, useState, useContext } from 'react';
import * as d3 from 'd3';
import { Box } from '@mui/material';

import { areDOMOverlapped } from './ScreenUtils';
import { capitalizePhrase } from '../../../Utils/UtilFunctions';
import { useTheme } from '@mui/material';
import FoodWasteColorScheme, { GREY_TEXT_CLOR } from './FoodWasteColorScheme';
import { FoodWasteContext } from './FoodWasteContext';

const numberOfHoursForHistoricalData = 6;
const Y_AXIS_UNIT = 10;

const RecentHistoricalGraph = () => {
  const theme = useTheme();
  const { historical, dailyGoal } = useContext(FoodWasteContext);

  const data = [
    { historical: historical }
  ];

  const FoodWasteCategories = [
    {
      id: 0,
      caterogy: "low",
      color: FoodWasteColorScheme.low,
      threshold: {
        low: 0,
        high: dailyGoal
      }
    },
    {
      id: 0,
      caterogy: "high",
      color: FoodWasteColorScheme.high,
      threshold: {
        low: dailyGoal,
        high: Infinity
      }
    }
  ]

  const graphContainer = useRef();
  const layerBackground = useRef();
  const layerTexts = useRef();
  const layerXaxisWrapper = useRef();
  const layerLines = useRef();

  let width, height, xAxis, yAxis;
  let maxValue = 0;
  let minValue = Infinity;
  const dotRadius = 10;
  const margin = { top: 30, right: 80, bottom: 0, left: 70 };

  // Set up D3's line generator
  const lineGenerator = d3
    .line()
    .x(function (d) {
      return xAxis(d.timestamp);
    }) // set the x values for the line generator
    .y(function (d) {
      return yAxis(d.value);
    }) // set the y values for the line generator
    .curve(d3.curveCardinal.tension(0)); // apply smoothing to the line

  useEffect(() => {
    if (!data || !historical) return;
    if (!graphContainer.current) return;
    if (!layerBackground.current) return;
    if (!layerTexts.current) return;
    if (!layerXaxisWrapper.current) return;
    if (!layerLines.current) return;

    const viewHours = data?.[0]?.metadata?.viewHours || numberOfHoursForHistoricalData;
    const xTickInterval = Math.floor(viewHours / 6);

    width = graphContainer.current.clientWidth;
    height = graphContainer.current.clientHeight - margin.top;

    // Clear all previous drawings
    d3.select(layerBackground.current).selectAll("*").remove();
    d3.select(layerTexts.current).selectAll("*").remove();
    d3.select(layerXaxisWrapper.current).selectAll("*").remove();
    d3.select(layerLines.current).selectAll("*").remove();

    d3.select(layerBackground.current)
      .attr("opacity", 0.6);

    Object.entries(data).forEach(([key, item]) => {
      // Calculate the min/max value for all items
      if (item.historical && Array.isArray(item.historical)) {
        const max = d3.max(item.historical, function (d) {
          return d.value;
        });

        const min = d3.min(item.historical, function (d) {
          return d.value;
        });

        if (max > maxValue) maxValue = max;
        if (min < minValue) minValue = min;
      }
    });

    // Round to the nearest Y_AXIS_UNIT
    maxValue = Math.ceil(maxValue / Y_AXIS_UNIT) * Y_AXIS_UNIT;
    minValue = Math.floor(minValue / Y_AXIS_UNIT) * Y_AXIS_UNIT;

    // Ensure min/max never align with tick steps (Y_AXIS_UNIT * 2)
    const tickStep = Y_AXIS_UNIT * 2;
    if (maxValue % tickStep === 0) maxValue += Y_AXIS_UNIT;
    if (minValue % tickStep === 0) minValue -= Y_AXIS_UNIT;

    // Adjust maxValue to category.threshold.high of non-Infinity categories in FoodWasteCategories
    for (let category of FoodWasteCategories) {
      if (maxValue >= category.threshold.low && maxValue <= category.threshold.high) {
        maxValue = category.threshold.high === Infinity ? maxValue : category.threshold.high;
        break;
      }
    };

    // 1. Set up the xAxis domain and range
    const allTimestamps = data.flatMap(d =>
      (d.historical || []).map(h => h.timestamp)
    );
    const [minTs, maxTs] = d3.extent(allTimestamps);     // Compute min/max from data
    xAxis = d3.scaleTime()
      .domain([minTs, maxTs])
      .rangeRound([margin.left, width - margin.right]);     // Build x-axis scale from actual data extent

    // 2. Set up the yAxis domain and range
    yAxis = d3.scaleLinear()
      .domain([minValue, maxValue])
      .range([height + margin.top, margin.top]); // height is already exclusive of margin

    // 3. Add the background category layer and the category levels (rectangles) and the grids
    let font_size = 50;
    let marginText = Math.floor(font_size / 3);
    // 4. Loop through all the FoodWasteCategories and add each category into the graph
    for (let i = 0; i < FoodWasteCategories.length; i++) {
      const element = FoodWasteCategories[i];
      const upper = element.threshold.high === Infinity ? maxValue : element.threshold.high;
      const lower = element.threshold.low;

      if (maxValue <= lower) break;

      // Add the rectangles
      const categoryRange = upper - lower;
      d3.select(layerBackground.current)
        .append("rect")
        .attr("x", 0)
        .attr("y", height - (upper / maxValue) * height + margin.top)
        .attr("width", width)
        .attr("height", categoryRange / maxValue * height)
        .attr("fill", element.color);

      // Y-axis numbering: tick every Y_AXIS_UNIT * 2,
      // starting at dailyGoal and going up/down until outside range.
      const ticks = new Set();
      ticks.add(dailyGoal); // Add the center tick

      // Add upward and downward ticks
      for (let v = dailyGoal + tickStep; v <= maxValue; v += tickStep) {
        ticks.add(v);
      }
      for (let v = dailyGoal - tickStep; v >= minValue; v -= tickStep) {
        ticks.add(v);
      }

      ticks.forEach(v => {
        const isGoal = v === dailyGoal;
        const yPos = yAxis(v);

        // 1. Draw the horizontal tick
        if (!isGoal) {
          d3.select(layerTexts.current)
            .append("line")
            .attr("x1", 0)                      // left edge of SVG
            .attr("x2", marginText)         // stop just before the text
            .attr("y1", yPos)
            .attr("y2", yPos)
            .attr("stroke", "#ffffff")          // tick color
            .attr("stroke-width", 2)
            .attr("filter", "none");            // prevent dimming
        }
        // DailyGoal tick → triangle marker
        else {
          const size = font_size * 0.5;               // triangle size scaling
          const centerY = yPos;

          // Right-pointing triangle ▶
          // Points: left-top, left-bottom, right-center
          const points = [
            `${0},${centerY - size / 2}`,
            `${0},${centerY + size / 2}`,
            `${size},${centerY}`
          ].join(" ");

          d3.select(layerTexts.current)
            .append("polygon")
            .attr("points", points)
            .attr("fill", "#fff")   // match goal color
            .attr("filter", "none");
        }

        // 2. Draw the text label
        d3.select(layerTexts.current)
          .append("text")
          .attr("x", marginText + 10)
          .attr("y", yPos)
          .attr("fill", "#fff")
          .attr("font-size", isGoal ? font_size : font_size / 2)
          .attr("alignment-baseline", "middle")
          .attr("filter", "none")               // ensures pure white or goal color
          .text(v);
      });
    };

    // 5. Add the xAxisWrapper and its texts
    d3.select(layerXaxisWrapper.current)
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", width)
      .attr("height", margin.top)
      .attr("fill", "white");

    // 6. Add the X Axis on top of the graph, as well as ticks
    // Floor xAxisMax to the top of the hour (e.g. 11:34 → 11:00)
    // xAxisMax.setMinutes(0, 0, 0);
    // // Generate tick array starting from floored max
    // const ticks = [];
    // for (let t = new Date(xAxisMax); t >= xAxisMin; t.setHours(t.getHours() - xTickInterval)) {
    //   ticks.push(new Date(t));
    // }
    // ticks.reverse(); // earliest → latest
    // // Now apply these ticks to the axis
    // d3.select(layerXaxisWrapper.current)
    //   .append("g")
    //   .attr("transform", `translate(0,${margin.top})`)
    //   .call(
    //     d3.axisTop(xAxis)
    //       .tickSize(-height)
    //       .tickValues(ticks)
    //       .tickFormat(d3.timeFormat("%H:%M"))
    //   )
    //   .attr("font-size", height / 20)
    //   .attr("color", GREY_TEXT_CLOR)
    //   .select(".domain")
    //   .remove();

    d3.select(layerXaxisWrapper.current)
      .selectAll('line')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('opacity', 0.5);

    Object.entries(data).forEach(([_, sensorData], index) => {
      // 7.1. Append the line chart for this location
      d3.select(layerLines.current)
        .append("path")
        .datum(sensorData.historical || [])
        .attr("x", margin.left)
        .attr("class", "line")
        .attr("d", lineGenerator)
        .attr("fill", "transparent")
        .attr("stroke", "black")
        .attr("stroke-width", "5px")
        .attr("opacity", index % 2 === 0 ? 1 : 0.5);

      // 7.2. Append the circle marker at the end of this line chart to denote its liveness
      const mostRecentData = sensorData.historical?.length > 0 ? sensorData.historical?.[0] : null;
      if (
        mostRecentData &&
        mostRecentData.aqi &&
        mostRecentData.aqi.value !== undefined &&
        mostRecentData.aqi.value !== null &&
        mostRecentData.timestamp
      ) {
        const markerWrapper = d3.select(layerLines.current)
          .append("g")
          .attr(
            "transform",
            "translate(" +
            xAxis(mostRecentData.timestamp) +
            "," +
            yAxis(mostRecentData.aqi.value) +
            ")"
          )
          .attr("fill",
            sensorData?.current?.aqi?.categoryIndex !== null ?
              theme.palette.text.aqi[sensorData.current.aqi.categoryIndex] :
              GREY_TEXT_CLOR
          )
          ;

        markerWrapper.append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("filter", "brightness(0.5)")
          .attr("class", "pulse-ring")
          .attr("r", 2.5 * dotRadius);

        markerWrapper.append("circle")
          .attr("cx", 0)
          .attr("cy", 0)
          .attr("stroke", "#666")
          .attr("class", "pulse-dot")
          .attr("r", dotRadius);

        markerWrapper.append("text")
          .attr("class", "location-label")
          .attr("x", dotRadius * 1.5)
          .attr("y", 0)
          .attr("fill", "black")
          .attr("alignment-baseline", "middle")
          .attr("text-anchor", "left")
          .attr("font-size", height / 25)
          .text(capitalizePhrase(sensorData.sensor?.location_short));

        const locationLabels = document.getElementsByClassName("location-label");
        for (let i = 1; i < locationLabels.length; i++) {
          const locationLabel_1 = locationLabels[i - 1];
          const locationLabel_2 = locationLabels[i];
          const overlapped = areDOMOverlapped(locationLabel_1.getBoundingClientRect(), locationLabel_2.getBoundingClientRect());

          if (overlapped !== 0) {
            locationLabel_1.setAttribute("y", overlapped * dotRadius);
            locationLabel_2.setAttribute("y", - overlapped * dotRadius);
          }
        }
      }
    });

  }, [data])

  return (
    <Box
      sx={{
        '& .pulse-ring': {
          animation: 'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
          '@keyframes pulse-ring': {
            '0%': {
              transform: 'scale(0.2)'
            },
            '80%': {},
            '100%': {
              opacity: 0
            }
          }
        },
        '& .pulse-dot': {
          animation: 'pulse-dot 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
          '@keyframes pulse-dot': {
            '0%': {
              transform: 'scale(0.5)'
            },
            '50%': {
              transform: 'scale(1)',
              filter: 'brightness(1.2) contrast(1.2) saturate(1.2)'
            },
            '100%': {
              transform: 'scale(0.5)'
            }
          }
        }
      }}
      width="100%"
      height="100%"
    >
      <svg
        id="recent-historical-graph"
        width="100%"
        height="100%"
        ref={graphContainer}
      >
        <g ref={layerBackground} />
        <g ref={layerXaxisWrapper} />
        <g ref={layerTexts} />
        <g ref={layerLines} />
      </svg>
    </Box>

  );
}

export default RecentHistoricalGraph;