var config = require('../../config');
var Users = require('../models/user');

module.exports = function(app, express, io) {

    //express router to handle API's
    var api = express.Router();

    api.get('/:userId', function(req, res) {
        try {

            Users.findOne({
                username: req.body.username
            }, function(err, u) {

                if (err || u == undefined || u == null) throw "Failed to retrive data";
                else
                    res.json({
                        "success": true,
                        message: "Successful login",
                        user: u
                    });
            });

        } catch (ex) {
            res.json({
                "success": false,
                "message": "Failed to Authenticate: " + ex.toString()
            });
        }
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
