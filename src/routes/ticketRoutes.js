const express = require('express');
const { createTicket, getAllTickets, getTicket, updateTicket, deleteTicket, reserveTicket, cancelReservation } = require('../controllers/ticketController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

// Protected routes for all authenticated users
router.use(protect);

// Routes for both admin and regular users
router.get('/', getAllTickets);
router.get('/:id', getTicket);
router.post('/:id/reserve', reserveTicket);
router.post('/:id/cancel', cancelReservation);

// Admin only routes
router.use(restrictTo('admin'));

router.post('/', createTicket);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

module.exports = router;