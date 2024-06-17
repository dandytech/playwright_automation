const { test, expect, request } = require("@playwright/test");
const { APIUtils } = require("../utils/APIUtils"); //import the util class, ensure name is the same as class name

//API payloads
const loginPayload = {
  userEmail: "dandy@floodouts.com",
  userPassword: "Dandytech@2022",
};

const orderPayload = {
  orders: [
    { country: "Nigeria", productOrderedId: "6581ca979fd99c85e8ee7faf" },
  ],
};

let response;
// Execute once before all other tests
test.beforeAll(async () => {
  const apiContext = await request.newContext(); // new API context
  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

test("@API E-commerce: Place Order 2", async ({ page }) => {
  // Inject token for login to bypass UI login
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);

  // Navigate to dashboard via URL
  await page.goto("https://rahulshettyacademy.com/client");

  // Inject the orderId from API above
  await page.locator("button[routerlink*='myorders']").click();

  await page.locator("tbody").waitFor(); // wait for tbody to be visible

  const rows = page.locator("tbody tr");

  //iterate & search table 
  for (let i = 0; i < (await rows.count()); i++) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();

    if (response.orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }

  const orderIdDetails = await page.locator(".col-text").textContent();

  //await page.pause();
  expect(response.orderId.includes(orderIdDetails)).toBeTruthy();

  //await page.pause();
});
