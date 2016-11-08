var fs = require('fs');
var jsonfile = require('jsonfile');
var alphbets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z','1','2','3','4','5','6','7','8','9','0'];

setInterval(function() {
    var str = "";
    for (var i = 0; i < 20; i++) {
        var pos = (parseInt(Math.random() * 100) % (62));
        str += alphbets[pos];
    }
    var obj = {
        "key": str
    };
    console.log(str);
    jsonfile.writeFile("./token.json", obj, function(err) {
        if (err) console.error(err);
    });
}, 30000);

function getToken() {
    return jsonfile.readFileSync("./token.json");
}

var data = {
    "domain": "http://127.0.0.1:8080",
    //"domain": "http://educart.herokuapp.com:8080",
    //"database": "mongodb://raghu:raghu123@ds011913.mlab.com:11913/mcc",
    "database": "mongodb://localhost:27017/educart",
    "server_port": 8080,
    "server_ip_address": "127.0.0.1",
    "getToken": getToken
};

module.exports = data;
