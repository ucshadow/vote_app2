var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = require('express')();
var express = require('express');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var favicon = require('static-favicon');
// var s = require('./models/poll_db');
// var Poll;


var dbConfig = require('./db');
var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbConfig.url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (){
    var P = new mongoose.Schema({
        author: String,
        title: String,
        options: {name: String,
                  score: Number},
        result: Array
    });
    Poll = mongoose.model('Poll', P);
});


function q(x){
    var get_poll = Poll.findOne({_id: x});
    get_poll.exec(function(err, data){
        if(err){
            console.log(err)
        } else {
            io.emit('graphData', data);
            return data
        }
    })
}

io.on('connection', function(socket){
    socket.on('pollId', function(pid){
        var _id_ = pid.data;
        console.log(_id_);
        q(_id_);
    });
});


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use("/modules", express.static('./node_modules'));
app.use("/controllers", express.static('./controllers'));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'AFAKAYU'}));
app.use(passport.initialize());
app.use(passport.session());

var flash = require('connect-flash');
app.use(flash());

var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

io.on('connection', function(socket){
  console.log('a user connected');
});

http.listen(8080, function(){
    console.log('LIVE');
});
module.exports = app;
