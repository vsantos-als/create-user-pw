class RolesPermissionsPage {
  constructor(page) {
    this.page = page;

    // navigation
    this.rolesMenu = page.getByRole('button', { name: 'Roles & Permissions' });

    // page identifiers
    this.rolesHeader = page.getByRole('heading', { name: 'Roles' });
    this.editRoleHeader = page.getByRole('heading', { name: 'Edit Role' });
    this.createRoleHeader = page.getByRole('heading', { name: /create new role/i });

    // create button
    this.createRoleButton = page.getByRole('button', { name: 'Create Role' });

    // save button
    this.saveButton = page.getByRole('button', { name: /Create Role|update/i });
  }

  async gotoRolesPage() {
    await this.page.goto('/user-management/roles');
    await this.rolesHeader.waitFor();
  }

  async gotoCreateRolePage() {
    await this.page.goto('/user-management/roles/create');
    await this.createRoleHeader.waitFor();
  }

  async openEditRole(roleName) {
    // locate the row containing the role
    const roleRow = this.page.getByRole('row', {
      name: new RegExp(roleName, 'i'),
    });

    // click the actions (⋮) button inside that row
    await roleRow.getByRole('button').click();

    // click Edit
    await this.page.getByRole('menuitem', { name: 'Edit' }).click();

    // wait for edit page
    await this.editRoleHeader.waitFor();
  }

  async toggleRoleActive(shouldBeActive) {
    const activeCheckbox = this.page.getByRole('checkbox', { name: 'Active' });

    const isChecked = await activeCheckbox.isChecked();
    if (isChecked !== shouldBeActive) {
      await activeCheckbox.click();
    }
  }

  async setPermission(sectionName, permissionName, enabled) {
    // example: sectionName = "User Management"
    // permissionName = "Create"

    const sectionRow = this.page.getByRole('row', {
      name: new RegExp(sectionName, 'i'),
    });

    const checkbox = sectionRow.getByRole('checkbox', {
      name: new RegExp(permissionName, 'i'),
    });

    const isChecked = await checkbox.isChecked();
    if (isChecked !== enabled) {
      await checkbox.click();
    }
  }

 async setPermission(sectionName, permissionName, enabled) {
  // example: sectionName = "User Management"
  // permissionName = "Create"

  const sectionRow = this.page.getByRole('row', {
    name: new RegExp(sectionName, 'i'),
  });

  const checkbox = sectionRow.getByRole('checkbox', {
    name: new RegExp(permissionName, 'i'),
  });

  const isChecked = await checkbox.isChecked();
  if (isChecked !== enabled) {
    await checkbox.click();
  }
}

async selectAllPermissions() {
  // Robustly select all permission checkboxes.
  // Many checkboxes are implemented with a hidden <input type="checkbox"> and
  // a visible span (.chakra-checkbox__control). We'll target the inputs first,
  // try to click them (with force), and fall back to toggling via JS if needed.
  
  // Wait for DOM to be loaded first
  await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  
  // Wait for at least one checkbox to be present
  const inputs = this.page.locator('input[type="checkbox"]');
  await inputs.first().waitFor({ state: 'visible', timeout: 10000 });

  // Wait until the number of checkboxes stabilizes (no change for 1000ms)
  const stabilizationTimeout = 15000; // total wait for stabilization
  const stableTime = 1000; // required stable time
  const start = Date.now();
  let lastCount = -1;
  let stableSince = Date.now();
  
  while (Date.now() - start < stabilizationTimeout) {
    const c = await inputs.count();
    if (c !== lastCount) {
      lastCount = c;
      stableSince = Date.now();
      console.log(`Checkbox count changed to: ${c}`);
    } else {
      if (Date.now() - stableSince >= stableTime) {
        console.log(`Checkboxes stabilized at count: ${lastCount}`);
        break;
      }
    }
    await this.page.waitForTimeout(200);
  }

  const count = await inputs.count();
  console.log(`selectAllPermissions: detected ${count} checkbox inputs`);
  
  for (let i = 0; i < count; i++) {
    const input = inputs.nth(i);

    // Skip any checkbox that seems to be the main "Active" flag (by aria-label)
    const ariaLabel = (await input.getAttribute('aria-label')) || '';
    if (ariaLabel.toLowerCase().includes('active')) continue;

    try {
      await input.scrollIntoViewIfNeeded({ timeout: 5000 });
      let isChecked = await input.isChecked();
      if (!isChecked) {
        // Prefer clicking the input; use force in case it's visually hidden
        try {
          await input.click({ force: true, timeout: 3000 });
        } catch (e) {
          // ignore and try other methods below
        }

        // re-check; if still not checked, try clicking the label or control span
        isChecked = await input.isChecked();
        if (!isChecked) {
          // click nearest label element (input is wrapped in a label)
          try {
            await input.evaluate((el) => {
              const lab = el.closest('label');
              if (lab) lab.click();
            });
          } catch (e) {
            // ignore
          }
        }
      }

      // final check after attempts
      const finalChecked = await input.isChecked();
      if (!finalChecked) {
        // last resort: set checked + dispatch events so React/Chakra updates
        await input.evaluate((el) => {
          if (!el.checked) {
            el.checked = true;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            const lab = el.closest('label');
            if (lab) lab.classList.add('checked-by-e2e');
          }
        });
      }
    } catch (err) {
      // If something else fails, ensure the input is set via JS as a fallback
      try {
        await input.evaluate((el) => {
          if (!el.checked) {
            el.checked = true;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
          }
        });
      } catch (e) {
        console.error(`Failed to check checkbox ${i}:`, e.message);
      }
    }
  }
}

  async createRoleWithAllPermissions(roleName) {
    await this.gotoCreateRolePage();

    // Try a few common selectors for role name input, fallback to first text input
    const selectors = ['input[name="name"]', 'input[placeholder="Role name"]'];
    let filled = false;
    for (const sel of selectors) {
      try {
        if (await this.page.locator(sel).count()) {
          await this.page.fill(sel, roleName);
          filled = true;
          break;
        }
      } catch (e) {
        // continue to next selector
      }
    }
    if (!filled) {
      const firstText = this.page.locator('input[type="text"]').first();
      if (await firstText.count()) await firstText.fill(roleName);
    }

    await this.selectAllPermissions();
    await this.saveChanges();
    await this.rolesHeader.waitFor();
  }

  async saveChanges() {
    await this.saveButton.click();
  }
}

module.exports = { RolesPermissionsPage };
