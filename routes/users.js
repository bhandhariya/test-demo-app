var express = require('express');
var router = express.Router();
var {protect} = require('../utill/jwtAuth')



/* GET users listing. */
router.get('/',protect('user'), function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
