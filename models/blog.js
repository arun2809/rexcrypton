var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Schema
var blogSchema = new Schema({
    title: {type: String, required: true},
    image: {type: String, required: true},
    content: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ],
    created: {type: Date, default: Date.now}
})

module.exports = mongoose.model('Blog', blogSchema);