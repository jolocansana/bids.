const express = require('express');
const hbs = require('hbs');
const routes = require('./routes/routes.js');
const db = require('./models/db.js');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const nodemailer = require("nodemailer");
const multer = require('multer');
const envPort = require('./config.js')

const Participation = require('./models/ParticipationModel');

const { userJoin, getCurrentUser, userLeave } = require('./utils/users');

const http = require('http');
const socketio = require('socket.io');

const app = express();
const port = envPort.port || 3000; 

app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/views'));
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.urlencoded({extended:true}));

app.use(express.static('public'));

app.use(session({
    'secret': 'bids-session',
    'resave': false,
    'saveUninitialized': false,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

app.use('/', routes);

app.use(function(req,res) {
    res.render('error')
});

db.connect();

const server = http.createServer(app);
const io = socketio(server);

io.on('connection', socket => {
    console.log('WS Connection...');
    
    
    socket.on('getBidding', ({ user_id, _id }) => {
        let isGuest = false;
        let userId;

        if(user_id == '') {
            isGuest = true;
            userId = socket.id
        } else {
            userId = user_id
        }
        userJoin(socket.id, userId, _id, isGuest)
            .then((user) => {
                socket.join(user.room);

                Participation.find({ listingId: _id }).sort('-bid').limit(3)
                    .then((participations) => {

                        io.to(user.room).emit('loadBiddings', participations);
                    })

            })        
    });

    socket.on('addedNewBid', ({ user_id, new_bid, _id }) => {
        const user = getCurrentUser(socket.id);
        io.emit('loadNewBid', new_bid);
    });

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);
    });

    socket.on('addedBuyoutBid', ({ user_id, new_bid, _id }) => {
        const user = getCurrentUser(socket.id);
        io.emit('addedBuyoutBid', new_bid);
    });

});

server.listen(port, function() {
    console.log('App listening at port ' + port);
});