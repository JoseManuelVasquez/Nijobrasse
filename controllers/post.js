var Post = require('../models/Post');

/**
 * POST Method for creating a new post
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