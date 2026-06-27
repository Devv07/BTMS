const generateSeats = (template) => {
  const seats = [];

  const { type, rows = 10, columns = 4, labels = [] } = template;

  // STANDARD 2x2 or 2x1
  if (type === "STANDARD_2X2") {
    const rowLabels = labels.length ? labels : ["A", "B", "C", "D", "E"];

    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= columns; c++) {
        seats.push({
          seatNumber: `${rowLabels[r] || "X"}${c}`,
          row: r,
          col: c,
          type: "SEAT",
        });
      }
    }
  }

  // VIP 2x1
  if (type === "VIP_2X1") {
    const rowLabels = labels.length ? labels : ["A", "B", "C", "D"];

    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= 2; c++) {
        seats.push({
          seatNumber: `${rowLabels[r] || "X"}${c}`,
          row: r,
          col: c,
          type: "VIP",
        });
      }
    }
  }

  // SLEEPER
  if (type === "SLEEPER") {
    for (let r = 0; r < rows; r++) {
      seats.push({
        seatNumber: `U${r + 1}`,
        row: r,
        col: 1,
        type: "UPPER",
      });

      seats.push({
        seatNumber: `L${r + 1}`,
        row: r,
        col: 2,
        type: "LOWER",
      });
    }
  }

  // NEPALI CUSTOM (A, B, K, KH, GHA style)
  if (type === "NEPALI_CUSTOM") {
    const rowLabels = labels.length ? labels : ["A", "B", "K", "KH", "GHA"];

    for (let r = 0; r < rows; r++) {
      for (let c = 1; c <= columns; c++) {
        seats.push({
          seatNumber: `${rowLabels[r]}${c}`,
          row: r,
          col: c,
          type: "CUSTOM",
        });
      }
    }
  }

  return seats;
};

module.exports = generateSeats;