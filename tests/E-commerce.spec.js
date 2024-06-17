const { test, expect } = require("@playwright/test");

test.skip("E-commerce", async ({ browser }) => {
  // Create a new browser context with video recording enabled
  const context = await browser.newContext({
    recordVideo: {
      dir: "videos/", // Directory where videos will be saved
      size: { width: 1280, height: 720 }, // Video resolution
    },
  });

  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/client");

  // Perform your test steps
  const email = "dandy@floodouts.com";
  const products = await page.locator(".card-body");
  const productName = "ADIDAS ORIGINAL";

  await page.locator("#userEmail").fill(email);
  await page.locator("#userPassword").fill("Dandytech@2022");
  await page.locator("#login").click();

  await expect(page.locator("#toast-container")).toContainText(
    "Login Successfully"
  );
  await page.waitForLoadState("networkidle");

  const titles = await page.locator(".card-body b").allTextContents();
  console.log(titles);

  const count = await products.count();
  for (let i = 0; i < count; i++) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      await products.nth(i).locator("text= Add To Cart").click();
      break;
    }
  }

  await page.locator("[routerlink='/dashboard/cart']").click();
  await page.locator("div li").first().waitFor();
  const bool = await page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();
  expect(bool).toBeTruthy();

  await page.locator("text=Checkout").click();
  await page
    .locator("[value='4542 9931 9292 2293']")
    .fill("4542 9931 9292 2293");
  const day = await page.locator("[class='input ddl']").first();
  day.selectOption("12");
  const month = await page.locator("[class='input ddl']").last();
  month.selectOption("26");

  await page.locator("[class='input txt']").first().fill("12345");
  await page.locator("[class='input txt']").last().fill("424242424242");

  await page.locator("[placeholder*='Country']").type("Nig", { delay: 100 });
  const dropdown = page.locator(".ta-results");
  await dropdown.waitFor();
  const optionCount = await dropdown.locator("button").count();
  for (let i = 0; i < optionCount; i++) {
    const country = await dropdown.locator("button").nth(i).textContent();
    if (country === " Nigeria") {
      await dropdown.locator("button").nth(i).click();
      break;
    }
  }

  await expect(page.locator(".user__name [type='text']").first()).toHaveText(
    email
  );
  await page.locator("[class*='action__submit']").click();
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

  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
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

  // Close the browser context to finalize video recording
  await context.close();
});
