const { test, expect } = require("@playwright/test");

test("Browser Context Playwright test", async ({browser}) => {
    //step1 -open browser- if you put the next 2 lines and add page to the param of the class the program works normally
    const context = await browser.newContext(); //
    const page = await context.newPage(); // 
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());

    await page.locator("#username").type("rahulshetty");
    await page.locator("[type='password']").type("learning");
    await page.locator("#signInBtn").click();
});


test("Page Context Playwright test", async ({page}) => {
    await page.goto("https://google.com");
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
});
  
  