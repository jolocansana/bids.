$(document).ready(function() {
    // console.log('hello');
    // loadProducts();
    $('#changePasswordSubmit').on('click', function() {

        $('#pass-id-group').hide();
        $('#pass-id-text').html('');

        var password = $('#new-password').val();
        var confirm_password = $('#confirm-password').val();

        body = { password, confirm_password };

        $.ajax({
            method: 'post',
            url: '/changePassword',
            data: body,
            success: function() {
                Swal.fire(
                    'Success!',
                    'Password updated',
                    'success'
                ).then(() => {
                    $('#passwordUpdateModal').modal('hide');
                    $('#new-password').val('');
                    $('#confirm-password').val('');
                })
            },
            error: function(err) {
                console.log(err);
                if(err.status == 400) {
                    $('#pass-id-text').html(err.responseJSON);
                    $('#pass-id-group').show();
                }
            }
        })
        
    });

});

