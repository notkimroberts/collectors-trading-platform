
function filterCollectiblesByType() {
    console.log("in filtercollectiblesbytype")
    // get the id of the selected location from the filter dropdown
        var type_id = document.getElementById('type_filter').value
    // construct the URL and redirect to it
    window.location = '/collectible/filter/' + parseInt(type_id)
}


/* document.getElementsByClassName("button")[0].addEventListener("click", function(event) {
    console.log("hi")
    var type_id = document.getElementById("type_filter").value;
    event.target.setAttribute("href", "/collectible/filter/" + type_id);
}); */