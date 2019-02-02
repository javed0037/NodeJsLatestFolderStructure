var mongoose = require('mongoose'),
   // logger = require('../utils/logger'),
    globalFunction = require('../utils/globalFunction'),
    dbconf = require('../config/db');

var dbString = 'mongodb://' + dbconf.dbcredentials.user;
dbString = dbString + ':' + dbconf.dbcredentials.password;
dbString = dbString + '@' + dbconf.dbcredentials.address;
dbString = dbString + ':' + dbconf.dbcredentials.port;
dbString = dbString + '/' + dbconf.dbcredentials.database;


mongoose.connect(dbString, {
    useCreateIndex: true,
    useNewUrlParser: true
});

var User = require('../db/models/user'),
   // Tree = require('../db/models/tree'),
    Admin = require('../db/models/admin'),
    Referral = require('../db/models/referral'),
    servicePayment = require('../routes/services/servicePayment'),
    serviceTransaction = require('../routes/services/serviceTransaction');

var save_admin = async (data) => {
    //insert Admin refferral Details `device_type`
    var userData = new User();
    userData.password = data.password;
    userData.mobile = data.mobile;
    userData.device_type = data.device_type;
    userData.device_token = data.device_token;
    userData.verificationStatus = true;


    var userresponse = null;
    var adminparentresponse = null;
    var admin_parent = new User();
    admin_parent.password = "1" + data.password;
    admin_parent.email = "adminparent" + data.email;
    admin_parent.mobile = "1" + data.mobile;
    admin_parent.device_type = data.device_type;
    admin_parent.device_token = data.device_token;
    admin_parent.verificationStatus = true;
    try {
        adminparentresponse = await admin_parent.save();
        userresponse = await userData.save();
    } catch (error) {
        console.log("error  ::: ", error.code);
        return error.code;
    }
    console.log("userresponse ", userresponse);
    console.log("adminparentresponse ", adminparentresponse);
    if (userresponse) {
        var referralData = new Referral();
        referralData.ownerOfReferral = userresponse._id;
        referralData.referralBy = null;
        referralData.referralCode = "AAAAAA";
        var referralres = await referralData.save();

        let transactionData = {

            ownerOfTransaction: userresponse._id

    }
 var arr =    await serviceTransaction.saveTransaction(transactionData);  




        console.log("referralres ", referralres);
    
    } else {
        return "Error to save data";
    }
}
var test_save_admin_function = async () => {
    console.log("result:::asdfasdf ");
    var userJson = {
        "mobile": "8888888888",
        "password": "GoodThingsTakeTime!!!",
        "device_type": "asdfasdf",
        "device_token": "poipi"
    }
    var result = await save_admin(userJson);
    console.log("result1::: ", result);
};

let AdminLogin = async (data) => {
    console.log('asdfljkdfjsldksf')
    let adminData = new Admin();
    adminData.password = data.password;
    adminData.username = data.username;
    let res = await adminData.save();
    console.log('res  ', res)
};

(async () => {
   // logger.info('11');
    test_save_admin_function();
})();

(async () => {
console.log('database is connected!!!');
    let loginData = {
        username: 'admin',
        password: 'admin123'
    }
    await AdminLogin(loginData);
    // logger.info('11');
    //test_save_admin_function();
})();