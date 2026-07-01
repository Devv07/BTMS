// export csv
const exportCSV = (headers, rows) => {
  const csv = [];

  // header
  csv.push(headers.join(","));

  // rows
  rows.forEach((row) => {
    const values = row.map((value) => {
      if (value === null || value === undefined) {
        return "";
      }

      const text = String(value).replace(/"/g, '""');

      return `"${text}"`;
    });

    csv.push(values.join(","));
  });

  return Buffer.from(csv.join("\n"));
};

module.exports = exportCSV;