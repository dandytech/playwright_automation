const { test, expect } = require("@playwright/test");
const { log } = require("console");

test("Assignment-1-Client Signup", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client");
  //to get the tile and asert it s correct

  console.log(await page.title());
  await expect(page).toHaveTitle("Let's Shop"); //assertion

  await page.locator(".text-reset").click();
  await page.locator("#firstName").fill("James");
  await page.locator("#lastName").fill("Tester");
  await page.locator("#userEmail").fill("qadan@floodouts.com");
  await page.locator("[placeholder*='number']").fill("3456789765");

  //Handle DropDown List
  const ocupations = page.locator("[formcontrolname='occupation']");
  ocupations.getByText("Engineer");

  await page.locator("[value*='Male']").click();
  await page.locator("#userPassword").fill("Dandytech@2022");
  await page.locator("#confirmPassword").fill("Dandytech@2022");
  await page.locator("[type='checkbox']").click();
  await page.locator("[type='submit']").click();

  await page.waitForTimeout(5000);
});

test("Login", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client");

  //await page.getByText("Login here").click();
  await page.locator("#userEmail").fill("dandy@floodouts.com");
  await page.locator("#userPassword").fill("Dandytech@2022");

  await page.locator("#login").click();

  //Fail test if there is not successful message
  await expect(page.locator("#toast-container")).toContainText(
    "Login Successfully"
  );

  //wait for products for fetch from API call
  await page.waitForLoadState("networkidle");

  //grab first product
  console.log(
    "First Product:",
    await page.locator(".card-body b").first().textContent()
  );

  //grab all products
  console.log(
    "All Products:",
    await page.locator(".card-body b").allTextContents()
  );
});
