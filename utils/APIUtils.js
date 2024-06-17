class APIUtils {
  constructor(apiContext, loginPayload) {
    this.apiContext = apiContext; //make this accessible in all methods
    this.loginPayload = loginPayload;
  }

  async getToken() {
    const loginResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/auth/login",
      { data: this.loginPayload }
    ); // API call using login endpoint

    const loginResponseJSON = await loginResponse.json(); // store response in JSON

    const token = loginResponseJSON.token; // grab token from the object

    console.log("Login token: ", token);

    return token;
  }

  async createOrder(orderPayload) {
    let response = {};
    response.token = await this.getToken(); //use/call login method

    const orderResponse = await this.apiContext.post(
      "https://rahulshettyacademy.com/api/ecom/order/create-order",
      {
        data: orderPayload,
        headers: {
          Authorization: response.token, //called token method
          "Content-Type": "application/json",
        },
      }
    );

    const orderResponseJSON = await orderResponse.json();
    console.log(orderResponseJSON);
    const orderId = orderResponseJSON.orders[0];
    response.orderId = orderId;

    return response;
  }
}
module.exports = { APIUtils }; //export to be visible globally
