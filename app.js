var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Poll;

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
        options: Array
    });
    Poll = mongoose.model('Poll', P);
});

var app = express();

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

app.post('/submit_poll', function(a){
    console.log(a.body);
    var fresh = new Poll({
            author: a.body.author,
            title: a.body.title,
            options: a.body.options
        });
    console.log('-------------------------------JUST IN--------------------------');
    console.log(fresh);
    fresh.save(function(err, fresh) {
        if (err) return console.error(err);
        console.dir(fresh);
    });
});

app.post('/query_polls', function(req, res){
    console.log('------------------------REQ FROM QUERY-------------------------');
    console.log(req.body.data);
    var author_ = req.body.data;
    var r = Poll.find({ author: author_}).toArray();
    console.log('FOUND----------------------------------------------------->');
    console.log(r);
    res.send(r)
});

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
app.listen(8080, function(){
    console.log('LIVE');
});
module.exports = app;
