const couponStatus = require("../constants/couponStatus");

// calculate discount
const calculateDiscount = ({
  totalAmount,
  discountType,
  discountValue,
  maximumDiscount,
}) => {
  let discount = 0;

  if (discountType === "PERCENTAGE") {
    discount = (totalAmount * discountValue) / 100;

    if (
      maximumDiscount &&
      discount > maximumDiscount
    ) {
      discount = maximumDiscount;
    }
  } else {
    discount = discountValue;
  }

  return {
    discount,
    finalAmount: Math.max(totalAmount - discount, 0),
  };
};

// check coupon status
const isCouponActive = (coupon) => {
  if (coupon.status !== couponStatus.ACTIVE) {
    return false;
  }

  const now = new Date();

  if (coupon.startDate > now) {
    return false;
  }

  if (coupon.expiryDate < now) {
    return false;
  }

  return true;
};

module.exports = {
  calculateDiscount,
  isCouponActive,
};