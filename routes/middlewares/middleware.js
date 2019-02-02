const settings = require('../../config/settings');
const globalFunction = require('../../utils/globalFunction');
const CONSTANTS = require('../../utils/constants');
const apiErrorRes = globalFunction.apiErrorRes;
const _ = require('underscore');

function check_fscp(data) {
    if (data === settings.fscp) {
        return true;
    } else {
        return false;
    }
}

var middleware = function (req, res, next) {
    let nonSecurePaths = ['/api/v1/admin/adminLogin',
        '/api/v1/admin/disableUser',
        '/api/v1/admin/getUserTransactions',
        '/api/v1/admin/getAllPaymenttransaction',
        '/api/v1/admin/getAllUserForAdmin',
        '/api/v1/admin/approvePayment',
        '/api/v1/admin/reversePayment',
        '/api/v1/admin/searchUserByMobile',
        '/api/v1/admin/adminDashboard',
        '/api/v1/admin/getAllUserForAdminPaginate',
        '/api/v1/admin/settlePayment',];
    if (_.contains(nonSecurePaths, req.path)) return next();

    let fscpStatus = check_fscp(req.body.fscp);
    if (fscpStatus === false) {
        return apiErrorRes(req, res, 'FSCP Invalid');
    } else if (settings.isMaintenance) {
        return apiErrorRes(req, res, 'Under mainenance', CONSTANTS.DATA_NULL, CONSTANTS.MAINTENANCE_STATUS);
    }
    delete req.body['fscp'];

    next()
}
module.exports = middleware;


