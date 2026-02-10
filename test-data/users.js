const ENV = require('../config/env');

module.exports = [
  {
    username: 'qausername2',
    employeeId: 'qaemployeeid2',
    firstName: 'qafirstname2',
    lastName: 'qalastname2',
    email: 'qa2@email.com',
    password: ENV.defaultUserPassword,
    role: 'qaWebAdmin',
  },
  {
    username: 'kirstie',
    employeeId: 'kirstie123',
    firstName: 'kirstie',
    lastName: 'kirstie',
    email: 'kirstie@email.com',
    password: ENV.defaultUserPassword,
    role: 'qaWebAdmin',
  },
];