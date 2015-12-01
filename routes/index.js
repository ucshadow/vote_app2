var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Poll = require('../models/poll_db');
// mongoose.connect('mongodb://localhost/vote');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
};

module.exports = function(passport){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		res.render('index', { message: req.flash('message') });
	});

	/* Handle Login POST */
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));


	/* GET Registration Page */
	router.get('/signup', function(req, res){
		res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.render('home', { user: req.user });
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

    router.post('/get_my_polls', function(req, res){
        //console.log('------------------------------------------ LOGGING GET MY POLLS ------------------------------');
        //console.log(req);
            if(!req.user){
                return res.send('Please Login');
            }
            if(req.user){
                Poll.find({ author: req.user.username}, function(err, data){
                    if(err){
                        console.log(err);
                        return res.send('Database Error');
                    }
                    return res.jsonp(data);
                })
            }

    });

    router.post('/submit_poll', function(a, res){
    console.log(a.body);
    var fresh = new Poll({
            author: a.body.author,
            title: a.body.title,
            opts: a.body.opts
        });
        console.log('-------------------------------JUST IN--------------------------');
        console.log(fresh);
        fresh.save(function(err, fresh) {
            if (err) return console.error(err);
            console.dir(fresh);
        });
        return res.sendStatus(200);
    });

    router.post('/query_polls', function(req, res){
        console.log('------------------------REQ FROM QUERY-------------------------');
        console.log(req.body.data);
        var author_ = req.body.data;
        Poll.find({ author: author_}, function(err, data){
            if(err){
                console.log('ERRRRRRRRRRRRRROOOOOOOOOOOOOOOORRRRRRRRRRRRRRRRRRR');
                console.log(err);
            } else {
                res.jsonp(data);
            }

        });
    });

    router.post('/submit_poll_vote', function(req, res, next){
        //console.log('------------------------REQ FROM SUBMIT-------------------------');

        var option = req.body.data;
        //console.log(option);
        var id__ = option.poll_id;
        var name = option.choice;
        var new_dict = {};
        var inc = 'opts.$.' + name;
        new_dict[inc] = 1;
        Poll.findOne({_id: id__}, function(err, data){
            if(err){
                console.log('ERRRRRRRRRRRRRROOOOOOOOOOOOOOOORRRRRRRRRRRRRRRRRRR');
                console.log(err);
            } else {
                console.log('------------------------------------ RESULT OF NAME Q ------------------------------');
                console.log(data);
                Poll.update({_id: id__, 'opts.custom_id': name}, {$inc: {'opts.$.score': 1}}, function(err, res){
                    if(err){
                        console.log('ERROR');
                        console.log(err)
                    } else {
                        //console.log('SUCCESS');
                        //console.log(res);
                    }
                })

            }
        });
        return res.sendStatus(200);
        // res.end();
        // console.log('querry for ' + o);

    });

    //router.get('/:id', function(req, res) {
     //   res.render('polls', {title: post.author, url: post.URL /*, other data you need... */});
    //});

    router.get('/:id', function(req, res) {
        return Poll.findOne({ _id: req.params.id }, function (err, post) {
            if (err){
                throw(err);
            }
            var names = [];
            for(var i = 0; i < post.opts.length; i++){
                //names.push(Object.keys(post.options[i]));
                names.push(post.opts[i].custom_id);
            }
            return res.render('polls', {user: post.author, name: post.title, options: names});
      });
});


	return router;
};





