const express = require('express');
const router = express.Router();

const apiController = require('./controllers/api');

router.get('/', apiController.getAppInfo);
router.get('/getMessage/:id', apiController.getMessage);
router.get('/getProfile/:handle', apiController.getProfile);

module.exports = router;
