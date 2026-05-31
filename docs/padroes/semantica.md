# (2) Semântica HTML

Inconsistências de tags HTML, landmarks, headings e estrutura de documento.

| # | Arquivo | Linha | Descrição |
|---|---------|-------|-----------|
| 1 | `src/app/(public)/page.tsx` | 24-27 | Página home sem `<main>` — retorna `<HydrationBoundary>` diretamente; `<main>` fica dentro do Client Component `HomeContent`. Deveria estar na `page.tsx` (Server Component) como nas demais páginas |
| 2 | `src/app/(public)/_sections/impact-banner.tsx` | 17 | Usa `<div>` genérico em vez de `<section>` — é um bloco de conteúdo distinto da página |
| 3 | `src/app/(public)/donations/_sections/donations-content.tsx` | 132, 147 | `<section>` aninhada dentro de `<PageSection>` que já renderiza `<section>` — dois `<section>` sem wrapper intermediário |
| 4 | `src/app/(public)/_sections/hero.tsx` | 17 | Usa `<section>` para o hero — consistente com `PageHero`, mas o hero da home tem escopo maior (`min-h-dvh`) |
| 5 | `src/app/(public)/about/_sections/about-history.tsx` | 16 | `<h2>` manual sem `SectionHeading` — heading não segue hierarquia/padrão do projeto |
| 6 | `src/app/(public)/about/_sections/about-mvv.tsx` | 49 | `<h2>` manual sem `SectionHeading` |
| 7 | `src/app/(public)/_sections/projects-carousel.tsx` | 48 | `<h2>` manual sem `SectionHeading` |
| 8 | `src/app/(public)/_sections/impact-banner.tsx` | 38 | `<h2>` manual sem `SectionHeading` |
| 9 | `src/app/(public)/contact/_sections/contact-content.tsx` | 16 | `<h2>` manual + `<h3>` manual — sem `SectionHeading` |
| 10 | `src/app/(public)/contact/_sections/contact-map.tsx` | 11 | `<h2>` manual sem `SectionHeading` |
| 11 | `src/app/(public)/donations/_sections/donations-content.tsx` | 262, 305 | `<h2>` e `<h3>` manuais sem `SectionHeading` |
| 12 | `src/app/(public)/_sections/impact-banner.tsx` | 35 | `<p>` com `uppercase tracking-widest` funcionando como badge — mesmo padrão visual de `PageHero` mas sem usar o componente |
| 13 | `src/app/(public)/about/_sections/about-history.tsx` | 13 | `<span>` com `uppercase tracking-wider` como badge manual |
| 14 | `src/app/(public)/about/_sections/about-mvv.tsx` | 47 | `<span>` com `uppercase tracking-wider` como badge manual |
| 15 | `src/app/(public)/_sections/projects-carousel.tsx` | — | Nenhum badge/label — inconsistente com seções que usam `PageHero` ou badge manual |

## Observação

Headings manuais usando `text-2xl font-semibold` (contact) ou `text-3xl font-bold` (projects-carousel, impact-banner) criam uma hierarquia visual inconsistente entre páginas. O padrão `SectionHeading` unifica em `text-2xl md:text-3xl lg:text-4xl`.
