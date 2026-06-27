const seatLockService = require("./seatLock.service");

// LOCK SEAT API
const lockSeat = async (req, res) => {
  try {
    const { seatId, busId } = req.body;

    // ⚠️ userId usually comes from auth middleware
    const userId = req.user.id;

    const lock = await seatLockService.lockSeat({
      seatId,
      busId,
      userId,
    });

    res.status(200).json({
      success: true,
      data: lock,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  lockSeat,
};