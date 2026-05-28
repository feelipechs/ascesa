# Arquitetura do Projeto Frontend

## Visão Geral

Este é um projeto **Next.js** utilizando **App Router**, com autenticação via NextAuth (v5), Prisma como ORM, e TanStack Query para gerenciamento de estado de dados.

---

## Estrutura de Pastas

```
frontend/
├── src/
│   ├── app/                    # Páginas e rotas (App Router)
│   ├── assets/                 # Recursos estáticos (SVG, imagens)
│   ├── auth.ts                 # Configuração NextAuth (v5)
│   ├── components/             # Componentes React
│   ├── data/                   # Dados estáticos
│   ├── generated/              # Código gerado (Prisma)
│   ├── hooks/                 # Hooks personalizados (TanStack Query)
│   ├── lib/                   # Utilitários e configurações
│   ├── providers/             # Providers React
│   ├── schemas/               # Schemas de validação (Zod)
│   ├── services/              # Serviços de acesso ao banco (Prisma)
│   └── types/                 # Tipos TypeScript
├── public/                    # Arquivos públicos estáticos
```

---

## `/src/app` - Páginas e Rotas

```
app/
├── layout.tsx                  # Layout raiz
├── globals.css                # Estilos globais
│
├── (home)/                   # Grupo de rotas - Home
│   ├── page.tsx
│   └── _sections/
│       ├── gallery.tsx
│       ├── hero.tsx
│       ├── impact-banner.tsx
│       ├── projects-carousel.tsx
│       └── supporters.tsx
│
├── admin/                    # Painel administrativo
│   ├── page.tsx
│   ├── data.json
│   └── _sections/
│       ├── app-sidebar.tsx
│       ├── chart-area-interactive.tsx
│       ├── data-table.tsx
│       ├── nav-documents.tsx
│       ├── nav-main.tsx
│       ├── nav-secondary.tsx
│       ├── nav-user.tsx
│       ├── section-cards.tsx
│       └── site-header.tsx
│
├── api/                      # API Routes
│   ├── areas/
│   │   ├── route.ts
│   │   └── [id]/route.ts
│   ├── auth/[...nextauth]/
│   │   └── route.ts
│   └── projects/
│       ├── route.ts
│       └── [id]/route.ts
│
├── areas/                   # Página de Áreas
│   ├── page.tsx
│   ├── _sections/
│   │   ├── area-card.tsx
│   │   ├── areas-filters.tsx
│   │   ├── areas-grid.tsx
│   │   ├── areas-pagination.tsx
│   │   └── related-projects.tsx
│   └── [slug]/page.tsx
│
├── projetos/                # Página de Projetos
│   ├── page.tsx
│   ├── _sections/
│   │   ├── projects-filters.tsx
│   │   ├── projects-grid.tsx
│   │   ├── projects-grid-skeleton.tsx
│   │   └── projects-pagination.tsx
│   └── [slug]/page.tsx
│
├── sobre/                   # Página Sobre
│   ├── page.tsx
│   └── _sections/
│       ├── history.tsx
│       ├── mission-vision-values.tsx
│       └── team.tsx
│
├── contato/                # Página Contato
│   ├── page.tsx
│   └── _sections/
│       ├── contact-form.tsx
│       ├── contact-info.tsx
│       └── contact-map.tsx
│
├── transparencia/           # Página Transparência
│   └── page.tsx
│
└── login/                  # Página Login
    ├── page.tsx
    └── _sections/
        └── login-form.tsx
```

---

## `/src/components` - Componentes

```
components/
├── admin/                   # Componentes do Admin
│   ├── admin-actions.tsx
│   ├── admin-sheet.tsx
│   └── forms/
│       ├── area-form.tsx
│       ├── document-form.tsx
│       └── project-form.tsx
│
├── layout/                  # Componentes de Layout
│   ├── header.tsx
│   └── footer.tsx
│
├── shared/                  # Componentes Compartilhados
│   └── project-card.tsx
│
├── ui/                     # Componentes UI (estilo shadcn/ui)
│   ├── avatar.tsx
│   ├── badge.tsx
│   ├── breadcrumb.tsx
│   ├── button.tsx
│   ├── card.tsx
│   ├── carousel.tsx
│   ├── chart.tsx
│   ├── checkbox.tsx
│   ├── collapsible.tsx
│   ├── combobox.tsx
│   ├── command.tsx
│   ├── dialog.tsx
│   ├── drawer.tsx
│   ├── dropdown-menu.tsx
│   ├── field.tsx
│   ├── input.tsx
│   ├── input-group.tsx
│   ├── label.tsx
│   ├── multi-select.tsx
│   ├── navigation-menu.tsx
│   ├── pagination.tsx
│   ├── popover.tsx
│   ├── progress.tsx
│   ├── select.tsx
│   ├── separator.tsx
│   ├── sheet.tsx
│   ├── sidebar.tsx
│   ├── skeleton.tsx
│   ├── sonner.tsx
│   ├── spinner.tsx
│   ├── table.tsx
│   ├── tabs.tsx
│   ├── textarea.tsx
│   ├── toggle.tsx
│   ├── toggle-group.tsx
│   └── tooltip.tsx
│
├── shadcn-studio/
│   └── logo.tsx
│
├── theme-provider.tsx
└── theme-toggle.tsx
```

---

## `/src/hooks` - Hooks Personalizados

```
hooks/
├── areas/                    # Queries de Áreas
│   └── queries.ts
│
├── documents/                # Queries de Documentos
│   └── queries.ts
│
├── projects/                 # Queries de Projetos
│   └── queries.ts
│
├── use-areas-filter.ts
├── use-mobile.ts
├── use-pagination.ts
├── use-projects-filter.ts
```

---

## `/src/lib` - Utilitários

```
lib/
├── api/                    # Funções de API (cliente)
│   ├── areas.ts
│   ├── documents.ts
│   └── projects.ts
│
├── api-handler.ts
├── prisma.ts              # Cliente Prisma
├── utils.ts
├── areas-data.ts
├── projects-data.ts
└── transparency-data.ts
```

---

## `/src/providers` - Providers React

```
providers/
└── query-provider.tsx      # TanStack Query Provider
```

---

## `/src/schemas` - Schemas de Validação (Zod)

```
schemas/
├── area.schema.ts
├── project.schema.ts
└── document.schema.ts
```

---

## `/src/services` - Serviços de Banco de Dados

```
services/
├── area.service.ts
├── project.service.ts
└── document.service.ts
```

---

## `/src/types` - Tipos TypeScript

```
types/
└── index.ts                # Tipos compartilhados do projeto
```

---

## `/src/generated` - Código Gerado

```
generated/
└── prisma/               # Cliente Prisma gerado
    ├── browser.ts
    ├── client.ts
    ├── commonInputTypes.ts
    ├── enums.ts
    ├── internal/
    └── models/
```

---

## Arquivos de Configuração

- `auth.ts` - Configuração do NextAuth (v5) com provider Credentials e proteção argon2

---

## Tecnologias Principais

- **Framework**: Next.js 14+ (App Router)
- **Linguagem**: TypeScript
- **ORM**: Prisma
- **Autenticação**: NextAuth.js (v5)
- **Estado/ Dados**: TanStack Query
- **Validação**: Zod
- **UI**: shadcn/ui pattern
- **Estilização**: Tailwind CSS
