const db = require('../../db'),
    bcrypt = require('bcrypt'),
    //  logger = require('../../utils/logger'),
    global_fun = require('../../utils/globalFunction'),
    CONSTANTS = require('../../utils/constants');
let Payment = db.Payment;
let resultdb = global_fun.resultdb;
var get_payment = async (userid) => {
    //logger.info('Enter intogetUserByEmail');
    try {
        var payment = await Payment.findOne({
            owner_of_payment: userid
        });
        //logger.info("payment ", payment);

        if (payment === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, payment)
        }
    } catch (error) {
        // logger.info(error);

        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)

    }
};
var save_payment = async (data) => {
    try {
        // logger.info("pament ::::::::::::::::; ", data);

        let payment1 = new Payment(data);
        let refferralres = await payment1.save();
        // logger.info("refferralres   ", refferralres);

        return resultdb(CONSTANTS.SUCCESS, refferralres)
    } catch (error) {
        //logger.info("pament :errorerrorerrorerror:::::::::::::::; ", error);
        if (error.code)
            return resultdb(error.code, CONSTANTS.DATA_NULL)
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }
}
module.exports = {
    get_payment: get_payment,
    save_payment: save_payment
};