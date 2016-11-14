var host = "http://localhost:8080";

function loading(flag) {

}

function authenticate() {

    loading(true);

    var token = $.cookie("token");
    var userId = $.cookie("userId");
    var name = $.cookie("userName");

    if (!(userId && token && name)) {
        window.location = host;
    }

    $.post(host + "/validate", {
        userId: userId,
        token: token
    }).done(function(result) {
        if (result.success == false) {
            window.location = host;
        }
        loading(false);
    }).fail(function() {
        alert("Server Error: Reload the page!");
        window.location = host;
        loading(false);
    });
}
