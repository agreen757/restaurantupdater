var express = require('express');
var fs = require('fs');
var cons = require('consolidate');

var app = express();
app.use(express.bodyParser());
app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname+"/views");

var server = require('http').createServer(app)

var file_content = fs.readFileSync('data.json');
var content = JSON.parse(file_content);

app.get('/', function(request,response){
    response.render('writer');
});

app.post('/update', function(request, response){
    console.log(request.body.time);
    content.res[0].name = request.body.time;
    fs.writeFileSync('data.json', JSON.stringify(content));
    response.redirect('/');
})

server.listen(8091);
console.log("Express server started on 8091")