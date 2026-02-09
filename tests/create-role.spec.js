const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { RolesPermissionsPage } = require('../pages/RolesPermissionsPage');
const ENV = require('../config/env');

test('Create role and select all permissions', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const rolesPage = new RolesPermissionsPage(page);

  await loginPage.goto();
  await loginPage.login(ENV.adminUsername, ENV.adminPassword);
  await expect(page).toHaveURL(/dashboard/);

  const roleName = `e2e-role-${Date.now()}`;
  await rolesPage.createRoleWithAllPermissions(roleName);

  // Verify the new role appears in the roles list
  await expect(page.getByText(roleName)).toBeVisible();
});
