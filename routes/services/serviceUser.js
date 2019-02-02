const db = require('../../db'),
    bcrypt = require('bcrypt'),
    global_fun = require('../../utils/globalFunction'),
    CONSTANTS = require('../../utils/constants');
let User = db.User;
let resultdb = global_fun.resultdb;
var getUserByEmail = async (email) => {
    try {
        var user = await User.findOne({
            email: email
        });
        if (user === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, user)
        }
    } catch (error) {
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
var getUserById = async (id) => {
    //logger.info('Enter get_user_by_id......', id.toString());
    try {
        var user = await User.findOne({
            _id: id.toString()
        });
        if (user === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, user)
        }
    } catch (error) {
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
var findMobile = async (mobile) => {

    try {
        
        var user = await User.findOne({
            mobile: mobile
        });
        if (user === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, user)
        }
    } catch (error) {
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }
};
var getUserByEmailAndMobile = async (data) => {
    console.log('Enter into get_user_by_email_and_mobile ');
    try {
        let user = await User.findOne({
            $or: [{
                mobile: data.mobile
            }, {
                email: data.email
            }]
        });
        if (user === null) {
            return resultdb(CONSTANTS.NOT_FOUND, CONSTANTS.DATA_NULL)
        } else {
            return resultdb(CONSTANTS.SUCCESS, user)
        }
    } catch (error) {
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL)
    }

};
var saveUser = async (data) => {
    try {
        var testUser = new User(data);
        var responnse = await testUser.save();
        return resultdb(CONSTANTS.SUCCESS, responnse)
    } catch (error) {
        console.log("there are the catch error",error);
        
        if (error.code)
            return resultdb(error.code, CONSTANTS.DATA_NULL)
        return resultdb(CONSTANTS.SERVER_ERROR, CONSTANTS.DATA_NULL);
    }
};
var verifyMobilePassword = async (data) => {

    let userresponse = await findMobile(data.mobile);
    //  logger.info("userresponse ", userresponse);
     console.log("there are the result data------------",userresponse);
     
    if (userresponse.data === null) {
        //    logger.info("Entered Email not Found :::  ", userresponse);
        return resultdb(CONSTANTS.NOT_FOUND);
    } else if (userresponse.data.verificationStatus === false) {
        return resultdb(CONSTANTS.NOT_VERIFIED);
    } else {
        let verifypass = null;
        try {
            verifypass = await bcrypt.compare(data.password, userresponse.data.password);
        } catch (error) {
            //   logger.info(error);

        }
        //logger.info("verifypass", verifypass);
        if (verifypass) {
            return resultdb(CONSTANTS.SUCCESS, userresponse.data);
        } else {
            return resultdb(CONSTANTS.ACCESS_DENIED, CONSTANTS.FALSE);
        }
    }
};

module.exports = {
    getUserByEmail: getUserByEmail,
    getUserById: getUserById,
    getUserByEmailAndMobile: getUserByEmailAndMobile,
    saveUser: saveUser,
    findMobile: findMobile,
    verifyMobilePassword : verifyMobilePassword, 
};