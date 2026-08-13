const express = require('express');
const router = express.Router();
const pairingController = require('../controllers/pairingController');
const { authMiddleware } = require('../middleware/authMiddleware');

// Public Desktop agent request (authenticated via x-device-token in headers)
router.post('/create', pairingController.createPairingCode);

// Authenticated Mobile app verify 6-digit code endpoint
router.post('/verify', authMiddleware, pairingController.verifyPairingCode);

// Unpair device
router.delete('/:deviceId/pair', authMiddleware, pairingController.unpairDevice);

module.exports = router;
