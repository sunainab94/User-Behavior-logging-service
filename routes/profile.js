var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    console.log(req.user);
  if(req.user!=null)
    res.render('profile', { user : req.user });
  else
    res.redirect('/');
});

module.exports = router;
// var express = require('express');
// var router = express.Router();
// var mongoose = require("mongoose");
// var passport = require("passport");
// var User = require("../models/User");

// router.get('/', function (req, res, next) {
//   //console.log(req.user);
//   if (req.user != null) {

//     User.findOne({ 'username': req.user.username }, 'name actions', function (err, u) {
//       if (err)
//         return handleError(err);
//       try {
//         var uevents = u.actions;
//         var obj = loadEvents(uevents);

//         res.render('userchart', {
//           user: req.user,
//           jsonData: JSON.stringify(obj)
//         });

//         //console.log(obj);
//       }
//       catch (Exception) {
//         res.render('login');
//       }
//     });
//     //res.render('profile', { user : req.user });
//   }
//   else
//     res.redirect('/');
// });


// function loadEvents(s) {
//   var action = s.split("$$");
//   //create a dictionary 
//   var tempDict = { 'Comment': 0, 'AskQuestion': 0, 'PageLoaded': 0, 'Star': 0, 'VoteDown': 0, 'VoteUp': 0 };
//   for (var temp in action) {
//     var x = action[temp].split("#");
//     var a = x[0];
//     tempDict[a] += 1;
//     //var b = x[1];  
//   }

//   var dict = [
//     {
//       "name": "Comment",
//       "y": tempDict["Comment"]
//     },
//     {
//       "name": "Star",
//       "y": tempDict["Star"]
//     },
//     {
//       "name": "Up vote",
//       "y": tempDict["VoteUp"]
//     },
//     {
//       "name": "Down vote",
//       "y": tempDict["VoteDown"]
//     },
//     {
//       "name": "Page Load",
//       "y": tempDict["PageLoaded"]
//     }
//   ];

//   return dict;
// }

// module.exports = router;