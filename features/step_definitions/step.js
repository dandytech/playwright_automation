const { When, Given, Then } = require("@cucumber/cucumber");
const { POManager } = require("../../pageobjects/POManager");

const { expect } = require("@playwright/test");
const { playwright } = require("@playwright/test");
const { chromium } = require("playwright");

//timeout of 10sec is to overwrite default cucumber 5sec
Given(
  "a login to Ecommerce application with {string} and {string}",
  { timeout: 100 * 1000 },
  async function (email, password) {
    this.browser = await chromium.launch(); // Launch browser
    this.context = await this.browser.newContext();
    this.page = await this.context.newPage();

    this.poManager = new POManager(this.page);

    const loginPage = this.poManager.getLoginPage();
    await loginPage.goTo();
    await loginPage.validLogin(email, password);
  }
);

When("Add {string}", async function (productName) {
  // DashboardPage add to cart
  this.dashboardPage = this.poManager.getDashboardPage();
  await this.dashboardPage.searchProductAddCart(productName);
  await this.dashboardPage.navigateToCart();
});

Then("Verify {string} is displayed in the Cart", async function (email) {
  // CheckOut
  const checkout = this.poManager.getCheckOut();
  await checkout.checkOutProduct(email);
  // Verify checkout
  await expect(this.page.locator("#toast-container")).toHaveText(
    "Order Placed Successfully"
  );

  await expect(this.page.locator(".hero-primary")).toHaveText(
    " Thank you for the order. "
  );

  this.orderId = await this.page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  console.log(this.orderId);
});

Then("Verify order is present in the OrderHistory", async function () {
  // Assignment: view order details using the orderId
  const thankyouPage = this.poManager.getThankyouPage();
  await thankyouPage.Thankyou(this.orderId);

  // Clean up: Close the browser
  await this.page.close();
  await this.context.close();
  await this.browser.close();
});
