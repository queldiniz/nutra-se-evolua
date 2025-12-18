# 🥗 Nutra-se e Evolua

**Nutra-se e Evolua** é uma aplicação web de gestão de saúde e bem-estar, desenvolvida para auxiliar profissionais (nutricionistas e personal trainers) no acompanhamento da evolução de seus pacientes. O sistema permite o cadastro, visualização de métricas e análise de progresso através de gráficos interativos.

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração](#-instalação-e-configuração)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Utilizar](#-como-utilizar)

## ✨ Funcionalidades

* **Home Page:** Interface moderna com carrossel de slides motivacionais e informações sobre saúde mental e física.
* **Gestão de Pacientes:** * Listagem completa de pacientes.
    * Cadastro de novos pacientes com formulário detalhado (Nome, Altura, Peso, % Gordura, Nível de Atividade, etc.).
    * Exclusão de registros.
* **Perfil do Paciente:**
    * Página de detalhes individuais.
    * Visualização de dados antropométricos.
    * **Gráficos de Evolução:** Acompanhamento visual da perda de peso e percentual de gordura ao longo do tempo.
* **Responsividade:** Layout adaptável para Desktops, Tablets e Celulares.

## 🚀 Tecnologias Utilizadas

O projeto foi desenvolvido utilizando as seguintes tecnologias:

* **[React](https://reactjs.org/):** Biblioteca JavaScript para construção da interface.
* **[Vite](https://vitejs.dev/):** Ferramenta de build rápida para projetos frontend.
* **[React Router DOM](https://reactrouter.com/):** Gerenciamento de rotas e navegação.
* **[Recharts](https://recharts.org/):** Biblioteca para criação de gráficos responsivos e customizáveis.
* **CSS3:** Estilização responsiva e Flexbox.

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

* **[Node.js](https://nodejs.org/en/)** (Versão 16 ou superior recomendada)
* **[npm](https://www.npmjs.com/)** (Gerenciador de pacotes do Node)

## 🔧 Instalação e Configuração

Siga o passo a passo abaixo para rodar o projeto localmente:

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/nutra-se-evolua.git](https://github.com/seu-usuario/nutra-se-evolua.git)
    ```

2.  **Acesse a pasta do projeto:**
    ```bash
    cd nutra-se-evolua
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

> **Nota sobre os Dados:** O projeto utiliza um arquivo `db.json` (localizado em `public/db.json`) para simular o banco de dados e popular os gráficos e tabelas inicialmente.

## 📂 Estrutura do Projeto

A estrutura de pastas do projeto está organizada da seguinte forma:
```bash
nutra-se-evolua/
├── public/
│   ├── img/             # Imagens utilizadas no slider e layout
│   └── db.json          # Base de dados simulada (JSON)
├── src/
│   ├── components/      # Componentes reutilizáveis (Header, Footer, etc.)
│   ├── pages/           # Páginas da aplicação (Home, Gestao, DetalhesPaciente)
│   ├── App.jsx          # Configuração de Rotas e estrutura base
│   ├── index.css        # Estilos globais e regras de responsividade
│   └── main.jsx         # Ponto de entrada da aplicação React
├── package.json         # Lista de dependências do projeto
└── README.md            # Documentação do projeto
