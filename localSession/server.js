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

app.get('/home',function(req,res){  
    console.log("/home");
    console.log(req.cookies);
    console.log(req.session);
    //const token = req.session.jwt;
    const cookieToken = req.cookies.token;
    // create new session object.
    //if(token) {
    if (cookieToken) {
        //const cookieToken = req.cookies.token;
        // if email key is sent redirect.      
        let jwtData = undefined;        
        try {
            jwtData = jwt.verify(cookieToken, jwtSecret);
            res.send({jwtData, cookieToken});
        } catch(err) {
            // err
            res.send({err});
        }
        
    } else {
        // else go to home page.
        res.send("No JWT");
    }
});

app.get('/home2',function(req,res){  
    console.log("/home2");
    console.log(req.cookies);
    console.log(req.session);
    //const token = req.session.jwt;
    const cookieToken = req.cookies.token;
    // create new session object.
    //if(token) {
    if (cookieToken) {
        //const cookieToken = req.cookies.token;
        // if email key is sent redirect.      
        let jwtData = undefined;        
        try {
            jwtData = jwt.verify(cookieToken, jwtSecret);
            res.send({jwtData, cookieToken});
        } catch(err) {
            // err
            res.send({err});
        }
        
    } else {
        // else go to home page.
        res.send("No JWT");
    }
});

app.get('/auth',function(req,res){  
    console.log("/auth");
    //console.log(req);
    console.log(req.cookies);
    console.log(req.session);
    //const token = req.session.jwt;
    const cookieToken = req.cookies.token;
    // create new session object.
    //if(token) {
    if (cookieToken) {
        //const cookieToken = req.cookies.token;
        // if email key is sent redirect.      
        let jwtData = undefined;        
        try {
            jwtData = jwt.verify(cookieToken, jwtSecret);
            console.log(jwtData);
            //res.status(200).send({jwtData, cookieToken});
            res.status(200).json({status:"ok"});
        } catch(err) {
            // err
            console.log(err);
            res.status(401).send({err});
        }
        
    } else {
        // else go to home page.
        console.log("No JWT");
        res.status(401).send("No JWT");
    }
});

app.get('/login',function(req,res){
    console.log("/login");
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
    //  path="/" is default
    res.cookie('token', token);
    res.status(200).send({ auth: true, token: token });
});

app.get('/logout',function(req,res){
    console.log("/logout");
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            res.redirect('/home');
        }
    });
});

app.listen(3000, () => console.log('local Auth app listening on port 3000!!!'));