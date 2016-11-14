var config = require('../../config');
var bcrypt = require('bcrypt-nodejs');

// Generate token which accepts the input in json
function generateToken(input) {
    var str = '';
    for (key in input) {
        str += input[key];
    }

    // Secret key which will generated reandomly as specified in config files
    str += (config.getToken()).key;

    // Using bcrypt library to generate encrypted string
    return bcrypt.hashSync(str, bcrypt.genSaltSync(8));
}

function compareToken(input, token, res, next, flag) {
    try {
        // Comparing the given token with database token
        var str = '';
        for (key in input) {
            str += input[key];
        }
        str += (config.getToken()).key;
        if (bcrypt.compareSync(str, token)) {
            if (flag == undefined || flag == NULL)
                next();
            else
                res.json({
                    'success': true,
                    'message': 'Continue'
                });
        } else {
            throw 'Token expired, please Login';
        }
    } catch (ex) {
        res.json({
            'success': false,
            'message': 'Unidentified Request, ' + ex.toString()
        });
    }
};

function generatePassword(input) {
    return bcrypt.hashSync(input, bcrypt.genSaltSync(8));
}

function comparePassword(input, passwd) {
    try {
        // Comparing the given token with database token
        if (bcrypt.compareSync(input, passwd)) {
            return true;
        } else {
            throw 'Invalid Password';
        }
    } catch (ex) {
        throw ex.toString();
    }
}

module.exports = {
    generateToken: generateToken,
    compareToken: compareToken,

    generatePassword: generatePassword,
    comparePassword: comparePassword
};
