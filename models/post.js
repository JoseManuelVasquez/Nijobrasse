var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({

    title: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true
    },
    publishDate: {
        type: Date
    },
    profileImg: {
        type: String,
        trim: true
    },
    comments: [{
        text: String,
        commentedBy: {
            type: ObjectId,
            ref: 'User'
        }
    }],
    managedBy: {
        type: ObjectId,
        ref: 'User'
    }
});

/**
 * Set current date before saving post
 */
PostSchema.pre('save', function (next) {
    let self = this;

    self.publishDate = new Date();
    next();
});

module.exports = mongoose.model('Post', PostSchema);