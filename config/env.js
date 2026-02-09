require('dotenv').config();

function required(name) {
  if (!process.env[name]) {
    throw new Error(`${name} is missing in .env`);
  }
  return process.env[name];
}

module.exports = {
  baseUrl: required('BASE_URL'),
  adminUsername: required('ADMIN_USER'),
  adminPassword: required('ADMIN_PASSWORD'),
  defaultUserPassword: required('DEFAULT_USER_PASSWORD'),
};
