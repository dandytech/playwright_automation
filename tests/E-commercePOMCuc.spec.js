const { test, expect } = require("@playwright/test");
const { log } = require("console");

//use customized test from base
const { cutomizedtest } = require("../utils/test-base");

const { POManager } = require("../pageobjects/POManager");

//consvert the JSON to string then to object
const dataset = JSON.parse(
  JSON.stringify(require("../utils/e-commerceTestData.json"))
);

//parameterization, running test with different data sets
for (const data of dataset) {
  //note ensure you make the test name dynamic else error
  test(`@web E-commercePOM ${data.productName}`, async ({ page }) => {
    //instiate/create object for POManager
    const poManager = new POManager(page);

    //instantiate LoginPage class
    const loginPage = poManager.getLoginPage();
    //invoke the methods with their respective variables as arg
    await loginPage.goTo();
    await loginPage.validLogin(data.email, data.password);

    //DashboardPage add to cart
    const dashboardPage = poManager.getDashboardPage();
    await dashboardPage.searchProductAddCart(data.productName);
    await dashboardPage.navigateToCart();

    //CheckOut
    const checkout = poManager.getCheckOut();
    await checkout.checkOutProduct(data.email);

    //verify checkout
    await expect(page.locator("#toast-container")).toHaveText(
      "Order Placed Successfully"
    );

    await expect(page.locator(".hero-primary")).toHaveText(
      " Thankyou for the order. "
    );

    const orderId = await page
      .locator(".em-spacer-1 .ng-star-inserted")
      .textContent();
    console.log(orderId);

    //Assignment: view order details using the orderId
    const thankyouPage = poManager.getThankyouPage();
    await thankyouPage.Thankyou(orderId);
  });
}

//test for base-test using the customtest and its feature
cutomizedtest("CustomTest", async ({ page, testDataForOrder }) => {
  //instiate/create object for POManager

  const poManager = new POManager(page);

  //instantiate LoginPage class
  const loginPage = poManager.getLoginPage();
  //invoke the methods with their respective variables as arg
  await loginPage.goTo();
  await loginPage.validLogin(testDataForOrder.email, testDataForOrder.password);

  //DashboardPage
  const dashboardPage = poManager.getDashboardPage();
  await dashboardPage.searchProductAddCart(testDataForOrder.productName);
  await dashboardPage.navigateToCart();

  //CheckOut
  const checkout = poManager.getCheckOut();
  await checkout.checkOutProduct(testDataForOrder.email);
});
