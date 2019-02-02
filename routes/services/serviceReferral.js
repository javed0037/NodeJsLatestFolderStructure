const db = require('../../db'),
    global_fun = require('../../utils/globalFunction'),
   
    CONSTANTS = require('../../utils/constants');
let Referral = db.Referral;
let resultdb = global_fun.resultdb;
var saveReferral = async (data) => {
    console.log(data);
    try {
        let referral = new Referral(data);
        let refferralres = await referral.save();
        return resultdb(CONSTANTS.SUCCESS, refferralres)
    } catch (error) {
        if (error.code)
            return resultdb(error.code, CONSTANTS.DATA_NULL)
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }
}
var findReferral = async (referralCode) => {
    try {
        var referral = await Referral.findOne({
            referralCode: referralCode
        });
        if (referral === null) {
            console.log("referal is null")
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            console.log("referal is not null")
            return resultdb(CONSTANTS.SUCCESS, referral)
        }
    } catch (error) {
        console.log(referralCode,"there are feferal ccccccatch",error)
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)

    }
};
var getReferralById = async (id) => {
    logger.info('Enter getReferralById');
    try {
        var referral = await Referral.findOne({
            ownerOfReferral: id
        });
        if (referral === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, referral)
        }
    } catch (error) {
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)

    }
};
module.exports = {
    saveReferral: saveReferral,
    findReferral: findReferral,
    getReferralById: getReferralById
};