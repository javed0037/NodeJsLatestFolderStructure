const db = require('../../db'),
    bcrypt = require('bcrypt'),
    // logger = require('../../utils/logger'),
    global_fun = require('../../utils/globalFunction'),
    CONSTANTS = require('../../utils/constants');
let PaymentTransaction = db.PaymentTransaction;
let resultdb = global_fun.resultdb;
var getPaymentTransaction = async (userid) => {
    //logger.info('Enter intogetUserByEmail');
    try {
        var paymenttx = await PaymentTransaction.findOne({
            ownerOfPaymenttransaction: userid
        });
        if (paymenttx === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, paymenttx)
        }
    } catch (error) {
        // logger.info(error);
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
var getPaymentTransactionById = async (id) => {
    //logger.info('Enter intogetUserByEmail');
    try {
        var paymenttx = await PaymentTransaction.findOne({
            _id: id
        });
        if (paymenttx === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, paymenttx)
        }
    } catch (error) {
        //logger.info(error);
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
var getListPaymentTransactionByOwnerId = async (id) => {
    //logger.info('Enter intogetUserByEmail');
    try {
        var paymenttx = await PaymentTransaction.find({
            ownerOfPaymenttransaction: id
        });
        if (paymenttx === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, paymenttx)
        }
    } catch (error) {
        // logger.info(error);
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
var savePaymenttransaction = async (data) => {
    try {
        // logger.info("pament ::::::::::::::::; ", data);
        let payment1 = new PaymentTransaction(data);
        let refferralres = await payment1.save();
        // logger.info("refferralres   ", refferralres);
        return resultdb(CONSTANTS.SUCCESS, refferralres)
    } catch (error) {
        // logger.info("pament :errorerrorerrorerror:::::::::::::::; ", error);
        if (error.code)
            return resultdb(error.code, CONSTANTS.DATA_NULL)
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }
}

var getAllPaymenttransaction = async (data) => {
    try {
        //logger.info("pament ::::::::::::::::; ", data);
        var paymenttx = await PaymentTransaction.find().sort('-created_at');
        return resultdb(CONSTANTS.SUCCESS, paymenttx)
    } catch (error) {
        // logger.info("pament :errorerrorerrorerror:::::::::::::::; ", error);
        if (error.code)
            return resultdb(error.code, CONSTANTS.DATA_NULL)
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }
}

module.exports = {
    getPaymentTransaction: getPaymentTransaction,
    getAllPaymenttransaction: getAllPaymenttransaction,
    savePaymenttransaction: savePaymenttransaction,
    getListPaymentTransactionByOwnerId: getListPaymentTransactionByOwnerId,
    getPaymentTransactionById: getPaymentTransactionById
};