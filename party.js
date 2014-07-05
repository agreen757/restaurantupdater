var express = require('express');
var mongodb = require('mongodb')
var MongoClient = mongodb.MongoClient;
var Server = require('mongodb').Server;
var MONGOHQ_URL="mongodb://worker:walton@oceanic.mongohq.com:10048/partyofme";
var io = require('socket.io');
var cons = require('consolidate');
var fs = require('fs');
var chokidar = require('chokidar');
var twit = require('twit');
var nodemailer = require('nodemailer');
var T = new twit({
    consumer_key: 'DymxlgOTi4YePGslmmuPkFVxV',
    consumer_secret: 'icGkzsyRfznrtsMqW5llRlSMq3sxbNXEDNUDx6JJS5jjhj0bP0',
    access_token: '2417751019-2Q72W81vurv2EzzXHZcJ18Gf6lbQfG2oTqxcGkW',
    access_token_secret: 'QPCK5CxiIjARU4cbjg0FyfwwCA38ABpf8oL8RdjIL3nJS'
})

var app = express();
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname+"/views");

app.use(express.cookieParser());
app.use(express.session({secret: '1234567890ADRIAN'}));
app.use(express.bodyParser());
app.use(express.methodOverride());

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//Open DB connection
MongoClient.connect(MONGOHQ_URL, function(err, db){
    
//*********INTRO PAGE
    
app.get('/', function(request, response){
    response.render('landing');
});
    
//**********MAIN LANDING PAGE FOR USERS  
    
app.get('/main', function(request, response){
    response.render('index');
});
    
// *********HOW UPDATES WILL HAPPEN FROM THE USE
    
app.get('/admin', function(request, response){
    response.render('writer');
})

//  *********ACCEPT POSTS FROM USER USING ADMIN PANEL
app.post('/update', function(request, response){
    
    console.log(request);
    
})
    //Using sockets to interract with the web page
    io.sockets.on('connection', function(socket){
	socket.on('ready', function(data){
	    db.collection('locations').find({}).toArray(function(err,items){
		for(i in items){
		    socket.emit('load', {update:items[i]});
		}
	    })
	})
    })
   

    var stream = T.stream('user');
    stream.on('tweet', function(tweet){
	//This if statement should check for the #partyofme tag
	var woop = tweet.text;
	var tagged = woop.search("#partyofme");
	if(tagged != -1){
	    //if the text is found we search the database for the location name
	    //we have to extract this out of the tweet first (Abiding by our format "Plaza Eats,45min #partyofme")
	    var text = tweet.text;
	    var result = text.split(",");
	    console.log(result[0]);
	    //search our db for the first item in the array [Plaza Eats,45min #partyofme]
	    db.collection('locations').findOne({name:result[0]}, function(err,items){
		//now update the db with the new time and emit to the page
		//first we will break out the second item int he result array
		var timeSplit = result[1].split(" ");
		var wait = timeSplit[0];
		if(items != null){
		    db.collection('locations').update({name:result[0]}, {$set:{"time":wait,"lastUpdate":tweet.created_at}}, function(err,doc){
			console.log(doc);
		    });
		    io.sockets.emit('update', {update:tweet});
		    console.log(tweet);
		}
	    })
	}
    })
    server.listen(8090);
    console.log("Express server started on 8090");
})

/*sort out how to load many locations with updated information

https://developers.google.com/maps/documentation/javascript/examples/icon-complex
this link will allow me to load many icons but how do I load the sockets for each data point?

http://stackoverflow.com/questions/13695046/watch-a-folder-for-changes-using-node-js-and-print-file-paths-when-they-are-cha

Use this to watch the whole directory instead and report changes on each one.  Updating a socket.

*/