//Basic Node Modules to Run the Proper server.
var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var mongoose = require('mongoose');
var path = require('path');
var morgan = require('morgan');

//Creating express object
var app = express();
var http = require('http').Server(app);

//Cross-Platform Support.
app.use(require('cors')());

//Passing Request to Process Json.
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Static Directory for WebPages
app.use(express.static(path.join(__dirname, './public/views/')));

//connecting to my mongo database, config is a module from config.js file
mongoose.Promise = global.Promise;
mongoose.connect(config.database, function (err, db) {
    if (err) {
        console.log(err);
        //process.exit(1);
    } else {
        console.log('Mongoose Connected to : ' + config.database);
    }
});

//Making socket.io to listen at http port (means 3000) and Routing to a File
var io = require('socket.io').listen(http);
io.set('origins', '*:*');
require("./app/routes/uio.js")(io);

//Invalid Request will tends to 404 Error
app.get('*', function (req, res) {
    res.status(404).end("404 Error");
});

process.env.DEBUG = "* node server.js";

//Establishing Server at Configured IP and Port
http.listen(config.server_port, function (err) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        console.log("Listening http on : " + config.server_port);
    }
});