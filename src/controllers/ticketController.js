const { Ticket, Activity, User } = require('../models');
const { AppError, catchAsync } = require('../utils/errorHandler');
// Using dynamic import for uuid (ES Module)
let uuidv4 = null;

// Initialize uuid before using it
async function initUuid() {
  if (!uuidv4) {
    const { v4 } = await import('uuid');
    uuidv4 = v4;
  }
  return uuidv4;
}

/**
 * Create a new ticket
 * @route POST /api/tickets
 */
const createTicket = catchAsync(async (req, res, next) => {
  const { ticketName, ticketDesc, price, activityID } = req.body;

  // Validate input
  if (!ticketName || !activityID) {
    return next(new AppError('Please provide ticket name and activity ID', 400));
  }

  // Check if activity exists
  const activity = await Activity.findByPk(activityID);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  // Generate unique ticket number
  const uuid = await initUuid();
  const ticketNo = `TKT-${uuid().substring(0, 8)}`;

  // Create ticket
  const ticket = await Ticket.create({
    ticketName,
    ticketDesc,
    ticketNo,
    price: price || 0,
    status: 'available',
    activityID
  });

  res.status(201).json({
    status: 'success',
    data: {
      ticket
    }
  });
});

/**
 * Get all tickets
 * @route GET /api/tickets
 */
const getAllTickets = catchAsync(async (req, res, next) => {
  const tickets = await Ticket.findAll({
    include: [
      { model: Activity, attributes: ['activityTitle', 'activityDate'] },
      { model: User, attributes: ['userName', 'userEmail'] }
    ]
  });

  res.status(200).json({
    status: 'success',
    results: tickets.length,
    data: {
      tickets
    }
  });
});

/**
 * Get ticket details
 * @route GET /api/tickets/:id
 */
const getTicket = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const ticket = await Ticket.findByPk(id, {
    include: [
      { model: Activity, attributes: ['activityTitle', 'activityDate', 'activityLocation'] },
      { model: User, attributes: ['userName', 'userEmail', 'userPhone'] }
    ]
  });

  if (!ticket) {
    return next(new AppError('Ticket not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      ticket
    }
  });
});

/**
 * Update ticket
 * @route PUT /api/tickets/:id
 */
const updateTicket = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { ticketName, ticketDesc, price, status, activityID } = req.body;

  // Check if ticket exists
  const ticket = await Ticket.findByPk(id);
  if (!ticket) {
    return next(new AppError('Ticket not found', 404));
  }

  // If changing activity, check if new activity exists
  if (activityID && activityID !== ticket.activityID) {
    const activity = await Activity.findByPk(activityID);
    if (!activity) {
      return next(new AppError('Activity not found', 404));
    }
  }

  // Update ticket
  await ticket.update({
    ticketName: ticketName || ticket.ticketName,
    ticketDesc: ticketDesc || ticket.ticketDesc,
    price: price || ticket.price,
    status: status || ticket.status,
    activityID: activityID || ticket.activityID
  });

  res.status(200).json({
    status: 'success',
    data: {
      ticket
    }
  });
});

/**
 * Delete ticket
 * @route DELETE /api/tickets/:id
 */
const deleteTicket = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Check if ticket exists
  const ticket = await Ticket.findByPk(id);
  if (!ticket) {
    return next(new AppError('Ticket not found', 404));
  }

  // Delete ticket
  await ticket.destroy();

  res.status(204).json({
    status: 'success',
    data: null
  });
});

/**
 * Reserve ticket
 * @route POST /api/tickets/:id/reserve
 */
const reserveTicket = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userID = req.user.userID;

  // Check if ticket exists
  const ticket = await Ticket.findByPk(id);
  if (!ticket) {
    return next(new AppError('Ticket not found', 404));
  }

  // Check if ticket is available
  if (ticket.status !== 'available') {
    return next(new AppError('Ticket is not available for reservation', 400));
  }

  // Check if activity is open
  const activity = await Activity.findByPk(ticket.activityID);
  if (activity.status !== 'open') {
    return next(new AppError('Activity is not open for reservations', 400));
  }

  // Reserve ticket
  await ticket.update({
    status: 'reserved',
    userID
  });

  res.status(200).json({
    status: 'success',
    data: {
      ticket
    }
  });
});

/**
 * Cancel ticket reservation
 * @route POST /api/tickets/:id/cancel
 */
const cancelReservation = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const userID = req.user.userID;

  // Check if ticket exists
  const ticket = await Ticket.findByPk(id);
  if (!ticket) {
    return next(new AppError('Ticket not found', 404));
  }

  // Check if ticket is reserved
  if (ticket.status !== 'reserved') {
    return next(new AppError('Ticket is not reserved', 400));
  }

  // Check if user owns the ticket or is admin
  if (ticket.userID !== userID && req.user.userRole !== 'admin') {
    return next(new AppError('You do not have permission to cancel this reservation', 403));
  }

  // Cancel reservation
  await ticket.update({
    status: 'available',
    userID: null
  });

  res.status(200).json({
    status: 'success',
    data: {
      ticket
    }
  });
});

module.exports = {
  createTicket,
  getAllTickets,
  getTicket,
  updateTicket,
  deleteTicket,
  reserveTicket,
  cancelReservation
};