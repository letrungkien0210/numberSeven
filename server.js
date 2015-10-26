//grab express
var express= require('express');

//create an express app
var app =express();

// CONFIGURE THE APP
// ==================================================
// tell node where to look for site resources
app.use(express.static(__dirname + '/public'));

//set the view engine to ejs
app.set('view engine','ejs');
app.set('port', (process.env.PORT || 8080));

//static files
console.log('__dirname equal '+ __dirname);
app.use(express.static(__dirname+'/public'));

//Create an express route for the home page
app.get('/', function(req, res){
	res.sendfile('index.html');
});

// START THE SERVER
// ==================================================
app.listen(app.get('port'), function () {
	console.log('Node app is running on port', app.get('port'));
});