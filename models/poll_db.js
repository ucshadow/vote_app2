var mongoose = require('mongoose');

module.exports = mongoose.model('Polls',{
    author: String,
    title: String,
    opts: Array
});