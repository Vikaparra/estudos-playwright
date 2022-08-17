const { test, expect, request } = require("@playwright/test");
const { APiUtils } = require("../utils/APiUtils");
const loginPayLoad = {
  userEmail: "vikasecundaria@gmail.com",
  userPassword: "$Password1",
};
const orderPayLoad = {
  orders: [{ country: "Cuba", productOrderedId: "6262e990e26b7e1a10e89bfa" }],
};
const fakePayLoadOrders = { data: [], message: "No Orders" };

let response;
test.beforeAll(async () => {
  const apiContext = await request.newContext();
  const apiUtils = new APiUtils(apiContext, loginPayLoad);
  response = await apiUtils.createOrder(orderPayLoad);
});

//create order is success
test("@API Place the order", async ({ page }) => {
  await page.addInitScript((value) => {
    window.localStorage.setItem("token", value);
  }, response.token);
  await page.goto("https://rahulshettyacademy.com/client/");

  await page.route(
    "https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/62f536c1e26b7e1a10f63a2b",
    async (route) => {
      const response = await page.request.fetch(route.request());
      let body = fakePayLoadOrders;
      route.fulfill({
        response,
        body,
      });
      //intercepting response - APi response->{ playwright fakeresponse}->browser->render data on front end
    }
  );

  await page.locator("button[routerlink*='myorders']").click();
  //await page.pause();
  // console.log(await page.locator(".mt-4").textContent());
});