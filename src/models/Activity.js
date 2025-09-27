const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const Activity = sequelize.define('Activity', {
  activityID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  activityTitle: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  activityDesc: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  activityType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  activityDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  activityLocation: {
    type: DataTypes.STRING,
    allowNull: false
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('open', 'closed', 'postponed'),
    defaultValue: 'open',
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Activity;