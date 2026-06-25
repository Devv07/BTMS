const generateSeats = (config) => {
  const seats = [];

  const { layout = "2x2", rows = 10 } = config;

  let seatNo = 1;

  for (let r = 1; r <= rows; r++) {
    if (layout === "2x2") {
      seats.push(
        { seatNumber: `A${r}L`, type: "WINDOW", row: r },
        { seatNumber: `A${r}R`, type: "AISLE", row: r },
        { seatNumber: `B${r}L`, type: "AISLE", row: r },
        { seatNumber: `B${r}R`, type: "WINDOW", row: r }
      );
    }

    if (layout === "1x1") {
      seats.push({
        seatNumber: `S${seatNo}`,
        type: "SINGLE",
        row: r,
      });
      seatNo++;
    }

    if (layout === "berth") {
      seats.push(
        { seatNumber: `U${r}`, type: "UPPER", row: r },
        { seatNumber: `L${r}`, type: "LOWER", row: r }
      );
    }
  }

  return seats;
};

module.exports = generateSeats;