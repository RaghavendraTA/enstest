//Basic Node Modules to Run the Proper server.
var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
var path = require('path');

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

//Logging the Request to the Console
app.use(morgan('dev'));

//Static Directory for WebPages
app.use(express.static(path.join(__dirname, './public/views/')));

//connecting to my mongo database, config is a module from config.js file
mongoose.connect(config.database, function (err, db) {
    if (err) {
        console.log(err);
        //process.exit(1);
    } else {
        console.log('Mongoose Connected to : ' + config.database);
    }
});

//Creating user express router
var uapi = require('./app/routes/uapi')(app, express, io);
app.use('/uapi', uapi);

//Making socket.io to listen at http port (means 3000) and Routing to a File
var io = require('socket.io').listen(http);
io.set('origins', '*:*');
require("./app/routes/uio.js")(io);

//Invalid Request will tends to 404 Error
app.get('*', function (req, res) {
    res.status(404).end("404 Error");
});

//Establishing Server at Configured IP and Port
http.listen(config.server_port, function (err) {
    if (err) {
        console.log(err);
        process.exit(1);
    } else {
        console.log("Listening http on : " + config.server_port);
    }
});
