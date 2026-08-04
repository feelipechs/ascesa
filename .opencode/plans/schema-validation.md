# Proposta de Validação de Schemas

## Diagnóstico

O projeto possui schemas Zod para validação, mas com inconsistências que precisam ser padronizadas:

### 1. Slugs sem validação de formato

| Schema | Tem regex? |
|--------|-----------|
| `animal.schema.ts` | ✅ `/^[a-z0-9-]+$/` |
| `area.schema.ts` | ❌ |
| `project.schema.ts` | ❌ |
| `post.schema.ts` | ❌ |
| `document-category.schema.ts` | ❌ |

**Ação:** Adicionar `.regex(/^[a-z0-9-]+$/, 'Formato de slug inválido')` em todos.

### 2. Schemas órfãos

`animal-species.schema.ts`, `animal-size.schema.ts`, `animal-age-range.schema.ts` — existem no disco mas **não têm modelos no banco** (são enums fixos) e **não são importados** em lugar nenhum. Verificar com `rg -l` e deletar se confirmado.

### 3. Query params sem validação

`page`, `limit`, `search` e filtros são extraídos manualmente com `Number()` / `.get()` sem Zod. Criar schemas de filtro reutilizáveis:

- `pagination.schema.ts` — `{ page, limit }` com `z.coerce.number()`
- `animal.filters.schema.ts`, `project.filters.schema.ts`, etc.

### 4. Update schemas inconsistentes

Uns usam `.partial()`, outros são manuais:

| Padrão | Schemas |
|--------|---------|
| `.partial()` ✅ | animal, post, testimonial, stat, volunteer |
| Manual ❌ | area, team-member, partner, document-category, document, gallery-image |

**Ação:** Converter todos para `.partial()` do create, exceto registrations, payment-method, user, site-settings (que têm comportamento especial).

### 5. Validações de campos específicos

- `fileUrl` (document) e `websiteUrl` (partner) sem `z.string().url()`
- `phone` sem regex opcional de formato

### 6. Ausência de limites de caracteres

Nenhum campo usa `.max()`. Mesmo sendo apenas usuários autenticados que operam o CRUD, limites previnem erro humano, contas comprometidas e poluição do banco. Para endpoints públicos (contato, inscrição), é ainda mais relevante.

| Campo | Limite proposto | Motivo |
|-------|----------------|--------|
| `name`, `title`, `author` | `max(255)` | Nomes/títulos longos quebram layout |
| `slug` | `max(100)` | Slugs curtas por natureza + URL size |
| `email` | `max(255)` | RFC 5321 |
| `phone` | `max(20)` | Telefone BR formatado (~15 chars) |
| `excerpt`, `description` | `max(500)` | Textos curtos exibidos em cards |
| `message` (contato/inscrição) | `max(2000)` | Público, evitar abuso |
| `bio`, `about`, `mission`, `vision`, `values` | `max(5000)` | Rich text moderado |
| `password` | `min(6).max(128)` | Prevenir payload enorme (hash é fixo) |
| `content` | sem limite | Rich text completo

---

## Proposta de Implementação

### Etapa 1 — Schemas órfãos

```bash
rg -l "animal-species|animal-size|animal-age-range" src/
# Se 0 resultados, deletar
rm src/schemas/animal-species.schema.ts
rm src/schemas/animal-size.schema.ts
rm src/schemas/animal-age-range.schema.ts
```

### Etapa 2 — Slug regex

Adicionar em `area.schema.ts`, `project.schema.ts`, `post.schema.ts`, `document-category.schema.ts`:

```ts
slug: z.string().min(1, 'Slug obrigatório').regex(/^[a-z0-9-]+$/, 'Formato de slug inválido'),
```

### Etapa 3 — Schema de paginação

Criar `src/schemas/pagination.schema.ts`:

```ts
import { z } from 'zod'

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
})
```

### Etapa 4 — Schemas de filtro

Para cada entidade com paginação, criar filtro tipado (ex: `animal.filters.schema.ts`):

```ts
export const animalFiltersSchema = z.object({
  species: z.nativeEnum(AnimalSpecies).optional(),
  size: z.nativeEnum(AnimalSize).optional(),
  ageRange: z.nativeEnum(AnimalAgeRange).optional(),
  gender: z.nativeEnum(AnimalGender).optional(),
  status: z.nativeEnum(AnimalStatus).optional(),
  search: z.string().optional(),
  featured: z.coerce.boolean().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(12),
})
```

### Etapa 5 — Padronizar update schemas

Converter para `.partial()`:

- `area.schema.ts`
- `team-member.schema.ts`
- `partner.schema.ts`
- `document-category.schema.ts`
- `document.schema.ts`
- `gallery-image.schema.ts`

### Etapa 6 — Validar URLs

```ts
// document.schema.ts
fileUrl: z.string().url('URL inválida'),

// partner.schema.ts
websiteUrl: z.string().url('URL inválida').nullable().optional(),
```

### Etapa 7 — Adicionar limites de caracteres

Aplicar `.max()` em todos os schemas, seguindo a tabela do diagnóstico. Exemplos:

```ts
// Antes
name: z.string().min(1, 'Nome obrigatório'),

// Depois
name: z.string().min(1, 'Nome obrigatório').max(255, 'Máximo 255 caracteres'),
```

```ts
// Antes
phone: z.string().optional(),

// Depois
phone: z.string().max(20, 'Telefone inválido').optional(),
```

Atenção especial para campos públicos:
- `contact.schema.ts`: `name` (255), `message` (2000)
- `registration.schema.ts`: `name` (255), `message` (2000)
- `fiscal-note.schema.ts`: `cnpj` (18), `coo` (50), `accessKey` (100)

Senha: ajustar para `min(6).max(128)` em `user.schema.ts` e `user-password.schema.ts`.

## Arquivos envolvidos

- `src/schemas/animal-species.schema.ts` — deletar
- `src/schemas/animal-size.schema.ts` — deletar
- `src/schemas/animal-age-range.schema.ts` — deletar
- `src/schemas/pagination.schema.ts` — criar
- `src/schemas/animal.filters.schema.ts` — criar
- `src/schemas/project.filters.schema.ts` — criar
- `src/schemas/post.filters.schema.ts` — criar
- `src/schemas/document.filters.schema.ts` — criar
- `src/schemas/area.schema.ts` — adicionar slug regex, converter update
- `src/schemas/project.schema.ts` — adicionar slug regex
- `src/schemas/post.schema.ts` — adicionar slug regex
- `src/schemas/document-category.schema.ts` — adicionar slug regex
- `src/schemas/team-member.schema.ts` — converter update
- `src/schemas/partner.schema.ts` — converter update, validar URL
- `src/schemas/document.schema.ts` — converter update, validar URL
- `src/schemas/gallery-image.schema.ts` — converter update
- `src/app/api/animals/route.ts` — usar `animalFiltersSchema`
- `src/app/api/projects/route.ts` — usar `projectFiltersSchema`
- `src/app/api/posts/route.ts` — usar `postFiltersSchema`
- `src/app/api/documents/route.ts` — usar `documentFiltersSchema`
- `src/schemas/animal.schema.ts` — adicionar `max()` em name, slug, breed
- `src/schemas/area.schema.ts` — adicionar `max()` em title, slug, description
- `src/schemas/project.schema.ts` — adicionar `max()` em title, slug, description, location
- `src/schemas/post.schema.ts` — adicionar `max()` em title, slug, excerpt, author
- `src/schemas/contact.schema.ts` — adicionar `max()` em name, subject, message
- `src/schemas/registration.schema.ts` — adicionar `max()` em name, message
- `src/schemas/fiscal-note.schema.ts` — adicionar `max()` em cnpj, coo, accessKey
- `src/schemas/volunteer.schema.ts` — adicionar `max()` em name, phone
- `src/schemas/user.schema.ts` — adicionar `max(128)` na password
- `src/schemas/user-password.schema.ts` — adicionar `max(128)` na newPassword
- `src/schemas/testimonial.schema.ts` — adicionar `max()` em name, role, message
- `src/schemas/team-member.schema.ts` — adicionar `max()` em name, role, bio
- `src/schemas/partner.schema.ts` — adicionar `max()` em name
- `src/schemas/document-category.schema.ts` — adicionar `max()` em name, slug
- `src/schemas/document.schema.ts` — adicionar `max()` em title, description
- `src/schemas/site-settings.schema.ts` — adicionar `max()` em phone, address, cnpj, mission, vision, about, values, social links
- `src/schemas/stat.schema.ts` — adicionar `max()` em label, value
- `src/schemas/payment-method.schema.ts` — adicionar `max()` em todos os campos string

---

## Verificação

```bash
npx tsc --noEmit
npm run lint
```
