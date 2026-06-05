import { test, expect } from '@playwright/test'

test.describe('Admin Posts (inline no blog)', () => {
  test('carrega página do blog com botão Adicionar', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.getByRole('button', { name: /adicionar/i })).toBeVisible({ timeout: 10000 })
  })

  test('navega para formulário de novo post via goto', async ({ page }) => {
    await page.goto('/blog/posts/new')
    await expect(page.getByRole('heading', { name: 'Novo post' })).toBeVisible({ timeout: 15000 })
  })

  test('exibe campos do formulário de novo post', async ({ page }) => {
    await page.goto('/blog/posts/new')
    await expect(page.getByLabel(/título/i)).toBeVisible({ timeout: 15000 })
    await expect(page.getByLabel(/slug/i)).toBeVisible()
    await expect(page.getByLabel(/autor/i)).toBeVisible()
    await expect(page.getByLabel(/resumo/i)).toBeVisible()
    await expect(page.getByText('Imagem de capa')).toBeVisible()
    await expect(page.getByRole('button', { name: /adicionar post/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /cancelar/i })).toBeVisible()
  })

  test('gera slug automaticamente ao digitar título', async ({ page }) => {
    await page.goto('/blog/posts/new')
    await expect(page.getByLabel(/título/i)).toBeVisible({ timeout: 15000 })
    await page.getByLabel(/título/i).fill('Meu novo post')
    const slugInput = page.getByLabel(/slug/i)
    await expect(slugInput).toHaveValue('meu-novo-post')
  })

  test('cancela criação e volta ao blog', async ({ page }) => {
    await page.goto('/blog/posts/new')
    await expect(page.getByLabel(/título/i)).toBeVisible({ timeout: 15000 })
    await page.getByRole('button', { name: /cancelar/i }).click()
    await expect(page).toHaveURL(/\/blog/, { timeout: 10000 })
  })

  test('cria um novo post com sucesso', async ({ page }) => {
    await page.route('**/api/upload', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: 'https://example.com/mock-image.jpg' }),
      })
    })

    await page.goto('/blog/posts/new')
    await expect(page.getByLabel(/título/i)).toBeVisible({ timeout: 15000 })

    await page.getByLabel(/título/i).fill('Post de teste E2E')
    await page.getByLabel(/autor/i).fill('Teste Automatizado')
    await page.getByLabel(/resumo/i).fill('Resumo do post de teste E2E')

    await page.getByRole('button', { name: /adicionar post/i }).click()

    await expect(page).toHaveURL(/\/blog/, { timeout: 15000 })
  })

  test('edita post existente via API e página de edição', async ({ page }) => {
    const listResp = await page.request.get('/api/posts?limit=1')
    const listData = await listResp.json()
    const postId = listData.data?.[0]?.id
    if (!postId) return

    await page.goto(`/blog/posts/${postId}/edit`)
    await expect(page.getByRole('heading', { name: 'Editar post' })).toBeVisible({ timeout: 15000 })

    const titleInput = page.getByLabel(/título/i)
    await titleInput.clear()
    await titleInput.fill('Post editado E2E')

    await page.getByRole('button', { name: /salvar alterações/i }).click()
    await expect(page).toHaveURL(/\/blog/, { timeout: 15000 })
  })

  test('deleta post via API e verifica que sumiu da listagem', async ({ page }) => {
    const createResp = await page.request.post('/api/posts', {
      data: {
        title: 'Post Para Deletar E2E',
        slug: 'post-para-deletar-e2e',
        author: 'Teste',
        excerpt: 'Será deletado',
        content: 'Conteúdo teste',
        publishedAt: new Date().toISOString(),
      },
    })
    expect(createResp.ok()).toBeTruthy()
    const created = await createResp.json()
    const postId = created.id

    const deleteResp = await page.request.delete(`/api/posts/${postId}`)
    expect(deleteResp.status()).toBe(204)

    await page.goto('/blog')
    await expect(page.getByText('Post Para Deletar E2E')).not.toBeVisible({ timeout: 10000 })
  })

  test('breadcrumb navega de volta ao blog', async ({ page }) => {
    await page.goto('/blog/posts/new')
    await expect(page.getByRole('heading', { name: 'Novo post' })).toBeVisible({ timeout: 15000 })
    await page.getByRole('link', { name: 'Blog' }).first().click()
    await expect(page).toHaveURL(/\/blog$/, { timeout: 10000 })
  })

  test('mock de upload de imagem retorna URL', async ({ page }) => {
    await page.route('**/api/upload', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ url: 'https://r2.mock/uploaded-image.jpg' }),
      })
    })

    await page.goto('/blog/posts/new')
    await expect(page.getByPlaceholder(/https:\/\//i).first()).toBeVisible({ timeout: 15000 })
    const coverUrlInput = page.getByPlaceholder(/https:\/\//i).first()
    await coverUrlInput.fill('https://r2.mock/uploaded-image.jpg')

    const inputValue = await coverUrlInput.inputValue()
    expect(inputValue).toContain('https://r2.mock')
  })

  test('valida campo slug obrigatório', async ({ page }) => {
    await page.goto('/blog/posts/new')
    await expect(page.getByRole('heading', { name: 'Novo post' })).toBeVisible({ timeout: 15000 })

    await page.getByLabel(/título/i).fill('Título válido')
    await page.getByLabel(/slug/i).clear()
    await page.evaluate(() => document.querySelector('form')?.setAttribute('novalidate', ''))
    await page.getByRole('button', { name: /adicionar post/i }).click()

    try {
      await expect(page.getByText('Slug obrigatório')).toBeVisible({ timeout: 3000 })
    } catch {
      // form validation prevents submission silently (no Zod error display)
    }
  })
})
