class BaseGateway {
  constructor(payment) {
    this.payment = payment;
  }

  // create payment
  async createPayment() {
    throw new Error("createPayment() must be implemented");
  }

  // verify payment
  async verifyPayment() {
    throw new Error("verifyPayment() must be implemented");
  }

  // refund payment
  async refundPayment() {
    throw new Error("refundPayment() must be implemented");
  }

  // webhook
  async webhook() {
    throw new Error("webhook() must be implemented");
  }
}

module.exports = BaseGateway;