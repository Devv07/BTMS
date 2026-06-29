const PaymentMethod = require("../constants/paymentMethod");
const CashGateway = require("../gateways/cash.gateway");
const EsewaGateway = require("../gateways/esewa.gateway");
const KhaltiGateway = require("../gateways/khalti.gateway");
const StripeGateway = require("../gateways/stripe.gateway");
const RazorpayGateway = require("../gateways/razorpay.gateway");

class PaymentFactory {
  static create(method, payment) {
    switch (method) {
      case PaymentMethod.CASH:
      case PaymentMethod.COUNTER:
        return new CashGateway(payment);

      case PaymentMethod.ESEWA:
        return new EsewaGateway(payment);

      case PaymentMethod.KHALTI:
        return new KhaltiGateway(payment);

      case PaymentMethod.STRIPE:
        return new StripeGateway(payment);

      case PaymentMethod.RAZORPAY:
        return new RazorpayGateway(payment);

      default:
        throw new Error(`Unsupported payment method: ${method}`);
    }
  }
}

module.exports = PaymentFactory;