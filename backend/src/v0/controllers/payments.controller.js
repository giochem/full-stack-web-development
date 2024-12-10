const paymentService = require("../services/payments.service");
const Response = require("../configs/response");
const { Message, StatusCode } = require("../utils/constants");

module.exports = {
  getPayments: async (req, res, next) => {
    try {
      const data = await paymentService.getPayments();
      return Response.success(
        res,
        Message.SUCCESS_GET_PAYMENTS,
        data,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in getPayments controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  upsertPayment: async (req, res, next) => {
    try {
      const { paymentID, name, price } = req.body;

      const newPayment = await paymentService.upsertPayment({
        paymentID,
        name,
        price,
      });
      return Response.success(
        res,
        Message.SUCCESS_CREATE_PAYMENT,
        newPayment,
        StatusCode.CREATED
      );
    } catch (error) {
      console.error("Error in upsertPayment controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },

  deletePayment: async (req, res, next) => {
    try {
      const { paymentID } = req.params;
      await paymentService.deletePaymentByPaymentID(paymentID);
      return Response.success(
        res,
        Message.SUCCESS_DELETE_PAYMENT,
        null,
        StatusCode.OK
      );
    } catch (error) {
      console.error("Error in deletePayment controller:", error);
      return Response.serverError(res, Message.ERROR_DB_QUERY, error);
    }
  },
};
