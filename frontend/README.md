# Ascesa — Site Institucional

ONG focada em cuidados, resgate e apoio a animais (pets).

### Banco (Podman)
```bash
npm run db:dev:up      # sobe o PostgreSQL local
npm run db:dev:stop    # para o container (dados preservados)
npm run db:dev:down    # apaga container e volumes (reset total)
```

### Prisma
```bash
npm run db:migrate     # cria e aplica nova migration
npm run db:studio      # abre interface visual do banco
npm run db:reset       # apaga tudo e recria (dev only)
npm run db:seed        # cria o usuário admin + dados essenciais
npm run db:seed:dev    # popular com dados mock de desenvolvimento
```

### Next.js
```bash
npm run dev            # inicia o servidor de desenvolvimento
npm run build          # gera build de produção
npm run start          # inicia o servidor de produção
```

### Ordem correta para iniciar o projeto do zero
```bash
npm run db:dev:up
npm run db:migrate
npm run db:seed        # só na primeira vez
npm run dev
```

### Produção (Neon)
```bash
NODE_ENV=production npm run db:prod:deploy   # aplica migrations na Neon
```
