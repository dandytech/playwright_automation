const { test, expect, request } = require("@playwright/test");

let token; // globally declared, to be accessible in any test
let orderId;

// API payloads
const loginPayload = {
  userEmail: "dandy@floodouts.com",
  userPassword: "Dandytech@2022",
};
const orderPayload = {
  orders: [
    { country: "Nigeria", productOrderedId: "6581ca979fd99c85e8ee7faf" },
  ],
};

// Execute once before all other tests
test.beforeAll(async () => {
  const apiContext = await request.newContext(); // new API context

  const loginResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/auth/login",
    { data: loginPayload }
  ); // API call using login endpoint

  expect(loginResponse.ok()).toBeTruthy(); // confirm status 200, 201

  const loginResponseJSON = await loginResponse.json(); // store response in JSON format

  token = loginResponseJSON.token; // grab token from the object

  console.log("Login token: ", token);

  // Order API: to get order ID of authenticated user
  const orderResponse = await apiContext.post(
    "https://rahulshettyacademy.com/api/ecom/order/create-order",
    {
      data: orderPayload,
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    }
  );

  const orderResponseJSON = await orderResponse.json();
  console.log(orderResponseJSON);
  orderId = orderResponseJSON.orders[0];
  console.log("Order ID: ", orderId);
});

test.skip("E-commerce: Place Order 1", async ({ page }) => {
  // Inject token for login to bypass UI login
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, token);

  // Navigate to dashboard via URL
  await page.goto("https://rahulshettyacademy.com/client");

  // Inject the orderId from API above
  await page.locator("button[routerlink*='myorders']").click();

  await page.locator("tbody").waitFor(); // wait for tbody to be visible

  const rows = page.locator("tbody tr");

  for (let i = 0; i < (await rows.count()); i++) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();

    if (orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }

  const orderIdDetails = await page.locator(".col-text").textContent();

  await page.pause();
  expect(orderId.includes(orderIdDetails)).toBeTruthy();

  await page.pause();
});
