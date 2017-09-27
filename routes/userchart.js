var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");

router.get('/', function (req, res, next) {
    //console.log(req.user);
    if (req.user != null) {

        User.findOne({ 'username': req.user.username }, 'name actions time', function (err, u) {
            if (err)
                return handleError(err);
            try {
                var uevents = u.actions;
                var utime = u.time;

                var obj = loadEvents(uevents);
                var objCalender = calendarchart(utime);
                

                res.render('userchart', {
                    user: req.user,
                    jsonData: JSON.stringify(obj),
                    jsonCalenderData: JSON.stringify(objCalender)
                });

                //console.log(obj);
            }
            catch (Exception) {
                res.render('login');
            }
        });
    }
    else
        res.redirect('/');
});


function loadEvents(s) {
    var action = s.split("$$");
    //create a dictionary 
    var tempDict = { 'Comment': 0, 'AskQuestion': 0, 'PageLoaded': 0, 'Star': 0, 'VoteDown': 0, 'VoteUp': 0 };
    for (var temp in action) {
        var x = action[temp].split("#");
        var a = x[0];
        tempDict[a] += 1;
        //var b = x[1];  
    }

    var dict = [
        {
            "name": "Comment",
            "y": tempDict["Comment"]
        },
        {
            "name": "Star",
            "y": tempDict["Star"]
        },
        {
            "name": "Up vote",
            "y": tempDict["VoteUp"]
        },
        {
            "name": "Down vote",
            "y": tempDict["VoteDown"]
        },
        {
            "name": "Page Load",
            "y": tempDict["PageLoaded"]
        }
    ];

    return dict;
}

function calendarchart(s) {
    var dict = {};

    var time = s.split("$$");
    for (var temp in time) {
        var x = time[temp].split(" @");
        var a = x[0];
        //var b = x[1];
        var asplit = a.split('/');

        var formatday = "";
        var formatmonth = "";
        if (asplit[0].length == 1)
            formatday = ("0" + asplit[0]).slice(-2);
        else
            formatday = asplit[0];
        if (asplit[1].length == 1)
            formatmonth = ("0" + asplit[1]).slice(-2);
        else
            formatmonth = asplit[1];
        var correctdateformat = formatday + "/" + formatmonth + "/" + asplit[2];

        if (dict[correctdateformat]) {
            dict[correctdateformat] += 1;
        }
        else
            dict[correctdateformat] = 1;
    }

    return dict;
    //console.log(dict[0]);
}


module.exports = router;