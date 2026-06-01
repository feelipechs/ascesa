import { test, expect } from '@playwright/test'

test.describe('Home', () => {
  test('carrega a página inicial', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Ascesa/)
  })

  test('exibe hero com texto principal', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Todo animal')).toBeVisible()
  })

  test('exibe seção de estatísticas', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Animais Resgatados')).toBeVisible()
  })

  test('exibe seção de projetos', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Operação Resgate')).toBeVisible()
  })

  test('exibe galeria', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByAltText('Resgate em ação')).toBeVisible()
  })

  test('exibe seção de parceiros', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByAltText('Clínica Veterinária Patinhas')).toBeVisible()
  })

  test('não exibe controles admin para visitante', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('button', { name: /adicionar/i })).not.toBeVisible()
  })
})
