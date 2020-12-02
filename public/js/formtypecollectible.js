// https://stackoverflow.com/questions/18353574/how-to-show-hide-div-on-selection-of-any-drop-down-value
//script to allow to show selected options
$(document).ready(function(){
    $("select").change(function(){
        $( "select option:selected").each(function(){
            if($(this).attr("value")=="0"){
                $(".box").hide();
                $(".none").show();
            }
            if($(this).attr("value")=="1"){
                $(".box").hide();
                $(".lego").show();
            }
            if($(this).attr("value")=="2"){
                $(".box").hide();
                $(".funko").show();
            }
            if($(this).attr("value")=="3"){
                $(".box").hide();
                $(".pusheen").show();
            }
            if($(this).attr("value")=="4"){
                $(".box").hide();
                $(".pokemon").show();
            }
            if($(this).attr("value")=="5"){
                $(".box").hide();
                $(".hot_wheels").show();
            }
        });
    }).change();
});