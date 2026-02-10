const { test, expect } = require('@playwright/test');

test.describe.configure({ mode: 'serial' });

const ENV = require('../config/env');
const users = require('../test-data/users');
const { LoginPage } = require('../pages/LoginPage');
const { RolesPermissionsPage } = require('../pages/RolesPermissionsPage');
const { UserManagementPage } = require('../pages/UserManagementPage');

test('create role then create users from test-data', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const rolesPage = new RolesPermissionsPage(page);
  const userPage = new UserManagementPage(page);

  // Login as admin
  await loginPage.goto();
  await loginPage.login(ENV.adminUsername, ENV.adminPassword);
  await expect(page).toHaveURL(/dashboard/);

  // Create a unique role
  const ts = Date.now();
  const roleName = `qa-role-${ts}`;
  console.log('Creating role:', roleName);
  await rolesPage.createRoleWithAllPermissions(roleName);

  // Create users from test-data sequentially
  for (const template of users) {
    const user = {
      username: template.username || `qauser-${ts}`,
      employeeId: template.employeeId || `eid-${ts}`,
      firstName: template.firstName || 'E2E',
      lastName: template.lastName || 'User',
      email: template.email || `qa.${ts}@example.com`,
      password: template.password || ENV.defaultUserPassword,
      role: roleName,
    };

    console.log('Creating user:', user.username, 'with role', user.role);
    await userPage.createUser(user);
    await page.waitForTimeout(500);
  }

  // Small pause to allow any UI feedback to appear
  await page.waitForTimeout(1000);
  console.log('Role and users creation finished.');
});
