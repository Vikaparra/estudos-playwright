const { test, expect } = require("@playwright/test");
import {Shared} from "../utils/Shared";

test("Browser Context Playwright test", async ({ browser }) => {
  //step1 -open browser- if you put the next 2 lines and add page to the param of the class the program works normally
  const context = await browser.newContext(); //
  const page = await context.newPage(); //
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await page.title());

  await page.locator("#username").type("rahulshetty");
  await page.locator("[type='password']").type("learning");
  await Promise.all([
    await page.waitForNavigation(),
    await page.locator("#signInBtn").click(),
  ]); // if its non service oriented
  const incorrect = page.locator("[style*='block']");
  await expect(incorrect).toContainText("Incorrect");
});

test("@Web Login and find items", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/client");
  await page.locator("#userEmail").type("vikasecundaria@gmail.com");
  await page.locator("[type='password']").type("$Password1");
  await page.locator("input", { hasText: "Login" }).click();
  const items = page.locator("div div h5");
  await page.waitForLoadState("networkidle"); // if the items are loaded with API / service oriented
  console.log(await items.allTextContents());
});

test("Page Context Playwright test", async ({ page }) => {
  await page.goto("https://google.com");
  console.log(await page.title());
  await expect(page).toHaveTitle("Google");
});

test("@Web UI Controls", async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  console.log(await page.title());

  const username = page.locator("#username");
  const password = page.locator("[type='password']");
  const dropdown = page.locator("select.form-control");
  const radioBtn = page.locator(".radiotextsty");
  const terms = page.locator("#terms");
  const documentLink = page.locator("[href*='documents-request']");
  const signIn = page.locator("#signInBtn");
  await username.type("rahulshetty");
  await password.type("learning");
  await dropdown.selectOption("consult");
  await radioBtn.last().click();
  await page.locator("#okayBtn").click();
  console.log(await radioBtn.last().isChecked()); // o .isChecked retorna true ou false, não serve como assumption
  await expect(radioBtn.last()).toBeChecked();
  await terms.click();
  await expect(terms).toBeChecked();
  await terms.click(); //ou .uncheck()
  expect(await terms.isChecked()).toBeFalsy(); //não precisa de await no expect pq o toBeFalsy não retorna Promise
  await expect(terms).not.toBeChecked(); // pode ser ou esse ou a opção anterior
  await expect(documentLink).toHaveAttribute("class", "blinkingText");
});

test("@Web Handling Child New Pages", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
  const username = page.locator("#username");
  const documentLink = page.locator("[href*='documents-request']");

  const [newPage] = await Promise.all([
    // se mais de uma pagina for aberta, é só colocar [newPage, newPage2, etc]

    context.waitForEvent("page"),
    documentLink.click(),
  ]);

  const text = await newPage.locator(".red").textContent();
  const arrayText = text.split("@");
  const domain = arrayText[1].split(" ")[0];
  await username.type(domain);
  await page.pause();

  console.log(await page.locator("#username").textContent());
});

test.only("@Web Login and Buy", async ({ page }) => {
  
  const shared = new Shared(page);
  await shared.login("vikasecundaria@gmail.com","$Password1");

  const productName = "zara coat 3";
  const products = page.locator(".card-body");
  const titles = await page.locator(".card-body b").allTextContents();
  console.log(titles);
  const count = await products.count();
  console.log("count: " + count);
  for (let i = 0; i < count; i++) {
    console.log("loop " + i);
    if ((await products.nth(i).locator("b").textContent()) === productName) {
      // add to card
      console.log("Achou!!");
      await products.nth(i).locator("text= Add to Cart").click();

      break;
    }
  }
  const btnCart = page.locator("li button", { hasText: "  Cart " });
  await btnCart.click();
  await page.locator("div li").first().waitFor();
  const visible = await page.locator("h3:has-text('zara coat 3')").isVisible();
  expect(visible).toBeTruthy();
  await page.locator("text=Checkout").click();
  await page.locator("[placeholder*='Country']").type("ind", { delay: 100 });
  const dropdown = page.locator(".ta-results");
  await dropdown.waitFor();
  //await dropdown.locator("button", {hasText:" India"}).click(); //or code below: (this one finds 2 possible buttons and crash)
  const dropdownCount = await dropdown.locator("button").count();
  for (let i = 1; i < dropdownCount; i++) {
    const text = await dropdown.locator("button").nth(i).textContent();
    if (text === " India") {
      await dropdown.locator("button").nth(i).click();
      break;
    }
  }
  const email = "vikasecundaria@gmail.com";
  await expect(page.locator(".user__name [type='text']").first()).toHaveText(
    email
  );
  await page.locator(".action__submit").click();
  await expect(page.locator("h1")).toContainText("Thankyou");

  const orderId = await page
    .locator(".em-spacer-1 .ng-star-inserted")
    .textContent();
  console.log(orderId);
  await page.locator("button[routerlink*='myorders']").click();
  await page.locator("tbody").waitFor();
  const rows = page.locator("tbody tr");

  for (let i = 0; i < (await rows.count()); ++i) {
    const rowOrderId = await rows.nth(i).locator("th").textContent();
    if (orderId.includes(rowOrderId)) {
      await rows.nth(i).locator("button").first().click();
      break;
    }
  }
  const orderIdDetails = await page.locator(".col-text").textContent();
  expect(orderId.includes(orderIdDetails)).toBeTruthy();

  await page.pause();
});
