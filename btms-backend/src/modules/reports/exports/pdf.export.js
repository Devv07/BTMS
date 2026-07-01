const PDFDocument = require("pdfkit");

// export pdf
const exportPDF = (title, headers, rows) => {
  return new Promise((resolve) => {
    const doc = new PDFDocument({
      margin: 30,
      size: "A4",
    });

    const buffers = [];

    doc.on("data", (chunk) => buffers.push(chunk));

    doc.on("end", () => {
      resolve(Buffer.concat(buffers));
    });

    // title
    doc
      .fontSize(20)
      .text(title, {
        align: "center",
      });

    doc.moveDown();

    // headers
    doc.fontSize(12);

    headers.forEach((header) => {
      doc.text(header, {
        continued: true,
        width: 100,
      });
    });

    doc.moveDown();

    // line
    doc.moveTo(30, doc.y)
      .lineTo(570, doc.y)
      .stroke();

    doc.moveDown();

    // rows
    rows.forEach((row) => {
      row.forEach((value) => {
        doc.text(String(value), {
          continued: true,
          width: 100,
        });
      });

      doc.moveDown();
    });

    doc.end();
  });
};

module.exports = exportPDF;