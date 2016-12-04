var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Defining User Schema
var QuestionsSchema = new Schema({

    user_id: String,
    headerImage : String,
    que: String,
    ans: [{username: String, content: String}],
    date_added: Date

},{ collection:'Questions' });

module.exports = mongoose.model('Questions', QuestionsSchema);
