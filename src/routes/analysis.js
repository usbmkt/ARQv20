const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const { supabase } = require('../config/database');
const { validateAnalysisRequest } = require('../middleware/validation');
const rateLimit = require('express-rate-limit');

// Rate limiting específico para análises (mais restritivo)
const analysisLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  max: 10, // máximo 10 análises por hora por IP
  message: {
    error: 'Limite de análises excedido. Tente novamente em 1 hora.',
    limit: 10,
    window: '1 hora'
  }
});

// Middleware de autenticação simples (pode ser expandido)
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({
        error: 'Token de autorização necessário',
        message: 'Inclua o header Authorization: Bearer <token>'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        error: 'Token inválido',
        message: 'Formato esperado: Bearer <token>'
      });
    }

    // Verificar token no Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({
        error: 'Token inválido ou expirado',
        message: 'Faça login novamente'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Erro na autenticação:', error);
    res.status(500).json({
      error: 'Erro interno de autenticação',
      message: 'Tente novamente'
    });
  }
};

// POST /api/analysis/market - Análise de mercado completa
router.post('/market', analysisLimiter, authenticate, validateAnalysisRequest, async (req, res) => {
  try {
    const startTime = Date.now();
    const { segmento, contexto_adicional, usuario_id } = req.body;

    console.log(`🚀 Iniciando análise de mercado para segmento: ${segmento}`);

    // Preparar contexto para análise
    const analysisContext = {
      segmento,
      contexto_adicional,
      usuario_id,
      timestamp: new Date().toISOString()
    };

    // Realizar análise com Gemini
    const analysisResult = await aiService.analyzeMarket(analysisContext);

    // Salvar análise no banco de dados
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('analyses')
      .insert({
        user_id: usuario_id,
        segmento,
        contexto_adicional,
        resultado: analysisResult.analysis,
        metadata: analysisResult.metadata,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (saveError) {
      console.error('Erro ao salvar análise:', saveError);
      // Continuar mesmo com erro de salvamento
    }

    const processingTime = Date.now() - startTime;

    res.status(200).json({
      success: true,
      data: {
        id: savedAnalysis?.id,
        segmento,
        analysis: analysisResult.analysis,
        metadata: {
          ...analysisResult.metadata,
          processingTimeMs: processingTime,
          savedToDatabase: !saveError
        }
      },
      message: 'Análise de mercado concluída com sucesso'
    });

  } catch (error) {
    console.error('Erro na análise de mercado:', error);
    
    res.status(500).json({
      success: false,
      error: 'Erro na análise de mercado',
      message: error.message || 'Erro interno do servidor',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET /api/analysis/history - Histórico de análises do usuário
router.get('/history', authenticate, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { data: analyses, error, count } = await supabase
      .from('analyses')
      .select('id, segmento, contexto_adicional, created_at, metadata', { count: 'exact' })
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      data: {
        analyses,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      }
    });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar histórico',
      message: error.message
    });
  }
});

// GET /api/analysis/:id - Buscar análise específica
router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const { data: analysis, error } = await supabase
      .from('analyses')
      .select('*')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({
          success: false,
          error: 'Análise não encontrada',
          message: 'A análise solicitada não existe ou não pertence a você'
        });
      }
      throw error;
    }

    res.status(200).json({
      success: true,
      data: analysis
    });

  } catch (error) {
    console.error('Erro ao buscar análise:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar análise',
      message: error.message
    });
  }
});

// DELETE /api/analysis/:id - Deletar análise
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('analyses')
      .delete()
      .eq('id', id)
      .eq('user_id', req.user.id);

    if (error) {
      throw error;
    }

    res.status(200).json({
      success: true,
      message: 'Análise deletada com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar análise:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao deletar análise',
      message: error.message
    });
  }
});

// GET /api/analysis/stats/overview - Estatísticas gerais
router.get('/stats/overview', authenticate, async (req, res) => {
  try {
    // Total de análises
    const { count: totalAnalyses } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);

    // Análises este mês
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count: thisMonth } = await supabase
      .from('analyses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id)
      .gte('created_at', startOfMonth.toISOString());

    // Segmentos mais analisados
    const { data: topSegments } = await supabase
      .from('analyses')
      .select('segmento')
      .eq('user_id', req.user.id);

    const segmentCounts = {};
    topSegments?.forEach(analysis => {
      segmentCounts[analysis.segmento] = (segmentCounts[analysis.segmento] || 0) + 1;
    });

    const topSegmentsList = Object.entries(segmentCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([segmento, count]) => ({ segmento, count }));

    res.status(200).json({
      success: true,
      data: {
        totalAnalyses: totalAnalyses || 0,
        thisMonth: thisMonth || 0,
        topSegments: topSegmentsList
      }
    });

  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas',
      message: error.message
    });
  }
});

// GET /api/analysis/ai/status - Status dos provedores AI
router.get('/ai/status', async (req, res) => {
  try {
    const providerInfo = aiService.getProviderInfo();
    const connections = await aiService.testConnections();

    res.status(200).json({
      success: true,
      data: {
        ...providerInfo,
        connections,
        status: {
          gemini: providerInfo.hasGeminiKey && connections.gemini ? 'online' : 'offline',
          deepseek: providerInfo.hasDeepSeekKey && connections.deepseek ? 'online' : 'offline'
        }
      }
    });
  } catch (error) {
    console.error('Erro ao verificar status AI:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao verificar status dos provedores AI',
      message: error.message
    });
  }
});

// POST /api/analysis/ai/provider - Alterar provedor AI
router.post('/ai/provider', authenticate, async (req, res) => {
  try {
    const { provider } = req.body;
    
    if (!provider) {
      return res.status(400).json({
        success: false,
        error: 'Provedor é obrigatório',
        message: 'Informe o provedor: gemini, deepseek ou both'
      });
    }

    const success = aiService.setProvider(provider);
    
    if (success) {
      res.status(200).json({
        success: true,
        data: {
          provider: aiService.getProviderInfo().current
        },
        message: `Provedor alterado para: ${provider}`
      });
    } else {
      res.status(400).json({
        success: false,
        error: 'Provedor inválido',
        message: 'Provedores disponíveis: gemini, deepseek, both'
      });
    }
  } catch (error) {
    console.error('Erro ao alterar provedor:', error);
    res.status(500).json({
      success: false,
      error: 'Erro ao alterar provedor AI',
      message: error.message
    });
  }
});

module.exports = router;

