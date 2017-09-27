var express = require('express');
var router = express.Router();
var mongoose = require("mongoose");
var passport = require("passport");
var User = require("../models/User");

router.get('/', function (req, res, next) {
    //console.log(req.user);
    if (req.user != null) {
        User.find({}, function (err, u) {
            if (err) {
                console.log(err);
                res.redirect('/');
            }
            try {
                var Barobj = compareUserBehavior(u);
                var Lineobj = compareTimeBehavior(u);
                var Dropdownobj = compareTags(u);
                var tempTags = "";
                for(var t in Dropdownobj)
                    tempTags += t + "$";
                tempTags = tempTags.slice(0,-1);

                res.render('compare', {
                    user: req.user,
                    jsonData: JSON.stringify(Barobj),
                    jsonLine: JSON.stringify(Lineobj),
                    jsonDropDowntag:JSON.stringify(Dropdownobj),
                    tagsArray: tempTags
                });
            }
            catch (Exception) {
                res.render('login');
            }
        });
    }
    else
        res.redirect('/');
});

function compareUserBehavior(allusers) {
    var dict = {};
    allusers.forEach(function (u) {
        var name = u["username"];
        var allactions = u["actions"];
        var action = allactions.split("$$");
        //create a dictionary 
        var tempDict = { 'PageLoaded': 0, 'Star': 0, 'Comment': 0 };
        for (var temp in action) {
            var x = action[temp].split("#");
            var a = x[0];
            tempDict[a] += 1;
            //var b = x[1];  
        }

        var temparray = new Array(3);
        temparray[0] = tempDict["PageLoaded"];
        temparray[1] = tempDict["Star"];
        temparray[2] = tempDict["Comment"];
        dict[name] = temparray;
    });
    return dict;
}

function compareTimeBehavior(allusers) {
    var finalDict = {};
    var dict = {};
    var dateArray = [];
    allusers.forEach(function (u) {
        var name = u["username"];
        var alldates = u["time"];
        var userDict = {};
        var alldatessplit = alldates.split("$$");
        for (var temp in alldatessplit) {
            var x = alldatessplit[temp].split(" @");
            var date = x[0];
            if (!dateArray.includes(date))
                dateArray.push(date);
            if (userDict[date])
                userDict[date] += 1;
            else
                userDict[date] = 1;
        }
        dict[name] = userDict;
    })
    for (var obj in dict) {
        var dictkey = obj;
        var dictValue = dict[obj];
        var temparray = new Array(dateArray.length);
        for (var i = 0; i < dateArray.length; i++) {
            var xx = dateArray[i];
            if (!dictValue.hasOwnProperty(xx))
                temparray[i] = 0;
            else
                temparray[i] = dictValue[xx];
        }
        finalDict[obj] = temparray;
    }

    finalDict["dates"] = dateArray;
    return finalDict;
}

function compareTags(allusers) {
    var dict = {};
    var finalDict = {};
    var tempArray = [];
    var tagsCount = {};
    allusers.forEach(function (u) {
        var name = u["username"];
        var allactions = u["actions"];

        var tt = questionTags(allactions);
        if(Object.keys(tt).length == 0){
            dict[name] = {};
        }else{
            dict[name] = tt;
        }
        

        var value = dict[name];

        for (var tag in value) {
            if (tagsCount[tag]){
                tagsCount[tag] += value[tag];
            }   
            else
                tagsCount[tag] = value[tag];
        }

    });
    var tagsSorted = Object.keys(tagsCount).sort(function(a,b){return tagsCount[b]-tagsCount[a]})
    if(tagsSorted.length < 6){

        for(var x in tagsSorted){
            var eachTag = tagsSorted[x];
            finalDict[eachTag] = tagsCountForUser(dict, eachTag);
        }
    }else{
        //Take only the top 6 tags from tagsSorted
        var count = 1;
        for(var x in tagsSorted){
            var eachTag = tagsSorted[x];
            finalDict[eachTag] = tagsCountForUser(dict, eachTag);
            count++;
            if(count > 6)
                break;
        }

    }

    //console.log(finalDict);
return finalDict;
}

function tagsCountForUser(userDictionary, tag){
    var returnArray = [];
    var users = ["aaa","bbb","ccc"];
    for(var x in users){
        var eachUser = users[x];
        var temp = userDictionary[eachUser];
        if(temp[tag])
            returnArray.push(temp[tag]);
        else
            returnArray.push(0);
    }
    return returnArray;

}

function questionTags(s) {
    var tagDict = {};
    var eachPageLoad = s.split("$$");
    for (var temp in eachPageLoad) {
        var tagFragments = eachPageLoad[temp].split("**");
        if (tagFragments[1]) {
            var x = tagFragments[1].split("//");
            for (var eachTag in x) {
                //console.log(x[eachTag]);
                var tagName = x[eachTag];
                if (tagDict[tagName])
                    tagDict[tagName] += 1;
                else
                    tagDict[tagName] = 1;
            }
        }
    }
    return tagDict;
}


module.exports = router;