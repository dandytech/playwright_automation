const { expect } = require("@playwright/test");

class ThankyouPage {
  constructor(page) {
    this.orderlink = page.locator("button[routerlink*='myorders']");
    this.waitpage = page.locator("tbody");
    this.rows = page.locator("tbody tr");
    this.orderdetails = page.locator(".col-text");
  }

  async Thankyou(orderId) {
    await this.orderlink.click();

    await this.waitpage.waitFor(); //wait for div li to be visible

    const rows = this.rows;

    for (let i = 0; i < (await rows.count()); i++) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();

      if (orderId.includes(rowOrderId)) {
        await rows.nth(i).locator("button").first().click();
        break;
      }
    }

    const orderIdDetails = await this.orderdetails.textContent();

    expect(orderId.includes(orderIdDetails)).toBeTruthy();
  }
}
module.exports = { ThankyouPage };
