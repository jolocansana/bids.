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

        var flag = true;


        if (password.length < 7) {
            flag = false;
        } else if (password.length > 50) {
            flag = false;
        } else if (password.search(/\d/) == -1) {
            flag = false;
        } else if (password.search(/[a-zA-Z]/) == -1) {
            flag = false;
        } else if (password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
            flag = false;
        }

        if(password == confirmpassword && (!validator.isEmpty(password) && !validator.isEmpty(confirmpassword)) && flag){ 
            if(field.is($('#cpassword')) || field.is($('#password'))) {
                $('#password').removeClass('is-invalid');
                $('#password').addClass('is-valid');
                $('#cpassword').removeClass('is-invalid');
                $('#cpassword').addClass('is-valid');
                $("#submitbtn").prop('disabled', false);
                $("#msg").text("");
            }
            return true;
        }
        else{
            if(field.is($('#cpassword')) || field.is($('#password'))) {
                $('#password').removeClass('is-valid');
                $('#password').addClass('is-invalid');
                $('#cpassword').removeClass('is-valid');
                $('#cpassword').addClass('is-invalid');
                $("#submitbtn").prop('disabled', true);
                $("#msg").text("Passwords should match and must contain a combination of alphabets and number. Minimum of 7 characters.");
            }
            return false;
        }
    }

    function isValidPhone(field, callback) {
        var phonenum = validator.trim($('#phonenum').val());

        if(phonenum.length != 11) {
            if(field.is($('#phonenum'))) {
                $('#phonenum').removeClass('is-valid');
                $('#phonenum').addClass('is-invalid');
            }
            return false;
        }
        else {
            if(field.is($('#phonenum'))) {
                $('#phonenum').removeClass('is-invalid');
                $('#phonenum').addClass('is-valid');
            }
            return true;
        }
    }

    function validateField(field){
        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);

        if(!empty){
            field.removeClass('is-invalid');
            field.addClass('is-valid');
            var pass = isValidPassword(field);
            isValidPhone(field, function(validPhone){
                isValidEmail(field, function(validEmail) {
                    if(isFilled() && pass && validEmail && validPhone){
                        $("#submitbtn").prop('disabled', false);
                    }
                    else {
                        $("#submitbtn").prop('disabled', true);
                    }
                })
            })    
        }
        else{
            field.removeClass('is-valid');
            field.addClass('is-invalid');
        }
    }

    $("#firstName").keyup(function(){
        validateField($('#firstName'));
    })

    $("#lastName").keyup(function(){
        validateField($('#lastName'))
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



