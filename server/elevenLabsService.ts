/**
 * ElevenLabs Conversational AI & Voice Service for VoiceAI BD
 * 
 * Secure server-side service that interfaces with ElevenLabs:
 * - Conversational AI Agent configuration & synchronization
 * - First production agent: "AI Skill Hub Receptionist"
 * - Server-generated signed connection URLs for browser WebSockets
 * - Voice listing and multilingual Text-to-Speech (TTS)
 * - Permission diagnostics and live Gemini backend bridge
 */

export interface ElevenLabsAgentConfig {
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

export interface ElevenLabsStatusReport {
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

// Production Agent Definition: "AI Skill Hub Receptionist"
export const PRODUCTION_AGENT: ElevenLabsAgentConfig = {
  agentId: 'agent_aiskillhub_bn_rec01',
  name: 'AI Skill Hub Receptionist',
  language: 'Bengali (Bangla)',
  languageCode: 'bn',
  personality: 'Friendly, professional, natural Bangladeshi receptionist with polite, clear conversational tone.',
  role: 'Customer Service & Admission Inquiries Receptionist for AI Skill Hub BD',
  firstMessage: 'আসসালামু আলাইকুম। AI Skill Hub-এ আপনাকে স্বাগতম। আমি কীভাবে আপনাকে সাহায্য করতে পারি?',
  voiceId: 'cgSgspJ2msm6clMCkdW9', // Jessica (Warm & natural Multilingual Voice)
  voiceName: 'Ayesha (Bangla Natural / Jessica)',
  modelId: 'eleven_multilingual_v2',
  instructions: `You are the official AI Phone Receptionist for "AI Skill Hub BD" (AI স্কিল হাব বাংলাদেশ).
Your communication style:
- Speak in natural, polished, and polite conversational Bengali (বাংলা).
- Maintain a warm, friendly, yet highly professional Bangladeshi corporate tone.
- Keep each spoken response concise (1 to 3 sentences, maximum 40-50 words) suitable for real telephone audio.
- Never sound robotic or recite long textbook passages.
- Address callers respectfully with "আপনি" and greeting with "আসসালামু আলাইকুম".

Key Knowledge Base & Core Inquiries:
1. Available Courses:
   - "AI Mastering Course" (প্রফেশনাল এআই মাস্টারিং) - কোর্স ফি ৳৪,৫০০ (সীমিত সময়ের ডিসকাউন্ট চলছে)।
   - "Python & Generative AI" - কোর্স ফি ৳৬,০০০।
   - "Digital Marketing AI" - কোর্স ফি ৳৩,৫০০।
2. Course Benefits:
   - লাইভ হ্যান্ডস-অন প্রজেক্ট, রিয়েল-ওয়ার্ল্ড পোর্টফোলিও বিল্ডিং, অভিজ্ঞ ইন্ডাস্ট্রি মেন্টর, ক্লাস রেকর্ডিং লাইফটাইম অ্যাক্সেস এবং কোর্স শেষে সার্টিফিকেট ও জব প্লেসমেন্ট সাপোর্ট।
3. Batch Schedule & Formats:
   - অনলাইন ব্যাচ: জুমে লাইভ ক্লাস, সপ্তাহে ২ দিন রাত ৮:০০ টা থেকে ১০:০০ টা।
   - অফলাইন ব্যাচ: ধানমন্ডি ক্যাম্পাসে শুক্র ও শনিবার বিকাল ৩:০০ টা থেকে ৬:০০ টা।
4. Admission Procedure:
   - বিকাশ (bKash) বা নগদ (Nagad) এর মাধ্যমে রেজিস্ট্রেশন ফি দিয়ে অনলাইনে সিট কনফার্ম করা যায়।
5. Location & Contact:
   - ক্যাম্পাস ঠিকানা: বাড়ি #৪৫, রোড #৭/এ, ধানমন্ডি, ঢাকা - ১২০৯।
   - হেল্পলাইন: +880 1711-000000 (সকাল ৯টা থেকে রাত ১০টা)।
6. Lead Capture:
   - কলারের পূর্ণ নাম, ফোন নম্বর, এবং কোন কোর্সে আগ্রহ তা বিনীতভাবে জেনে সিস্টেমে নোট করুন।
7. Objection Handling:
   - কোর্স ফি বেশি মনে হলে বুঝিয়ে বলুন যে এই কোর্সে রিয়েল প্রজেক্ট ও ১-অন-১ মেন্টর সাপোর্ট অন্তর্ভুক্ত থাকায় এটি সর্বোচ্চ ভ্যালু প্রদান করে।
   - নন-সিএস ব্যাকগ্রাউন্ডের ক্ষেত্রে আশ্বস্ত করুন যে প্রোগ্রামিং বা কোডিং পূর্ব অভিজ্ঞতা ছাড়াও জিরো থেকে শেখানো হয়।
8. Escalation & Transfer:
   - জটিল বিলিং বা সিনিয়র কাউন্সেলরের সাথে সরাসরি কথা বলতে চাইলে বলুন: "আমি আমাদের সিনিয়র অ্যাডমিশন কাউন্সেলর ফারহান সাহেবের কাছে আপনার নম্বরটি ট্রান্সফার বা মেসেজ ফরোয়ার্ড করে দিচ্ছি।"`,
  knowledgeBaseSummary: 'AI Skill Hub BD: 3 Courses (AI Mastering ৳4,500, Python GenAI ৳6,000, Marketing AI ৳3,500), Online/Offline Batches (Dhanmondi, Dhaka), bKash/Nagad payments, lead collection.',
  leadCollectionFields: ['name', 'phone', 'email', 'interestedCourse', 'preferredBatch'],
  escalationContact: {
    name: 'Farhan Ahmed',
    role: 'Senior Admission Counselor',
    phone: '+880 1819-000000'
  },
  remoteSynced: false
};

// Safe API key validation
export const isValidElevenLabsKey = (key: string | undefined): boolean => {
  if (!key) return false;
  const trimmed = key.trim();
  if (trimmed.length < 15) return false;
  if (trimmed.toLowerCase().includes('placeholder') || trimmed.toLowerCase().includes('your_')) {
    return false;
  }
  return true;
};

// Mask API key for secure status responses
export const maskApiKey = (key: string | undefined): string | null => {
  if (!key) return null;
  const trimmed = key.trim();
  if (trimmed.length <= 8) return '••••••••';
  return `${trimmed.slice(0, 4)}••••${trimmed.slice(-4)}`;
};

/**
 * 1. Check ElevenLabs Integration Status & Permission Scopes
 */
export async function getElevenLabsStatus(): Promise<ElevenLabsStatusReport> {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  const configured = isValidElevenLabsKey(apiKey);

  if (!configured || !apiKey) {
    return {
      configured: false,
      apiKeyPresent: false,
      keyMasked: null,
      agentId: PRODUCTION_AGENT.agentId,
      agentName: PRODUCTION_AGENT.name,
      firstMessage: PRODUCTION_AGENT.firstMessage,
      voiceId: PRODUCTION_AGENT.voiceId,
      voiceModel: PRODUCTION_AGENT.modelId,
      geminiBridgeActive: true,
      status: 'KEY_MISSING',
      permissionsStatus: {
        convaiRead: 'unknown',
        convaiWrite: 'unknown',
        voicesRead: 'unknown',
        textToSpeech: 'unknown',
        missingPermissions: ['api_key_not_set']
      },
      message: 'ELEVENLABS_API_KEY is not configured in server environment.'
    };
  }

  // Probe permissions securely without exposing keys
  const missingPerms: string[] = [];
  let convaiReadOk: boolean | 'unknown' = false;
  let convaiWriteOk: boolean | 'unknown' = false;
  let voicesReadOk: boolean | 'unknown' = false;
  let ttsOk: boolean | 'unknown' = false;

  try {
    // Check convai permissions
    const convaiRes = await fetch('https://api.elevenlabs.io/v1/convai/agents', {
      headers: { 'xi-api-key': apiKey }
    });

    if (convaiRes.ok) {
      convaiReadOk = true;
    } else {
      const err = await convaiRes.json().catch(() => null);
      if (err?.detail?.status === 'missing_permissions') {
        missingPerms.push('convai_read');
      }
    }

    // Check voices permissions
    const voicesRes = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': apiKey }
    });

    if (voicesRes.ok) {
      voicesReadOk = true;
    } else {
      const err = await voicesRes.json().catch(() => null);
      if (err?.detail?.status === 'missing_permissions') {
        missingPerms.push('voices_read');
      }
    }

    // Determine overall status
    const hasMissing = missingPerms.length > 0;
    const status: ElevenLabsStatusReport['status'] = hasMissing ? 'PERMISSION_REQUIRED' : 'READY';

    return {
      configured: true,
      apiKeyPresent: true,
      keyMasked: maskApiKey(apiKey),
      agentId: PRODUCTION_AGENT.agentId,
      agentName: PRODUCTION_AGENT.name,
      firstMessage: PRODUCTION_AGENT.firstMessage,
      voiceId: PRODUCTION_AGENT.voiceId,
      voiceModel: PRODUCTION_AGENT.modelId,
      geminiBridgeActive: true,
      status,
      permissionsStatus: {
        convaiRead: convaiReadOk,
        convaiWrite: convaiWriteOk,
        voicesRead: voicesReadOk,
        textToSpeech: ttsOk,
        missingPermissions: missingPerms
      },
      message: hasMissing
        ? `ElevenLabs API key is active but requires permissions: ${missingPerms.join(', ')}. Enable these in ElevenLabs Settings > API Keys.`
        : 'ElevenLabs Conversational AI integration is fully authenticated and ready.'
    };
  } catch (err: any) {
    return {
      configured: true,
      apiKeyPresent: true,
      keyMasked: maskApiKey(apiKey),
      agentId: PRODUCTION_AGENT.agentId,
      agentName: PRODUCTION_AGENT.name,
      firstMessage: PRODUCTION_AGENT.firstMessage,
      voiceId: PRODUCTION_AGENT.voiceId,
      voiceModel: PRODUCTION_AGENT.modelId,
      geminiBridgeActive: true,
      status: 'CONFIGURED',
      permissionsStatus: {
        convaiRead: 'unknown',
        convaiWrite: 'unknown',
        voicesRead: 'unknown',
        textToSpeech: 'unknown',
        missingPermissions: []
      },
      message: `ElevenLabs connection check warning: ${err?.message || 'Network delay'}`
    };
  }
}

/**
 * 2. Create or Synchronize Production Agent in ElevenLabs
 */
export async function createOrSyncElevenLabsAgent(customConfig?: Partial<ElevenLabsAgentConfig>): Promise<{
  success: boolean;
  agent: ElevenLabsAgentConfig;
  remoteAgentId?: string;
  remoteCreated: boolean;
  error?: string;
  details?: any;
}> {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  const mergedAgent: ElevenLabsAgentConfig = {
    ...PRODUCTION_AGENT,
    ...customConfig
  };

  if (!apiKey || !isValidElevenLabsKey(apiKey)) {
    return {
      success: false,
      agent: mergedAgent,
      remoteCreated: false,
      error: 'ELEVENLABS_API_KEY is not configured in server environment.'
    };
  }

  // Attempt remote agent creation via ElevenLabs ConvAI API
  try {
    const payload = {
      name: mergedAgent.name,
      conversation_config: {
        agent: {
          prompt: {
            prompt: mergedAgent.instructions,
            knowledge_base: [
              {
                type: 'text',
                name: 'AI_Skill_Hub_Course_Info',
                text: mergedAgent.knowledgeBaseSummary
              }
            ]
          },
          first_message: mergedAgent.firstMessage,
          language: mergedAgent.languageCode
        },
        tts: {
          voice_id: mergedAgent.voiceId,
          model_id: mergedAgent.modelId
        },
        conversation: {
          max_duration_seconds: 600
        }
      }
    };

    const response = await fetch('https://api.elevenlabs.io/v1/convai/agents/create', {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const data: any = await response.json();
      const remoteAgentId = data.agent_id || mergedAgent.agentId;
      mergedAgent.agentId = remoteAgentId;
      mergedAgent.remoteSynced = true;
      mergedAgent.syncedAt = new Date().toISOString();

      return {
        success: true,
        agent: mergedAgent,
        remoteAgentId,
        remoteCreated: true
      };
    }

    // Capture exact ElevenLabs error (e.g. missing convai_write permission)
    const errData: any = await response.json().catch(() => null);
    const errMessage = errData?.detail?.message || `ElevenLabs API responded with status ${response.status}`;
    const requiredPerms = errData?.detail?.status === 'missing_permissions' ? ['convai_write'] : [];

    mergedAgent.permissionsRequired = requiredPerms;

    return {
      success: false,
      agent: mergedAgent,
      remoteCreated: false,
      error: errMessage,
      details: errData
    };
  } catch (err: any) {
    return {
      success: false,
      agent: mergedAgent,
      remoteCreated: false,
      error: `Failed to create ElevenLabs agent: ${err?.message || 'Network error'}`
    };
  }
}

/**
 * 3. Fetch Agent Details
 */
export async function getElevenLabsAgentDetails(agentId?: string): Promise<{
  success: boolean;
  agent: ElevenLabsAgentConfig;
  remoteData?: any;
  error?: string;
}> {
  const targetId = agentId || PRODUCTION_AGENT.agentId;
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();

  // If apiKey is valid and targetId is not our internal mock, try remote lookup
  if (apiKey && isValidElevenLabsKey(apiKey) && targetId !== PRODUCTION_AGENT.agentId) {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/convai/agents/${targetId}`, {
        headers: { 'xi-api-key': apiKey }
      });

      if (response.ok) {
        const data: any = await response.json();
        return {
          success: true,
          agent: {
            ...PRODUCTION_AGENT,
            agentId: targetId,
            name: data.name || PRODUCTION_AGENT.name,
            remoteSynced: true
          },
          remoteData: data
        };
      }
    } catch {
      // Fall through to configured production agent
    }
  }

  return {
    success: true,
    agent: PRODUCTION_AGENT
  };
}

/**
 * 4. Generate Temporary Signed URL for Client WebSocket Connection
 * This allows the client browser to connect to the ElevenLabs ConvAI WebSocket
 * directly without ever seeing or transmitting the ELEVENLABS_API_KEY.
 */
export async function getSignedConnectionUrl(agentId?: string): Promise<{
  success: boolean;
  signedUrl?: string;
  agentId: string;
  error?: string;
  details?: any;
}> {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  const targetAgentId = agentId || PRODUCTION_AGENT.agentId;

  if (!apiKey || !isValidElevenLabsKey(apiKey)) {
    return {
      success: false,
      agentId: targetAgentId,
      error: 'ELEVENLABS_API_KEY is not configured in server environment.'
    };
  }

  try {
    const url = `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${encodeURIComponent(targetAgentId)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey,
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data: any = await response.json();
      return {
        success: true,
        signedUrl: data.signed_url,
        agentId: targetAgentId
      };
    }

    const errJson: any = await response.json().catch(() => null);
    const errorMsg = errJson?.detail?.message || `ElevenLabs signed URL request failed with HTTP ${response.status}`;

    return {
      success: false,
      agentId: targetAgentId,
      error: errorMsg,
      details: errJson
    };
  } catch (err: any) {
    return {
      success: false,
      agentId: targetAgentId,
      error: `Signed URL generation failed: ${err?.message || 'Network error'}`
    };
  }
}

/**
 * 5. Connection Test Endpoint
 */
export async function testElevenLabsConnection(): Promise<{
  success: boolean;
  message: string;
  latencyMs: number;
  apiKeyPresent: boolean;
  agentConfigured: boolean;
  details?: any;
}> {
  const startTime = Date.now();
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();

  if (!apiKey || !isValidElevenLabsKey(apiKey)) {
    return {
      success: false,
      message: 'ELEVENLABS_API_KEY is not configured or invalid in server environment.',
      latencyMs: Date.now() - startTime,
      apiKeyPresent: false,
      agentConfigured: false
    };
  }

  try {
    const testResponse = await fetch('https://api.elevenlabs.io/v1/user', {
      headers: {
        'xi-api-key': apiKey,
        'Accept': 'application/json'
      }
    });

    const latencyMs = Date.now() - startTime;

    if (testResponse.ok) {
      const userData: any = await testResponse.json();
      return {
        success: true,
        message: 'ElevenLabs API connection successful',
        latencyMs,
        apiKeyPresent: true,
        agentConfigured: true,
        details: { tier: userData.subscription?.tier || 'active' }
      };
    }

    const errJson: any = await testResponse.json().catch(() => null);
    const permMsg = errJson?.detail?.message || 'ElevenLabs authentication or permission check failed.';

    return {
      success: false,
      message: `ElevenLabs API check: ${permMsg}`,
      latencyMs,
      apiKeyPresent: true,
      agentConfigured: true,
      details: errJson
    };
  } catch (err: any) {
    return {
      success: false,
      message: `ElevenLabs connection error: ${err?.message || 'Network error'}`,
      latencyMs: Date.now() - startTime,
      apiKeyPresent: true,
      agentConfigured: false
    };
  }
}

/**
 * 6. Voice Configuration & Multilingual Voices Listing
 */
export async function listElevenLabsVoices(): Promise<{
  success: boolean;
  configured: boolean;
  voices: Array<{
    id: string;
    name: string;
    gender: string;
    style: string;
    language: string;
    accent: string;
    previewUrl?: string;
  }>;
  message?: string;
}> {
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();
  const defaultVoices = [
    {
      id: 'cgSgspJ2msm6clMCkdW9',
      name: 'Ayesha (Bangla Natural / Jessica)',
      gender: 'Female',
      style: 'Warm, Expressive & Empathetic Receptionist',
      language: 'Bangla / Multilingual',
      accent: 'Natural Bengali tone',
      previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/voices/cgSgspJ2msm6clMCkdW9/preview.mp3'
    },
    {
      id: '21m00Tcm4TlvDq8ikWAM',
      name: 'Nabila (Formal Corporate / Rachel)',
      gender: 'Female',
      style: 'Professional, Calm & Articulate',
      language: 'Bangla / Multilingual',
      accent: 'Standard Receptionist',
      previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/voices/21m00Tcm4TlvDq8ikWAM/preview.mp3'
    },
    {
      id: 'JBFqnCBsd6RMkjVDRZzb',
      name: 'Tanvir (Corporate Executive / George)',
      gender: 'Male',
      style: 'Deep, Confident & Reassuring',
      language: 'Bangla / Multilingual',
      accent: 'Professional Executive',
      previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/voices/JBFqnCBsd6RMkjVDRZzb/preview.mp3'
    },
    {
      id: 'EXAVITQu4vr4xnSDxMaL',
      name: 'Farhana (Customer Success / Sarah)',
      gender: 'Female',
      style: 'Cheerful, Helpful & Dynamic',
      language: 'Bangla / Multilingual',
      accent: 'Friendly Counselor',
      previewUrl: 'https://storage.googleapis.com/eleven-public-prod/previews/voices/EXAVITQu4vr4xnSDxMaL/preview.mp3'
    }
  ];

  if (!apiKey || !isValidElevenLabsKey(apiKey)) {
    return {
      success: false,
      configured: false,
      voices: defaultVoices,
      message: 'ELEVENLABS_API_KEY is not configured in server environment.'
    };
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: {
        'xi-api-key': apiKey,
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      const data: any = await response.json();
      const remoteVoices = (data.voices || []).map((v: any) => ({
        id: v.voice_id,
        name: v.name,
        gender: v.labels?.gender === 'female' ? 'Female' : 'Male',
        style: v.labels?.description || v.category || 'Natural',
        language: v.labels?.language || 'Multilingual / Bangla compatible',
        accent: v.labels?.accent || 'International',
        previewUrl: v.preview_url
      }));

      return {
        success: true,
        configured: true,
        voices: remoteVoices.length > 0 ? remoteVoices : defaultVoices
      };
    }

    const err = await response.json().catch(() => null);
    const permNotice = err?.detail?.message || 'Could not fetch remote voices due to key scope';

    return {
      success: false,
      configured: true,
      voices: defaultVoices,
      message: permNotice
    };
  } catch (err: any) {
    return {
      success: false,
      configured: true,
      voices: defaultVoices,
      message: `ElevenLabs voices API error: ${err?.message || 'Network delay'}`
    };
  }
}

/**
 * 7. Multilingual Text-to-Speech Synthesis
 */
export async function synthesizeElevenLabsSpeech(params: {
  text: string;
  voiceId?: string;
  modelId?: string;
}): Promise<{
  success: boolean;
  audioBuffer?: Buffer;
  error?: string;
  status?: number;
}> {
  const { text, voiceId, modelId } = params;
  const apiKey = process.env.ELEVENLABS_API_KEY?.trim();

  if (!text || typeof text !== 'string' || !text.trim()) {
    return { success: false, error: 'Text is required for TTS conversion.' };
  }

  if (!apiKey || !isValidElevenLabsKey(apiKey)) {
    return {
      success: false,
      error: 'ELEVENLABS_API_KEY is not configured in server environment.'
    };
  }

  const targetVoiceId = voiceId || PRODUCTION_AGENT.voiceId;
  const chosenModel = modelId || PRODUCTION_AGENT.modelId;

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${targetVoiceId}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: text.slice(0, 4000),
        model_id: chosenModel,
        voice_settings: {
          stability: 0.55,
          similarity_boost: 0.85,
          style: 0.2,
          use_speaker_boost: true
        }
      })
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      return {
        success: false,
        status: response.status,
        error: `ElevenLabs TTS failed (status ${response.status}): ${errText.slice(0, 200)}`
      };
    }

    const arrayBuffer = await response.arrayBuffer();
    return {
      success: true,
      audioBuffer: Buffer.from(arrayBuffer)
    };
  } catch (err: any) {
    return {
      success: false,
      error: `ElevenLabs TTS network error: ${err?.message || 'Connection failed'}`
    };
  }
}
