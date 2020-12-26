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
        var start = validator.trim($('#startPrice').val());
        var buyout = validator.trim($('#buyOutPrice').val());
        if(start<1){
            if(field.is($('#startPrice'))) {
                $('#startPrice').removeClass('is-valid');
                $('#startPrice').addClass('is-invalid');
                return callback(true);
            }
        }
        if(buyout<1){
            if(field.is($('#buyOutPrice'))) {
                $('#buyOutPrice').removeClass('is-valid');
                $('#buyOutPrice').addClass('is-invalid');
                return callback(false);
            }
        }
        if(start<=buyout){ 
            if(field.is($('#buyOutPrice'))) {
                $('#buyOutPrice').removeClass('is-invalid');
                $('#buyOutPrice').addClass('is-valid');
            }
            $("#save").prop('disabled', false);
            return callback(true);
        }
        else{
            if(field.is($('#buyOutPrice'))) {
                $('#buyOutPrice').removeClass('is-valid');
                $('#buyOutPrice').addClass('is-invalid');
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
            }
            return true;
        }
        else{
            if(field.is($('#description'))) {
                $('#description').removeClass('is-valid');
                $('#description').addClass('is-invalid');
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
            }
            return true;
        }
        else{
            if(field.is($('#tags'))) {
                $('#tags').removeClass('is-valid');
                $('#tags').addClass('is-invalid');
            }
            return false;
        }
    }

    function isValidDate(field, callback) {
        var start = validator.trim($('#startDate').val());
        var end = validator.trim($('#endDate').val());

        var flag = true

        var today = new Date()
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+'T'+today.getHours() + ":" + today.getMinutes()

        if(start<date){
            if(field.is($('#startDate'))){
                $('#startDate').removeClass('is-valid');
                $('#startDate').addClass('is-invalid');
                return callback(false);
            }
        }
        if(end<date){
            if(field.is($('#endDate'))){
                $('#endDate').removeClass('is-valid');
                $('#endDate').addClass('is-invalid');
                return callback(false);
            }
        }
        if(start<end){ 
            if(field.is($('#endDate'))) {
                $('#endDate').removeClass('is-invalid');
                $('#endDate').addClass('is-valid');
            }
            $("#save").prop('disabled', false);
            return callback(true);
        }
        else{
            if(field.is($('#endDate'))) {
                $('#endDate').removeClass('is-valid');
                $('#endDate').addClass('is-invalid');
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
            }
            $("#save").prop('disabled', false);
            return callback(true);
        }
        else{
            if(field.is($('#bidIncrease'))) {
                $('#bidIncrease').removeClass('is-valid');
                $('#bidIncrease').addClass('is-invalid');
            }
            $("#save").prop('disabled', true);
            return callback(false);
        }
    }

    function validateField(field){
        var value = validator.trim(field.val());
        var empty = validator.isEmpty(value);

        if(!empty){
            field.removeClass('is-invalid');
            field.addClass('is-valid');
            var validDesc = isValidDescription(field)
            var validTags = isValidTags(field)
            isValidBuyOut(field, function(validBuyOut){
                isValidDate(field, function(validDate) {
                    isValidBidIncrease(field, function(validIncrease){
                        if(validBuyOut && validDate && validDesc && validTags && validIncrease){
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
        }
    }

    $("#name").keyup(function(){
        validateField($('#name'));
    })
    $("#description").keyup(function(){
        validateField($('#description'));
    })
    $("#brand").keyup(function(){
        validateField($('#brand'));
    })
    $("#tags").keyup(function(){
        validateField($('#tags'));
    })
    $("#startPrice").keyup(function(){
        validateField($('#startPrice'));
    })
    $("#buyOutPrice").keyup(function(){
        validateField($('#buyOutPrice'));
    })
    $("#bidIncrease").keyup(function(){
        validateField($('#bidIncrease'));
    })
    $("#startDate").blur(function(){
        validateField($('#startDate'));
    })
    $("#endDate").blur(function(){
        validateField($('#endDate'));
    })
    $("#productType").click(function(){
        validateField($('#productType'));
    })
    $("#images").blur(function(){
        validateField($('#images'));
    })
})