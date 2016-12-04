//Test

var data = {
    //"domain": "http://127.0.0.1:8080",
    "domain": "https://enstest.herokuapp.com:8080",
    "database": "mongodb://raghu:raghu123@ds011913.mlab.com:11913/mcc",
    //"database": "mongodb://localhost:27017/ens",
    "server_port": process.env.PORT || 8080
};

module.exports = data;
