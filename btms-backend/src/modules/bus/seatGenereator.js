const SeatTemplates = require("./seatTemplates");

const generateSeats = ({
  template = "DELUXE_2X2",
  totalSeats = 40,
}) => {
  const config = SeatTemplates[template];

  if (!config) {
    throw new Error(`Invalid seat template: ${template}`);
  }

  const seats = [];
  let seatIndex = 1;
  let rowNumber = 0;

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  while (seatIndex <= totalSeats) {
    const rowLetter = letters[rowNumber];

    // LEFT SIDE
    for (let i = 1; i <= config.left; i++) {
      if (seatIndex > totalSeats) break;

      seats.push({
        seatNumber: `${rowLetter}${i}`,
        row: rowNumber + 1,
        col: i,
        side: "LEFT",
        position: i === 1 ? "WINDOW" : "AISLE",
        deck: "LOWER",
        type: "NORMAL",
        status: "AVAILABLE",
        isHeld: false,
      });

      seatIndex++;
    }

    // RIGHT SIDE
    for (let i = 1; i <= config.right; i++) {
      if (seatIndex > totalSeats) break;

      seats.push({
        seatNumber: `${rowLetter}${config.left + i}`,
        row: rowNumber + 1,
        col: config.left + i,
        side: "RIGHT",
        position: i === config.right ? "WINDOW" : "AISLE",
        deck: "LOWER",
        type: "NORMAL",
        status: "AVAILABLE",
        isHeld: false,
      });

      seatIndex++;
    }

    rowNumber++;
  }

  // Generate upper deck for sleeper buses
  if (config.deck === 2) {
    const upperSeats = seats.map((seat) => ({
      ...seat,
      seatNumber: `U${seat.seatNumber}`,
      deck: "UPPER",
    }));

    return [...seats, ...upperSeats];
  }

  return seats;
};

module.exports = generateSeats;