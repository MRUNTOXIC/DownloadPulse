const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/pair-code', deviceController.generatePairingCode);
router.post('/pair', deviceController.pairDevice);
router.post('/heartbeat', deviceController.heartbeat);
router.post('/push-token', deviceController.registerPushToken);
router.get('/', deviceController.getDevices);
router.delete('/:id', deviceController.removeDevice);

module.exports = router;
