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