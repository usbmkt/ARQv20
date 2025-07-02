# ARQ6 Frontend - Análise de Mercado com IA

Frontend React para a plataforma ARQ6 de análise de mercado com inteligência artificial.

## 🚀 Características

- **React**: Interface de usuário moderna e responsiva
- **Integração com API**: Consome a API ARQ6 Node.js/Express.js
- **Autenticação**: Sistema completo de login e registro
- **Análises de Mercado**: Interface para criar e visualizar análises
- **Dashboard**: Visualização de estatísticas e histórico

## 📋 Pré-requisitos

- Node.js 14+ (recomendado 18+)
- Servidor API ARQ6 em execução

## 🛠️ Instalação Local

1. **Clone o repositório**
```bash
git clone <repository-url>
cd arq6-frontend
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```

Edite o arquivo `.env` com a URL da sua API:
```env
API_URL=https://arqv10.onrender.com
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

5. **Acesse o aplicativo**
Abra seu navegador em `http://localhost:3000`

## 🚀 Deploy no Render

### Método 1: Usando render.yaml (Recomendado)

1. Faça push do código para um repositório Git
2. Conecte o repositório no Render
3. O arquivo `render.yaml` configurará automaticamente o serviço

### Método 2: Deploy manual

1. Crie um novo Static Site no Render
2. Configure as seguintes opções:
   - **Build Command**: `echo "Build completed"`
   - **Publish Directory**: `./`
   - **Environment Variables**: `API_URL=https://arqv10.onrender.com`

3. Configure as rotas:
   - Adicione uma regra de rewrite: `/* -> /public/index.html`

## 📁 Estrutura do Projeto

```
arq6-frontend/
├── public/
│   └── index.html         # HTML principal
├── src/
│   ├── components/        # Componentes React reutilizáveis
│   ├── pages/             # Páginas da aplicação
│   ├── services/          # Serviços (API, autenticação)
│   ├── styles/            # Estilos CSS
│   ├── utils/             # Utilitários
│   └── App.js             # Componente principal
├── .env                   # Variáveis de ambiente
├── package.json           # Dependências e scripts
└── render.yaml            # Configuração do Render
```

## 📚 Páginas Principais

- **Home**: Página inicial com informações sobre a plataforma
- **Login/Register**: Autenticação de usuários
- **Dashboard**: Visão geral das análises e estatísticas
- **Nova Análise**: Formulário para criar análises de mercado
- **Histórico**: Lista de análises anteriores
- **Detalhes da Análise**: Visualização detalhada de uma análise

## 🔧 Integração com a API

O frontend se comunica com a API ARQ6 através do serviço `apiService` que encapsula todas as chamadas HTTP. A URL base da API é configurada através da variável de ambiente `API_URL`.

## 🔒 Autenticação

O sistema de autenticação utiliza tokens JWT armazenados no localStorage. O serviço `authManager` gerencia o estado de autenticação e fornece métodos para login, registro e logout.

## 🎨 Estilização

O projeto utiliza CSS puro com classes utilitárias inspiradas no Tailwind CSS para estilização. Os estilos estão organizados no arquivo `src/styles/main.css`.

## 📱 Responsividade

A interface é totalmente responsiva, adaptando-se a diferentes tamanhos de tela, desde dispositivos móveis até desktops.

## 🧪 Testes

Para testar a aplicação localmente:

```bash
python3 -m http.server 3000
```

Acesse `http://localhost:3000/public/index.html` no navegador.

## 📄 Licença

MIT License

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

