var validImage = false;
var url = null;

var allQuestions = null;

var socket = io(host + '/usoc');

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

    $('#AskNow').click(function () {
        var question = $('#question').val();
        if (validImage && question.length > 0) {
            var data = {
                user_id: user_id,
                headerImage: url,
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

    socket.on("addQuestion", function (data) {
        alert(data.message);
        if (data.success)
            location.reload();
    });

    socket.emit("getQuestions");
    socket.on("getQuestions", function (allQ) {
        allQuestions = allQ.allQ;
        allQ.allQ.forEach(function (q) {
            createArticle(q._id, q.que, q.headerImage, q.ans.length);
        });
    });
    
    socket.on("StoreAns", function(data){
        alert(data.message);
        if(data.success)
            location.reload();
    });

})(jQuery);

function createArticle(_id, h4, imgPath, ansCount) {

    var x = document.createElement("ARTICLE");
    x.onclick = function () {
        doit(_id);
    };
    x.style.height = "230px";

    var img = document.createElement("IMG");
    img.src = imgPath;
    img.style.height = "200px";
    img.style.width = "200px";

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
    var data = null;
    for (var i = 0; i < allQuestions.length; ++i) {
        if (id == allQuestions[i]._id) {
            data = allQuestions[i];
            break;
        }
    }
    //Fetch the data in a div

    $("#two").show();
    $("#three").hide();

    var x = document.createElement("ARTICLE");

    var h = document.createElement("H3");
    h.innerHTML = "<br/>" + data.que;

    var para = document.createElement("P");

    //generate answers
    var ans = data.ans;
    for (var i = 0; i < ans.length; ++i) {
        var b = document.createElement("H4");
        b.innerHTML = "Answer by " + ans[i].username;
        var a = document.createElement("SPAN");
        a.innerHTML = ans[i].content + "<br/><br/>";
        para.appendChild(b);
        para.appendChild(a);
    }

    var div = document.createElement("DIV");
    div.className = "inner";

    var image = document.createElement("IMG");
    image.src = data.headerImage;
    image.style.width = "560px";
    image.style.height = "auto";
    div.appendChild(image);

    div.appendChild(h);
    
    var line = document.createElement("HR");
    
    div.appendChild(line);
    div.appendChild(para);

    x.appendChild(div);

    var list = document.getElementById('contentDisplay');
    list.innerHTML = "";

    var closer = document.createElement('BUTTON');
    closer.style.float = "right";
    closer.style.width = "30px";
    closer.style.height = "30px";
    closer.onclick = function () {
        hideContent();
    }
    closer.innerHTML = "X";

    list.appendChild(closer);


    var art = document.createElement("ARTICLE");
    var ar = document.createElement("TEXTAREA");
    ar.style.width = "100%";
    ar.placeholder = "Your Answer!";
    art.appendChild(ar);
    
    //<input type="submit" class="special" value="Ask Now!" style="height:60px" id="AskNow"/>
    
    var btn = document.createElement("INPUT");
    btn.type = "submit";
    btn.className = "special";
    btn.value="Answer Now!"
    btn.style.marginTop = "15px";
    btn.style.height = "60px";
    
    btn.onclick = function () {
        answerIt(id, ar);
    }

    list.appendChild(x);
    list.appendChild(art);
    list.appendChild(btn);
}

function hideContent() {
    $("#two").hide();
    $('#contentDisplay').html("");
    $("#three").show();
}

function answerIt(id, ar) {
    //Store the answers
    var data = {
        qid: id,
        username: $.cookie("username"),
        content: ar.value
    }
    socket.emit("StoreAns", data);
}