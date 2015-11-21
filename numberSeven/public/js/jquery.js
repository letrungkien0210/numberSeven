var disable_btn_add = function() {
    
    $("#btn-add").click(function() {
        if($("#pac-input").val() !== '')
        {
            click();
        }
        else
        {
            alert("Bạn chưa thêm địa điểm kìa :p");
        }
    });
};

var dim_screen = function() {
    $("#btn-finish").click(function() {
        if(markers.length >= 2)
        {
            $("#form").removeClass("hide");
            $("#form").addClass("display");
        }   
    });
};

var submit_cancel = function() {
    $("#form").addClass("hide");
    $("#btn-cancel").click(function() {
        $("#form").removeClass("display");
        $("#form").addClass("hide");
    });
    
    $("#btn-submit").click(function() {
        var check = 'no';
        if($("input[type='radio'].mdl-radio__button").is(':checked')) {
            var card_type = $("input[type='radio'].mdl-radio__button:checked").val();
            if(card_type==='1')
            {
                check = 'yes';
            }
        }
        
        var infomation = {
            name:        $("#name").val(),
            startdate:   $("#startdate").val(),
            finishdate:  $("#finishdate").val(),
            cost:        $("#cost").val(),
            transport:   $("#transport").val(),
            number_member: $("#number_member").val(),
            check:      check,
            note:       $("#note").val()
            
        };
        $("#form").removeClass("display");
        $("#form").addClass("hide");
        console.log(infomation);
    });   
    
};

$(document).ready(disable_btn_add);
$(document).ready(dim_screen);
$(document).ready(submit_cancel);