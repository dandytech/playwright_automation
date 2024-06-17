const { test, expect } = require("@playwright/test");
const { log } = require("console");

let webContext;

//run login before all other tests
test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("dandy@floodouts.com");
  await page.locator("#userPassword").fill("Dandytech@2022");
  await page.locator("#login").click();
  //Fail test if there is not successful message
  await expect(page.locator("#toast-container")).toContainText(
    "Login Successfully"
  );
  //wait for products to be fetched from API call
  await page.waitForLoadState("networkidle");

  //capture all data in log such as token, cookies, e.t.c
  await context.storageState({ path: "state.json" }); //state.json file will be created

  //create a new context and inject the storage data to it
  webContext = await browser.newContext({ storageState: "state.json" });
});

test("@API E-commerce", async () => {
  //call new browser context created on login
  const page = await webContext.newPage();

  await page.goto("https://rahulshettyacademy.com/client");
  const email = "dandy@floodouts.com";
  const productName = "ADIDAS ORIGINAL";
  const products = page.locator(".card-body");

  //grab all products and store
  const titles = await page.locator(".card-body b").allTextContents();
  console.log(titles);

  //To add ADIDAS ORIGINAL to cart
  const count = await products.count(); //grap total product containers
  for (let i = 0; i < count; i++) {
    //iterate within the container with help of chain locator
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      //add to cart
      await products.nth(i).locator("text= Add To Cart").click();
      break; //stop iteration and exist from loop hence product match
    }
  }

  await page.locator("[routerlink='/dashboard/cart']").click();
  await page.locator("div li").first().waitFor(); //wait for div li to be visible
  //check if right product is added
  const bool = await page.locator("h3:has-text('ADIDAS ORIGINAL')").isVisible();
  expect(bool).toBeTruthy();

  //checkout
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

  //   await page.locator("[name ='coupon']").fill("453");
  //   await page.locator("[type ='submit']").click();
  //await page.pause();

  //Handle dynamic dropdown
  await page.locator("[placeholder*='Country']").type("Nig", { delay: 100 });

  const dropdown = page.locator(".ta-results");

  await dropdown.waitFor();

  const optionCount = await dropdown.locator("button").count(); //get total options using chain locator
  for (let i = 0; i < optionCount; i++) {
    const country = await dropdown.locator("button").nth(i).textContent();

    if (country === " Nigeria") {
      await dropdown.locator("button").nth(i).click();
      break;
    }
  }

  //assert if email is retrieved
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

  //await page.pause();
});

test("Test case 2", async () => {
  //call new browser context created on login
  const page = await webContext.newPage();

  await page.goto("https://rahulshettyacademy.com/client");
  const email = "dandy@floodouts.com";
  const productName = "ADIDAS ORIGINAL";
  const products = page.locator(".card-body");

  //grab all products and store
  const titles = await page.locator(".card-body b").allTextContents();
  console.log("Product Titles: ", titles);
});
