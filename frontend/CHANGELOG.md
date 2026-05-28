# Changelog — EducaSurf

## Correções iniciais

### Error parsing nos clients HTTP (Areas + Projects)

**Problema:** Os clients liam `error.message` mas o servidor retorna `{ error: "mensagem" }`.

**Correção:** Todos os 5 métodos (`findAll`, `findById`, `create`, `update`, `delete`) em ambos os clients foram alterados de:
```ts
const error = await res.json().catch(() => ({ message: '...' }))
throw new Error(error.message || '...')
```
para:
```ts
const body = await res.json().catch(() => ({}))
throw new Error(body.error || '...')
```

**Arquivos alterados:**
- `src/lib/api/areas.ts`
- `src/lib/api/projects.ts`

---

### Search param morto no AreasApi.findAll

**Problema:** O client enviava `?search=...` mas o servidor ignorava — `getAreas()` não aceita filtros.

**Correção:** Removido o parâmetro `search` do `AreasApi.findAll()` e do tipo `AreaFilters`.

**Arquivo alterado:** `src/lib/api/areas.ts`

---

### DELETE com role ADMIN removido

**Problema:** O DELETE de Areas tinha `{ role: 'ADMIN' }`, mas o AGENTS.md atualizado define que qualquer usuário autenticado pode deletar (exceto User).

**Correção:** Removido `{ role: 'ADMIN' }` do DELETE em `areas/[id]/route.ts`.

**Arquivo alterado:** `src/app/api/areas/[id]/route.ts`

---

### Projects — rota `[id]` faltando

**Problema:** `findById`, `update` e `delete` do ProjectsApi tentavam acessar `/api/projects/:id` que não existia.

**Correção:** Criado `src/app/api/projects/[id]/route.ts` com GET, PUT e DELETE seguindo o padrão do skill.

**Arquivo criado:** `src/app/api/projects/[id]/route.ts`

---

### Projects — return type do create

**Problema:** O client tipava `create` como `Promise<ProjectWithArea>` mas o servidor retornava `Project` sem `include: { area }`.

**Correção:** Adicionado `include: { area: true }` no `createProject()` em `project.service.ts`.

**Arquivo alterado:** `src/services/project.service.ts`

---

### Projects — suporte a featured e limit

**Problema:** O client enviava `featured` e `limit` mas o servidor não os processava.

**Correção:** Adicionado parsing de `featured` e `limit` no `GET /api/projects` e suporte a `featured` no `getProjects()`.

**Arquivos alterados:**
- `src/app/api/projects/route.ts`
- `src/services/project.service.ts`

---

### Middleware — redirect target

**Problema:** `middleware.ts` redirecionava para `/admin/login` (rota inexistente) mas o login está em `/login`.

**Correção:** Alterado redirect de `/admin/login` para `/login` e ajustado `isLoginPage`.

**Arquivo alterado:** `middleware.ts`

---

## Task-backend-1: Entidades Simples

Implementadas 5 entidades: **Partner**, **DocumentCategory**, **Document**, **GalleryImage**, **Testimonial**.

### Arquivos criados

| Categoria | Arquivos |
|---|---|
| Types | `types/index.ts` — +8 tipos |
| Schemas | `schemas/partner.schema.ts`, `document-category.schema.ts`, `document.schema.ts`, `gallery-image.schema.ts`, `testimonial.schema.ts` |
| API routes | 10 arquivos em `app/api/[entity]/route.ts` + `[id]/route.ts` |
| HTTP clients | `lib/api/partners.ts`, `document-categories.ts`, `gallery-images.ts`, `testimonials.ts` |
| Hooks | `hooks/partners/queries.ts`, `document-categories/queries.ts`, `gallery-images/queries.ts`, `testimonials/queries.ts` |

### Arquivos alterados

- `src/lib/api/documents.ts` — error parsing corrigido + tipo `create` retorna `DocumentWithCategory`
- `src/types/index.ts` — removido `AreaFilters.category`

### Destaques por entidade

| Entidade | Particularidade |
|---|---|
| **Partner** | CRUD simples, sem includes |
| **DocumentCategory** | GET lista inclui `_count { documents }` |
| **Document** | GET lista paginado com filtros `search`, `categoryId`, `year` |
| **GalleryImage** | Zod `.refine()`: `projectId` obrigatório se `context === 'PROJECT'`; GET ordenado por `order` |
| **Testimonial** | GET lista inclui `project { title }` |

---

## Task-backend-2: Entidades com Relações Complexas

Implementadas 3 entidades: **TeamMember**, **Person**, **Participation**.

### Arquivos criados

| Categoria | Arquivos |
|---|---|
| Types | `TeamMemberWithAreas`, `PersonWithParticipations`, `ParticipationWithPersonAndProject`, `ParticipationFilters` |
| Schemas | `team-member.schema.ts`, `person.schema.ts`, `participation.schema.ts` |
| API routes | 6 arquivos em `app/api/team-members/`, `persons/`, `participations/` |
| HTTP clients | `lib/api/team-members.ts`, `persons.ts`, `participations.ts` |
| Hooks | `hooks/team-members/queries.ts`, `persons/queries.ts`, `participations/queries.ts` |

### Destaques

| Entidade | Particularidade |
|---|---|
| **TeamMember** | POST/PUT com `areaIds: string[]` — `deleteMany` + `create` nas relações |
| **Person** | Todas as rotas protegidas (`protectedApiHandler`), GET com `search` por nome |
| **Participation** | Todas protegidas, POST trata `P2002` do Prisma → `409 Conflict` |

---

## Task-backend-3: Casos Especiais

Implementadas 2 entidades: **SiteSettings** (singleton), **User** (regras complexas).

### Arquivos criados

| Categoria | Arquivos |
|---|---|
| Types | `UserListItem` (sem `password`), `SiteSettings` |
| Schemas | `site-settings.schema.ts`, `user.schema.ts`, `user-password.schema.ts` |
| API routes | `settings/route.ts`, `users/route.ts`, `users/[id]/route.ts`, `users/[id]/password/route.ts` |
| HTTP clients | `lib/api/settings.ts`, `users.ts` |
| Hooks | `hooks/settings/queries.ts`, `users/queries.ts` |

### Regras de acesso — User

| Operação | Rota | Quem pode |
|---|---|---|
| GET | `/api/users` | ADMIN apenas |
| POST | `/api/users` | ADMIN apenas (cria como STAFF) |
| GET by id | `/api/users/:id` | ADMIN apenas |
| PUT | `/api/users/:id` | ADMIN edita qq um; STAFF só self |
| DELETE | `/api/users/:id` | ADMIN apenas (não pode deletar self) |
| PUT password | `/api/users/:id/password` | Só self, valida `currentPassword` com argon2 |

---

## Refatoração dos Forms Admin

### Campo reutilizáveis criados

`src/components/admin/forms/fields/`:
| Componente | Props | Uso |
|---|---|---|
| `TitleField` | `value`, `onChange`, `disabled?` | AreaForm, ProjectForm, DocumentForm |
| `SlugField` | `value`, `onChange`, `previewUrl`, `disabled?` | AreaForm, ProjectForm |
| `DescriptionField` | `value`, `onChange`, `disabled?`, `rows?` | AreaForm, ProjectForm, DocumentForm |

### Outras melhorias

- `toSlug()` movida para `lib/utils.ts` (estava duplicada nos forms)
- Estado granular (cada campo com seu `useState`) em vez de objeto único
- `useEffect` sem supressão de lint
- ProjectForm: `<select>` raw substituído por `Select` do shadcn/ui
- DocumentForm: adicionado campo `categoryId` com `Select` + `useDocumentCategories`

---

## Rotas da API para Testes (Postman)

### Autenticação

Primeiro, crie um usuário admin via seed ou diretamente no banco, depois faça login:

```
POST /api/auth/callback/credentials
Content-Type: application/json

{
  "email": "admin@educasurf.org",
  "password": "123456"
}
```

Na resposta, copie o cookie de sessão (`authjs.session-token`). Use-o nas requisições protegidas.
Alternativamente, faça login pelo navegador em `/login` e use os cookies da sessão.

---

### Areas

| Método | URL | Auth | Body (JSON) | Resposta |
|---|---|---|---|---|
| GET | `/api/areas` | ❌ | — | `{ "data": [Area] }` |
| GET | `/api/areas/:id` | ❌ | — | `Area` |
| POST | `/api/areas` | ✅ | `{ "title": "Surf", "slug": "surf", "description": "..." }` | `Area` (201) |
| PUT | `/api/areas/:id` | ✅ | `{ "title": "Surf Educacional", "description": "..." }` | `Area` |
| DELETE | `/api/areas/:id` | ✅ | — | `204` |

### Projects

| Método | URL | Auth | Body / Query | Resposta |
|---|---|---|---|---|
| GET | `/api/projects?search=&areas=&featured=&page=1&limit=8` | ❌ | — | `{ data: Project[], meta }` |
| GET | `/api/projects/:id` | ❌ | — | `Project` |
| POST | `/api/projects` | ✅ | `{ "title": "...", "slug": "...", "areaId": "...", "featured": false }` | `Project` (201) |
| PUT | `/api/projects/:id` | ✅ | `{ "title": "...", "description": "..." }` | `Project` |
| DELETE | `/api/projects/:id` | ✅ | — | `204` |

### Partners

| Método | URL | Auth | Body | Resposta |
|---|---|---|---|---|
| GET | `/api/partners` | ❌ | — | `Partner[]` |
| GET | `/api/partners/:id` | ❌ | — | `Partner` |
| POST | `/api/partners` | ✅ | `{ "name": "Parceiro", "logoUrl": "https://..." }` | `Partner` (201) |
| PUT | `/api/partners/:id` | ✅ | `{ "name": "Novo Nome" }` | `Partner` |
| DELETE | `/api/partners/:id` | ✅ | — | `204` |

### DocumentCategories

| Método | URL | Auth | Body | Resposta |
|---|---|---|---|---|
| GET | `/api/document-categories` | ❌ | — | `DocumentCategory[]` (com `_count.documents`) |
| GET | `/api/document-categories/:id` | ❌ | — | `DocumentCategory` |
| POST | `/api/document-categories` | ✅ | `{ "name": "Atas", "slug": "atas" }` | `DocumentCategory` (201) |
| PUT | `/api/document-categories/:id` | ✅ | `{ "name": "Atas e Regimentos" }` | `DocumentCategory` |
| DELETE | `/api/document-categories/:id` | ✅ | — | `204` |

### Documents

| Método | URL | Auth | Body / Query | Resposta |
|---|---|---|---|---|
| GET | `/api/documents?categoryId=&year=&page=1&limit=10` | ❌ | — | `{ data: Document[], meta }` |
| GET | `/api/documents/:id` | ❌ | — | `Document` (com `category`) |
| POST | `/api/documents` | ✅ | `{ "title": "...", "fileUrl": "...", "categoryId": "..." }` | `Document` (201) |
| PUT | `/api/documents/:id` | ✅ | `{ "title": "...", "year": 2024 }` | `Document` |
| DELETE | `/api/documents/:id` | ✅ | — | `204` |

### GalleryImages

| Método | URL | Auth | Body / Query | Resposta |
|---|---|---|---|---|
| GET | `/api/gallery-images?context=HOME&projectId=` | ❌ | — | `GalleryImage[]` (ordenado por `order`) |
| GET | `/api/gallery-images/:id` | ❌ | — | `GalleryImage` |
| POST | `/api/gallery-images` | ✅ | `{ "url": "https://...", "context": "HOME" }` | `GalleryImage` (201) |
| PUT | `/api/gallery-images/:id` | ✅ | `{ "caption": "Nova legenda" }` | `GalleryImage` |
| DELETE | `/api/gallery-images/:id` | ✅ | — | `204` |

> **Regra de validação:** Se `context` for `"PROJECT"`, o campo `projectId` é obrigatório. Se for `"HOME"`, `projectId` não é enviado.

### Testimonials

| Método | URL | Auth | Body / Query | Resposta |
|---|---|---|---|---|
| GET | `/api/testimonials?projectId=` | ❌ | — | `Testimonial[]` (com `project.title`) |
| GET | `/api/testimonials/:id` | ❌ | — | `Testimonial` |
| POST | `/api/testimonials` | ✅ | `{ "name": "João", "message": "...", "projectId": "..." }` | `Testimonial` (201) |
| PUT | `/api/testimonials/:id` | ✅ | `{ "message": "Novo depoimento" }` | `Testimonial` |
| DELETE | `/api/testimonials/:id` | ✅ | — | `204` |

### TeamMembers

| Método | URL | Auth | Body / Query | Resposta |
|---|---|---|---|---|
| GET | `/api/team-members` | ❌ | — | `TeamMember[]` (com `areas[].area{id,title}`, ordenado por `order`) |
| GET | `/api/team-members/:id` | ❌ | — | `TeamMember` |
| POST | `/api/team-members` | ✅ | `{ "name": "Maria", "role": "Instrutora", "areaIds": ["id1", "id2"] }` | `TeamMember` (201) |
| PUT | `/api/team-members/:id` | ✅ | `{ "name": "Maria Silva", "areaIds": ["id1"] }` | `TeamMember` |
| DELETE | `/api/team-members/:id` | ✅ | — | `204` |

> `areaIds` no POST/PUT recria as relações `TeamMemberArea` (remove antigas, insere novas).

### Persons

| Método | URL | Auth | Body / Query | Resposta |
|---|---|---|---|---|
| GET | `/api/persons?search=` | ✅ | — | `Person[]` (com `participations.project.title`) |
| GET | `/api/persons/:id` | ✅ | — | `Person` |
| POST | `/api/persons` | ✅ | `{ "name": "Carlos", "birthDate": "2010-05-15T00:00:00.000Z", "phone": "13999999999" }` | `Person` (201) |
| PUT | `/api/persons/:id` | ✅ | `{ "guardianName": "Ana" }` | `Person` |
| DELETE | `/api/persons/:id` | ✅ | — | `204` |

> Todas as rotas de Person exigem autenticação (dados sensíveis de beneficiários).

### Participations

| Método | URL | Auth | Body / Query | Resposta |
|---|---|---|---|---|
| GET | `/api/participations?personId=&projectId=` | ✅ | — | `Participation[]` (com `person.name` + `project.title`) |
| GET | `/api/participations/:id` | ✅ | — | `Participation` |
| POST | `/api/participations` | ✅ | `{ "personId": "...", "projectId": "..." }` | `Participation` (201) ou `409` se duplicado |
| PUT | `/api/participations/:id` | ✅ | `{ "status": "INACTIVE", "notes": "..." }` | `Participation` |
| DELETE | `/api/participations/:id` | ✅ | — | `204` |

> `status` aceita: `"ACTIVE"` ou `"INACTIVE"`. POST retorna 409 se a mesma pessoa já estiver vinculada ao mesmo projeto.

### SiteSettings

| Método | URL | Auth | Body | Resposta |
|---|---|---|---|---|
| GET | `/api/settings` | ❌ | — | `SiteSettings` |
| PUT | `/api/settings` | ✅ | `{ "email": "contato@educasurf.org", "phone": "(13) 99999-9999" }` | `SiteSettings` |

> Apenas GET e PUT (singleton). PUT usa `upsert`.

### Users

| Método | URL | Auth | Body | Resposta |
|---|---|---|---|---|
| GET | `/api/users` | ✅ ADMIN | — | `User[]` (sem `password`) |
| GET | `/api/users/:id` | ✅ ADMIN | — | `User` (sem `password`) |
| POST | `/api/users` | ✅ ADMIN | `{ "email": "staff@email.com", "password": "123456", "name": "Staff" }` | `User` (201, sem `password`, role sempre STAFF) |
| PUT | `/api/users/:id` | ✅ ADMIN/self | `{ "name": "Novo Nome" }` | `User` (sem `password`) |
| DELETE | `/api/users/:id` | ✅ ADMIN | — | `204` |
| PUT | `/api/users/:id/password` | ✅ self | `{ "currentPassword": "123456", "newPassword": "654321" }` | `204` |

> Regras: STAFF só edita a si mesmo e não pode alterar `role`. Ninguém pode deletar a si mesmo. Senha tem rota dedicada.
