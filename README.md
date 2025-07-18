# ARQ6 - Análise de Mercado com IA

Plataforma completa de análise de mercado utilizando inteligência artificial para gerar insights profundos e estratégicos baseados em dados reais da internet.

## 🚀 Características

### Backend (Node.js/Express)
- **API RESTful** completa para análises de mercado
- **Múltiplos provedores de IA**: Gemini 2.0 Flash e DeepSeek
- **Autenticação segura** com Supabase Auth
- **Banco de dados** PostgreSQL via Supabase
- **Rate limiting** e middleware de segurança
- **Pesquisa web automática** para dados atualizados
- **Validação robusta** com Joi

### Frontend (React)
- **Interface moderna** e responsiva
- **Autenticação completa** (login/registro)
- **Dashboard** com estatísticas e histórico
- **Análises detalhadas** com visualização rica
- **Sistema de roteamento** client-side

### Inteligência Artificial
- **Gemini 2.0 Flash**: Modelo avançado do Google
- **DeepSeek**: Modelo alternativo de alta performance
- **Fallback automático**: Se um provedor falhar, usa o outro
- **Análise comparativa**: Opção de usar ambos provedores

## 📋 Pré-requisitos

- Node.js 18+ (recomendado 20+)
- Conta no Supabase
- API Key do Google Gemini
- API Key do DeepSeek (opcional)

## 🛠️ Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd arq6-unified
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto:

```env
# Configurações gerais
NODE_ENV=development
PORT=10000
CORS_ORIGINS=*

# Banco de dados (Supabase)
DATABASE_URL=postgresql://postgres.xxx:[password]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Provedores de IA
AI_PROVIDER=deepseek
# Opções: gemini, deepseek, both

GEMINI_API_KEY=AIzaSyBtLYVXxG61tu0CZ4uoLcO8pTWZuGteUFc
DEEPSEEK_API_KEY=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

# Segurança
SECRET_KEY="FDGD851F8DGhgfhgf_fdsfewn543534==//ddfsehjkj$"
JWT_SECRET=your-jwt-secret-key-change-in-production

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 4. Configure o banco de dados
Execute o script SQL em `database/migrations.sql` no Supabase SQL Editor.

### 5. Inicie o servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 🌐 Deploy

### Render (Recomendado)
O projeto está configurado para deploy automático no Render usando o arquivo `render.yaml`.

1. Conecte seu repositório no Render
2. Configure as variáveis de ambiente no painel do Render
3. O deploy será automático

### Docker
```bash
# Build da imagem
docker build -t arq6-unified .

# Executar container
docker run -p 10000:10000 --env-file .env arq6-unified
```

## 📚 Uso da API

### Autenticação
```javascript
// Registro
POST /api/users/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "nome": "Nome do Usuário",
  "empresa": "Empresa (opcional)"
}

// Login
POST /api/users/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Análises de Mercado
```javascript
// Nova análise
POST /api/analysis/market
Authorization: Bearer <token>
{
  "segmento": "Marketing Digital",
  "contexto_adicional": "Foco em pequenas empresas",
  "usuario_id": "uuid-do-usuario"
}

// Histórico
GET /api/analysis/history?page=1&limit=10
Authorization: Bearer <token>

// Análise específica
GET /api/analysis/:id
Authorization: Bearer <token>
```

### Provedores de IA
```javascript
// Status dos provedores
GET /api/analysis/ai/status

// Alterar provedor
POST /api/analysis/ai/provider
Authorization: Bearer <token>
{
  "provider": "deepseek" // ou "gemini" ou "both"
}
```

## 🤖 Provedores de IA

### Gemini 2.0 Flash
- **Modelo**: gemini-2.0-flash-exp
- **Características**: Rápido, eficiente, boa qualidade
- **Uso**: Análises gerais de mercado

### DeepSeek
- **Modelo**: deepseek-chat
- **Características**: Alta qualidade, raciocínio avançado
- **Uso**: Análises complexas e detalhadas

### Configuração de Provedores
```env
# Usar apenas Gemini
AI_PROVIDER=gemini

# Usar apenas DeepSeek
AI_PROVIDER=deepseek

# Usar ambos (comparação)
AI_PROVIDER=both
```

## 📊 Estrutura da Análise

Cada análise inclui:

1. **Definição do Escopo**
2. **Análise do Avatar (Cliente Ideal)**
3. **Mapeamento de Dores e Desejos**
4. **Análise da Concorrência**
5. **Análise de Mercado e Metrificação**
6. **Análise de Palavras-chave e Custos**
7. **Métricas de Performance**
8. **Voz do Mercado**
9. **Histórico de Lançamentos**
10. **Análise de Preços**
11. **Estratégia de Aquisição**
12. **Projeções**
13. **Bônus e Garantias**
14. **Síntese Estratégica**
15. **Plano de Ação**

## 🧪 Testes

```bash
# Executar todos os testes
npm test

# Testes com cobertura
npm run test:coverage

# Testes em modo watch
npm run test:watch
```

## 📁 Estrutura do Projeto

```
arq6-unified/
├── client/                 # Frontend React
│   ├── public/            # Arquivos públicos
│   ├── src/               # Código fonte React
│   └── package.json       # Dependências do frontend
├── src/                   # Backend Node.js
│   ├── config/            # Configurações
│   ├── middleware/        # Middlewares
│   ├── models/            # Modelos de dados
│   ├── routes/            # Rotas da API
│   ├── services/          # Serviços (IA, etc.)
│   └── server.js          # Servidor principal
├── database/              # Scripts de banco
├── tests/                 # Testes automatizados
├── Dockerfile             # Configuração Docker
├── render.yaml            # Configuração Render
└── package.json           # Dependências do backend
```

## 🔒 Segurança

- **Helmet**: Headers de segurança
- **CORS**: Configuração de origens
- **Rate Limiting**: Proteção contra spam
- **Validação**: Joi para validação de dados
- **Autenticação**: Supabase Auth com JWT
- **Sanitização**: Limpeza de dados de entrada

## 📈 Monitoramento

- **Health Check**: `/health`
- **Logs**: Morgan para logging HTTP
- **Métricas**: Tempo de processamento das análises
- **Status AI**: Monitoramento dos provedores

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🆘 Suporte

Para suporte, abra uma issue no GitHub ou entre em contato:

- **Email**: suporte@arq6.com
- **GitHub Issues**: [Link para issues]
- **Documentação**: [Link para docs]

## 🔄 Changelog

### v1.0.0
- ✅ Integração com DeepSeek AI
- ✅ Sistema de fallback entre provedores
- ✅ Interface aprimorada
- ✅ Testes automatizados
- ✅ Deploy no Render

---

**ARQ6** - Transformando dados em insights estratégicos com o poder da IA 🚀