function fetchForm(form) {
    var it = form.childNodes.length;
    var formData = [];
    for (var i = 0; i < it; ++i) {
        if (form.childNodes[i].value != undefined) {
            var obj = {
                id: form.childNodes[i].id,
                value: form.childNodes[i].value
            }
            formData.push(obj);
        }
    }
    return formData;
}