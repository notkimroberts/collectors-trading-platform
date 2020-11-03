// https://stackoverflow.com/questions/18353574/how-to-show-hide-div-on-selection-of-any-drop-down-value
$(document).ready(function(){
    $("select").change(function(){
        $( "select option:selected").each(function(){
            if($(this).attr("value")=="lego"){
                $(".box").hide();
                $(".lego").show();
            }
            if($(this).attr("value")=="funko"){
                $(".box").hide();
                $(".funko").show();
            }
            if($(this).attr("value")=="hot_wheel"){
                $(".box").hide();
                $(".hot_wheel").show();
            }
        });
    }).change();
});