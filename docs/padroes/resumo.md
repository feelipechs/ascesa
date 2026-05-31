# Resumo e Prioridades

## Contagem por categoria

| Categoria | Total | Prioridade | Impacto |
|-----------|-------|------------|---------|
| (1) Espaçamento / Medidas | 16 | 🔴 Alta | Visual direto — padding e margin inconsistentes entre seções |
| (2) Semântica HTML | 15 | 🟡 Média | Acessibilidade e SEO — landmarks, headings, estrutura |
| (3) Padrões de Componente | 16 | 🔴 Alta | Manutenibilidade — duplicação, inconsistência de padrão |
| **Total** | **47** | | |

## Arquivos prioritários (mais inconsistências)

| Arquivo | Esp. | Sem. | Pad. | Total |
|---------|------|------|------|-------|
| `donations/_sections/donations-content.tsx` | 2 | 2 | 2 | **6** |
| `_sections/stats-section.tsx` | 2 | 0 | 3 | **5** |
| `_sections/projects-carousel.tsx` | 2 | 2 | 1 | **5** |
| `_sections/impact-banner.tsx` | 2 | 3 | 0 | **5** |
| `about/_sections/about-history.tsx` | 1 | 2 | 1 | **4** |
| `about/_sections/about-mvv.tsx` | 1 | 2 | 1 | **4** |
| `contact/_sections/contact-map.tsx` | 1 | 1 | 1 | **3** |
| `contact/_sections/contact-content.tsx` | 1 | 1 | 1 | **3** |

## Sugestões de refatoração

### Alta prioridade

1. **Migrar seções manuais para `PageSection` + `SectionHeading`**
   - `stats-section.tsx` — wrapper com `PageSection`
   - `projects-carousel.tsx` — wrapper com `PageSection`
   - `contact-map.tsx` — wrapper com `PageSection`

2. **Unificar padding entre loading state e loaded state**
   - `partners-content.tsx` — `padding="compact"` em ambos

3. **Extrair admin inline de `donations-content.tsx`**
   - Seguir o pattern das outras páginas (admin actions/sheet/dialog no content wrapper)

4. **Adicionar `<main>` na home `page.tsx`**
   - Mover do Client Component `HomeContent` para a Server Component `page.tsx`

### Média prioridade

5. **Substituir headings manuais por `SectionHeading`**
   - `about-history.tsx`, `about-mvv.tsx` — já usam `PageSection`, só trocar heading
   - `contact-content.tsx`, `contact-map.tsx`
   - `donations-content.tsx` — blocos "Itens que precisamos" e "Nota Fiscal Paulista"
   - `impact-banner.tsx` — implantar com `PageSection`

6. **Envolver `DeleteDialog` em `{isAuthenticated && ...}`**
   - `stats-section.tsx`
   - `transparency-content.tsx` (categoria)

7. **Remover `<section>` aninhada dentro de `PageSection`**
   - `donations-content.tsx`

### Baixa prioridade

8. **Badges manuais** — não crítico, mas idealmente usar `SectionHeading` ou `PageHero`
9. **Hero da home custom** — justificável pelo layout complexo, manter como está
