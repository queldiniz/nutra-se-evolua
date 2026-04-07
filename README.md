# 🥗 Nutra-se e Evolua

**Nutra-se e Evolua** é uma aplicação web interativa voltada para a gestão de saúde e bem-estar. O sistema foi desenvolvido para facilitar o acompanhamento de pacientes por profissionais da saúde, permitindo o cadastro de perfis, monitoramento de métricas corporais, visualização de progresso através de gráficos e montagem de dietas com base em dados reais.

> ⚠️ **Aviso:** Este repositório contém a interface (Front-End) do projeto. Para o funcionamento completo, certifique-se de estar rodando também a API Back-End (Python/Flask) localmente.

## 📋 Índice

- [Objetivo](#-objetivo)
- [Como o Sistema Funciona](#-como-o-sistema-funciona)
- [Tecnologias e Padrões](#-tecnologias-e-padrões)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação e Configuração (Local)](#-instalação-e-configuração-local)
- [Instalação com Docker (Recomendado)](#-instalação-com-docker-recomendado)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Fluxograma do Projeto](#-fluxograma-do-projeto)
- [API FatSecret e Configuração de IP](#-api-fatsecret-e-configuração-de-ip)

## 🎯 Objetivo

O objetivo principal do **Nutra-se e Evolua** é fornecer uma ferramenta centralizada e responsiva para nutricionistas e personal trainers gerenciarem seus clientes. Ele substitui o uso de planilhas complexas por uma interface visual inteligente, permitindo o registro histórico de avaliações físicas, cálculo de estratégias de treino e a prescrição rápida de planos alimentares com precisão.

## ⚙️ Como o Sistema Funciona

O fluxo de uso da plataforma é estruturado em quatro pilares:

1. **Gestão Inteligente de Prontuários:** O profissional cadastra os pacientes com validações em tempo real e máscaras automáticas (ex: peso e percentuais com casas decimais exatas). O sistema calcula e recomenda a estratégia de treino automaticamente.
2. **Acompanhamento de Resultados:** O profissional lança novas avaliações mês a mês no prontuário. O sistema processa os dados e desenha gráficos interativos que ilustram a evolução do peso e do percentual de gordura.
3. **Prescrição de Dieta Integrada:** Ao montar o plano alimentar, as buscas são feitas diretamente na base global da API FatSecret. O sistema puxa as calorias e macronutrientes reais de cada porção e os adiciona à dieta do paciente, dividida por refeições.
4. **Engajamento (Portal do Paciente):** O profissional pode gerar links públicos (Tokens UUID únicos) temporários ou permanentes. O paciente acessa esse link para visualizar seu próprio progresso e dieta em uma rota exclusiva de "somente-leitura", sem necessidade de login.

## 🚀 Tecnologias e Padrões

- **[React](https://reactjs.org/):** Biblioteca principal para construção da interface.
- **[Vite](https://vitejs.dev/):** Ferramenta de build rápida e leve.
- **[React Router DOM](https://reactrouter.com/):** Gerenciamento de rotas e navegação SPA (rotas privadas e públicas).
- **[Recharts](https://recharts.org/):** Biblioteca para criação de gráficos responsivos.
- **Docker:** Para containerização do projeto (Multi-Stage Build para otimização).
- **CSS3:** Estilização com Flexbox e Media Queries.
- **UX/UI Patterns:** Skeleton Loaders para carregamento suave de dados, Layout Patterns, Modais de confirmação seguros e formatação em tempo real.

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:

- **Node.js** (Versão 16 ou superior)
- **npm** (Gerenciador de pacotes do Node)
- **Docker** (Opcional, para execução via contêiner)

## 🔧 Instalação e Configuração (Local)

Siga o passo a passo clássico abaixo para rodar o projeto em modo de desenvolvimento na sua máquina:

1. **Clone o repositório:**

   ```bash
   git clone [https://github.com/seu-usuario/nutra-se-evolua.git](https://github.com/seu-usuario/nutra-se-evolua.git)
   ```

2. **Acesse a pasta do projeto:**

   ```bash
   cd project-nutrition
   ```

3. **Crie as Variáveis de Ambiente**

   ```bash
   VITE_API_URL=http://localhost:5000
   ```

4. **Instale as dependencias**

   ```bash
   npm install
   ```

5. **Inicie o Servidor:**

```bash
   npm run dev
```

6. **Acesse a aplicação:**
   Abra o navegador e digite o endereço exibido no terminal (geralmente `http://localhost:5173/`).

> **Nota:** O projeto utiliza um arquivo `db.json` (localizado em `public/db.json`) para simular o banco de dados e popular os gráficos e tabelas inicialmente.

## 📂 Estrutura do Projeto

A estrutura de arquivos foi organizada para maximizar a reutilização de componentes:

```bash
project-nutrition/
├── public/              # Arquivos estáticos puros
├── src/
│   ├── assets/          # Ícones e imagens
│   ├── components/      # Componentes Reutilizáveis
│   │   ├── BackToTop.jsx
│   │   ├── Breadcrumb.jsx
│   │   ├── CardNutrition.jsx
│   │   ├── DefaultLayout.jsx       # Moldura Base (Header/Footer)
│   │   ├── Footer.jsx
│   │   ├── GraficosEvolucao.jsx    # Módulo de Recharts
│   │   ├── Header.jsx
│   │   ├── ImageSkeleton.jsx       # UX de carregamento
│   │   ├── PacienteInfoCard.jsx
│   │   ├── PlanoAlimentar.jsx
│   │   ├── SkeletonCard.jsx        # UX de carregamento
│   │   └── WorkoutRecommendation.jsx
│   ├── pages/           # Views Principais
│   │   ├── Alimentos.jsx           # Busca no FatSecret
│   │   ├── DetalhesPaciente.jsx    # Prontuário Completo
│   │   ├── Gestao.jsx              # Tabela e Formulário de Cadastro
│   │   ├── Home.jsx
│   │   ├── NotFound.jsx
│   │   └── PublicPaciente.jsx      # View Somente-Leitura (Links Compartilhados)
│   ├── App.jsx          # Sistema de Roteamento
│   ├── index.css        # Estilização Global
│   └── main.jsx         # Ponto de Entrada React
├── docker-compose.yml   # Orquestração Docker
├── DOCKER.md            # Documentação técnica da imagem
├── Dockerfile           # Build Multi-estágio
├── package.json
└── README.md
```

## 📂 Fluxograma do Projeto

<p align="center">
  <img src="public/img/fluxograma-front-end.png" alt="Fluxograma" />
</p>
## 📂 API FatSecret
Para executar o projeto completo e fazer as buscas funcionarem na sua máquina local, é obrigatório realizar as configurações abaixo na sua API Back-End:

1. **Cadastro de Desenvolvedor:** Crie uma conta gratuita no portal [FatSecret Developer](https://platform.fatsecret.com/) para obter as chaves de acesso (`Client ID` e `Client Secret`).
2. **Variáveis de Ambiente:** Insira essas chaves no arquivo `.env` do seu servidor Back-End.
3. **Liberação de IP (OBRIGATÓRIO):** A API do FatSecret possui um bloqueio de segurança rigoroso por IP. Para que suas buscas funcionem, você deve ir no painel do FatSecret e **cadastrar o endereço IP público da sua máquina**.

> ⚠️ **Atenção:** Caso o seu IP mude (comum ao reiniciar o roteador ou acessar de outra rede), você precisará atualizar o IP no painel do FatSecret, caso contrário a aplicação retornará erro na busca de alimentos.
