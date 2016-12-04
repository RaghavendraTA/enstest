var config = require('../../config');
var Users = require('../models/user');
var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
var Contents = require('../models/content');
var Questions = require('../models/questions');

function exception(socket, link, message) {
    socket.emit(link, {
        success: false,
        message: message
    });
}

function updateUser(u, socket) {
    u.save(function (err) {
        if (err) exception(socket, 'updateUser', "Failed to store data: " + err.toString());
        else {
            socket.emit('updateUser', {
                "success": true,
                "message": "Successfully updated"
            });
        }
    });
}

module.exports = function (io) {

    var people = io.of('/usoc').on('connection', function (socket) {

        //Login Socket
        socket.on('login', function (data) {

            Users.findOne({
                username: data.username
            }).select("_id password username").exec(function (err, u) {

                if (err) exception(socket, 'login', "Failed to retrive data: " + err.toString());
                else if (!u) exception(socket, 'login', "Invalid username or Password");
                else {

                    //Compare the user input password and the database password
                    if (u.password != data.password) exception(socket, 'login', "Invalid Password");

                    else
                        socket.emit('login', {
                            "success": true,
                            message: "Successful login",
                            user_id: u._id
                        });
                }
            });
        });

        //Uploading profile image
        ss(socket).on('file', function (stream) {
            var n = (new Date()).getTime();
            var upath = path.join(__dirname, '../../public/views/uploads', (n + ".jpg"));
            stream.pipe(fs.createWriteStream(upath));
            upath = "./uploads/" + n + ".jpg";
            socket.emit("uploadedImage", upath);
        });

        //Signup Socket
        socket.on('signup', function (input) {

            var data = {};
            for (index in input) {
                var i = input[index].id;
                data[i] = input[index].value;
            }

            var us = new Users();
            us.username = data.uname;
            us.password = data.pwd;
            us.mobile_num = data.mobile_num;
            us.email_id = data.email_id;
            us.profile = data.profile_pic;
            us.birth_year = new Date(data.dob);

            us.blog_website = null;
            us.LinkedIn = null;
            us.Twitter = null;
            us.Facebook = null;
            us.status = "";

            Users.findOne({
                username: data.uname
            }).exec(function (err, u) {

                if (err || u) exception(socket, 'signup', "Failed: Account already exist");

                else
                    us.save(function (err) {
                        if (err) exception(socket, 'signup', "Server failed to store data");
                        else
                            socket.emit('signup', {
                                success: true,
                                message: "Successfully inserted"
                            });
                    });
            });
        });

        //getUser Socket
        socket.on('getUser', function (data) {

            Users.findById(data, function (err, u) {

                if (err) exception(socket, 'getUser', "Failed to retrive data: " + err.toString());
                else if (!u) exception(socket, 'getUser', "Invalid user infomration");
                else {
                    socket.emit('getUser', {
                        "success": true,
                        user: u
                    });
                }
            });

        });

        //Update user profile
        socket.on("updateUser", function (data) {

            Users.findById(data._id, function (err, u) {

                if (err) exception(socket, 'updateUser', "Failed to retrive data: " + err.toString());
                else if (!u) exception(socket, 'updateUser', "Invalid user infomration");
                else {

                    if (data.img) {

                        var upath = path.join(__dirname, '../../public/views/', u.profile);
                        fs.unlink(upath, function (err) {
                            u.profile = data.img;
                            updateUser(u, socket);
                        });

                    } else {

                        u.blog_website = data.blogT;
                        u.LinkedIn = data.linkedinT;
                        u.Twitter = data.twitterT;
                        u.Facebook = data.facebookT;
                        u.status = data.statusT;
                        u.username = data.nameT;
                        updateUser(u, socket);
                    }
                }
            });
        });

        socket.on("addContent", function (data) {

            var content = new Contents(data);
            content.date_added = new Date();

            content.save(function (err) {
                if (err) exception(socket, 'addContent', "Failed to store data: " + err.toString());
                else {
                    socket.emit("addContent", {
                        success: true,
                        message: "successfully stored"
                    });
                }
            });
        });

        socket.on("getContents", function (data) {
            Contents.find({}).sort({
                date_added: -1
            }).exec(function (err, allContents) {
                if (err) exception(socket, 'getContents', "Failed to retrive data: " + err.toString());
                else
                    socket.emit("getContents", {
                        success: true,
                        allContents: allContents
                    });
            });
        });

        socket.on("addQuestion", function (data) {
            var question = new Questions(data);
            question.ans = [];
            question.date_added = new Date();

            question.save(function (err) {
                if (err) exception(socket, 'addQuestion', "Failed to store data: " + err.toString());
                else {
                    socket.emit("addQuestion", {
                        success: true,
                        message: "successfully stored"
                    });
                }
            });
        });
        
        socket.on("getQuestions", function(){
            Questions.find({}).sort({
                date_added: -1
            }).exec(function (err, allQ) {
                if (err) exception(socket, 'getQuestions', "Failed to retrive data: " + err.toString());
                else {
                    socket.emit("getQuestions", {
                        success: true,
                        allQ: allQ
                    });
                }
            });
        });

        //End of Socket 'on' methods;

    });
};