//extends the features of test to base as custom name
const base = require("@playwright/test");

//this is another way of passign dataset
exports.cutomizedtest = base.test.extend({
  testDataForOrder: {
    email: "dandy@floodouts.com",
    password: "Dandytech@2022",
    productName: "ADIDAS ORIGINAL",
  },
});
