const express = require('express');
const router = express.Router();
const pairingController = require('../controllers/pairingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public Desktop agent requests (authenticated via x-device-token in headers)
router.post('/create', pairingController.createPairingCode);
router.get('/status', pairingController.getPairingStatus);

// Authenticated Mobile app verify 6-digit code endpoint
router.post('/verify', authMiddleware, pairingController.verifyPairingCode);

// Unpair & Disconnect device
router.delete('/:deviceId/pair', authMiddleware, pairingController.unpairDevice);
router.post('/unpair/:deviceId', pairingController.disconnectDevice);
router.post('/disconnect/:deviceId', pairingController.disconnectDevice);

module.exports = router;
