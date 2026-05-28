# Changelog 7 — Refatoração EducaSurf → Ascesa

Refatoração completa do site: ONG de surf/assistência social → ONG de pets/cuidados/resgate/apoio.

---

## Schema Prisma + Migrations

### Modelos removidos
- `Person`, `Participation`, `Attendance`, `AttendanceOrigin`, `ParticipationStatus`
- `statsOne`/`statsTwo`/`statsThree` de `SiteSettings`

### Modelos adicionados
- `Volunteer` (substitui `Person`) — name, email `@unique`, phone, birthDate
- `Registration` (substitui `Participation`) — status PENDING/APPROVED/REJECTED, `@@unique([volunteerId, projectId])`
- `Post` — title, slug, excerpt, content, coverUrl, author
- `Stat` — label, value, order (métricas da home)
- `ProjectContext` enum — CAMPAIGN, EVENT (unifica projetos e eventos)

### Modelos alterados
- `Project`: +context, eventDate, location, vacancies, metrics (JSON)
- `Volunteer → Registration`: `onDelete: Restrict`
- `Project → Registration`: `onDelete: Cascade`

### Migration
- Migrations antigas removidas
- Nova migration `initial_schema` criada e aplicada
- Prisma Client regenerado em `src/generated/prisma/`

### Seed
- `prisma/seed.ts` reescrito (admin + SiteSettings Ascesa)
- `prisma/seed-dev.ts` reescrito com dados mock:
  - 5 áreas (resgate, castração, adoção, veterinário, educação)
  - 12 projetos (6 campanhas + 6 eventos)
  - 10 membros da equipe
  - 10 voluntários + inscrições em eventos
  - 4 posts de blog
  - 4 métricas (stats)
  - 6 parceiros
  - 36 depoimentos
  - 35 imagens de galeria

### Arquivos
- `prisma/seed.ts` — reescrito
- `prisma/seed-dev.ts` — reescrito

---

## Remoção de Entidades Antigas

### Arquivos deletados
- `src/app/api/attendances/`, `persons/`, `participations/` (rotas + `[id]/`)
- `src/lib/api/attendances.ts`, `persons.ts`, `participations.ts`
- `src/hooks/attendances/`, `persons/`, `participations/`
- `src/schemas/attendance.schema.ts`, `person.schema.ts`, `participation.schema.ts`
- `src/services/attendance.service.ts`, `person.service.ts`, `participation.service.ts`
- `src/components/admin/forms/person-form.tsx`
- `src/app/admin/persons/` (listagem + detail)
- Tipos do `src/types/index.ts`: Person, Participation, Attendance, etc.

### Arquivo
- `src/types/index.ts` — tipos antigos removidos; adicionados `RegistrationWithIncludes`, `VolunteerWithRegistrations`, `ProjectListItem` com eventDate/location/vacancies

---

## Nova Camada de API

### Schemas Zod
- `src/schemas/stat.schema.ts`, `post.schema.ts`, `volunteer.schema.ts`, `registration.schema.ts` — criados
- `project.schema.ts` — atualizado com context, eventDate, location, vacancies, metrics

### Services Prisma
- `src/services/stat.service.ts`, `post.service.ts`, `volunteer.service.ts`, `registration.service.ts` — criados
- `project.service.ts` — atualizado: getProjects com filtro `context`; create/update usam `Prisma.ProjectCreateInput`

### API Routes (route handlers)
- `src/app/api/stats/route.ts` + `[id]/route.ts`
- `src/app/api/posts/route.ts` + `[id]/route.ts`
- `src/app/api/volunteers/route.ts` + `[id]/route.ts`
- `src/app/api/registrations/route.ts` + `[id]/route.ts`
- `src/app/api/projects/route.ts` — context filter, area connect, eventDate como Date
- `src/app/api/projects/[id]/route.ts` — area connect no PUT

### HTTP Clients (TanStack Query)
- `src/lib/api/stats.ts`, `posts.ts`, `volunteers.ts`, `registrations.ts` — criados

### Hooks
- `src/hooks/stats/queries.ts`, `posts/queries.ts`, `volunteers/queries.ts`, `registrations/queries.ts` — criados

---

## Páginas Públicas

### Hero (Home)
- Substituído por Magic UI: `AuroraText` + `MorphingText`
- CTAs: "Conheça nossos projetos" e "Quero ajudar"
- Hardcoded (futuramente via SiteSettings com parser de template)

### Stats Section (Home)
- `_sections/stats-section.tsx` — busca `Stat`s do banco com `NumberTicker` animado (framer-motion)
- Inserido entre Hero e ProjectsCarousel

### Projects (listagem `/projetos`)
- `projects-content.tsx` — grid de Eventos no topo + grid de Campanhas abaixo com filtros
- `project-card.tsx` — badge de contexto (Evento/Campanha), info de evento (data/local/vagas), botão "Inscrever-se"

### Projects (detalhe `/[slug]`)
- Sidebar com informações de evento (data, local, vagas)
- `volunteer-button.tsx` — botão de inscrição

### Volunteer Modal
- `components/shared/volunteer-modal.tsx` — react-hook-form + zod, chama `RegistrationsApi.publicRegister`
- Upsert de Volunteer por email + cria Registration

### Doações (`/doar`)
- Página estática: PIX, materiais, padrinho, castração
- Sem modelagem de dados (futuro)

### Metadata
- Todas as páginas públicas atualizadas para Ascesa (Home, Projetos, Sobre, Áreas, Transparência, Contato, Doar)

### Outros
- `impact-banner.tsx` — textos atualizados
- `home-content.tsx` — ordem: Hero → Stats → Carrossel → ImpactBanner → Galeria → Parceiros
- `_sections/index.ts` — exporta `StatsSection`

---

## Painel Admin

### Dashboard (`/admin`)
- `page.tsx` — counts atualizados (Volunteers, Registrations, Posts, Stats; Projects separados por contexto)
- `section-cards.tsx` — 11 cards incluindo Eventos/Campanhas separados
- `dashboard-charts.tsx` — 4 gráficos recharts: voluntários/mês, inscrições/status, projetos/contexto, posts/mês

### Sidebar
- `app-sidebar.tsx` — Projetos, Voluntários, Blog, Estatísticas; brand "Ascesa"

### CRUD pages (admin)
- `admin/projects/page.tsx` — contexto + campos condicionais de evento
- `admin/volunteers/page.tsx`
- `admin/posts/page.tsx`
- `admin/stats/page.tsx`

### Formulários admin
- `project-form.tsx` — seletor contexto, campos condicionais de evento
- `volunteer-form.tsx` — nome, email, telefone, birthDate
- `post-form.tsx` — título, slug, autor, conteúdo, capa
- `stat-form.tsx` — label, valor, ordem
- `site-settings.schema.ts` — statsOne/Two/Three removidos

---

## Navegação

### Header
- `components/layout/header.tsx` — reescrito: scroll-aware com CSS variables, Sheet mobile menu, navegação Ascesa
- Logo alt corrigido para "Ascesa"
- `components/new/header.tsx` — removido (integrado no layout)

### Footer
- `components/layout/footer.tsx` — textos Ascesa, link "Doar", "Feito com amor pelos animais"

### Routes
- `src/lib/routes.ts` — rota `doar` adicionada
- `next.config.ts` — rewrite `/doar`

### Componentes
- `number-ticker.tsx` — contador animado (framer-motion useInView)
- `components/new/` — pasta removida (header integrado)

---

## Identidade Visual

### Paleta (globals.css)
- Convertida para `oklch` seguindo padrão shadcn:
  - `--background`: oklch(0.97 0.01 75) — creme
  - `--foreground`: oklch(0.18 0.06 285) — ameixa
  - `--primary`: oklch(0.48 0.16 285) — lilás
  - `--secondary`: oklch(0.93 0.02 285) — lavanda
  - `--muted-foreground`: oklch(0.44 0.09 285) — ametista
  - `--border`: oklch(0.91 0.02 75) — bege
  - `--ring`: oklch(0.78 0.07 285) — lilás suave
  - `--chart-2`: oklch(0.72 0.09 70) — caramelo
  - `--chart-3`: oklch(0.63 0.09 155) — sage
- Gradientes do body em lilás/bege (oklch)
- Modo escuro mantém padrão Shadcn

---

## Documentação

- `AGENTS.md` — atualizado com contexto Ascesa, entidades, convenções
- `README.md` — atualizado com descrição Ascesa
- `plano-refatoracao/` — todos os 10 planos .md com tarefas marcadas como concluídas
- `CHANGELOG7.md` — este arquivo

---

## Estatísticas

| Métrica | Valor |
|---------|-------|
| Arquivos criados | ~40 |
| Arquivos modificados | ~50 |
| Arquivos deletados | ~30 |
| `npx tsc --noEmit` | Zero erros |
| Seed essencial | Funcional |
| Seed-dev com mocks | Funcional |
| Paleta convertida para oklch | 100% |
