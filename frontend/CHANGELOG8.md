# CHANGELOG 8 — Refatoração V2 (Completa)

## Schema

- **Removido** `ProjectContext` enum
- **Removido** `Project.context`
- **Removido** `Testimonial.projectId` + `Project.testimonials`
- **Adicionado** `GalleryContext.ANIMAL`
- **Adicionado** `GalleryImage.animalId`
- **Adicionado** `Registration @@index([projectId])`
- **Adicionados** modelos: `AnimalSpecies`, `AnimalSize`, `AnimalAgeRange`, `Animal`, `PaymentMethod`, `PixConfig`, `BankConfig`, `FiscalNote`

## Novas funcionalidades

### Páginas públicas
- `/animais` — Listagem de animais com filtros (espécie, porte, status, busca) e paginação
- `/animais/[slug]` — Detalhe do animal com foto, informações, história, galeria e botões de adoção/apadrinhamento

### Páginas de doações
- `/doacoes` — Agora consome API `PaymentMethod` dinamicamente (PIX com botão copiar, transferência bancária, dinheiro)

### Painel admin
- CRUD admin para: AnimalSpecies, AnimalSize, AnimalAgeRange, Animal, PaymentMethod (PIX/BANK_TRANSFER/CASH com campos condicionais), FiscalNote (DETAILED/ACCESS_KEY)
- `/admin/testimonials` — Página admin de depoimentos (standalone, sem vínculo com projeto)
- Sidebar atualizada com todas as entradas (Animais, Espécies, Portes, Faixas Etárias, Pagamentos, Notas Fiscais, Depoimentos)
- Dashboard atualizado: cards de Eventos/Campanhas substituídos por Animais; gráfico Projetos por contexto substituído por Animais por status

### Home
- Seção de depoimentos em destaque entre ImpactBanner e Galeria

## Refatorações

- **Project**: perdeu contexto (agora todos os projetos são eventos). Campos `eventDate`/`location`/`vacancies` passam a ser exibidos condicionalmente pelo preenchimento, não por context
- **Testimonial**: desvinculado de projeto (standalone). Agora tem `photoUrl`, `featured`, `publishedAt`
- **GalleryImage**: suporta contexto `ANIMAL` com `animalId`
- **Dashboard**: removidas queries de `context`, adicionadas queries de `Animal`

## Seed

- Dados mock para 2 espécies, 3 portes, 3 faixas etárias, 8 animais
- Dados mock para 3 métodos de pagamento (PIX, Transferência, Dinheiro)
- Depoimentos standalone (sem `projectId`, 6 em destaque)
- Projetos sem `context`
- Galeria com imagens no contexto ANIMAL

## Estatísticas finais

- `npx tsc --noEmit` → zero erros
- Schema Prisma V2 aplicado e migrado
- Seed funcional com dados mock Ascesa
