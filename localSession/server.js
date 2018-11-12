var express = require('express');
var redis   = require("redis");
var session = require('express-session');
var redisStore = require('connect-redis')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var client  = redis.createClient();

const jwt = require('jsonwebtoken');

var app = express();

app.use(cookieParser());
app.use(session({
    secret: 'ssshhhhh',
    // create new redis store. // TTL redis session idle timeout
    store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl :  60}),
    saveUninitialized: false,
    resave: false
}));


const jwtSecret = "123";


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',function(req,res){  
    console.log(req.cookies);
    const token = req.session.jwt;
    // create new session object.
    if(token) {
        const cookieToken = req.cookies.token;
        // if email key is sent redirect.      
        let jwtData = undefined;        
        jwtData = jwt.verify(token, jwtSecret);
        res.send({jwtData, cookieToken});
    } else {
        // else go to home page.
        res.send("No JWT");
    }
});

app.get('/login',function(req,res){
    // when user login set the key to redis.
    let payload = JSON.stringify({
        userid: "Steve",
        exp: Math.floor(Date.now() / 1000) + (60 * 2),        
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      });
      let token = jwt.sign(payload, jwtSecret);
      req.session.jwt = token;
      console.log(token);

    //res.send("login");
    res.cookie('token', token);
    res.status(200).send({ auth: true, token: token });
});

app.get('/logout',function(req,res){
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

app.listen(3000, () => console.log('local Auth app listening on port 3000!!!'));