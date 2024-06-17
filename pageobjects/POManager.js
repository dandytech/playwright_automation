const { CheckOut } = require("./CheckOut");
const { DashboardPage } = require("./DashboardPage");
const { LoginPage } = require("./LoginPage");
const { ThankyouPage } = require("./ThankyouPage");

class POManager {
  constructor(page) {
    this.page = page; //give live to the variables
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.checkout = new CheckOut(this.page);
    this.thankyouPage = new ThankyouPage(this.page);
  }

  //create custom methods for each page object class
  getLoginPage() {
    return this.loginPage;
  }

  getDashboardPage() {
    return this.dashboardPage;
  }

  getCheckOut() {
    return this.checkout;
  }

  getThankyouPage() {
    return this.thankyouPage;
  }
}

module.exports = { POManager };
