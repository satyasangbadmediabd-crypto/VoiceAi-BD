import React, { createContext, useContext, useState, useEffect } from 'react';
import { isUserAdmin, PRIMARY_ADMIN_EMAIL } from '../utils/adminAuth';
import {
  Agent,
  AgentStatus,
  AgentVersion,
  KnowledgeDocument,
  PhoneNumber,
  Lead,
  CallLog,
  UserProfile,
  ToastMessage,
  PricingPlan,
  TeamMember,
  PlatformUser,
  Invoice,
  ActivityLog,
  AppNotification,
  IntegrationItem,
  OnboardingStep,
  BillingTransaction,
  PaymentGatewayConfig
} from '../types';
import {
  INITIAL_USER,
  INITIAL_AGENTS,
  INITIAL_KNOWLEDGE_DOCS,
  INITIAL_PHONE_NUMBERS,
  INITIAL_LEADS,
  INITIAL_CALLS,
  PRICING_PLANS,
  INITIAL_TEAM_MEMBERS,
  INITIAL_PLATFORM_USERS,
  INITIAL_INVOICES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_NOTIFICATIONS,
  INITIAL_INTEGRATIONS,
  INITIAL_ONBOARDING_STEPS
} from '../mockData';
import {
  fetchMainStorageAgents,
  createMainStorageAgent,
  updateMainStorageAgent,
  deleteMainStorageAgent,
  fetchBillingConfig,
  saveBillingConfigApi,
  fetchTransactions,
  submitTransactionApi,
  updateTransactionStatusApi,
  WebsiteSettingsData,
  fetchWebsiteSettingsApi,
  saveWebsiteSettingsApi
} from '../services/apiService';

export interface ConfirmDialogState {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
}

interface AppContextType {
  currentRoute: string;
  navigate: (route: string) => void;
  user: UserProfile | null;
  login: (userData: Partial<UserProfile> | string) => void;
  signup: (userData: Partial<UserProfile>) => void;
  logout: () => void;

  // Agents
  agents: Agent[];
  addAgent: (agent: Omit<Agent, 'id' | 'createdAt' | 'totalCalls' | 'totalMinutes' | 'knowledgeBaseCount' | 'status' | 'leads'>) => Agent;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  deleteAgent: (id: string) => void;
  toggleAgentActive: (id: string) => void;
  duplicateAgent: (id: string) => void;
  updateAgentStatus: (id: string, status: AgentStatus) => void;
  addAgentVersion: (id: string, summary: string, changes: string[], instructions?: string) => void;

  // Knowledge docs
  knowledgeDocs: KnowledgeDocument[];
  addKnowledgeDoc: (file: { name: string; size: string; type: 'PDF' | 'DOCX' | 'TXT'; preview: string }) => void;
  deleteKnowledgeDoc: (id: string) => void;

  // Phone numbers
  phoneNumbers: PhoneNumber[];
  addPhoneNumber: (data: { number: string; provider: PhoneNumber['provider']; sipEndpoint?: string }) => void;
  connectPhoneToAgent: (phoneId: string, agentId: string) => void;
  disconnectPhone: (phoneId: string) => void;

  // Leads
  leads: Lead[];
  updateLeadStatus: (leadId: string, status: Lead['status']) => void;
  addLead: (lead: Omit<Lead, 'id' | 'date'>) => void;
  deleteLead: (leadId: string) => void;

  // Calls
  calls: CallLog[];
  addCallLog: (call: Omit<CallLog, 'id' | 'timestamp'>) => void;

  // Team
  teamMembers: TeamMember[];
  addTeamMember: (member: Omit<TeamMember, 'id' | 'joinedDate'>) => void;
  updateTeamMember: (id: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (id: string) => void;

  // Super Admin Platform Users
  platformUsers: PlatformUser[];
  updatePlatformUserStatus: (userId: string, status: PlatformUser['status']) => void;
  updatePlatformUserPlan: (userId: string, plan: PlatformUser['plan']) => void;
  deletePlatformUser: (userId: string) => void;

  // Invoices & Billing
  invoices: Invoice[];
  cancelSubscription: () => void;
  changePlan: (plan: PricingPlan) => void;

  // Billing Transactions & Gateway Config
  billingConfig: PaymentGatewayConfig;
  updateBillingConfig: (config: Partial<PaymentGatewayConfig>) => Promise<boolean>;
  transactions: BillingTransaction[];
  submitBillingTransaction: (data: {
    paymentMethod: 'bKash' | 'Nagad' | 'Bank' | 'Card';
    senderNumber: string;
    transactionId: string;
    notes?: string;
  }) => Promise<boolean>;
  approveTransaction: (id: string) => Promise<boolean>;
  rejectTransaction: (id: string, reason?: string) => Promise<boolean>;
  refreshTransactions: () => Promise<void>;

  // Admin Authentication & Security Lock
  isAdminUnlocked: boolean;
  isSuperAdminUnlocked: boolean;
  unlockAdmin: (role: 'admin' | 'superadmin', token: string) => void;
  lockAdmin: (role?: 'admin' | 'superadmin' | 'all') => void;

  // Activity Logs
  activityLogs: ActivityLog[];
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'time'>) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;

  // Integrations
  integrations: IntegrationItem[];
  toggleIntegrationStatus: (id: string, status: IntegrationItem['status']) => void;
  updateIntegrationConfig: (id: string, key: string, value: string) => void;

  // Onboarding
  onboardingSteps: OnboardingStep[];
  toggleOnboardingStep: (id: number) => void;
  dismissOnboarding: boolean;
  setDismissOnboarding: (dismiss: boolean) => void;

  // Call simulator
  activeTestAgent: Agent | null;
  setActiveTestAgent: (agent: Agent | null) => void;
  isCallSimulatorOpen: boolean;
  openCallSimulator: (agent?: Agent, callerNumber?: string) => void;
  closeCallSimulator: () => void;

  // Checkout
  isCheckoutOpen: boolean;
  checkoutPlan: PricingPlan | null;
  openCheckout: (plan: PricingPlan) => void;
  closeCheckout: () => void;
  completePayment: (paymentMethod: string, transactionId: string) => void;

  // Global Demo Mode modal
  isDemoModeModalOpen: boolean;
  openDemoModeModal: () => void;
  closeDemoModeModal: () => void;

  // Global Search modal
  isGlobalSearchOpen: boolean;
  openGlobalSearch: () => void;
  closeGlobalSearch: () => void;

  // Confirmation modal
  confirmDialog: ConfirmDialogState | null;
  openConfirmDialog: (dialog: Omit<ConfirmDialogState, 'isOpen'>) => void;
  closeConfirmDialog: () => void;

  // Website CMS & Settings
  websiteSettings: WebsiteSettingsData;
  updateWebsiteSettings: (updates: Partial<WebsiteSettingsData>) => Promise<boolean>;

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const getAppBasePath = (): string => {
  if (typeof window === 'undefined') return '';
  const pathname = window.location.pathname;
  if (window.location.hostname.includes('github.io')) {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length > 0 && !parts[0].includes('.')) {
      return '/' + parts[0];
    }
  }
  return '';
};

const resolveInitialRoute = (): string => {
  if (typeof window === 'undefined') return '/login';

  // 1. Check for query param from 404.html redirect: ?p=/route
  try {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectPath = searchParams.get('p');
    if (redirectPath) {
      const cleanUrl = window.location.pathname + (window.location.hash || '');
      window.history.replaceState(null, '', cleanUrl);
      return redirectPath.startsWith('/') ? redirectPath : '/' + redirectPath;
    }
  } catch {}

  // 2. Check hash route: #/dashboard or #/login
  if (window.location.hash) {
    const hash = window.location.hash.replace(/^#/, '');
    if (hash.startsWith('/')) return hash;
    if (hash.length > 0) return '/' + hash;
  }

  // 3. Check pathname
  let path = window.location.pathname;
  const basePath = getAppBasePath();
  if (basePath && path.startsWith(basePath)) {
    path = path.slice(basePath.length);
  }

  // Strip trailing /index.html or trailing slash
  if (path.endsWith('/index.html')) {
    path = path.replace(/\/index\.html$/, '');
  }

  if (path && path !== '' && path !== '/') {
    return path.startsWith('/') ? path : '/' + path;
  }

  return '/login';
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Routes - Universal domain, subdomain & hash-friendly
  const [currentRoute, setCurrentRoute] = useState<string>(() => resolveInitialRoute());

  // User state - requires login on each browser session
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const sessionUser = sessionStorage.getItem('voiceai_session_user');
      if (sessionUser) return JSON.parse(sessionUser);
    } catch {}
    return null;
  });

  // Agents
  const [agents, setAgents] = useState<Agent[]>(() => {
    const saved = localStorage.getItem('voiceai_agents');
    return saved ? JSON.parse(saved) : INITIAL_AGENTS;
  });

  // Knowledge docs
  const [knowledgeDocs, setKnowledgeDocs] = useState<KnowledgeDocument[]>(() => {
    const saved = localStorage.getItem('voiceai_knowledge');
    return saved ? JSON.parse(saved) : INITIAL_KNOWLEDGE_DOCS;
  });

  // Phone numbers
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>(() => {
    const saved = localStorage.getItem('voiceai_phones');
    return saved ? JSON.parse(saved) : INITIAL_PHONE_NUMBERS;
  });

  // Leads
  const [leads, setLeads] = useState<Lead[]>(() => {
    const saved = localStorage.getItem('voiceai_leads');
    return saved ? JSON.parse(saved) : INITIAL_LEADS;
  });

  // Calls
  const [calls, setCalls] = useState<CallLog[]>(() => {
    const saved = localStorage.getItem('voiceai_calls');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const seen = new Set<string>();
          const deduped: CallLog[] = [];
          for (const item of parsed) {
            if (item && item.id && !seen.has(item.id)) {
              seen.add(item.id);
              deduped.push(item);
            }
          }
          return deduped;
        }
      } catch {}
    }
    return INITIAL_CALLS;
  });

  // Team
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('voiceai_team');
    return saved ? JSON.parse(saved) : INITIAL_TEAM_MEMBERS;
  });

  // Platform Users (Super Admin)
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>(() => {
    const saved = localStorage.getItem('voiceai_platform_users');
    return saved ? JSON.parse(saved) : INITIAL_PLATFORM_USERS;
  });

  // Invoices
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('voiceai_invoices');
    return saved ? JSON.parse(saved) : INITIAL_INVOICES;
  });

  // Billing Gateway Config (bKash & Nagad)
  const [billingConfig, setBillingConfig] = useState<PaymentGatewayConfig>({
    bkashNumber: '01712-345678',
    bkashType: 'Personal (Send Money)',
    bkashInstructions: 'আপনার বিকাশ অ্যাপ থেকে Send Money অপশনে গিয়ে উপরে উল্লেখিত নম্বরে নির্ধারিত ফি প্রদান করুন। রেফারেন্স হিসেবে আপনার মোবাইল নম্বর লিখুন এবং প্রাপ্ত TrxID প্রদান করুন।',
    nagadNumber: '01819-987654',
    nagadType: 'Personal (Send Money)',
    nagadInstructions: 'নগদ অ্যাপ অথবা *167# ডায়াল করে Send Money করুন এবং ট্রানজেকশন নিশ্চিতকরণের পর প্রাপ্ত TrxID সাবমিট করুন।',
    bankDetails: 'BRAC Bank PLC, Account: VoiceAI BD Technologies Ltd, A/C No: 1501204892019, Gulshan Branch, Dhaka',
    supportPhone: '+880 1712-345678'
  });

  // Billing Transactions
  const [transactions, setTransactions] = useState<BillingTransaction[]>([]);

  // Admin Security Unlock State
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('voiceai_admin_unlocked') === 'true';
  });

  const [isSuperAdminUnlocked, setIsSuperAdminUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('voiceai_superadmin_unlocked') === 'true';
  });

  // Activity logs
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('voiceai_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('voiceai_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Integrations
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(() => {
    const saved = localStorage.getItem('voiceai_integrations');
    return saved ? JSON.parse(saved) : INITIAL_INTEGRATIONS;
  });

  // Onboarding steps
  const [onboardingSteps, setOnboardingSteps] = useState<OnboardingStep[]>(() => {
    const saved = localStorage.getItem('voiceai_onboarding');
    return saved ? JSON.parse(saved) : INITIAL_ONBOARDING_STEPS;
  });

  const [dismissOnboarding, setDismissOnboardingState] = useState<boolean>(() => {
    return localStorage.getItem('voiceai_onboarding_dismissed') === 'true';
  });

  // Modal states
  const [activeTestAgent, setActiveTestAgent] = useState<Agent | null>(agents[0] || null);
  const [isCallSimulatorOpen, setIsCallSimulatorOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutPlan, setCheckoutPlan] = useState<PricingPlan | null>(null);
  const [isDemoModeModalOpen, setIsDemoModeModalOpen] = useState(false);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Website Settings (Synced with Server CMS)
  const [websiteSettings, setWebsiteSettings] = useState<WebsiteSettingsData>(() => {
    const saved = localStorage.getItem('voiceai_website_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
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
      starterName: 'Starter',
      starterPrice: 1999,
      starterMinutes: 200,
      businessName: 'Business Pro',
      businessPrice: 4999,
      businessMinutes: 800,
      enterpriseName: 'Enterprise',
      enterprisePrice: 9999,
      enterpriseMinutes: 2500
    };
  });

  const updateWebsiteSettings = async (updates: Partial<WebsiteSettingsData>): Promise<boolean> => {
    try {
      setWebsiteSettings((prev) => {
        const next = { ...prev, ...updates };
        localStorage.setItem('voiceai_website_settings', JSON.stringify(next));
        return next;
      });
      const res = await saveWebsiteSettingsApi(updates);
      if (res.success && res.data) {
        setWebsiteSettings((prev) => {
          const merged = { ...prev, ...res.data };
          localStorage.setItem('voiceai_website_settings', JSON.stringify(merged));
          return merged;
        });
        try {
          if (typeof BroadcastChannel !== 'undefined') {
            const bc = new BroadcastChannel('voiceai_live_sync');
            bc.postMessage({ type: 'SETTINGS_UPDATED' });
            bc.close();
          }
        } catch {}
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Sync session
  useEffect(() => {
    if (user) {
      try {
        sessionStorage.setItem('voiceai_session_user', JSON.stringify(user));
        localStorage.setItem('voiceai_user', JSON.stringify(user));
      } catch {}
    } else {
      try {
        sessionStorage.removeItem('voiceai_session_user');
        localStorage.removeItem('voiceai_user');
      } catch {}
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('voiceai_agents', JSON.stringify(agents));
  }, [agents]);

  // Robust Live Sync from Server (Website settings, Billing config, Transactions, Agents)
  useEffect(() => {
    const syncAllFromServer = () => {
      fetchMainStorageAgents()
        .then((res) => {
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            setAgents(res.data);
          }
        })
        .catch(() => {});

      fetchBillingConfig()
        .then((res) => {
          if (res.success && res.data) {
            setBillingConfig(res.data);
          }
        })
        .catch(() => {});

      fetchTransactions()
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            setTransactions(res.data);
          }
        })
        .catch(() => {});

      fetchWebsiteSettingsApi()
        .then((res) => {
          if (res.success && res.data) {
            setWebsiteSettings((prev) => ({ ...prev, ...res.data }));
          }
        })
        .catch(() => {});
    };

    // Immediate initial sync
    syncAllFromServer();

    // 1. Background real-time polling every 8s so changes in Admin Panel immediately reflect on all clients
    const pollInterval = setInterval(syncAllFromServer, 8000);

    // 2. Window focus & visibility re-sync
    const handleFocus = () => syncAllFromServer();
    const handleVisibilityChange = () => {
      if (!document.hidden) syncAllFromServer();
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 3. Multi-tab BroadcastChannel for 0ms latency sync across open tabs
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        broadcastChannel = new BroadcastChannel('voiceai_live_sync');
        broadcastChannel.onmessage = () => {
          syncAllFromServer();
        };
      }
    } catch {}

    return () => {
      clearInterval(pollInterval);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (broadcastChannel) broadcastChannel.close();
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('voiceai_knowledge', JSON.stringify(knowledgeDocs));
  }, [knowledgeDocs]);

  useEffect(() => {
    localStorage.setItem('voiceai_phones', JSON.stringify(phoneNumbers));
  }, [phoneNumbers]);

  useEffect(() => {
    localStorage.setItem('voiceai_leads', JSON.stringify(leads));
  }, [leads]);

  useEffect(() => {
    localStorage.setItem('voiceai_calls', JSON.stringify(calls));
  }, [calls]);

  useEffect(() => {
    localStorage.setItem('voiceai_team', JSON.stringify(teamMembers));
  }, [teamMembers]);

  useEffect(() => {
    localStorage.setItem('voiceai_platform_users', JSON.stringify(platformUsers));
  }, [platformUsers]);

  useEffect(() => {
    localStorage.setItem('voiceai_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('voiceai_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('voiceai_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('voiceai_integrations', JSON.stringify(integrations));
  }, [integrations]);

  useEffect(() => {
    localStorage.setItem('voiceai_onboarding', JSON.stringify(onboardingSteps));
  }, [onboardingSteps]);

  // Sync browser url with both history pushState and hash fallback support
  const navigate = (route: string) => {
    setCurrentRoute(route);
    const basePath = getAppBasePath();
    const targetUrl = basePath ? `${basePath}${route.startsWith('/') ? route : '/' + route}` : route;
    try {
      window.history.pushState({}, '', targetUrl);
    } catch {
      window.location.hash = route;
    }
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentRoute(resolveInitialRoute());
    };
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Keyboard shortcut for global search (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsGlobalSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Toast System
  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Activity Log
  const addActivityLog = (logData: Omit<ActivityLog, 'id' | 'time'>) => {
    const newLog: ActivityLog = {
      ...logData,
      id: `log-${Date.now()}`,
      time: 'এখনই'
    };
    setActivityLogs((prev) => [newLog, ...prev]);
  };

  // Auth actions
  const login = (userData: Partial<UserProfile> | string) => {
    let loggedUser: UserProfile;
    if (typeof userData === 'string') {
      loggedUser = {
        name: userData.split('@')[0] || INITIAL_USER.name,
        businessName: 'My Enterprise BD',
        phone: '+880 1712-345678',
        email: userData || INITIAL_USER.email,
        authProvider: 'email',
        plan: 'Business',
        minutesUsed: 140,
        minutesLimit: 1000,
        joinedDate: new Date().toLocaleDateString('en-GB')
      };
    } else {
      loggedUser = {
        name: userData.name || (userData.email ? userData.email.split('@')[0] : 'গ্রাহক'),
        businessName: userData.businessName || 'আমার এন্টারপ্রাইজ',
        phone: userData.phone || '+880 1712-000000',
        email: userData.email || 'user@voiceai.bd',
        avatar: userData.avatar,
        authProvider: userData.authProvider || 'email',
        plan: userData.plan || 'Business',
        minutesUsed: userData.minutesUsed ?? 140,
        minutesLimit: userData.minutesLimit ?? 1000,
        joinedDate: userData.joinedDate || new Date().toLocaleDateString('en-GB')
      };
    }
    const isAdmin = isUserAdmin(loggedUser);
    loggedUser.role = isAdmin ? 'admin' : 'user';
    loggedUser.isAdmin = isAdmin;

    setUser(loggedUser);
    try {
      sessionStorage.setItem('voiceai_session_user', JSON.stringify(loggedUser));
      localStorage.setItem('voiceai_user', JSON.stringify(loggedUser));
    } catch {}

    const providerLabel = loggedUser.authProvider === 'google'
      ? 'Google'
      : loggedUser.authProvider === 'facebook'
      ? 'Facebook'
      : loggedUser.authProvider === 'phone'
      ? 'মোবাইল OTP'
      : 'ইমেইল';

    addToast(
      'লগইন সফল হয়েছে',
      isAdmin
        ? `স্বাগতম প্রধান অ্যাডমিন, ${loggedUser.name}!`
        : `স্বাগতম, ${loggedUser.name}! (${providerLabel})`,
      'success'
    );
    addActivityLog({
      user: loggedUser.name,
      action: `User Logged In (${providerLabel}) - ${isAdmin ? 'Admin' : 'User'}`,
      resource: loggedUser.email || loggedUser.phone,
      category: 'Users',
      status: 'Success'
    });
    navigate('/');
  };

  const signup = (userData: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      name: userData.name || 'নতুন উদ্যোক্তা',
      businessName: userData.businessName || 'আমার কোম্পানি',
      phone: userData.phone || '+880 1700-000000',
      email: userData.email || 'demo@voiceai.bd',
      avatar: userData.avatar,
      authProvider: userData.authProvider || 'email',
      role: isUserAdmin(userData) ? 'admin' : 'user',
      isAdmin: isUserAdmin(userData),
      plan: 'Starter',
      minutesUsed: 0,
      minutesLimit: 100,
      joinedDate: 'আজ'
    };
    setUser(newUser);
    try {
      sessionStorage.setItem('voiceai_session_user', JSON.stringify(newUser));
      localStorage.setItem('voiceai_user', JSON.stringify(newUser));
    } catch {}
    addToast('অ্যাকাউন্ট তৈরি সম্পন্ন!', 'আপনার VoiceAI BD ড্যাশবোর্ডে স্বাগতম।', 'success');
    addActivityLog({
      user: newUser.name,
      action: 'User Signed Up',
      resource: newUser.businessName,
      category: 'Users',
      status: 'Success'
    });
    navigate('/');
  };

  const logout = () => {
    setUser(null);
    try {
      sessionStorage.removeItem('voiceai_session_user');
      localStorage.removeItem('voiceai_user');
    } catch {}
    addToast('লগআউট সফল হয়েছে', 'আবার দেখা হবে!', 'info');
    navigate('/login');
  };

  // Agent Actions
  const addAgent = (agentData: Omit<Agent, 'id' | 'createdAt' | 'totalCalls' | 'totalMinutes' | 'knowledgeBaseCount' | 'status' | 'leads'>): Agent => {
    const tempId = `agent-${Date.now()}`;
    const newAgent: Agent = {
      ...agentData,
      id: tempId,
      createdAt: new Date().toISOString().split('T')[0],
      totalCalls: 0,
      totalMinutes: 0,
      knowledgeBaseCount: knowledgeDocs.length,
      status: 'Active',
      leads: 0,
      versions: [
        {
          version: 1,
          date: 'আজ',
          summary: 'এজেন্টের প্রাথমিক সংস্করণ তৈরি ও মেইন স্টোরেজে সংরক্ষণ',
          changes: ['Agent created in Main Server Storage', `Voice assigned: ${agentData.voiceId}`],
          instructions: agentData.instructions
        }
      ]
    };

    setAgents((prev) => [...prev, newAgent]);

    // Save to Server Main Storage AND sync to Vapi
    createMainStorageAgent(newAgent).then((res) => {
      if (res.success && res.data) {
        setAgents((prev) => prev.map((a) => (a.id === tempId ? { ...a, ...res.data } : a)));
        if (res.vapiCreated) {
          addToast('মেইন স্টোরেজ ও Vapi সিঙ্ক সফল!', `${newAgent.name} সার্ভার স্টোরেজে সংরক্ষিত হয়েছে এবং Vapi Assistant তৈরি হয়েছে।`, 'success');
        } else {
          addToast('মেইন স্টোরেজে সংরক্ষিত!', `${newAgent.name} সার্ভার ডাটাবেজে স্থায়ীভাবে সংরক্ষিত হয়েছে।`, 'success');
        }
      }
    }).catch((err) => {
      console.warn('Error saving to server main storage:', err);
    });

    addActivityLog({
      user: user?.name || 'Admin',
      action: 'Agent Created',
      resource: newAgent.name,
      category: 'Agents',
      status: 'Success'
    });

    if (newAgent.phoneNumberId) {
      setPhoneNumbers((prev) =>
        prev.map((p) =>
          p.id === newAgent.phoneNumberId
            ? { ...p, status: 'Connected', connectedAgentId: newAgent.id, connectedAgentName: newAgent.name }
            : p
        )
      );
    }

    return newAgent;
  };

  const updateAgent = (id: string, updates: Partial<Agent>) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );

    // Save update to Server Main Storage AND sync to Vapi
    updateMainStorageAgent(id, updates).then((res) => {
      if (res.success && res.data) {
        setAgents((prev) => prev.map((a) => (a.id === id ? { ...a, ...res.data } : a)));
        if (res.vapiSynced) {
          addToast('মেইন স্টোরেজ ও Vapi আপডেট সম্পন্ন!', 'ভয়েস নির্দেশিকা সার্ভার ও Vapi-তে রিয়েল-টাইমে আপডেট হয়েছে।', 'success');
        } else {
          addToast('মেইন স্টোরেজে সংরক্ষিত!', 'পরিবর্তনগুলো সার্ভার স্টোরেজে সংরক্ষিত হয়েছে।', 'success');
        }
      }
    }).catch((err) => {
      console.warn('Error syncing update to main storage:', err);
    });

    addActivityLog({
      user: user?.name || 'Admin',
      action: 'Agent Updated',
      resource: `Agent #${id}`,
      category: 'Agents',
      status: 'Success'
    });
  };

  const updateAgentStatus = (id: string, status: AgentStatus) => {
    setAgents((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, isActive: status === 'Active' } : a))
    );
    updateMainStorageAgent(id, { status, isActive: status === 'Active' }).catch(() => {});
    addToast('স্ট্যাটাস পরিবর্তিত হয়েছে', `এজেন্ট স্ট্যাটাস: ${status}`);
  };

  const duplicateAgent = (id: string) => {
    const existing = agents.find((a) => a.id === id);
    if (!existing) return;

    const duplicated: Agent = {
      ...existing,
      id: `agent-${Date.now()}`,
      name: `${existing.name} (Copy)`,
      phoneNumberId: undefined,
      phoneNumber: undefined,
      totalCalls: 0,
      totalMinutes: 0,
      leads: 0,
      status: 'Draft',
      isActive: false,
      createdAt: new Date().toISOString().split('T')[0],
      versions: [
        {
          version: 1,
          date: 'আজ',
          summary: `${existing.name} থেকে ডুপ্লিকেট করা হয়েছে`,
          changes: ['Cloned from original agent', 'Status set to Draft']
        }
      ]
    };

    setAgents((prev) => [...prev, duplicated]);
    addToast('এজেন্ট ডুপ্লিকেট সম্পন্ন', `${duplicated.name} খসড়া হিসেবে তৈরি হয়েছে।`);
  };

  const addAgentVersion = (id: string, summary: string, changes: string[], instructions?: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const currentVersions = a.versions || [];
        const nextVersionNumber = currentVersions.length + 1;
        const newVersion: AgentVersion = {
          version: nextVersionNumber,
          date: 'আজ',
          summary,
          changes,
          instructions: instructions || a.instructions,
          voiceId: a.voiceId,
          phoneNumber: a.phoneNumber
        };
        return {
          ...a,
          versions: [newVersion, ...currentVersions],
          instructions: instructions || a.instructions
        };
      })
    );
    addToast('ভার্সন হিস্ট্রি সংরক্ষিত', `সংস্করণ যোগ করা হয়েছে।`);
  };

  const deleteAgent = (id: string) => {
    const agentToDelete = agents.find((a) => a.id === id);
    setAgents((prev) => prev.filter((a) => a.id !== id));
    deleteMainStorageAgent(id).catch(() => {});
    setPhoneNumbers((prev) =>
      prev.map((p) =>
        p.connectedAgentId === id
          ? { ...p, status: 'Available', connectedAgentId: undefined, connectedAgentName: undefined }
          : p
      )
    );
    addToast('এজেন্ট মুছে ফেলা হয়েছে', `${agentToDelete?.name || ''} মেইন স্টোরেজ থেকে অপসারিত হয়েছে।`, 'info');
  };

  const toggleAgentActive = (id: string) => {
    setAgents((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const newActive = !a.isActive;
          return { ...a, isActive: newActive, status: newActive ? 'Active' : 'Paused' };
        }
        return a;
      })
    );
  };

  // Knowledge docs
  const addKnowledgeDoc = (file: { name: string; size: string; type: 'PDF' | 'DOCX' | 'TXT'; preview: string }) => {
    const newDoc: KnowledgeDocument = {
      id: `doc-${Date.now()}`,
      fileName: file.name,
      size: file.size,
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'Ready',
      type: file.type,
      previewExcerpt: file.preview || 'ফাইলটি সফলভাবে সূচিত হয়েছে।',
      itemCount: Math.floor(Math.random() * 25 + 10)
    };
    setKnowledgeDocs((prev) => [newDoc, ...prev]);
    addToast('নলেজ বেস ফাইল যুক্ত হয়েছে!', file.name);
    addActivityLog({
      user: user?.name || 'Admin',
      action: 'Knowledge Uploaded',
      resource: file.name,
      category: 'Agents',
      status: 'Success'
    });
  };

  const deleteKnowledgeDoc = (id: string) => {
    const doc = knowledgeDocs.find((d) => d.id === id);
    setKnowledgeDocs((prev) => prev.filter((d) => d.id !== id));
    addToast('ফাইল ডিলিট করা হয়েছে', doc?.fileName || '', 'info');
  };

  // Phone numbers
  const addPhoneNumber = (data: { number: string; provider: PhoneNumber['provider']; sipEndpoint?: string }) => {
    const newPhone: PhoneNumber = {
      id: `phone-${Date.now()}`,
      number: data.number,
      provider: data.provider,
      status: 'Available',
      sipEndpoint: data.sipEndpoint || 'sip.telecombd.net:5060',
      country: 'Bangladesh 🇧🇩',
      monthlyFee: 450
    };
    setPhoneNumbers((prev) => [...prev, newPhone]);
    addToast('নতুন ভার্চুয়াল নম্বর যুক্ত হয়েছে!', data.number);
  };

  const connectPhoneToAgent = (phoneId: string, agentId: string) => {
    const agent = agents.find((a) => a.id === agentId);
    const phone = phoneNumbers.find((p) => p.id === phoneId);
    if (!agent || !phone) return;

    setPhoneNumbers((prev) =>
      prev.map((p) =>
        p.id === phoneId
          ? { ...p, status: 'Connected', connectedAgentId: agentId, connectedAgentName: agent.name }
          : p.connectedAgentId === agentId
          ? { ...p, status: 'Available', connectedAgentId: undefined, connectedAgentName: undefined }
          : p
      )
    );

    setAgents((prev) =>
      prev.map((a) =>
        a.id === agentId
          ? { ...a, phoneNumberId: phoneId, phoneNumber: phone.number }
          : a
      )
    );

    addToast('নম্বর সফলভাবে সংযুক্ত হয়েছে!', `${phone.number} -> ${agent.name}`);
  };

  const disconnectPhone = (phoneId: string) => {
    const phone = phoneNumbers.find((p) => p.id === phoneId);
    if (!phone) return;

    if (phone.connectedAgentId) {
      setAgents((prev) =>
        prev.map((a) =>
          a.id === phone.connectedAgentId
            ? { ...a, phoneNumberId: undefined, phoneNumber: undefined }
            : a
        )
      );
    }

    setPhoneNumbers((prev) =>
      prev.map((p) =>
        p.id === phoneId
          ? { ...p, status: 'Available', connectedAgentId: undefined, connectedAgentName: undefined }
          : p
      )
    );

    addToast('নম্বর ডিসকানেক্ট করা হয়েছে', phone.number, 'info');
  };

  // Leads
  const updateLeadStatus = (leadId: string, status: Lead['status']) => {
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status } : l))
    );
    addToast('লিড স্ট্যাটাস আপডেট হয়েছে', `স্ট্যাটাস: ${status}`);
  };

  const addLead = (leadData: Omit<Lead, 'id' | 'date'>) => {
    const newLead: Lead = {
      ...leadData,
      id: `lead-${Date.now()}`,
      score: leadData.score || 88,
      date: 'আজ, এখনই',
      timeline: [
        { step: 'Call Received', time: 'এখনই', description: 'Inbound customer inquiry handled by AI', completed: true },
        { step: 'Lead Extracted', time: 'এখনই', description: 'Contact & interest logged into CRM', completed: true }
      ]
    };
    setLeads((prev) => [newLead, ...prev]);
    addToast('নতুন লিড যুক্ত হয়েছে!', newLead.name);
  };

  const deleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    addToast('লিড সরানো হয়েছে', '', 'info');
  };

  // Calls
  const addCallLog = (callData: Omit<CallLog, 'id' | 'timestamp'>) => {
    const uniqueId = `call-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const newCall: CallLog = {
      ...callData,
      id: uniqueId,
      timestamp: new Date().toISOString()
    };
    setCalls((prev) => {
      if (prev.some((c) => c.id === newCall.id)) {
        return prev;
      }
      return [newCall, ...prev];
    });

    // Update user minutes
    if (user) {
      const minutesSpent = Math.ceil(callData.durationSeconds / 60);
      setUser((prev) => prev ? { ...prev, minutesUsed: prev.minutesUsed + minutesSpent } : prev);
    }
  };

  // Team
  const addTeamMember = (memberData: Omit<TeamMember, 'id' | 'joinedDate'>) => {
    const newMember: TeamMember = {
      ...memberData,
      id: `team-${Date.now()}`,
      joinedDate: 'আজ'
    };
    setTeamMembers((prev) => [...prev, newMember]);
    addToast('টিম মেম্বার আমন্ত্রিত হয়েছে (Simulated)', `${newMember.name} কে ${newMember.role} হিসেবে যোগ করা হয়েছে।`);
  };

  const updateTeamMember = (id: string, updates: Partial<TeamMember>) => {
    setTeamMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    addToast('টিম মেম্বার আপডেট সম্পন্ন', 'তথ্য সংরক্ষিত হয়েছে।');
  };

  const removeTeamMember = (id: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    addToast('টিম মেম্বার সরানো হয়েছে', '', 'info');
  };

  // Super Admin Platform Users
  const updatePlatformUserStatus = (userId: string, status: PlatformUser['status']) => {
    setPlatformUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    addToast('ইউজার স্ট্যাটাস পরিবর্তিত হয়েছে', `Status: ${status}`);
    addActivityLog({
      user: 'Super Admin',
      action: `User ${status}`,
      resource: `User #${userId}`,
      category: 'Users',
      status: status === 'Suspended' ? 'Warning' : 'Success'
    });
  };

  const updatePlatformUserPlan = (userId: string, plan: PlatformUser['plan']) => {
    setPlatformUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, plan } : u))
    );
    addToast('প্ল্যান পরিবর্তন সফল', `Plan updated to ${plan}`);
  };

  const deletePlatformUser = (userId: string) => {
    setPlatformUsers((prev) => prev.filter((u) => u.id !== userId));
    addToast('ইউজার অ্যাকাউন্ট ডিলিট সম্পন্ন', '', 'info');
  };

  // Invoices & Billing
  const cancelSubscription = () => {
    if (user) {
      setUser({ ...user, plan: 'Starter' });
    }
    addToast('সাবস্ক্রিপশন বাতিল করা হয়েছে (Demo)', 'বর্তমান বিলিং সাইকেল শেষে প্ল্যান ফ্রি টায়ারে নামিয়ে দেওয়া হবে।', 'info');
  };

  const changePlan = (plan: PricingPlan) => {
    if (!user) return;
    const updatedUser: UserProfile = {
      ...user,
      plan: plan.name as 'Starter' | 'Business' | 'Pro',
      minutesLimit: plan.minutesLimit
    };
    setUser(updatedUser);

    const newInvoice: Invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: 'আজ',
      plan: `${plan.name} Plan (Monthly)`,
      amount: plan.priceLabel.split(' ')[0],
      status: 'Paid',
      method: 'bKash (Simulated Auto-Debit)'
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    addToast('প্ল্যান পরিবর্তন সম্পন্ন!', `আপনার নতুন প্ল্যান: ${plan.name}`);
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('সব নোটিফিকেশন পঠিত হিসেবে চিহ্নিত', '', 'info');
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Integrations
  const toggleIntegrationStatus = (id: string, status: IntegrationItem['status']) => {
    setIntegrations((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status } : i))
    );
    addToast('ইন্টিগ্রেশন স্ট্যাটাস পরিবর্তিত', `Status: ${status}`);
  };

  const updateIntegrationConfig = (id: string, key: string, value: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        return {
          ...item,
          configFields: item.configFields.map((f) => (f.key === key ? { ...f, value } : f))
        };
      })
    );
    addToast('ইন্টিগ্রেশন কনফিগ সংরক্ষিত', 'সেটিংস আপডেট হয়েছে।');
  };

  // Onboarding
  const toggleOnboardingStep = (id: number) => {
    setOnboardingSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, completed: !s.completed } : s))
    );
  };

  const setDismissOnboarding = (dismiss: boolean) => {
    setDismissOnboardingState(dismiss);
    localStorage.setItem('voiceai_onboarding_dismissed', dismiss ? 'true' : 'false');
  };

  // Call simulator
  const openCallSimulator = (agent?: Agent, callerNumber?: string) => {
    if (agent) {
      setActiveTestAgent(agent);
    } else if (!activeTestAgent && agents.length > 0) {
      setActiveTestAgent(agents[0]);
    }
    setIsCallSimulatorOpen(true);
  };

  const closeCallSimulator = () => {
    setIsCallSimulatorOpen(false);
  };

  // Checkout
  const openCheckout = (plan: PricingPlan) => {
    setCheckoutPlan(plan);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  const completePayment = (paymentMethod: string, transactionId: string) => {
    if (!checkoutPlan || !user) return;
    const planName = checkoutPlan.name as 'Starter' | 'Business' | 'Pro';

    setUser({
      ...user,
      plan: planName,
      minutesLimit: checkoutPlan.minutesLimit
    });

    const newInvoice: Invoice = {
      id: `INV-${Date.now().toString().slice(-6)}`,
      date: 'আজ',
      plan: `${checkoutPlan.name} Plan`,
      amount: checkoutPlan.priceLabel.split(' ')[0],
      status: 'Paid',
      method: `${paymentMethod} (Trx: ${transactionId})`
    };
    setInvoices((prev) => [newInvoice, ...prev]);

    setIsCheckoutOpen(false);
    addToast('পেমেন্ট ও সাবস্ক্রিপশন সম্পন্ন', `আপনার একাউন্ট ${planName} প্ল্যানে উন্নীত হয়েছে। Trx ID: ${transactionId}`);
  };

  // Billing Transactions Management
  const refreshTransactions = async () => {
    try {
      const res = await fetchTransactions();
      if (res.success && Array.isArray(res.data)) {
        setTransactions(res.data);
      }
    } catch (e) {
      console.warn('Failed to refresh transactions', e);
    }
  };

  const updateBillingConfig = async (config: Partial<PaymentGatewayConfig>): Promise<boolean> => {
    try {
      const res = await saveBillingConfigApi(config);
      if (res.success && res.data) {
        setBillingConfig(res.data);
        addToast('পেমেন্ট সেটিংস সংরক্ষিত!', 'বিকাশ ও নগদ গেটওয়ে সফলভাবে আপডেট হয়েছে।', 'success');
        try {
          if (typeof BroadcastChannel !== 'undefined') {
            const bc = new BroadcastChannel('voiceai_live_sync');
            bc.postMessage({ type: 'BILLING_UPDATED' });
            bc.close();
          }
        } catch {}
        return true;
      }
      addToast('সেটিংস সংরক্ষণে ত্রুটি', res.error || 'অনুগ্রহ করে পুনরায় চেষ্টা করুন।', 'error');
      return false;
    } catch (err: any) {
      addToast('ব্যর্থ', err?.message || 'সার্ভার রেসপন্স দেয়নি।', 'error');
      return false;
    }
  };

  const submitBillingTransaction = async (data: {
    paymentMethod: 'bKash' | 'Nagad' | 'Bank' | 'Card';
    senderNumber: string;
    transactionId: string;
    notes?: string;
  }): Promise<boolean> => {
    if (!checkoutPlan || !user) return false;

    try {
      const payload = {
        customerName: user.name,
        customerEmail: user.email,
        customerPhone: data.senderNumber,
        planId: checkoutPlan.id,
        planName: `${checkoutPlan.name} Plan (${checkoutPlan.minutesLimit} AI Mins)`,
        amount: checkoutPlan.price,
        paymentMethod: data.paymentMethod,
        senderNumber: data.senderNumber,
        transactionId: data.transactionId,
        notes: data.notes
      };

      const res = await submitTransactionApi(payload);
      if (res.success && res.data) {
        setTransactions((prev) => [res.data, ...prev]);

        // Add to customer's invoices as Pending
        const newInvoice: Invoice = {
          id: res.data.id || `INV-${Date.now().toString().slice(-6)}`,
          date: 'আজ',
          plan: `${checkoutPlan.name} Plan`,
          amount: checkoutPlan.priceLabel.split(' ')[0],
          status: 'Pending',
          method: `${data.paymentMethod} (Trx: ${data.transactionId})`
        };
        setInvoices((prev) => [newInvoice, ...prev]);

        setIsCheckoutOpen(false);
        addToast(
          'পেমেন্ট সাবমিট সফল!',
          `TrxID #${data.transactionId} সফলভাবে জমা হয়েছে। অ্যাডমিন ভেরিফাই করে অনুমোদন করবে।`,
          'success'
        );
        return true;
      } else {
        addToast('পেমেন্ট জমাদানে ত্রুটি', res.error || 'TrxID ও মোবাইল নম্বর সঠিক কিনা যাচাই করুন।', 'error');
        return false;
      }
    } catch (err: any) {
      addToast('ব্যর্থ', err?.message || 'পেমেন্ট সাবমিট করা যায়নি।', 'error');
      return false;
    }
  };

  const approveTransaction = async (id: string): Promise<boolean> => {
    try {
      const res = await updateTransactionStatusApi(id, 'APPROVED', user?.name || 'Admin');
      if (res.success && res.data) {
        setTransactions((prev) => prev.map((t) => (t.id === id ? res.data : t)));

        const txn: BillingTransaction = res.data;
        // Update user limits if it belongs to current customer
        if (user) {
          let newLimit = user.minutesLimit;
          let newPlan: 'Starter' | 'Business' | 'Pro' = user.plan;
          if (txn.planId?.startsWith('topup-')) {
            const addedMins = parseInt(txn.planId.replace('topup-', ''), 10) || 50;
            newLimit += addedMins;
          } else if (txn.planId === 'starter' || txn.amount <= 1999) {
            newLimit = Math.max(newLimit, 100);
            newPlan = 'Starter';
          } else if (txn.planId === 'business' || txn.amount <= 4999) {
            newLimit = Math.max(newLimit, 1000);
            newPlan = 'Business';
          } else if (txn.planId === 'pro' || txn.amount >= 5000) {
            newLimit = Math.max(newLimit, 3000);
            newPlan = 'Pro';
          }
          setUser({
            ...user,
            plan: newPlan,
            minutesLimit: newLimit
          });
        }

        // Update corresponding invoice status to Paid
        setInvoices((prev) =>
          prev.map((inv) => (inv.method.includes(txn.transactionId) ? { ...inv, status: 'Paid' } : inv))
        );

        addToast(
          'পেমেন্ট অনুমোদিত (Approved)!',
          `TrxID #${txn.transactionId} অনুমোদিত হয়েছে এবং প্ল্যান কার্যকর করা হয়েছে।`,
          'success'
        );
        return true;
      }
      return false;
    } catch (err: any) {
      addToast('ব্যর্থ', err?.message || 'অনুমোদন ব্যর্থ হয়েছে।', 'error');
      return false;
    }
  };

  const rejectTransaction = async (id: string, reason?: string): Promise<boolean> => {
    try {
      const res = await updateTransactionStatusApi(id, 'REJECTED', user?.name || 'Admin', reason || 'অকার্যকর TrxID');
      if (res.success && res.data) {
        setTransactions((prev) => prev.map((t) => (t.id === id ? res.data : t)));
        addToast('পেমেন্ট বাতিল (Rejected)', `TrxID #${res.data.transactionId} বাতিল করা হয়েছে।`, 'warning');
        return true;
      }
      return false;
    } catch (err: any) {
      addToast('ব্যর্থ', err?.message || 'বাতিলকরণ ব্যর্থ হয়েছে।', 'error');
      return false;
    }
  };

  // Admin Security Unlock / Lock
  const unlockAdmin = (role: 'admin' | 'superadmin', token: string) => {
    if (role === 'superadmin') {
      setIsSuperAdminUnlocked(true);
      setIsAdminUnlocked(true);
      sessionStorage.setItem('voiceai_superadmin_unlocked', 'true');
      sessionStorage.setItem('voiceai_admin_unlocked', 'true');
      sessionStorage.setItem('voiceai_admin_token', token);
    } else {
      setIsAdminUnlocked(true);
      sessionStorage.setItem('voiceai_admin_unlocked', 'true');
      sessionStorage.setItem('voiceai_admin_token', token);
    }
    addToast('অ্যাডমিন এক্সেস অনুমোদিত', 'স্বাগতম অ্যাডমিন সেন্টারে।', 'success');
  };

  const lockAdmin = (role: 'admin' | 'superadmin' | 'all' = 'all') => {
    if (role === 'superadmin') {
      setIsSuperAdminUnlocked(false);
      sessionStorage.removeItem('voiceai_superadmin_unlocked');
    } else if (role === 'admin') {
      setIsAdminUnlocked(false);
      sessionStorage.removeItem('voiceai_admin_unlocked');
    } else {
      setIsAdminUnlocked(false);
      setIsSuperAdminUnlocked(false);
      sessionStorage.removeItem('voiceai_admin_unlocked');
      sessionStorage.removeItem('voiceai_superadmin_unlocked');
      sessionStorage.removeItem('voiceai_admin_token');
    }
    addToast('অ্যাডমিন প্যানেল লক করা হয়েছে', 'নিরাপত্তার সুবিধার্থে অ্যাডমিন সেশন বন্ধ করা হয়েছে।', 'info');
  };

  // Global modals
  const openDemoModeModal = () => setIsDemoModeModalOpen(true);
  const closeDemoModeModal = () => setIsDemoModeModalOpen(false);

  const openGlobalSearch = () => setIsGlobalSearchOpen(true);
  const closeGlobalSearch = () => setIsGlobalSearchOpen(false);

  const openConfirmDialog = (dialog: Omit<ConfirmDialogState, 'isOpen'>) => {
    setConfirmDialog({ ...dialog, isOpen: true });
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigate,
        user,
        login,
        signup,
        logout,
        agents,
        addAgent,
        updateAgent,
        deleteAgent,
        toggleAgentActive,
        duplicateAgent,
        updateAgentStatus,
        addAgentVersion,
        knowledgeDocs,
        addKnowledgeDoc,
        deleteKnowledgeDoc,
        phoneNumbers,
        addPhoneNumber,
        connectPhoneToAgent,
        disconnectPhone,
        leads,
        updateLeadStatus,
        addLead,
        deleteLead,
        calls,
        addCallLog,
        teamMembers,
        addTeamMember,
        updateTeamMember,
        removeTeamMember,
        platformUsers,
        updatePlatformUserStatus,
        updatePlatformUserPlan,
        deletePlatformUser,
        invoices,
        cancelSubscription,
        changePlan,
        billingConfig,
        updateBillingConfig,
        transactions,
        submitBillingTransaction,
        approveTransaction,
        rejectTransaction,
        refreshTransactions,
        isAdminUnlocked,
        isSuperAdminUnlocked,
        unlockAdmin,
        lockAdmin,
        activityLogs,
        addActivityLog,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        integrations,
        toggleIntegrationStatus,
        updateIntegrationConfig,
        onboardingSteps,
        toggleOnboardingStep,
        dismissOnboarding,
        setDismissOnboarding,
        activeTestAgent,
        setActiveTestAgent,
        isCallSimulatorOpen,
        openCallSimulator,
        closeCallSimulator,
        isCheckoutOpen,
        checkoutPlan,
        openCheckout,
        closeCheckout,
        completePayment,
        isDemoModeModalOpen,
        openDemoModeModal,
        closeDemoModeModal,
        isGlobalSearchOpen,
        openGlobalSearch,
        closeGlobalSearch,
        confirmDialog,
        openConfirmDialog,
        closeConfirmDialog,
        websiteSettings,
        updateWebsiteSettings,
        toasts,
        addToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
