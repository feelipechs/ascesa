# Padronização de Formato de Resposta

## Problema

Hoje cada endpoint retorna em um formato diferente:

| Endpoint | Retorno |
|----------|---------|
| `GET /api/animals` | `{ data, meta }` |
| `GET /api/areas` | `{ data: areas }` |
| `GET /api/volunteers` | array direto `[...]` |
| `GET /api/registrations` | array direto `[...]` |

Isso força o frontend a tratar cada endpoint de forma diferente.

## Padrão único

**TODO GET list** retorna `{ data: T[] }` — paginado ou não. Se houver paginação, inclui `meta`.

### Endpoints que já retornam `{ data, meta }` (✅ manter)
- `GET /api/animals`
- `GET /api/projects`
- `GET /api/posts`
- `GET /api/documents`

### Endpoints que retornam `{ data: [...] }` (✅ manter)
- `GET /api/areas`
- `GET /api/team-members`
- `GET /api/testimonials`
- `GET /api/partners`
- `GET /api/gallery-images`
- `GET /api/stats`
- `GET /api/payment-methods`
- `GET /api/fiscal-notes`
- `GET /api/users`

### Endpoints que retornam array direto (❌ corrigir)
- `GET /api/volunteers` → `{ data: volunteers }`
- `GET /api/registrations` → `{ data: registrations }`

## Implementação

### Apenas nos arquivos de rota

```ts
// volunteers/route.ts — antes
return NextResponse.json(volunteers)

// depois
return NextResponse.json({ data: volunteers })
```

```ts
// registrations/route.ts — antes
return NextResponse.json(registrations)

// depois
return NextResponse.json({ data: registrations })
```

### Arquivos a modificar

- `src/app/api/volunteers/route.ts`
- `src/app/api/registrations/route.ts`

### Verificação

```bash
npx tsc --noEmit
npm run lint
```

Verificar também os clientes HTTP em `src/lib/api/` que consomem esses endpoints — podem precisar de ajuste se acessavam `response` direto em vez de `response.data`.
