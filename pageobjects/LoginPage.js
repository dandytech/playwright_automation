class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.locator("#userEmail");
    this.password = page.locator("#userPassword");
    this.signInbutton = page.locator("[value='Login']");
  }

  //URL
  async goTo() {
    await this.page.goto("https://rahulshettyacademy.com/client");
  }

  //create a method to use the login variables in constructor
  async validLogin(email, password) {
    await this.email.type(email);
    await this.password.type(password);
    await this.signInbutton.click();
    //wait for products for fetch from API call
    await this.page.waitForLoadState("networkidle");
  }
}

module.exports = { LoginPage };
