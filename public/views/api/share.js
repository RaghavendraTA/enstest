function testImage(url, response) {
    var img = new Image();
    img.onerror = img.onabort = function () {
        response(false);
    };
    img.onload = function () {
        response(true);
    };
    img.src = url;
}

function processYoutube(url) {
    url = (url) ? url.split('?') : null;
    url = (url && url[1]) ? url[1].split('&') : null;
    url = (url && url[0]) ? url[0].split('=') : null;
    url = (url && url[1]) ? url[1] : null;
    if (url)
        return "https://img.youtube.com/vi/" + url + "/0.jpg";
    return false;
}

(function ($) {

    var user_id = $.cookie("user");
    if (!user_id)
        window.location = './login.html';

    var socket = io(host + '/usoc');

    socket.on('connect', function () {
        console.log("Connected");
    });

    $('#publish_content').click(function () {

        var headerImage = $('#imgYurl').val();
        var headerTitle = $('#headerTitle').val();
        var content = $('#editor').html();
        var checkImage = $('#Image').is(":checked");

        if (checkImage) {
            testImage(headerImage, function (response) {
                if (!response) {
                    alert("Invalid Image");
                } else {
                    var data = {
                        user_id: user_id,
                        headerImage: headerImage,
                        headerTitle: headerTitle,
                        content: content
                    }
                    socket.emit("addContent", data);
                }
            });
        } else {
            headerImage = processYoutube(headerImage);
            if (headerImage) {
                var data = {
                    user_id: user_id,
                    headerImage: headerImage,
                    headerTitle: headerTitle,
                    content: content
                }
                socket.emit("addContent", data);
            }
        }
    });

    socket.on("addContent", function (data) {
        alert(data.message);
        if (data.success)
            window.location = "./home.html";
    });
})(jQuery);