let globalBids = [];

const socket = io();

// Get username and room from URL
const { id } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

function outputAndCloseBiddings(biddings) {

    var highestBid = biddings[0];
    
    if(biddings.length > 0) {
        $('#highest-bid').html(`
        <div class="row mt-2">
            <div class="col-lg-6">
                <h3 class="font-weight-bold">${highestBid.user.firstname} ${highestBid.user.lastname}</h3>
            </div>
            <div class="col-lg-6 text-right">

                <h3 class="font-weight-bold">
                    <span class="badge badge-primary mr-3">Sold</span>
                    PHP ${highestBid.bid}.00
                </h3>
            </div>
        </div>
    `);
    }

    let otherBids = '';

    for(var i = 1; i < biddings.length; i++) {
        otherBids += `
            <div class="row mt-2">
                <div class="col-lg-6">
                    <h3 class="font-weight-normal">${biddings[i].user.firstname} ${biddings[i].user.lastname}</h3>
                </div>
                <div class="col-lg-6 text-right">
                    <h3 class="font-weight-normal">
                        PHP ${biddings[i].bid}.00
                    </h3>
                </div>
            </div>
        `
    }

    $('#previous-bids').html(otherBids);

    $('#bid-card').hide();
    $('#bid-closed').show();

    $('#clockdiv').html(`
        <div class="col-12 text-center">
            <h3 class="text-uppercase">Bidding CLosed</h3>
        </div>
    `)


    return true;

}

function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));

    return {
        total,
        days,
        hours,
        minutes,
        seconds
    };
}

function initializeClock(id, endtime) {
    const clock = document.getElementById(id);
    const daysSpan = clock.querySelector('.days');
    const hoursSpan = clock.querySelector('.hours');
    const minutesSpan = clock.querySelector('.minutes');
    const secondsSpan = clock.querySelector('.seconds');

    function updateClock() {
        const t = getTimeRemaining(endtime);

        daysSpan.innerHTML = t.days;
        hoursSpan.innerHTML = ('0' + t.hours).slice(-2);
        minutesSpan.innerHTML = ('0' + t.minutes).slice(-2);
        secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);

        if (t.total <= 0) {
            clearInterval(timeinterval);

            var listingId = $('#listing-id').val();

            $.ajax({
                url: `/listing/closeBidding/${listingId}`,
                type: 'POST',
                data: {},
                success: function (result) {

                    $('#bid-card').hide();
                    $('#bid-closed').show();
    
                    if(result != null) {
                        if($('#user-id').val() == result) {
                            Swal.fire(
                                'Congratulations!',
                                'You won the auction to this item',
                                'success'
                            )
                        }
                    }
                },
                statusCode: {
                    500: function () {
                        alert('Internal Server Error');
                    }
                },
                error: function (err) {
                    console.log(err)
                }
            })
        }
    }

    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
}

function outputBiddings(biddings) {

    var highestBid = biddings[0];
    
    if(biddings.length > 0) {
        $('#highest-bid').html(`
                <div class="row mt-2">
                    <div class="col-lg-6">
                        <h3 class="font-weight-bold">${highestBid.user.firstname} ${highestBid.user.lastname}</h3>
                    </div>
                    <div class="col-lg-6 text-right">

                        <h3 class="font-weight-bold">
                            <span class="badge badge-secondary mr-3">Highest</span>
                            PHP ${highestBid.bid}.00
                        </h3>
                    </div>
                </div>
            `);
    }

    let otherBids = '';

    for(var i = 1; i < biddings.length; i++) {
        otherBids += `
            <div class="row mt-2">
                <div class="col-lg-6">
                    <h3 class="font-weight-normal">${biddings[i].user.firstname} ${biddings[i].user.lastname}</h3>
                </div>
                <div class="col-lg-6 text-right">
                    <h3 class="font-weight-normal">
                        PHP ${biddings[i].bid}.00
                    </h3>
                </div>
            </div>
        `
    }

    $('#previous-bids').html(otherBids);

    return true;

}

$(function () {

    var listingStatus = $('#listing-status').val();
    var listingId = $('#listing-id').val();
    var startDate = $('#listing-start-date').val();
    var endDate = $('#listing-end-date').val();
    var user_id = $('#user-id').val();


    const start_date = new Date(Date.parse(startDate));
    const today = new Date();


    if(listingStatus == 'active') {
        if(start_date > today) {
            $('#time-left-display').html('BIDDING START DATE');
            $('#clockdiv').html(`
                <div class="col-12 text-center">
                    <h4>${moment(start_date).format('lll')}</h4>
                </div>
            `);

            $('#bid-closed').show();
        } else {
            $('#bid-card').show();

            const deadline = new Date(Date.parse(endDate));
            initializeClock('clockdiv', deadline);
        }
        

    } else {

        $('#clockdiv').html(`
            <div class="col-12 text-center">
                <h3 class="text-uppercase">Bidding Closed</h3>
            </div>
        `)

        $('#bid-closed').show();
    } 
    
    socket.emit('getBidding', {
        user_id: user_id,
        _id: listingId
    });

    // receiver participants
    socket.on('loadBiddings', biddings => {
        globalBids = biddings;

        if(listingStatus == 'active') outputBiddings(globalBids);
        else if(listingStatus == 'inactive') outputAndCloseBiddings(globalBids);
        
    });

    // ADD BIDDING
    socket.on('loadNewBid', new_bid => {
        if(new_bid.listingId == listingId) globalBids.unshift(new_bid);

        outputBiddings(globalBids);
    });

    socket.on('addedBuyoutBid', new_bid => {
        if(new_bid.listingId == listingId) globalBids.unshift(new_bid);

        outputAndCloseBiddings(globalBids);
    });


    $('#bid-btn').on('click', function () {

        $('#error-message').html('');
        $('#bid-btn').hide();
        $('#save-spinner').show();

        var bid_amount = $('#bid-amount').html();
        bid_amount = parseInt(bid_amount);

        $.ajax({
            url: `/listing/addBidding/${listingId}`,
            type: 'POST',
            data: {
                bid_amount: bid_amount
            },
            success: function (result) {
                console.log('new bid: ', result);
                
                $('#save-spinner').hide();
                $('#bid-btn').show();

                // emit new bid 

                socket.emit('addedNewBid', { user_id: user_id, new_bid: result, _id: listingId });

                $('#current-highest-bid').val(bid_amount);


            },
            statusCode: {
                400: function (data) {
                    alert(data.responseJSON);
                    $('#save-spinner').hide();
                    $('#bid-btn').show();
                },
                500: function () {
                    alert('Internal Server Error');
                }
            },
            error: function (err) {
                console.log(err)
            }
        })

    });

    $('#increase-bid-btn').on('click', function () {
        var currentBid = $('#bid-amount').html();
        var bidIncrease = $('#bid-increase-amount').val();
        let buyout_price = $('#buyout-price').val();

        currentBid = parseInt(currentBid);
        bidIncrease = parseInt(bidIncrease);

        var increasedBid = currentBid + bidIncrease;

        $('#decrease-bid-btn').prop('disabled', false);

        if(increasedBid >= buyout_price) {
            $('#bid-amount').html(buyout_price);
            $('#increase-bid-btn').prop('disabled', true);

        } else {
            $('#bid-amount').html(increasedBid);
        }

    });

    $('#decrease-bid-btn').on('click', function () {
        var currentBid = $('#bid-amount').html();
        var bidIncrease = $('#bid-increase-amount').val();

        let highestBid = $('#current-highest-bid').val();

        currentBid = parseInt(currentBid);
        bidIncrease = parseInt(bidIncrease);
        highestBid = parseInt(highestBid);

        var decreasedBid = currentBid - bidIncrease;

        $('#increase-bid-btn').prop('disabled', false);

        if(decreasedBid > highestBid) {
            $('#bid-amount').html(decreasedBid);
            
        } else {
            $('#decrease-bid-btn').prop('disabled', true);
            $('#bid-amount').html(highestBid);
        }
    });

    $('#buyout-btn').on('click', function () {

        let buyout_price = $('#buyout-price').val();

        Swal.fire({
            title: 'Buy Out Item?',
            text: `Buy-out price is ₱ ${buyout_price}.00`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, buy it!'
        }).then((result) => {
            if (result.isConfirmed) {

                $.ajax({
                    url: `/listing/buyoutBidding/${listingId}`,
                    type: 'POST',
                    data: {
                        buyout_price: buyout_price
                    },
                    success: function (result) {
                        console.log('new bid: ', result);
                        // emit new bid 
        
                        socket.emit('addedBuyoutBid', { user_id: user_id, new_bid: result, _id: listingId });
        
                        $('#current-highest-bid').val(buyout_price);
        
                        Swal.fire(
                            'Congratulations!',
                            'You won the auction to this item',
                            'success'
                        )
                    },
                    statusCode: {
                        400: function (data) {
                            alert(data.responseJSON);
                        },
                        500: function () {
                            alert('Internal Server Error');
                        }
                    },
                    error: function (err) {
                        console.log(err)
                    }
                })
        
            }
        })
    });

});