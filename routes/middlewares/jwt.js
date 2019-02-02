const expressJwt = require('express-jwt');
const globalFunction = require('../../utils/globalFunction');
const settings = require('../../config/settings');
const userService = require('../services/serviceUser');

module.exports = jwt;

function jwt() {
    console.log("there are the request comming----------------")

    const secret = settings.secret;
    return expressJwt({
        secret,
        isRevoked
    }).unless({
        path: [
            '/api/v1/login',
            '/api/v1/register',
            '/api/v1/checkEmailStatus',
            '/api/v1/admin/getUserTransactions',
            '/api/v1/admin/getAllPaymenttransaction',
            '/api/v1/saveVideo',
            '/api/v1/addCategory',
            '/api/v1/listCategory',
            '/api/v1/listVideo',
            
        ]
    });
}///reversePayment
async function isRevoked(req, payload, done) {

    const user = await userService.getUserById(payload.sub);
    console.log(user);

    if (!user.data) {
        return done(null, true);
    }
    req.body.userid = user.data.id;
    if (user.data.isDeleted) {
        console.log("isDelete....................");
        req.body.isDeleted = user.data.isDeleted;
        return done(null, true);
    }
    done();
};