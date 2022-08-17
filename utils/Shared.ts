import { expect, Locator, Page } from "@playwright/test";

export class Shared {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto(link: string){
        await this.page.goto(link);
    }

    async login(email: string, password: string){
        await this.page.goto("https://rahulshettyacademy.com/client");
        await this.page.locator('div:has-text("Email")').type(email);
        await this.page.locator("[type='password']").type(password);
        await this.page.locator("input", { hasText: "Login" }).click();
        await this.page.waitForLoadState("networkidle"); // if the items are loaded with API / service oriented
    }

}