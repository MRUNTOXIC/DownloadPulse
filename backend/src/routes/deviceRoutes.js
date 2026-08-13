const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

router.post('/heartbeat', deviceController.registerHeartbeat);
router.post('/push-token', deviceController.registerPushToken);
router.get('/', deviceController.getDevices);

module.exports = router;
