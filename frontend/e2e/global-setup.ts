import { chromium, type FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0]!.use
  const url = baseURL || 'http://localhost:3000'

  const browser = await chromium.launch()
  const page = await browser.newPage()

  await page.goto(`${url}/login`)

  await page.fill('input[name="email"]', process.env.ADMIN_EMAIL || 'teste@teste.com')
  await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD || '123')
  await page.click('button[type="submit"]')

  await page.waitForURL('**/admin', { timeout: 15000 })

  await page.context().storageState({ path: '.auth/admin.json' })

  await browser.close()
}

export default globalSetup
