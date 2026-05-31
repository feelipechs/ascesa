# (3) Padrões de Componente

Inconsistências no uso de `PageSection`, `SectionHeading`, `PageHero`, e padrões de arquitetura (admin inline vs extraído).

| # | Arquivo | Linha | Descrição |
|---|---------|-------|-----------|
| 1 | `src/app/(public)/_sections/stats-section.tsx` | — | Seção inteira manual sem usar `PageSection` — único componente da home que não usa o wrapper padrão |
| 2 | `src/app/(public)/_sections/projects-carousel.tsx` | — | Seção inteira manual sem `PageSection` |
| 3 | `src/app/(public)/_sections/impact-banner.tsx` | — | Seção inteira manual sem `PageSection` nem `SectionHeading` |
| 4 | `src/app/(public)/contact/_sections/contact-map.tsx` | — | Seção manual sem `PageSection` |
| 5 | `src/app/(public)/about/_sections/about-history.tsx` | — | Usa `PageSection` mas heading manual (`mb-12` + `<h2>` custom) em vez de `SectionHeading` |
| 6 | `src/app/(public)/about/_sections/about-mvv.tsx` | — | Usa `PageSection` mas heading manual em vez de `SectionHeading` |
| 7 | `src/app/(public)/contact/_sections/contact-content.tsx` | — | Não usa `SectionHeading` para o título da seção |
| 8 | `src/app/(public)/donations/_sections/donations-content.tsx` | — | Não usa `SectionHeading` para "Itens que precisamos" nem "Nota Fiscal Paulista" |
| 9 | `src/app/(public)/_sections/hero.tsx` | — | Hero custom com `min-h-dvh` — não usa `PageHero`. Justificável (layout complexo), mas inconsistente com as demais páginas |
| 10 | `src/app/(public)/donations/_sections/donations-content.tsx` | — | Componente de página pública (467 linhas) com lógica de admin INLINE: `AdminSheet`, `AdminActions`, `DeleteDialog`, CRUD de PaymentMethod. Outras páginas extraem admin para wrapper |
| 11 | `src/app/(public)/about/_sections/about-content.tsx` | — | Lógica admin (sheet, delete dialog) no content wrapper — padrão correto que donations-content não segue |
| 12 | `src/app/(public)/gallery-section.tsx` | 209 | Quando `wrapInPageSection=false`, renderiza `<section>` genérica sem padding/width consistentes — diverge de `PageSection` |
| 13 | `src/app/(public)/projects/_sections/projects-content.tsx` | 50 | `<div className="space-y-12">` + `<section>` interno em vez de usar `PageSection`; `PageSection` é aplicado no `page.tsx`, mas conteúdo usa `<section>` aninhado |
| 14 | `src/app/(public)/_sections/stats-section.tsx` | — | `DeleteDialog` NÃO envolvido em `{isAuthenticated && (...)}` — aparece no DOM mesmo para visitantes |
| 15 | `src/app/(public)/transparency/_sections/transparency-content.tsx` | 251-269 | `DeleteDialog` de categoria não envolto em `{isAuthenticated && (...)}` — mesma questão |
| 16 | `src/app/(public)/_sections/partners-content.tsx` | 39, 51 | Prop `padding` difere entre loading state (`default`) e loaded state (`compact`) |

## Padrão vs Realidade

| Aspecto | Padrão esperado | Ocorrências |
|---------|----------------|-------------|
| Seções públicas | `PageSection` | stats-section, projects-carousel, impact-banner, contact-map não usam |
| Headings de seção | `SectionHeading` | about-history, about-mvv, contact-content, contact-map, projects-carousel, impact-banner, donations-content usam `<h2>` manual |
| Badge de seção | Propriedade de `PageHero` ou `SectionHeading` | impact-banner, about-history, about-mvv replicam manualmente com `<span>`/`<p>` |
| Admin CRUD em páginas públicas | Extraído para wrapper ou componente separado | donations-content tem tudo inline (467 linhas) |
| DeleteDialog | Envolto em `{isAuthenticated && ...}` | stats-section, transparency-content deixam sem guarda |

## Exemplo do padrão correto (about-team.tsx)

```tsx
<PageSection width="wide" padding="compact">
  <SectionHeading
    title="Nossa Equipe"
    description="Conheça os profissionais..."
    action={isAuthenticated && onAdd ? { label: 'Adicionar', onClick: onAdd } : undefined}
  />
  {membersList}
</PageSection>
```

As páginas que **seguem** o padrão corretamente:

- `about/_sections/about-team.tsx` ✅
- `_sections/testimonials-section.tsx` ✅
- `_sections/partners-content.tsx` ✅ (exceto padding loading vs loaded)
- `areas/_sections/areas-content.tsx` ✅
