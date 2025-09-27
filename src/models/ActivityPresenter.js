const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');

const ActivityPresenter = sequelize.define('ActivityPresenter', {
  presenterID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  activityID: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  presenterName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  presenterJob: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  timestamps: true
});

module.exports = ActivityPresenter;