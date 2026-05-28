# Changelog

## [Unreleased] — 2026-05-16

### Fase 0 — Arquivos-base

#### 0.1 Utilitário de datas (`src/lib/utils-date.ts`)
- Criado arquivo com funções centralizadas usando date-fns:
  - `dateInputToISO(value)`: converte `yyyy-MM-dd` de `<input type="date">` para ISO UTC
  - `nowISO()`: retorna timestamp ISO UTC atual
  - `toDateInput(value)`: converte ISO ou Date para `yyyy-MM-dd`

#### 0.2 Rotas canônicas (`src/lib/routes.ts`)
- Criado objeto `routes` com URLs públicas em português:
  - `/projetos`, `/areas`, `/sobre`, `/contato`, `/transparencia`
  - Funções auxiliares: `project(slug)`, `area(slug)`

#### 0.3 Tratamento de erros Prisma (`src/lib/api-handler.ts`)
- Adicionado `handlePrismaError()` centralizado para códigos:
  - `P2002` (unique constraint) → 409
  - `P2003` (foreign key) → 409 com mensagem clara
  - `P2025` (not found) → 404
  - demais → 500 genérico
- Aplicado em `apiHandler()` e `protectedApiHandler()`

---

### Fase 1 — Bloqueantes

#### C1 — Datas ISO inválidas (crítico)
**Problema:** `formatISO(new Date())` gerava offset local `-03:00`, rejeitado por `z.string().datetime()`.

**Correções:**
- `src/components/admin/forms/person-form.tsx`:
  - `formatISO(parseISO(birthDate))` → `dateInputToISO(birthDate)`
  - Import `format` removido, adicionado `dateInputToISO`
- `src/components/admin/forms/project-form.tsx`:
  - `formatISO(new Date())` → `nowISO()`
  - Import `date-fns` removido, adicionado `nowISO`
- `src/components/admin/forms/document-form.tsx`:
  - `formatISO(new Date())` → `nowISO()`
  - Import `date-fns` removido, adicionado `nowISO`
- Schemas (`person.schema.ts`, `project.schema.ts`, `document.schema.ts`, `area.schema.ts`, `partner.schema.ts`):
  - `z.string().datetime()` → `z.string().datetime({ offset: true })`

#### C2 — Admin pode criar outro Admin (crítico)
**Problema:** `PUT /api/users/[id]` permitia promover qualquer usuário a ADMIN sem verificar unicidade.

**Correção:** `src/app/api/users/[id]/route.ts`
- Adicionada verificação: se `role === ADMIN`, busca outro ADMIN existente
- Se encontrado, retorna 409: "Já existe um administrador. Remova o atual antes de promover outro."

#### C3 — Cast inválido ao desvincular membro (crítico)
**Problema:** `member as TeamMemberWithAreas` em runtime resultava em `areas: undefined`.

**Correção:** `src/app/(public)/areas/_sections/team-section-wrapper.tsx`
- `onDelete` agora busca o membro completo em `allMembers` (que inclui `areas`)
- Cast `as TeamMemberWithAreas` removido

#### A1 — Toast duplicado (alto)
**Problema:** Toast disparava duas vezes (hook + inline) em mutações.

**Correção:** `src/components/admin/forms/site-settings-form.tsx`
- Removido `toast.success()` inline do `onSuccess` da mutation
- Removido import do `sonner`
- Toast agora é único, vindo do hook `useUpdateSettings`

#### A2 — Lista não atualiza sem F5 (alto)
**Problema:** `gallery-section.tsx` e `testimonials-section.tsx` usavam `initialData` + `router.refresh()`, causando piscada visual.

**Correções:**
- `src/app/(public)/projects/_sections/gallery-section.tsx`:
  - `initialData` substituído por `useGalleryImages({ context: 'PROJECT', projectId })`
  - `router.refresh()` removido de `handleSheetClose` e `onSuccess` do delete
  - `useRouter` e imports removidos
- `src/app/(public)/projects/_sections/testimonials-section.tsx`:
  - `initialData` substituído por `useTestimonials({ projectId })`
  - `router.refresh()` removido de `handleSheetClose` e `onSuccess` do delete
  - `useRouter` e imports removidos
- `src/app/(public)/projects/[slug]/page.tsx`:
  - Props `initialData` removidas de GallerySection e TestimonialsSection

---

### Fase 2 — Importantes

#### A3 — Categorias de documento fixas (alto)
**Problema:** `sectionConfig` hardcoded com 4 categorias impedia exibição de categorias criadas dinamicamente.

**Correção:** `src/app/(public)/transparency/_sections/transparency-content.tsx`
- `sectionConfig` substituído por renderização dinâmica a partir de `useDocumentCategories()`
- Mantidos `FALLBACK_ICONS` e `DEFAULT_DESCRIPTIONS` para ícones/descrições padrão por slug
- Categorias sem slug mapeado recebem `<FileText>` como ícone padrão

#### A4 — Erro genérico ao deletar com vínculos (alto)
**Problema:** `deleteArea` com projetos vinculados retornava "Erro interno" sem feedback.

**Correção:** `src/app/api/participations/route.ts`
- Try/catch com `P2002` isolado removido (agora centralizado em `api-handler.ts`)

#### A5 — Rewrites incompletos e links em inglês (alto)
**Correção:** `next.config.ts`
- Adicionados rewrites: `/areas` → `/areas`, `/areas/:path*` → `/areas/:path*`

#### M1 — Inputs de configuração sempre editáveis (médio)
**Correção:** `src/components/admin/forms/site-settings-form.tsx`
- Adicionado estado `isEditing` com `useState(false)`
- Inputs desabilitados quando `!isEditing`
- Botões: "Editar configurações" → "Cancelar" + "Salvar" (toggle)
- `resetForm()` restaura valores originais ao cancelar

#### M2 — Grid da galeria sem hierarquia visual (médio)
**Correções:**
- `src/app/(public)/_sections/gallery-content.tsx`:
  - `buildGallerySections()` substituído por `buildGalleryBlocks()`
  - Blocos de 5 imagens: `left-featured` (1 grande esq + 4 pequenas dir) / `right-featured` (4 pequenas esq + 1 grande dir)
  - Imagens restantes: agrupadas como `singles`
  - Alternância entre left/right a cada bloco
- `src/app/(public)/_sections/gallery.tsx`:
  - Renderização dos novos tipos de bloco com CSS Grid `grid-cols-3 grid-rows-2 h-[500px]`
  - `left-featured`: primeira imagem ocupa 2 colunas × 2 linhas
  - `right-featured`: quinta imagem ocupa 2 colunas × 2 linhas

#### M3 — Select de categoria redundante (médio)
**Correção:** `src/components/admin/forms/document-form.tsx`
- Quando `defaultCategoryId` está preenchido e não é edição: exibe nome da categoria como texto
- Select de categoria aparece apenas quando `defaultCategoryId` não foi fornecido

#### M4 — Re-renderização no filtro de anos (médio)
**Correção:** `src/app/(public)/transparency/_sections/transparency-content.tsx`
- `availableYears` agora calculado a partir de query separada `allDocumentsForYears` (sem filtro de ano)
- Filtro de ano não afeta mais a lista de anos disponíveis

#### M5 — iconName null causa erro (médio)
**Correções:**
- `src/schemas/area.schema.ts`: `iconName` alterado para `z.string().nullable().optional()`
- `src/services/area.service.ts`: parâmetros `iconName` aceitam `string | null`

---

### Fase 3 — Qualidade

#### M7 — Padding inconsistente na página de pessoa (baixo)
**Correção:** `src/app/admin/persons/[id]/page.tsx`
- `space-y-8` → `px-4 lg:px-6 space-y-6` (padrão do painel admin)

#### M8 — Formato de resposta das rotas de API (baixo)
**Problema:** Rotas de listagem inconsistentes: `persons`, `users` e `participations` retornavam raw array.

**Correções:**
- `src/app/api/persons/route.ts` — `NextResponse.json(persons)` → `NextResponse.json({ data: persons })`
- `src/app/api/users/route.ts` — `NextResponse.json(users)` → `NextResponse.json({ data: users })`
- `src/lib/api/users.ts` — `findAll()` desempacota `json.data` para consumers não quebrarem
- `src/app/api/participations/route.ts` — `NextResponse.json(participations)` → `NextResponse.json({ data: participations })`
- `src/lib/api/participations.ts` — `findAll()` desempacota `json.data`

Demais rotas já estavam no padrão `{ data: [...] }`.

#### B2 — Migração para react-hook-form (baixo)
**11 formulários migrados** de `useState` + `useEffect` para `useForm` + `zodResolver`:

| Formulário | Destaques |
|---|---|
| `person-form.tsx` | `Controller` para data de nascimento; `toDateInput`/`dateInputToISO` |
| `project-form.tsx` | `Controller` para Select (areaId); auto-slug via `form.setValue` |
| `document-form.tsx` | Select condicional; form.register para campos simples |
| `area-form.tsx` | `Controller` para IconPicker; auto-slug |
| `partner-form.tsx` | `form.register` puro — migração mais simples |
| `gallery-image-form.tsx` | `form.register` para url, caption, order |
| `testimonial-form.tsx` | `form.register` para name, role, message |
| `team-member-form.tsx` | `form.register` para 5 campos; bio/photoUrl → undefined |
| `document-category-form.tsx` | `Controller` para TitleField/SlugField; auto-slug |
| `user-form.tsx` | Password/role mantidos como useState (não estão nos schemas Zod) |
| `site-settings-form.tsx` | `useForm` com schema Zod; mantido isEditing |

#### B4 — Serviços Prisma (baixo)
**10 services criados**, **18 rotas** refatoradas:

```
src/services/
├── document.service.ts        →  src/app/api/documents/route.ts
│                               →  src/app/api/documents/[id]/route.ts
├── partner.service.ts         →  src/app/api/partners/route.ts
│                               →  src/app/api/partners/[id]/route.ts
├── team-member.service.ts     →  src/app/api/team-members/route.ts
│                               →  src/app/api/team-members/[id]/route.ts
├── gallery-image.service.ts   →  src/app/api/gallery-images/route.ts
│                               →  src/app/api/gallery-images/[id]/route.ts
├── testimonial.service.ts     →  src/app/api/testimonials/route.ts
│                               →  src/app/api/testimonials/[id]/route.ts
├── person.service.ts          →  src/app/api/persons/route.ts
│                               →  src/app/api/persons/[id]/route.ts
├── site-settings.service.ts   →  src/app/api/settings/route.ts
├── document-category.service.ts → src/app/api/document-categories/route.ts
│                               →  src/app/api/document-categories/[id]/route.ts
├── participation.service.ts   →  src/app/api/participations/route.ts
│                               →  src/app/api/participations/[id]/route.ts
└── attendance.service.ts      →  src/app/api/attendances/route.ts
                               →  src/app/api/attendances/[id]/route.ts
```

---

#### Remaining link em inglês — corrigido
**Problema:** `projects/[slug]/page.tsx` usava `href="/projects"` em vez do português.

**Correção:**
- `src/app/(public)/projects/[slug]/page.tsx`:
  - Import adicionado: `{ routes }` de `@/lib/routes`
  - `<Link href="/projects">` → `<Link href={routes.projects}>`

> `areas/[slug]/page.tsx` já usava `href="/areas"` (mesmo em português) — não precisou alterar.

#### Toast duplicado no team-section-wrapper — falso alarme
**Conclusão da auditoria:** O hook `useTeamMemberMutations` já emite o toast. O `onSuccess: () => setPopoverOpen(false)` no componente apenas fecha o popover — **não há toast inline**. O relatório original estava incorreto. Nenhuma ação necessária.

---

### Já estavam corretos (não modificados)
- **B3** — `staleTime: 60s` já configurado em `src/providers/query-provider.tsx`
- **M6** — `orderBy: { order: 'asc' }` já existia em `src/app/api/gallery-images/route.ts`
- **B1** — Badge de ano já implementado em `document-card.tsx`
