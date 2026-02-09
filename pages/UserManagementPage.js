class UserManagementPage {
  constructor(page) {
    this.page = page;

    this.settingsMenu = 'text=Settings';
    this.userManagementMenu = 'text=User Management';
    this.createUserButton = 'button:has-text("Create User")';

    this.usernameInput = 'input[name="user_login"]';
    this.emailInput = 'input[name="user_email"]';
    this.employeeidInput = 'input[name="employee_id"]';
    this.firstnameInput = 'input[name="first_name"]';
    this.lastnameInput = 'input[name="last_name"]';
    this.roleDropdown = 'select[name="user_role"]';
    this.passwordInput = 'input[placeholder="Generated password"]';
    this.passwordButton = page.getByRole('button', { name: 'Generate Password' });

    
    this.saveButton = page.getByRole('button', { name: 'Create User' });
    this.successToast = '.toast-success';
  }

  async navigateToUserManagement() {
    await this.page.click(this.settingsMenu);
    await this.page.click(this.userManagementMenu);
  }

  async gotoCreateUser() {
    await this.page.goto('/user-management/users/create');
    }

  async createUser(user) {
    await this.gotoCreateUser()

    await this.page.fill(this.usernameInput, user.username);
    await this.page.fill(this.emailInput, user.email);
    await this.page.fill(this.employeeidInput, user.employeeId);
    await this.page.fill(this.firstnameInput, user.firstName);
    await this.page.fill(this.lastnameInput, user.lastName);
    
    await this.passwordButton.click();
    await this.page.fill(this.passwordInput, user.password);
    await this.page.selectOption(this.roleDropdown, user.role);

    // other fields...
    
    await this.saveButton.click();
    await this.page
    .getByText('Manage user accounts and their details', { exact: true })
    .waitFor();

  }

}

module.exports = { UserManagementPage };