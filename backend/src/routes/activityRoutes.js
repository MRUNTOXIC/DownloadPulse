const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

router.post('/', activityController.createOrUpdateActivity);
router.get('/', activityController.getActivities);
router.get('/:id', activityController.getActivityById);

module.exports = router;
