var express = require('express');
var router=express.Router();

router.get('/',function(req, res, next){
	res.send('This is colates page');
});

router.get('/addlocate',function(req, res, next){
	res.render('addlocate');
});

module.exports = router;