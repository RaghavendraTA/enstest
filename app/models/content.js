var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');

//Defining User Schema
var ContentSchema = new Schema({

    user_id: String,
    headerImage : String,
    headerTitle: String,
    content: String,
    date_added: Date

},{ collection:'Contents' });

module.exports = mongoose.model('Content', ContentSchema);
