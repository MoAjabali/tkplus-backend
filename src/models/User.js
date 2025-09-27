const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/connection');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  userID: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  userPhone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  userPassword: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  userRole: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.userPassword) {
        const salt = await bcrypt.genSalt(10);
        user.userPassword = await bcrypt.hash(user.userPassword, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('userPassword')) {
        const salt = await bcrypt.genSalt(10);
        user.userPassword = await bcrypt.hash(user.userPassword, salt);
      }
    }
  }
});

// Instance method to check password
User.prototype.isValidPassword = async function(password) {
  return await bcrypt.compare(password, this.userPassword);
};

module.exports = User;