var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");

var userController = {};

// Restrict access to root page
userController.home = function (req, res) {
  res.render('index', { user: req.user });
};

// Go to registration page
userController.register = function (req, res) {
  res.render('register');
};

// Post registration
userController.doRegister = function (req, res) {
  //Get current time, convert to string, and save in time var, then put it in time : 
  var currentDateTime = req.body.date;
  User.register(new User({ username: req.body.username, name: req.body.name, time: currentDateTime, actions: "" }), req.body.password, function (err, user) {
    if (err) {
      return res.render('register', { user: user });
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('/login');
    });
  });
};

// Go to login page
userController.login = function (req, res) {
  res.render('login');
};

// Post login

userController.doLogin = function (req, res) {
  var username = req.body.username;
  User.findOne({ 'username': username }, 'name time', function (err, u) { //query and queried items stored in u
    if (err)
      return handleError(err);
    try {
      var utime = u.time;
      var currentDateTime = req.body.date;
      utime = utime + "$$" + currentDateTime;
      u.time = utime;
      u.save(function (err) {
        if (err)
          return handleError(err); // saved!
      });
    }
    catch (Exception) {
      res.render('login');
    }

  })

  passport.authenticate('local')(req, res, function () {
    res.redirect('/profile');
  });
  //write function to again db and add timestamp
};

userController.logEvent = function (req, res) {
  //console.log(req);
  if (req.user != null) {
    //console.log(req.body);
    var actionString = req.body.eventType;
    var timeString = req.body.time;
    var tags = req.body.tags;

    User.findOne({ 'username': req.user.username }, 'name actions', function (err, u) { //query and queried items stored in u
      if (err)
        return handleError(err);
      else {
        var temp = null;
        if (actionString == "PageLoaded" && tags != "") {
          temp = u.actions;
          var x = actionString + "#" + timeString;
          x = x + "**" + tags;
          temp = temp + "$$" + x;
        }
        else {
          if (u.actions == "") {
            temp = actionString + "#" + timeString;
          } else {
            temp = u.actions;
            var x = actionString + "#" + timeString;
            temp = temp + "$$" + x;
          }
        }
        u.actions = temp;
        u.save(function (err) {
          if (err)
            return handleError(err); // saved!
        });

      }

    });
  }
}

// logout
userController.logout = function (req, res) {
  req.logout();
  //res.redirect('/logout');
  res.render('logout');
};

module.exports = userController;
