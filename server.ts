import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response } from 'express';
import path from 'path';
import {
  executeAgentConversationTurn,
  generateGeminiText,
  testGeminiConnection,
  isValidGeminiKey
} from './server/geminiService';
import {
  getElevenLabsStatus,
  createOrSyncElevenLabsAgent,
  getElevenLabsAgentDetails,
  getSignedConnectionUrl,
  testElevenLabsConnection,
  listElevenLabsVoices,
  synthesizeElevenLabsSpeech,
  PRODUCTION_AGENT
} from './server/elevenLabsService';
import {
  getVapiStatus,
  listVapiAssistants,
  getVapiAssistant,
  updateVapiAssistant,
  getVapiClientConfig,
  createVapiAssistant
} from './server/vapiService';
import {
  loadAgentsFromStorage,
  createMainAgent,
  updateMainAgent,
  deleteMainAgent
} from './server/agentStore';
import {
  loadBillingConfig,
  saveBillingConfig,
  loadTransactions,
  createTransaction,
  updateTransactionStatus
} from './server/billingStore';
import {
  verifyAdminPassword,
  changeAdminPassword
} from './server/adminAuthStore';
import {
  dispatchPaymentNotifications,
  sendTelegramMessage,
  sendWhatsAppMessage
} from './server/notificationService';
import {
  loadWebsiteSettings,
  saveWebsiteSettings,
  WebsiteSettings,
  getStoredGeminiApiKey,
  getStoredElevenLabsApiKey
} from './server/websiteSettingsStore';

// Path resolution compatible with both tsx (ESM) and bundled CJS
const getDirname = () => {
  if (typeof __dirname !== 'undefined') {
    return __dirname;
  }
  return process.cwd();
};
const appDir = getDirname();

const app = express();
const PORT = 3000;
const HOST = '0.0.0.0';

// Middleware
app.use(express.json({ limit: '2mb' }));

// Simple in-memory request counter for basic rate limiting/abuse protection
const clientRequestCounts = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 60; // 60 requests/min per IP

const rateLimiter = (req: Request, res: Response, next: () => void) => {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const record = clientRequestCounts.get(clientIp);

  if (!record || now > record.resetAt) {
    clientRequestCounts.set(clientIp, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      success: false,
      error: 'Too many requests. Please slow down.'
    });
  }

  record.count += 1;
  next();
};

// Explicit health check endpoints for Cloud Run automated probes, load balancers, and uptime monitoring
// Mounted before rateLimiter so health checks and uptime pings are never rate-limited
const getHealthStatus = () => {
  const mem = process.memoryUsage();
  return {
    status: 'ok',
    service: 'VoiceAI BD',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    system: {
      nodeVersion: process.version,
      platform: process.platform,
      memoryUsageMB: {
        rss: Math.round(mem.rss / 1024 / 1024),
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024)
      }
    },
    integrations: {
      geminiConfigured: isValidApiKey(process.env.GEMINI_API_KEY || getStoredGeminiApiKey()),
      elevenLabsConfigured: isValidApiKey(process.env.ELEVENLABS_API_KEY || getStoredElevenLabsApiKey()),
      vapiConfigured: isValidApiKey(process.env.VAPI_PRIVATE_KEY || process.env.VAPI_API_KEY)
    }
  };
};

// Handle GET /health, /api/health, /_health, /healthz
app.get(['/health', '/api/health', '/_health', '/healthz'], (_req: Request, res: Response) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.status(200).json(getHealthStatus());
});

app.use('/api', rateLimiter);

// Helper function to check if API key is a placeholder or invalid format
const isValidApiKey = (key: string | undefined): boolean => {
  if (!key) return false;
  const trimmed = key.trim();
  if (trimmed.length < 10) return false;
  // If user entered a mock/placeholder like "your-key-here" or non-standard token
  if (trimmed.toLowerCase().includes('your_') || trimmed.toLowerCase().includes('placeholder')) {
    return false;
  }
  return true;
};

// -------------------------------------------------------------
// API: System Status & Integration Health (No credentials exposed)
// -------------------------------------------------------------
app.get('/api/status', async (_req: Request, res: Response) => {
  const hasGemini = isValidApiKey(process.env.GEMINI_API_KEY || getStoredGeminiApiKey());
  const hasElevenLabs = isValidApiKey(process.env.ELEVENLABS_API_KEY || getStoredElevenLabsApiKey());
  const hasVapi = isValidApiKey(process.env.VAPI_PRIVATE_KEY || process.env.VAPI_API_KEY);
  const defaultModel = 'gemini-3.8-flash';

  res.json({
    gemini: {
      configured: hasGemini,
      status: hasGemini ? 'Connected' : 'Not Configured',
      model: defaultModel,
      maskedKey: hasGemini ? '••••••••••••••••' : null
    },
    elevenlabs: {
      configured: hasElevenLabs,
      status: hasElevenLabs ? 'Connected' : 'Not Configured',
      maskedKey: hasElevenLabs ? '••••••••••••••••' : null
    },
    vapi: {
      configured: hasVapi,
      status: hasVapi ? 'Connected' : 'Not Configured',
      assistantId: 'b37b72e1-047d-408b-9096-cc5cf21256cd',
      assistantName: 'Ai Skill Hub Receptionist',
      maskedKey: hasVapi ? '••••••••••••••••' : null
    }
  });
});

// -------------------------------------------------------------
// API: Gemini Server-Side Agent Conversation Turn (Multi-turn, Reasoning, Intent, Lead Extraction, Structured JSON)
// Endpoint: POST /api/gemini/chat
// -------------------------------------------------------------
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const { message, agent, conversationHistory, knowledgeBaseContext, model } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and must be a non-empty string.'
      });
    }

    if (!agent || typeof agent !== 'object') {
      return res.status(400).json({
        success: false,
        error: 'Agent configuration object is required.'
      });
    }

    const apiKey = (process.env.GEMINI_API_KEY || getStoredGeminiApiKey() || '').trim();
    if (!apiKey || !isValidGeminiKey(apiKey)) {
      return res.status(503).json({
        success: false,
        error: 'GEMINI_API_KEY is not configured in server environment or Admin Panel.',
        isConfigured: false
      });
    }

    const turnResult = await executeAgentConversationTurn({
      userMessage: message,
      agent,
      conversationHistory,
      knowledgeBaseContext,
      model
    });

    const latencyMs = Date.now() - startTime;

    return res.json({
      success: true,
      data: turnResult,
      latencyMs
    });
  } catch (error: any) {
    const latencyMs = Date.now() - startTime;
    const errorMsg = error?.message || 'Unknown error during Gemini processing';
    console.warn('Gemini chat error:', errorMsg);

    const isRateLimited = errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota') || errorMsg.toLowerCase().includes('resource exhausted');

    return res.status(isRateLimited ? 429 : 500).json({
      success: false,
      error: isRateLimited 
        ? 'Gemini API rate limit or quota exceeded. Please wait a moment and try again.'
        : `Gemini processing failed: ${errorMsg}`,
      isRateLimited,
      isConfigured: true,
      latencyMs
    });
  }
});

// -------------------------------------------------------------
// API: Gemini Server-Side Generation
// Endpoint: POST /api/gemini/generate
// -------------------------------------------------------------
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, model } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Prompt is required and must be a non-empty string.'
      });
    }

    const apiKey = (process.env.GEMINI_API_KEY || getStoredGeminiApiKey() || '').trim();
    if (!apiKey || !isValidGeminiKey(apiKey)) {
      return res.status(503).json({
        success: false,
        error: 'GEMINI_API_KEY is not configured. Please set it in Admin Panel > Website CMS > API Keys.',
        isConfigured: false
      });
    }

    const result = await generateGeminiText({
      prompt,
      systemInstruction,
      model
    });

    return res.json({
      success: true,
      text: result.text,
      model: result.model
    });
  } catch (error: any) {
    const errorMsg = error?.message || 'Unknown error';
    console.warn('Gemini generate caught:', errorMsg);

    const isRateLimited = errorMsg.includes('429') || errorMsg.toLowerCase().includes('quota');
    return res.status(isRateLimited ? 429 : 500).json({
      success: false,
      error: `Gemini generation failed: ${errorMsg}`,
      isRateLimited
    });
  }
});

// -------------------------------------------------------------
// API: Gemini Test Connection
// Endpoint: POST /api/gemini/test
// -------------------------------------------------------------
app.post('/api/gemini/test', async (_req: Request, res: Response) => {
  try {
    const apiKey = (process.env.GEMINI_API_KEY || getStoredGeminiApiKey() || '').trim();
    if (!apiKey || !isValidGeminiKey(apiKey)) {
      return res.status(503).json({
        success: false,
        error: 'GEMINI_API_KEY is not configured or is a placeholder in server environment or Admin Panel.'
      });
    }

    const result = await testGeminiConnection();
    return res.json(result);
  } catch (err: any) {
    const errorMsg = err?.message || 'Unknown error';
    console.warn('Gemini test connection failed:', errorMsg);
    return res.status(500).json({
      success: false,
      error: `Gemini API test failed: ${errorMsg}`
    });
  }
});

// -------------------------------------------------------------
// Mapping of local demo voice IDs to valid public ElevenLabs default voice IDs
const DEMO_VOICE_MAP: Record<string, string> = {
  'voice-bn-female-1': '21m00Tcm4TlvDq8ikWAM', // Rachel
  'voice-bn-male-1': 'ErXwobaYiN019PkySvjV',   // Antoni
  'voice-bn-female-2': 'EXAVITQu4vr4xnSDxMaL', // Bella
  'voice-en-male-1': 'VR6AewLTigWG4xSOukaG',   // Arnold
};

const resolveElevenLabsVoiceId = (voiceId: string | undefined): string => {
  if (!voiceId) return '21m00Tcm4TlvDq8ikWAM';
  if (DEMO_VOICE_MAP[voiceId]) {
    return DEMO_VOICE_MAP[voiceId];
  }
  // ElevenLabs voice IDs are 20-character alphanumeric strings
  if (/^[a-zA-Z0-9]{15,30}$/.test(voiceId)) {
    return voiceId;
  }
  return '21m00Tcm4TlvDq8ikWAM';
};

// -------------------------------------------------------------
// ElevenLabs Conversational AI & Voice Service Endpoints
// -------------------------------------------------------------

// 1. Integration Status
// Endpoint: GET /api/elevenlabs/status
app.get('/api/elevenlabs/status', async (_req: Request, res: Response) => {
  try {
    const report = await getElevenLabsStatus();
    return res.json({
      success: true,
      data: report
    });
  } catch (error: any) {
    console.error('Error fetching ElevenLabs status:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to determine ElevenLabs status'
    });
  }
});

// 2. Agent Creation / Synchronization
// Endpoint: POST /api/elevenlabs/agent/create & /api/elevenlabs/agent/sync
const handleAgentCreateOrSync = async (req: Request, res: Response) => {
  try {
    const result = await createOrSyncElevenLabsAgent(req.body);
    return res.json(result);
  } catch (error: any) {
    console.error('Error creating/syncing ElevenLabs agent:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to create or synchronize ElevenLabs agent'
    });
  }
};
app.post('/api/elevenlabs/agent/create', handleAgentCreateOrSync);
app.post('/api/elevenlabs/agent/sync', handleAgentCreateOrSync);

// 3. Agent Details
// Endpoint: GET /api/elevenlabs/agent/current & GET /api/elevenlabs/agent/:agentId
app.get('/api/elevenlabs/agent/current', async (_req: Request, res: Response) => {
  try {
    const result = await getElevenLabsAgentDetails();
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to retrieve current agent details'
    });
  }
});

app.get('/api/elevenlabs/agent/:agentId', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;
    const result = await getElevenLabsAgentDetails(agentId);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to retrieve agent details'
    });
  }
});

// 4. Agent Connection Test
// Endpoint: POST /api/elevenlabs/test
app.post('/api/elevenlabs/test', async (_req: Request, res: Response) => {
  try {
    const result = await testElevenLabsConnection();
    return res.json(result);
  } catch (error: any) {
    return res.json({
      success: false,
      message: `ElevenLabs test failed: ${error?.message || 'Unknown error'}`
    });
  }
});

// 5. Secure Client Connection (Signed Temporary WebSocket URL)
// Endpoint: GET /api/elevenlabs/signed-url
app.get('/api/elevenlabs/signed-url', async (req: Request, res: Response) => {
  try {
    const agentId = (req.query.agentId as string) || PRODUCTION_AGENT.agentId;
    const result = await getSignedConnectionUrl(agentId);
    return res.json(result);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate signed connection URL'
    });
  }
});

// 6. Voice Configuration & List
// Endpoint: GET /api/elevenlabs/voices
app.get('/api/elevenlabs/voices', async (_req: Request, res: Response) => {
  try {
    const result = await listElevenLabsVoices();
    return res.json(result);
  } catch (error: any) {
    return res.json({
      success: false,
      configured: false,
      voices: [],
      error: error?.message || 'Failed to list voices'
    });
  }
});

// 7. Voice TTS Synthesis (Multilingual v2)
// Endpoint: POST /api/elevenlabs/tts
app.post('/api/elevenlabs/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceId, modelId } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Text is required for TTS conversion.'
      });
    }

    const result = await synthesizeElevenLabsSpeech({
      text,
      voiceId,
      modelId
    });

    if (!result.success || !result.audioBuffer) {
      return res.status(result.status || 400).json({
        success: false,
        error: result.error || 'ElevenLabs TTS synthesis failed.'
      });
    }

    // Stream the audio back directly with audio/mpeg
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    return res.send(result.audioBuffer);
  } catch (error: any) {
    console.error('ElevenLabs TTS error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'ElevenLabs TTS synthesis encountered an unexpected error.'
    });
  }
});

// =============================================================
// VAPI INTEGRATION ROUTES (Voice Calling & AI Phone Receptionist)
// =============================================================

// 1. GET /api/vapi/status - Live connection health and active assistant
app.get('/api/vapi/status', async (_req: Request, res: Response) => {
  try {
    const report = await getVapiStatus();
    return res.json({
      success: report.connected,
      data: report
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to check Vapi status'
    });
  }
});

// 2. GET /api/vapi/config - Safe client-side configuration (Public Key & Assistant ID only)
app.get('/api/vapi/config', (_req: Request, res: Response) => {
  const config = getVapiClientConfig();
  return res.json({
    success: true,
    data: config
  });
});

// 3. GET /api/vapi/assistants - List all assistants in Vapi account
app.get('/api/vapi/assistants', async (_req: Request, res: Response) => {
  try {
    const result = await listVapiAssistants();
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to list Vapi assistants'
    });
  }
});

// 4. GET /api/vapi/assistant/:id? - Get single assistant configuration
app.get('/api/vapi/assistant/:id?', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const result = await getVapiAssistant(id);
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to fetch Vapi assistant'
    });
  }
});

// 5. PATCH /api/vapi/assistant/:id - Update assistant prompt/greeting
app.patch('/api/vapi/assistant/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { firstMessage, instructions, name } = req.body;
    const result = await updateVapiAssistant(id, { firstMessage, instructions, name });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to update Vapi assistant'
    });
  }
});

// 6. POST /api/vapi/test - Quick connection test
app.post('/api/vapi/test', async (_req: Request, res: Response) => {
  try {
    const report = await getVapiStatus();
    return res.json({
      success: report.connected,
      message: report.message,
      latencyMs: report.latencyMs,
      details: report
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Failed to test Vapi connection'
    });
  }
});

// 7. POST /api/vapi/assistants/create - Create a brand new Vapi voice assistant
app.post('/api/vapi/assistants/create', async (req: Request, res: Response) => {
  try {
    const { name, firstMessage, instructions, voiceId, voiceProvider, model, apiKey } = req.body;
    const result = await createVapiAssistant({
      name,
      firstMessage,
      instructions,
      voiceId,
      voiceProvider,
      model,
      apiKey
    });
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to create Vapi assistant'
    });
  }
});

// =============================================================
// MAIN SERVER STORAGE AGENTS API (Persistent Disk + Vapi Realtime Sync)
// =============================================================

// 1. GET /api/agents - Fetch all agents from server main storage
app.get('/api/agents', (_req: Request, res: Response) => {
  try {
    const agents = loadAgentsFromStorage();
    return res.json({
      success: true,
      data: agents,
      storage: 'server-main-storage',
      count: agents.length
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to load agents from main storage'
    });
  }
});

// 2. GET /api/agents/:id - Fetch single agent from main storage
app.get('/api/agents/:id', (req: Request, res: Response) => {
  try {
    const agents = loadAgentsFromStorage();
    const found = agents.find((a) => a.id === req.params.id);
    if (!found) {
      return res.status(404).json({ success: false, error: 'Agent not found' });
    }
    return res.json({ success: true, data: found });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// 3. POST /api/agents - Create agent in Main Storage AND create assistant in Vapi!
app.post('/api/agents', async (req: Request, res: Response) => {
  try {
    const { agent, vapiCreated, vapiError } = await createMainAgent(req.body);
    return res.status(201).json({
      success: true,
      data: agent,
      vapiCreated,
      vapiError,
      message: vapiCreated
        ? 'এজেন্ট সফলভাবে মেইন স্টোরেজে সংরক্ষিত হয়েছে এবং Vapi Assistant তৈরি হয়েছে!'
        : 'এজেন্ট মেইন স্টোরেজে সংরক্ষিত হয়েছে।'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to create agent in main storage'
    });
  }
});

// 4. PUT/PATCH /api/agents/:id - Update agent prompt, instructions, or settings in Main Storage AND sync to Vapi!
const handleUpdateAgent = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { agent, vapiSynced, vapiError } = await updateMainAgent(id, req.body);
    if (!agent) {
      return res.status(404).json({ success: false, error: 'Agent not found' });
    }
    return res.json({
      success: true,
      data: agent,
      vapiSynced,
      vapiError,
      message: vapiSynced
        ? 'এজেন্টের নির্দেশিকা মেইন স্টোরেজে আপডেট হয়েছে এবং Vapi-তে রিয়েল-টাইমে সিঙ্ক হয়েছে!'
        : 'এজেন্ট মেইন স্টোরেজে সফলভাবে আপডেট হয়েছে।'
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      error: err?.message || 'Failed to update agent in main storage'
    });
  }
};
app.put('/api/agents/:id', handleUpdateAgent);
app.patch('/api/agents/:id', handleUpdateAgent);

// 5. DELETE /api/agents/:id - Delete agent from Main Storage
app.delete('/api/agents/:id', (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const deleted = deleteMainAgent(id);
    return res.json({
      success: deleted,
      message: deleted ? 'এজেন্ট মেইন স্টোরেজ থেকে ডিলিট করা হয়েছে।' : 'Agent not found'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// =============================================================
// BILLING, BKASH / NAGAD PAYMENT & TRANSACTIONS API
// =============================================================

// 1. GET /api/billing/config - Get active receiver bKash / Nagad payment numbers
app.get('/api/billing/config', (_req: Request, res: Response) => {
  try {
    const config = loadBillingConfig();
    return res.json({ success: true, data: config });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// 2. POST /api/billing/config - Update receiver bKash / Nagad payment numbers
app.post('/api/billing/config', (req: Request, res: Response) => {
  try {
    const updated = saveBillingConfig(req.body);
    return res.json({
      success: true,
      data: updated,
      message: 'পেমেন্ট গেটওয়ে কনফিগারেশন সফলভাবে সংরক্ষিত হয়েছে।'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// 3. GET /api/billing/transactions - Get all bKash / Nagad submitted transactions
app.get('/api/billing/transactions', (_req: Request, res: Response) => {
  try {
    const transactions = loadTransactions();
    return res.json({ success: true, data: transactions });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// 4. POST /api/billing/transactions - Customer submits payment transaction from checkout
app.post('/api/billing/transactions', (req: Request, res: Response) => {
  try {
    const { customerName, customerEmail, customerPhone, planId, planName, amount, paymentMethod, senderNumber, transactionId, notes } = req.body;
    if (!senderNumber || !transactionId) {
      return res.status(400).json({ success: false, error: 'প্রেরকের মোবাইল নম্বর ও TrxID আবশ্যক।' });
    }
    const txn = createTransaction({
      customerName: customerName || 'Valued Customer',
      customerEmail: customerEmail || 'customer@voiceai.bd',
      customerPhone: customerPhone || senderNumber,
      planId: planId || 'starter',
      planName: planName || 'Subscription Plan',
      amount: Number(amount) || 1999,
      paymentMethod: paymentMethod || 'bKash',
      senderNumber,
      transactionId: transactionId.trim().toUpperCase(),
      notes: notes || '',
      status: 'PENDING'
    });

    // Asynchronously dispatch instant Telegram & WhatsApp alert
    dispatchPaymentNotifications(txn).catch((notifyErr) => {
      console.error('[Notification Dispatch Error]:', notifyErr);
    });

    return res.status(201).json({
      success: true,
      data: txn,
      message: 'আপনার পেমেন্ট ট্রানজেকশন সফলভাবে জমা হয়েছে। অ্যাডমিন টিম ভেরিফাই করার সাথে সাথে প্ল্যান সক্রিয় হবে।'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// 6. POST /api/billing/notifications/test-telegram - Send test alert to Telegram
app.post('/api/billing/notifications/test-telegram', async (req: Request, res: Response) => {
  try {
    const { botToken, chatId } = req.body;
    const config = loadBillingConfig();
    const token = botToken || config.telegramBotToken;
    const chat = chatId || config.telegramChatId;

    if (!token || !chat) {
      return res.status(400).json({
        success: false,
        error: 'Telegram Bot Token এবং Chat ID উভয় ফিল্ড পূরণ করুন।'
      });
    }

    const testHtml = `🚀 <b>VoiceAI BD — Telegram কানেকশন সফল!</b>
━━━━━━━━━━━━━━━━━━
✅ আপনার টেলিগ্রাম বট সফলভাবে কানেক্ট হয়েছে।
🔔 কাস্টমার কোনো প্যাকেজ কিনলে বা bKash/Nagad ট্রানজেকশন সাবমিট করলেই এই বটে তাৎক্ষণিক নোটিফিকেশন আসবে।
⏰ সময়: ${new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' })}`;

    const result = await sendTelegramMessage(token, chat, testHtml);
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.json({ success: true, message: 'টেলিগ্রাম বটে টেস্ট নোটিফিকেশন সফলভাবে পাঠানো হয়েছে!' });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// 7. POST /api/billing/notifications/test-whatsapp - Send test alert to WhatsApp
app.post('/api/billing/notifications/test-whatsapp', async (req: Request, res: Response) => {
  try {
    const { whatsappNumber, webhookUrl, apiKey } = req.body;
    const config = loadBillingConfig();
    const phone = whatsappNumber || config.whatsappNumber || '+8801712345678';
    const hook = webhookUrl !== undefined ? webhookUrl : config.whatsappWebhookUrl;
    const key = apiKey !== undefined ? apiKey : config.whatsappApiKey;

    const testMsg = `🚀 VoiceAI BD — WhatsApp কানেকশন টেস্ট!\n\n✅ আপনার হোয়াটসঅ্যাপ নম্বর (${phone}) সফলভাবে সংযুক্ত হয়েছে। কাস্টমার প্যাকেজ রিকোয়েস্ট করলে অ্যালার্ট পাঠানো হবে।`;

    const result = await sendWhatsAppMessage(phone, testMsg, { webhookUrl: hook, apiKey: key });
    if (!result.success) {
      return res.status(400).json({ success: false, error: result.error });
    }
    return res.json({
      success: true,
      message: 'হোয়াটসঅ্যাপ কনফিগারেশন যাচাই সফল হয়েছে!',
      directWaLink: `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(testMsg)}`
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// 5. PATCH /api/billing/transactions/:id - Admin approves or rejects transaction
app.patch('/api/billing/transactions/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, verifiedBy, rejectionReason } = req.body;
    if (!status || !['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Valid status (APPROVED, REJECTED, PENDING) is required.' });
    }
    const updated = updateTransactionStatus(id, status, verifiedBy, rejectionReason);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Transaction not found.' });
    }
    return res.json({
      success: true,
      data: updated,
      message: status === 'APPROVED' ? 'পেমেন্ট অনুমোদিত হয়েছে এবং অ্যাকাউন্ট আপগ্রেড কার্যকর করা হয়েছে।' : 'পেমেন্ট স্ট্যাটাস আপডেট সম্পন্ন।'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// =============================================================
// ADMIN SECURITY & PASSWORD VERIFICATION API
// =============================================================

// 1. POST /api/admin/verify - Verify Admin / Super Admin password
app.post('/api/admin/verify', (req: Request, res: Response) => {
  try {
    const { password, role = 'admin' } = req.body;
    const isValid = verifyAdminPassword(password, role);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক অ্যাডমিন পাসওয়ার্ড প্রদান করুন।'
      });
    }
    return res.json({
      success: true,
      role,
      token: `admin_token_${Date.now()}_verified`,
      message: 'অ্যাডমিন ভেরিফিকেশন সফল!'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// 2. POST /api/admin/change-password - Change Admin / Super Admin password
app.post('/api/admin/change-password', (req: Request, res: Response) => {
  try {
    const { role = 'admin', currentPassword, newPassword } = req.body;
    const result = changeAdminPassword(role, currentPassword, newPassword);
    if (!result.success) {
      return res.status(400).json(result);
    }
    return res.json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// =============================================================
// WEBSITE CMS & SYSTEM SETTINGS API (A-to-Z Content & API Control)
// =============================================================

// 1. GET /api/website/settings - Get all website settings (with masked secret keys)
app.get('/api/website/settings', (_req: Request, res: Response) => {
  try {
    const settings = loadWebsiteSettings();
    const hasVapiPrivate = Boolean(process.env.VAPI_PRIVATE_KEY || process.env.VAPI_API_KEY || settings.vapiPrivateKey);
    const hasGemini = Boolean(process.env.GEMINI_API_KEY || settings.geminiApiKey);
    const hasElevenLabs = Boolean(process.env.ELEVENLABS_API_KEY || settings.elevenLabsApiKey);

    return res.json({
      success: true,
      data: {
        ...settings,
        hasVapiPrivateKey: hasVapiPrivate,
        vapiPrivateKeyMasked: hasVapiPrivate ? '••••••••••••••••' : null,
        hasGeminiApiKey: hasGemini,
        geminiApiKeyMasked: hasGemini ? '••••••••••••••••' : null,
        hasElevenLabsApiKey: hasElevenLabs,
        elevenLabsApiKeyMasked: hasElevenLabs ? '••••••••••••••••' : null,
        // Do not expose raw secret values in GET response
        vapiPrivateKey: '',
        geminiApiKey: '',
        elevenLabsApiKey: ''
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// 2. POST /api/website/settings - Update website content, identity, & API keys
app.post('/api/website/settings', (req: Request, res: Response) => {
  try {
    const updates = req.body;
    const current = loadWebsiteSettings();
    const payload: Partial<WebsiteSettings> = { ...updates };
    
    // Only update API keys if non-empty string provided
    if (!payload.vapiPrivateKey && current.vapiPrivateKey) delete payload.vapiPrivateKey;
    if (!payload.geminiApiKey && current.geminiApiKey) delete payload.geminiApiKey;
    if (!payload.elevenLabsApiKey && current.elevenLabsApiKey) delete payload.elevenLabsApiKey;

    const saved = saveWebsiteSettings(payload);
    return res.json({
      success: true,
      data: saved,
      message: 'ওয়েবসাইটের কনটেন্ট এবং সেটিংস সফলভাবে আপডেট করা হয়েছে।'
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message });
  }
});

// -------------------------------------------------------------
// Vite Middleware / Production Static Fallback
// -------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, HOST, () => {
    console.log(`VoiceAI BD full-stack server running on http://${HOST}:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
