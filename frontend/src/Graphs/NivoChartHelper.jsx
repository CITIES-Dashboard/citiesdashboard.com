export const calculateValueRange = (data) => {
  const values = data.map((item) => item.value);
  return { min: Math.min(...values), max: Math.max(...values) };
};

export const transformDataForNivo = (dataTable, dataColumn, tooltipColumn) => {
  const data = JSON.parse(dataTable.toJSON());
  const transformed = [];

  const parseDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const formattedDate = `${year}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`;
    return formattedDate;
  };

  data.rows.forEach((row) => {
    // Get the date string from the first column
    const dateString = row.c[0].f;
    // Parse and convert the date string to a 'YYYY-MM-DD' format
    const formattedDate = parseDate(dateString);
    // Get the data from the appropriate column
    const value = row.c[dataColumn]?.v;
    // Get the tooltip from the appropriate column
    const tooltip = row.c[tooltipColumn]?.v;

    // If the date string and value are both valid, push them into the result array
    if (dateString && value !== undefined && value !== null) {
      transformed.push({
        day: formattedDate,
        value,
        tooltip
      });
    }
  });

  // Get dateRange (from - to)
  const dateStrings = transformed.map((item) => item.day);
  const dateRange = {
    min: dateStrings.reduce((min, current) => (current < min ? current : min)),
    max: dateStrings.reduce((max, current) => (current > max ? current : max))
  };

  const valueRange = calculateValueRange(transformed);

  return {
    data: transformed,
    dateRange,
    valueRange
  };
};

export const convertToNivoHeatMapData = (googleSheetsData) => {
  const dataTable = JSON.parse(googleSheetsData.toJSON());
  const cols = dataTable.cols.map((col) => col.label).slice(1); // Exclude the first column
  const { rows } = dataTable;

  // Calculate total for each column
  const columnTotals = new Array(cols.length).fill(0);
  rows.forEach((row) => {
    row.c.slice(1).forEach((cell, index) => {
      columnTotals[index] += cell.v;
    });
  });

  // Process each row
  return rows.map((row) => {
    const rowTotal = row.c.slice(1).reduce((acc, cell) => acc + cell.v, 0);

    const data = cols.map((col, index) => {
      const value = row.c[index + 1].v; // +1 to offset label column
      const rowPercentage = rowTotal > 0 ? ((value / rowTotal) * 100).toFixed(1) : 0;
      // eslint-disable-next-line max-len
      const colPercentage = columnTotals[index] > 0 ? ((value / columnTotals[index]) * 100).toFixed(1) : 0;

      return {
        x: col,
        y: value,
        rowPercentage: `${rowPercentage}%`,
        colPercentage: `${colPercentage}%`,
        rowTotal,
        colTotal: columnTotals[index],
      };
    });

    return { id: row.c[0].v, data };
  });
};
