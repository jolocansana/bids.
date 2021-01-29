$(function() {
    $('#save').on('click', function () {

        $('#save').hide();
        $('#save-spinner').show();
        $('#error-message').html('');
        $('#error-display').hide();

        var name = $('#name').val();
        var description = $('#description').val();
        var brand = $('#brand').val();
        var tags = $('#tags').val();
        var startPrice = $('#startPrice').val();
        var buyOutPrice = $('#buyOutPrice').val();
        var startDate = $('#startDate').val();
        var endDate = $('#endDate').val();
        var productType = $('#productType').val();
        var bidIncrease = $('#bidIncrease').val();
        var status = 'active';

        var formData = new FormData();
        var imagefiles = document.getElementById('images').files;

        for(var i = 0; i < imagefiles.length; i++) {
            formData.append('images', imagefiles[i])
        }

        formData.append('name', name);
        formData.append('description', description);
        formData.append('tags', tags);
        formData.append('brand', brand);
        formData.append('startPrice', startPrice);
        formData.append('buyOutPrice', buyOutPrice);
        formData.append('bidIncrease', bidIncrease);
        formData.append('startDate', startDate);
        formData.append('endDate', endDate);
        formData.append('productType', productType);
        formData.append('status', status);

        axios.post('/postListing', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then((result) => {
            console.log(result);
            location.replace(`/listingItem?id=${result.data._id}`)
        }).catch((err) => {

            $('#save-spinner').hide();
            $('#save').show();

            if(err.response) {
                if(err.response.status == 400) {
                    $('#error-message').html(err.response.data);
                    $('#error-display').show();
                } else {
                    $('#error-message').html('Internal Server Error');
                    $('#error-display').show();
                }
            }
        })
    })
});

$(document).ready(function() {


    function isValidBuyOut(field, callback) {
        var start = parseInt(validator.trim($('#startPrice').val()));
        var buyout = parseInt(validator.trim($('#buyOutPrice').val()));
        if(start<1){
            if(field.is($('#startPrice'))) {
                $('#startPrice').removeClass('is-valid');
                $('#startPrice').addClass('is-invalid');
                $('#startPricemsg').text('Start price must be greater than 1.');
                return callback(false);
            }
        }
        if(buyout<1){
            if(field.is($('#buyOutPrice'))) {
                $('#buyOutPrice').removeClass('is-valid');
                $('#buyOutPrice').addClass('is-invalid');
                $('#buyOutPricemsg').text('Buyout price must be greater than 1.');
                return callback(false);
            }
        }
        if(start<=buyout){ 
            if(field.is($('#buyOutPrice'))||field.is($('#startPrice'))) {
                $('#buyOutPrice').removeClass('is-invalid');
                $('#buyOutPrice').addClass('is-valid');
            }
            $("#save").prop('disabled', false);
            return callback(true);
        }
        else{
            if(field.is($('#buyOutPrice'))||field.is($('#startPrice'))) {
                $('#buyOutPrice').removeClass('is-valid');
                $('#buyOutPrice').addClass('is-invalid');
                $('#buyOutPricemsg').text('Buyout price must be greater or equal to the start price.');
            }
            $("#save").prop('disabled', true);
            return callback(false);
        }
    }

    function isValidDescription(field) {
        var description = validator.trim($('#description').val());

        if(description.length>=5){ 
            if(field.is($('#description'))) {
                $('#description').removeClass('is-invalid');
                $('#description').addClass('is-valid');
                $('#descriptionmsg').text('');
            }
            return true;
        }
        else{
            if(field.is($('#description'))) {
                $('#description').removeClass('is-valid');
                $('#description').addClass('is-invalid');
                $('#descriptionmsg').text('Description should have a minimum length of 5.');
            }
            return false;
        }
    }

    function isValidTags(field) {
        var tags = validator.trim($('#tags').val());

        if(tags.length>=5){ 
            if(field.is($('#tags'))) {
                $('#tags').removeClass('is-invalid');
                $('#tags').addClass('is-valid');
                $('#tagsmsg').text('');
            }
            return true;
        }
        else{
            if(field.is($('#tags'))) {
                $('#tags').removeClass('is-valid');
                $('#tags').addClass('is-invalid');
                $('#tagsmsg').text('Tags should have a minimum length of 5.');
            }
            return false;
        }
    }

    function isValidDate(field, callback) {
        var start = validator.trim($('#startDate').val());
        var end = validator.trim($('#endDate').val());

        var today = new Date()
        console.log(today.getMonth())
        if(today.getMonth()>=0 && today.getMonth()<=8)
            var date = today.getFullYear()+'-0'+(today.getMonth()+1)
        else
            var date = today.getFullYear()+'-'+(today.getMonth()+1)

        if(today.getDate()>=1 && today.getDate()<=9)
            date = date + '-0'+today.getDate()+'T'
        else
            date = date + '-'+today.getDate()+'T'

        if(today.getHours()>=1 && today.getHours()<=9)
            date = date + '0' + today.getHours() + ":"
        else
            date = date + today.getHours() + ":"

        if (today.getMinutes()>= 1 && today.getMinutes()<=9)
            date = date + "0" + today.getMinutes()
        else
            date = date + today.getMinutes()

        console.log(start)
        console.log(date)

        if(start<date){
            if(field.is($('#startDate'))){
                $('#startDate').removeClass('is-valid');
                $('#startDate').addClass('is-invalid');
                $('#startDatemsg').text('Start date and time should be greater than current date and time. ');
                return callback(false);
            }
        }
        if(end<date){
            if(field.is($('#endDate'))){
                $('#endDate').removeClass('is-valid');
                $('#endDate').addClass('is-invalid');
                $('#endDatemsg').text('End date and time should be greater than current date and time.');
                return callback(false);
            }
        }
        if(start<end){ 
            if(field.is($('#endDate'))) {
                $('#endDate').removeClass('is-invalid');
                $('#endDate').addClass('is-valid');
                $('#endDatemsg').text('');
            }
            $("#save").prop('disabled', false);
            return callback(true);
        }
        else{
            if(field.is($('#endDate'))) {
                $('#endDate').removeClass('is-valid');
                $('#endDate').addClass('is-invalid');
                $('#endDatemsg').text('End date and time should be greater than current date and time.');
            }
            $("#save").prop('disabled', true);
            return callback(false);
        }
    }

    function isValidBidIncrease(field, callback) {
        var start = validator.trim($('#startPrice').val());
        var buyout = validator.trim($('#buyOutPrice').val());
        var bidIncrease = validator.trim($('#bidIncrease').val());

        var value = buyout-start

        if(value>=bidIncrease){ 
            if(field.is($('#bidIncrease'))) {
                $('#bidIncrease').removeClass('is-invalid');
                $('#bidIncrease').addClass('is-valid');
                $('#bidIncreasemsg').text('');
            }
            $("#save").prop('disabled', false);
            return callback(true);
        }
        else{
            if(field.is($('#bidIncrease'))) {
                $('#bidIncrease').removeClass('is-valid');
                $('#bidIncrease').addClass('is-invalid');
                $('#bidIncreasemsg').text('Bid increase should be between start and buyout price.');
            }
            $("#save").prop('disabled', true);
            return callback(false);
        }
    }

    function validateField(field, error){
        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);

        if(!empty){
            error.text('')
            field.removeClass('is-invalid');
            field.addClass('is-valid');
            var validDesc = isValidDescription(field)
            var validTags = isValidTags(field)

            var picValue = validator.trim($('#images').val())
            var picEmpty = validator.isEmpty(picValue)
            isValidBuyOut(field, function(validBuyOut){
                isValidDate(field, function(validDate) {
                    isValidBidIncrease(field, function(validIncrease){
                        if(validBuyOut && validDate && validDesc && validTags && validIncrease && !picEmpty){
                            $("#save").prop('disabled', false);
                        }
                        else {
                            $("#save").prop('disabled', true);
                        }
                    })  
                })
            })    
        }
        else{
            field.removeClass('is-valid');
            field.addClass('is-invalid');
            error.text('Field should not be empty.')
        }
    }

    $("#name").keyup(function(){
        validateField($('#name'),$('#namemsg'));
    })
    $("#description").keyup(function(){
        validateField($('#description'), $('#descriptionmsg'));
    })
    $("#brand").keyup(function(){
        validateField($('#brand'), $('#brandmsg'));
    })
    $("#tags").keyup(function(){
        validateField($('#tags'), $('#tagsmsg'));
    })
    $("#startPrice").keyup(function(){
        validateField($('#startPrice'), $('#startPricemsg'));
    })
    $("#buyOutPrice").keyup(function(){
        validateField($('#buyOutPrice'), $('#buyOutPricemsg'));
    })
    $("#bidIncrease").keyup(function(){
        validateField($('#bidIncrease'), $('#bidIncreasemsg'));
    })
    $("#startDate").blur(function(){
        validateField($('#startDate'), $('#startDatemsg'));
    })
    $("#endDate").blur(function(){
        validateField($('#endDate'), $('#endDatemsg'));
    })
    $("#productType").click(function(){
        validateField($('#productType'), $('#productTypemsg'));
    })
    $("#images").blur(function(){
        validateField($('#images'), $('#imagesmsg'));
    })

    $("#name").change(function(){
        validateField($('#name'), $('#namemsg'));
    })
    $("#description").change(function(){
        validateField($('#description'), $('#descriptionmsg'));
    })
    $("#brand").change(function(){
        validateField($('#brand'), $('#brandmsg'));
    })
    $("#tags").change(function(){
        validateField($('#tags'), $('#tagsmsg'));
    })
    $("#startPrice").change(function(){
        validateField($('#startPrice'), $('#startPricemsg'));
    })
    $("#buyOutPrice").change(function(){
        validateField($('#buyOutPrice'), $('#buyOutPricemsg'));
    })
    $("#bidIncrease").change(function(){
        validateField($('#bidIncrease'), $('#bidIncreasemsg'));
    })
    $("#startDate").change(function(){
        validateField($('#startDate'), $('#startDatemsg'));
    })
    $("#endDate").change(function(){
        validateField($('#endDate'), $('#endDatemsg'));
    })
    $("#productType").change(function(){
        validateField($('#productType'), $('#productTypemsg'));
    })
    $("#images").change(function(){
        validateField($('#images'), $('#imagesmsg'));
    })

})