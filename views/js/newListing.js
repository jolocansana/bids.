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