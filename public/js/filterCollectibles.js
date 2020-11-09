
function filterCollectiblesByType() {
    // get the id of the selected location from the filter dropdown
        var type_id = document.getElementById('type_filter').value
   
    // construct the URL and redirect to it
    window.location = '/collectible/filter/' + parseInt(type_id)
}