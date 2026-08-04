# Tipagem nos Where Clauses do Prisma

## Problema

Dois services usam `Record<string, unknown>` para construir filtros, perdendo a tipagem do Prisma:

```ts
// animal.service.ts
const where: Record<string, unknown> = {}

// registration.service.ts
const where: Record<string, unknown> = {}
```

Isso permite passar campos que não existem no schema — o TypeScript não acusa erro, e o erro só aparece em runtime.

## Solução

Substituir por `Prisma.EntityWhereInput`:

```ts
import type { Prisma } from '@/generated/prisma/client'

// animal.service.ts
const where: Prisma.AnimalWhereInput = {}

// registration.service.ts
const where: Prisma.RegistrationWhereInput = {}
```

## Benefícios

- TypeScript valida os campos do filtro
- Autocomplete no editor
- Erro de compilação se passar campo inexistente

## Arquivos a modificar

- `src/services/animal.service.ts` — `Record<string, unknown>` → `Prisma.AnimalWhereInput`
- `src/services/registration.service.ts` — `Record<string, unknown>` → `Prisma.RegistrationWhereInput`
- `src/services/volunteer.service.ts` — verificar se usa, se sim, converter

### Verificação

```bash
npx tsc --noEmit
```
