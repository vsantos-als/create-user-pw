# Auto Create - Playwright Automation

A Playwright automation project for user creation and management testing. This suite automates the login process and bulk user creation against a web application.

## Project Overview

This project uses Playwright for end-to-end testing with a focus on:
- User authentication testing
- Automated user creation
- Role and permissions management
- User management workflows

## Prerequisites

- **Node.js** (v14 or higher)
- **npm** or **yarn**

## Installation

1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
BASE_URL=http://your-app-url
ADMIN_USER=your-admin-username
ADMIN_PASSWORD=your-admin-password
DEFAULT_USER_PASSWORD=default-password-for-new-users
```

**Required Variables:**
- `BASE_URL` - The base URL of the application under test
- `ADMIN_USER` - Admin account username for login
- `ADMIN_PASSWORD` - Admin account password
- `DEFAULT_USER_PASSWORD` - Default password assigned to newly created users

## Project Structure

```
auto_create/
├── config/
│   └── env.js                      # Environment configuration and variables
├── pages/
│   ├── LoginPage.js                # Login page object model
│   ├── UserManagementPage.js       # User management page object model
│   └── RolesPermissionsPage.js     # Roles and permissions page object model
├── test-data/
│   └── users.js                    # Test data: user accounts to create
├── tests/
│   ├── create-users.spec.js        # Main test suite for user creation
│   └── create-role.spec.js         # Test suite for role creation and permissions
├── playwright.config.js            # Playwright configuration
├── package.json                    # Project dependencies
└── README.md                        # This file
```

## Running Tests

### Run all tests
```bash
npx playwright test
```

### Run tests in headed mode (see browser)
```bash
npx playwright test --headed
```

### Run specific test file
```bash
npx playwright test tests/create-users.spec.js
```

### Run role creation test
```bash
npx playwright test tests/create-role.spec.js
```

### Run tests with grep pattern
```bash
npx playwright test -g "Create role and select all permissions"
```

### Run tests in debug mode
```bash
npx playwright test --debug
```

### Run tests in UI mode (interactive)
```bash
npx playwright test --ui
```

## Test Data

User test data is defined in [test-data/users.js](test-data/users.js). Each user object includes:

```javascript
{
  username: 'username',
  employeeId: 'employee-id',
  firstName: 'first-name',
  lastName: 'last-name',
  email: 'email@domain.com',
  password: 'password',
  role: 'Role-Name'
}
```

### Managing Test Users

- **Add users:** Uncomment or add new user objects in [test-data/users.js](test-data/users.js)
- **Remove users:** Comment out or delete user objects
- **Modify credentials:** Update user properties as needed

## Page Object Models

The project uses the Page Object Model pattern for maintainability:

### LoginPage
Handles authentication:
- `goto()` - Navigate to login page
- `login(email, password)` - Perform login

### UserManagementPage
Handles user creation and management:
- `createUser(user)` - Create a new user

### RolesPermissionsPage
Handles role and permissions management:
- `gotoRolesPage()` - Navigate to roles page
- `gotoCreateRolePage()` - Navigate to create new role page
- `openEditRole(roleName)` - Open an existing role for editing
- `toggleRoleActive(shouldBeActive)` - Enable or disable a role
- `setPermission(sectionName, permissionName, enabled)` - Set specific permission
- `selectAllPermissions()` - Select all permission checkboxes (handles late-loading)
- `createRoleWithAllPermissions(roleName)` - Create a new role with all permissions
- `saveChanges()` - Save role changes

## Configuration Details

### Playwright Config
The [playwright.config.js](playwright.config.js) includes:
- **Timeout:** 30 seconds per test
- **Global timeout:** 1 hour
- **Viewport:** 1280x720
- **Screenshots:** Captured on failure only
- **Videos:** Retained on failure
- **Parallel execution:** Enabled locally, serialized in CI

### CI/CD Optimization
- Headless mode in CI environments
- 2 retries for flaky tests in CI
- Limited workers to prevent machine overload
- HTML and dot reporters for readability

## Test Reports

After running tests, reports are generated:

```bash
# View HTML report
npx playwright show-report
```

Reports are stored in the [playwright-report/](playwright-report/) directory and include:
- Test results and status
- Screenshots of failures
- Video recordings of failed tests
- Execution timeline

## Role and Permissions Testing

### Creating Roles with All Permissions
The `RolesPermissionsPage` includes a robust `selectAllPermissions()` method that:
- Waits for all permission checkboxes to load (handles late-loading UI components)
- Detects checkbox count stabilization before iterating
- Handles Chakra UI checkbox components (hidden inputs with span controls)
- Falls back to JavaScript evaluation if click events don't work
- Dispatches proper change events to ensure React/framework state updates

### Example: Create Role with All Permissions
```javascript
const rolesPage = new RolesPermissionsPage(page);
await rolesPage.createRoleWithAllPermissions('Full Access Role');
```

## Troubleshooting

### Tests timing out
- Increase the timeout in [playwright.config.js](playwright.config.js)
- Check if the application is responding
- Verify network connectivity

### Element not found errors
- Verify selectors in page object files match the application UI
- Check if the application has changed
- Update selectors as needed

### Failed login
- Verify `.env` credentials are correct
- Ensure the `BASE_URL` is accessible
- Check if admin account exists and is active

### Missing environment variables
- Create `.env` file with all required variables
- Run `node config/env.js` to validate configuration

## Dependencies

- **@playwright/test** - Testing framework
- **dotenv** - Environment variable management

## Next Steps

1. Update [config/env.js](config/env.js) with your application's base URL and credentials
2. Modify test data in [test-data/users.js](test-data/users.js)
3. Update page selectors in page objects if application UI differs
4. Run tests: `npx playwright test`

## Support & Maintenance

- For test failures, check the HTML report: `npx playwright show-report`
- Review failure videos and screenshots in the playwright-report directory
- Update selectors when application UI changes
- Keep test data current and relevant

## License

ISC

---

**Version:** 1.0.0  
**Last Updated:** February 2026
