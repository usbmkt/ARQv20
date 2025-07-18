const geminiService = require('./geminiService');
const deepseekService = require('./deepseekService');

class AIService {
  constructor() {
    this.provider = process.env.AI_PROVIDER || 'gemini';
    this.availableProviders = ['gemini', 'deepseek', 'both'];
    
    if (!this.availableProviders.includes(this.provider)) {
      console.warn(`Provedor AI inválido: ${this.provider}. Usando Gemini como padrão.`);
      this.provider = 'gemini';
    }
  }

  // Método principal para análise de mercado
  async analyzeMarket(context) {
    try {
      console.log(`🤖 Usando provedor AI: ${this.provider}`);

      switch (this.provider) {
        case 'gemini':
          return await geminiService.analyzeMarket(context);
        
        case 'deepseek':
          return await deepseekService.analyzeMarket(context);
        
        case 'both':
          return await this.analyzeWithBothProviders(context);
        
        default:
          throw new Error(`Provedor AI não suportado: ${this.provider}`);
      }
    } catch (error) {
      console.error('Erro na análise de mercado:', error);
      
      // Fallback: tentar o outro provedor se o principal falhar
      if (this.provider === 'gemini') {
        console.log('🔄 Tentando fallback para DeepSeek...');
        try {
          return await deepseekService.analyzeMarket(context);
        } catch (fallbackError) {
          console.error('Erro no fallback DeepSeek:', fallbackError);
        }
      } else if (this.provider === 'deepseek') {
        console.log('🔄 Tentando fallback para Gemini...');
        try {
          return await geminiService.analyzeMarket(context);
        } catch (fallbackError) {
          console.error('Erro no fallback Gemini:', fallbackError);
        }
      }
      
      throw error;
    }
  }

  // Análise com ambos os provedores (para comparação)
  async analyzeWithBothProviders(context) {
    try {
      console.log('🔄 Executando análise com ambos os provedores...');
      
      const [geminiResult, deepseekResult] = await Promise.allSettled([
        geminiService.analyzeMarket(context),
        deepseekService.analyzeMarket(context)
      ]);

      const results = {
        success: true,
        analysis: '',
        metadata: {
          providers: [],
          generatedAt: new Date().toISOString(),
          segmento: context.segmento
        }
      };

      // Processar resultado do Gemini
      if (geminiResult.status === 'fulfilled') {
        results.gemini = {
          analysis: geminiResult.value.analysis,
          metadata: geminiResult.value.metadata
        };
        results.metadata.providers.push('gemini');
      } else {
        console.error('Erro no Gemini:', geminiResult.reason);
        results.gemini = {
          error: geminiResult.reason.message
        };
      }

      // Processar resultado do DeepSeek
      if (deepseekResult.status === 'fulfilled') {
        results.deepseek = {
          analysis: deepseekResult.value.analysis,
          metadata: deepseekResult.value.metadata
        };
        results.metadata.providers.push('deepseek');
      } else {
        console.error('Erro no DeepSeek:', deepseekResult.reason);
        results.deepseek = {
          error: deepseekResult.reason.message
        };
      }

      // Se pelo menos um provedor funcionou, usar o resultado
      if (results.metadata.providers.length > 0) {
        // Priorizar DeepSeek se ambos funcionaram, senão usar o que funcionou
        if (results.deepseek && !results.deepseek.error) {
          results.analysis = results.deepseek.analysis;
          results.metadata.primaryProvider = 'deepseek';
        } else if (results.gemini && !results.gemini.error) {
          results.analysis = results.gemini.analysis;
          results.metadata.primaryProvider = 'gemini';
        }

        return results;
      } else {
        throw new Error('Ambos os provedores AI falharam');
      }
    } catch (error) {
      console.error('Erro na análise com ambos provedores:', error);
      throw error;
    }
  }

  // Testar conexão com os provedores
  async testConnections() {
    const results = {
      gemini: false,
      deepseek: false
    };

    try {
      // Testar Gemini
      if (process.env.GEMINI_API_KEY) {
        try {
          // Gemini não tem método de teste específico, assumir que está OK se a key existe
          results.gemini = true;
        } catch (error) {
          console.error('Erro no teste Gemini:', error);
        }
      }

      // Testar DeepSeek
      if (process.env.DEEPSEEK_API_KEY) {
        try {
          results.deepseek = await deepseekService.testConnection();
        } catch (error) {
          console.error('Erro no teste DeepSeek:', error);
        }
      }
    } catch (error) {
      console.error('Erro nos testes de conexão:', error);
    }

    return results;
  }

  // Obter informações sobre o provedor atual
  getProviderInfo() {
    return {
      current: this.provider,
      available: this.availableProviders,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
      hasDeepSeekKey: !!process.env.DEEPSEEK_API_KEY
    };
  }

  // Alterar provedor dinamicamente
  setProvider(provider) {
    if (this.availableProviders.includes(provider)) {
      this.provider = provider;
      console.log(`🔄 Provedor AI alterado para: ${provider}`);
      return true;
    } else {
      console.error(`Provedor inválido: ${provider}`);
      return false;
    }
  }
}

module.exports = new AIService();