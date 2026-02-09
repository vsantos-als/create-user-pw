const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { UserManagementPage } = require('../pages/UserManagementPage');
const users = require('../test-data/users');
const ENV = require('../config/env');

test('Create multiple users', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const userManagementPage = new UserManagementPage(page);

  // Login once
  await loginPage.goto();
  await loginPage.login(ENV.adminUsername, ENV.adminPassword);
  await expect(page).toHaveURL(/dashboard/);

  // Create users
  for (const user of users) {
    await userManagementPage.createUser(user);
  }
});
