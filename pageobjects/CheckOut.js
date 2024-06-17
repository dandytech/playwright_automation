const { expect } = require("@playwright/test");

class CheckOut {
  constructor(page) {
    this.checkproduct = page.locator(".itemImg");
    this.checkout = page.locator("text=Checkout");
    this.card = page.locator("[value='4542 9931 9292 2293']");
    this.day = page.locator("[class='input ddl']");
    this.month = page.locator("[class='input ddl']");
    this.pin = page.locator("[class='input txt']");
    this.cardNo = page.locator("[class='input txt']");
    this.selectcountry = page.locator("[placeholder*='Country']");
    this.dropdown = page.locator(".ta-results");
    this.submit = page.locator("[class*='action__submit']");
    this.checkmail = page.locator(".user__name [type='text']");
  }

  async checkOutProduct(email) {
    //verify riogt producgt is added to cart
    const bool = await this.checkproduct.isVisible();
    expect(bool).toBeTruthy();

    await this.checkout.click();

    await this.card.fill("4542 9931 9292 2293");

    const dayselect = await this.day.first();
    dayselect.selectOption("12");

    const monthselect = await this.month.last();
    monthselect.selectOption("26");

    await this.pin.first().fill("12345");
    await this.cardNo.last().fill("424242424242");

    //Handle dynamic dropdown
    await this.selectcountry.type("Nig", { delay: 100 });

    const dropdown = this.dropdown;
    await dropdown.waitFor();

    const optionCount = await this.dropdown.locator("button").count(); //get total options using chain locator
    for (let i = 0; i < optionCount; i++) {
      const country = await this.dropdown
        .locator("button")
        .nth(i)
        .textContent();

      if (country === " Nigeria") {
        await this.dropdown.locator("button").nth(i).click();
        break;
      }
    }
    //assert if email is retrieved
    await expect(this.checkmail.first()).toHaveText(email);

    await this.submit.click();
  }
}
module.exports = { CheckOut };
