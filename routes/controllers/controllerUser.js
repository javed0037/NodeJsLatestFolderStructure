const express = require('express'),
    router = express.Router(),
    Joi = require('joi'),
    globalFunction = require('../../utils/globalFunction'),
    jwt = require('jsonwebtoken'),
    serviceUser = require('../services/serviceUser'),
    randomStringGenerator = require('../../utils/randomStringGenerator'),
    serviceReferral = require('../services/serviceReferral'),
    serviceTransaction = require('../services/serviceTransaction'),
    settings = require('../../config/settings'),
    CONSTANTS = require('../../utils/constants'),
    CONSTANTS_MSG = require('../../utils/constantsMessage');
let apiSuccessRes = globalFunction.apiSuccessRes;
let apiErrorRes = globalFunction.apiErrorRes;
const registerParamSchema = Joi.object({
    mobile: Joi.string().required(),
    name: Joi.string().required(),
    reffreralCode: Joi.string().allow('').optional(),
    deviceId: Joi.string().required(),
    password: Joi.string().required(),
    email: Joi.string().email().regex(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/).required()
});

const loginParamSchema = Joi.object({
    mobile: Joi.string().regex(/^[6-9]\d{9}$/).required(),
    email: Joi.string().required(),
    password: Joi.string().required()
   
    // device_token: Joi.string().required()
  });

const getEmailParamSchema = Joi.object({
    email: Joi.string().required()
});
async function checkEmailStatus(req, res) {
    let isReqParamValid = null;
    try {
        isReqParamValid = await getEmailParamSchema.validate(req.body, {
            abortEarly: true
        });
    } catch (error) {
        console.log("there are the error-------",error);
        
        return apiErrorRes(req, res, 'Send valid param!!!');
    }
    //Find Mobile
    let userData = await serviceUser.getUserByEmail(req.body.email);
    console.log("there are result for this", userData)
    if (userData.statusCode === CONSTANTS.SUCCESS && userData.data.verificationStatus === true) {
        console.log("ther are the data way1")
        return apiSuccessRes(req, res, 'Email is exist and Verified');
    } else if (userData.statusCode === CONSTANTS.SUCCESS && userData.data.verificationStatus === false) {
        console.log("ther are the data way3")
        apiErrorRes(req, res, 'Email exist  and not verified', CONSTANTS.DATA_NULL, CONSTANTS.ERROR_CODE_ONE);
    } else if (userData.statusCode === CONSTANTS.NOT_FOUND) {
        console.log("ther are the data way4")
        return apiErrorRes(req, res, 'Email not exist!!!');
    } else if (userData.statusCode === CONSTANTS.SERVER_ERROR) {
        console.log("ther are the data way5")
        return apiErrorRes(req, res, CONSTANTS_MSG.LOGIN_FAILURE);
    } else {
        console.log("ther are the data way6")
    }
}
async function register(req, res) {

    let isReqParamValid = null;
    try {
        isReqParamValid = await registerParamSchema.validate(req.body, {
            abortEarly: true
        });
    } catch (error) {
        return apiErrorRes(req, res, 'Send valid param!!!');

    }
    let userData = await serviceUser.getUserByEmail(req.body.email);

    if (userData.statusCode === CONSTANTS.SUCCESS && userData.data.isDeleted == true) {

      return apiErrorRes(req, res, 'Your mobile number is deactivated from admin. Please contanct to support.', CONSTANTS.DATA_NULL, CONSTANTS.DEACTIVE_STATUS);
   
    }else if (userData.statusCode === CONSTANTS.SUCCESS && userData.data.verificationStatus === true) {
     
      const token = jwt.sign({
            sub: userData.data.id
        }, settings.secret);

        return apiErrorRes(req, res, 'Email alreday  exist and Verified');

    } else if (userData.data == null) {

        if (req.body.reffreralCode === '') {

            console.log('set admin referal code ');
            referralCodeFromUser = settings.ADMIN_REFERRAL_CODE;
        } else {

            referralCodeFromUser = req.body.reffreralCode;

        }

        let referralDataParent = await serviceReferral.findReferral(referralCodeFromUser);


        if (referralDataParent.statusCode == CONSTANTS.SUCCESS) {
            let parentUserData = await serviceUser.getUserById(referralDataParent.data.ownerOfReferral);

            if (parentUserData.statusCode === CONSTANTS.SUCCESS) {
                let saveUserData = {

                    mobile: req.body.mobile,
                    deviceId: req.body.deviceId,
                    email: req.body.email,
                    name: req.body.name,
                    verificationStatus: true,
                    password : req.body.passsword

                }

                let userdataRes = await serviceUser.saveUser(saveUserData);

                console.log("khsan ---------------",userdataRes);
                
                if (userdataRes.statusCode == 11000) {

                    return apiErrorRes(req, res, 'mobile already exist!!!');
                } else
                    parentUserData.data.point = parseInt(parentUserData.data.point) + 200;

                let saveamountofparent = await parentUserData.data.save();
                
                 console.log("saveamountofparentsaveamountofparent",saveamountofparent.id);
                 
                

                let transactionData = {

                        ownerOfTransaction: userdataRes.data._id

                }
            var arr =    await serviceTransaction.saveTransaction(transactionData);  
                let generateReferral = await randomStringGenerator.referral(CONSTANTS.REFERRAL_CODE_LENGTH);

                let saveReferralData = {

                    ownerOfReferral: userdataRes.data._id,
                    referralCode: generateReferral,
                    referralBy: saveamountofparent._id

                }
                let txData = await serviceTransaction.findTransaction(saveamountofparent.id);
                  let jsonObjectTx = {
                    "type": "RA",
                    "comment": "ReferalAmount ",
                    "amount": CONSTANTS.REFERRAL_AMOUNT
                  }
                  txData.data.transactionList.push(jsonObjectTx);
                  txData.data.save();

                let referraldata = await serviceReferral.saveReferral(saveReferralData);
                
                if (referraldata.statusCode === CONSTANTS.SUCCESS) {

                    const token = jwt.sign({
                        sub: userdataRes.data.id
                    }, settings.secret);

                    return apiSuccessRes(req, res, CONSTANTS_MSG.REGISTRATION_SUCCESS_MESSAGE, '', CONSTANTS.ERROR_CODE_ZERO, CONSTANTS.ERROR_FALSE, token);
                } else {

                    return apiErrorRes(req, res, 'unable to save new referal user!!!');
                }

            }
        } else {
            return apiErrorRes(req, res, 'unable to find the referal user!!!');
        }
    } else {
        return apiErrorRes(req, res, 'email id not exist!!!');
    }
}
async function login(req, res) {
    // logger.info("Enter into login req.body.device_token:::: ", req.body.device_token)
    let isReqParamValid = null;
    try {
      isReqParamValid = await loginParamSchema.validate(req.body, {
        abortEarly: true
      });
    } catch (error) {
        console.log("there are the error for this way ",error);
        
      //  logger.info("errorerrorerror register")
      return apiErrorRes(req, res, 'Send valid param!!!');
    }
    //Find Mobile
    let findUserData = {

      mobile: req.body.mobile,
      email : req.body.email,
      password: req.body.password,
    //   deviceType: req.body.deviceType,
    //   deviceId: req.body.deviceId,
    //   deviceToken: req.body.deviceToken
    }

    let userData = await serviceUser.verifyMobilePassword(findUserData);
    console.log("there are the response",userData);
    
    if (userData.statusCode === CONSTANTS.SUCCESS && userData.data.verificationStatus === true) {
      if (userData.data.isDeleted) {
        return apiErrorRes(req, res, 'Your mobile number is deactivated from admin. Please contanct to support.', CONSTANTS.DATA_NULL, CONSTANTS.DEACTIVE_STATUS);
      }
      const token = jwt.sign({sub: userData.data.id}, settings.secret);  
    //   let loginHistoryData = await serviceLoginHistory.get_login_history(userData.data.id);
      //  logger.info("loginHistoryData.data ", loginHistoryData.data);
    //   await loginHistoryData.data.save();
      return apiSuccessRes(req, res, CONSTANTS_MSG.LOGIN_SUCCESS, userData.data, CONSTANTS.ERROR_CODE_ONE, CONSTANTS.ERROR_FALSE, token);
    } else if (userData.statusCode === CONSTANTS.NOT_VERIFIED) {
      return apiErrorRes(req, res, 'Mobile is  not Verified', CONSTANTS.DATA_NULL, CONSTANTS.ERROR_CODE_TWO);
    } else if (userData.statusCode === CONSTANTS.ACCESS_DENIED) {
      return apiErrorRes(req, res, 'Enter valid password');
    } else if (userData.statusCode === CONSTANTS.NOT_FOUND) {
      return apiErrorRes(req, res, 'Please enter valid Mobile!!!');
    } else if (userData.statusCode === CONSTANTS.SERVER_ERROR) {
      return apiErrorRes(req, res, CONSTANTS_MSG.LOGIN_FAILURE);
    
    }
  
  }
  


router.post('/checkEmailStatus', checkEmailStatus);
router.post('/register', register);
router.post('/login', login);
module.exports = router;