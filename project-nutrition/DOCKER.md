# Docker - nutra-se-evolua (Frontend)

## Explicacao Tecnica

### Dockerfile (Multi-Stage Build)

O Dockerfile utiliza duas etapas para otimizar o tamanho da imagem final:

**Stage 1 — Build**

- Imagem: `node:22-alpine` (Node.js LTS em Alpine Linux, ~180MB)
- Executa `npm ci` para instalar dependencias de forma deterministica a partir do `package-lock.json`
- Recebe a variavel `VITE_API_URL` via `ARG` — o Vite substitui `import.meta.env.VITE_API_URL` pelo valor real durante o build (inline em tempo de compilacao)
- Executa `npm run build` gerando os arquivos estaticos em `/dist`

**Stage 2 — Serve**

- Imagem limpa `node:22-alpine` (sem node_modules de desenvolvimento)
- Instala apenas o `serve` (servidor HTTP leve para arquivos estaticos)
- Copia apenas a pasta `/dist` do stage anterior
- Resultado: imagem final significativamente menor que se incluisse todo o node_modules

### Como o container executa

1. O `serve` inicia na porta 3000
2. Serve os arquivos estaticos do build do Vite
3. O flag `-s` (single-page application) garante que todas as rotas sejam redirecionadas para `index.html`, permitindo que o React Router funcione corretamente

---

## docker-compose.yml

| Configuracao      | Descricao                                                                        |
| ----------------- | -------------------------------------------------------------------------------- |
| **build context** | `.` (raiz do repositorio frontend)                                               |
| **build args**    | `VITE_API_URL=${VITE_API_URL}` — lido do arquivo `.env` e injetado em build-time |
| **porta**         | `3000:3000` — mapeia a porta do container para o host                            |
| **restart**       | `unless-stopped` — reinicia automaticamente se o container parar                 |

---

## Integracao com o Backend

### Como funciona a comunicacao

1. A variavel `VITE_API_URL` e definida no arquivo `.env` e passada como build argument pelo `docker-compose.yml`
2. Durante o `npm run build`, o Vite substitui todas as ocorrencias de `import.meta.env.VITE_API_URL` pelo valor real (ex: `http://localhost:5000`)
3. O frontend faz requisicoes HTTP diretamente para o backend nesse endereco
4. O backend ja possui CORS configurado para aceitar requisicoes de qualquer origem

### Requisitos

- O backend **deve estar rodando** antes de usar o frontend (as chamadas de API falharao caso contrario)
- O CORS ja esta configurado no backend (`origins: "*"`) — nenhuma configuracao adicional necessaria

### Apontando para outro backend

Altere o valor de `VITE_API_URL` no arquivo `.env`:

```
VITE_API_URL=http://meu-servidor:5000
```

**Importante**: como a variavel e substituida em build-time, e necessario reconstruir a imagem apos a alteracao (`docker compose up --build`).

---

## Passo a Passo

### 1. Configurar o .env

O arquivo `.env` ja vem com o valor padrao. Ajuste se necessario:

```
VITE_API_URL=http://localhost:5000
```

### 2. Subir o container

```bash
docker compose up --build
```

### 3. Verificar que esta funcionando

- Acesse http://localhost:3000
- Navegue para `/gestao` — deve listar pacientes do backend
- Navegue para `/alimentos` — deve buscar alimentos via API FatSecret

### 4. Parar o container

```bash
docker compose down
```

---

## Troubleshooting

| Problema                                        | Causa provavel                                       | Solucao                                                                                                                                |
| ----------------------------------------------- | ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Pagina carrega mas dados nao aparecem           | Backend nao esta rodando ou `VITE_API_URL` incorreta | Verifique se o backend esta acessivel no endereco configurado. Reconstrua com `--build` se alterar a URL                               |
| `Error: port 3000 already in use`               | Outra aplicacao usando a porta                       | Pare o processo ou altere o mapeamento no `docker-compose.yml` para `"3001:3000"`                                                      |
| Rotas retornam 404 ao recarregar a pagina       | O servidor nao esta redirecionando para `index.html` | O `serve -s` ja lida com isso. Se o problema persistir, verifique se o build foi gerado corretamente                                   |
| Alterou `VITE_API_URL` no `.env` mas nada mudou | Variavel e substituida em build-time                 | Reconstrua a imagem: `docker compose up --build`                                                                                       |
| Build demora muito                              | Cache do Docker invalidado                           | Certifique-se de que `node_modules` esta no `.dockerignore`. O `npm ci` so re-executa se `package.json` ou `package-lock.json` mudarem |
