---
name: api-layer
description: Guia passo a passo para criar a camada de API de uma entidade existente no schema Prisma
---

# API Layer

Use este guia para criar a camada de API de uma entidade que já existe no schema Prisma.
O schema, tipos e Zod schemas já estão definidos — este guia cobre apenas route handlers, cliente HTTP e hooks.

---

## Estrutura esperada

```
src/
├── app/api/[entities]/
│   ├── route.ts          # GET (lista) + POST (criar)
│   └── [id]/route.ts     # GET (detalhe) + PUT (atualizar) + DELETE (deletar)
├── lib/api/[entities].ts # Cliente HTTP
└── hooks/[entities]/queries.ts  # Hooks TanStack Query
```

---

## 1. Route Handlers

### `src/app/api/entities/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { apiHandler, protectedApiHandler } from '@/lib/api-handler'
import { prisma } from '@/lib/prisma'
import { createEntitySchema } from '@/schemas/entity.schema'

export async function GET(_req: NextRequest) {
  return apiHandler(async () => {
    const entities = await prisma.entity.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(entities)
  })
}

export async function POST(req: NextRequest) {
  return protectedApiHandler(async () => {
    const body = await req.json()
    const data = createEntitySchema.parse(body)
    const entity = await prisma.entity.create({ data })
    return NextResponse.json(entity, { status: 201 })
  })
}
```

### `src/app/api/entities/[id]/route.ts`

```ts
import { NextRequest, NextResponse } from 'next/server'
import { apiHandler, protectedApiHandler } from '@/lib/api-handler'
import { prisma } from '@/lib/prisma'
import { updateEntitySchema } from '@/schemas/entity.schema'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return apiHandler(async () => {
    const { id } = await params
    const entity = await prisma.entity.findUnique({ where: { id } })
    if (!entity) return NextResponse.json({ error: 'Não encontrado' }, { status: 404 })
    return NextResponse.json(entity)
  })
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return protectedApiHandler(async () => {
    const { id } = await params
    const body = await req.json()
    const data = updateEntitySchema.parse(body)
    const entity = await prisma.entity.update({ where: { id }, data })
    return NextResponse.json(entity)
  })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return protectedApiHandler(
    async () => {
      const { id } = await params
      await prisma.entity.delete({ where: { id } })
      return new NextResponse(null, { status: 204 })
    }
  )
}
```

> **Regras:**
> - Rotas públicas (GET) usam `apiHandler`
> - Rotas que modificam dados usam `protectedApiHandler`
> - DELETE usa `protectedApiHandler` sem role, exceto na entidade User onde todo o CRUD requer `{ role: 'ADMIN' }`
> - Sempre validar o body com Zod antes de chamar o Prisma
> - DELETE retorna 204 No Content (sem body)
> - Params de rota dinâmica são Promise no Next.js 16 — sempre `await params`

---

## 2. Cliente HTTP (`src/lib/api/entities.ts`)

```ts
import type { Entity, EntityFilters } from '@/types'
import type { CreateEntityInput, UpdateEntityInput } from '@/schemas/entity.schema'

export const EntitiesApi = {
  async findAll(filters?: EntityFilters): Promise<Entity[]> {
    const params = new URLSearchParams()
    if (filters?.search) params.set('search', filters.search)
    const query = params.toString()
    const res = await fetch(`/api/entities${query ? `?${query}` : ''}`)
    if (!res.ok) throw new Error('Erro ao buscar')
    return res.json()
  },

  async findById(id: string): Promise<Entity> {
    const res = await fetch(`/api/entities/${id}`)
    if (!res.ok) throw new Error('Não encontrado')
    return res.json()
  },

  async create(data: CreateEntityInput): Promise<Entity> {
    const res = await fetch('/api/entities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Erro ao criar')
    return res.json()
  },

  async update(id: string, data: UpdateEntityInput): Promise<Entity> {
    const res = await fetch(`/api/entities/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) throw new Error('Erro ao atualizar')
    return res.json()
  },

  async delete(id: string): Promise<void> {
    const res = await fetch(`/api/entities/${id}`, { method: 'DELETE' })
    if (!res.ok) throw new Error('Erro ao deletar')
  },
}
```

---

## 3. Hooks TanStack Query (`src/hooks/entities/queries.ts`)

```ts
import { useMutation, useQuery, useQueryClient, queryOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { EntitiesApi } from '@/lib/api/entities'
import { getErrorMessage } from '@/lib/utils'
import type { EntityFilters } from '@/types'

// Query key factory — padrão obrigatório
export const entityKeys = {
  all: ['entities'] as const,
  lists: () => [...entityKeys.all, 'list'] as const,
  list: (filters?: EntityFilters) => [...entityKeys.lists(), filters] as const,
  details: () => [...entityKeys.all, 'detail'] as const,
  detail: (id: string) => [...entityKeys.details(), id] as const,
}

export const entitiesQueryOptions = (filters?: EntityFilters) =>
  queryOptions({
    queryKey: entityKeys.list(filters),
    queryFn: () => EntitiesApi.findAll(filters),
  })

export const entityQueryOptions = (id: string | undefined) =>
  queryOptions({
    queryKey: entityKeys.detail(id ?? ''),
    queryFn: () => EntitiesApi.findById(id!),
    enabled: !!id,
  })

export function useEntities(filters?: EntityFilters) {
  return useQuery(entitiesQueryOptions(filters))
}

export function useEntity(id: string) {
  return useQuery(entityQueryOptions(id))
}

// Mutações agrupadas num único hook
export function useEntityMutations() {
  const queryClient = useQueryClient()

  const onSuccess = (message: string) => {
    queryClient.invalidateQueries({ queryKey: entityKeys.all })
    toast.success(message)
  }

  const onError = (error: unknown, action: string) => {
    toast.error(`Falha ao ${action}`, { description: getErrorMessage(error) })
  }

  const create = useMutation({
    mutationFn: EntitiesApi.create,
    onSuccess: () => onSuccess('Criado com sucesso!'),
    onError: (e) => onError(e, 'criar'),
  })

  const update = useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => EntitiesApi.update(id, data),
    onSuccess: () => onSuccess('Atualizado!'),
    onError: (e) => onError(e, 'atualizar'),
  })

  const remove = useMutation({
    mutationFn: EntitiesApi.delete,
    onSuccess: () => onSuccess('Removido.'),
    onError: (e) => onError(e, 'remover'),
  })

  return {
    create,
    update,
    remove,
    isPending: create.isPending || update.isPending || remove.isPending,
  }
}
```

> **Regras TanStack Query:**
> - Sempre usar object signature: `useQuery({ queryKey, queryFn })`
> - Query key factory obrigatória — nunca hardcodar arrays de key inline
> - `queryOptions()` para configs reutilizáveis
> - Invalidar sempre com `entityKeys.all` após mutação
> - Create/update/delete ficam juntos em `useEntityMutations()`

---

## Checklist

- [ ] `src/app/api/entities/route.ts`
- [ ] `src/app/api/entities/[id]/route.ts`
- [ ] `src/lib/api/entities.ts`
- [ ] `src/hooks/entities/queries.ts`
- [ ] `npx tsc --noEmit` sem erros
