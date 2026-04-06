# 🥗 Nutra-se e Evolua

**Nutra-se e Evolua** é uma aplicação web interativa voltada para a gestão de saúde e bem-estar. O sistema foi desenvolvido para facilitar o acompanhamento de pacientes por profissionais da saúde, permitindo o cadastro de perfis, monitoramento de métricas corporais (peso, gordura) e visualização de progresso através de gráficos.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias e Padrões](#-tecnologias-e-padrões)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Fluxograma do Projeto](#-fluxograma-do-projeto)
- [API FatSecret](#-api-do-projeto)

## ✨ Funcionalidades

### 1. Home Page

- Interface moderna com carrossel de slides motivacionais.
- Navegação intuitiva e informações sobre saúde mental e física.

### 2. Gestão de Pacientes (Aprimorada)

- **Listagem Completa:** Visualização tabular dos pacientes com tooltips informativos nos nomes.
- **Formulário Inteligente:** - Cadastro com validação de campos obrigatórios (`required`).
  - Feedback visual de sucesso (mensagem temporária) após o cadastro.
  - Limpeza automática do formulário.
  - Layout _sticky_ que acompanha a rolagem da página.
- **Exclusão Segura:** Modal de confirmação personalizado (substituindo alertas nativos do navegador) para evitar exclusões acidentais.
- **Cálculos Automáticos:** Definição automática de estratégia de treino baseada no objetivo do paciente.

### 3. Perfil do Paciente

- Dashboard individual acessado via rota dinâmica.
- **Gráficos de Evolução:** Visualização interativa (Recharts) do histórico de **Peso** e **% de Gordura**.
- Resumo de dados antropométricos.

### 4. Responsividade e Layout

- **Layout Pattern:** Utilização de um componente `DefaultLayout` para manter a consistência do Cabeçalho e Rodapé em todas as páginas.
- Interface 100% adaptável para Celulares (menu hambúrguer, tabelas com rolagem horizontal) e Desktops.

## 🚀 Tecnologias e Padrões

O projeto foi desenvolvido utilizando práticas modernas de desenvolvimento web:

- **[React](https://reactjs.org/):** Biblioteca JavaScript para construção da interface.
- **[Vite](https://vitejs.dev/):** Ferramenta de build rápida e leve.
- **[React Router DOM](https://reactrouter.com/):** Gerenciamento de rotas e navegação SPA (Single Page Application).
- **[Recharts](https://recharts.org/):** Biblioteca para criação de gráficos responsivos.
- **CSS3:** Estilização com Flexbox e Media Queries para responsividade.
- **Layout Components Pattern:** Arquitetura baseada em componentes de layout (`DefaultLayout`) para reutilização eficiente de estrutura.

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (Versão 16 ou superior recomendada)
- **npm** (Gerenciador de pacotes do Node)

## 🔧 Instalação e Configuração

Siga o passo a passo abaixo para rodar o projeto localmente:

1.  **Clone o repositório:**

    ```bash
    git clone [https://github.com/seu-usuario/nutra-se-evolua.git](https://github.com/seu-usuario/nutra-se-evolua.git)
    ```

2.  **Acesse a pasta do projeto:**

    ```bash
    cd project-nutrition
    ```

3.  **Instale as dependências:**

    ```bash
    npm install
    ```

4.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

5.  **Acesse a aplicação:**
    Abra o navegador e digite o endereço exibido no terminal (geralmente `http://localhost:5173/`).

> **Nota:** O projeto utiliza um arquivo `db.json` (localizado em `public/db.json`) para simular o banco de dados e popular os gráficos e tabelas inicialmente.

## 📂 Estrutura do Projeto

A estrutura de arquivos foi organizada para maximizar a reutilização de componentes:

```bash
nutra-se-evolua/
├── public/
│   ├── img/             # Imagens (logo, banners)
│   └── db.json          # Base de dados simulada
├── src/
│   ├── components/      # Componentes Reutilizáveis
│   │   ├── DefaultLayout.jsx  # Moldura principal (Layout Pattern)
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Breadcrumb.jsx
│   │   └── BackToTop.jsx
│   ├── pages/           # Páginas da Aplicação
│   │   ├── Home.jsx
│   │   ├── Gestao.jsx   # Lógica de Tabela + Form + Modais
│   │   ├── DetalhesPaciente.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx          # Configuração de Rotas e Layout
│   ├── index.css        # Estilos globais
│   └── main.jsx         # Ponto de entrada
├── package.json         # Dependências
└── README.md            # Documentação
```

## 📂 Fluxograma do Projeto

<p align="center">
  <img src="src/img/fluxograma-projeto.png" alt="Fluxograma" />
</p>
## 📂 API FatSecret
