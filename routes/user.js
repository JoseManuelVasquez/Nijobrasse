var express = require('express');
var router = express.Router();
var user = require('../controllers/user');

router.post('/signup', user.signUp); /** POST Create new user. */
router.post('/login', user.login); /** POST Login user. */
router.patch('/set-profile-image', user.setProfileImage); /** PATCH Set profile image */
router.patch('/set-permission-type', user.setPermissionType); /** PATCH Set user privilege */
router.patch('/set-description', user.setDescription); /** PATCH Set user description */

module.exports = router;
