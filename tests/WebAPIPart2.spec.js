//Login UI  and collect all the information in a .json

//test browser using the .json , cart-,order, orderdetails,orderhistory
const { test, expect } = require("@playwright/test");
let webContext;


test.beforeAll(async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").fill("vikasecundaria@gmail.com");
  await page.locator("#userPassword").type("$Password1");
  await page.locator("[value='Login']").click();
  await page.waitForLoadState("networkidle");
  await context.storageState({ path: "state.json" }); // saving all the info of the cookies in the .json
  webContext = await browser.newContext({ storageState: "state.json" });
});


test.only("@API Client App login", async () => {
  const page = await webContext.newPage();
  const email = "vikasecundaria@gmail.com";
  const productName = "zara coat 3";
  await page.goto("https://rahulshettyacademy.com/client");
  const products = page.locator(".card-body");
  const titles = await page.locator(".card-body b").allTextContents();
  console.log(titles);
  const count = await products.count();
  for (let i = 0; i < count; ++i) {
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      //add to cart
      await products.nth(i).locator("text= Add To Cart").click();
      break;
    }
  }
  const btnCart = page.locator("li button", { hasText: "  Cart " });
  await btnCart.click();
  await page.locator("div li").first().waitFor();
  const bool = await page.locator("h3:has-text('zara coat 3')").isVisible();
  expect(bool).toBeTruthy();
  await page.locator("text=Checkout").click();
  await page.locator("[placeholder*='Country']").type("ind", { delay: 100 });
  const dropdown = page.locator(".ta-results");
  await dropdown.waitFor();
  const optionsCount = await dropdown.locator("button").count();
  for (let i = 0; i < optionsCount; ++i) {
    const text = await dropdown.locator("button").nth(i).textContent();
    if (text === " India") {
      await dropdown.locator("button").nth(i).click();
      break;
    }
  }
  await expect(page.locator(".user__name [type='text']").first()).toHaveText(
    email
  );
  await page.locator(".action__submit").click();

  await expect(page.locator(".hero-primary")).toHaveText(
    " Thankyou for the order. "
  );
  const orderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  console.log(orderId);
  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = await page.locator("tbody tr");

  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  expect(orderId.includes(orderIdDetails)).toBeTruthy();
});


test("@API Test case 2", async () => {
  const email = "";
  const productName = "Zara Coat 4";
  const page = await webContext.newPage();
  await page.goto("https://rahulshettyacademy.com/client");
  await page.waitForLoadState("networkidle");
  const products = page.locator(".card-body");
  const titles = await page.locator(".card-body b").allTextContents();
  console.log(titles);
});
