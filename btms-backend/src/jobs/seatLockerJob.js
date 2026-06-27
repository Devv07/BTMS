const cleanExpiredSeatLocks = require("../utils/seatLockCleaner");

const startSeatLockCleaner = () => {
  console.log("🚀 Seat Lock Cleaner started...");

  // run every 60 seconds
  setInterval(() => {
    cleanExpiredSeatLocks();
  }, 60 * 1000);
};

module.exports = startSeatLockCleaner;