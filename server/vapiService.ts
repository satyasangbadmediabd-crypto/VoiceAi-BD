/**
 * Vapi Voice AI Service for VoiceAI BD
 * 
 * Secure server-side service that interfaces with Vapi.ai:
 * - Assistant listing, creation, and synchronization
 * - First production agent: "AI Skill Hub Receptionist" (Assistant ID: b37b72e1-047d-408b-9096-cc5cf21256cd)
 * - Safe client public configuration delivery (Public Key & Assistant ID)
 * - Call history & call logging
 * - Never exposes VAPI_PRIVATE_KEY to the browser
 */

import {
  getStoredVapiPrivateKey,
  getStoredVapiPublicKey,
  getStoredVapiAssistantId
} from './websiteSettingsStore';

export interface VapiAssistantConfig {
  id: string;
  name: string;
  firstMessage?: string;
  model?: {
    provider?: string;
    model?: string;
    messages?: Array<{ role: string; content: string }>;
    temperature?: number;
  };
  voice?: {
    provider?: string;
    voiceId?: string;
    speed?: number;
    stability?: number;
  };
  transcriber?: {
    provider?: string;
    model?: string;
    language?: string;
  };
  updatedAt?: string;
}

export interface VapiStatusReport {
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

const DEFAULT_ASSISTANT_ID = process.env.VAPI_ASSISTANT_ID || 'b37b72e1-047d-408b-9096-cc5cf21256cd';

// Helper to mask secret strings
export const maskKey = (key?: string): string | null => {
  if (!key) return null;
  const trimmed = key.trim();
  if (trimmed.length <= 8) return '••••••••';
  return `${trimmed.slice(0, 4)}••••${trimmed.slice(-4)}`;
};

// Helper to get active private key (from env or persistent admin storage)
export const getVapiPrivateKey = (): string => {
  return (process.env.VAPI_PRIVATE_KEY || process.env.VAPI_API_KEY || getStoredVapiPrivateKey() || '').trim();
};

// Helper to get active public key (from env or persistent admin storage)
export const getVapiPublicKey = (): string => {
  return (process.env.VITE_VAPI_PUBLIC_KEY || getStoredVapiPublicKey() || '').trim();
};

// Helper to get default assistant ID
export const getVapiAssistantId = (): string => {
  return (process.env.VAPI_ASSISTANT_ID || getStoredVapiAssistantId() || 'b37b72e1-047d-408b-9096-cc5cf21256cd').trim();
};

/**
 * 1. Check Vapi Integration Status
 */
export async function getVapiStatus(): Promise<VapiStatusReport> {
  const privateKey = getVapiPrivateKey();
  const publicKey = getVapiPublicKey();
  const startTime = Date.now();

  if (!privateKey) {
    return {
      configured: false,
      privateKeyPresent: false,
      privateKeyMasked: null,
      publicKeyPresent: Boolean(publicKey),
      publicKeyMasked: maskKey(publicKey),
      connected: false,
      assistantId: null,
      assistantName: null,
      firstMessage: null,
      model: null,
      voiceProvider: null,
      assistantsCount: 0,
      status: 'KEY_MISSING',
      message: 'VAPI_PRIVATE_KEY is not set in environment.'
    };
  }

  try {
    const res = await fetch('https://api.vapi.ai/assistant', {
      headers: {
        'Authorization': `Bearer ${privateKey}`
      }
    });

    const latencyMs = Date.now() - startTime;

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      return {
        configured: true,
        privateKeyPresent: true,
        privateKeyMasked: maskKey(privateKey),
        publicKeyPresent: Boolean(publicKey),
        publicKeyMasked: maskKey(publicKey),
        connected: false,
        assistantId: null,
        assistantName: null,
        firstMessage: null,
        model: null,
        voiceProvider: null,
        assistantsCount: 0,
        status: 'NOT_CONNECTED',
        latencyMs,
        message: `Vapi authentication failed with HTTP ${res.status}: ${errText.slice(0, 150)}`
      };
    }

    const assistants: any[] = await res.json();
    const targetAssistantId = DEFAULT_ASSISTANT_ID;
    const targetAssistant = assistants.find((a: any) => a.id === targetAssistantId) || assistants[0] || null;

    return {
      configured: true,
      privateKeyPresent: true,
      privateKeyMasked: maskKey(privateKey),
      publicKeyPresent: Boolean(publicKey),
      publicKeyMasked: maskKey(publicKey),
      connected: true,
      assistantId: targetAssistant?.id || null,
      assistantName: targetAssistant?.name || null,
      firstMessage: targetAssistant?.firstMessage || null,
      model: targetAssistant?.model?.model || null,
      voiceProvider: targetAssistant?.voice?.provider || null,
      assistantsCount: assistants.length,
      status: 'CONNECTED',
      latencyMs,
      message: `Vapi connected successfully with ${assistants.length} assistant(s). Active: "${targetAssistant?.name || 'Default'}"`
    };
  } catch (err: any) {
    return {
      configured: true,
      privateKeyPresent: true,
      privateKeyMasked: maskKey(privateKey),
      publicKeyPresent: Boolean(publicKey),
      publicKeyMasked: maskKey(publicKey),
      connected: false,
      assistantId: null,
      assistantName: null,
      firstMessage: null,
      model: null,
      voiceProvider: null,
      assistantsCount: 0,
      status: 'NOT_CONNECTED',
      message: `Vapi connection check failed: ${err?.message || 'Network delay'}`
    };
  }
}

/**
 * 2. List all assistants from Vapi
 */
export async function listVapiAssistants(): Promise<{
  success: boolean;
  assistants: VapiAssistantConfig[];
  error?: string;
}> {
  const privateKey = getVapiPrivateKey();
  if (!privateKey) {
    return { success: false, assistants: [], error: 'VAPI_PRIVATE_KEY not configured.' };
  }

  try {
    const res = await fetch('https://api.vapi.ai/assistant', {
      headers: { 'Authorization': `Bearer ${privateKey}` }
    });

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      return { success: false, assistants: [], error: `Vapi error: ${err.slice(0, 150)}` };
    }

    const data: any[] = await res.json();
    const formatted = data.map((a: any) => ({
      id: a.id,
      name: a.name,
      firstMessage: a.firstMessage,
      model: a.model,
      voice: a.voice,
      transcriber: a.transcriber,
      updatedAt: a.updatedAt
    }));

    return { success: true, assistants: formatted };
  } catch (err: any) {
    return { success: false, assistants: [], error: err?.message || 'Network error' };
  }
}

/**
 * 3. Get single assistant details
 */
export async function getVapiAssistant(assistantId?: string): Promise<{
  success: boolean;
  assistant?: any;
  error?: string;
}> {
  const privateKey = getVapiPrivateKey();
  const id = assistantId || DEFAULT_ASSISTANT_ID;

  if (!privateKey) {
    return { success: false, error: 'VAPI_PRIVATE_KEY not configured.' };
  }

  try {
    const res = await fetch(`https://api.vapi.ai/assistant/${id}`, {
      headers: { 'Authorization': `Bearer ${privateKey}` }
    });

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      return { success: false, error: `Vapi error: ${err.slice(0, 150)}` };
    }

    const assistant = await res.json();
    return { success: true, assistant };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * 4. Update or Customize Vapi Assistant (e.g., set Bengali instructions & greeting)
 */
export async function updateVapiAssistant(
  assistantId: string,
  updates: {
    firstMessage?: string;
    instructions?: string;
    name?: string;
  }
): Promise<{
  success: boolean;
  assistant?: any;
  error?: string;
}> {
  const privateKey = getVapiPrivateKey();
  if (!privateKey) {
    return { success: false, error: 'VAPI_PRIVATE_KEY not configured.' };
  }

  try {
    // First get current assistant to merge cleanly
    const currentRes = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
      headers: { 'Authorization': `Bearer ${privateKey}` }
    });

    if (!currentRes.ok) {
      return { success: false, error: 'Could not fetch current assistant for update' };
    }

    const current = await currentRes.json();
    const payload: any = { ...current };

    if (updates.name) payload.name = updates.name;
    if (updates.firstMessage) payload.firstMessage = updates.firstMessage;
    if (updates.instructions) {
      payload.model = payload.model || {};
      payload.model.messages = [
        {
          role: 'system',
          content: updates.instructions
        }
      ];
    }

    const patchRes = await fetch(`https://api.vapi.ai/assistant/${assistantId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${privateKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!patchRes.ok) {
      const err = await patchRes.text().catch(() => '');
      return { success: false, error: `Failed to update assistant: ${err.slice(0, 150)}` };
    }

    const updated = await patchRes.json();
    return { success: true, assistant: updated };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error' };
  }
}

/**
 * 5. Safe Client Public Configuration
 * Exposes ONLY the public key and assistant ID to the client browser.
 */
export function getVapiClientConfig() {
  const publicKey = getVapiPublicKey();
  const assistantId = getVapiAssistantId();

  return {
    configured: Boolean(publicKey),
    publicKey: publicKey || null,
    assistantId: assistantId || null
  };
}

/**
 * 6. Create a New Assistant on Vapi
 */
export async function createVapiAssistant(params: {
  name: string;
  firstMessage?: string;
  instructions?: string;
  voiceId?: string;
  voiceProvider?: string;
  model?: string;
  apiKey?: string;
}): Promise<{
  success: boolean;
  assistant?: any;
  error?: string;
}> {
  // Use passed apiKey or stored key or env key
  const privateKey = (params.apiKey || getVapiPrivateKey()).trim();
  if (!privateKey) {
    return {
      success: false,
      error: 'Vapi Private Key পাওয়া যায়নি! অনুগ্রহ করে আপনার Vapi Private Key দিন।'
    };
  }

  // If user provided a new apiKey, persist it to websiteSettings so future calls succeed
  if (params.apiKey && params.apiKey.trim().length > 10) {
    try {
      const { saveWebsiteSettings } = await import('./websiteSettingsStore');
      saveWebsiteSettings({ vapiPrivateKey: params.apiKey.trim() });
    } catch (e) {
      console.warn('Could not auto-save Vapi private key:', e);
    }
  }

  try {
    // Vapi requires voice.provider to be one of: '11labs', 'openai', 'azure', 'cartesia', 'deepgram', 'playht'
    let resolvedProvider = '11labs';
    let resolvedVoiceId = '21m00Tcm4TlvDq8ikWAM'; // Rachel (Bangla-capable multilingual)

    if (params.voiceProvider === 'openai') {
      resolvedProvider = 'openai';
      resolvedVoiceId = params.voiceId || 'alloy';
    } else if (params.voiceProvider === 'azure' || params.voiceProvider === 'cartesia') {
      resolvedProvider = params.voiceProvider;
      resolvedVoiceId = params.voiceId || 'default';
    } else {
      resolvedProvider = '11labs';
      const ELEVENLABS_ID_MAP: Record<string, string> = {
        'voice-bn-female-1': '21m00Tcm4TlvDq8ikWAM', // Rachel
        'voice-bn-male-1': 'ErXwobaYiN019PkySvjV',   // Antoni
        'voice-bn-female-2': 'EXAVITQu4vr4xnSDxMaL', // Bella
        'voice-en-male-1': 'VR6AewLTigWG4xSOukaG',   // Arnold
      };
      if (params.voiceId && ELEVENLABS_ID_MAP[params.voiceId]) {
        resolvedVoiceId = ELEVENLABS_ID_MAP[params.voiceId];
      } else if (params.voiceId && params.voiceId.length >= 10 && !params.voiceId.startsWith('voice-')) {
        resolvedVoiceId = params.voiceId;
      }
    }

    const payload: any = {
      name: params.name || 'AI Voice Agent',
      firstMessage: params.firstMessage || 'আসসালামু আলাইকুম! আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
      model: {
        provider: 'openai',
        model: params.model || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: params.instructions || `আপনি একটি বাংলাদেশি স্মার্ট AI ভয়েস রিসেপশনিস্ট।
কলারদের সাথে নম্র, স্পষ্ট ও সাবলীল বাংলায় সংক্ষিপ্ত বাক্যে কথা বলুন।
গ্রাহকের অনুসন্ধানের তথ্য দিয়ে সাহায্য করুন এবং প্রয়োজনীয় ক্ষেত্রে কলারের নাম ও ফোন নম্বর সংগ্রহ করুন।`
          }
        ]
      },
      voice: {
        provider: resolvedProvider,
        voiceId: resolvedVoiceId
      },
      transcriber: {
        provider: 'deepgram',
        model: 'nova-2',
        language: 'multi'
      }
    };

    const res = await fetch('https://api.vapi.ai/assistant', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${privateKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      return { success: false, error: `Vapi API error (${res.status}): ${err.slice(0, 200)}` };
    }

    const assistant = await res.json();
    return { success: true, assistant };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error during Vapi assistant creation' };
  }
}

