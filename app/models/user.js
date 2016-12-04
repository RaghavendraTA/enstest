var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//Defining User Schema
var UserSchema = new Schema({

    username: String,
	password: { type: String, select: false },
    mobile_num: { type: Number, index: { unique: true }},
    email_id: { type: String, index: { unique: true }},
    profile: String,
    birth_year: Date,
    blog_website: String,
    LinkedIn : String,
    Twitter : String,
    Facebook : String,
    status: String

},{collection:'users'});

module.exports = mongoose.model('User', UserSchema);
