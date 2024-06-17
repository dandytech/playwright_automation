const { test, expect, request } = require("@playwright/test");
const { APIUtils } = require("../utils/APIUtils");

const loginPayload = {
  userEmail: "dandy@floodouts.com",
  userPassword: "Dandytech@2022",
};
const orderPayload = {
  orders: [
    { country: "Nigeria", productOrderedId: "666217d2ae2afd4c0bf499a2" },
  ],
};
const fakePayLoadOrders = { data: [], message: "No Orders" };

let response;
test.beforeAll(async () => {
  const apiContext = await request.newContext();

  const apiUtils = new APIUtils(apiContext, loginPayload);
  response = await apiUtils.createOrder(orderPayload);
});

//create order is success
test("@API Place the order 2", async ({ page }) => {
  page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client");
  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=666217d2ae2afd4c0bf499a2"
  );

  //overwrite the header url with unautorized url
  (route) =>
    route.continue({
      url: "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/620c7bf148767f1f1215d2ca",
    });

  await page.locator("button:has-text('View')").first().click();

  await page.pause();
});
