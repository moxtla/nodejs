
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var mongoose = require("mongoose");
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

mongoose.connect('mongodb://localhost/test');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//app.get('/', routes.index);
app.get('/users', user.list);

app.get('/start', function(req, res) {
	res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});



//define model =================
var User = mongoose.model('Users', {
	text : String,
	role : String
});

//routes ======================================================================

// api ---------------------------------------------------------------------
// get all users
app.get('/api/users', function(req, res) {

	// use mongoose to get all users in the database
	User.find(function(err, users) {

		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err)

		res.json(users); // return all users in JSON format
	});
});

// create user and send back all users after creation
app.post('/api/users', function(req, res) {

	// create a user, information comes from AJAX request from Angular
	User.create({
		text : req.body.text,
		role : req.body.role,
		done : false
	}, function(err, user) {
		if (err)
			res.send(err);

		// get and return all the users after you create another
		User.find(function(err, users) {
			if (err)
				res.send(err)
			res.json(users);
		});
	});

});

// delete a user
app.delete('/api/users/:user_id', function(req, res) {
	User.remove({
		_id : req.params.user_id
	}, function(err, user) {
		if (err)
			res.send(err);

		// get and return all the users after you create another
		User.find(function(err, users) {
			if (err)
				res.send(err)
			res.json(users);
		});
	});
});



// listen start server
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
