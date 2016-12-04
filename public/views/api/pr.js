function setMyData(content, id) {
    if (content)
        document.getElementById(id).value = content;
}

function getData(id) {
    return document.getElementById(id).value;
}

(function ($) {

    var user_id = $.cookie('user');
    if (user_id == undefined || user_id == null)
        window.location = "./index.html";

    var socket = io(host + '/usoc');

    socket.emit("getUser", user_id);
    socket.on("getUser", function (data) {

        var u = data.user;

        //Social Networks
        setMyData(u.username, "nameT")
        setMyData(u.status, "statusT");
        setMyData(u.Facebook, "facebookT");
        setMyData(u.Twitter, "twitterT");
        setMyData(u.LinkedIn, "linkedinT");
        setMyData(u.blog_website, "blogT");
    });

    $("#updateBtn").click(function () {
        var myComponent = ["nameT", "statusT", "facebookT", "twitterT", "linkedinT", "blogT"];
        for (var i = 2; i < myComponent.length; ++i) {
            if(!(getData(myComponent[i]).match("https://"))){
                alert("URL must contain 'https://', please provide the necessary info!");
                return;
            }
        }
        var output = {};
        for (var i = 0; i < myComponent.length; ++i) {
            item = myComponent[i];
            output[item] = getData(item);
        }
        output._id = user_id;
        socket.emit("updateUser", output);
    });

    socket.on("updateUser", function (data) {
        alert(data.message);
        window.location.reload();
    });

    $("#changePic").click(function () {
        var x = document.getElementById("profile_pic");
        if ('files' in x) {
            if (x.files.length == 0) {} else {
                var file = x.files[0];
                var stream = ss.createStream();
                ss(socket).emit('file', stream, {
                    size: file.size
                });
                ss.createBlobReadStream(file).pipe(stream);
            }
        } else
            alert("Please select a Image to upload");
    });

    socket.on("uploadedImage", function (data) {
        var output = {
            _id : user_id,
            img: data
        };
        socket.emit("updateUser", output);
    });

})(jQuery);

function imageSelected() {
    var x = document.getElementById("profile_pic");
    if ('files' in x) {
        if (x.files.length == 0) {
            txt = "Select one or more files.";
        } else {
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#avatar").attr("src", e.target.result);
            }
            reader.readAsDataURL(x.files[0]);
        }
    }
}