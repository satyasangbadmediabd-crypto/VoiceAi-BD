import fs from 'fs';
import path from 'path';

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

const DATA_DIR = path.join(process.cwd(), 'server', 'data');
const TRANSACTIONS_FILE = path.join(DATA_DIR, 'transactions.json');
const BILLING_CONFIG_FILE = path.join(DATA_DIR, 'billingConfig.json');

const DEFAULT_CONFIG: PaymentGatewayConfig = {
  bkashNumber: '01712-345678',
  bkashType: 'Personal (Send Money)',
  bkashInstructions: 'আপনার বিকাশ অ্যাপ থেকে Send Money অপশনে গিয়ে উপরে উল্লেখিত নম্বরে নির্ধারিত ফি প্রদান করুন। রেফারেন্স হিসেবে আপনার নাম বা মোবাইল নম্বর লিখুন এবং প্রাপ্ত TrxID নিচে প্রদান করুন।',
  nagadNumber: '01819-987654',
  nagadType: 'Personal (Send Money)',
  nagadInstructions: 'নগদ অ্যাপ অথবা *167# ডায়াল করে Send Money করুন এবং নিশ্চিতকরণের পর TrxID সাবমিট করুন।',
  bankDetails: 'BRAC Bank PLC, Account: VoiceAI BD Technologies Ltd, A/C No: 1501204892019, Gulshan Branch, Dhaka',
  supportPhone: '+880 1712-345678',
  telegramEnabled: true,
  telegramBotToken: '8748748722:AAEgi1XF_FxVL5QcvpWaSZ_XqWhLpYzUhgc',
  telegramChatId: '6379145125',
  whatsappEnabled: true,
  whatsappNumber: '+880 1712-345678',
  whatsappWebhookUrl: '',
  whatsappApiKey: ''
};

const INITIAL_TRANSACTIONS: BillingTransaction[] = [
  {
    id: 'TXN-90412',
    customerName: 'তানভীর আহমেদ',
    customerEmail: 'tanvir.ahmed@dhakatech.com',
    customerPhone: '01711-223344',
    planId: 'business',
    planName: 'Business Plan (1,000 AI Mins)',
    amount: 4999,
    paymentMethod: 'bKash',
    senderNumber: '01711-223344',
    transactionId: 'BK9A7X21MN',
    status: 'APPROVED',
    notes: 'Dhaka Call Center expansion',
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 35 * 3600 * 1000).toISOString(),
    verifiedBy: 'Super Admin'
  },
  {
    id: 'TXN-90413',
    customerName: 'সাদিয়া ইসলাম',
    customerEmail: 'sadia@fashionbd.store',
    customerPhone: '01844-556677',
    planId: 'starter',
    planName: 'Starter Plan (100 AI Mins)',
    amount: 1999,
    paymentMethod: 'bKash',
    senderNumber: '01844-556677',
    transactionId: 'BK8B5Q99LP',
    status: 'PENDING',
    notes: 'E-commerce Facebook page voice receptionist',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'TXN-90414',
    customerName: 'ইমরান হোসেন চৌধুরী',
    customerEmail: 'imran@sylhetagro.net',
    customerPhone: '01912-887766',
    planId: 'pro',
    planName: 'Pro Enterprise Plan (3,000 AI Mins)',
    amount: 9999,
    paymentMethod: 'Nagad',
    senderNumber: '01912-887766',
    transactionId: 'NG6K3W44RT',
    status: 'APPROVED',
    notes: 'Customer support hotline deployment',
    createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
    verifiedAt: new Date(Date.now() - 13 * 3600 * 1000).toISOString(),
    verifiedBy: 'Finance Admin'
  },
  {
    id: 'TXN-90415',
    customerName: 'মোহাম্মদ রফিক',
    customerEmail: 'rafiq@ctglogistics.com',
    customerPhone: '01622-334455',
    planId: 'business',
    planName: 'Business Plan (1,000 AI Mins)',
    amount: 4999,
    paymentMethod: 'bKash',
    senderNumber: '01622-334455',
    transactionId: 'BK2L9M88VK',
    status: 'PENDING',
    notes: 'Parcel delivery tracking assistant',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
];

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function loadBillingConfig(): PaymentGatewayConfig {
  ensureDataDir();
  try {
    if (fs.existsSync(BILLING_CONFIG_FILE)) {
      const data = fs.readFileSync(BILLING_CONFIG_FILE, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
    fs.writeFileSync(BILLING_CONFIG_FILE, JSON.stringify(DEFAULT_CONFIG, null, 2), 'utf-8');
    return DEFAULT_CONFIG;
  } catch (err) {
    console.error('Error loading billing config:', err);
    return DEFAULT_CONFIG;
  }
}

export function saveBillingConfig(config: Partial<PaymentGatewayConfig>): PaymentGatewayConfig {
  ensureDataDir();
  const current = loadBillingConfig();
  const updated = { ...current, ...config };
  fs.writeFileSync(BILLING_CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

export function loadTransactions(): BillingTransaction[] {
  ensureDataDir();
  try {
    if (fs.existsSync(TRANSACTIONS_FILE)) {
      const data = fs.readFileSync(TRANSACTIONS_FILE, 'utf-8');
      return JSON.parse(data);
    }
    fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(INITIAL_TRANSACTIONS, null, 2), 'utf-8');
    return INITIAL_TRANSACTIONS;
  } catch (err) {
    console.error('Error loading transactions:', err);
    return INITIAL_TRANSACTIONS;
  }
}

export function createTransaction(data: Omit<BillingTransaction, 'id' | 'createdAt' | 'status'> & { status?: BillingTransaction['status'] }): BillingTransaction {
  ensureDataDir();
  const transactions = loadTransactions();
  const newTxn: BillingTransaction = {
    ...data,
    id: `TXN-${Math.floor(10000 + Math.random() * 90000)}`,
    status: data.status || 'PENDING',
    createdAt: new Date().toISOString()
  };
  transactions.unshift(newTxn);
  fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2), 'utf-8');
  return newTxn;
}

export function updateTransactionStatus(
  id: string,
  status: 'PENDING' | 'APPROVED' | 'REJECTED',
  verifiedBy: string = 'Super Admin',
  rejectionReason?: string
): BillingTransaction | null {
  ensureDataDir();
  const transactions = loadTransactions();
  const index = transactions.findIndex((t) => t.id === id);
  if (index === -1) return null;

  transactions[index] = {
    ...transactions[index],
    status,
    verifiedAt: new Date().toISOString(),
    verifiedBy,
    rejectionReason: status === 'REJECTED' ? rejectionReason : undefined
  };

  fs.writeFileSync(TRANSACTIONS_FILE, JSON.stringify(transactions, null, 2), 'utf-8');
  return transactions[index];
}
