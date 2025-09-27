/**
 * Validation utility functions
 */

/**
 * Validate email format
 * @param {String} email - Email to validate
 * @returns {Boolean} - True if valid, false otherwise
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {String} password - Password to validate
 * @returns {Boolean} - True if valid, false otherwise
 */
const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validate phone number format
 * @param {String} phone - Phone number to validate
 * @returns {Boolean} - True if valid, false otherwise
 */
const isValidPhone = (phone) => {
  // Basic phone validation - can be adjusted based on requirements
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validate date format and check if it's a future date
 * @param {String} dateString - Date string to validate
 * @returns {Boolean} - True if valid future date, false otherwise
 */
const isFutureDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  return date instanceof Date && !isNaN(date) && date > now;
};

module.exports = {
  isValidEmail,
  isStrongPassword,
  isValidPhone,
  isFutureDate
};