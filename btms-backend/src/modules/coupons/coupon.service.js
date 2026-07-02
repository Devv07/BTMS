const prisma = require("../../config/prisma");

const couponStatus = require("./constants/couponStatus");

const {
  calculateDiscount,
  isCouponActive,
} = require("./helpers/coupon.helper");

// create coupon
const createCoupon = async (data) => {
  const exists = await prisma.coupon.findUnique({
    where: {
      code: data.code.toUpperCase(),
    },
  });

  if (exists) {
    throw new Error("Coupon already exists");
  }

  return prisma.coupon.create({
    data: {
      ...data,
      code: data.code.toUpperCase(),
    },
  });
};

// update coupon
const updateCoupon = async (
  couponId,
  data
) => {
  const coupon = await prisma.coupon.findUnique({
    where: {
      id: couponId,
    },
  });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  if (data.code) {
    data.code = data.code.toUpperCase();
  }

  return prisma.coupon.update({
    where: {
      id: couponId,
    },
    data,
  });
};

// delete coupon
const deleteCoupon = async (
  couponId
) => {
  const coupon = await prisma.coupon.findUnique({
    where: {
      id: couponId,
    },
  });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  await prisma.coupon.delete({
    where: {
      id: couponId,
    },
  });

  return {
    success: true,
    message:
      "Coupon deleted successfully",
  };
};

// get coupon
const getCoupon = async (
  couponId
) => {
  return prisma.coupon.findUnique({
    where: {
      id: couponId,
    },
  });
};

// get all coupons
const getCoupons = async () => {
  return prisma.coupon.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

// apply coupon
const applyCoupon = async ({
  code,
  totalAmount,
  userId,
}) => {
  const coupon =
    await prisma.coupon.findUnique({
      where: {
        code: code.toUpperCase(),
      },
    });

  if (!coupon) {
    throw new Error("Invalid coupon");
  }

  if (!isCouponActive(coupon)) {
    throw new Error(
      "Coupon is not active"
    );
  }

  if (
    coupon.minimumAmount &&
    totalAmount <
      coupon.minimumAmount
  ) {
    throw new Error(
      `Minimum booking amount is NPR ${coupon.minimumAmount}`
    );
  }

  if (
    coupon.maxUses &&
    coupon.usedCount >=
      coupon.maxUses
  ) {
    throw new Error(
      "Coupon usage limit exceeded"
    );
  }

  const userUsage =
    await prisma.booking.count({
      where: {
        userId,
        couponId: coupon.id,
      },
    });

  if (
    userUsage >=
    coupon.perUserLimit
  ) {
    throw new Error(
      "Coupon usage limit reached"
    );
  }

  const result =
    calculateDiscount({
      totalAmount,
      discountType:
        coupon.discountType,
      discountValue:
        coupon.discountValue,
      maximumDiscount:
        coupon.maximumDiscount,
    });

  return {
    coupon,
    discount:
      result.discount,
    finalAmount:
      result.finalAmount,
  };
};

// update coupon status
const updateCouponStatus = async (
  couponId,
  status
) => {
  const coupon = await prisma.coupon.findUnique({
    where: {
      id: couponId,
    },
  });

  if (!coupon) {
    throw new Error("Coupon not found");
  }

  return prisma.coupon.update({
    where: {
      id: couponId,
    },
    data: {
      status,
    },
  });
};

// coupon analytics
const getCouponAnalytics = async () => {
  const now = new Date();

  const [
    totalCoupons,
    activeCoupons,
    inactiveCoupons,
    expiredCoupons,
    totalRedemptions,
    coupons,
  ] = await Promise.all([
    prisma.coupon.count(),

    prisma.coupon.count({
      where: {
        status: "ACTIVE",
      },
    }),

    prisma.coupon.count({
      where: {
        status: "INACTIVE",
      },
    }),

    prisma.coupon.count({
      where: {
        OR: [
          {
            status: "EXPIRED",
          },
          {
            expiryDate: {
              lt: now,
            },
          },
        ],
      },
    }),

    prisma.coupon.aggregate({
      _sum: {
        usedCount: true,
      },
    }),

    prisma.coupon.findMany({
      select: {
        id: true,
        code: true,
        discountType: true,
        discountValue: true,
        usedCount: true,
        maxUses: true,
        status: true,
        expiryDate: true,
      },
      orderBy: {
        usedCount: "desc",
      },
    }),
  ]);

  return {
    totalCoupons,
    activeCoupons,
    inactiveCoupons,
    expiredCoupons,
    totalRedemptions:
      totalRedemptions._sum.usedCount || 0,
    coupons,
  };
};

module.exports = {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getCoupon,
  getCoupons,
  applyCoupon,
  updateCouponStatus,
  getCouponAnalytics,
};