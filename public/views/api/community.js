var validImage = false;
var url = null;

function getUrl() {

    url = prompt("Please paste a Image Url or Press OK to use Default Image", "http://marlborofishandgame.com/images/6/6c/Question-mark.png");

    if (url) {
        var con = "border-radius: 35px; width:60px; height: 60px; background: url('" + url + "'); background-size: contain;";
        $("#backDiv").attr("style", con);
        validImage = true;
    }
}

(function ($) {
    
    var user_id = $.cookie('user');
    if (user_id == undefined || user_id == null)
        window.location = "./index.html";

    var socket = io(host + '/usoc');

    $('#AskNow').click(function () {
        var question = $('#question').val();
        if (validImage && question.length > 0) {
            var data = {
                user_id: user_id,
                headerImage : url,
                que: question
            }
            socket.emit("addQuestion", data);
        } else {
            if (!validImage)
                alert("Please select a Header Image");
            else
                alert("Question should not be empty");
        }
    });
    
    socket.on("addQuestion", function(data){
        alert(data.message);
        if(data.success)
            location.reload();
    });
    
    socket.emit("getQuestions");
    socket.on("getQuestions", function(allQ){
        allQ.allQ.forEach(function(q){
            createArticle(q._id, q.que, q.headerImage, q.ans.length);
        });
    });

})(jQuery);

function createArticle(_id, h4, imgPath, ansCount) {

    var x = document.createElement("ARTICLE");
    x.onclick = function () {
        doit(_id);
    };
    x.style.height = "200px";
    
    var img = document.createElement("IMG");
    img.src = imgPath;
    img.style.width = "200px";
    img.style.height = "auto";
    
    var A = document.createElement("A");
    A.className = "image";
    A.appendChild(img);

    var h = document.createElement("H4");
    h.innerHTML = h4;
    
    var p = document.createElement("P");
    p.innerHTML = ansCount + " Answers";

    var div = document.createElement("DIV");
    div.className = "inner";
    div.appendChild(h);
    div.appendChild(p);


    x.appendChild(A);
    x.appendChild(div);

    document.getElementById("ContentList").appendChild(x);
}

function doit(id) {
    alert(id);
}