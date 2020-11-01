/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
/*
function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
  }
  
  function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }
  */

  /* https://www.tutorialrepublic.com/faq/show-hide-divs-based-on-dropdown-selection-in-jquery.php */
 $(document).ready(function(){
    $("select").change(function(){
        $(this).find("option:selected").each(function(){
            var optionValue = $(this).attr("value");
            if(optionValue){
                $(".box").not("." + optionValue).hide();
                $("." + optionValue).show();
            } else{
                $(".box").hide();
            }
        });
    }).change();
});


/*   $(document).ready(function(){
    $('#type').on('change', function() {
      if ( this.value == '0')
      {
        $("#lego").show();
      }
      else if ( this.value == '1')
      {
        $("#funko").show();
      }

      else if ( this.value == '2')
      {
        $("#hot_wheel").show();
      }
     
      else
      {
        $(".form-example.option-type").hide();
      }
    });
}); */