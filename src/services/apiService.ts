// Client-side API Service for VoiceAI BD
// Communicates ONLY with our server-side Express endpoints.
// NO secret keys are stored or exposed here.

export interface ApiStatusResponse {
  gemini: {
    configured: boolean;
    status: 'Connected' | 'Not Configured';
    model: string;
    maskedKey: string | null;
  };
  elevenlabs: {
    configured: boolean;
    status: 'Connected' | 'Not Configured';
    maskedKey: string | null;
  };
  vapi?: {
    configured: boolean;
    status: 'Connected' | 'Not Configured';
    assistantId?: string | null;
    assistantName?: string | null;
    maskedKey: string | null;
  };
}

export interface HealthCheckResponse {
  status: string;
  service: string;
  environment: string;
  uptimeSeconds: number;
  timestamp: string;
  system: {
    nodeVersion: string;
    platform: string;
    memoryUsageMB: {
      rss: number;
      heapUsed: number;
      heapTotal: number;
    };
  };
  integrations: {
    geminiConfigured: boolean;
    elevenLabsConfigured: boolean;
    vapiConfigured?: boolean;
  };
}

export interface DemoUsageStats {
  geminiRequests: number;
  elevenLabsRequests: number;
  generatedCharacters: number;
  generatedAudioRequests: number;
  lastUpdated: string;
}

const DEMO_USAGE_STORAGE_KEY = 'voiceai_demo_usage_stats';

export function getDemoUsageStats(): DemoUsageStats {
  try {
    const saved = localStorage.getItem(DEMO_USAGE_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to read demo usage stats:', e);
  }

  return {
    geminiRequests: 14,
    elevenLabsRequests: 8,
    generatedCharacters: 4120,
    generatedAudioRequests: 8,
    lastUpdated: new Date().toLocaleTimeString()
  };
}

export function recordDemoUsage(type: 'gemini' | 'elevenlabs', characters: number = 0): DemoUsageStats {
  const current = getDemoUsageStats();
  const updated: DemoUsageStats = {
    ...current,
    geminiRequests: type === 'gemini' ? current.geminiRequests + 1 : current.geminiRequests,
    elevenLabsRequests: type === 'elevenlabs' ? current.elevenLabsRequests + 1 : current.elevenLabsRequests,
    generatedCharacters: current.generatedCharacters + Math.max(0, characters),
    generatedAudioRequests: type === 'elevenlabs' ? current.generatedAudioRequests + 1 : current.generatedAudioRequests,
    lastUpdated: new Date().toLocaleTimeString()
  };

  try {
    localStorage.setItem(DEMO_USAGE_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('voiceai_usage_updated'));
  } catch (e) {
    console.error('Failed to save demo usage stats:', e);
  }

  return updated;
}

// Fetch API status from server
export async function fetchApiStatus(): Promise<ApiStatusResponse> {
  try {
    const res = await fetch('/api/status');
    if (!res.ok) throw new Error('Status endpoint failed');
    return await res.json();
  } catch {
    return {
      gemini: { configured: false, status: 'Not Configured', model: 'gemini-3.8-flash', maskedKey: null },
      elevenlabs: { configured: false, status: 'Not Configured', maskedKey: null }
    };
  }
}

// Fetch automated health & uptime monitoring status
export async function fetchHealthStatus(): Promise<HealthCheckResponse | null> {
  try {
    const res = await fetch('/health');
    if (!res.ok) throw new Error('Health endpoint failed');
    return await res.json();
  } catch (err) {
    console.warn('Health check request failed:', err);
    return null;
  }
}

// Server-side Gemini content generation
export async function generateAiInstructions(params: {
  businessName: string;
  businessType?: string;
  agentType: string;
  language: string;
  personality: string;
  services?: string;
  customerSupportRequirements?: string;
}): Promise<{ success: boolean; text: string; isRealAi: boolean; error?: string }> {
  const systemInstruction = `আপনি একটি বাংলাদেশি ব্যবসার AI Voice Assistant / Receptionist তৈরির জন্য নির্দেশিকা (System Prompt / Instructions) প্রণেতা।
আপনার লক্ষ্য হলো অত্যন্ত মানসম্মত, নম্র, সাবলীল এবং কার্যকরী বাংলা ভাষায় AI ভয়েস এজেন্টের বিস্তারিত নির্দেশনা তৈরি করা। 
এজেন্ট কীভাবে কল রিসিভ করবে, সম্ভাষণ জানাবে, তথ্যাদি দেবে এবং লিড তথ্য (নাম ও ফোন) সংগ্রহ করবে তা সুনির্দিষ্ট করুন।`;

  const prompt = `অনুগ্রহ করে নিচের তথ্যের ওপর ভিত্তি করে একটি পারফেক্ট AI Voice Agent Instruction তৈরি করুন:
- Business Name: ${params.businessName || 'আমার ব্যবসা'}
- Business Type: ${params.businessType || 'সার্ভিস ও ট্রেনিং'}
- Agent Type: ${params.agentType || 'Receptionist'}
- Language: ${params.language || 'বাংলা'}
- Personality: ${params.personality || 'Professional'}
- Services: ${params.services || 'অফিস হেল্পলাইন, কোর্স তথ্য ও কাস্টমার সাপোর্ট'}
- Customer Support Requirements: ${params.customerSupportRequirements || 'অত্যন্ত নম্র ভাষায় কথা বলা, কলারের নাম ও মোবাইল নম্বর নিশ্চিত করা'}`;

  try {
    const response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction })
    });

    const data = await response.json();

    if (response.ok && data.success && data.text) {
      recordDemoUsage('gemini', prompt.length + data.text.length);
      return { success: true, text: data.text, isRealAi: true };
    }

    return {
      success: false,
      text: '',
      isRealAi: false,
      error: data.error || 'Gemini Backend Error: Gemini API is currently unavailable.'
    };
  } catch (err: any) {
    return {
      success: false,
      text: '',
      isRealAi: false,
      error: err?.message || 'Gemini Backend Error: Connection failed.'
    };
  }
}

// Server-side Gemini conversation response
export async function generateConversationReply(params: {
  userMessage: string;
  agentName: string;
  businessName: string;
  instructions: string;
  language: string;
  callerNumber: string;
  conversationHistory: Array<{ speaker: 'AI' | 'Caller'; text: string }>;
}): Promise<{ success: boolean; text: string; isRealAi: boolean; error?: string }> {
  const historyText = params.conversationHistory
    .slice(-6)
    .map((m) => `${m.speaker === 'AI' ? params.agentName : 'Caller'}: ${m.text}`)
    .join('\n');

  const systemInstruction = `You are ${params.agentName}, an AI Voice Assistant for "${params.businessName}" in Bangladesh.
Agent Core Instructions:
${params.instructions || 'Speak politely, answer questions clearly, and offer assistance.'}

Preferred language: ${params.language}.
Caller phone number is ${params.callerNumber}.
Respond concisely in 1-3 spoken sentences (max 40-50 words), as this is a voice phone conversation.
Never say you are an AI model. Speak directly as the receptionist/agent.`;

  const prompt = `Conversation history:
${historyText}
Caller: ${params.userMessage}
${params.agentName}:`;

  try {
    const response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, systemInstruction })
    });

    const data = await response.json();
    if (response.ok && data.success && data.text) {
      recordDemoUsage('gemini', prompt.length + data.text.length);
      return { success: true, text: data.text.trim(), isRealAi: true };
    }

    return {
      success: false,
      text: '',
      isRealAi: false,
      error: data.error || 'Gemini Backend Error: Gemini API is currently unavailable.'
    };
  } catch (err: any) {
    return {
      success: false,
      text: '',
      isRealAi: false,
      error: err?.message || 'Gemini Backend Error: Connection failed.'
    };
  }
}

export interface AgentTurnResult {
  replyText: string;
  reasoning: string;
  intent: string;
  sentiment: string;
  leadData: {
    name?: string;
    phone?: string;
    email?: string;
    interest?: string;
    notes?: string;
  };
  knowledgeUsed: boolean;
  qualityEvaluation: {
    knowledgeAccuracy: number;
    tone: number;
    languageFluency: number;
    leadCollection: number;
  };
  model: string;
}

// Server-side Gemini agent conversation turn for Agent Testing Lab
export async function sendAgentChatMessage(params: {
  message: string;
  agent: {
    id?: string;
    name: string;
    businessName: string;
    type?: string;
    language?: string;
    personality?: string;
    friendliness?: number;
    professionalism?: number;
    responseLength?: number;
    instructions?: string;
    knowledgeBaseCount?: number;
  };
  conversationHistory?: Array<{ role: 'user' | 'model'; text: string }>;
  knowledgeBaseContext?: string;
  model?: string;
}): Promise<{
  success: boolean;
  data?: AgentTurnResult;
  latencyMs?: number;
  error?: string;
  isRateLimited?: boolean;
  isConfigured?: boolean;
}> {
  try {
    const response = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });

    const json = await response.json();

    if (response.ok && json.success && json.data) {
      recordDemoUsage('gemini', params.message.length + (json.data.replyText?.length || 0));
      return {
        success: true,
        data: json.data,
        latencyMs: json.latencyMs
      };
    }

    return {
      success: false,
      error: json.error || `Gemini request failed with status ${response.status}`,
      isRateLimited: json.isRateLimited || response.status === 429,
      isConfigured: json.isConfigured !== false,
      latencyMs: json.latencyMs
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Server-side Gemini service is unavailable.',
      isConfigured: true
    };
  }
}

// Generic AI prompt generator used across testing lab & simulations
export async function generateAiResponse(params: {
  prompt: string;
  systemInstruction?: string;
  model?: string;
}): Promise<{ success: boolean; text: string; isRealAi: boolean; error?: string }> {
  try {
    const response = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: params.prompt,
        systemInstruction: params.systemInstruction
      })
    });

    const data = await response.json();
    if (response.ok && data.success && data.text) {
      recordDemoUsage('gemini', params.prompt.length + data.text.length);
      return { success: true, text: data.text.trim(), isRealAi: true };
    }

    return {
      success: false,
      text: '',
      isRealAi: false,
      error: data.error || 'Gemini API বর্তমানে unavailable.'
    };
  } catch {
    return {
      success: false,
      text: '',
      isRealAi: false,
      error: 'Gemini API বর্তমানে unavailable.'
    };
  }
}

export interface ElevenLabsStatusData {
  configured: boolean;
  apiKeyPresent: boolean;
  keyMasked: string | null;
  agentId: string;
  agentName: string;
  firstMessage: string;
  voiceId: string;
  voiceModel: string;
  geminiBridgeActive: boolean;
  status: 'READY' | 'PERMISSION_REQUIRED' | 'KEY_MISSING' | 'CONFIGURED';
  permissionsStatus: {
    convaiRead: boolean | 'unknown';
    convaiWrite: boolean | 'unknown';
    voicesRead: boolean | 'unknown';
    textToSpeech: boolean | 'unknown';
    missingPermissions?: string[];
  };
  message: string;
}

export interface ElevenLabsAgentData {
  agentId: string;
  name: string;
  language: string;
  languageCode: string;
  personality: string;
  role: string;
  firstMessage: string;
  voiceId: string;
  voiceName: string;
  modelId: string;
  instructions: string;
  knowledgeBaseSummary: string;
  leadCollectionFields: string[];
  escalationContact: {
    name: string;
    role: string;
    phone: string;
  };
  remoteSynced: boolean;
  syncedAt?: string;
  permissionsRequired?: string[];
}

// Fetch ElevenLabs Integration Status & Permissions
export async function fetchElevenLabsStatus(): Promise<{
  success: boolean;
  data?: ElevenLabsStatusData;
  error?: string;
}> {
  try {
    const res = await fetch('/api/elevenlabs/status');
    const json = await res.json();
    return json;
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to reach ElevenLabs status endpoint'
    };
  }
}

// Create or Synchronize ElevenLabs Production Agent
export async function createOrSyncElevenLabsAgent(customConfig?: Partial<ElevenLabsAgentData>): Promise<{
  success: boolean;
  agent: ElevenLabsAgentData;
  remoteAgentId?: string;
  remoteCreated: boolean;
  error?: string;
  details?: any;
}> {
  try {
    const res = await fetch('/api/elevenlabs/agent/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customConfig || {})
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      agent: {
        agentId: 'agent_aiskillhub_bn_rec01',
        name: 'AI Skill Hub Receptionist',
        language: 'Bengali (Bangla)',
        languageCode: 'bn',
        personality: 'Friendly, professional, natural Bangladeshi receptionist',
        role: 'Customer Service & Admission Inquiries Receptionist',
        firstMessage: 'আসসালামু আলাইকুম। AI Skill Hub-এ আপনাকে স্বাগতম। আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
        voiceId: 'cgSgspJ2msm6clMCkdW9',
        voiceName: 'Ayesha (Bangla Natural / Jessica)',
        modelId: 'eleven_multilingual_v2',
        instructions: '',
        knowledgeBaseSummary: '',
        leadCollectionFields: ['name', 'phone'],
        escalationContact: { name: 'Farhan Ahmed', role: 'Counselor', phone: '+880 1819-000000' },
        remoteSynced: false
      },
      remoteCreated: false,
      error: err?.message || 'Failed to communicate with agent sync endpoint'
    };
  }
}

// Fetch Current Production Agent Details
export async function fetchCurrentAgentDetails(agentId?: string): Promise<{
  success: boolean;
  agent: ElevenLabsAgentData;
  remoteData?: any;
  error?: string;
}> {
  try {
    const url = agentId ? `/api/elevenlabs/agent/${encodeURIComponent(agentId)}` : '/api/elevenlabs/agent/current';
    const res = await fetch(url);
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      agent: {
        agentId: 'agent_aiskillhub_bn_rec01',
        name: 'AI Skill Hub Receptionist',
        language: 'Bengali (Bangla)',
        languageCode: 'bn',
        personality: 'Friendly, professional, natural Bangladeshi receptionist',
        role: 'Customer Service & Admission Inquiries Receptionist',
        firstMessage: 'আসসালামু আলাইকুম। AI Skill Hub-এ আপনাকে স্বাগতম। আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
        voiceId: 'cgSgspJ2msm6clMCkdW9',
        voiceName: 'Ayesha (Bangla Natural / Jessica)',
        modelId: 'eleven_multilingual_v2',
        instructions: '',
        knowledgeBaseSummary: '',
        leadCollectionFields: ['name', 'phone'],
        escalationContact: { name: 'Farhan Ahmed', role: 'Counselor', phone: '+880 1819-000000' },
        remoteSynced: false
      },
      error: err?.message || 'Failed to fetch current agent details'
    };
  }
}

// Generate Temporary Signed WebSocket Connection URL for ElevenLabs ConvAI
export async function fetchSignedConnectionUrl(agentId?: string): Promise<{
  success: boolean;
  signedUrl?: string;
  agentId: string;
  error?: string;
  details?: any;
}> {
  try {
    const url = agentId ? `/api/elevenlabs/signed-url?agentId=${encodeURIComponent(agentId)}` : '/api/elevenlabs/signed-url';
    const res = await fetch(url);
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      agentId: agentId || 'agent_aiskillhub_bn_rec01',
      error: err?.message || 'Failed to request signed connection URL'
    };
  }
}

// Fetch ElevenLabs Voices
export async function fetchElevenLabsVoices(): Promise<{
  configured: boolean;
  voices: any[];
  message?: string;
}> {
  try {
    const res = await fetch('/api/elevenlabs/voices');
    if (!res.ok) return { configured: false, voices: [] };
    const data = await res.json();
    return {
      configured: Boolean(data.configured && data.success),
      voices: data.voices || [],
      message: data.message
    };
  } catch {
    return { configured: false, voices: [] };
  }
}

// Convert text to speech via server ElevenLabs endpoint
export async function synthesizeSpeechElevenLabs(
  text: string,
  voiceId?: string,
  modelId?: string
): Promise<{ success: boolean; audioUrl?: string; error?: string }> {
  try {
    const response = await fetch('/api/elevenlabs/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voiceId, modelId })
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errJson.error || 'ElevenLabs voice generation failed.'
      };
    }

    const blob = await response.blob();
    const audioUrl = URL.createObjectURL(blob);
    recordDemoUsage('elevenlabs', text.length);

    return { success: true, audioUrl };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'ElevenLabs voice service unreachable.'
    };
  }
}

// Test Connection for Gemini
export async function testGeminiServer(): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch('/api/gemini/test', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      return { success: true, message: data.message || 'Gemini API হ্যান্ডশেক সফল হয়েছে!' };
    }
    return { success: false, message: data.error || 'Gemini API সংযোগ ব্যর্থ হয়েছে।' };
  } catch {
    return { success: false, message: 'Server endpoint unreachable.' };
  }
}

// Test Connection for ElevenLabs
export async function testElevenLabsServer(): Promise<{ success: boolean; message: string; details?: any }> {
  try {
    const res = await fetch('/api/elevenlabs/test', { method: 'POST' });
    const data = await res.json();
    if (data.success) {
      return { success: true, message: data.message || 'ElevenLabs API হ্যান্ডশেক সফল হয়েছে!' };
    }
    return { success: false, message: data.message || data.error || 'ElevenLabs API সংযোগ ব্যর্থ হয়েছে।', details: data.details };
  } catch {
    return { success: false, message: 'Server endpoint unreachable.' };
  }
}

// =============================================================
// VAPI CLIENT SERVICES (Voice Calling & AI Phone Receptionist)
// =============================================================

export interface VapiStatusData {
  configured: boolean;
  privateKeyPresent: boolean;
  privateKeyMasked: string | null;
  publicKeyPresent: boolean;
  publicKeyMasked: string | null;
  connected: boolean;
  assistantId: string | null;
  assistantName: string | null;
  firstMessage: string | null;
  model: string | null;
  voiceProvider: string | null;
  assistantsCount: number;
  status: 'CONNECTED' | 'NOT_CONNECTED' | 'KEY_MISSING';
  message: string;
  latencyMs?: number;
}

export interface VapiClientConfigData {
  configured: boolean;
  publicKey: string | null;
  assistantId: string | null;
}

// Fetch Vapi live integration status
export async function fetchVapiStatus(): Promise<{
  success: boolean;
  data?: VapiStatusData;
  error?: string;
}> {
  try {
    const res = await fetch('/api/vapi/status');
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to reach Vapi status endpoint'
    };
  }
}

// Fetch safe client config for browser WebRTC calls
export async function fetchVapiClientConfig(): Promise<{
  success: boolean;
  data?: VapiClientConfigData;
}> {
  try {
    const res = await fetch('/api/vapi/config');
    return await res.json();
  } catch {
    return {
      success: false,
      data: {
        configured: false,
        publicKey: null,
        assistantId: null
      }
    };
  }
}

// List all Vapi assistants in account
export async function fetchVapiAssistants(): Promise<{
  success: boolean;
  assistants: any[];
  error?: string;
}> {
  try {
    const res = await fetch('/api/vapi/assistants');
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      assistants: [],
      error: err?.message || 'Failed to fetch assistants'
    };
  }
}

// Update Vapi assistant (e.g. system prompt or first greeting message)
export async function updateVapiAssistantRemote(
  assistantId: string,
  updates: { firstMessage?: string; instructions?: string; name?: string }
): Promise<{ success: boolean; assistant?: any; error?: string }> {
  try {
    const res = await fetch(`/api/vapi/assistant/${encodeURIComponent(assistantId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to update Vapi assistant'
    };
  }
}

// Test Vapi Server Connection
export async function testVapiServer(): Promise<{
  success: boolean;
  message: string;
  latencyMs?: number;
  details?: any;
}> {
  try {
    const res = await fetch('/api/vapi/test', { method: 'POST' });
    const data = await res.json();
    return {
      success: Boolean(data.success),
      message: data.message || (data.success ? 'Vapi সংযোগ সফল হয়েছে!' : 'Vapi সংযোগ ব্যর্থ হয়েছে।'),
      latencyMs: data.latencyMs,
      details: data.details
    };
  } catch {
    return {
      success: false,
      message: 'Vapi server endpoint unreachable.'
    };
  }
}

// Create a new Vapi assistant
export async function createVapiAssistantRemote(params: {
  name: string;
  firstMessage?: string;
  instructions?: string;
  voiceId?: string;
  voiceProvider?: string;
  model?: string;
  apiKey?: string;
}): Promise<{ success: boolean; assistant?: any; error?: string }> {
  try {
    const res = await fetch('/api/vapi/assistants/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    return await res.json();
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Failed to create Vapi assistant'
    };
  }
}

// =============================================================
// MAIN SERVER STORAGE AGENTS (Persistent Server Store + Vapi Sync)
// =============================================================

export async function fetchMainStorageAgents(): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const res = await fetch('/api/agents');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    return { success: true, data: json.data || [] };
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function createMainStorageAgent(agentData: any): Promise<{ success: boolean; data?: any; vapiCreated?: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(agentData)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function updateMainStorageAgent(id: string, updates: any): Promise<{ success: boolean; data?: any; vapiSynced?: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch(`/api/agents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function deleteMainStorageAgent(id: string): Promise<{ success: boolean; message?: string }> {
  try {
    const res = await fetch(`/api/agents/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message };
  }
}

// -------------------------------------------------------------
// Billing, bKash / Nagad Transactions & Admin Security APIs
// -------------------------------------------------------------

export async function fetchBillingConfig(): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await fetch('/api/billing/config');
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function saveBillingConfigApi(config: any): Promise<{ success: boolean; data?: any; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/billing/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function fetchTransactions(): Promise<{ success: boolean; data?: any[]; error?: string }> {
  try {
    const res = await fetch('/api/billing/transactions');
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function submitTransactionApi(data: any): Promise<{ success: boolean; data?: any; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/billing/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function updateTransactionStatusApi(
  id: string,
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
  verifiedBy: string = 'Super Admin',
  rejectionReason?: string
): Promise<{ success: boolean; data?: any; message?: string; error?: string }> {
  try {
    const res = await fetch(`/api/billing/transactions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, verifiedBy, rejectionReason })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function testTelegramNotificationApi(
  botToken?: string,
  chatId?: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/billing/notifications/test-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ botToken, chatId })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function testWhatsAppNotificationApi(
  whatsappNumber?: string,
  webhookUrl?: string,
  apiKey?: string
): Promise<{ success: boolean; message?: string; error?: string; directWaLink?: string }> {
  try {
    const res = await fetch('/api/billing/notifications/test-whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ whatsappNumber, webhookUrl, apiKey })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function verifyAdminPasswordApi(
  password: string,
  role: 'admin' | 'superadmin' = 'admin'
): Promise<{ success: boolean; role?: string; token?: string; error?: string; message?: string }> {
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password, role })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function changeAdminPasswordApi(
  role: 'admin' | 'superadmin',
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string; error?: string }> {
  try {
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, currentPassword, newPassword })
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, message: err?.message || 'পাসওয়ার্ড পরিবর্তনে ত্রুটি হয়েছে।' };
  }
}

// =============================================================
// WEBSITE CMS & SETTINGS CLIENT API
// =============================================================

export interface WebsiteSettingsData {
  siteName: string;
  siteTagline: string;
  brandSlogan: string;
  supportPhone: string;
  supportEmail: string;
  officeAddress: string;
  footerNotice: string;

  announcementActive?: boolean;
  announcementText?: string;
  announcementBadge?: string;

  badgeText: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  typewriterPhrases: string[];

  primaryCtaText?: string;
  secondaryCtaText?: string;

  mockupCallerName?: string;
  mockupBusinessName?: string;
  mockupTranscript?: string;

  featuresHeading?: string;
  featuresSubheading?: string;

  roiDefaultSalary?: number;
  roiDefaultCalls?: number;

  whatsappNumber?: string;
  facebookUrl?: string;
  linkedinUrl?: string;

  vapiPrivateKey?: string;
  vapiPublicKey?: string;
  vapiAssistantId?: string;
  geminiApiKey?: string;
  elevenLabsApiKey?: string;
  hasVapiPrivateKey?: boolean;
  vapiPrivateKeyMasked?: string | null;
  hasGeminiApiKey?: boolean;
  geminiApiKeyMasked?: string | null;
  hasElevenLabsApiKey?: boolean;
  elevenLabsApiKeyMasked?: string | null;
  starterPrice: number;
  starterMinutes: number;
  starterName?: string;
  businessPrice: number;
  businessMinutes: number;
  businessName?: string;
  enterprisePrice: number;
  enterpriseMinutes: number;
  enterpriseName?: string;
  updatedAt?: string;
}

export async function fetchWebsiteSettingsApi(): Promise<{ success: boolean; data?: WebsiteSettingsData; error?: string }> {
  try {
    const res = await fetch('/api/website/settings');
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}

export async function saveWebsiteSettingsApi(settings: Partial<WebsiteSettingsData>): Promise<{ success: boolean; data?: WebsiteSettingsData; message?: string; error?: string }> {
  try {
    const res = await fetch('/api/website/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err?.message };
  }
}




