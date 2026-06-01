# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin/fiscal-notes.spec.ts >> Admin Notas Fiscais >> deleta nota fiscal via DeleteDialog
- Location: e2e/admin/fiscal-notes.spec.ts:97:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText(/tem certeza/i)
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText(/tem certeza/i)

```

```yaml
- region "Notifications alt+T"
- dialog "Excluir nota fiscal":
  - heading "Excluir nota fiscal" [level=2]
  - paragraph: Esta ação não pode ser desfeita.
  - button "Cancelar"
  - button "Excluir"
  - button "Close"
```

# Test source

```ts
  9   |   test('abre formulário de nova nota fiscal', async ({ page }) => {
  10  |     await page.goto('/admin/fiscal-notes')
  11  |     await page.getByRole('button', { name: /nova nota fiscal/i }).click()
  12  |     await expect(page.getByRole('heading', { name: 'Nova nota fiscal' })).toBeVisible()
  13  |     await expect(page.getByText('Chave de acesso (44 dígitos)')).toBeVisible()
  14  |   })
  15  | 
  16  |   test('cria nota fiscal tipo Chave de Acesso', async ({ page }) => {
  17  |     await page.goto('/admin/fiscal-notes')
  18  |     await page.getByRole('button', { name: /nova nota fiscal/i }).click()
  19  |     await expect(page.getByRole('heading', { name: 'Nova nota fiscal' })).toBeVisible()
  20  | 
  21  |     await page.getByLabel(/chave de acesso/i).fill('12345678901234567890123456789012345678901234')
  22  |     await page.getByRole('button', { name: /adicionar nota fiscal/i }).click()
  23  | 
  24  |     await expect(page.getByText('Nota fiscal criada').or(page.getByText('criada')).first()).toBeVisible({ timeout: 15000 })
  25  |   })
  26  | 
  27  |   test('cria nota fiscal tipo Nota Detalhada via API', async ({ page }) => {
  28  |     const resp = await page.request.post('/api/fiscal-notes', {
  29  |       data: {
  30  |         type: 'DETAILED',
  31  |         cnpj: '00.000.000/0000-00',
  32  |         coo: '123456',
  33  |         amount: 1500.0,
  34  |       },
  35  |     })
  36  |     expect(resp.ok()).toBeTruthy()
  37  |     await page.goto('/admin/fiscal-notes')
  38  |     await expect(page.getByText('00.000.000/0000-00').first()).toBeVisible({ timeout: 10000 })
  39  |   })
  40  | 
  41  |   test('valida campos obrigatórios ACCESS_KEY', async ({ page }) => {
  42  |     await page.goto('/admin/fiscal-notes')
  43  |     await page.getByRole('button', { name: /nova nota fiscal/i }).click()
  44  |     await expect(page.getByRole('heading', { name: 'Nova nota fiscal' })).toBeVisible()
  45  | 
  46  |     await page.getByRole('button', { name: /adicionar nota fiscal/i }).click()
  47  | 
  48  |     await expect(page.getByText('Chave de acesso deve ter 44 dígitos')).toBeVisible({ timeout: 5000 })
  49  |   })
  50  | 
  51  |   test('valida campos obrigatórios DETAILED', async ({ page }) => {
  52  |     await page.goto('/admin/fiscal-notes')
  53  |     await page.getByRole('button', { name: /nova nota fiscal/i }).click()
  54  |     await expect(page.getByRole('heading', { name: 'Nova nota fiscal' })).toBeVisible()
  55  | 
  56  |     // Switch to DETAILED type, then close dropdown
  57  |     await page.getByRole('combobox').first().click()
  58  |     await expect(page.getByRole('option').first()).toBeVisible({ timeout: 5000 })
  59  |     await page.getByRole('option', { name: /nota detalhada/i }).click()
  60  |     await page.getByRole('heading', { name: 'Nova nota fiscal' }).click()
  61  | 
  62  |     await page.getByRole('button', { name: /adicionar nota fiscal/i }).click()
  63  | 
  64  |     // Zod errors may not render — skip assertion if not visible
  65  |     try {
  66  |       await expect(page.getByText('CNPJ é obrigatório')).toBeVisible({ timeout: 3000 })
  67  |       await expect(page.getByText('COO é obrigatório')).toBeVisible()
  68  |     } catch {
  69  |       // form validation prevents submission silently
  70  |     }
  71  |   })
  72  | 
  73  |   test('edita nota fiscal existente via API', async ({ page }) => {
  74  |     const createResp = await page.request.post('/api/fiscal-notes', {
  75  |       data: {
  76  |         type: 'ACCESS_KEY',
  77  |         accessKey: '99999999999999999999999999999999999999999999',
  78  |       },
  79  |     })
  80  |     const created = await createResp.json()
  81  |     const id = created.id
  82  | 
  83  |     await page.goto('/admin/fiscal-notes')
  84  |     const editButton = page.locator('tbody tr').first().locator('td:last-child button:first-child')
  85  |     await expect(editButton).toBeVisible({ timeout: 5000 })
  86  |     await editButton.click()
  87  | 
  88  |     await expect(page.getByRole('heading', { name: 'Editar nota fiscal' })).toBeVisible()
  89  |     await page.getByLabel(/chave de acesso/i).clear()
  90  |     await page.getByLabel(/chave de acesso/i).fill('11111111111111111111111111111111111111111111')
  91  | 
  92  |     await page.getByRole('button', { name: /salvar alterações/i }).click()
  93  | 
  94  |     await expect(page.getByText('Nota fiscal atualizada').or(page.getByText('atualizada')).first()).toBeVisible({ timeout: 15000 })
  95  |   })
  96  | 
  97  |   test('deleta nota fiscal via DeleteDialog', async ({ page }) => {
  98  |     await page.request.post('/api/fiscal-notes', {
  99  |       data: {
  100 |         type: 'ACCESS_KEY',
  101 |         accessKey: '88888888888888888888888888888888888888888888',
  102 |       },
  103 |     })
  104 | 
  105 |     await page.goto('/admin/fiscal-notes')
  106 |     const deleteButton = page.locator('tbody tr').first().locator('td:last-child button.text-destructive')
  107 |     await expect(deleteButton).toBeVisible({ timeout: 5000 })
  108 |     await deleteButton.click()
> 109 |     await expect(page.getByText(/tem certeza/i)).toBeVisible()
      |                                                  ^ Error: expect(locator).toBeVisible() failed
  110 |     await page.getByRole('button', { name: /confirmar|excluir/i }).last().click()
  111 |     await expect(page.getByText(/tem certeza/i)).not.toBeVisible({ timeout: 10000 })
  112 |   })
  113 | })
  114 | 
```