const { test, expect } = require("@playwright/test");

//to run tests on this file in parallel mode
test.describe.configure({ mode: "parallel" });

//if tests are inter-dependent use serial to enable test skipping when one failed
//test.describe.configure({ mode: "serial" });

test("@web Popup validations", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  //   await page.goto("https://google.com");

  //   await page.goBack();
  //   await page.goForward();

  await expect(page.locator("#displayed-text")).toBeVisible();
  await page.locator("#hide-textbox").click();
  await expect(page.locator("#displayed-text")).toBeHidden();

  //Handling java popup (dialog for playwright)
  await page.pause();
  page.on("dialog", (dialog) => dialog.accept()); //Ok
  // page.on("dialog", (dialog) => dialog.dismiss()); //Cancel
  await page.locator("#confirmbtn").click(); //button to click for popup

  //handling hover
  await page.locator("#mousehover").hover();

  //Handling frames
  const framesPage = page.frameLocator("#courses-iframe"); //switch to frame
  await framesPage.locator("li a[href*='lifetime-access']:visible").click(); //use visible element
  const textCheck = await framesPage.locator(".text h2").textContent();

  console.log(textCheck.split(" ")[1]); //split at " " and pick 2nd text
});

//Take Screenshot
test("Screenshot & Visual Comparision", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");

  await expect(page.locator("#displayed-text")).toBeVisible();
  //take screenshot of the Inputbox
  await page
    .locator("#displayed-text")
    .screenshot({ path: "Element-screenshot.png" }); //take Element screenshot
  await page.locator("#hide-textbox").click(); //hide inputbox
  await page.screenshot({ path: "screenshot.png" }); //take UI screenshot to ensure inputbox is hiden
  await expect(page.locator("#displayed-text")).toBeHidden();
});

//screenshot comparison
test("Visual Comparision", async ({ page }) => {
  await page.goto("https:/google.com/");

  expect(await page.screenshot()).toMatchSnapshot("Google-landing.png");
});
