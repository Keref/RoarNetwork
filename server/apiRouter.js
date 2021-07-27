const express = require('express');
const router = express.Router();
const passportConfig = require('./passportConfig');

const apiController = require('./controllers/api');

router.get('/', apiController.getAppInfo);
router.get('/getMessage/:id', apiController.getMessage);
router.get('/getProfile/:handle', apiController.getProfile);
router.get('/airdrop', passportConfig.isAuthenticated, apiController.getAirdrop);

module.exports = router;
