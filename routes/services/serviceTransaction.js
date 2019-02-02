const db = require('../../db'),
    global_fun = require('../../utils/globalFunction'),
  //  logger = require('../../utils/logger'),
    CONSTANTS = require('../../utils/constants');
let Transaction = db.Transaction;
let resultdb = global_fun.resultdb;

var saveTransaction = async (data) => {
    console.log(data);
    try {
        let transaction = new Transaction(data);
        let refferralres = await transaction.save();
        return resultdb(CONSTANTS.SUCCESS, refferralres)
    } catch (error) {
        if (error.code)
            return resultdb(error.code, CONSTANTS.DATA_NULL)
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }
}
var findTransaction = async (userid) => {
    //logger.info('Enter find_transaction', userid.toString());
    try {
        var transaction = await Transaction.findOne({
            ownerOfTransaction: userid.toString()
        });
        console.log(transaction);

        if (transaction === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, transaction)
        }
    } catch (error) {
        console.log(error);

        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)

    }
};
module.exports = {
    saveTransaction: saveTransaction,
    findTransaction: findTransaction
};