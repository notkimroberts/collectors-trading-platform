/* https://www.tutorialrepublic.com/faq/show-hide-divs-based-on-dropdown-selection-in-jquery.php */
console.log('hi')
$(document).ready(() => {
    $("select").change(() => {
        $(this).find("option:selected").each(() => {
            const optionValue = $(this).attr("value");
            if (optionValue) {
                $(".box").not("." + optionValue).hide();
                $("." + optionValue).show();
            } else {
                $(".box").hide();
            }
        });
    }).change();
});