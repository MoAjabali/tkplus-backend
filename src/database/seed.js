const bcrypt = require('bcrypt');
const { sequelize } = require('./connection');
const { User, Activity, ActivityPresenter, Ticket } = require('../models');

// Function to seed the database with sample data
async function seedDatabase() {
  try {
    // Sync database
    await sequelize.sync({ force: true });
    console.log('Database synced');

    // Create users
    const adminUser = await User.create({
      userName: 'Admin User',
      userEmail: 'admin@example.com',
      userPhone: '1234567890',
      userPassword: 'Admin123',
      userRole: 'admin'
    });

    const regularUser1 = await User.create({
      userName: 'John Doe',
      userEmail: 'john@example.com',
      userPhone: '9876543210',
      userPassword: 'Password123',
      userRole: 'user'
    });

    const regularUser2 = await User.create({
      userName: 'Jane Smith',
      userEmail: 'jane@example.com',
      userPhone: '5555555555',
      userPassword: 'Password123',
      userRole: 'user'
    });

    console.log('Users created');

    // Create activities
    const activity1 = await Activity.create({
      activityTitle: 'Tech Conference 2023',
      activityDesc: 'Annual technology conference featuring the latest innovations',
      activityType: 'conference',
      activityDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      activityLocation: 'Convention Center',
      capacity: 500,
      status: 'open'
    });

    const activity2 = await Activity.create({
      activityTitle: 'Music Festival',
      activityDesc: 'Three-day music festival featuring top artists',
      activityType: 'festival',
      activityDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      activityLocation: 'City Park',
      capacity: 1000,
      status: 'open'
    });

    const activity3 = await Activity.create({
      activityTitle: 'Business Workshop',
      activityDesc: 'Workshop on entrepreneurship and business development',
      activityType: 'workshop',
      activityDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
      activityLocation: 'Business Center',
      capacity: 100,
      status: 'open'
    });

    console.log('Activities created');

    // Create presenters
    const presenter1 = await ActivityPresenter.create({
      activityID: activity1.activityID,
      presenterName: 'Dr. Tech Expert',
      presenterJob: 'CTO at Tech Corp'
    });

    const presenter2 = await ActivityPresenter.create({
      activityID: activity1.activityID,
      presenterName: 'Prof. Innovation',
      presenterJob: 'University Researcher'
    });

    const presenter3 = await ActivityPresenter.create({
      activityID: activity3.activityID,
      presenterName: 'Business Guru',
      presenterJob: 'CEO of StartUp Inc.'
    });

    console.log('Presenters created');

    // Create tickets
    const ticket1 = await Ticket.create({
      ticketName: 'Tech Conference - Standard',
      ticketDesc: 'Standard admission to Tech Conference',
      ticketNo: 'TKT-TECH-001',
      price: 99.99,
      status: 'available',
      activityID: activity1.activityID
    });

    const ticket2 = await Ticket.create({
      ticketName: 'Tech Conference - VIP',
      ticketDesc: 'VIP admission to Tech Conference with exclusive access',
      ticketNo: 'TKT-TECH-002',
      price: 199.99,
      status: 'available',
      activityID: activity1.activityID
    });

    const ticket3 = await Ticket.create({
      ticketName: 'Music Festival - Day 1',
      ticketDesc: 'Admission to Music Festival - Day 1',
      ticketNo: 'TKT-MUSIC-001',
      price: 49.99,
      status: 'available',
      activityID: activity2.activityID
    });

    const ticket4 = await Ticket.create({
      ticketName: 'Music Festival - Full Pass',
      ticketDesc: 'Admission to all three days of Music Festival',
      ticketNo: 'TKT-MUSIC-002',
      price: 129.99,
      status: 'available',
      activityID: activity2.activityID
    });

    const ticket5 = await Ticket.create({
      ticketName: 'Business Workshop',
      ticketDesc: 'Admission to Business Workshop',
      ticketNo: 'TKT-BIZ-001',
      price: 79.99,
      status: 'reserved',
      userID: regularUser1.userID,
      activityID: activity3.activityID
    });

    console.log('Tickets created');

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close database connection
    await sequelize.close();
  }
}

// Run the seed function
seedDatabase();