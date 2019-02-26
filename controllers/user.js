var User = require('../models/User');
var jwt = require('jsonwebtoken');

const PERMISSIONS = {
    admin: 0,
    blogReviewer: 1,
    reader: 2
};

/**
 * POST Method for creating a new user
 * @param req
 * @param res
 */
exports.signUp = function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    /* Username and Password shouldn't be empty */
    if (!username || !password) {
        res.json({
            success: false,
            error: "Parameters shouldn't be empty"
        });
        return;
    }

    let newUser = new User({
        username: username,
        passwordHash: password,
        permissionType: PERMISSIONS.reader /** Every user is a reader by default */
    });

    newUser.save(function (err, saved) {
        if (saved) {
            res.json({
                success: true,
                id: newUser._id
            });
            return;
        }

        res.json({
            success: false,
            error: "Can't create user"
        })
    });
};

/**
 * POST Method for login user
 * @param req
 * @param res
 */
exports.login = function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        res.json({
            success: false,
            error: "Parameters shouldn't be empty"
        });
        return;
    }

    User.findOne({username: username}).then(function (user, err) {
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

        user.comparePassword(password, function (correct) {
            if (!correct) {
                res.json({
                    success: false,
                    error: "Authentication failed. Wrong password"
                });
                return;
            }

            let token = jwt.sign(
                    { id: user._id, username: user.username },
                    process.env.JWT_SECRET,
                    { expiresIn: '24h' }
                );

            res.json({
                success: true,
                token: token
            });
        });
    });
};

/**
 * PATCH Method for updating user privilege (Admin method)
 * @param req
 * @param res
 */
exports.setPermissionType = function (req, res) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    let permission = req.body.permission;

    if (!token || !permission) {
        res.json({
            success: false,
            error: "Parameters shouldn't be empty"
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
            
            if (user.permissionType !== PERMISSIONS.admin) {
                res.json({
                    success: false,
                    error: "You are not granted to modify user permission"
                });
                return;
            }

            /* Update user privilege only by the admin */
            user.permissionType = permission;

            res.json({
                success: true,
            });
        });
    });
};

/**
 * PATCH Method for updating profile image
 * @param req
 * @param res
 */
exports.setProfileImage = function (req, res) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    let profileImgURL = req.body.profileImg;

    if (!token || !profileImgURL) {
        res.json({
            success: false,
            error: "Parameters shouldn't be empty"
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

            /* Update the path of profile image */
            user.profileImg = profileImgURL;

            res.json({
                success: true,
            });
        });
    });
};

/**
 * PATCH Method for updating user description
 * @param req
 * @param res
 */
exports.setDescription = function (req, res) {
    let token = req.body.token || req.query.token || req.headers['x-access-token'];
    let description = req.body.description;

    if (!token || !description) {
        res.json({
            success: false,
            error: "Parameters shouldn't be empty"
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

            /* Update user description */
            user.description = description;

            res.json({
                success: true,
            });
        });
    });
};