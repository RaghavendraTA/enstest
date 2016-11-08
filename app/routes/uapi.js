var config = require('../../config');
var edc = require('../middleware/edc');

module.exports = function(app, express, io) {

    //express router to handle API's
    var api = express.Router();

    //Login router, post the json here
    api.post('/login', function(req, res) {

        try {

            //Compare the user input password and the database encrypted password
            edc.comparePassword("1234", "$2a$08$2v6IMTO9pQHBuXPXWS2wqeiAPigXS7sJ5GFjZCU/HjOisOsBmKgvO");

            //Create Input json for token generation
            var input = {
                userId: "1234",
                name: "raghu"
            };
            //Calling the function to generate encrypted token
            var token = edc.generateToken(input);

            //Sending the response back
            res.json({
                "success": true,
                "token": token
            });
        } catch (ex) {
            res.json({
                "success": false,
                "message": "Failed to Authenticate: " + ex.toString()
            });
        }
    });

    //Signup code can be written Here
    api.post('/signup', function(req, res) {
        res.end("Signup code can be implemented here");
    });

    //Authentication check
    api.use('/:userId', function(req, res, next) {

        var token = req.headers['x-access-token'] || req.headers['form-data'] || req.headers.token;

        //Creating input json for varification
        var input = {
            userId: req.params.userId,
            name: "raghu"
        };

        //Comparing the token synchronously
        edc.compareToken(input, token, res, next);
    });

    api.post('/:userId', function(req, res) {
        res.end("Working well");
    });

    /*
    //Upload Image
    var storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, dest)
        },
        filename: function (req, file, cb) {
            var _id = randtoken.generate(3);
            var str = file.mimetype.toString().split("/");
            cb(null, _id + Date.now() + "." + str[1]);
        }
    });
    var upload = multer({
        storage: storage
    }).single('img');

    api.post('/:userId/image', upload, function (req, res) {

        if (req.file != undefined) {
            var file = "/" + req.file.filename;
            var result = {
                path: file,
                success: true
            };
        } else {
            var result = {
                success: false,
                message: "Failed to upload the Image"
            };
        }
        res.json(result);
    });
    */

    return api;
};
