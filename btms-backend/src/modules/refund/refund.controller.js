const refundService = require("./refund.service");

// request refund
exports.requestRefund = async (req, res, next) => {
  try {
    const refund = await refundService.requestRefund({
      userId: req.user.id,
      bookingId: req.body.bookingId,
      reason: req.body.reason,
    });

    res.status(201).json({
      success: true,
      message: "Refund requested successfully",
      data: refund,
    });
  } catch (error) {
    next(error);
  }
};

// get all refunds
exports.getRefunds = async (req, res, next) => {
  try {
    const refunds = await refundService.getRefunds();

    res.json({
      success: true,
      data: refunds,
    });
  } catch (error) {
    next(error);
  }
};

// get refund by id
exports.getRefund = async (req, res, next) => {
  try {
    const refund = await refundService.getRefund(req.params.id);

    res.json({
      success: true,
      data: refund,
    });
  } catch (error) {
    next(error);
  }
};

// update refund status
exports.updateRefundStatus = async (req, res, next) => {
  try {
    const refund = await refundService.updateRefundStatus({
        refundId: req.params.id,
        status: req.body.status,
        adminRemark: req.body.adminRemark,
    });

    res.json({
      success: true,
      message: `Refund ${req.body.status.toLowerCase()} successfully`,
      data: refund,
    });
  } catch (error) {
    next(error);
  }
};


// my refunds
exports.getMyRefunds = async (req, res, next) => {
  try {
    const refunds = await refundService.getMyRefunds(
      req.user.id
    );

    res.json({
      success: true,
      data: refunds,
    });
  } catch (error) {
    next(error);
  }
};

// refunds by user
exports.getRefundsByUser = async (req, res, next) => {
  try {
    const refunds =
      await refundService.getRefundsByUser(
        req.params.userId
      );

    res.json({
      success: true,
      data: refunds,
    });
  } catch (error) {
    next(error);
  }
};

// refund analytics
exports.getRefundAnalytics = async (req, res, next) => {
  try {
    const analytics =
      await refundService.getRefundAnalytics();

    res.json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};