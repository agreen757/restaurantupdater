var express = require('express');
var io = require('socket.io');
var cons = require('consolidate');
var fs = require('fs');
var chokidar = require('chokidar');

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

app.get('/', function(request, response){
    response.render('maps');
});

//Loop through the values stored in the JSON file and emit the values of each marker.
fs.watchFile('data.json', {persistent:true,interval:1000}, function(data){
    fs.readFile('data.json', 'utf8', function(err, info){
    //var parsed = JSON.stringify(info);
    var parse = JSON.parse(info);
    for(var i=0;i<parse.res.length;i++){
        console.log(parse.res[i].name);
        io.sockets.emit('data', {name:parse.res[i].name, lat:parse.res[i].lat, long:parse.res[i].long});
    }
    //io.sockets.emit('data', {update:info});
    //console.log(info);
    });
    
});



server.listen(8090);
console.log("Express server started on 8090");

/*sort out how to load many locations with updated information

//https://developers.google.com/maps/documentation/javascript/examples/icon-complex
//this link will allow me to load many icons but how do I load the sockets for each data point?

http://stackoverflow.com/questions/13695046/watch-a-folder-for-changes-using-node-js-and-print-file-paths-when-they-are-cha

Use this to watch the whole directory instead and report changes on each one.  Updating a socket.

*/