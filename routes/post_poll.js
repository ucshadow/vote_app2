/*var mongoose = require('mongoose');
var Poll = require('../models/poll_db');
var express = require('express');
var router = express.Router();


var R = router.post('/submit_poll', function(a, b){
    console.log(a);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function (callback) {
        var Kitten = mongoose.model('Kitten', Poll);
        var silence = new Kitten({
            author: a.author,
            title: a.title,
            options: a.options
        });
        console.log(silence);
    });
});

module.exports = R;
*/