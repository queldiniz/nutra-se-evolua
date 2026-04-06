# Compartilhamento Publico de Pacientes - Frontend

## Explicacao Tecnica

### Arquitetura

O sistema de compartilhamento permite que o nutricionista gere links publicos para que pacientes visualizem seus proprios dados em uma pagina read-only, sem navegacao administrativa.

### Componentes Extraidos (Reutilizaveis)

Tres componentes foram extraidos do `DetalhesPaciente.jsx` original para serem reutilizados tanto na pagina admin quanto na pagina publica:

| Componente | Arquivo | Props | Descricao |
|------------|---------|-------|-----------|
| `PacienteInfoCard` | `src/components/PacienteInfoCard.jsx` | `dadosPaciente` | Card com dados corporais (idade, genero, peso, gordura, meta calorica, atividade) |
| `PlanoAlimentar` | `src/components/PlanoAlimentar.jsx` | `refeicoes`, `onExcluirAlimento?` | Tabela de dieta por refeicao. Quando `onExcluirAlimento` e omitido, esconde coluna de acoes (modo read-only) |
| `GraficosEvolucao` | `src/components/GraficosEvolucao.jsx` | `historico` | Dois graficos Recharts (evolucao de peso e gordura) |

**Decisao de design:** extrair componentes ao inves de duplicar codigo. O `PlanoAlimentar` usa a presenca/ausencia do callback `onExcluirAlimento` para alternar entre modo editavel e read-only — sem prop booleana extra.

### Pagina Publica: PublicPaciente.jsx

**Arquivo:** `src/pages/PublicPaciente.jsx`

- Rota: `/public/:token`
- Renderizada **fora** do `DefaultLayout` (sem header/nav/footer admin)
- Layout proprio: header teal com badge "Prontuario Compartilhado", footer minimo
- Busca dados via `GET /api/public/paciente/{token}`
- Reutiliza os 3 componentes extraidos sem callbacks de mutacao
- Trata 4 estados de erro com telas dedicadas:
  - **404**: link invalido ou paciente nao disponivel
  - **410 (revogado)**: link desativado pelo nutricionista
  - **410 (expirado)**: link expirou
  - **Erro de conexao**: servidor indisponivel

### Roteamento

**Arquivo:** `src/App.jsx`

```
/public/:token  →  PublicPaciente (fora do DefaultLayout)
/               →  Home           (dentro do DefaultLayout)
/alimentos      →  Alimentos      (dentro do DefaultLayout)
/gestao         →  Gestao         (dentro do DefaultLayout)
/paciente/:id   →  DetalhesPaciente (dentro do DefaultLayout)
*               →  NotFound       (dentro do DefaultLayout)
```

**Decisao:** o `DefaultLayout` foi alterado de `{children}` para `<Outlet />` (padrao React Router v7 para layout routes). Isso permite que a rota publica fique fora do layout sem gambiarras.

### UI de Compartilhamento (DetalhesPaciente.jsx)

O botao "Compartilhar" no cabecalho do prontuario abre um painel com:

1. **Formulario de geracao**: campo de rotulo (opcional) + dropdown de expiracao (sem expiracao / 7 / 30 / 90 dias) + botao "Gerar Link"
2. **Tabela de links ativos**: rotulo, data de criacao, data de expiracao, contador de acessos, botoes "Copiar" e "Revogar"
3. **Copy-to-clipboard**: usa `navigator.clipboard.writeText()` com fallback para `document.execCommand("copy")`

---

## Arquivos Criados/Modificados

| Arquivo | Acao | Descricao |
|---------|------|-----------|
| `src/components/PacienteInfoCard.jsx` | Novo | Componente de dados corporais extraido |
| `src/components/PlanoAlimentar.jsx` | Novo | Componente de dieta extraido (read-only quando sem callback) |
| `src/components/GraficosEvolucao.jsx` | Novo | Componente de graficos extraido |
| `src/pages/PublicPaciente.jsx` | Novo | Pagina publica read-only |
| `src/pages/DetalhesPaciente.jsx` | Modificado | Refatorado com componentes extraidos + UI de compartilhamento |
| `src/components/DefaultLayout.jsx` | Modificado | `{children}` → `<Outlet />` |
| `src/App.jsx` | Modificado | Rota `/public/:token` adicionada fora do layout |

---

## Integracao com o Backend

### Endpoints consumidos

**Pela pagina admin (DetalhesPaciente):**
- `POST /api/nutrition/{id}/share` — gerar token
- `GET /api/nutrition/{id}/shares?active_only=true` — listar tokens
- `DELETE /api/nutrition/{id}/share/{token_id}` — revogar token

**Pela pagina publica (PublicPaciente):**
- `GET /api/public/paciente/{token}` — buscar dados do paciente

### Fluxo completo

1. Nutricionista acessa `/paciente/1` e clica em "Compartilhar"
2. Define rotulo e expiracao (opcionais) e clica em "Gerar Link"
3. Frontend chama `POST /api/nutrition/1/share`
4. Backend gera UUID, salva no banco, retorna token
5. Link aparece na tabela com botao "Copiar"
6. Nutricionista copia o link (ex: `http://localhost:3000/public/abc-123-def`)
7. Paciente abre o link no navegador
8. Frontend busca `GET /api/public/paciente/abc-123-def`
9. Backend valida token, incrementa acesso, retorna dados
10. Paciente visualiza seus dados (read-only, sem navegacao admin)

---

## Passo a Passo

### 1. Verificar que o backend esta rodando

O backend deve estar acessivel no endereco configurado em `VITE_API_URL` (padrao: `http://localhost:5000`).

### 2. Subir o frontend

```bash
docker compose up --build
# ou, em desenvolvimento:
npm run dev
```

### 3. Gerar um link de compartilhamento

1. Acesse `http://localhost:3000/gestao`
2. Clique em um paciente para ir ao prontuario
3. Clique em "Compartilhar"
4. Preencha o rotulo (opcional), escolha a expiracao, clique em "Gerar Link"
5. Clique em "Copiar" no link gerado

### 4. Testar a pagina publica

Abra o link copiado em uma janela anonima. Deve exibir:
- Header teal com "Prontuario Compartilhado"
- Dados corporais do paciente
- Plano alimentar (sem botoes de exclusao)
- Graficos de evolucao
- Footer minimo

### 5. Testar revogacao

Volte ao prontuario admin e clique em "Revogar" no link. Recarregue a pagina publica — deve exibir mensagem "Este link foi desativado pelo nutricionista."

---

## Troubleshooting

| Problema | Causa provavel | Solucao |
|----------|---------------|---------|
| Pagina publica mostra "Link invalido" | Token incorreto ou backend nao esta rodando | Verifique a URL e se o backend responde em `/api/doc` |
| Botao "Compartilhar" nao aparece | DetalhesPaciente.jsx nao foi atualizado | Verifique que o arquivo foi substituido pela versao refatorada |
| Pagina publica mostra layout admin (header/nav) | Rota `/public/:token` esta dentro do DefaultLayout | Verifique que em `App.jsx` a rota publica esta FORA do `<Route element={<DefaultLayout />}>` |
| Componentes nao carregam na pagina admin | Imports incorretos apos refatoracao | Verifique que `PacienteInfoCard`, `PlanoAlimentar` e `GraficosEvolucao` estao importados corretamente |
| Clipboard nao funciona | Navegador bloqueou por nao estar em HTTPS | O fallback `execCommand("copy")` deve cobrir esse caso. Se persistir, copie manualmente |
| Dados nao aparecem na pagina publica | Backend retorna 200 mas formato diferente | Verifique que o endpoint publico usa o mesmo `NutritionSchema` do endpoint admin |
