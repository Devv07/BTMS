const axios = require("axios");
const PaymentStatus = require("../constants/paymentStatus");
const {
  generateEsewaSignature,
} = require("../utils/esewaSignature");

class EsewaGateway {
  constructor(payment) {
    this.payment = payment;
  }

  // ===========================================
  // CREATE PAYMENT
  // ===========================================

  async createPayment({ booking, payment, customer }) {
    const transactionUuid = payment.id;

    const totalAmount = payment.amount;

    const productCode = process.env.ESEWA_MERCHANT_CODE;

    const signature = generateEsewaSignature(
      totalAmount,
      transactionUuid,
      productCode
    );

    return {
      success: true,

      method: "ESEWA",

      status: PaymentStatus.PENDING,

      transactionId: transactionUuid,

      gatewayReference: transactionUuid,

      redirectUrl: process.env.ESEWA_BASE_URL,

      formData: {
        amount: totalAmount,
        tax_amount: 0,
        total_amount: totalAmount,

        transaction_uuid: transactionUuid,

        product_code: productCode,

        product_service_charge: 0,

        product_delivery_charge: 0,

        success_url: process.env.ESEWA_SUCCESS_URL,

        failure_url: process.env.ESEWA_FAILURE_URL,

        signed_field_names:
          "total_amount,transaction_uuid,product_code",

        signature,
      },
    };
  }

  // ===========================================
  // VERIFY PAYMENT
  // ===========================================

  async verifyPayment(payment) {
    try {
      const response = await axios.get(
        "https://rc.esewa.com.np/api/epay/transaction/status/",
        {
          params: {
            product_code: process.env.ESEWA_MERCHANT_CODE,
            total_amount: payment.amount,
            transaction_uuid: payment.transactionId,
          },
        }
      );

      if (response.data.status === "COMPLETE") {
        return {
          success: true,

          status: PaymentStatus.SUCCESS,

          transactionId: payment.transactionId,

          gatewayReference:
            response.data.ref_id || null,

          response: response.data,
        };
      }

      return {
        success: false,

        status: PaymentStatus.FAILED,

        message: "Payment not completed",

        response: response.data,
      };
    } catch (error) {
      return {
        success: false,

        status: PaymentStatus.FAILED,

        message:
          error.response?.data?.message ||
          error.message,
      };
    }
  }

  // ===========================================
  // REFUND
  // ===========================================

  async refundPayment() {
    return {
      success: false,

      message:
        "eSewa refund must be processed manually.",
    };
  }

  // ===========================================
  // WEBHOOK
  // ===========================================

  async webhook(payload) {
    return {
      success: true,

      payload,
    };
  }
}

module.exports = EsewaGateway;