const PaymentStatus = require("../constants/paymentStatus");

class CashGateway {
  constructor(payment) {
    this.payment = payment;
  }

  // create payment
  async createPayment() {
    return {
      success: true,
      method: "CASH",
      status: PaymentStatus.PENDING,
      redirectUrl: null,
      transactionId: null,
      message: "Cash payment created successfully",
    };
  }

  // verify payment
  async verifyPayment() {
    return {
      success: true,
      status: PaymentStatus.SUCCESS,
      transactionId: null,
      message: "Cash payment verified",
    };
  }

  // refund payment
  async refundPayment() {
    return {
      success: true,
      status: PaymentStatus.REFUNDED,
      message: "Cash payment refunded",
    };
  }

  // webhook
  async webhook() {
    return {
      success: true,
      message: "Cash gateway does not support webhook",
    };
  }
}

module.exports = CashGateway;