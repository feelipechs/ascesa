import { type Page } from '@playwright/test'

export async function login(page: Page, email = 'teste@teste.com', password = '123') {
  await page.goto('/login')
  await page.fill('input[name="email"]', email)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL('**/admin')
}

export async function goToAdmin(page: Page) {
  await page.goto('/admin')
}
