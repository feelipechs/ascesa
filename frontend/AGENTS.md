# Ascesa — Contexto do Projeto

Site institucional da ONG Ascesa, focada em cuidados, resgate e apoio a animais (pets). Atua com resgate e acolhimento, castração solidária, adoção responsável, apoio veterinário, educação e conscientização, entre outros.

## Stack

- **Framework**: Next.js 16 (App Router, `src/app`)
- **Linguagem**: TypeScript (strict)
- **Banco de dados**: PostgreSQL 17 + Prisma 7
- **Validação**: Zod 4
- **Estado servidor**: TanStack Query v5
- **UI**: shadcn/ui (new-york) + Tailwind CSS 4 + Radix UI
- **Animações**: Framer Motion + componentes custom (aurora-text, morphing-text, number-ticker, marquee)
- **Auth**: Better Auth — emailAndPassword, nextCookies plugin, scrypt (via `password.ts`)
- **Upload**: Cloudflare R2 (S3-compatible) com `DELETE /api/upload?url=` endpoint
- **Sanitização**: DOMPurify via `src/lib/sanitize.ts` (usado em post-detail para XSS prevention)
- **Testes E2E**: Playwright
- **Email**: Resend (API de email transacional) + React Email (Componentes) — templates em `src/emails/`
- **Cliente Resend**: `src/lib/resend.ts` — singleton inicializado com `RESEND_API_KEY`

## Estrutura de pastas

```
src/
├── app/
│   ├── (public)/          # Site público (layout com header + footer)
│   │   ├── _sections/     # Componentes exclusivos da home
│   │   ├── about/         # /sobre
│   │   ├── animals/       # /animais
│   │   ├── areas/         # /areas
│   │   ├── blog/          # /blog
│   │   ├── contact/       # /contato
│   │   ├── donations/     # /doacoes
│   │   ├── projects/      # /projetos
│   │   └── transparency/  # /transparencia
│   ├── admin/             # Painel admin (layout com sidebar)
│   │   ├── _sections/     # Componentes exclusivos do admin
│   │   ├── fiscal-notes/  # Notas fiscais (admin e submissões públicas)
│   │   ├── profile/       # Perfil do usuário logado
│   │   ├── projects/      # Projetos/eventos
│   │   ├── settings/      # Configurações do site
│   │   ├── users/         # Usuários admin
│   │   └── volunteers/    # Voluntários e inscrições
│   ├── login/             # Autenticação
│   └── api/               # 27+ rotas de API por entidade
├── components/
│   ├── ui/                # shadcn/ui — nunca editar diretamente
│   ├── admin/             # Componentes exclusivos do admin
│   │   ├── forms/         # Formulários de CRUD (1 por entidade)
│   │   │   └── fields/    # Campos reutilizáveis (TitleField, SlugField, etc.)
│   │   ├── admin-sheet.tsx
│   │   └── admin-actions.tsx
│   ├── layout/            # Header, Footer, UserMenu
│   ├── icons/             # Ícones SVG (social)
│   ├── rich-text-editor/  # Editor Tiptap
│   └── *                  # Componentes reutilizados em 2+ páginas
├── hooks/                 # Custom hooks — TanStack Query por entidade + utilitários
│   ├── animals/
│   ├── fiscal-notes/
│   ├── use-animals-filter.ts  # URL-based filter hook (searchParams, não useState)
│   └── use-profile-mutations.ts  # Profile form state + save via /api/me
├── lib/
│   ├── api/               # 19 clientes HTTP por entidade (fetch wrappers)
│   ├── animal-labels.ts   # Labels PT-BR para enums Animal (species, size, ageRange)
│   ├── api-handler.ts     # apiHandler (público), protectedApiHandler (autenticado), validationError
│   ├── sanitize.ts        # sanitizeHtml() — wrapper DOMPurify
│   ├── prisma.ts          # PrismaClient singleton (PrismaPg adapter)
│   ├── resend.ts          # Cliente Resend singleton + EMAIL_FROM
│   ├── r2.ts              # Upload Cloudflare R2
│   ├── routes.ts          # Mapa centralizado de rotas
│   ├── navigation.ts      # Links de navegação
│   ├── area-icon-map.ts   # Mapa de ícones Lucide para áreas (usar em vez de import * as icons)
│   ├── password.ts        # hashPassword(), verifyPassword() (scrypt)
│   ├── auth-client.ts     # Auth client (signIn, signOut, useSession)
│   ├── utils.ts           # cn(), getErrorMessage(), toSlug(), getPageNumbers()
│   └── utils-date.ts      # dateInputToISO(), nowISO(), toDateInput()
├── providers/             # QueryProvider (TanStack Query, staleTime 60s)
├── schemas/               # Schemas Zod por entidade
├── emails/                # Templates React Email (contact, volunteer-approved, volunteer-rejected)
├── services/              # 20 services Prisma (usados em Server Components e API routes)
├── types/                 # Tipos TypeScript globais (derivados de Prisma GetPayload)
├── generated/prisma/      # Gerado automaticamente — nunca editar
├── auth.ts                # Configuração Better Auth
```

o arquivo `proxy.ts` está no mesmo nível do /src.

## Email (Resend)

### Configuração

- **Env vars**: `RESEND_API_KEY` e `EMAIL_FROM=contato@ascesa.org` nos 3 `.env.*`
- **Cliente**: `src/lib/resend.ts` exporta `resend` (instância) e `EMAIL_FROM`
- **Domínio**: `ascesa.org` deve estar verificado no Resend para enviar em produção

### Templates

Arquivos em `src/emails/` usando React Email (`@react-email/components`):

| Template | Arquivo | Props | Quando dispara |
|---|---|---|---|
| Contato | `contact-email.tsx` | name, email, phone, subject, message | Visitante envia formulário em `/contato` |
| Aprovado | `volunteer-approved-email.tsx` | volunteerName, projectTitle | Admin aprova inscrição via `updateStatus()` |
| Rejeitado | `volunteer-rejected-email.tsx` | volunteerName, projectTitle | Admin rejeita inscrição via `updateStatus()` |

### Serviço

`src/services/email.service.ts` — 3 funções que usam `render()` do React Email + `resend.emails.send()`:

- `sendContactEmail(data)` — envia **para** o email da ONG (vem do `SiteSettings.email`), com `replyTo` do visitante
- `sendApprovedEmail(data)` — envia **para** o email do voluntário
- `sendRejectedEmail(data)` — envia **para** o email do voluntário

### API Route de contato

`POST /api/contact` (pública, sem autenticação):
- Body: `{ name, email, phone?, subject, message }` — validado por `contactSchema` (Zod)
- Busca o email da ONG em `SiteSettings` para definir o destinatário
- Chama `EmailService.sendContactEmail()`
- Retorna `{ status: 200 }` em caso de sucesso

Client fetch: `src/lib/api/contact.ts` — `ContactApi.send(data)`

## Voluntários em Projetos (admin)

### Fluxo anterior (removido)

Voluntários inline nos cards de projeto, com Select disparando mutação imediata no `onValueChange`.

### Fluxo atual

1. **Card de projeto** em `/admin/projects`: mostra título, data, local, badge "X inscritos" e botão "Ver voluntários"
2. **ProjectVolunteersSheet** (`src/app/admin/projects/_sections/project-volunteers-sheet.tsx`): Sheet lateral com DataTable
   - Colunas: Nome (com badge "alterado" se pendente), Email, Telefone, Mensagem, **Status** (Select)
   - Select de status **atualiza estado local** (`pendingChanges: Record<string, string>`), não salva no DB
   - Botão **"Salvar e notificar"** aparece no footer quando há mudanças pendentes
   - Ao clicar: itera sobre `pendingChanges`, chama `updateStatus.mutateAsync()` para cada, invalida cache
   - Sem checkbox — aplica todas as mudanças pendentes
   - Exibe resumo: "2 aprovações, 1 rejeição"
3. **Email é disparado pelo service**, não pelo frontend — `registration.service.ts:updateStatus()` detecta APPROVED/REJECTED e chama `EmailService.sendApprovedEmail()` ou `sendRejectedEmail()`
4. Erros de email são capturados com `.catch()` para não quebrar a atualização do status

### Dados

- `getProjectsWithVolunteers()` em `project.service.ts` agora inclui `message` no select
- `updateStatus()` em `registration.service.ts` faz `include` de `volunteer` e `project` para ter os dados do email

## Convenções adicionais (aplicadas nas correções)

### Nomenclatura de arquivos de seção

| Padrão | Exemplos |
|--------|----------|
| `*-section.tsx` | `home-hero.tsx`, `partners-section.tsx`, `projects-section.tsx`, `stats-section.tsx` |
| `*-content.tsx` | `home-content.tsx`, `about-content.tsx`, `team-content.tsx` |

Todos os arquivos em `_sections/` devem seguir estes padrões. Barrel `index.ts` re-exports são mantidos para padronização mesmo quando não importados externamente.

### Edit forms — Loading gate + wrapper/inner pattern

Forms de edição que dependem de dados do servidor usam o padrão wrapper/inner para evitar `useEffect` + `form.reset()`:

1. **Wrapper** (exported component): faz a query com TanStack Query, mostra `<Skeleton>` enquanto carrega, retorna `null` se não encontrar dados. Só renderiza o inner quando o dado está pronto.
2. **Inner** (private component): recebe dados via props, inicializa `useForm` com `defaultValues` populados diretamente dos props. **Sem `useEffect` + `form.reset()`**.

```tsx
// Wrapper
export function MyForm({ id, ... }: MyFormProps) {
  const isEditing = !!id
  const { data, isLoading } = useQuery(myQueryOptions(id))
  if (isEditing && isLoading) return <Skeleton className="h-96 w-full" />
  if (isEditing && !data) return null
  return <MyFormInner id={id} data={data} ... />
}

// Inner
function MyFormInner({ id, data, ... }: { data: MyData; ... }) {
  const form = useForm({
    defaultValues: { title: data?.title ?? '', ... },
  })
  // ...render form, NO useEffect + form.reset()
}
```

Isso elimina bugs de Select dessincronizado ao reabrir sheets (o Radix Select recebe `undefined` quando o form monta antes dos dados). **Exemplos**: `animal-form.tsx`, `project-form.tsx`.

### publishedAt — Toggle Switch

Todas as entidades com campo `publishedAt` usam o mesmo padrão:
```tsx
<Switch id="published" checked={!!form.watch('publishedAt')} onCheckedChange={(v) => form.setValue('publishedAt', v ? nowISO() : '')} />
```
- Switch ON = `nowISO()` (current timestamp, publicado agora)
- Switch OFF = `''` (convertido para `null` no submit, rascunho)
- NUNCA setar `nowISO()` automaticamente em create/update — o usuário decide

### Datas — `<input type="date">` para Zod

Usar `z.preprocess` com `dateInputToISO()` nos schemas:
```ts
birthDate: z.preprocess(
  (v) => (typeof v === 'string' && v.trim() !== '' ? dateInputToISO(v) : null),
  z.string().datetime({ offset: true }).nullable().optional(),
)
```
Utilitários: `dateInputToISO()` e `toDateInput()` em `src/lib/utils-date.ts`.

### `createSchema` vs `updateSchema`

Forms de criação usam `createSchema`, forms de edição usam `updateSchema` (`.partial()`):
```tsx
const form = useForm({
  resolver: zodResolver(isEditing ? updateSchema : createSchema),
  ...
})
```

### PaymentMethod — Discriminated Union

```ts
export const createPaymentMethodSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('PIX'), ...pixConfigSchema.shape }),
  z.object({ type: z.literal('BANK_TRANSFER'), ...bankConfigSchema.shape }),
  z.object({ type: z.literal('CASH') }),
])
```

### Reorder mutations

Mutations de reorder ficam nos hooks TanStack Query. Componentes NUNCA chamam `Api.reorder()` diretamente nem `queryClient.invalidateQueries()` inline.

O componente passa `onError` callback para resetar optimistic items:
```tsx
reorderMutation.mutate(items, { onError: () => setOptimisticItems(originalItems) })
```

### DeleteDialog — guardar com isAuthenticated

Todo `DeleteDialog` em seções públicas deve ser envolvido em `{isAuthenticated && (...)}`.

### `areaIconMap` em vez de `import * as icons`

Usar `src/lib/area-icon-map.ts` que mapeia `string` → `LucideIcon`, em vez de `import * as icons from 'lucide-react'` com cast dinâmico.

### URL-based filter hooks

Filtros usam URL searchParams (não useState). O hook retorna os filtros como parâmetros de consulta e mantém a URL sincronizada. Valores `'all'` são removidos da URL (ex: `useAnimalsFilter`).

---

## Convenções de código

### Nomenclatura

- **Arquivos e pastas**: `kebab-case` (ex: `area-form.tsx`)
- **Componentes React**: `PascalCase` (ex: `AreaCard`, `AreasGrid`)
- **Funções e variáveis**: `camelCase`
- **Types e interfaces**: `PascalCase`
- **Constantes globais**: `UPPER_SNAKE_CASE`

### Componentes

- Preferir **shadcn/ui** sempre que houver um componente adequado
- Componentes compartilhados ficam em `src/components/` (diretamente, sem subpasta)
- Componentes usados em apenas uma página ficam em `src/app/[rota]/_sections/`
- Componentes admin (forms, sheets, actions) ficam em `src/components/admin/`
- Evitar duplicação: antes de criar um componente novo, verificar se já existe algo reutilizável

### Server vs Client Components

- Padrão: Server Component — não adicionar `'use client'` sem necessidade
- Usar `'use client'` quando: hooks TanStack Query, `useState`, `useEffect`, event handlers
- Nunca converter a `page.tsx` inteira para Client Component — extrair a parte interativa num filho

### API Routes

- Usar sempre `apiHandler` (público) ou `protectedApiHandler` (autenticado) de `src/lib/api-handler.ts`
- Validação Zod com `safeParse` + `validationError(error)` para retornar erros estruturados (`{ error, fields }` status 400)
- DELETE usa `protectedApiHandler` sem role — qualquer usuário autenticado pode deletar
- Exceção: entidade User — todo o CRUD requer `{ role: 'ADMIN' }`
- Sempre validar o body com Zod antes de chamar o Prisma
- Params de rota dinâmica são assíncronos no Next.js 16: `{ params }: { params: Promise<{ id: string }> }` — sempre fazer `const { id } = await params`
- DELETE retorna `new NextResponse(null, { status: 204 })`
- POST retorna `{ status: 201 }`

### TanStack Query v5

- Sempre usar object signature: `useQuery({ queryKey, queryFn })`
- Query key factories obrigatórias por entidade
- `queryOptions()` para configurações reutilizáveis
- Invalidar com `entityKeys.all` após mutações
- Create/update/delete agrupados em `useEntityMutations()`
- Provider: staleTime 60s, retry 1
- Hydration SSR: `prefetchQuery` + `HydrationBoundary` + `dehydrate`

### Zod

- Schemas em `src/schemas/[entity].schema.ts`
- Sempre validar input nas rotas antes de chamar o Prisma
- Usar `safeParse` + `validationError()` (nunca `parse` direto nas rotas)

### Utils

- `src/lib/utils.ts` — client + server: `cn()`, `getErrorMessage()`, `toSlug()`, `getPageNumbers()`
- `src/lib/password.ts` — client + server: `hashPassword()`, `verifyPassword()` (scrypt via Node crypto)
- `src/lib/utils-date.ts` — client + server: `dateInputToISO()`, `nowISO()`, `toDateInput()`
- `src/lib/sanitize.ts` — client: `sanitizeHtml()` usando DOMPurify (usar antes de `dangerouslySetInnerHTML`)
- `src/lib/area-icon-map.ts` — client: mapa `Record<string, LucideIcon>` para ícones de área
- `src/lib/animal-labels.ts` — client: maps e option arrays para enums Animal (speciesLabels, sizeLabels, ageRangeLabels, *Options)
- Antes de criar lógica nova, verificar se já existe uma util adequada

### Tipos

- Tipos de entidades/API em `src/types/index.ts` — derivados de `GetPayload` do Prisma
- Tipos de props ficam no próprio componente, local
- `Document` do Prisma é exportado como `OngDocument` (evita conflito com DOM `Document`)
- Tipos compostos: `EntityWithRelation` (ex: `ProjectWithDetails`, `TeamMemberWithAreas`)
- Tipos de listagem: `EntityListItem` (com select específico)
- Filtros: `EntityFilters` (ex: `ProjectFilters`, `AreaFilters`)
- Tipos genéricos: `ApiResponse<T>`, `PaginatedResponse<T>`

### Rotas e URLs

- Pastas e hrefs internos sempre em inglês (`/about`, `/projects`, `/contact`)
- URLs públicas em português definidas pelos rewrites em `next.config.ts`
- Ao criar uma nova rota, adicionar o par correspondente no `next.config.ts`
- `pathname` retornado pelo Next.js é sempre o caminho interno (EN) — usar EN em qualquer comparação de rota

## Entidades do projeto

| Entidade | Descrição |
|---|---|
| SiteSettings | Configurações globais do site (singleton, id fixo "main") |
| Media | Biblioteca centralizada de imagens (key, hash, url, mimeType, size, dimensions, alt) |
| Area | Áreas de atuação da ONG (resgate, castração, adoção, etc.) |
| Project | Eventos vinculados a uma área. Campos: eventDate, location, vacancies, metrics |
| GalleryImage | Imagens com contexto HOME, PROJECT ou ANIMAL. Cada imagem referencia um Media (mediaId) |
| TeamMember | Membros da equipe, vinculados a áreas via TeamMemberArea |
| TeamMemberArea | Tabela intermediária TeamMember ↔ Area (composite PK) |
| Partner | Parceiros e apoiadores da ONG |
| DocumentCategory | Categorias de documentos institucionais |
| Document | Documentos vinculados a uma categoria (tipo TS: `OngDocument`) |
| User | Usuários admin (ADMIN ou STAFF) — sem registro público |
| Testimonial | Depoimentos standalone (nome, cargo, mensagem) |
| Volunteer | Voluntário cadastrado via formulário público de inscrição em eventos |
| Registration | Inscrição de voluntário em um evento (status: PENDING / APPROVED / REJECTED) |
| Post | Posts do blog (título, slug, excerpt, conteúdo, coverMediaId, autor) |
| Stat | Métricas da home page (label + value + order). Reordenação drag-and-drop |
| Animal | Animais para adoção (species/size/ageRange como enums, gender, breed, status, shelterSince, gallery) |
| PaymentMethod | Métodos de doação (PIX, BANK_TRANSFER, CASH) com config 1:1 |
| PixConfig | Configuração PIX 1:1 com PaymentMethod (key, receiverName, receiverCity) |
| BankConfig | Configuração bancária 1:1 com PaymentMethod (bankName, agency, account) |
| FiscalNote | Notas fiscais (DETAILED ou ACCESS_KEY) — admin gerencia + público submete via mesmo modelo |

### Enums

| Enum | Valores |
|---|---|
| GalleryContext | HOME, PROJECT, ANIMAL |
| Role | ADMIN, STAFF |
| RegistrationStatus | PENDING, APPROVED, REJECTED |
| AnimalGender | MALE, FEMALE |
| AnimalStatus | AVAILABLE, ADOPTED, FOSTERED |
| AnimalSpecies | DOG, CAT, BIRD, RABBIT, HAMSTER, FISH, OTHER |
| AnimalSize | SMALL, MEDIUM, LARGE |
| AnimalAgeRange | PUPPY, ADULT, SENIOR |
| PaymentMethodType | PIX, BANK_TRANSFER, CASH |
| FiscalNoteType | DETAILED, ACCESS_KEY |

### Observações importantes por entidade

**SiteSettings**
- Singleton: `id` sempre `"main"`
- Apenas `GET` e `PUT` com upsert — sem POST nem DELETE

**Media**
- Biblioteca centralizada de imagens (antigas URLs diretas foram substituídas por mediaId)
- Relacionado a: Area (coverMedia), Project (coverMedia), Post (coverMedia), Animal (coverMedia), TeamMember (photoMedia), Partner (logoMedia), GalleryImage (media)

**GalleryImage**
- `mediaId` obrigatório — cada imagem referencia um registro `Media`
- `context: HOME` — imagem da home, `projectId` e `animalId` nulos
- `context: PROJECT` — imagem de projeto, `projectId` obrigatório
- `context: ANIMAL` — imagem de animal, `animalId` obrigatório
- Componente unificado: `src/components/gallery-section.tsx` (`GallerySection`) — usado nas 3 páginas (home, projeto, animal)
- `onDelete: Cascade` em `projectId` e `animalId` — deletar projeto/animal remove suas imagens

**Project**
- Modelo unificado para eventos. Campos eventDate, location, vacancies opcionais (nullable)
- `metrics`: array JSON de `{ label, value }` validado por Zod
- `areaId` obrigatório (vinculado a uma área de atuação)
- `featured`: destaque na home

**TeamMember**
- Vinculado a áreas via `TeamMemberArea` (many-to-many)
- No POST/PUT, receber `areaIds: string[]` e gerenciar as relações com `deleteMany` + `create`

**Testimonial**
- Standalone — sem vínculo com Project ou outras entidades
- Campos: name, role, message (sem foto)

**Volunteer + Registration**
- `Volunteer`: perfil do voluntário (nome, email `@unique`, telefone, birthDate)
- `Registration`: vínculo com evento/projeto (status PENDING/APPROVED/REJECTED, mensagem)
- Fluxo público: formulário de inscrição → upsert Volunteer por email → cria Registration
- Volunteer → Registration: `onDelete: Restrict` (preserva histórico)
- Project → Registration: `onDelete: Cascade` (deletar projeto leva inscrições)
- Constraint única: `@@unique([volunteerId, projectId])`
- Gerenciado pelo admin no dashboard

**Post**
- GET público. CRUD protegido no admin.
- `coverMediaId`: imagem de capa via Media (não coverUrl)

**Stat**
- GET público. CRUD protegido no admin. Reordenação drag-and-drop via `useReorder` + `@dnd-kit`.

**Animal**
- `species`: enum `AnimalSpecies` (obrigatório — DOG, CAT, BIRD, RABBIT, HAMSTER, FISH, OTHER)
- `size`: enum `AnimalSize` (opcional — SMALL, MEDIUM, LARGE)
- `ageRange`: enum `AnimalAgeRange` (opcional — PUPPY, ADULT, SENIOR)
- `gender`: enum `AnimalGender` (MALE, FEMALE)
- `status`: enum `AnimalStatus` (AVAILABLE, ADOPTED, FOSTERED)
- `coverMediaId`: imagem de capa via Media
- `shelterSince`: data de acolhimento (default `now()`)
- `featured`: destaque na home
- `gallery`: imagens via `GalleryImage` com `context: ANIMAL` + `onDelete: Cascade`
- Labels para os enums em `src/lib/animal-labels.ts` (`speciesLabels`, `sizeLabels`, `ageRangeLabels` + `*Options`)
- Os selects do formulário importam os enums de `@/generated/prisma/enums` e as labels de `@/lib/animal-labels`
- Página pública: `/animais` — listagem e detalhes
- Gerenciado inline nas seções públicas via `AdminSheet` + `AdminActions`

**PaymentMethod + PixConfig + BankConfig**
- `PaymentMethod`: tipo (PIX, BANK_TRANSFER, CASH), label, instruções, isActive, displayOrder
- Se tipo PIX: tem `PixConfig` 1:1 (key, receiverName, receiverCity) — PK compartilhada
- Se tipo BANK_TRANSFER: tem `BankConfig` 1:1 (bankName, agency, account, accountType) — PK compartilhada
- `onDelete: Cascade` de PaymentMethod remove PixConfig/BankConfig
- Schema Zod: `z.discriminatedUnion('type', [...])` — campos específicos validados por tipo (PIX: key/receiverName/receiverCity required; BANK_TRANSFER: bankName/agency/account required)

**FiscalNote**
- Modelo unificado para admin e submissão pública (não existe mais `FiscalNoteSubmission` separado)
- `type: DETAILED` — campos cnpj, emissionDate, coo, amount
- `type: ACCESS_KEY` — campo accessKey
- Admin: `/admin/fiscal-notes`
- Público: envia via diálogo em `/doacoes` → `POST /api/fiscal-notes` (público, sem auth)

**User**
- Criado apenas pelo admin — sem registro público
- Senha armazenada no modelo `Account` (providerId: 'credential'), não no User
- POST: criar User + Account com `hashPassword()` de `src/lib/password.ts`
- PUT: se `password` vier no body, atualizar Account com `hashPassword()`; se não vier, não alterar a senha
- Role: `ADMIN` ou `STAFF`
- Todo CRUD requer `{ role: 'ADMIN' }`
- `protectedApiHandler` recebe `session.user` com `id`, `name`, `email`, `role`

**Document**
- Tipo TypeScript: `OngDocument` (para evitar conflito com `Document` do DOM)

## Páginas públicas

- `/` — Home (animações custom: AuroraText, MorphingText, Number Ticker)
- `/sobre` — Sobre a ONG (dinâmico via SiteSettings)
- `/animais` — Animais para adoção (listagem + detalhes)
- `/projetos` — Projetos/Eventos
- `/areas` — Áreas de atuação com tabs
- `/blog` — Blog com filtros
- `/doacoes` — Doações (métodos de pagamento dinâmicos via PaymentMethod)
- `/transparencia` — Documentos por categoria
- `/contato` — Formulário via Resend

## Painel admin

- Gerencia todas as entidades acima
- Visitantes não têm conta — autenticação é exclusiva para equipe interna
- `ADMIN`: acesso total, incluindo gestão de usuários
- `STAFF`: acesso operacional — Projects, Animals, Volunteers, Registrations, Posts, Stats, FiscalNotes (exceto Users)
- Auth via Better Auth com credenciais (email + senha)

### Páginas admin

- `/admin` — Dashboard (gráficos Recharts, cards de resumo)
- `/admin/fiscal-notes` — Notas fiscais
- `/admin/profile` — Perfil do usuário logado (editar nome, email, senha via `/api/me`)
- `/admin/projects` — Projetos/eventos
- `/admin/settings` — Configurações do site (SiteSettings)
- `/admin/users` — Gestão de usuários (ADMIN only)
- `/admin/volunteers` — Voluntários e inscrições

### Entidades sem página admin dedicada

Gerenciadas inline nas seções públicas via `AdminSheet` + `AdminActions`:
- Areas, Animals, Partners, TeamMembers, Testimonials, Stats, GalleryImages, DocumentCategories, Documents, Posts, PaymentMethods

## Comandos úteis

```bash
npm run dev              # Servidor de desenvolvimento
npm run build            # Build de produção
npm run lint             # Verificar lint (ESLint)
npx tsc --noEmit         # Verificar erros de TypeScript
npm run db:migrate       # Aplicar migrations Prisma
npm run db:seed          # Popular banco com dados iniciais
npm run db:studio        # Interface visual do banco (Prisma Studio)
npm run test:e2e         # Testes E2E (Playwright)
```

## Paleta de cores (modo claro)

| Token | Cor |
|-------|-----|
| `--background` | `oklch(0.98 0.04 105.2)` (amarelo suave) |
| `--foreground` | `#943f00` (marrom escuro) |
| `--primary` | `#f6b30d` (amarelo dourado) |
| `--primary-foreground` | `#941b00` (vermelho-marrom) |
| `--secondary` | `oklch(0.97 0.008 80)` (creme quente) |
| `--muted-foreground` | `#941b00` (vermelho-marrom) |
| `--accent` | `#f5d214` (amarelo vivo) |
| `--border` | `#fe7f16` (laranja) |
| `--ring` | `#f6b30d` (amarelo dourado) |
| `--destructive` | `#d60c0c` (vermelho vivo) |
| `--divider` | `oklch(0.94 0.008 80)` (creme médio) |
| --chart-1/2/3/4/5 | `#f6b30d`, `#fe7f16`, `#943f00`, `#f5d214`, `#941b00` |

Fonte principal: **Quicksand** (Google Fonts via `next/font/google`).
Modo escuro: padrão Shadcn (preto + branco).

## O que evitar

- Não editar `src/generated/prisma/` — gerado automaticamente
- Não editar `src/components/ui/` — componentes shadcn (exceto aurora-text, morphing-text, number-ticker e marquee que são custom)
- Não duplicar lógica de fetch — usar hooks TanStack Query existentes
- Não usar `any` em TypeScript
- Não criar Client Components desnecessários
- Não criar subpastas em `src/components/` para componentes compartilhados (ficam na raiz)
- Não usar `Document` como tipo — usar `OngDocument` para evitar conflito com DOM
- Não chamar `Api.reorder()` diretamente em componentes — usar `useEntityMutations().reorder`
- Não chamar `queryClient.invalidateQueries()` inline — colocar no `onSuccess` da mutation do hook
- Não usar `import * as icons from 'lucide-react'` com cast dinâmico — usar `areaIconMap`
- Não hardcoded route strings — usar `routes.*`
- Não `URL.createObjectURL()` sem `revokeObjectURL()` — memory leak
- Não `dangerouslySetInnerHTML` sem `sanitizeHtml()` — XSS risk
- Não usar `useEffect` + `form.reset()` para popular forms de edição — usar loading gate + wrapper/inner
