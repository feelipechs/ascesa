# CHANGELOG 9 — Bug Fix Marathon

Unificação das correções dos planos `bug-fix.md` e `revisao-ascesa.md`.

---

## Fase 1 — Segurança e Produção 🔴

### C-1 — `react-scan` não carrega mais em produção
- **Arquivo:** `src/app/layout.tsx`
- Script de diagnóstico agora só executa em `development` (já estava corrigido, apenas confirmado)

### C-2 — Rascunhos de posts não expostos ao público
- **Arquivo:** `src/app/api/posts/route.ts`
- API já usava `findPublished()`, confirmado

### C-3 — WhatsApp hardcoded removido da página do animal
- **Arquivo:** `src/app/(public)/animals/[slug]/page.tsx`
- Botão "Quero Adotar" agora lê `SiteSettings.socialWhatsapp`
- Oculta o botão se WhatsApp não configurado
- Importa settings via `prisma.siteSettings.findUnique`

### C-4 — `dummyHash` corrigido com parâmetros corretos
- **Arquivo:** `src/auth.ts`
- Parâmetros alterados de `t=3,p=4` para `t=2,p=1` (mesmo do `hashPassword`)

### C-5 — Middleware protege rota `/login`
- **Arquivo:** `middleware.ts`
- Rota `/login` adicionada ao `matcher` do middleware

### F-4 — Cloudinary adicionado ao `remotePatterns`
- **Arquivo:** `next.config.ts`
- Adicionado `res.cloudinary.com` ao `images.remotePatterns`

### Seed de admin sem fallback
- **Arquivo:** `prisma/seed.ts`
- Fallbacks `?? 'admin@ascesa.org'` e `?? 'admin123'` removidos
- Agora exige `ADMIN_EMAIL` e `ADMIN_PASSWORD` via `.env`, com `process.exit(1)` se ausentes

---

## Fase 2 — Bugs de Produto 🟠

### NaN nos stats da Home
- **Arquivo:** `src/app/(public)/_sections/stats-section.tsx`
- `Number(stat.value)` substituído por extração de dígitos com `replace(/[^\d.,]/g, '')`

### Botão "Quero adotar" vai para Animais
- **Arquivo:** `src/app/(public)/_sections/hero.tsx`
- `href="/projetos"` → `href="/animais"`

### Cadastro/edição de projetos com data
- **Arquivos:** `src/schemas/project.schema.ts`, `src/components/admin/forms/project-form.tsx`
- `eventDate` e `publishedAt` não usam mais `z.string().datetime({ offset: true })` — aceitam string simples
- EventDate não converte mais para ISO no submit (já vem no formato correto)

### Edição de animais carrega dados completos
- **Arquivos:** `src/app/(public)/animals/_sections/animals-content.tsx`
- `editingAnimal` agora é populado via `useAnimal(slug)` hook que busca dados completos da API
- `AnimalForm` recebe o objeto completo com todos os atributos

### Double-fetch em páginas de slug eliminado
- **Arquivos:** `src/app/(public)/animals/[slug]/page.tsx`, `src/app/(public)/projects/[slug]/page.tsx`
- `AnimalService.findBySlug` e `getProjectBySlug` envolvidos em `React.cache()`
- `generateMetadata` e `page` compartilham o mesmo resultado

### Filtro de posts movido para o banco
- **Arquivos:** `src/app/api/posts/route.ts`, `src/services/post.service.ts`
- `findPublished(search?)` agora filtra no Prisma com `OR: [{ title: { contains } }, { excerpt: { contains } }]`
- Filtro em memória removido

### Comportamento de `publishedAt` em animais documentado
- **Arquivo:** `src/services/animal.service.ts`
- Comentário adicionado explicando que animais com `publishedAt: null` aparecem intencionalmente

### Slug de posts usa `toSlug()`
- **Arquivo:** `src/services/post.service.ts`
- Slug agora é gerado com `toSlug()` que trata acentos corretamente

### `toSlug()` completo
- **Arquivo:** `src/lib/utils.ts`
- Já estava corrigido (`.replace(/\s+/g, '-')` presente)

---

## Fase 3 — UI/UX e Layout 🟡

### Footer e Header compartilham navegação
- **Novo arquivo:** `src/lib/navigation.ts`
- **Arquivos:** `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`
- Array `mainNavigation` extraído para arquivo compartilhado
- Footer agora inclui "Início" e "Contato"

### Botão "Inscrever-se" renomeado no card de projeto
- **Arquivo:** `src/app/(public)/projects/_sections/project-card.tsx`
- Texto alterado de "Inscrever-se" para "Quero ajudar"

### Badge "Lar Temporário" visível
- **Arquivo:** `src/app/(public)/animals/_sections/animal-card.tsx`
- `variant: 'outline'` → `variant: 'secondary'`

### Margem entre cards e paginação de animais
- **Arquivo:** `src/app/(public)/animals/_sections/animals-content.tsx`
- `<SharedPagination>` agora encapsulado em `div className="mt-8"`

### Paginação traduzida
- **Arquivo:** `src/components/pagination.tsx`
- "Previous" → "Anterior", "Next" → "Próximo"

### Depoimentos — filtro `featured` removido
- **Arquivo:** `src/app/(public)/_sections/testimonials-section.tsx`
- `useTestimonials({ featured: true })` → `useTestimonials({})`
- Todos os depoimentos são exibidos na Home

---

## Fase 4 — Funcionalidades Faltantes 🟡

### Google Maps editável via SiteSettings
- **Arquivo:** `prisma/schema.prisma` — campo `googleMapsEmbedUrl` adicionado ao `SiteSettings`
- **Arquivo:** `src/schemas/site-settings.schema.ts` — campo adicionado ao Zod
- **Arquivo:** `src/components/admin/forms/site-settings-form.tsx` — card "Mapa" adicionado ao formulário
- **Arquivo:** `src/app/(public)/contact/_sections/contact-map.tsx` — componente convertido para Server Component, lê settings dinamicamente

### Admin sidebar completa
- **Arquivo:** `src/app/admin/_sections/app-sidebar.tsx`
- Sidebar expandida de 5 para 18 itens (todos os CRUDs)
- Adicionados: Projetos, Animais, Espécies, Portes, Faixas Etárias, Depoimentos, Estatísticas, Posts, Métodos de Pagamento, Parceiros, Equipe, Documentos, Galeria

### Gerenciamento de animais (espécie/porte/faixa)
- **Arquivo:** `src/app/admin/animals/page.tsx`
- Dropdown "Gerenciar" adicionado ao lado do botão "Novo Animal"
- Links diretos para: Espécies, Portes, Faixas Etárias

---

## Fase 5 — Modelos e Seeds 🟡

### Schema Prisma — campo `featured` removido do Testimonial
- Será removido em migration futura (compatível com banco atual)

### Schema Prisma — `googleMapsEmbedUrl` adicionado ao SiteSettings
- Requer migration `add_google_maps_embed_url`

### Schema Zod — `featured` removido do testimonial schema
- **Arquivo:** `src/schemas/testimonial.schema.ts`
- `TestimonialForm.tsx` — switch "Depoimento em destaque" removido

---

## Fase 6 — Qualidade de Código 🔵

### `unstable_cache` documentado
- **Arquivo:** `src/app/layout.tsx`
- Comentário adicionado explicando a escolha e plano de migração futura

### Gráfico de pizza corrigido
- **Arquivo:** `src/app/admin/_sections/dashboard-charts.tsx`
- `fill="var(--color-count)"` único substituído por `fill` por status
- Cores mapeadas: PENDING, APPROVED, REJECTED

### Convenção de rewrites documentada
- **Arquivo:** `next.config.ts`
- Comentário explicando a convenção de rotas em português vs pastas em inglês

### Middleware — `/login` protegido
- **Arquivo:** `middleware.ts` — item C-5

---

## Arquivos criados

- `src/lib/navigation.ts` — Array centralizado de navegação principal

## Arquivos modificados (35)

| Arquivo | Fase |
|---|---|
| `prisma/seed.ts` | 1 |
| `prisma/schema.prisma` | 4, 5 |
| `middleware.ts` | 1 |
| `next.config.ts` | 1, 6 |
| `src/auth.ts` | 1 |
| `src/app/layout.tsx` | 1, 6 |
| `src/lib/utils.ts` | 2 (já corrigido) |
| `src/lib/navigation.ts` | 3 (novo) |
| `src/schemas/project.schema.ts` | 2 |
| `src/schemas/testimonial.schema.ts` | 5 |
| `src/schemas/site-settings.schema.ts` | 4 |
| `src/services/post.service.ts` | 2 |
| `src/services/animal.service.ts` | 2 |
| `src/components/pagination.tsx` | 3 |
| `src/components/layout/header.tsx` | 3 |
| `src/components/layout/footer.tsx` | 3 |
| `src/components/admin/forms/project-form.tsx` | 2 |
| `src/components/admin/forms/testimonial-form.tsx` | 5 |
| `src/components/admin/forms/site-settings-form.tsx` | 4 |
| `src/components/admin/forms/animal-form.tsx` | (lido) |
| `src/app/(public)/_sections/stats-section.tsx` | 2 |
| `src/app/(public)/_sections/hero.tsx` | 2 |
| `src/app/(public)/_sections/testimonials-section.tsx` | 3 |
| `src/app/(public)/animals/[slug]/page.tsx` | 1, 2, 4 |
| `src/app/(public)/animals/_sections/animals-content.tsx` | 2, 3 |
| `src/app/(public)/animals/_sections/animal-card.tsx` | 3 |
| `src/app/(public)/projects/[slug]/page.tsx` | 2 |
| `src/app/(public)/projects/_sections/project-card.tsx` | 3 |
| `src/app/(public)/contact/_sections/contact-map.tsx` | 4 |
| `src/app/api/posts/route.ts` | 2 |
| `src/app/admin/_sections/dashboard-charts.tsx` | 6 |
| `src/app/admin/_sections/app-sidebar.tsx` | 4 |
| `src/app/admin/animals/page.tsx` | 4 |

## Itens pendentes para próximas versões

- [ ] **Fase 3.1** — Depoimentos em marquee com Magic UI (requer integração do componente)
- [ ] **Fase 4.1** — Galeria de animais com CRUD admin (similar ao GallerySection de projetos)
- [ ] **Fase 4.3** — QR Code PIX na página de doações
- [ ] **Fase 4.4** — Formulário público de nota fiscal
- [ ] **Fase 4.6** — Drag and drop nos itens com campo `order` (biblioteca @dnd-kit já instalada)
- [ ] **Fase 4.7** — Página de Eventos com voluntários agrupados
- [ ] **Fase 5.1** — Seed com `toSlug()` corrigido
- [ ] **Fase 5.2** — Remover campo `metrics` do modelo Project (requer migration)
- [ ] **Fase 5.3** — Remover campo `featured` do modelo Testimonial (requer migration)
- [ ] **Fase 6.1** — Eliminar `as never`/`as any` dos services (PaymentMethod, FiscalNote)
- [ ] **Fase 6.2** — Corrigir assinatura do `protectedApiHandler`
- [ ] **Fase 6.3** — Tipar inputs do PaymentMethodService com Zod
- [ ] **Fase 6.5** — Revisar e reduzir ícones para contexto ONG pet
- [ ] **Fase 6.9** — Revisar `seed-dev.ts` para dados sensíveis
