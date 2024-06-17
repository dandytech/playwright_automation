const { test, expect } = require("@playwright/test");
const { log } = require("console");
const { LoginPage } = require("../pageobjects/LoginPage");
const { DashboardPage } = require("../pageobjects/DashboardPage");
const { CheckOut } = require("../pageobjects/CheckOut");

test.skip("E-commercePO", async ({ page }) => {
  const email = "dandy@floodouts.com";
  const password = "Dandytech@2022";
  const productName = "ADIDAS ORIGINAL";
  const products = page.locator(".card-body");

  //instantiate LoginPage class
  const loginPage = new LoginPage(page);
  //invoke the methods with their respective variables as arg
  await loginPage.goTo();
  await loginPage.validLogin(email, password);

  //DashboardPage
  const dashboardPage = new DashboardPage(page);
  await dashboardPage.searchProductAddCart(productName);
  await dashboardPage.navigateToCart();

  //CheckOut
  const checkout = new CheckOut(page);
  await checkout.checkOutProduct(email);

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
  await page.locator("button[routerlink*='myorders']").click();

  await page.locator("tbody").waitFor(); //wait for div li to be visible

  const rows = page.locator("tbody tr");

  for (let i = 0; i < (await rows.count()); i++) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();

    if (orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }

  const orderIdDetails = await page.locator(".col-text").textContent();

  expect(orderId.includes(orderIdDetails)).toBeTruthy();

  await page.pause();
});
