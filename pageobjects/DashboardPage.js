class DashboardPage {
  constructor(page) {
    this.products = page.locator(".card-body");
    this.titles = page.locator(".card-body b");
    this.cart = page.locator("[routerlink='/dashboard/cart']");
    this.waitProductsLoad = page.locator("div li");
  }

  async searchProductAddCart(productName) {
    //grab all products and store
    const titles = await this.titles.allTextContents();
    console.log(titles);

    //To add ADIDAS ORIGINAL to cart
    const count = await this.products.count(); //grap total product containers
    for (let i = 0; i < count; i++) {
      //iterate within the container with help of chain locator
      if (
        (await this.products.nth(i).locator("b").textContent()) === productName
      ) {
        //add to cart
        await this.products.nth(i).locator("text= Add To Cart").click();
        break; //stop iteration and exist from loop hence product match
      }
    }
  }

  async navigateToCart() {
    await this.cart.click();
    await this.waitProductsLoad.first().waitFor(); //wait for div li to be visible
  }
}
module.exports = { DashboardPage };
