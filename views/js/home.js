$(document).ready(function() {
    console.log('hello');
    $.get('/getListings', {}, function(data, status) {
        console.log("the data is: " + data);
    });
});


// Load the products
function loadProducts() {
    $.get('/getListings', {}, function(data, status) {
        console.log("the data is: " + data);
    });
}