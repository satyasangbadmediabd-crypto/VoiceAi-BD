export type AgentType = 
  | 'Receptionist' 
  | 'Sales Agent' 
  | 'Customer Support' 
  | 'Appointment Agent' 
  | 'Lead Generation' 
  | 'Custom';

export type LanguageOption = 'বাংলা' | 'Banglish' | 'English';

export type PersonalityTrait = 'Friendly' | 'Professional' | 'Formal' | 'Casual' | 'Sales Assistant';

export type AgentStatus = 'DRAFT' | 'TESTING' | 'READY' | 'DEPLOYING' | 'LIVE' | 'PAUSED' | 'ARCHIVED' | 'Active' | 'Paused' | 'Draft' | 'Error';

export interface AgentHealthCheckItem {
  key: string;
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'not_connected';
  description: string;
  category: 'core' | 'ai' | 'telephony' | 'account';
  actionLabel?: string;
  actionRoute?: string;
}

export interface AgentHealthSummary {
  agentId: string;
  overallScore: number; // 0-100
  overallStatus: 'Healthy' | 'Warning' | 'Action Required' | 'Not Connected';
  lastChecked: string;
  checks: AgentHealthCheckItem[];
}

export interface AgentVersion {
  version: number;
  date: string;
  summary: string;
  changes: string[];
  instructions?: string;
  voiceId?: string;
  phoneNumber?: string;
}

export interface Agent {
  id: string;
  name: string;
  businessName: string;
  type: AgentType;
  language: LanguageOption;
  personality: PersonalityTrait;
  friendliness: number; // 0-100
  professionalism: number; // 0-100
  responseLength: number; // 0-100
  instructions: string;
  firstMessage?: string;
  voiceId: string;
  phoneNumberId?: string;
  phoneNumber?: string;
  status: AgentStatus;
  isActive: boolean;
  totalCalls: number;
  totalMinutes: number;
  createdAt: string;
  knowledgeBaseCount: number;
  leads?: number;
  versions?: AgentVersion[];
  elevenLabsAgentId?: string;
  elevenLabsVoiceId?: string;
  elevenLabsStatus?: 'READY' | 'PERMISSION_REQUIRED' | 'NOT_CONFIGURED';
  vapiAssistantId?: string;
  vapiStatus?: 'CONNECTED' | 'NOT_CONFIGURED';
}

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Female' | 'Male';
  style: string;
  language: string;
  sampleAudioText: string;
  previewUrl?: string;
  accent: string;
}

export interface KnowledgeDocument {
  id: string;
  fileName: string;
  size: string;
  uploadDate: string;
  status: 'Ready' | 'Processing' | 'Failed';
  type: 'PDF' | 'DOCX' | 'TXT';
  previewExcerpt: string;
  itemCount: number;
}

export interface PhoneNumber {
  id: string;
  number: string;
  provider: 'SIP Provider' | 'IP Telephony Provider' | 'Custom SIP';
  status: 'Connected' | 'Available' | 'Configuring';
  connectedAgentId?: string;
  connectedAgentName?: string;
  sipEndpoint?: string;
  country: string;
  monthlyFee: number;
}

export type LeadStatus = 'HOT' | 'WARM' | 'FOLLOW UP' | 'NOT INTERESTED';

export interface LeadTimelineEvent {
  step: string;
  time: string;
  description: string;
  completed: boolean;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  interest: string;
  agentId: string;
  agentName: string;
  status: LeadStatus;
  score?: number; // 0-100 simulated AI lead score
  scoreFactors?: {
    interestScore: number;
    engagementScore: number;
    purchaseIntentScore: number;
    followUpRequested: boolean;
  };
  timeline?: LeadTimelineEvent[];
  date: string;
  notes: string;
  education?: string;
  preferredMode?: string;
  extractedFromCallId?: string;
}

export interface CallLog {
  id: string;
  caller: string;
  agentId: string;
  agentName: string;
  duration: string; // e.g. "02:31"
  durationSeconds: number;
  language: LanguageOption;
  status: 'Qualified Lead' | 'Interested' | 'Resolved' | 'Missed' | 'Follow-up Needed';
  date: string;
  timestamp: string;
  summary: string;
  transcript: {
    speaker: 'AI' | 'Caller';
    text: string;
    time: string;
  }[];
  leadCollected?: {
    name: string;
    phone: string;
    interest: string;
    intent: string;
  };
}

export interface PricingPlan {
  id: 'starter' | 'business' | 'pro' | string;
  name: string;
  price: number; // in BDT
  priceLabel: string;
  billingCycle: string;
  agentLimit: number;
  minutesLimit: number;
  description?: string;
  features: string[];
  recommended?: boolean;
}

export interface UserProfile {
  name: string;
  businessName: string;
  phone: string;
  email: string;
  avatar?: string;
  authProvider?: 'google' | 'facebook' | 'email' | 'phone';
  role?: 'admin' | 'user';
  isAdmin?: boolean;
  plan: 'Starter' | 'Business' | 'Pro';
  minutesUsed: number;
  minutesLimit: number;
  joinedDate: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

// Team Management
export type TeamRole = 'Owner' | 'Admin' | 'Manager' | 'Agent Viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  department?: string;
  status: 'Active' | 'Invited' | 'Suspended' | 'Inactive';
  joinedDate: string;
  avatar?: string;
  permissions?: string[];
}

// Super Admin User Management
export interface PlatformUser {
  id: string;
  name: string;
  business: string;
  phone: string;
  email: string;
  plan: 'Starter' | 'Business' | 'Pro' | 'Enterprise';
  agentsCount: number;
  minutesUsed: number;
  minutesLimit: number;
  status: 'Active' | 'Trial' | 'Suspended' | 'Expired';
  joined: string;
  activePhoneNumbers: string[];
  recentCallsCount: number;
  leadsCount: number;
  totalCalls?: number;
  billingStatus: 'Paid' | 'Pending' | 'Overdue';
  lastActive: string;
}

// Invoices
export interface Invoice {
  id: string;
  date: string;
  plan: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
  method: string;
  downloadUrl?: string;
}

// System Logs
export interface ActivityLog {
  id: string;
  time: string;
  user: string;
  action: string;
  resource: string;
  category: 'All' | 'Users' | 'Agents' | 'Calls' | 'Billing' | 'System';
  status: 'Success' | 'Warning' | 'Failed';
  details?: string;
}

// App Notifications
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  category: 'agent' | 'usage' | 'lead' | 'billing' | 'system';
  link?: string;
}

// Integrations
export interface IntegrationItem {
  id: string;
  name: string;
  category:
    | 'Voice Providers'
    | 'Telephony / SIP'
    | 'CRM & Automations'
    | 'Messaging & Alerts'
    | 'API & Webhooks'
    | 'Voice'
    | 'Telephony'
    | 'CRM'
    | 'Messaging'
    | 'Automation'
    | 'Analytics';
  description: string;
  status: 'Connected' | 'Not Connected' | 'Demo Mode' | 'Available' | 'Config Required';
  provider: string;
  logoText: string;
  icon?: string;
  features: string[];
  configFields: {
    key: string;
    label: string;
    value: string;
    masked?: boolean;
    required?: boolean;
    type?: string;
    placeholder?: string;
  }[];
}

// Onboarding Step
export interface OnboardingStep {
  id: number;
  stepNumber: string;
  title: string;
  subtitle: string;
  completed: boolean;
  route: string;
}

// bKash / Nagad Payment Gateway & Transactions
export interface PaymentGatewayConfig {
  bkashNumber: string;
  bkashType: 'Personal (Send Money)' | 'Merchant (Payment)';
  bkashInstructions: string;
  nagadNumber: string;
  nagadType: 'Personal (Send Money)' | 'Merchant (Payment)';
  nagadInstructions: string;
  bankDetails: string;
  supportPhone: string;

  // Telegram Notifications
  telegramEnabled?: boolean;
  telegramBotToken?: string;
  telegramChatId?: string;

  // WhatsApp Notifications
  whatsappEnabled?: boolean;
  whatsappNumber?: string;
  whatsappWebhookUrl?: string;
  whatsappApiKey?: string;
}

export interface BillingTransaction {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  planId: string;
  planName: string;
  amount: number; // in BDT
  paymentMethod: 'bKash' | 'Nagad' | 'Bank' | 'Card';
  senderNumber: string;
  transactionId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  notes?: string;
  createdAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface PaymentConfig {
  bkashNumber: string;
  bkashType: string;
  bkashInstruction: string;
  nagadNumber: string;
  nagadType: string;
  nagadInstruction: string;
  rocketNumber?: string;
  bankAccountDetails?: string;
  isManualEnabled?: boolean;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userBusiness: string;
  planId: string;
  planName: string;
  amount: number;
  method: string;
  senderNumber: string;
  trxId: string;
  createdAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNote?: string;
  approvedAt?: string;
}

