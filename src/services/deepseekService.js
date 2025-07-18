const axios = require('axios');
const cheerio = require('cheerio');

class DeepSeekService {
  constructor() {
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY não configurada');
    }
    
    this.apiKey = process.env.DEEPSEEK_API_KEY;
    this.baseURL = 'https://api.deepseek.com/v1';
    this.model = 'deepseek-chat';
  }

  // Função para fazer pesquisas na web (reutilizada do Gemini)
  async searchWeb(query, maxResults = 5) {
    try {
      // Simular pesquisa web usando DuckDuckGo (sem API key necessária)
      const searchUrl = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      
      const response = await axios.get(searchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      const results = [];

      $('.result').slice(0, maxResults).each((i, element) => {
        const title = $(element).find('.result__title').text().trim();
        const snippet = $(element).find('.result__snippet').text().trim();
        const url = $(element).find('.result__url').attr('href');
        
        if (title && snippet) {
          results.push({
            title,
            snippet,
            url: url || '',
            source: 'web_search'
          });
        }
      });

      return results;
    } catch (error) {
      console.error('Erro na pesquisa web:', error.message);
      return [];
    }
  }

  // Função para extrair dados de tendências (simulado)
  async getTrendData(keyword) {
    try {
      // Simular dados de tendências
      const trendData = {
        keyword,
        searchVolume: Math.floor(Math.random() * 100000) + 1000,
        trend: Math.random() > 0.5 ? 'crescendo' : 'estável',
        competition: ['baixa', 'média', 'alta'][Math.floor(Math.random() * 3)],
        cpc: (Math.random() * 5 + 0.5).toFixed(2),
        relatedKeywords: [
          `${keyword} 2024`,
          `como ${keyword}`,
          `${keyword} online`,
          `melhor ${keyword}`,
          `${keyword} gratis`
        ]
      };

      return trendData;
    } catch (error) {
      console.error('Erro ao obter dados de tendências:', error.message);
      return null;
    }
  }

  // Função para fazer chamada à API do DeepSeek
  async callDeepSeekAPI(messages, options = {}) {
    try {
      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: this.model,
        messages,
        temperature: options.temperature || 0.7,
        max_tokens: options.max_tokens || 8192,
        top_p: options.top_p || 0.95,
        frequency_penalty: options.frequency_penalty || 0,
        presence_penalty: options.presence_penalty || 0,
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000 // 60 segundos
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Erro na API do DeepSeek:', error.response?.data || error.message);
      throw new Error(`Falha na API DeepSeek: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  // Função principal de análise aprimorada
  async analyzeMarket(context) {
    try {
      console.log('🔍 Iniciando análise de mercado com DeepSeek...');
      
      // 1. Extrair segmento do contexto
      const segmento = context.segmento || context.nicho || 'mercado digital';
      
      // 2. Fazer pesquisas na web
      console.log('🌐 Realizando pesquisas na web...');
      const searchQueries = [
        `${segmento} mercado brasileiro 2024`,
        `${segmento} tendências consumidor`,
        `${segmento} concorrentes principais`,
        `${segmento} preços mercado`,
        `${segmento} público alvo perfil`
      ];

      const webResults = [];
      for (const query of searchQueries) {
        const results = await this.searchWeb(query, 3);
        webResults.push(...results);
        // Delay para evitar rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // 3. Obter dados de tendências
      console.log('📈 Coletando dados de tendências...');
      const trendData = await this.getTrendData(segmento);

      // 4. Preparar contexto enriquecido para o DeepSeek
      const enrichedContext = {
        ...context,
        segmento,
        webResearch: webResults,
        trendData,
        analysisDate: new Date().toISOString()
      };

      // 5. Preparar mensagens para o DeepSeek
      const messages = [
        {
          role: 'system',
          content: 'Você é um especialista em pesquisa de mercado e lançamentos digitais com mais de 15 anos de experiência. Sua especialidade é analisar mercados brasileiros e criar estratégias de lançamento de produtos digitais baseadas em dados reais e insights profundos.'
        },
        {
          role: 'user',
          content: this.buildAnalysisPrompt(enrichedContext)
        }
      ];

      // 6. Gerar análise com DeepSeek
      console.log('🤖 Gerando análise com DeepSeek...');
      const analysis = await this.callDeepSeekAPI(messages, {
        temperature: 0.7,
        max_tokens: 8192,
        top_p: 0.95
      });

      return {
        success: true,
        analysis,
        metadata: {
          segmento,
          webResultsCount: webResults.length,
          trendData,
          generatedAt: new Date().toISOString(),
          model: 'deepseek-chat',
          provider: 'deepseek'
        }
      };

    } catch (error) {
      console.error('Erro na análise de mercado com DeepSeek:', error);
      throw new Error(`Falha na análise: ${error.message}`);
    }
  }

  // Construir prompt estruturado (mesmo do Gemini para consistência)
  buildAnalysisPrompt(context) {
    return `
Com base no contexto fornecido abaixo, realize uma pesquisa completa e detalhada seguindo EXATAMENTE esta estrutura:

**CONTEXTO FORNECIDO:**
- Segmento: ${context.segmento}
- Contexto adicional: ${context.contexto_adicional || 'Não fornecido'}
- Data da análise: ${context.analysisDate}

**PESQUISAS WEB REALIZADAS:**
${context.webResearch.map(r => `- ${r.title}: ${r.snippet}`).join('\n')}

**DADOS DE TENDÊNCIAS:**
${context.trendData ? JSON.stringify(context.trendData, null, 2) : 'Não disponível'}

## 🎯 DEFINIÇÃO DO ESCOPO
Identifique e detalhe:
- Segmento principal e subsegmentos
- Produto/serviço ideal para lançamento
- Proposta de valor única

## 👥 ANÁLISE DO AVATAR (CLIENTE IDEAL)

### Demografia:
Pesquise e defina:
- Faixa etária predominante
- Gênero e distribuição
- Localização geográfica principal
- Faixa de renda média
- Nível de escolaridade comum
- Profissões mais frequentes

### Psicografia:
Mapeie:
- 3 valores principais
- Estilo de vida característico
- 2 principais aspirações
- 3 medos mais comuns
- 2 frustrações recorrentes

### Comportamento Digital:
Identifique:
- 2 plataformas mais usadas
- Horários de pico online
- Tipos de conteúdo preferidos
- Influenciadores que seguem

## 💔 MAPEAMENTO DE DORES E DESEJOS

Liste as 5 principais dores com:
- Descrição detalhada
- Como impacta a vida
- Nível de urgência (Alta/Média/Baixa)

Identifique:
- Estado atual vs. Estado desejado
- Obstáculos percebidos
- Sonho secreto não verbalizado

## 🏆 ANÁLISE DA CONCORRÊNCIA

Pesquise e liste:
- 2 concorrentes diretos principais (com preços, USP, forças e fraquezas)
- 2 concorrentes indiretos
- 3 gaps identificados no mercado

## 💰 ANÁLISE DE MERCADO E METRIFICAÇÃO

### Calcule o TAM/SAM/SOM:
- TAM: População total × % mercado × ticket médio anual
- SAM: TAM × % segmento × % alcance realista
- SOM: SAM × % market share possível

### Identifique:
- Volume de busca mensal do segmento
- Tendências em alta e em queda
- Sazonalidade (melhores e piores meses)

## 🎯 ANÁLISE DE PALAVRAS-CHAVE E CUSTOS

Pesquise as 5 principais palavras-chave com:
- Volume de busca mensal
- CPC e CPM médios
- Dificuldade SEO
- Intenção de busca

### Custos por plataforma:
Estime para Facebook, Google, YouTube e TikTok:
- CPM médio
- CPC médio
- CPL médio
- Taxa de conversão esperada

## 📊 MÉTRICAS DE PERFORMANCE

Defina benchmarks do mercado:
- CAC médio por canal
- Funil de conversão padrão (%)
- LTV médio e LTV:CAC ratio
- ROI esperado por canal

## 🗣️ VOZ DO MERCADO

Identifique:
- 3 principais objeções e como contorná-las
- Linguagem específica (termos, gírias, gatilhos)
- 3 crenças limitantes comuns

## 📊 HISTÓRICO DE LANÇAMENTOS

Pesquise:
- 2 cases de sucesso (com números)
- 1 fracasso notável e lições aprendidas

## 💸 ANÁLISE DE PREÇOS

Mapeie:
- Faixas de preço (Low/Mid/High ticket)
- Elasticidade e sensibilidade a preço
- Sweet spot de preço

## 🚀 ESTRATÉGIA DE AQUISIÇÃO

Recomende:
- Mix ideal de canais (% do budget)
- Budget por fase (pré/lançamento/pós)
- CPL esperado por canal

## 📈 PROJEÇÕES

Apresente 3 cenários (conservador/realista/otimista):
- Taxa de conversão
- Faturamento projetado
- ROI esperado

## 🎁 BÔNUS E GARANTIAS

Sugira:
- 3 bônus valorizados com valor percebido
- Tipo de garantia ideal

## 🎯 SÍNTESE ESTRATÉGICA

Crie:
- Big Idea única para o lançamento
- Promessa principal irresistível
- Mecanismo único de entrega
- Provas de conceito necessárias
- Meta SMART completa

## 💡 PLANO DE AÇÃO

Liste 7 próximos passos prioritários e práticos.

---

**IMPORTANTE**: 
- Use dados reais e atualizados quando possível
- Faça estimativas conservadoras baseadas em padrões do mercado brasileiro
- Seja específico com números e métricas
- Foque em insights acionáveis
- Base suas análises nas pesquisas web fornecidas
- Considere especificamente o contexto e comportamento do consumidor brasileiro
- Use linguagem clara e profissional

Agora, realize a pesquisa completa com base no contexto fornecido.
`;
  }

  // Método para testar a conexão com a API
  async testConnection() {
    try {
      const response = await this.callDeepSeekAPI([
        {
          role: 'user',
          content: 'Teste de conexão. Responda apenas "OK".'
        }
      ], {
        max_tokens: 10
      });

      return response.includes('OK');
    } catch (error) {
      console.error('Erro no teste de conexão DeepSeek:', error);
      return false;
    }
  }
}

module.exports = new DeepSeekService();