var LoadedContents = null;

(function ($) {

    var user_id = $.cookie('user');
    if (user_id == undefined || user_id == null)
        window.location = "./index.html";

    var socket = io(host + '/usoc');

    socket.emit("getContents", user_id);
    socket.on("getContents", function (data) {
        LoadedContents = data.allContents;
        data.allContents.forEach(function (d) {
            createArticle(d._id, d.headerTitle, d.headerImage);
        });
    });

})(jQuery);

function createArticle(_id, h4, imgPath) {

    var x = document.createElement("ARTICLE");
    x.onclick = function () {
        doit(_id);
    };

    var h = document.createElement("H4");
    h.innerHTML = h4;

    var div = document.createElement("DIV");
    div.className = "inner";
    div.appendChild(h);

    var hyper = document.createElement("A");
    hyper.href = "#";
    hyper.className = "image";

    var image = document.createElement("IMG");
    image.src = imgPath;
    image.style.width = "250px";
    image.style.height = "200px";

    hyper.appendChild(image);

    x.appendChild(hyper);
    x.appendChild(div);

    document.getElementById("contentList").appendChild(x);
}

function process(link) {
    var c = link.split('/');
    return c[c.length - 2];
}

function doit(id) {
    //Start Fetching the data
    
    var data = null;
    LoadedContents.forEach(function (d) {
        if(d._id == id) {
            data = d;
        }
    });

    $("#two").show();
    $("#three").hide();

    var x = document.createElement("ARTICLE");

    var h = document.createElement("H4");
    h.innerHTML = "<br/>" + data.headerTitle;

    var para = document.createElement("P");
    para.innerHTML = data.content;
    
    var div = document.createElement("DIV");
    div.className = "inner";

    if (data.headerImage.match('youtube')) {
        var frame = document.createElement('iframe');
        frame.src = "https://www.youtube.com/embed/" + process(data.headerImage);
        frame.style.width = "560px";
        frame.style.height = "315px";
        frame.setAttribute('allowFullScreen', '');
        div.appendChild(frame);
    } else {
        var image = document.createElement("IMG");
        image.src = data.headerImage;
        image.style.width = "560px";
        image.style.height = "auto";
        div.appendChild(image);
    }
    
    div.appendChild(h);
    div.appendChild(para);

    x.appendChild(div);

    var list = document.getElementById('contentDisplay');
    list.innerHTML = "";
    
    var closer = document.createElement('BUTTON');
    closer.className = "closer";
    closer.onclick = function() { hideContent(); }
    closer.innerHTML = "X";
    
    list.appendChild(closer);
    list.appendChild(x);
}

function hideContent() {
    $("#two").hide();
    document.getElementById('contentDisplay').innerHTML = "";
    $("#three").show();
}