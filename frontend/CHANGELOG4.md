# CHANGELOG — Sessão 4

## DeleteDialog — componente reutilizável

**`src/components/delete-dialog.tsx`** — novo componente que unifica os 9 diálogos de exclusão espalhados pelo projeto.

### Assinatura

```tsx
type DeleteDialogProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  entity: string        // "projeto", "área", etc. (para o título "Excluir {entity}")
  isPending?: boolean
  description?: string  // padrão: "Esta ação não pode ser desfeita."
}
```

### Arquivos refatorados (9)

Cada um substituiu o `<Dialog>` inline por `<DeleteDialog>`:

| Arquivo | `entity` |
|---|---|
| `areas/_sections/areas-content.tsx` | área |
| `_sections/gallery-content.tsx` | imagem |
| `_sections/partners-content.tsx` | parceiro |
| `_sections/projects-content.tsx` | projeto |
| `about/_sections/about-content.tsx` | membro |
| `transparency/_sections/transparency-content.tsx` | documento |
| `admin/users/page.tsx` | usuário |
| `projects/_sections/testimonials-section.tsx` | depoimento |
| `projects/_sections/gallery-section.tsx` | imagem |

Os 2 últimos incluem `router.refresh()` no `onSuccess` da mutation, dentro do próprio `onConfirm`.

---

## DataTable genérico

**`src/components/data-table.tsx`** — refatorado de demo mockado (`Payment`) para componente genérico.

```tsx
type DataTableProps<TData> = {
  columns: ColumnDef<TData>[]
  data: TData[]
  searchKey?: string
  onRowClick?: (row: TData) => void
}
```

### Funcionalidades mantidas
- Busca global
- Ordenação por coluna
- Seleção de linhas (checkbox)
- Paginação com controle de linhas por página (5, 10, 20, 30, 50)
- Seletor de colunas visíveis
- Exportação CSV (valor bruto, sem formatação específica — cada coluna define a sua)

### Mudanças
- `Payment`, `columns` mockados e `DataTableDemo` removidos
- `onRowClick` adicionado ao `TableRow` com classe `cursor-pointer`
- `getColumnLabel()` usa o `header` da coluna (quando string) ou fallback para `column.id`
- Export CSV generalizado (sem formatação hardcoded de `amount`)

---

## Plano A — Attendance (Atendimento Avulso)

### Schema Prisma

```prisma
enum AttendanceOrigin { SPONTANEOUS, REFERRAL, INTERNAL }

model Attendance {
  id        String           @id @default(nanoid())
  personId  String
  person    Person           @relation(fields: [personId], references: [id], onDelete: Cascade)
  areaId    String
  area      Area             @relation(fields: [areaId], references: [id])
  date      DateTime         @default(now())
  origin    AttendanceOrigin @default(SPONTANEOUS)
  referral  String?
  notes     String?
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
}
```

Relações inversas adicionadas em `Person` e `Area`.

### Layers criadas

| Camada | Arquivo |
|---|---|
| Types | `src/types/index.ts` (+ `Attendance`, `AttendanceWithArea`) |
| Zod | `src/schemas/attendance.schema.ts` |
| API GET+POST | `src/app/api/attendances/route.ts` |
| API GET+PUT+DELETE | `src/app/api/attendances/[id]/route.ts` |
| Cliente HTTP | `src/lib/api/attendances.ts` |
| Hooks TanStack | `src/hooks/attendances/queries.ts` |

### API — GET /api/attendances

- Filtros: `personId`, `areaId`, `origin`
- Paginação: `page`, `limit` (default 20, max 50)
- Resposta: `{ data: AttendanceWithArea[], meta: { total, page, limit, totalPages } }`
- Inclui `area: { id, title }`
- Ordenado por `date: desc`
- `protectedApiHandler` sem role (STAFF também gerencia)

---

## Plano C — Admin: Beneficiários

### Sidebar (`app-sidebar.tsx`)

Adicionado `Beneficiários` → `/admin/persons` com ícone `IconUserPlus`.

### Lista (`/admin/persons/page.tsx`)

- `DataTable` genérico com colunas: Nome, Telefone, Data de Nascimento, Responsável
- Busca por nome (`searchKey="name"`)
- Clique na linha → navega para `/admin/persons/[id]`
- Botão "Novo" abre sheet com `PersonForm`

### Detail (`/admin/persons/[id]/page.tsx`)

Três seções:

1. **Dados da Pessoa**: form editável (PersonForm) ou visualização
2. **Participações**: lista de vínculos com projetos (status Ativo/Inativo)
3. **Atendimentos**: lista de atendimentos com data, área, origem
   - Botão "Remover" com DeleteDialog
   - Botão "Novo" abre sheet (placeholder para form completo)

### PersonForm (`src/components/admin/forms/person-form.tsx`)

Formulário com campos: Nome, Data de Nascimento, Responsável, Telefone.

### Dashboard (`section-cards.tsx`)

- Card `Atendimentos` com contagem de `prisma.attendance.count()`
- Ícone `IconCalendarStats`

---

## Plano D — Perfil do Usuário

### API /me (`src/app/api/me/route.ts`)

```ts
GET  /api/me  → dados do usuário logado (sem password)
PUT  /api/me  → atualiza name, email, password (hash com argon2)
```

Usa `protectedApiHandler` sem role. PUT só altera campos enviados no body.

### Profile page (`/admin/profile/page.tsx`)

**Antes:** nome e email `disabled` (só leitura), form de senha separado via `useUpdateUserPassword`.

**Depois:**
- Nome e email: inputs editáveis
- Mutation usa `PUT /api/me` diretamente com `fetch`
- `useSession().update()` chamado após salvar para refletir no header/sidebar
- Senha no mesmo form (precisa de senha atual para alterar)
- Botão único "Salvar alterações" para tudo

### UserMenu (`src/components/user-menu.tsx`)

Adicionados itens:
| Item | Link |
|---|---|
| Painel | `/admin` |
| Perfil | `/admin/profile` |
| Configurações | `/admin/settings` |
| Sair | `signOut()` |

---

## Resumo de arquivos alterados/criados

| Arquivo | Ação |
|---|---|
| `prisma/schema.prisma` | +Attendance +AttendanceOrigin +relações |
| `src/types/index.ts` | +Attendance, AttendanceWithArea |
| `src/schemas/attendance.schema.ts` | **novo** |
| `src/components/delete-dialog.tsx` | **novo** |
| `src/components/data-table.tsx` | refatorado para genérico |
| `src/components/user-menu.tsx` | +Perfil +Configurações |
| `src/components/admin/forms/person-form.tsx` | **novo** |
| `src/app/api/me/route.ts` | **novo** |
| `src/app/api/attendances/route.ts` | **novo** |
| `src/app/api/attendances/[id]/route.ts` | **novo** |
| `src/lib/api/attendances.ts` | **novo** |
| `src/hooks/attendances/queries.ts` | **novo** |
| `src/app/admin/persons/page.tsx` | **novo** |
| `src/app/admin/persons/[id]/page.tsx` | **novo** |
| `src/app/admin/_sections/app-sidebar.tsx` | +Beneficiários |
| `src/app/admin/_sections/section-cards.tsx` | +Atendimentos |
| `src/app/admin/page.tsx` | +attendances count |
| `src/app/admin/profile/page.tsx` | nome/email editáveis via /api/me |
| `src/app/(public)/areas/_sections/areas-content.tsx` | usa DeleteDialog |
| `src/app/(public)/_sections/gallery-content.tsx` | usa DeleteDialog |
| `src/app/(public)/_sections/partners-content.tsx` | usa DeleteDialog |
| `src/app/(public)/projects/_sections/projects-content.tsx` | usa DeleteDialog |
| `src/app/(public)/about/_sections/about-content.tsx` | usa DeleteDialog |
| `src/app/(public)/transparency/_sections/transparency-content.tsx` | usa DeleteDialog |
| `src/app/admin/users/page.tsx` | usa DeleteDialog |
| `src/app/(public)/projects/_sections/testimonials-section.tsx` | usa DeleteDialog |
| `src/app/(public)/projects/_sections/gallery-section.tsx` | usa DeleteDialog |
