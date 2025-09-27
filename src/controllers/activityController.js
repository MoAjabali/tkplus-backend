const { Activity } = require('../models');
const { AppError, catchAsync } = require('../utils/errorHandler');
const { isFutureDate } = require('../utils/validation');
const { Op } = require('sequelize');

/**
 * Create a new activity
 * @route POST /api/activities
 */
const createActivity = catchAsync(async (req, res, next) => {
  const { activityTitle, activityDesc, activityType, activityDate, activityLocation, capacity, status } = req.body;

  // Validate input
  if (!activityTitle || !activityType || !activityDate || !activityLocation) {
    return next(new AppError('Please provide title, type, date, and location', 400));
  }

  // Validate date
  if (!isFutureDate(activityDate)) {
    return next(new AppError('Activity date must be in the future', 400));
  }

  // Create activity
  const activity = await Activity.create({
    activityTitle,
    activityDesc,
    activityType,
    activityDate,
    activityLocation,
    capacity: capacity || 0,
    status: status || 'open'
  });

  res.status(201).json({
    status: 'success',
    data: {
      activity
    }
  });
});

/**
 * Get all activities
 * @route GET /api/activities
 */
const getAllActivities = catchAsync(async (req, res, next) => {
  const activities = await Activity.findAll();

  res.status(200).json({
    status: 'success',
    results: activities.length,
    data: {
      activities
    }
  });
});

/**
 * Get single activity
 * @route GET /api/activities/:id
 */
const getActivity = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const activity = await Activity.findByPk(id);

  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      activity
    }
  });
});

/**
 * Update activity
 * @route PUT /api/activities/:id
 */
const updateActivity = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { activityTitle, activityDesc, activityType, activityDate, activityLocation, capacity, status } = req.body;

  // Check if activity exists
  const activity = await Activity.findByPk(id);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  // Validate date if provided
  if (activityDate && !isFutureDate(activityDate)) {
    return next(new AppError('Activity date must be in the future', 400));
  }

  // Update activity
  await activity.update({
    activityTitle: activityTitle || activity.activityTitle,
    activityDesc: activityDesc || activity.activityDesc,
    activityType: activityType || activity.activityType,
    activityDate: activityDate || activity.activityDate,
    activityLocation: activityLocation || activity.activityLocation,
    capacity: capacity || activity.capacity,
    status: status || activity.status
  });

  res.status(200).json({
    status: 'success',
    data: {
      activity
    }
  });
});

/**
 * Delete activity
 * @route DELETE /api/activities/:id
 */
const deleteActivity = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if activity exists
  const activity = await Activity.findByPk(id);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  // Delete activity
  await activity.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Search activities by type and/or date
 * @route GET /api/activities/search
 */
const searchActivities = catchAsync(async (req, res, next) => {
  const { type, date } = req.query;

  // Build search criteria
  const whereClause = {};
  
  if (type) {
    whereClause.activityType = type;
  }
  
  if (date) {
    // Search for activities on the specified date
    const searchDate = new Date(date);
    const nextDay = new Date(searchDate);
    nextDay.setDate(nextDay.getDate() + 1);
    
    whereClause.activityDate = {
      [Op.gte]: searchDate,
      [Op.lt]: nextDay
    };
  }

  // Find activities matching criteria
  const activities = await Activity.findAll({
    where: whereClause
  });

  res.status(200).json({
    status: 'success',
    results: activities.length,
    data: {
      activities
    }
  });
});

module.exports = {
  createActivity,
  getAllActivities,
  getActivity,
  updateActivity,
  deleteActivity,
  searchActivities
};