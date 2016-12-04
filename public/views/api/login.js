function setCookie(key, value) {
    var expires = new Date();
    expires.setTime(expires.getTime() + (7 * 24 * 60 * 60 * 1000));
    document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

function getCookie(key) {
    var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
    return keyValue ? keyValue[2] : null;
}

$(function () {

    var socket = io(host + '/usoc');
    var online = false;

    socket.on('connect', function () {
        online = true;
        console.log("Connected");
    });

    $('#myButton').click(function () {
        if (online == false)
            alert("Check Internet connection!");
        else {
            var uname = $('#uname').val();
            var pwd = $('#pwd').val();
            if (validate(uname, pwd))
                socket.emit('login', {
                    username: uname,
                    password: pwd
                });
        }
    });
    socket.on('login', function (data) {
        //store data to cookie
        $.cookie("user", data.user_id);
        $.cookie("username", data.username);
        alert(data.message);
        if (data.success) window.location = './home.html';
    });
    
    socket.on('disconnect',function() {
        online = false;
    });

});


function validate(uname, pwd) {
    if (uname == "" || pwd == "") {
        alert("invalid Username or password");
        return false;
    } else {
        return true;
    }
}