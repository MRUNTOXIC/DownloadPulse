const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', activityController.syncActivity);
router.get('/', activityController.getActivities);

module.exports = router;
