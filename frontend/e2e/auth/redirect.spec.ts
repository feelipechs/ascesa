import { test, expect } from '@playwright/test'

test.describe('Redirects de autenticação', () => {
  test('visitante é redirecionado de /admin para /login', async ({ page }) => {
    await page.goto('/admin')
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })

  test('login funcional redireciona para /admin', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'teste@teste.com')
    await page.fill('input[name="password"]', '123')
    await page.click('button[type="submit"]')
    await expect(page).toHaveURL(/\/admin/, { timeout: 15000 })
  })

  test('visitante em /blog/posts/new é redirecionado para /blog', async ({ page }) => {
    await page.goto('/blog/posts/new')
    await expect(page).toHaveURL(/\/blog/, { timeout: 10000 })
  })
})
