var express = require('express');
var router = express.Router();
var post = require('../controllers/post');

router.post('/create', post.createPost); /** POST Create new post. */

module.exports = router;