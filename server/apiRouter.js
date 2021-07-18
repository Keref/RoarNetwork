var express = require('express');
var router = express.Router();

const apiController = require('./apiController');


router.get('/', apiController.getAppInfo); 
router.get('/getMessage/:id', apiController.getMessage); 
router.get('/getProfile/:handle', apiController.getProfile)



module.exports = router;
