const { test, expect } = require("@playwright/test");

test("Browser Context Playwright test", async ({browser}) => {
    //step1 -open browser- if you put the next 2 lines and add page to the param of the class the program works normally
    const context = await browser.newContext(); //
    const page = await context.newPage(); // 
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    console.log(await page.title());

    await page.locator("#username").type("rahulshetty");
    await page.locator("[type='password']").type("learning");
    await Promise.all([
        await page.waitForNavigation(), 
        await page.locator("#signInBtn").click()
    ]); // if its non service oriented
    const incorrect = page.locator("[style*='block']");
    await expect(incorrect).toContainText("Incorrect");
});

test("Login and find items", async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/client");
    await page.locator("#userEmail").type("vikasecundaria@gmail.com");
    await page.locator("[type='password']").type("$Password1");
    await page.locator("input", { hasText:"Login"}).click();
    const items = page.locator("div div h5");
    await page.waitForLoadState("networkidle"); // if the items are loaded with API / service oriented
    console.log(await items.allTextContents());
})


test("Page Context Playwright test", async ({page}) => {
    await page.goto("https://google.com");
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
});
  
test("UI Controls", async ({page}) => {
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
})

test.only("Handling Child New Pages", async ({browser}) => {

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/");
    const username = page.locator("#username");
    const documentLink = page.locator("[href*='documents-request']");  

    const [newPage] = await Promise.all([ // se mais de uma pagina for aberta, é só colocar [newPage, newPage2, etc]

        context.waitForEvent("page"),
        documentLink.click(),

    ])

    const text = await newPage.locator(".red").textContent();
    const arrayText = text.split("@");
    const domain = arrayText[1].split(" ")[0];
    await username.type(domain);
    await page.pause();

    console.log(await page.locator("#username").textContent());
})