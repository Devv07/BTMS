// ==============================
// BUS SEAT TEMPLATES
// ==============================

const SeatTemplates = {
  DELUXE_2X2: {
    name: "Deluxe 2x2",
    left: 2,
    right: 2,
    decks: 1,
  },

  SEMI_SLEEPER: {
    name: "Semi Sleeper",
    left: 2,
    right: 1,
    decks: 1,
  },

  SLEEPER: {
    name: "Sleeper",
    left: 2,
    right: 2,
    decks: 2,
  },

  MINI: {
    name: "Mini Bus",
    left: 1,
    right: 2,
    decks: 1,
  },

  MICRO: {
    name: "Micro Bus",
    left: 2,
    right: 2,
    decks: 1,
  },

  EV: {
    name: "Electric Coach",
    left: 2,
    right: 2,
    decks: 1,
  },

  LUXURY: {
    name: "Luxury Coach",
    left: 2,
    right: 1,
    decks: 1,
  },
};

module.exports = SeatTemplates;