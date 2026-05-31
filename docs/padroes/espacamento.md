# (1) Espaçamento / Medidas

Inconsistências de padding, margin, max-width e responsividade entre seções que deveriam seguir o padrão `PageSection` (`px-4 sm:px-6 lg:px-8` + `py-12 sm:py-16 md:py-24` ou `py-8 sm:py-12 md:py-16`).

| # | Arquivo | Linha | Descrição |
|---|---------|-------|-----------|
| 1 | `src/app/(public)/_sections/hero.tsx` | 17 | Hero da home usa `min-h-dvh` + `px-6 md:px-12 lg:px-20` — px diferente de `PageHero` (`px-4`) e `PageSection` (`px-4 sm:px-6 lg:px-8`) |
| 2 | `src/app/(public)/_sections/stats-section.tsx` | 65, 80 | Seção manual `<section>` com `py-16 md:py-20 lg:py-24` + `px-4 md:px-6` — diverge de `PageSection` default (`py-12 sm:py-16 md:py-24` + `px-4 sm:px-6 lg:px-8`) e compact (`py-8 sm:py-12 md:py-16`) |
| 3 | `src/app/(public)/_sections/projects-carousel.tsx` | 45 | Seção manual `<section>` com `py-12 md:py-16 lg:py-20` + `px-4 md:px-6` — `lg:px-8` ausente |
| 4 | `src/app/(public)/_sections/impact-banner.tsx` | 34 | `max-w-4xl px-4 py-24 sm:px-6 lg:px-8` — max-w diferente (4xl vs 6xl/7xl) e py fixo sem seguir padrão PageSection |
| 5 | `src/app/(public)/contact/_sections/contact-map.tsx` | 9 | Seção manual com `max-w-6xl px-4 py-16 sm:px-6 lg:px-8` — `py-16` fixo sem responsividade |
| 6 | `src/app/(public)/_sections/testimonials-section.tsx` | 45 | Loading state usa `py-8 sm:py-16 lg:py-24` + `px-4` — diverge de `PageSection compact` que a própria seção carregada usa |
| 7 | `src/app/(public)/about/_sections/about-history.tsx` | 12 | `mb-12` manual no heading em vez de `SectionHeading` (que tem `mb-8`) |
| 8 | `src/app/(public)/about/_sections/about-mvv.tsx` | 45 | `mb-12` manual no heading — mesmo padrão de about-history |
| 9 | `src/app/(public)/contact/_sections/contact-content.tsx` | 16 | `h2 text-2xl font-semibold` — tamanho diverge de `SectionHeading` (`text-2xl md:text-3xl lg:text-4xl`) |
| 10 | `src/app/(public)/donations/_sections/donations-content.tsx` | 262, 305 | `h2 text-2xl font-bold tracking-tight` — diverge de `SectionHeading` |
| 11 | `src/app/(public)/contact/_sections/contact-map.tsx` | 11 | `h2 text-2xl font-semibold` manual — diverge de `SectionHeading` |
| 12 | `src/app/(public)/_sections/projects-carousel.tsx` | 48 | `h2 text-3xl font-bold md:text-4xl lg:text-5xl` — sizing/peso diferentes de `SectionHeading` |
| 13 | `src/app/(public)/_sections/impact-banner.tsx` | 38 | `h2 text-3xl md:text-4xl lg:text-5xl font-semibold` — diverge de `SectionHeading` |
| 14 | `src/app/(public)/donations/_sections/donations-content.tsx` | 132, 147 | `<section>` aninhado dentro de `<PageSection>` (que já é `<section>`) — padding duplicado |
| 15 | `src/app/(public)/_sections/partners-content.tsx` | 39, 51 | Padding difere entre loading state (`default`) e loaded state (`compact`) |
| 16 | `src/app/(public)/_sections/stats-section.tsx` | 66, 81 | `px-4 md:px-6` sem `lg:px-8` — breakpoint lg sem padding horizontal |

## Referência: Padrão esperado

| Componente | Padding vertical | Padding horizontal | max-width |
|------------|-----------------|-------------------|-----------|
| `PageSection` default | `py-12 sm:py-16 md:py-24` | `px-4 sm:px-6 lg:px-8` | `max-w-6xl` |
| `PageSection` compact | `py-8 sm:py-12 md:py-16` | `px-4 sm:px-6 lg:px-8` | `max-w-6xl` |
| `PageSection` wide | mesmo do padding | `px-4 sm:px-6 lg:px-8` | `max-w-7xl` |
| `PageHero` | `py-16 md:py-24` | `px-4` | `max-w-6xl` |
| `SectionHeading` | — | — | `mb-8` |
