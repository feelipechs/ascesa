# Changelog 6 — Correção de Bugs

## Bug 1: Criação de usuário não funcionava

**Arquivos:** `src/components/admin/forms/user-form.tsx`, `src/schemas/user.schema.ts`, `src/app/api/users/route.ts`

**Causa:** O campo `password` era gerenciado via estado React (`value={password}`) em vez de registrado com react-hook-form. Como o `createUserSchema` exige `password` (min 6 caracteres) e o campo não estava em `form.register('password')`, o zodResolver validava apenas `{ name, email }`, a validação falhava, e `handleSubmit` nunca era chamado.

**Correção:**
- Adicionado `password` aos `defaultValues` do formulário
- Substituído `value={password} onChange={...}` por `{...form.register('password')}`
- Adicionado `role` opcional ao `createUserSchema` (para ser usado pela API)
- API agora respeita `role` enviado no body (fallback `'STAFF'`)

---

## Bug 2: Pessoas não apareciam na tabela

**Arquivo:** `src/lib/api/persons.ts`

**Causa:** `PersonsApi.findAll()` retornava `res.json()` (objeto `{ data: [...] }`) em vez de extrair `json.data`. O `DataTable` recebia um objeto em vez de array.

**Correção:** Extrair `json.data` antes de retornar, seguindo o padrão dos demais API clients.

---

## Bug 3 e 6: Inserir imagem na galeria (home e projeto) não funcionava

**Arquivo:** `src/components/admin/forms/gallery-image-form.tsx`

**Causa:** `context` e `projectId` eram passados como props mas não estavam nos campos do formulário. O schema usa `context` com default `'PROJECT'` e o refine exige `projectId` quando context é PROJECT. Como os campos não estavam registrados, a validação Zod usava o default (PROJECT), o refine falhava, e `handleSubmit` nunca era chamado.

**Correção:**
- Adicionados `context` e `projectId` aos `defaultValues` e `reset` do formulário
- Adicionados `<input type="hidden">` para ambos os campos
- Removida a adição manual de `context`/`projectId` no `handleSubmit` (agora vêm do formulário)

---

## Bug 5: Membro não atualizava sem F5 após vincular/remover de área

**Arquivos:** `src/app/(public)/areas/_sections/team-section-wrapper.tsx`, `src/app/(public)/areas/[slug]/page.tsx`

**Causa:** O `TeamSectionWrapper` recebia `members` como prop do Server Component. Quando a mutation invalidava o cache, o `allMembers` era refetchado, mas os membros exibidos continuavam sendo a prop estática.

**Correção:**
- `TeamSectionWrapper` agora deriva `linkedMembers` filtrando `allMembers` por `areaId` via `useMemo`
- Removida a prop `members` do componente e sua passagem na página
- A lista agora reage a mudanças no cache do TanStack Query

---

## Bug 7: Inserir depoimento não funcionava

**Arquivo:** `src/components/admin/forms/testimonial-form.tsx`

**Causa:** `projectId` era passado como prop mas não estava no formulário. O `createTestimonialSchema` exige `projectId`. A validação Zod falhava e `handleSubmit` nunca era chamado.

**Correção:**
- Adicionado `projectId` aos `defaultValues` e `reset` do formulário
- Adicionado `<input type="hidden">` para `projectId`
- Removida a adição manual de `projectId` no `handleSubmit`

---

## Bug 8: Admin-actions sobrepunha o ano do documento

**Arquivo:** `src/app/(public)/transparency/_sections/document-card.tsx`

**Causa:** `AdminActions` estava posicionado com `absolute top-2 right-2 z-10`, sobrepondo o badge de ano que ficava no topo-direito do card.

**Correção:** Removido o posicionamento absoluto do `AdminActions`. Agora o badge de ano e o `AdminActions` ficam lado a lado no mesmo `flex row`, com o ícone + badge à esquerda e as ações à direita.

---

## Bug 9: Filtro de categoria não atualizava contagem após criar documento

**Arquivo:** `src/hooks/documents/queries.ts`

**Causa:** `useDocumentMutations()` invalidava apenas `documentKeys.all`. As categorias e suas contagens (`_count.documents`) vinham de `useDocumentCategories()`, que não era invalidada.

**Correção:** Adicionada invalidação de `documentCategoryKeys.all` junto com `documentKeys.all` no callback `onSuccess` das mutations de documento.

---

## Bug 10: Re-renderização excessiva dos filtros de documento

**Arquivo:** `src/app/(public)/transparency/_sections/transparency-content.tsx`

**Causa:** O componente fazia DUAS queries de documentos — uma com e outra sem filtro de ano — causando refetches duplicados e re-renderizações.

**Correção:** Unificado para uma única query (`useDocuments({ categoryId })`). O filtro de ano é aplicado no client-side via `useMemo`. Os anos disponíveis são extraídos do mesmo resultado.
