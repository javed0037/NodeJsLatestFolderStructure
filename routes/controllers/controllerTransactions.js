var express = require('express'),
    router = express.Router(),
    //logger = require('../../utils/logger'),
    Joi = require('joi'),
    serviceTransaction = require('../services/serviceTransaction'),
    servicePaymentTransaction = require('../services/servicePaymentTransaction'),
    globalFun = require('../../utils/globalFunction'),
    CONSTANTS = require('../../utils/constants');
const _ = require('lodash');

let apiSuccessRes = globalFun.apiSuccessRes;
let apiErrorRes = globalFun.apiErrorRes;
let getTransactionsParamSchema = Joi.object({
    userid: Joi.string().required()

});


async function getTransactions(req, res) {
    // logger.info("Enter into getTransactions:::: ")
    let isReqParamValid = null;
    try {
        isReqParamValid = await getTransactionsParamSchema.validate(req.body, {
            abortEarly: true
        });
    } catch (error) {
        
        console.log("there are the error",req.body);
        
        //   logger.info("errorerrorerror register")
        return apiErrorRes(req, res, 'Send valid param!!!');
    }

    //Find Mobile

    let txData = await serviceTransaction.findTransaction(req.body.userid);
    if (txData.statusCode === CONSTANTS.SUCCESS) {
       
        console.log("we get the transaction -----------------",txData);
        
        let paymentTxDetails = await servicePaymentTransaction.getListPaymentTransactionByOwnerId(req.body.userid);
        // logger.info("paymentTxDetails.data ", paymentTxDetails.data.length);
        console.log("there are the transaction data",paymentTxDetails);
        
        if (paymentTxDetails.data.length >= 1) {

            for (let ij = 0; ij < paymentTxDetails.data.length; ij++) {
                //   logger.info("ij    ", ij);

                let txDataElement = paymentTxDetails.data[ij];
                let jsonObjectTx = {
                    "transactionDate": txDataElement.transactionTime,
                    "status": txDataElement.status,
                    "type": "AD2W",
                    "isWithdraw": true,
                    "comment": "Withdraw Amount",
                    "_id": txDataElement._id,
                    "amount": txDataElement.amount
                }
                txData.data.transactionList.push(jsonObjectTx)
            }
        }
        var shortedarray = (_.sortBy(txData.data.transactionList, '_id', ['asc'])).reverse();
        var lastSomeTx = shortedarray.slice(0, 20);
        return apiSuccessRes(req, res, 'success', lastSomeTx);
    } else if (txData.statusCode === CONSTANTS.SUCCESS && txData.data.verificationStatus === false) {
        console.log("another way to get txdaat---------",txData);
        
        return apiErrorRes(req, res, 'Mobile is registerd and not Verified');
    } else if (txData.statusCode === CONSTANTS.NOT_FOUND) {
       console.log("atleast there are  working0000000",txData);
        return apiErrorRes(req, res, 'Please enter valid Mobile!!!');
    } else if (txData.statusCode === CONSTANTS.SERVER_ERROR) {
        return apiErrorRes(req, res, 'Server Error!!!');
    } else {
        return apiErrorRes(req, res, 'Error!!!');
    }
}
router.post('/getTransactions', getTransactions);
module.exports = router;