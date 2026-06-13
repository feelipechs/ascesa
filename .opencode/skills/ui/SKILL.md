---
name: ui
description: Padrões de componentes e estilos
---

# Padrões de UI

Use este guia sempre que for criar ou modificar componentes, páginas ou seções visuais.

---

## Regra principal: shadcn/ui primeiro

Antes de criar qualquer componente de UI, verificar se o shadcn/ui já oferece algo adequado.
Os componentes ficam em `src/components/ui/` — **nunca editar esses arquivos diretamente**.

Componentes shadcn disponíveis no projeto (principais):
`Button`, `Input`, `Label`, `Select`, `Textarea`, `Card`, `Badge`, `Dialog`, `Sheet`,
`Table`, `Tabs`, `Skeleton`, `Separator`, `Avatar`, `DropdownMenu`, `Form`

Se o componente shadcn existir → usar. Só criar do zero se não houver equivalente.

---

## Onde colocar cada componente

```
src/components/
├── ui/              # shadcn/ui — nunca editar
├── admin/           # Componentes de edição inline — visíveis apenas para usuários autenticados
│   ├── forms/       # Formulários de edição (abertos via Sheet)
│   ├── admin-sheet.tsx
│   └── admin-actions.tsx
└── *                # Componentes reutilizados em 2+ páginas (ex: PageSection, SafeImage, EmptyState)

src/app/[rota]/
└── _sections/       # Componentes usados em apenas uma página
    ├── hero.tsx
    ├── areas-grid.tsx
    └── areas-filters.tsx

**Regra de decisão:**
- Usado em 2+ páginas → `src/components/` (diretamente, sem subpasta)
- Usado em 1 página → `src/app/[rota]/_sections/`
- Exclusivo para usuários autenticados (edição inline) → `src/components/admin/`
- É do shadcn → `src/components/ui/` (não criar, já existe)

---

## Server vs Client Component

**Padrão: Server Component.** Não adicionar `'use client'` sem necessidade.

| Situação | Decisão |
|---|---|
| Página que só exibe dados | Server Component — buscar dados com `fetch` ou Prisma direto |
| Seção com `useState`, `useEffect` | Client Component — adicionar `'use client'` |
| Seção com hooks TanStack Query | Client Component |
| Seção com event handlers (onClick, onChange) | Client Component |
| Formulário | Client Component |
| Componente só visual sem interação | Server Component |

**Nunca** converter a `page.tsx` inteira para Client Component só para usar um hook.
Extrair a parte interativa num componente filho com `'use client'`.

```tsx
// ✅ Correto
// page.tsx (Server Component)
export default function AreasPage() {
  return <main><AreasGrid /></main>  // AreasGrid é 'use client'
}

// ❌ Errado
'use client'
export default function AreasPage() { ... }  // página inteira como client
```

---

## Skeletons de carregamento

Sempre criar um skeleton correspondente a cada grid ou listagem.
Usar o componente `Skeleton` do shadcn (`src/components/ui/skeleton`).

Padrão de skeleton para grids:

```tsx
'use client'
import { Skeleton } from '@/components/ui/skeleton'

export function EntityGridSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="aspect-[3/4] rounded-xl" />
      ))}
    </div>
  )
}
```

Padrão de uso na página:

```tsx
'use client'
import { EntityGridSkeleton } from './_sections/entity-grid-skeleton'

// Dentro do componente que usa TanStack Query:
const { data = [], isLoading } = useEntities()
if (isLoading) return <EntityGridSkeleton />
```

---

## Estrutura padrão de página pública

```tsx
export default function EntityPage() {
  return (
    <main className="min-h-screen">
      {/* Hero da página */}
      <section className="relative overflow-hidden bg-foreground py-24 text-background md:py-32">
        ...
      </section>

      {/* Filtros ou navegação (se houver) */}
      <section className="border-b border-border/50 bg-card py-6">
        ...
      </section>

      {/* Conteúdo principal */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          ...
        </div>
      </section>

      {/* CTA final (se aplicável) */}
      <section className="border-t border-border/50 bg-card py-16 md:py-20">
        ...
      </section>
    </main>
  )
}
```

---

## Componentes reutilizáveis existentes

Antes de criar um card, grid ou componente visual, verificar se já existe em `src/components/`.

Exemplos já existentes:
- **`PageHero`** — hero padrão de páginas internas (badge, heading, descrição)
- **`PageSection`** — container padrão de seções (padding, max-width, borderTop)
- **`SafeImage`** — imagem com fallback e otimização Next.js
- **`ImagePlaceholder`** — placeholder para loading de imagens
- **`EmptyState`** — estado vazio para listas sem dados
- **`VolunteerModal`** — modal de inscrição de voluntário

Ao criar novos componentes reutilizáveis, seguir o padrão: props tipadas, sem lógica de fetch interna (recebe dados via props), exportação nomeada.

```tsx
// ✅ Correto — componente shared recebe dados via props
interface AreaCardProps {
  area: Area
}

export function AreaCard({ area }: AreaCardProps) { ... }

// ❌ Errado — componente shared fazendo fetch próprio
export function AreaCard({ id }: { id: string }) {
  const { data } = useArea(id)  // lógica de fetch não pertence ao componente shared
  ...
}
```

---

Use PageSection quando a seção:

Tem conteúdo contido (não vai de borda a borda)
Precisa de padding vertical + container centralizado com max-width

Não use quando:

O conteúdo precisa ser full-width (carousel, banner, hero, mapa)
O componente filho já tem seu próprio container completo (como o Partners)
É a Home, que tem seções alternadas com estrutura própria

Na dúvida: se for escrever mx-auto max-w-6xl px-4 py-12 à mão, use PageSection.

---

## Convenções de estilo

- **Tailwind CSS** para todo estilo — sem CSS inline ou arquivos `.module.css` por componente
- Usar variáveis semânticas do tema: `bg-background`, `text-foreground`, `border-border`, `text-muted-foreground`
- Evitar cores hardcodadas como `bg-gray-100` — preferir equivalentes do tema
- Classes de responsividade seguem mobile-first: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Espaçamentos de seção: `py-12 sm:py-16 md:py-24` (padrão) ou `py-8 sm:py-12 md:py-16` (compact)
- Container padrão: `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8` (padrão) ou `max-w-7xl` (wide)
- Animações via Framer Motion — não usar `transition-` do Tailwind para animações complexas

---

## Padrão de labels

### Botão de submit (criação)
Sempre **"Adicionar {entidade}"** — nunca "Criar", "Cadastrar", "Novo", "Nova".

```tsx
<Button type="submit">
  {isPending ? 'Salvando...' : isEditing ? 'Salvar alterações' : 'Adicionar projeto'}
</Button>
```

### Botão de submit (edição)
Sempre **"Salvar alterações"**.

Exceção: `SiteSettings` — por ser página dedicada (não modal/sheet), usa "Editar" / "Cancelar" / "Salvar alterações".

### Botão de ação em seções públicas
Sempre apenas **"Adicionar"** (sem o nome da entidade). Usado nos botões de `SectionHeading` ou botões soltos em seções com CRUD inline.

```tsx
<Button size="sm" onClick={handleNew}>
  <Plus className="h-4 w-4 mr-2" />
  Adicionar
</Button>
```

### Título de Sheet/Dialog (criação)
Sempre **"Novo {entidade}"** ou **"Nova {entidade}"** conforme o gênero.

```tsx
<AdminSheet title={editingItem ? `Editar ${entityName}` : `Novo ${entityName}`}>
```

### Toast de sucesso (criação)
Sempre **"{Entidade} criado com sucesso!"** (incluir "com sucesso").

```ts
onSuccess: () => onSuccess('Projeto criado com sucesso!'),
```

### Toast de sucesso (atualização)
Sempre **"{Entidade} atualizado!"**.

### Toast de sucesso (exclusão)
Sempre **"{Entidade} removido."** ou **"{Entidade} removida."**.

### Toast de erro
Sempre **"Falha ao {acao}"**.

```ts
onError: (e) => onError(e, 'criar projeto'),
```

### Delete dialog
Sempre usar **"Excluir"** como verbo — nunca "Remover" (exceto para desvinculação, ex: remover membro de uma área).

### Header do admin (botão de nova entidade)
Sempre **"Novo {entidade}"** / **"Nova {entidade}"**.

### Cancelar
Sempre **"Cancelar"** em todos os formulários, dialogs e sheets.
