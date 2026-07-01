const ExcelJS = require("exceljs");

// export excel
const exportExcel = async (
  sheetName,
  headers,
  rows
) => {
  const workbook = new ExcelJS.Workbook();

  const worksheet =
    workbook.addWorksheet(sheetName);

  // header
  worksheet.addRow(headers);

  // style header
  worksheet.getRow(1).font = {
    bold: true,
  };

  worksheet.getRow(1).alignment = {
    vertical: "middle",
    horizontal: "center",
  };

  // border
  worksheet.getRow(1).eachCell((cell) => {
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });

  // rows
  rows.forEach((row) => {
    worksheet.addRow(row);
  });

  // auto width
  worksheet.columns.forEach((column) => {
    let maxLength = 15;

    column.eachCell((cell) => {
      const length = cell.value
        ? cell.value.toString().length
        : 10;

      if (length > maxLength) {
        maxLength = length;
      }
    });

    column.width = maxLength + 3;
  });

  return workbook.xlsx.writeBuffer();
};

module.exports = exportExcel;