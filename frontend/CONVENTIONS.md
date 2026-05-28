# Convenções do Projeto

## Nomenclatura de componentes

| Padrão | Quando usar |
|---|---|
| `entity.tsx` | Só renderiza, recebe dados via props |
| `entity-content.tsx` | Fetch + admin + orquestra renderização |
| `entity-card.tsx` | Card de item individual |
| `entity-section.tsx` | Seção dentro de uma página específica, com estado local |
| `entity-form.tsx` | Formulário (em `components/admin/forms/`) |

## Onde colocar

- Usado em 1 página → `src/app/(rota)/_sections/`
- Usado em 2+ páginas → `src/components/`
- Admin (forms, sheets, actions) → `src/components/admin/`
- shadcn/ui → `src/components/ui/` — nunca editar

## Server vs Client

- Padrão: Server Component
- `'use client'` só quando: `useState`, `useEffect`, hooks, event handlers
- Nunca converter `page.tsx` inteira para client

## Tipos

- Tipos de entidades/API → `src/types/index.ts`
- Tipos de props → no próprio componente, local
- Usar tipos do Prisma via `GetPayload` quando possível

## Cores e tema

- Usar variáveis semânticas: `bg-background`, `text-foreground`, etc.

## Rotas e URLs

- Pastas e hrefs internos sempre em inglês (`/about`, `/projects`, `/contact`)
- URLs públicas em português definidas pelos rewrites em `next.config.ts`
- Ao criar uma nova rota, adicionar o par correspondente no `next.config.ts`:
```ts
  { source: '/nova-rota-pt', destination: '/new-route-en' }
```
- `pathname` retornado pelo Next.js é sempre o caminho interno (EN) — usar EN em qualquer comparação de rota (`isActive`, middleware, etc.)
