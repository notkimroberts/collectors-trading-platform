// https://stackoverflow.com/questions/1601455/how-to-check-file-input-size-with-jquery
// make sure image is less than 40KB
$("input[type='file']").on("change", function () {
    // if file size is greater than 40KB
    if(this.files[0].size > 40000) {
      alert("Please upload a jpeg that is less than 40KB");
      // remove image
      $(this).val('');
    }
   });