# Paginação nas Camadas de API

## Objetivo

Adicionar paginação em todos os endpoints de listagem que podem retornar muitos registros para o usuário, evitando sobrecarga de dados na resposta.

## Prioridades

| Prioridade | Endpoint | Motivo |
|------------|----------|--------|
| Alta | `GET /api/users` | Admin, pode crescer |
| Alta | `GET /api/volunteers` | Admin, pode crescer |
| Alta | `GET /api/registrations` | Admin, pode crescer |
| Alta | `GET /api/fiscal-notes` | Admin, submissão pública |
| Média | `GET /api/testimonials` | Público, curadoria mantém pequeno |
| Média | `GET /api/partners` | Público, curadoria mantém pequeno |
| Média | `GET /api/team-members` | Público, curadoria mantém pequeno |
| Baixa | Areas, gallery-images, stats, payment-methods | Naturalmente pequenos, sem necessidade |

---

## Passo 1 — Schema de paginação reutilizável

Criar `src/schemas/pagination.schema.ts`:

```ts
import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
})

export type PaginationInput = z.infer<typeof paginationSchema>
```

---

## Passo 2 — Helper de resposta paginada

Criar `src/lib/pagination.ts`:

```ts
import { NextResponse } from 'next/server'

export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export function paginatedResponse<T>(data: T[], meta: PaginationMeta) {
  return NextResponse.json({ data, meta })
}

export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  }
}
```

---

## Passo 3 — Adicionar paginação nos services

### Padrão a aplicar em cada service

```ts
async findAll(filters: XFilters = {}): Promise<PaginatedResponse<X>> {
  const page = filters.page ?? 1
  const limit = filters.limit ?? 12
  const skip = (page - 1) * limit

  const where: Prisma.XWhereInput = { /* filtros */ }

  const [data, total] = await Promise.all([
    prisma.x.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.x.count({ where }),
  ])

  return {
    data,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  }
}
```

### Alta prioridade

**UserService.findAll()** — aceitar `{ page?, limit? }`:

```ts
async findAll(filters?: { page?: number; limit?: number }) {
  const page = filters?.page ?? 1
  const limit = filters?.limit ?? 20
  const skip = (page - 1) * limit

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: { id: true, email: true, name: true, role: true, createdAt: true, updatedAt: true },
    }),
    prisma.user.count(),
  ])

  return { data, meta: calculatePaginationMeta(total, page, limit) }
}
```

**VolunteerService.findAll()** — atualmente `(search?)`, mudar para `(search?, page?, limit?)`.

**RegistrationService.findAll()** — atualmente `(filters?)`, mudar para `(filters?, page?, limit?)`.

**FiscalNoteService.findAll()** — atualmente sem parâmetros, adicionar `(page?, limit?)`.

### Média prioridade

Mesmo padrão para TestimonialService, PartnerService, TeamMemberService.

---

## Passo 4 — Extrair query params nas rotas

Em cada rota GET, usar `paginationSchema`:

```ts
export async function GET(req: NextRequest) {
  return protectedApiHandler(async () => {
    const { searchParams } = new URL(req.url)
    const query = Object.fromEntries(searchParams.entries())
    const pagination = paginationSchema.parse(query)

    const result = await UserService.findAll({ page: pagination.page, limit: pagination.limit })
    return paginatedResponse(result.data, result.meta)
  }, { role: 'ADMIN' })
}
```

---

## Passo 5 — Atualizar os tipos `Filters` em `types/index.ts`

Adicionar `page` e `limit` nos filters que ainda não têm:

```ts
export type TeamMemberFilters = {
  search?: string
  page?: number
  limit?: number
}

export type PartnerFilters = {
  search?: string
  page?: number
  limit?: number
}

export type TestimonialFilters = {
  featured?: boolean
  page?: number
  limit?: number
}

export type RegistrationFilters = {
  volunteerId?: string
  projectId?: string
  status?: string
  page?: number
  limit?: number
}

export type VolunteerFilters = {
  search?: string
  page?: number
  limit?: number
}
```

---

## Arquivos a modificar

### Criar
- `src/schemas/pagination.schema.ts`
- `src/lib/pagination.ts`

### Alta prioridade (modificar)
- `src/services/user.service.ts`
- `src/services/volunteer.service.ts`
- `src/services/registration.service.ts`
- `src/services/fiscal-note.service.ts`
- `src/app/api/users/route.ts`
- `src/app/api/volunteers/route.ts`
- `src/app/api/registrations/route.ts`
- `src/app/api/fiscal-notes/route.ts`

### Média prioridade (modificar)
- `src/services/testimonial.service.ts`
- `src/services/partner.service.ts`
- `src/services/team-member.service.ts`
- `src/app/api/testimonials/route.ts`
- `src/app/api/partners/route.ts`
- `src/app/api/team-members/route.ts`

### Tipos
- `src/types/index.ts`

---

## Verificação

```bash
npx tsc --noEmit
npm run lint
```

Checklist:
- [ ] Todos os endpoints de alta prioridade retornam `{ data, meta }`
- [ ] Paginação aplicada no service (skip/take + count)
- [ ] Query params validados com `paginationSchema`
- [ ] Tipos `Filters` atualizados com `page`/`limit`
- [ ] `npx tsc --noEmit` sem erros
