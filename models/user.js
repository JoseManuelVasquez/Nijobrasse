var mongoose = require('mongoose');
var crypto = require('crypto');

var UserSchema = new mongoose.Schema({

    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    saltHash: {
        type: String,
        required: true
    },
    profileImg: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    postsID: {
        type: [Number]
    }
});

/**
 * Hashing a password before saving it to the database
 */
UserSchema.pre('save', function (next) {
    let self = this;

    // Only hash the password if it has been modified (or is new)
    if (!self.isModified('passwordHash'))
        return next();

    // Generate derived key and override the cleartext password with the derived one
    let salt = genRandomString(16);
    let hashData = sha512(self.passwordHash, salt);
    self.saltHash = hashData.salt;
    self.passwordHash = hashData.passwordHash;
    next();

});

/**
 * Compare candidate password and password
 * @param loginPassword
 * @param callback
 */
UserSchema.methods.comparePassword = function (loginPassword, callback) {
    let self = this;

    if (loginPassword !== self.passwordHash)
        return callback(true, null);

    callback(null, true);
};

/**
 * Hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function sha512(password, salt){
    let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    let value = hash.digest('hex');

    return {
        salt: salt,
        passwordHash: value
    };
}

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function genRandomString(length){
    return crypto.randomBytes(Math.ceil(length/2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0,length);   /** return required number of characters */
}

module.exports = mongoose.model('User', UserSchema);