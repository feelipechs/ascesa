# CHANGELOG 10 — Próximo Ciclo

Implementação do plano `plano/proximo-ciclo/` — features, refatoração e correções.

---

## Setup

### Removido `Testimonial.featured`
- **Arquivo:** `prisma/schema.prisma`, `prisma/seed-dev.ts`, `src/services/testimonial.service.ts`, `src/app/api/testimonials/route.ts`, `src/app/admin/testimonials/page.tsx`, `src/hooks/testimonials/queries.ts`, `src/lib/api/testimonials.ts`, `src/app/(public)/_sections/testimonials-section.tsx`
- Campo removido do schema Prisma, service, API, hooks e UI
- Migration resetada: `20260529010144_init`
- Seed atualizada (remove `featured` dos depoimentos)

### Dependência instalada
- `react-qr-code` adicionado ao `package.json`

---

## Features

### Marquee nos depoimentos
- **Arquivo:** `src/app/(public)/_sections/testimonials-section.tsx`
- Grid estático substituído por duas fileiras de `Marquee` (ida e volta)
- `pauseOnHover` ativado para acessibilidade
- `max-h` com mask-image para efeito de fade nas bordas
- Skeleton, AdminActions e EmptyState preservados

### Galeria de animais (CRUD inline)
- **Arquivos:** `src/app/(public)/animals/[slug]/_sections/animal-gallery-section.tsx` (novo), `src/app/(public)/animals/[slug]/page.tsx`, `src/components/admin/forms/gallery-image-form.tsx`
- Nova seção `AnimalGallerySection` copiada do padrão de `projects/` com `context: 'ANIMAL'`
- `GalleryImageForm` agora aceita `animalId` como prop
- Galeria inline em `animals/[slug]/page.tsx` substituída pelo componente

### QR Code nas doações
- **Arquivo:** `src/app/(public)/donations/_sections/donations-content.tsx`
- Botão "QR Code" ao lado de "Copiar chave" nos cards PIX
- Modal `Dialog` com `QRCode` de `react-qr-code` (256x256)

### Nota fiscal pública
- **Arquivos:** `src/app/api/fiscal-notes/route.ts`, `src/app/(public)/donations/_sections/donations-content.tsx`
- POST de notas fiscais trocado de `protectedApiHandler` para `apiHandler` (público)
- Card "Nota Fiscal" e modal com formulário adicionados à página de doações
- Suporte a tipo DETAILED e ACCESS_KEY com campos condicionais

### Projetos com voluntários
- **Arquivos:** `src/services/project.service.ts`, `src/app/api/projects/with-volunteers/route.ts` (novo), `src/lib/api/projects.ts`, `src/app/admin/projects/page.tsx`
- Novo método `getProjectsWithVolunteers()` no service (projetos com `eventDate` + registrations)
- Página `/admin/projects` substituída: cards de projeto com lista de voluntários e status (PENDING/APPROVED/REJECTED)
- Sidebar: item "Projetos" → `/admin/projects`

### Drag & drop
- **Arquivos:** `src/hooks/use-reorder.ts` (novo), `src/components/sortable-list.tsx` (novo), `src/services/stat.service.ts`, `src/services/payment-method.service.ts`, `src/app/api/stats/reorder/route.ts` (novo), `src/app/api/payment-methods/reorder/route.ts` (novo), `src/lib/api/stats.ts`, `src/lib/api/payment-methods.ts`, `src/app/admin/stats/page.tsx`, `src/app/admin/payment-methods/page.tsx`
- Hook `useReorder<T>` com suporte a campo de ordenação configurável
- Componentes `SortableList` + `SortableItem` usando `@dnd-kit`
- Endpoints batch `PATCH /api/stats/reorder` e `PATCH /api/payment-methods/reorder`
- Stats ordena por `order`, PaymentMethods por `displayOrder`

---

## Refatoração

### Sidebar reduzida para 6 itens
- **Arquivo:** `src/app/admin/_sections/app-sidebar.tsx`
- Remove: Animais, Espécies, Portes, Faixas Etárias, Depoimentos, Estatísticas, Posts, Métodos de Pagamento, Parceiros, Equipe, Documentos, Galeria
- Mantém: Dashboard, Projetos, Voluntários, Usuários, Notas Fiscais, Configurações

### Ícones Tabler → Lucide
- **Arquivos:** `src/app/admin/_sections/app-sidebar.tsx`, `src/app/admin/_sections/section-cards.tsx`, `src/app/admin/_sections/nav-user.tsx`
- Todos os ícones `@tabler/icons-react` substituídos por equivalentes `lucide-react`
- `@tabler/icons-react` removido do `package.json`
- Arquivos não utilizados removidos: `nav-documents.tsx`, `nav-secondary.tsx`

### `as never` eliminado
- **Arquivos:** `src/services/fiscal-note.service.ts`, `src/services/payment-method.service.ts`, `src/app/api/payment-methods/route.ts`, `src/app/api/payment-methods/[id]/route.ts`, `src/app/api/fiscal-notes/route.ts`, `src/app/api/fiscal-notes/[id]/route.ts`, `src/app/api/animals/[slug]/route.ts`
- Services tipados com `CreateFiscalNoteInput`, `UpdateFiscalNoteInput`, `CreatePaymentMethodInput`, `UpdatePaymentMethodInput`
- Conversão de tipos (emissionDate → Date, amount → Decimal) movida para dentro dos services
- Nenhum `as never` remanescente em services ou API routes

### Seed com `toSlug()`
- **Arquivo:** `prisma/seed-dev.ts`
- Função `slugify` inline substituída por `toSlug()` de `src/lib/utils`
- `toSlug` é mais restritiva (remove caracteres especiais, faz trim)

---

## Tipo de alteração
- [x] Nova feature
- [x] Refatoração
- [x] Correção
- [ ] Documentação
