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
                        $("#emailmsg").text("");
                        $('#email').removeClass('is-invalid');
                        $('#email').addClass('is-valid');
                    }
                   return callback(true);
                   
                }
                else {
                    if(field.is($('#email'))) {
                        $("#emailmsg").text("Email should be unique.");
                        $('#email').removeClass('is-valid');
                        $('#email').addClass('is-invalid');

                    }

                    return callback(false);
                }
            });
        }
        else {
            if(field.is($('#email'))) {
                $("#emailmsg").text("Email should be a valid email.");
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
            if(field.is($('#password')))
                $("#passwordmsg").text("Password should be minimum of 7 characters.");
        } else if (password.length > 50) {
            flag = false;
            if(field.is($('#password')))
                $("#passwordmsg").text("Password should not be greater than 50 characters.");
        } else if (password.search(/\d/) == -1) {
            flag = false;
            if(field.is($('#password')))
                $("#passwordmsg").text("Password should contain alphabets and numbers.");
        } else if (password.search(/[a-zA-Z]/) == -1) {
            flag = false;
            if(field.is($('#password')))
                $("#passwordmsg").text("Password should contain alphabets.");
        } else if (password.search(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/) != -1) {
            flag = false;
                if(field.is($('#password')))
            $("#passwordmsg").text("Password should be contain numbers.");
        }

        if(password == confirmpassword && (!validator.isEmpty(password) && !validator.isEmpty(confirmpassword)) && flag){ 
            if(field.is($('#cpassword')) || field.is($('#password'))) {
                $('#password').removeClass('is-invalid');
                $('#password').addClass('is-valid');
                $('#cpassword').removeClass('is-invalid');
                $('#cpassword').addClass('is-valid');
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
                if(password != confirmpassword)
                    $("#cpasswordmsg").text("Passwords should match.");
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
                $("#phonenummsg").text("Phone number must be valid.");
            }
            return callback(false);
        }
        else {
            if(field.is($('#phonenum'))) {
                $('#phonenum').removeClass('is-invalid');
                $('#phonenum').addClass('is-valid');
                $("#phonenummsg").text("");
            }
            return callback(true);
        }
    }

    function validateField(field, error){
        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);

        if(!empty){
            field.removeClass('is-invalid');
            field.addClass('is-valid');
            error.text('');
            var pass = isValidPassword(field);
            
            isValidEmail(field, function(validEmail){
                isValidPhone(field, function(validPhone) {
                    if(pass && validEmail && validPhone && isFilled()){
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
            error.text('Field should not be empty.');
        }
    }

    $("#firstName").keyup(function(){
        validateField($('#firstName'), $('#firstNamemsg'));
    })

    $("#lastName").keyup(function(){
        validateField($('#lastName'), $('#lastNamemsg'))
    })

    $("#email").keyup(function(){
        validateField($('#email'), $('#emailmsg'));
    })

    $("#username").keyup(function(){
        validateField($('#username'), $('#usernamemsg'));
    })

    $("#phonenum").keyup(function(){
        validateField($('#phonenum'), $('#phonenummsg'));
    })

    $("#password").keyup(function(){
        validateField($('#password'), $('#passwordmsg'))
    })

    $("#cpassword").keyup(function(){
        validateField($('#cpassword'), $('#cpasswordmsg'))
    })

    $("#address").keyup(function(){
        validateField($('#address'), $('#addressmsg'));
    })

    $("#city").keyup(function(){
        validateField($('#city'), $('#citymsg'));
    })

    $("#firstName").change(function(){
        validateField($('#firstName'), $('#firstNamemsg'));
    })

    $("#lastName").change(function(){
        validateField($('#lastName'), $('#lastNamemsg'))
    })

    $("#email").change(function(){
        validateField($('#email'), $('#emailmsg'));
    })

    $("#username").change(function(){
        validateField($('#username'), $('#usernamemsg'));
    })

    $("#phonenum").change(function(){
        validateField($('#phonenum'), $('#phonenummsg'));
    })

    $("#password").change(function(){
        validateField($('#password'), $('#passwordmsg'))
    })

    $("#cpassword").change(function(){
        validateField($('#cpassword'), $('#cpasswordmsg'))
    })

    $("#birthday").blur(function(){
        validateField($('#birthday'), $('#birthdaymsg'))
    })

    $("#address").change(function(){
        validateField($('#address'), $('#addressmsg'));
    })

    $("#city").change(function(){
        validateField($('#city'), $('#citymsg'));
    })
    

});



