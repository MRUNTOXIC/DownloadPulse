const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.post('/heartbeat', deviceController.heartbeat);
router.post('/push-token', authMiddleware, deviceController.registerPushToken);
router.get('/', authMiddleware, deviceController.getDevices);

module.exports = router;
