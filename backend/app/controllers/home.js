var express = require('express'),
	router 	= express.Router({params: 'inherit'});

/*Default route for API Home*/
router.get('/', function (req, res, next) {
	return res.status(200).json({message: 'Welcome to myVille API'});
});
module.exports = function (app) {
	app.use('/', router);
};
