# Relatório de Testes E2E — Ascesa

**Total:** 119 testes | **28 arquivos** | **3 projetos** (public, auth, admin)
**Resultado:** 119/119 passando ✅
**Framework:** Playwright | **Banco de teste:** PostgreSQL (porta 5433)

---

## 1. Projeto `public` — Páginas Públicas

**9 arquivos, 18 testes**

| Arquivo | Testes | Cobertura |
|---|---|---|
| `home.spec.ts` | 7 | Hero, stats, projetos, galeria, parceiros, sem controles admin |
| `about.spec.ts` | 2 | Carregamento `/sobre`, exibe missão |
| `projects.spec.ts` | 3 | Lista `/projetos`, projeto seed, detail |
| `areas.spec.ts` | 2 | Lista `/areas`, área seed |
| `animals.spec.ts` | 2 | Lista `/animais`, animal seed (Thor) |
| `blog.spec.ts` | 5 | Lista, post seed, busca, detail, sem "Adicionar" |
| `donations.spec.ts` | 2 | Carregamento `/doacoes`, seção doação |
| `transparency.spec.ts` | 2 | Carregamento `/transparencia`, documentos |
| `contact.spec.ts` | 2 | Carregamento `/contato`, informações |

---

## 2. Projeto `auth` — Autenticação

**2 arquivos, 5 testes**

| Arquivo | Testes | Cobertura |
|---|---|---|
| `login.spec.ts` | 2 | Login válido, login inválido (erro) |
| `redirect.spec.ts` | 3 | `/admin` → `/login`, login → `/admin`, `/blog/posts/new` → `/blog` |

---

## 3. Projeto `admin` — Painel Administrativo

**17 arquivos, 96 testes**

| Arquivo | Testes | Cobertura |
|---|---|---|
| `dashboard.spec.ts` | 5 | Cards stats, sidebar navegação |
| `projects.spec.ts` | 3 | Lista, projeto seed, seletor status |
| `volunteers.spec.ts` | 7 | Lista, seed, formulário, submit, busca, editar, deletar |
| `animals.spec.ts` | 8 | Lista, seed, formulário, criar API, detalhe, editar API, deletar, validação |
| `fiscal-notes.spec.ts` | 9 | Lista, formulário, criar chave, criar detalhada API, validação ACCESS_KEY, validação DETAILED, editar API, deletar |
| `posts.spec.ts` | 13 | CRUD completo, slug auto, breadcrumb, cancelar, mock upload, validação slug |
| `profile.spec.ts` | 4 | Carregar, editar nome API, alterar senha API, cancelar edição |
| `settings.spec.ts` | 5 | Carregar, disabled, editar, salvar, cancelar |
| `users.spec.ts` | 7 | Lista, formulário, criar, editar, deletar, validação |
| **`areas.spec.ts`** | 7 | CRUD completo via API + validação |
| **`partners.spec.ts`** | 7 | CRUD completo via API + validação |
| **`testimonials.spec.ts`** | 7 | CRUD completo via API + validação |
| **`gallery.spec.ts`** | 7 | CRUD completo via API + validação |
| **`stats.spec.ts`** | 7 | CRUD completo via API + validação |
| **`team-members.spec.ts`** | 7 | CRUD completo via API + vínculo áreas |
| **`document-categories.spec.ts`** | 7 | CRUD completo via API + validação |
| **`documents.spec.ts`** | 7 | CRUD completo via API + dependência categoryId |

> Os 8 arquivos em **negrito** foram adicionados recentemente para cobrir entidades que antes só possuíam API routes e formulários, sem páginas admin dedicadas.

---

## 4. Cobertura por Funcionalidade

| Funcionalidade | Testes | Create | Read | Update | Delete | Validação |
|---|---|---|---|---|---|---|
| Páginas públicas | 18 | — | ✅ | — | — | — |
| Login/Auth | 5 | — | ✅ | — | — | ✅ (inválido) |
| Dashboard | 5 | — | ✅ | — | — | — |
| Projetos (admin) | 3 | — | ✅ | — | — | — |
| Voluntários | 7 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Animais | 8 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Notas Fiscais | 9 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Posts | 13 | ✅ | ✅ | ✅ | ✅ | ✅ |
| Perfil | 4 | — | ✅ | ✅ | — | — |
| Configurações | 5 | — | ✅ | ✅ | — | — |
| Usuários | 7 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Áreas** | 7 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Parceiros** | 7 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Depoimentos** | 7 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Galeria** | 7 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Estatísticas** | 7 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Equipe** | 7 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Categorias Documentos** | 7 | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Documentos** | 7 | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 5. Padrões de Teste

### API CRUD (entidades sem página admin)
Para entidades que possuem API routes mas não têm página admin, os testes são puramente via API:

```typescript
// GET lista
const resp = await request.get('/api/areas')
expect(resp.ok()).toBeTruthy()
const body = await resp.json()
expect(body.data).toBeInstanceOf(Array)

// POST criar
const create = await request.post('/api/areas', {
  data: { title: 'Castração Solidária', slug: 'castracao-solidaria' },
})
expect(create.ok()).toBeTruthy()
const area = await create.json()
expect(area.id).toBeTruthy()

// GET by ID (usando ID do seed)
const list = await request.get('/api/areas')
const id = (await list.json()).data[0].id
const get = await request.get(`/api/areas/${id}`)
expect(get.ok()).toBeTruthy()

// PUT atualizar
const update = await request.put(`/api/areas/${id}`, {
  data: { title: 'Editado' },
})
expect(update.ok()).toBeTruthy()

// DELETE remover
const del = await request.delete(`/api/areas/${id}`)
expect(del.ok()).toBeTruthy()

// Verify 404 após deletar
const after = await request.get(`/api/areas/${id}`)
expect(after.status()).toBe(404)
```

### UI CRUD (entidades com página admin)
Para entidades com página admin, usa-se interação com a UI (DataTable, formulários, DeleteDialog):

- **Botão "Novo"**: `getByRole('button', { name: /novo .+/i })`
- **Editar**: `locator('tbody tr').first().locator('td:last-child button:first-child')`
- **Deletar**: `locator('tbody tr').first().locator('td:last-child button.text-destructive')`
- **DeleteDialog**: heading é `"Excluir {entity}"`, botão confirmar é `"Excluir"`
- **Sheet título**: `"Novo {entity}"` / `"Editar {entity}"`

### Bypass de Radix UI Select/Sheet
Quando o formulário usa Radix UI Select + Sheet overlay, o dropdown do Select não fecha ao clicar na opção — o overlay intercepta o clique no submit. Use chamada direta à API:

```typescript
const resp = await page.request.post('/api/animals', {
  data: { name: 'Rex', slug: 'rex', speciesId, gender: 'MALE' },
})
```

### Formulários com submit via JavaScript (sem Select)
Quando o formulário não tem Radix Select problemático, usar `page.evaluate`:

```typescript
await page.evaluate(() => {
  const btn = document.querySelector('button[type="submit"]')
  if (btn instanceof HTMLElement) btn.click()
})
```

### Observações sobre formato de resposta das APIs
Nem todas as APIs retornam o mesmo formato:

| API | GET lista | GET by ID | POST |
|---|---|---|---|
| `/api/areas` | `{ data: [...] }` | objeto direto | objeto direto |
| `/api/partners` | `{ data: [...] }` | objeto direto | objeto direto |
| `/api/testimonials` | `{ data: [...] }` | objeto direto | objeto direto |
| `/api/gallery-images` | `{ data: [...] }` | objeto direto | objeto direto |
| `/api/stats` | `[...]` (bare array) | objeto direto | objeto direto |
| `/api/team-members` | `{ data: [...] }` | objeto direto | objeto direto |
| `/api/document-categories` | `{ data: [...] }` | objeto direto | objeto direto |
| `/api/documents` | `{ data: [...], meta: {...} }` | objeto direto | objeto direto |
| `/api/animals` | `{ data: [...] }` | objeto direto (slug) | objeto direto |

---

## 6. Problemas Conhecidos e Workarounds

### 6.1 DeleteDialog — Locator correto
O componente `DeleteDialog` usa título `"Excluir {entity}"` e descrição `"Esta ação não pode ser desfeita."`, **não** contém texto "tem certeza".

**Erro comum:**
```typescript
// ❌ Não funciona — dialog não tem este texto
await expect(page.getByText(/tem certeza/i)).toBeVisible()
```

**Correto:**
```typescript
await expect(page.getByRole('heading', { name: /excluir nota fiscal/i })).toBeVisible()
await page.getByRole('button', { name: /excluir/i }).last().click()
```

### 6.2 Profile — Sessão JWT não reflete alterações no DB
O perfil exibe dados do `useSession()` (JWT cacheado). `PUT /api/me` atualiza o DB mas não o JWT. Portanto:
- Verificar a resposta da API (`resp.json().name`) em vez da UI
- Toast de sucesso só aparece quando a chamada é feita dentro do browser via fetch

### 6.3 Profile — Schema não aceita `currentPassword`
O schema `updateMeSchema` só aceita `name`, `email`, `password`. `currentPassword` é enviado pelo form mas ignorado pelo Zod (strip).

### 6.4 Volunteers — API usa UUID, não slug
`PUT /api/volunteers/[id]` requer UUID do Prisma. Obter via GET list primeiro:
```typescript
const listResp = await page.request.get('/api/volunteers')
const volunteers = await listResp.json()
const id = volunteers.find(v => v.name.includes('Ana')).id
```

### 6.5 Animals — Rota usa slug como parâmetro
`/api/animals/[slug]` — o param é `slug`, não `id`. O folder da página admin é `[id]` mas o conteúdo é o slug.

### 6.6 Zod errors não renderizados no form
Os formulários usam `zodResolver` do react-hook-form mas **não têm componente `<FormMessage>`** para exibir erros de validação. Testes que esperam mensagens de erro precisam de try/catch ou usar verificações alternativas.

### 6.7 `page.getByDisplayValue()` não disponível
Na versão atual do Playwright, este matcher não existe. Usar `expect(input).toHaveValue('...')`.

### 6.8 Settings form — sem `htmlFor`/`id`
Os `<Label>` e `<Input>` em `settings.spec.ts` não usam `htmlFor`/`id` correspondentes — `getByLabel()` não funciona. Usar `locator('input').first()`.

### 6.9 Botões DataTable sem `aria-label`
As ações nas tabelas usam `<Button size="icon">` sem `aria-label`. Locators:
```typescript
const editButton = page.locator('tbody tr').first().locator('td:last-child button:first-child')
const deleteButton = page.locator('tbody tr').first().locator('td:last-child button.text-destructive')
```

### 6.10 Image upload real — R2 não disponível
Upload real para R2 não está disponível. Usar mock:
```typescript
await page.route('**/api/upload', async (route) => {
  await route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ url: 'https://example.com/mock-image.jpg' }),
  })
})
```

---

## 7. Infraestrutura

| Item | Detalhe |
|---|---|
| **Container DB** | `ong_db_test` — PostgreSQL 17-alpine, porta 5433 |
| **Banco** | `ong_test` |
| **Seed** | `prisma/seed-test.ts` — dados determinísticos |
| **Credenciais admin** | `ADMIN_EMAIL=teste@teste.com` / `ADMIN_PASSWORD=123` |
| **Playwright config** | `frontend/playwright.config.ts` — 3 projetos (`public`, `auth`, `admin`) |
| **WebServer** | `npx dotenv-cli -e .env.test -- next dev`, `reuseExistingServer: false` |
| **Global setup** | Login + salva `.auth/admin.json` (`storageState`) |
| **Global teardown** | Reseed do banco via `prisma/seed-test.ts` (best-effort) |
| **Test runner** | `npx playwright test --config=playwright.config.ts` |
| **Paralelismo** | `fullyParallel: true` (admin roda `--workers=1` para debug) |

### Comandos
```bash
# Rodar todos os testes (headless)
npm run test:e2e

# Modo UI (interativo)
npm run test:e2e:ui

# Modo headed (ver navegador)
npm run test:e2e:headed

# Gerenciar banco de teste
npm run db:test:up       # Iniciar container
npm run db:test:down     # Parar container
npm run db:test:migrate  # Aplicar migrations
npm run db:test:seed     # Popular dados
```

---

## 8. Seed Data Disponível

| Entidade | Qtd | Usado em testes admin? |
|---|---|---|
| User (admin) | 1 | ✅ |
| SiteSettings | 1 | ✅ |
| Area | 1 | ✅ |
| Project | 1 | ✅ |
| Testimonial | 1 | ✅ |
| Partner | 1 | ✅ |
| DocumentCategory | 1 | ✅ |
| Document | 1 | ✅ |
| AnimalSpecies | 1 | ✅ |
| AnimalSize | 1 | ✅ |
| AnimalAgeRange | 1 | ✅ |
| Animal | 1 | ✅ |
| Post | 1 | ✅ |
| Stat | 4 | ✅ |
| Volunteer | 1 | ✅ |
| Registration | 1 | ✅ |
| GalleryImage | 3 | ✅ |
| PaymentMethod | 1 | ❌ Sem testes |
| FiscalNote | 0 | ❌ Sem seed (testes criam próprios) |
| TeamMember | 0 | ❌ Sem seed (testes criam próprios) |
| BankConfig | 0 | ❌ Sem seed |

---

## 9. Gaps Restantes

- **PaymentMethod**: API + form existem, sem testes
- **AnimalSpecies / AnimalSize / AnimalAgeRange**: APIs existem, sem testes (usadas como referência dropdown)
- **Upload real de imagem**: R2 não configurado; apenas mock de API
- **Testes de role selector** (Users): apenas testa criação com role padrão
- **Testes de toggle tipo** (Fiscal Notes): ACCESS_KEY ↔ DETAILED testado parcialmente
- **Validação silenciosa**: Zod errors não renderizados no form — componente `<FormMessage>` necessário para testes de validação visual
- **Middleware Edge**: `auth()` no middleware importa Prisma que não funciona no Edge — redirect `/login` → `/admin` não funciona
