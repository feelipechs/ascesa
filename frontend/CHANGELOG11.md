# CHANGELOG 11 — Refactor Plan (P0–P4)

Implementação do `docs/refactor-plan/` — bugs, dead code, violações arquiteturais, inconsistências e cache invalidation.

---

## P0 — Bugs

### #1 — `featured` removido de Testimonial
- **Arquivos:** `src/services/testimonial.service.ts`, `src/app/admin/testimonials/_sections/testimonial-form.tsx`
- Campo `featured` removido dos tipos `createTestimonialInput` e `updateTestimonialInput` no service
- Import `Switch` não utilizado removido do formulário

### #2 — `z.number()` → `z.coerce.number()` em 5 schemas
- **Arquivos:** `src/schemas/animal-species.schema.ts`, `src/schemas/animal-size.schema.ts`, `src/schemas/animal-age-range.schema.ts`, `src/schemas/stat.schema.ts`, `src/schemas/payment-method.schema.ts`
- Campos `order`/`displayOrder` corrigidos de `z.number()` para `z.coerce.number()` (evita rejeitar string de formulários)

---

## P1 — Código Morto

### #6 — `marquee.tsx` deletado
- **Arquivo:** `src/components/marquee.tsx`
- Componente duplicado (substituído pelo de `@/components/ui/marquee`)

### #7 — `shadcn-studio/` deletado
- **Diretório:** `src/components/shadcn-studio/`
- Diretório inteiro removido (dead code)

### #8 — `use-pagination.ts` deletado
- **Arquivo:** `src/hooks/use-pagination.ts`
- Hook não utilizado removido

### #10 — `findByEmail()` removido, `upsertByEmail` mantido
- **Arquivos:** `src/services/volunteer.service.ts`, `src/services/registration.service.ts`
- `VolunteerService.findByEmail()` removido (não utilizado)
- `RegistrationService.publicRegister()` refatorado para usar `VolunteerService.upsertByEmail()` em vez de `prisma.volunteer.upsert` inline

### #12 — 18 `useXxx(id)` wrappers removidos
- **Arquivos:** 18 `queries.ts` em `src/hooks/*/`
- Todos os hooks `useXxx(id)` removidos; consumers migrados para `useQuery(xxxQueryOptions(id))`
- `queryOptions` exportados extraídos em 3 hooks que não os tinham (payment-methods, fiscal-notes, animals)

### #15 — Imports não utilizados removidos
- **Arquivos:** `src/lib/api/documents.ts`, `src/lib/api/projects.ts`
- `OngDocument` removido de documents, `ProjectListItem` removido de projects

---

## P2 — Violações Arquiteturais

### #16 — 6 páginas admin extraídas para `_sections/`
- **Arquivos:** `src/app/admin/{projects,volunteers,users,posts,fiscal-notes,settings}/`
- Conteúdo interativo movido de `page.tsx` para `_sections/xxx-content.tsx` (Client Component)
- `page.tsx` viram Server Components finos que importam e renderizam a section
- Barrel `index.ts` criado em cada `_sections/`

### #17 — `area-icon.tsx` movido para single-use
- **Arquivo:** `src/components/area-icon.tsx` → `src/app/(public)/areas/_sections/area-icon.tsx`
- Import atualizado em `area-card.tsx`

### #18 — `user-menu.tsx` movido para layout/
- **Arquivo:** `src/components/user-menu.tsx` → `src/components/layout/user-menu.tsx`
- Import atualizado em `header.tsx`

### #19 — `ReferenceTab` genérico extraído
- **Arquivo:** `src/app/(public)/animals/_sections/animal-settings-sheet.tsx`
- ~270 linhas de 3 tabs duplicadas (SpeciesTab, SizesTab, AgeRangesTab) reduzidas para ~60 linhas de `ReferenceTab<TEntity>` + 3 instâncias parametrizadas
- Cada tab recebe hook, mutation, form component, label e getNameField via props

### #20 — `animal-references/route.ts` usa services
- **Arquivo:** `src/app/api/animal-references/route.ts`
- `prisma.animalSpecies/Size/AgeRange.findMany()` substituído por `AnimalSpeciesService.findAll()`, `AnimalSizeService.findAll()`, `AnimalAgeRangeService.findAll()` com `Promise.all`

### #21 — Schema `/api/me` extraído para `src/schemas/`
- **Arquivos:** `src/schemas/me.schema.ts` (novo), `src/app/api/me/route.ts`
- `updateMeSchema` e `UpdateMeInput` movidos de inline na route para `me.schema.ts`
- Route importa o schema em vez de defini-lo inline

### #22 — Schemas de reorder extraídos
- **Arquivos:** `src/schemas/stat.schema.ts`, `src/schemas/payment-method.schema.ts`, `src/app/api/stats/reorder/route.ts`, `src/app/api/payment-methods/reorder/route.ts`
- `reorderStatSchema` + `ReorderStatInput` adicionados a `stat.schema.ts`
- `reorderPaymentMethodSchema` + `ReorderPaymentMethodInput` adicionados a `payment-method.schema.ts`
- Rotas reescritas para importar dos schemas

### #24 — Query key `withVolunteers` na factory
- **Arquivos:** `src/hooks/projects/queries.ts`, `src/app/admin/projects/page.tsx`
- `withVolunteers` key adicionada a `projectKeys` factory
- `projectsWithVolunteersQueryOptions()` exportado
- Admin page migrada de `useQuery({ queryKey: ['projects', 'with-volunteers'], ... })` para `useQuery(projectsWithVolunteersQueryOptions())`

### #25 — Volunteer modal usa schema + hook
- **Arquivo:** `src/app/(public)/projects/[slug]/_sections/volunteer-modal.tsx`
- Schema inline `formSchema` substituído por `publicRegistrationSchema` importado de `@/schemas/registration.schema`
- `RegistrationsApi.publicRegister()` direto substituído por `useRegistrationMutations().publicRegister`
- `useState(isSubmitting)` substituído por `isPending` da mutation

---

## P3 — Inconsistências

### #28 — `'use client'` adicionado a 14 hooks
- **Arquivos:** 14 `queries.ts` em `src/hooks/*/`
- `animal-references/queries.ts` já tinha a diretiva
- Adicionado nos demais 14 arquivos que usam `useQuery`/`useMutation`/`useQueryClient`

### #30 — `{ offset: true }` em `z.string().datetime()`
- **Arquivos:** `src/schemas/volunteer.schema.ts`, `src/schemas/team-member.schema.ts`, `src/schemas/stat.schema.ts`, `src/schemas/post.schema.ts`
- Adicionado `{ offset: true }` em todos os `z.string().datetime()` sem opções (evita rejeitar timestamps com timezone)

### #31 — Mensagens Zod em português
- **Arquivos:** 7 schemas (`volunteer`, `stat`, `post`, `registration`, `site-settings`, `user`, `team-member`)
- Adicionadas mensagens customizadas em PT (`'Nome obrigatório'`, `'Email inválido'`, `'Status inválido'`, etc.)

### #32 — Validação `.url()` adicionada
- **Arquivos:** `src/schemas/partner.schema.ts`, `src/schemas/document.schema.ts`, `src/schemas/area.schema.ts`, `src/schemas/post.schema.ts`, `src/schemas/team-member.schema.ts`, `src/schemas/gallery-image.schema.ts`
- `.url()` adicionado em 6 campos de URL
- Campos opcionais usam `.optional().or(z.literal(''))` para aceitar string vazia de formulários

### #34 — `auth()` em `donations/page.tsx`
- **Arquivo:** `src/app/(public)/donations/page.tsx`
- `await auth()` adicionado; `isAuthenticated` passado para `DonationsContent`

### #35 — Imports unificados em barrel
- **Arquivo:** `src/app/(public)/donations/page.tsx`
- `import { DonationsContent } from './_sections/donations-content'` unificado com `import { ... } from './_sections'`

### #36 — Role check redundante removido
- **Arquivo:** `src/app/api/users/route.ts`
- `if (session.user.role !== 'ADMIN')` removido do GET handler (já protegido por `{ role: 'ADMIN' }` no `protectedApiHandler`)

---

## P4 — Cache Invalidation

### #37-38 — Projects `remove` invalida registrations + gallery
- **Arquivo:** `src/hooks/projects/queries.ts`
- `onSuccess` do `remove` mutation agora invalida `registrationKeys.all` e `galleryImageKeys.all` (cascade delete)

### #39-40 — Areas `update`/`remove` invalidam teamMembers + projects
- **Arquivo:** `src/hooks/areas/queries.ts`
- `onSuccess` compartilhado agora invalida `teamMemberKeys.all` e `projectKeys.all`

### #41 — Registrations `updateStatus` invalida volunteers
- **Arquivo:** `src/hooks/registrations/queries.ts`
- `onSuccess` do `updateStatus` mutation agora invalida `volunteerKeys.all`

---

## Tipo de alteração
- [ ] Nova feature
- [x] Refatoração
- [x] Correção
- [ ] Documentação
