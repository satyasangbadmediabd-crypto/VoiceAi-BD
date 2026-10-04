import fs from 'fs';
import path from 'path';
import { createVapiAssistant, updateVapiAssistant } from './vapiService';

export interface StoredAgent {
  id: string;
  name: string;
  businessName: string;
  type: string;
  language: string;
  personality: string;
  friendliness: number;
  professionalism: number;
  responseLength: number;
  instructions: string;
  firstMessage?: string;
  voiceId: string;
  phoneNumberId?: string;
  phoneNumber?: string;
  status: string;
  isActive: boolean;
  totalCalls: number;
  totalMinutes: number;
  createdAt: string;
  knowledgeBaseCount: number;
  leads?: number;
  versions?: any[];
  elevenLabsAgentId?: string;
  elevenLabsVoiceId?: string;
  elevenLabsStatus?: string;
  vapiAssistantId?: string;
  vapiStatus?: 'CONNECTED' | 'NOT_CONFIGURED';
  vapiLastSyncedAt?: string;
}

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const AGENTS_FILE = path.join(DATA_DIR, 'agents.json');

const DEFAULT_AGENTS: StoredAgent[] = [
  {
    id: 'agent-1',
    name: 'AI Skill Hub Receptionist',
    businessName: 'AI Skill Hub BD',
    type: 'Receptionist',
    language: 'বাংলা',
    personality: 'Professional',
    friendliness: 85,
    professionalism: 90,
    responseLength: 50,
    firstMessage: 'আসসালামু আলাইকুম! AI Skill Hub BD-তে আপনাকে স্বাগতম। আমি কীভাবে আপনাকে সহায়তা করতে পারি?',
    instructions: `আপনি AI Skill Hub BD-এর অফিশিয়াল AI receptionist।
কলারদের সাথে অত্যন্ত মিষ্টি, প্রফেশনাল ও সাবলীল বাংলায় কথা বলবেন।
১. AI Mastermind Course (মাস্টারমাইন্ড কোর্স): এটি আমাদের ফ্ল্যাগশিপ প্রিমিয়াম প্রোগ্রাম। কোর্স ফি মাত্র ৪,৫০০ টাকা (১০% স্পেশাল ডিসকাউন্টে মাত্র ৪,০৫০ টাকা)। মডিউল: পাইথন ফাউন্ডেশন, প্রম্পট ইঞ্জিনিয়ারিং, এআই অটোমেশন, চ্যাটবট ও রিয়েল-টাইম ভয়েস এজেন্ট ডেভেলপমেন্ট। ক্লাস হবে প্রতি শনি ও সোমবার রাত ৮টায় জুমে, এবং ধানমন্ডি ক্যাম্পাসে অফলাইন প্র্যাকটিক্যাল সেশন।
২. AI Innovators Club (এআই ক্লাব): আমাদের এক্সক্লুসিভ কমিউনিটি ক্লাব। ক্লাবের মেম্বাররা প্রতি সপ্তাহে লাইভ মাস্টারক্লাস, প্রিমিয়াম এআই টুলস এক্সেস, সরাসরি ইন্ডাস্ট্রি মেন্টরশিপ ও প্রজেক্ট কোলাবোরেশন সুবিধা পান। কোর্সে ভর্তি হওয়া সকল শিক্ষার্থী বিনামূল্যে ক্লাবের মেম্বারশিপ পান।
৩. ভর্তি ও কাউন্সেলিং: আগ্রহী কলারের নাম ও ফোন নম্বর সংগ্রহ করে এডমিশন টিমের জন্য লিড কনফার্ম করবেন।
৪. কলার যাই জিজ্ঞাসা করুক, কোনো অবস্থাতেই "কিছু জানি না" বা বিভ্রান্তিকর কথা বলবেন না। সম্পূর্ণ তথ্য সুন্দরভাবে উপস্থাপন করবেন।`,
    voiceId: 'voice-bn-female-1',
    elevenLabsVoiceId: 'cgSgspJ2msm6clMCkdW9',
    elevenLabsStatus: 'PERMISSION_REQUIRED',
    vapiAssistantId: 'b37b72e1-047d-408b-9096-cc5cf21256cd',
    vapiStatus: 'CONNECTED',
    phoneNumberId: 'phone-1',
    phoneNumber: '+880 9612-887766',
    status: 'Active',
    isActive: true,
    totalCalls: 342,
    totalMinutes: 728,
    createdAt: '2024-02-01',
    knowledgeBaseCount: 4,
    leads: 68
  },
  {
    id: 'agent-2',
    name: 'Rahim Electronics Sales Agent',
    businessName: 'Rahim Electronics',
    type: 'Sales Agent',
    language: 'Banglish',
    personality: 'Sales Assistant',
    friendliness: 95,
    professionalism: 75,
    responseLength: 60,
    firstMessage: 'Hello! Rahim Electronics-এ স্বাগতম। আজ আমাদের বিশেষ অফার চলছে, কীভাবে সাহায্য করতে পারি?',
    instructions: `আপনি Rahim Electronics-এর একজন স্মার্ট ও ফ্রেন্ডলি Sales Agent।
কাস্টমার ইনকোয়ারি শুনে সেরা টিভি, ফ্রিজ ও এসি মডেল রেকমেন্ড করুন।
বর্তমানে চলমান ঈদ অফার এবং ১০% ডিসকাউন্ট ভাউচার কোড 'EID2024' সম্পর্কে অবহিত করুন।
হোম ডেলিভারির জন্য কাস্টমারের বর্তমান লোকেশন ও ক্যাশ অন ডেলিভারি প্রেফারেন্স নোট করুন।`,
    voiceId: 'voice-bn-male-1',
    phoneNumberId: 'phone-2',
    phoneNumber: '+880 9638-112233',
    status: 'Active',
    isActive: true,
    totalCalls: 189,
    totalMinutes: 412,
    createdAt: '2024-02-10',
    knowledgeBaseCount: 2,
    leads: 41
  },
  {
    id: 'agent-3',
    name: 'ABC Pharmacy Helpline',
    businessName: 'ABC Pharmacy',
    type: 'Customer Support',
    language: 'বাংলা',
    personality: 'Formal',
    friendliness: 80,
    professionalism: 95,
    responseLength: 40,
    firstMessage: 'আসসালামু আলাইকুম, এবিসি ফার্মেসি হেল্পলাইন। মেডিসিন ডেলিভারি ও সেবায় কীভাবে সহায়তা করতে পারি?',
    instructions: `আপনি ABC Pharmacy-এর সাপোর্ট এজেন্ট।
কাস্টমারকে প্রেসক্রিপশন আপলোড এবং নিকটস্থ আউটলেটের ওপেনিং আওয়ার (সকাল ৮টা থেকে রাত ১২টা) সংক্রান্ত তথ্য দিন।
জরুরি মেডিসিন হোম ডেলিভারির জন্য প্রেসক্রিপশন নিশ্চিত করতে বলুন। কখনো অননুমোদিত মেডিকেল পরামর্শ দেবেন না।`,
    voiceId: 'voice-bn-female-2',
    status: 'Paused',
    isActive: false,
    totalCalls: 64,
    totalMinutes: 128,
    createdAt: '2024-02-18',
    knowledgeBaseCount: 1,
    leads: 12
  }
];

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadAgentsFromStorage(): StoredAgent[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(AGENTS_FILE)) {
      fs.writeFileSync(AGENTS_FILE, JSON.stringify(DEFAULT_AGENTS, null, 2), 'utf-8');
      return DEFAULT_AGENTS;
    }
    const raw = fs.readFileSync(AGENTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_AGENTS;
  } catch (err) {
    console.error('Error loading agents from main storage:', err);
    return DEFAULT_AGENTS;
  }
}

export function saveAgentsToStorage(agents: StoredAgent[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving agents to main storage:', err);
  }
}

export async function createMainAgent(agentData: Partial<StoredAgent>): Promise<{ agent: StoredAgent; vapiCreated: boolean; vapiError?: string }> {
  const current = loadAgentsFromStorage();
  const id = agentData.id || `agent-${Date.now()}`;
  
  const newAgent: StoredAgent = {
    id,
    name: agentData.name || 'New AI Voice Agent',
    businessName: agentData.businessName || 'My Business',
    type: agentData.type || 'Receptionist',
    language: agentData.language || 'বাংলা',
    personality: agentData.personality || 'Professional',
    friendliness: agentData.friendliness ?? 85,
    professionalism: agentData.professionalism ?? 90,
    responseLength: agentData.responseLength ?? 50,
    firstMessage: agentData.firstMessage || 'আসসালামু আলাইকুম! কীভাবে সহায়তা করতে পারি?',
    instructions: agentData.instructions || 'কলারদের সাথে বিনম্র ও প্রফেশনালভাবে কথা বলুন।',
    voiceId: agentData.voiceId || 'voice-bn-female-1',
    phoneNumberId: agentData.phoneNumberId,
    phoneNumber: agentData.phoneNumber,
    status: agentData.status || 'Active',
    isActive: agentData.isActive ?? true,
    totalCalls: 0,
    totalMinutes: 0,
    createdAt: new Date().toISOString().split('T')[0],
    knowledgeBaseCount: agentData.knowledgeBaseCount ?? 0,
    leads: 0,
    versions: [
      {
        version: 1,
        date: new Date().toLocaleDateString('bn-BD'),
        summary: 'মেইন সার্ভার স্টোরেজে এজেন্ট তৈরি ও অ্যাক্টিভেশন',
        changes: ['Created in Main Server Storage', 'Configured initial prompt instructions'],
        instructions: agentData.instructions
      }
    ]
  };

  let vapiCreated = false;
  let vapiError: string | undefined;

  // Check if assistant is already created in Vapi, otherwise create automatically in Vapi
  if (agentData.vapiAssistantId) {
    newAgent.vapiAssistantId = agentData.vapiAssistantId;
    newAgent.vapiStatus = 'CONNECTED';
    newAgent.vapiLastSyncedAt = new Date().toISOString();
    vapiCreated = true;
  } else {
    try {
      const vapiRes = await createVapiAssistant({
        name: newAgent.name,
        firstMessage: newAgent.firstMessage,
        instructions: newAgent.instructions
      });

      if (vapiRes.success && vapiRes.assistant?.id) {
        newAgent.vapiAssistantId = vapiRes.assistant.id;
        newAgent.vapiStatus = 'CONNECTED';
        newAgent.vapiLastSyncedAt = new Date().toISOString();
        vapiCreated = true;
      } else if (vapiRes.error) {
        vapiError = vapiRes.error;
      }
    } catch (err: any) {
      vapiError = err?.message;
    }
  }

  current.push(newAgent);
  saveAgentsToStorage(current);

  return { agent: newAgent, vapiCreated, vapiError };
}

export async function updateMainAgent(id: string, updates: Partial<StoredAgent>): Promise<{ agent: StoredAgent | null; vapiSynced: boolean; vapiError?: string }> {
  const current = loadAgentsFromStorage();
  const index = current.findIndex((a) => a.id === id);
  if (index === -1) {
    return { agent: null, vapiSynced: false, vapiError: 'Agent not found' };
  }

  const existing = current[index];
  const updated: StoredAgent = {
    ...existing,
    ...updates,
    id: existing.id // preserve ID
  };

  let vapiSynced = false;
  let vapiError: string | undefined;

  // If agent has a Vapi Assistant ID, update Vapi in real time!
  if (updated.vapiAssistantId) {
    try {
      const vapiRes = await updateVapiAssistant(updated.vapiAssistantId, {
        name: updated.name,
        firstMessage: updated.firstMessage,
        instructions: updated.instructions
      });
      if (vapiRes.success) {
        vapiSynced = true;
        updated.vapiLastSyncedAt = new Date().toISOString();
        updated.vapiStatus = 'CONNECTED';
      } else {
        vapiError = vapiRes.error;
      }
    } catch (err: any) {
      vapiError = err?.message;
    }
  } else if (updates.instructions || updates.name) {
    // If not connected to Vapi yet, attempt auto-creation
    try {
      const vapiRes = await createVapiAssistant({
        name: updated.name,
        firstMessage: updated.firstMessage,
        instructions: updated.instructions
      });
      if (vapiRes.success && vapiRes.assistant?.id) {
        updated.vapiAssistantId = vapiRes.assistant.id;
        updated.vapiStatus = 'CONNECTED';
        updated.vapiLastSyncedAt = new Date().toISOString();
        vapiSynced = true;
      }
    } catch {
      // Ignored
    }
  }

  current[index] = updated;
  saveAgentsToStorage(current);

  return { agent: updated, vapiSynced, vapiError };
}

export function deleteMainAgent(id: string): boolean {
  const current = loadAgentsFromStorage();
  const filtered = current.filter((a) => a.id !== id);
  if (filtered.length !== current.length) {
    saveAgentsToStorage(filtered);
    return true;
  }
  return false;
}
