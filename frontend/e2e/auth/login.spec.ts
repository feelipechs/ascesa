import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test('login com credenciais válidas', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'teste@teste.com')
    await page.fill('input[name="password"]', '123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/admin/)
  })

  test('login com credenciais inválidas', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'wrong@email.com')
    await page.fill('input[name="password"]', 'wrongpass')
    await page.click('button[type="submit"]')
    await expect(page.getByText(/email ou senha incorretos/i)).toBeVisible()
  })
})
