import fs from 'fs';
import path from 'path';

export interface WebsiteSettings {
  // Brand & Site Info
  siteName: string;
  siteTagline: string;
  brandSlogan: string;
  supportPhone: string;
  supportEmail: string;
  officeAddress: string;
  footerNotice: string;

  // Announcement Banner
  announcementActive: boolean;
  announcementText: string;
  announcementBadge: string;

  // Landing Page Hero & Dynamic Writing Animation
  badgeText: string;
  heroTitlePrefix: string;
  heroTitleHighlight: string;
  heroSubtitle: string;
  typewriterPhrases: string[];

  // CTA Buttons
  primaryCtaText: string;
  secondaryCtaText: string;

  // 3D Floating Phone Mockup preview
  mockupCallerName: string;
  mockupBusinessName: string;
  mockupTranscript: string;

  // Features Section
  featuresHeading: string;
  featuresSubheading: string;

  // ROI Calculator Defaults
  roiDefaultSalary: number;
  roiDefaultCalls: number;

  // Contact & Social
  whatsappNumber: string;
  facebookUrl: string;
  linkedinUrl: string;

  // API Keys (Stored securely on server)
  vapiPrivateKey?: string;
  vapiPublicKey?: string;
  vapiAssistantId?: string;
  geminiApiKey?: string;
  elevenLabsApiKey?: string;

  // Pricing Plans (BDT)
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

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const SETTINGS_FILE = path.join(DATA_DIR, 'websiteSettings.json');

export const DEFAULT_WEBSITE_SETTINGS: WebsiteSettings = {
  siteName: 'VoiceAI BD',
  siteTagline: 'বাংলাদেশের ব্যবসার জন্য 24/7 AI Voice Telephony & Customer Automation Platform',
  brandSlogan: 'Voice Telephony & Smart Customer Automation',
  supportPhone: '+880 1712-345678',
  supportEmail: 'support@voiceaibd.com',
  officeAddress: 'ধানমন্ডি, ঢাকা-১২০৯, বাংলাদেশ',
  footerNotice: 'VoiceAI BD — 24/7 AI Voice Telephony & Customer Automation Platform for Bangladesh',

  announcementActive: true,
  announcementText: 'বাংলাদেশের প্রথম স্বয়ংক্রিয় এআই ভয়েস কলিং ও টেলিফোনি প্ল্যাটফর্ম এখন লাইভ!',
  announcementBadge: 'নতুন আপডেট',

  badgeText: 'VOICEAI BD 3D TELEPHONY • 24/7 লাইভ',
  heroTitlePrefix: 'স্বাভাবিক বাংলায় কথা বলা',
  heroTitleHighlight: 'AI Voice Agent',
  heroSubtitle: 'কোনো কল ড্রপ বা ওয়েটিং নয়! কাস্টমারের প্রশ্ন শুনবে, পণ্যের স্টক জানাবে, ডাক্তারের সিরিয়াল বুক করবে এবং লিড সংগ্রহ করবে। যেকোনো ব্রাউজার এবং +880 ফোন নম্বরে সরাসরি কার্যকর।',
  typewriterPhrases: [
    'আপনার কাস্টমারের প্রতিটি ফোন কলের উত্তর দেবে...',
    '২৪/৭ নিরবচ্ছিন্ন সেলস ও টেবিল বুকিং হ্যান্ডেল করবে...',
    'মিষ্টি ও স্বাভাবিক দেশীয় বাংলায় কথা বলবে...',
    'অর্ডার ও অ্যাপয়েন্টমেন্ট সরাসরি ডাটাবেজে জমা করবে...'
  ],

  primaryCtaText: 'ফ্রি Agent তৈরি করুন',
  secondaryCtaText: 'লাইভ কল টেস্ট শুনুন',

  mockupCallerName: 'কাউসার আহমেদ (ধানমন্ডি)',
  mockupBusinessName: 'AI Skill Hub BD',
  mockupTranscript: 'আসসালামু আলাইকুম! AI Skill Hub BD-তে স্বাগতম। আমাদের AI Mastermind কোর্স ও প্রিমিয়াম ক্লাবের এডমিশন চলছে। কীভাবে সাহায্য করতে পারি?',

  featuresHeading: 'কেন বাংলাদেশের হাজারো ব্যবসা VoiceAI BD বেছে নিচ্ছে',
  featuresSubheading: 'সাধারণ চ্যাটবট নয়, এটি মানুষের মতোই সাবলীল বাংলায় কথা বলে এবং কাস্টমার সন্তুষ্টি বাড়ায়',

  roiDefaultSalary: 25000,
  roiDefaultCalls: 80,

  whatsappNumber: '+880 1712-345678',
  facebookUrl: 'https://facebook.com',
  linkedinUrl: 'https://linkedin.com',

  vapiPrivateKey: '',
  vapiPublicKey: '',
  vapiAssistantId: 'b37b72e1-047d-408b-9096-cc5cf21256cd',
  geminiApiKey: '',
  elevenLabsApiKey: '',

  starterName: 'Starter',
  starterPrice: 1999,
  starterMinutes: 200,
  businessName: 'Business Pro',
  businessPrice: 4999,
  businessMinutes: 800,
  enterpriseName: 'Enterprise',
  enterprisePrice: 9999,
  enterpriseMinutes: 2500,

  updatedAt: new Date().toISOString()
};

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadWebsiteSettings(): WebsiteSettings {
  try {
    ensureDataDir();
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_WEBSITE_SETTINGS, null, 2), 'utf-8');
      return DEFAULT_WEBSITE_SETTINGS;
    }
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_WEBSITE_SETTINGS,
      ...parsed
    };
  } catch (err) {
    console.error('Error loading website settings:', err);
    return DEFAULT_WEBSITE_SETTINGS;
  }
}

export function saveWebsiteSettings(updates: Partial<WebsiteSettings>): WebsiteSettings {
  try {
    ensureDataDir();
    const current = loadWebsiteSettings();
    const updated: WebsiteSettings = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return updated;
  } catch (err) {
    console.error('Error saving website settings:', err);
    return loadWebsiteSettings();
  }
}

export function getStoredVapiPrivateKey(): string {
  const s = loadWebsiteSettings();
  return (s.vapiPrivateKey || '').trim();
}

export function getStoredVapiPublicKey(): string {
  const s = loadWebsiteSettings();
  return (s.vapiPublicKey || '').trim();
}

export function getStoredVapiAssistantId(): string {
  const s = loadWebsiteSettings();
  return (s.vapiAssistantId || '').trim();
}

export function getStoredGeminiApiKey(): string {
  const s = loadWebsiteSettings();
  return (s.geminiApiKey || '').trim();
}

export function getStoredElevenLabsApiKey(): string {
  const s = loadWebsiteSettings();
  return (s.elevenLabsApiKey || '').trim();
}
