const { test, expect } = require("@playwright/test");
const { log } = require("console");

test("Browser context declaration test", async ({ browser }) => {
  //chrome plugins / cookies inject as arg in context method
  const context = await browser.newContext(); //to triger brower info
  const page = await context.newPage(); //to envoke page load

  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await page.title());
  //you can ignore line 4 and 6 by using page global variable  as on test 2

  page.on("request", (request) => console.log(request.url())); //capture all API request calls url

  page.on("response", (response) =>
    console.log(response.url(), response.status())
  ); //capture all API response status

  //page.route("**/*.ccs", (route) => route.abort()); //block css network call
  //page.route("**/*.{jpg, png, jpeg}", (route) => route.abort()); //block images calls

  //css
  //declare reusable locators
  const userName = page.locator("#username");
  const signIn = page.locator("#signInBtn");
  const cardTitles = page.locator(".card-body a");

  await userName.type("rahulshetty");
  await page.locator("[type='password']").type("learning");
  await page.locator();
  await page.locator("#terms").click();
  await signIn.click();
  //note this element delays but playwrite manages it as configured
  console.log(await page.locator("[style*='block']").textContent()); //grap text and print
  //use expect assertion to check text exist
  //await expect(locator).toContainText()
  await expect(page.locator("[style*='block']")).toContainText("Incorrect");

  //type or fill works same but use fill to clear field
  await userName.fill(""); //to clear the field
  await userName.fill("rahulshettyacademy");

  //grap the first element
  //console.log(await cardTitles.first().textContent());
  //console.log(await cardTitles.nth(1).textContent()); //grap second element
  //you can use .first() instead of nth(0), no second() but last()

  await Promise.all([page.waitForNavigation(), signIn.click()]); //race condition

  //For none api App , I.e data coming direct form DB like here, use waitForNavigation() method wrapped in promise.all with the button to click before the code to get all the products else it will return empty array if the above get a product is not there

  // For service (API) app, use the method waitForLoadSate(‘networkidle’) to wait for api data fetch.
  //e.g page.waitForLoadState(‘networkidle’);

  //to grap titles of all cards/products using allTextContent() method
  const allTitles = await cardTitles.allTextContents();
  console.log(allTitles);
  //note: .allTextContents() method doesn't wait for page to load hence commenting above two lines will output empty array.
});

//use only anotation to run only a particular test
test("First Playwright test", async ({ page }) => {
  await page.goto("https://google.com/");
});

test("UI Element Control", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  await page.locator("#username").type("rahulshetty");
  await page.locator("[type='password']").type("learning");
  const dropdown = page.locator("select.form-control");
  await dropdown.selectOption("consult");
  //await page.pause(); //make test to pause for inspect before browser close
  await page.locator(".customradio").last().click();
  await page.locator("button#okayBtn").click();
  //await page.pause();

  //print true if checked
  console.log(await page.locator(".customradio").last().isChecked());
  //using expect assertion to ensure radio button is checked
  await expect(page.locator(".customradio").last()).toBeChecked(); //fail test if not checked

  await page.locator("#terms").click();
  await expect(page.locator("#terms")).toBeChecked(); //assertion
  await page.locator("#terms").uncheck(); //uncheck box
  //no assertion for unChecked but you can use toBeFalsy() or toBeTruthy
  expect(await page.locator("#terms").isChecked()).toBeFalsy(); //no await because no action is performed within page scope.

  //assertion to check if an element have a particular attribute, e.g class:
  //expect(locator).toHaveClassAttribute(name, value, options)
  const documentLink = page.locator("[href*='documents-request']");

  await expect(documentLink).toHaveAttribute("class", "blinkingText");
});

//Handling Child Window
test("@web Handling Child Window", async ({ browser }) => {
  const context = await browser.newContext(); //open browser
  const page = await context.newPage(); //open a page
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const documentLink = page.locator("[href*='documents-request']");
  //const userName = page.locator("#username");

  //switch context to another child page
  const [newPage] = await Promise.all([
    context.waitForEvent("page"), //wait for new page
    documentLink.click(),
  ]);

  //automating another child page
  const text = await newPage.locator(".red").textContent();
  //console.log(text);

  //grap the domain name from the text
  const arrayText = text.split("@"); //splits text at @ into 2 left [0] and  right [1] parts
  const domain = arrayText[1].split(" ")[0]; //split in white space and grap left [0] part
  console.log(domain);

  //switch back to parent
  await page.locator("#username").type(domain);

  await page.pause();

  console.log(await page.locator("#username").textContent());
});
//Note: if you are to open two windows when you click use blow format
//const [newPage, newPage2] = await Promise.all([
// context.waitForEvent("page"), //wait for new page
// documentLink.click(),
//]);
//newPage2.

//Recorded test using: npx playwright codegen https://www.google.com/
