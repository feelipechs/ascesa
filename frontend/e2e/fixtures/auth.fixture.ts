import { test as base, expect } from '@playwright/test'

type AuthFixture = {
  authenticatedPage: import('@playwright/test').Page
}

export const test = base.extend<AuthFixture>({
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL || 'teste@teste.com')
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD || '123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/admin')
    await use(page)
  },
})

export { expect }
