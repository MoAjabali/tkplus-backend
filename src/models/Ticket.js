const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Ticket = sequelize.define('Ticket', {
  ticketID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  ticketName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  ticketDesc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  ticketNo: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  status: {
    type: DataTypes.ENUM('available', 'reserved', 'cancelled'),
    defaultValue: 'available',
    allowNull: false
  },
  userID: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  activityID: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Ticket;