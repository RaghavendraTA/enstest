$(function () {

    document.getElementById('profile_pic').addEventListener('change', imageSelected, false);

    var socket = io(host + '/usoc');

    socket.on('connect', function () {
        console.log("Connected");
    });

    $('#myButton').click(function () {
        validate();
        var x = document.getElementById("profile_pic");
        if ('files' in x) {
            if (x.files.length == 0) {
                alert("Select Profile Image.");
            } else {
                var file = x.files[0];
                if (file.size > 250000)
                    alert("Image is too big");
                else {
                    var stream = ss.createStream();
                    ss(socket).emit('file', stream, {
                        size: file.size
                    });
                    ss.createBlobReadStream(file).pipe(stream);
                }
            }
        } else {
            alert("Please upload a profile pic!");
        }
    });

    socket.on('signup', function (data) {
        //store data to cookie
        $.cookie('user', data);
        alert(data.message);
        if (data.success) window.location = './login.html';
    });

    socket.on('uploadedImage', function (data) {
        var formData = fetchForm(document.getElementById('loginForm'));
        formData[6].value = data;
        socket.emit('signup', formData);
    });
});


function validate() {
    if ($('#uname').val() == "" || $('#pwd').val() == "") {
        alert("invalid Username or password");
        return false;
    } else if($('#pwd').val() != $('#cpwd').val()) {
        alert("Primary and Secondary password are not equal");
        return false;
    } else {
        var reg = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/gi;
        var mb = $('#mobile_num').val();
        if(!(reg.test(mb))) {
            alert("Invalid Mobile");
            return false;
        }
        
        reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        var email = $('#email_id').val();
        if(!reg.test(email)) {
            alert("Invalid Email");
            return false;
        }
    }
    return true;
}

function imageSelected() {
    var x = document.getElementById("profile_pic");
    if ('files' in x) {
        if (x.files.length == 0) {
            txt = "Select one or more files.";
        } else {
            var file = x.files[0];
            if (file.size > 250000)
                alert("Image is too big");
            else {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $("#dp").attr("src", e.target.result);
                    $('#dp').css({
                        "display": "block"
                    });
                }
                reader.readAsDataURL(x.files[0]);
            }
        }
    }
}