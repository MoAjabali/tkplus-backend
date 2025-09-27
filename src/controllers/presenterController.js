const { ActivityPresenter, Activity } = require('../models');
const { AppError, catchAsync } = require('../utils/errorHandler');

/**
 * Add presenter to activity
 * @route POST /api/activities/:activityID/presenters
 */
const addPresenter = catchAsync(async (req, res, next) => {
  const { activityID } = req.params;
  const { presenterName, presenterJob } = req.body;

  // Validate input
  if (!presenterName) {
    return next(new AppError('Please provide presenter name', 400));
  }

  // Check if activity exists
  const activity = await Activity.findByPk(activityID);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  // Create presenter
  const presenter = await ActivityPresenter.create({
    activityID,
    presenterName,
    presenterJob
  });

  res.status(201).json({
    status: 'success',
    data: {
      presenter
    }
  });
});

/**
 * Get presenters for activity
 * @route GET /api/activities/:activityID/presenters
 */
const getPresenters = catchAsync(async (req, res, next) => {
  const { activityID } = req.params;

  // Check if activity exists
  const activity = await Activity.findByPk(activityID);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  // Get presenters
  const presenters = await ActivityPresenter.findAll({
    where: { activityID }
  });

  res.status(200).json({
    status: 'success',
    results: presenters.length,
    data: {
      presenters
    }
  });
});

/**
 * Update presenter
 * @route PUT /api/presenters/:id
 */

const updatePresenter = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { presenterName, presenterJob } = req.body;

  // Check if presenter exists
  const presenter = await ActivityPresenter.findByPk(id);
  if (!presenter) {
    return next(new AppError('Presenter not found', 404));
  }

  // Update presenter
  await presenter.update({
    presenterName: presenterName || presenter.presenterName,
    presenterJob: presenterJob || presenter.presenterJob
  });

  res.status(200).json({
    status: 'success',
    data: {
      presenter
    }
  });
});

/**
 * Delete presenter
 * @route DELETE /api/presenters/:id
 */
const deletePresenter = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if presenter exists
  const presenter = await ActivityPresenter.findByPk(id);
  if (!presenter) {
    return next(new AppError('Presenter not found', 404));
  }

  // Delete presenter
  await presenter.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

module.exports = {
  addPresenter,
  getPresenters,
  updatePresenter,
  deletePresenter
};