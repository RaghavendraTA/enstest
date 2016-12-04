function setData(content, id) {
    var lid = id + "L";
    if (content)
        $("#" + id).attr("href", content);
    else
        $("#" + lid).hide();
}

(function ($) {

    var user_id = $.cookie('user');
    if (user_id == undefined || user_id == null)
        window.location = "./index.html";

    $("#logout").click(function () {
        $.removeCookie("user");
        window.location = "./index.html";
    });

    var socket = io(host + '/usoc');

    socket.emit("getUser", user_id);
    socket.on("getUser", function (data) {
        var u = data.user;
        
        $("#avatar").attr('src', u.profile);
        $("#username").html(u.username);
        $("#status").html(u.status);

        //Social Networks
        setData(u.Facebook, "facebook");
        setData(u.Twitter, "twitter");
        setData(u.LinkedIn, "LinkedIn");
        setData(u.blog_website, "Editor");
    });

})(jQuery);