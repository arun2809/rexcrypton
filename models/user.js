var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new mongoose.Schema({
    username: String,
    firstName: String,
    lastName: String,
    avatar: {type: String, default: "https://res.cloudinary.com/rexjosph/image/upload/v1560600172/gender-neutral-user--v1.png"},
    earnings: 0,
    email: String,
    password: String
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);