const express = require('express');
const { createActivity, getAllActivities, getActivity, updateActivity, deleteActivity, searchActivities } = require('../controllers/activityController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getAllActivities);
router.get('/search', searchActivities);
router.get('/:id', getActivity);

// Protected routes - Admin only
router.use(protect);
router.use(restrictTo('admin'));

router.post('/', createActivity);
router.put('/:id', updateActivity);
router.delete('/:id', deleteActivity);

module.exports = router;