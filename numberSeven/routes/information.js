var express = require('express');
var router = express.Router();

router.get('/',function(req, res, next){
	res.send('This is colates page');
});

router.get('/information',function(req, res, next){
	res.render('information');
});

module.exports = router;