var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var sessions = require('express-session');
var MongoStore = require('connect-mongo')(sessions);
var app = express();

//connect to mongoDB
var options = {
    user: 'myTester',
    pass: 'XYZ123'
}
mongoose.connect('mongodb://localhost/ecommercedb',options);
var db = mongoose.connection;

//handle mongodb error
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
    console.log('we are connected');
})
//use sessions for tracking logins
app.use(sessions({
    secret: 'aaassh',
    resave:true,
    saveUninitialized: false,
    store: new MongoStore({
        mongooseConnection: db
    })
}))
 
//parse incoming request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
//server static file from template
app.use(express.static(__dirname + '/views'))

//include routes
var routes = require('./routes/router');
app.use('/',routes);

app.listen(3000,function(){
    console.log('The server is running at port 3000!!');
})