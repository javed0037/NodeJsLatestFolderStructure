var mongoose = require('mongoose'),
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
mongoose.Promise = global.Promise;
module.exports = {
    User: require('./models/user'),
    Referral: require('./models/referral'),
    Transaction: require('./models/transaction'),
    Task: require('./models/task'),
    PaymentTransaction: require('./models/paymentTransaction'),
    Video: require('./models/video'),
    Category: require('./models/category'),
};