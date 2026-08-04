# BusinessError — Erros de Negócio com HTTP Status

## Problema

Atualmente o `apiHandler` captura erros genéricos e retorna 500. Quando uma regra de negócio falha (ex: limite de depoimentos atingido), o usuário recebe "Erro interno do servidor" em vez de uma mensagem clara com status adequado.

## Implementação

### 1. Criar classe `BusinessError` em `src/lib/api-handler.ts`

```ts
export class BusinessError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400,
  ) {
    super(message)
    this.name = 'BusinessError'
  }
}
```

### 2. Capturar no `apiHandler` e `protectedApiHandler`

Adicionar antes do `catch` genérico:

```ts
if (err instanceof BusinessError) {
  return NextResponse.json({ error: err.message }, { status: err.statusCode })
}
```

Ambos os handlers precisam da mesma alteração.

### 3. Usar nos services

```ts
// Exemplo: limite de depoimentos
async create(data: CreateTestimonialInput) {
  const count = await prisma.testimonial.count()
  if (count >= 20) {
    throw new BusinessError('Máximo de 20 depoimentos atingido')
  }
  return prisma.testimonial.create({ data })
}
```

```ts
// Exemplo: vaga já preenchida
if (registrationsCount >= project.vacancies) {
  throw new BusinessError('Projeto não possui vagas disponíveis', 409)
}
```

### 4. Arquivos a modificar

- `src/lib/api-handler.ts` — adicionar classe `BusinessError` + captura nos dois handlers
- Onde houver regras de negócio (ex: testimonial service, registration service)

### Verificação

```bash
npx tsc --noEmit
npm run lint
```
