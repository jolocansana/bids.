$(document).ready(function() {
    $(".btnreport").click(function() {
        var name = $(this).attr('name')
        var problem = $("#problem-"+name).val()
        var desc = $("#form-message-"+name).val()
        var flag = desc.localeCompare('');
        console.log(flag)
        if(flag==1) {
            $("#form-message-"+name).removeClass('is-invalid');
            $.post('/report', {name: name, problem:problem, desc:desc}, function(){
                $("#report-order-"+name).modal("hide");
                $("#reportDone").modal("toggle");
            })
        }
        else {
            $("#form-message-"+name).addClass('is-invalid');
        }
    });
})