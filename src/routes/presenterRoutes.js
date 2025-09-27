const express = require('express');
const { addPresenter, getPresenters, updatePresenter, deletePresenter } = require('../controllers/presenterController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Public routes for getting presenters
router.get('/activities/:activityID/presenters', getPresenters);

// Protected routes - Admin only
router.use(protect);
router.use(restrictTo('admin'));

router.post('/activities/:activityID/presenters', addPresenter);
router.put('/:id', updatePresenter);
router.delete('/:id', deletePresenter);

module.exports = router;