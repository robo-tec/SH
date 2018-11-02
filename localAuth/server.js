const express = require('express');
const session = require("express-session");
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const User = require("./model/user");
const {UserService} = require("./service/userService");

const app = express();

app.use(session({ secret: 'this-is-secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

var user = UserService.findByUserName();

console.log(user);

/*
passport.use(new LocalStrategy(
    function(username, password, done) {
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
    }
  ));
*/
app.listen(3000, () => console.log('local Auth app listening on port 3000!'));



