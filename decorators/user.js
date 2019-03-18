var User = require('../models/User');
var jwt = require('jsonwebtoken');
var USER_CONSTANTS = require('../constants/user');

/**
 * Login required, using token already created
 * @param {Object} req
 * @param {Object} res
 */
exports.loginRequired = loginRequired;
function loginRequired (req, res) {
    /* Token provided by user */
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (!token) {
        res.json({
            success: false,
            error: "Token shouldn't be empty"
        });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
        if (err) {
            res.json(err);
            return;
        }

        User.findOne({_id: decodedToken.id}).then(function (user, err) {
            if (err) {
                res.json({
                    success: false,
                    error: "Database error"
                });
                return;
            }

            if (!user) {
                res.json({
                    success: false,
                    error: "User not found"
                });
                return;
            }

            return true;
        });
    });
}

/**
 * Admin required, using token already created
 * @param {Object} req
 * @param {Object} res
 */
exports.adminRequired = adminRequired;
function adminRequired (req, res) {
    /* Token provided by user */
    let token = req.body.token || req.query.token || req.headers['x-access-token'];

    jwt.verify(token, process.env.JWT_SECRET, function (err, decodedToken) {
        if (err) {
            res.json(err);
            return;
        }

        User.findOne({_id: decodedToken.id}).then(function (user, err) {
            if (err) {
                res.json({
                    success: false,
                    error: "Database error"
                });
                return;
            }

            if (user.permissionType !== USER_CONSTANTS.PERMISSIONS.admin) {
                res.json({
                    success: false,
                    error: "You are not granted to modify user permission"
                });

                return;
            }

            return true;
        });
    });
}