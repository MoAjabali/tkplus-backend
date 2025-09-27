const User = require('./User');
const Activity = require('./Activity');
const ActivityPresenter = require('./ActivityPresenter');
const Ticket = require('./Ticket');

// Define relationships

// Users ↔ Tickets: 1-to-Many
User.hasMany(Ticket, { foreignKey: 'userID' });
Ticket.belongsTo(User, { foreignKey: 'userID' });

// Activities ↔ Tickets: 1-to-Many
Activity.hasMany(Ticket, { foreignKey: 'activityID' });
Ticket.belongsTo(Activity, { foreignKey: 'activityID' });

// Activities ↔ ActivityPresenters: 1-to-Many
Activity.hasMany(ActivityPresenter, { foreignKey: 'activityID' });
ActivityPresenter.belongsTo(Activity, { foreignKey: 'activityID' });

module.exports = {
  User,
  Activity,
  ActivityPresenter,
  Ticket
};