const express = require('express');
const session = require("express-session");
bodyParser = require("body-parser");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("./model/user");
const {UserService} = require("./service/userService");

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'this-is-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//var user = UserService.findByUserName("user2");

//console.log(user);


passport.use(new LocalStrategy(
    function(username, password, done) {

      console.log("LocalStrategy");
        let user = UserService.findByUserName(username);
        console.log(user);
        console.log(user.length);
        
        if (user.length === 1) {
          return done(null, {
            userid: user[0].username,
            roles: user[0].roles
            //authorized: true
        });
        } else {
          return done(null, false, { message: `username ${username} not found` });
        }
        
    /*
      User.findOne({ username: username }, function(err, user) {
        if (err) { return done(err); }
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        if (!user.validPassword(password)) {
          return done(null, false, { message: 'Incorrect password.' });
        }
        return done(null, user);
      });
      */
    }
  ));

  
  passport.serializeUser((user, done) => {
    // serialize data to client cookie
    console.log("serializeUser!");
    console.log(user);
    done(null, user);
  });
  
  passport.deserializeUser((user, done) => {
    // gets user data from client cookie
    console.log("deserializeUser");
    console.log(user);
    done(null, user);
  });

  app.get('/success', (req, res) => res.send("Welcome "+req.query.username+"!!"));
  app.get('/error', (req, res) => res.send("error logging in"));

  app.get('/test', (req, res) => {
    console.log("/test");
    res.send("Test");
  });

app.post('/', passport.authenticate('local', { failureRedirect: '/error'
                                          }), (req, res) => {                                            
                                            console.log("before redirect");
                                            console.log(req.user);
                                            res.redirect('/success?username='+req.user.userid);
});


app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login.html'
                                    })
);


app.listen(3000, () => console.log('local Auth app listening on port 3000!!!'));



