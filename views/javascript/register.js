$(document).ready(function() {
    function isFilled() {
        var firstname = validator.trim($("#firstName").val());
        var lastname = validator.trim($("#lastName").val());
        var email = validator.trim($("#email").val());
        var username = validator.trim($("#username").val());
        var phonenum = validator.trim($("#phonenum").val());
        var password = validator.trim($("#password").val());
        var birthday = validator.trim($("#birthday").val());
        var address = validator.trim($("#address").val());
        var city = validator.trim($("#city").val());

        var firstnameEmpty = validator.isEmpty(firstname);
        var lastnameEmpty = validator.isEmpty(lastname);
        var emailEmpty = validator.isEmpty(email);
        var usernameEmpty = validator.isEmpty(username);
        var phonenumEmpty = validator.isEmpty(phonenum);
        var passwordEmpty = validator.isEmpty(password);
        var birthdayEmpty = validator.isEmpty(birthday);
        var addressEmpty = validator.isEmpty(address);
        var cityEmpty = validator.isEmpty(city);

        return !emailEmpty && !passwordEmpty && !firstnameEmpty && !lastnameEmpty 
        && !usernameEmpty && !phonenumEmpty && !birthdayEmpty && !addressEmpty && !cityEmpty;
    }

    function isValidEmail(field, callback) {
        var email = validator.trim($('#email').val());
        var isValidEmail = validator.isEmail(email);
     
        if(isValidEmail) {
            $.get('/getCheckEmail', {email: email}, function (result) {
                if(result.email != email && !validator.isEmpty(email)) {

                    if(field.is($('#email'))) {
                        $('#email').removeClass('is-invalid');
                        $('#email').addClass('is-valid');
                        console
                    }
                   return callback(true);
                   
                }
                else {
                    if(field.is($('#email'))) {
                        $('#email').removeClass('is-valid');
                        $('#email').addClass('is-invalid');

                    }

                    return callback(false);
                }
            });
        }
        else {
            if(field.is($('#email'))) {

               if(validator.isEmpty(email)) {
                    if(field.is($('#email'))) {
                        $('#email').removeClass('is-valid');
                        $('#email').addClass('is-invalid');
                    }
                }
                else {
                    $('#email').removeClass('is-valid');
                    $('#email').addClass('is-invalid');
                }
            }
            return callback(false);
        }
    }

    function isValidPassword(field) {
        var password = validator.trim($('#password').val());
        var confirmpassword = validator.trim($('#cpassword').val());
        if(password == confirmpassword && (!validator.isEmpty(password) && !validator.isEmpty(confirmpassword))){ // cpass matches pass
            if(field.is($('#cpassword'))) {
                $('#password').removeClass('is-invalid');
                $('#password').addClass('is-valid');
                $('#cpassword').removeClass('is-invalid');
                $('#cpassword').addClass('is-valid');
                $("#submitbtn").prop('disabled', false);
            }
            return true;
        }
        else{
            if(field.is($('#cpassword'))) {
                $('#password').removeClass('is-valid');
                $('#password').addClass('is-invalid');
                $('#cpassword').removeClass('is-valid');
                $('#cpassword').addClass('is-invalid');
                $("#submitbtn").prop('disabled', true);
            }
            return false;
        }
    }
    function validateField(field){
        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);

        if(!empty){
            field.removeClass('is-invalid');
            field.addClass('is-valid');
            var pass = isValidPassword(field);
            isValidEmail(field, function(validEmail) {
                if(isFilled() && pass && validEmail){
                    $("#submitbtn").prop('disabled', false);
                }
                else {
                    $("#submitbtn").prop('disabled', true);
                }
            })
        }
        else{
            field.removeClass('is-valid');
            field.addClass('is-invalid');
        }
    }

    $("#firstName").keyup(function(){
        validateField($('#firstname'));
    })

    $("#lastName").keyup(function(){
        validateField($('#lastname'))
    })

    $("#email").keyup(function(){
        validateField($('#email'));
    })

    $("#username").keyup(function(){
        validateField($('#username'));
    })

    $("#phonenum").keyup(function(){
        validateField($('#phonenum'));
    })

    $("#password").keyup(function(){
        validateField($('#password'))
    })

    $("#cpassword").keyup(function(){
        validateField($('#cpassword'))
    })

    $("#address").keyup(function(){
        validateField($('#address'));
    })

    $("#city").keyup(function(){
        validateField($('#city'));
    })
});



