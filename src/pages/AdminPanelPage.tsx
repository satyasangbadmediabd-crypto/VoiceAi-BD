import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Shield,
  Bot,
  Phone,
  BookOpen,
  PhoneCall,
  Users,
  BarChart3,
  CreditCard,
  UserCheck,
  Cpu,
  Settings,
  ChevronRight,
  Sparkles,
  ExternalLink,
  Plus,
  Flame,
  CheckCircle2,
  AlertCircle,
  Lock,
  Unlock,
  KeyRound,
  Check,
  X,
  Search,
  Filter,
  DollarSign,
  Smartphone,
  Save,
  Clock,
  Eye,
  EyeOff,
  Globe,
  Send,
  MessageSquare,
  Bell
} from 'lucide-react';
import { AdminSecurityGate } from '../components/AdminSecurityGate';
import { AdminAccessDenied } from '../components/AdminAccessDenied';
import { isUserAdmin } from '../utils/adminAuth';
import { WebsiteCmsEditor } from '../components/WebsiteCmsEditor';
import {
  changeAdminPasswordApi,
  testTelegramNotificationApi,
  testWhatsAppNotificationApi
} from '../services/apiService';
import { BillingTransaction } from '../types';

export const AdminPanelPage: React.FC = () => {
  const {
    user,
    agents,
    phoneNumbers,
    knowledgeDocs,
    calls,
    leads,
    teamMembers,
    isAdminUnlocked,
    lockAdmin,
    billingConfig,
    updateBillingConfig,
    transactions,
    approveTransaction,
    rejectTransaction,
    refreshTransactions,
    addToast,
    navigate
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'agents' | 'phones' | 'knowledge' | 'calls' | 'leads' | 'team' | 'billing' | 'security' | 'integrations' | 'website'
  >('overview');

  // Billing Filters
  const [txnSearch, setTxnSearch] = useState('');
  const [txnStatusFilter, setTxnStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

  // Edit MFS gateway numbers
  const [isEditingGateway, setIsEditingGateway] = useState(false);
  const [editBkashNumber, setEditBkashNumber] = useState(billingConfig.bkashNumber || '01712-345678');
  const [editBkashType, setEditBkashType] = useState(billingConfig.bkashType || 'Personal (Send Money)');
  const [editNagadNumber, setEditNagadNumber] = useState(billingConfig.nagadNumber || '01819-987654');
  const [editBkashInstructions, setEditBkashInstructions] = useState(billingConfig.bkashInstructions || '');

  // Telegram & WhatsApp notification states
  const [telegramEnabled, setTelegramEnabled] = useState(billingConfig.telegramEnabled ?? false);
  const [telegramBotToken, setTelegramBotToken] = useState(billingConfig.telegramBotToken || '');
  const [telegramChatId, setTelegramChatId] = useState(billingConfig.telegramChatId || '');

  const [whatsappEnabled, setWhatsappEnabled] = useState(billingConfig.whatsappEnabled ?? true);
  const [whatsappNumber, setWhatsappNumber] = useState(billingConfig.whatsappNumber || '+880 1712-345678');
  const [whatsappWebhookUrl, setWhatsappWebhookUrl] = useState(billingConfig.whatsappWebhookUrl || '');

  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [isChangingPass, setIsChangingPass] = useState(false);

  // Access Control: Only the primary admin (satyasangbad.media.bd@gmail.com) can access
  if (!isUserAdmin(user)) {
    return <AdminAccessDenied />;
  }

  // Security gate check: Require password if locked
  if (!isAdminUnlocked) {
    return <AdminSecurityGate role="admin" title="কাস্টমার অ্যাডমিন সিকিউরিটি গেট" />;
  }

  const handleSaveGateway = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await updateBillingConfig({
      bkashNumber: editBkashNumber.trim(),
      bkashType: editBkashType as any,
      nagadNumber: editNagadNumber.trim(),
      bkashInstructions: editBkashInstructions.trim()
    });
    if (success) {
      setIsEditingGateway(false);
    }
  };

  const handleTestTelegram = async () => {
    if (!telegramBotToken.trim() || !telegramChatId.trim()) {
      addToast('সতর্কতা', 'অনুগ্রহ করে Telegram Bot Token এবং Chat ID লিখুন।', 'warning');
      return;
    }
    setIsTestingTelegram(true);
    const res = await testTelegramNotificationApi(telegramBotToken.trim(), telegramChatId.trim());
    setIsTestingTelegram(false);
    if (res.success) {
      addToast('টেলিগ্রাম টেস্ট সফল!', res.message || 'বটে নোটিফিকেশন পৌঁছেছে।', 'success');
    } else {
      addToast('টেলিগ্রাম টেস্ট ব্যর্থ', res.error || 'Bot Token বা Chat ID সঠিক কিনা চেক করুন।', 'error');
    }
  };

  const handleTestWhatsApp = async () => {
    setIsTestingWhatsApp(true);
    const res = await testWhatsAppNotificationApi(
      whatsappNumber.trim(),
      whatsappWebhookUrl.trim(),
      billingConfig.whatsappApiKey
    );
    setIsTestingWhatsApp(false);
    if (res.success) {
      addToast('WhatsApp কানেকশন সফল!', res.message || 'হোয়াটসঅ্যাপ টেস্ট প্রস্তুত।', 'success');
      if (res.directWaLink) {
        window.open(res.directWaLink, '_blank');
      }
    } else {
      addToast('WhatsApp টেস্ট ব্যর্থ', res.error || 'নম্বর বা কনফিগারেশন চেক করুন।', 'error');
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingNotifications(true);
    const ok = await updateBillingConfig({
      telegramEnabled,
      telegramBotToken: telegramBotToken.trim(),
      telegramChatId: telegramChatId.trim(),
      whatsappEnabled,
      whatsappNumber: whatsappNumber.trim(),
      whatsappWebhookUrl: whatsappWebhookUrl.trim()
    });
    setIsSavingNotifications(false);
    if (ok) {
      addToast('নোটিফিকেশন সেটিংস সংরক্ষিত!', 'টেলিগ্রাম ও হোয়াটসঅ্যাপ নোটিফিকেশন সক্রিয় করা হয়েছে।', 'success');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      addToast('সতর্কতা', 'অনুগ্রহ করে বর্তমান পাসওয়ার্ড দিন।', 'warning');
      return;
    }
    if (newPassword.length < 6) {
      addToast('সতর্কতা', 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।', 'warning');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToast('সতর্কতা', 'নতুন পাসওয়ার্ড দুটি মিলছে না।', 'warning');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await changeAdminPasswordApi('admin', currentPassword, newPassword);
      if (res.success) {
        addToast('পাসওয়ার্ড পরিবর্তিত হয়েছে!', 'আপনার নতুন অ্যাডমিন পাসওয়ার্ড সক্রিয় করা হয়েছে।', 'success');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        addToast('ত্রুটি', res.message || 'বর্তমান পাসওয়ার্ড ভুল।', 'error');
      }
    } catch (err: any) {
      addToast('ব্যর্থ', 'পাসওয়ার্ড আপডেট করা যায়নি।', 'error');
    } finally {
      setIsChangingPass(false);
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchSearch =
      t.transactionId.toLowerCase().includes(txnSearch.toLowerCase()) ||
      t.customerName.toLowerCase().includes(txnSearch.toLowerCase()) ||
      t.senderNumber.includes(txnSearch) ||
      t.planName.toLowerCase().includes(txnSearch.toLowerCase());
    const matchStatus = txnStatusFilter === 'ALL' || t.status === txnStatusFilter;
    return matchSearch && matchStatus;
  });

  const pendingTxnCount = transactions.filter((t) => t.status === 'PENDING').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Customer Administration distinction */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-950/70 via-[#0d1424] to-purple-950/50 border border-indigo-800/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-900/80 border border-indigo-700 text-indigo-300 text-[10px] font-black uppercase tracking-wider">
              Customer Admin Portal
            </span>
            <span className="text-xs text-slate-400">
              Tenant: <strong className="text-white">{user?.businessName || 'AI Skill Hub BD'}</strong>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-800 flex items-center gap-1 font-semibold">
              <Shield className="w-3 h-3" /> পাসওয়ার্ড সুরক্ষিত
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            কাস্টমার অ্যাডমিনিস্ট্রেশন সেন্টার
          </h2>
          <p className="text-xs text-slate-400">
            আপনার প্রতিষ্ঠানের সমস্ত AI Voice Agent, ফোন নম্বর, লিড, পেমেন্ট ট্রানজেকশন অনুমোদন ও সিকিউরিটি এখান থেকে পরিচালনা করুন।
          </p>
        </div>

        {/* Lock Admin & Switch to Super Admin */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => lockAdmin('admin')}
            className="px-3.5 py-2 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow"
            title="প্যানেল লক করুন"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>লক করুন (Lock)</span>
          </button>

          <button
            onClick={() => navigate('/super-admin')}
            className="px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-lg"
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>সুপার অ্যাডমিন ভিউ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2 overflow-x-auto text-xs">
        {[
          { id: 'overview', label: 'Overview', icon: Shield },
          { id: 'billing', label: `পেমেন্ট ও অনুমোদন (${pendingTxnCount > 0 ? `${pendingTxnCount} Pending` : 'Billing'})`, icon: CreditCard, highlight: pendingTxnCount > 0 },
          { id: 'agents', label: `Agents (${agents.length})`, icon: Bot },
          { id: 'phones', label: `Phones (${phoneNumbers.length})`, icon: Phone },
          { id: 'knowledge', label: `Knowledge (${knowledgeDocs.length})`, icon: BookOpen },
          { id: 'calls', label: `Calls (${calls.length})`, icon: PhoneCall },
          { id: 'leads', label: `Leads (${leads.length})`, icon: Users },
          { id: 'team', label: `Team (${teamMembers.length})`, icon: UserCheck },
          { id: 'security', label: 'পাসওয়ার্ড ও নিরাপত্তা', icon: KeyRound },
          { id: 'integrations', label: 'Integrations & API', icon: Cpu },
          { id: 'website', label: '🌐 ওয়েবসাইট A-to-Z সেটিংস (CMS & API)', icon: Globe }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : tab.highlight
                  ? 'bg-amber-950/60 text-amber-300 border border-amber-800 hover:bg-amber-900'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* SUB-TAB: BILLING & TRANSACTIONS APPROVAL */}
      {activeSubTab === 'billing' && (
        <div className="space-y-6">
          {/* MFS Configuration Card */}
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-pink-400" />
                  <span>অফিশিয়াল bKash ও Nagad পেমেন্ট রিসিভার সেটিংস</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  যে বিকাশ বা নগদ নম্বরে আপনার কাস্টমাররা টাকা পাঠাবে তা এখান থেকে কনফিগার করুন।
                </p>
              </div>

              {!isEditingGateway ? (
                <button
                  onClick={() => setIsEditingGateway(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                >
                  গেটওয়ে নম্বর পরিবর্তন করুন
                </button>
              ) : null}
            </div>

            {isEditingGateway ? (
              <form onSubmit={handleSaveGateway} className="space-y-3 pt-2 border-t border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">বিকাশ রিসিভার নম্বর:</label>
                    <input
                      type="text"
                      value={editBkashNumber}
                      onChange={(e) => setEditBkashNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">অ্যাকাউন্টের ধরন:</label>
                    <select
                      value={editBkashType}
                      onChange={(e) => setEditBkashType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    >
                      <option value="Personal (Send Money)">Personal (Send Money)</option>
                      <option value="Merchant (Payment)">Merchant (Payment)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">নগদ রিসিভার নম্বর:</label>
                    <input
                      type="text"
                      value={editNagadNumber}
                      onChange={(e) => setEditNagadNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">কাস্টমার পেমেন্ট নির্দেশিকা:</label>
                    <input
                      type="text"
                      value={editBkashInstructions}
                      onChange={(e) => setEditBkashInstructions(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>সেটিংস সেভ করুন</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingGateway(false)}
                    className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    বাতিল
                  </button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400">বর্তমান বিকাশ নম্বর:</span>
                  <p className="text-base font-black text-pink-400 font-mono mt-0.5">{billingConfig.bkashNumber}</p>
                  <span className="text-[10px] text-slate-500">{billingConfig.bkashType}</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400">বর্তমান নগদ নম্বর:</span>
                  <p className="text-base font-black text-orange-400 font-mono mt-0.5">{billingConfig.nagadNumber}</p>
                  <span className="text-[10px] text-slate-500">Send Money</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400">হেল্পলাইন / সাপোর্ট:</span>
                  <p className="text-sm font-bold text-white font-mono mt-0.5">{billingConfig.supportPhone}</p>
                  <span className="text-[10px] text-slate-500">24/7 Finance Hotline</span>
                </div>
              </div>
            )}
          </div>

          {/* TELEGRAM & WHATSAPP INSTANT PAYMENT NOTIFICATIONS */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-[#0c1424] to-indigo-950/40 border border-slate-800 space-y-6 text-xs shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span>প্যাকেজ ক্রয়ের সাথে সাথে Telegram ও WhatsApp-এ সরাসরি মেসেজ অ্যালার্ট</span>
                </h3>
                <p className="text-slate-400 mt-1 leading-relaxed">
                  কেউ বিকাশ/নগদে প্যাকেজ কেনার রিকোয়েস্ট সাবমিট করলেই তার কাস্টমার নাম, মোবাইল নম্বর, প্যাকেজ, ফি ও TrxID সহ তাৎক্ষণিক মেসেজ আপনার টেলিগ্রাম ও হোয়াটসঅ্যাপে পৌঁছে যাবে।
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1.5 ${
                  telegramEnabled || whatsappEnabled
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${telegramEnabled || whatsappEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                  {telegramEnabled || whatsappEnabled ? 'নোটিফিকেশন সক্রিয়' : 'নিষ্ক্রিয়'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveNotifications} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Telegram Bot Integration Card */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
                        <Send className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">Telegram Bot অ্যালার্ট</h4>
                        <p className="text-[10px] text-slate-400">টেলিগ্রাম বট দিয়ে তাৎক্ষণিক অ্যালার্ট গ্রহণ করুন (১০০% ফ্রি)</p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={telegramEnabled}
                        onChange={(e) => setTelegramEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
                    </label>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Telegram Bot Token:
                      </label>
                      <input
                        type="text"
                        value={telegramBotToken}
                        onChange={(e) => setTelegramBotToken(e.target.value)}
                        placeholder="যেমন: 8123456789:AAHq_bXj9Q2m..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-[11px] placeholder-slate-600 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        Telegram Admin Chat ID:
                      </label>
                      <input
                        type="text"
                        value={telegramChatId}
                        onChange={(e) => setTelegramChatId(e.target.value)}
                        placeholder="যেমন: 123456789 (ব্যক্তিগত বা গ্রুপের Chat ID)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-[11px] placeholder-slate-600 focus:outline-none focus:border-sky-500"
                      />
                    </div>

                    {/* How to setup Telegram Bot Quick Guide */}
                    <div className="p-2.5 rounded-lg bg-sky-950/30 border border-sky-900/40 text-[10px] text-sky-200/90 space-y-1">
                      <p className="font-bold text-sky-300">💡 ৩ ধাপে টেলিগ্রাম বট তৈরি করুন:</p>
                      <p>১. টেলিগ্রামে <strong>@BotFather</strong>-এ গিয়ে <code>/newbot</code> লিখে বটের নাম দিন এবং Bot Token কপি করুন।</p>
                      <p>২. আপনার তৈরি বটের লিংকে ঢুকে <strong>/start</strong> চাপুন।</p>
                      <p>৩. <strong>@userinfobot</strong>-এ গিয়ে আপনার নিজস্ব Chat ID কপি করে এখানে বসান।</p>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleTestTelegram}
                        disabled={isTestingTelegram}
                        className="w-full py-2 px-3 rounded-lg bg-sky-600/30 hover:bg-sky-600/50 border border-sky-500/50 text-sky-300 font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isTestingTelegram ? (
                          <>
                            <span className="animate-spin w-3 h-3 border-2 border-sky-300 border-t-transparent rounded-full" />
                            <span>বটে টেস্ট মেসেজ পাঠানো হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            <span>টেলিগ্রাম টেস্ট মেসেজ পাঠান</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. WhatsApp Integration Card */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-xs">WhatsApp অ্যালার্ট ও ডিরেক্ট চ্যাট</h4>
                        <p className="text-[10px] text-slate-400">কাস্টমার সরাসরি TrxID পাঠাবে এবং অ্যালার্ট গ্রহণ করবেন</p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={whatsappEnabled}
                        onChange={(e) => setWhatsappEnabled(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-500"></div>
                    </label>
                  </div>

                  <div className="space-y-3 pt-1">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        অ্যাডমিন হোয়াটসঅ্যাপ নম্বর (কান্ট্রি কোড সহ):
                      </label>
                      <input
                        type="text"
                        value={whatsappNumber}
                        onChange={(e) => setWhatsappNumber(e.target.value)}
                        placeholder="যেমন: +8801712345678"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-[11px] placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">
                        WhatsApp Webhook URL (ঐচ্ছিক - n8n / Make / GreenAPI / Meta Cloud):
                      </label>
                      <input
                        type="text"
                        value={whatsappWebhookUrl}
                        onChange={(e) => setWhatsappWebhookUrl(e.target.value)}
                        placeholder="যেমন: https://webhook.site/... বা আপনার অটোমেশন বট URL"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-[11px] placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    {/* WhatsApp Feature Summary */}
                    <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40 text-[10px] text-emerald-200/90 space-y-1">
                      <p className="font-bold text-emerald-300">💡 হোয়াটসঅ্যাপের দ্বিমুখী সুবিধা:</p>
                      <p>• চেকআউটের পর কাস্টমারকে সরাসরি আপনার হোয়াটসঅ্যাপে TrxID ও পেমেন্ট স্ক্রিনশট পাঠানোর বাটন দেওয়া হয়।</p>
                      <p>• কোনো Webhook বা GreenAPI বটের URL দেওয়া থাকলে স্বয়ংক্রিয়ভাবে ক্লাউড অ্যালার্ট ট্রিগার হয়।</p>
                    </div>

                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={handleTestWhatsApp}
                        disabled={isTestingWhatsApp}
                        className="w-full py-2 px-3 rounded-lg bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-300 font-bold text-[11px] transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isTestingWhatsApp ? (
                          <>
                            <span className="animate-spin w-3 h-3 border-2 border-emerald-300 border-t-transparent rounded-full" />
                            <span>যাচাই করা হচ্ছে...</span>
                          </>
                        ) : (
                          <>
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>হোয়াটসঅ্যাপ টেস্ট ও কানেকশন চেক করুন</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button for Notifications */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={isSavingNotifications}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingNotifications ? 'সংরক্ষণ হচ্ছে...' : 'নোটিফিকেশন ও গেটওয়ে সেটিংস সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Transactions Header & Filter */}
          <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={txnSearch}
                onChange={(e) => setTxnSearch(e.target.value)}
                placeholder="TrxID, কাস্টমার নাম, বা নম্বর দিয়ে খুঁজুন..."
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={txnStatusFilter}
                onChange={(e) => setTxnStatusFilter(e.target.value as any)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
              >
                <option value="ALL">সকল স্ট্যাটাস</option>
                <option value="PENDING">শুধুমাত্র Pending (অপেক্ষমাণ)</option>
                <option value="APPROVED">অনুমোদিত (Approved)</option>
                <option value="REJECTED">বাতিলকৃত (Rejected)</option>
              </select>

              <button
                onClick={refreshTransactions}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold cursor-pointer"
              >
                রিফ্রেশ
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden text-xs">
            <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">কাস্টমার পেমেন্ট তালিকা ও TrxID অনুমোদন</h4>
                <p className="text-[11px] text-slate-400">কাস্টমারদের পাঠানো বিকাশ ও নগদ ট্রানজেকশন যাচাই করে অনুমোদন করুন।</p>
              </div>
              <span className="text-[11px] font-bold text-slate-400">
                মোট ট্রানজেকশন: <strong className="text-white">{filteredTransactions.length}</strong>
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">TrxID / মাধ্যম</th>
                    <th className="p-3.5">কাস্টমার ও প্রেরক নম্বর</th>
                    <th className="p-3.5">প্ল্যান / সাবস্ক্রিপশন</th>
                    <th className="p-3.5">পরিমাণ (BDT)</th>
                    <th className="p-3.5">তারিখ ও সময়</th>
                    <th className="p-3.5">স্ট্যাটাস</th>
                    <th className="p-3.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        কোনো ট্রানজেকশন পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((t) => (
                      <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-3.5">
                          <p className="font-mono font-bold text-emerald-400">{t.transactionId}</p>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                            t.paymentMethod === 'bKash' ? 'bg-pink-950 text-pink-300' :
                            t.paymentMethod === 'Nagad' ? 'bg-orange-950 text-orange-300' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {t.paymentMethod}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <p className="font-bold text-white">{t.customerName}</p>
                          <p className="font-mono text-[11px] text-slate-400">{t.senderNumber}</p>
                          {t.notes && <p className="text-[10px] text-slate-500 italic mt-0.5">"{t.notes}"</p>}
                        </td>
                        <td className="p-3.5">
                          <span className="font-semibold text-slate-200">{t.planName}</span>
                        </td>
                        <td className="p-3.5 font-mono font-bold text-white">
                          ৳ {t.amount.toLocaleString('en-US')}
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                          {new Date(t.createdAt).toLocaleDateString('bn-BD', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            t.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            t.status === 'PENDING' ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' :
                            'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {t.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                            {t.status === 'PENDING' && <Clock className="w-3 h-3" />}
                            {t.status === 'REJECTED' && <AlertCircle className="w-3 h-3" />}
                            <span>{t.status}</span>
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          {t.status === 'PENDING' ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => approveTransaction(t.id)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                অনুমোদন
                              </button>
                              <button
                                onClick={() => rejectTransaction(t.id)}
                                className="px-2.5 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-[11px] font-bold transition-colors cursor-pointer"
                              >
                                বাতিল
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-mono">
                              {t.verifiedBy ? `By ${t.verifiedBy}` : 'Completed'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: SECURITY & PASSWORD CHANGE */}
      {activeSubTab === 'security' && (
        <div className="max-w-xl mx-auto p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-6 text-xs">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-rose-400" />
              <span>অ্যাডমিন পাসওয়ার্ড পরিবর্তন</span>
            </h3>
            <p className="text-slate-400">
              আপনার অ্যাডমিন প্যানেল যাতে সম্পূর্ণ নিরাপদ থাকে, সে জন্য এখান থেকে একটি শক্তিশালী পাসওয়ার্ড সেট করুন।
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">বর্তমান পাসওয়ার্ড:</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="বর্তমান অ্যাডমিন পাসওয়ার্ড দিন (ডিফল্ট: admin1234)"
                  className="w-full px-3 py-2.5 pr-10 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">নতুন পাসওয়ার্ড:</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষরের নতুন পাসওয়ার্ড"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">নতুন পাসওয়ার্ড পুনরায় লিখুন:</label>
              <input
                type={showPass ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="নতুন পাসওয়ার্ড নিশ্চিত করুন"
                className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isChangingPass}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-bold transition-all cursor-pointer shadow-lg disabled:opacity-50"
            >
              {isChangingPass ? 'আপডেট হচ্ছে...' : 'পাসওয়ার্ড আপডেট করুন'}
            </button>
          </form>

          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> সিকিউরিটি টিপস:
            </span>
            <p>
              পাসওয়ার্ড পরিবর্তনের সাথে সাথে নতুন সেশন কার্যকর হবে। যেকোনো সময় কাজ শেষে উপরের "লক করুন" বাটনে ক্লিক করে অ্যাডমিন প্যানেল সুরক্ষিত করতে পারবেন।
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 1: OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              onClick={() => setActiveSubTab('billing')}
              className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-pink-500/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Pending Payments</span>
                <CreditCard className="w-4 h-4 text-pink-400" />
              </div>
              <p className="text-2xl font-black text-white">{pendingTxnCount}</p>
              <p className="text-[11px] text-pink-400 flex items-center gap-1 font-semibold">
                bKash / Nagad Trx Approvals
              </p>
            </div>

            <div
              onClick={() => navigate('/agents')}
              className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Voice Agents</span>
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-2xl font-black text-white">{agents.length}</p>
              <p className="text-[11px] text-indigo-400 flex items-center gap-1 font-semibold">
                মেইন স্টোরেজ ও Vapi সংযুক্ত
              </p>
            </div>

            <div
              onClick={() => navigate('/calls')}
              className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-purple-500/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>মোট হ্যান্ডেলকৃত কল</span>
                <PhoneCall className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-white">{calls.length}</p>
              <p className="text-[11px] text-purple-400 font-semibold">AI রিয়েল-টাইম কনভারসেশন</p>
            </div>

            <div
              onClick={() => navigate('/leads')}
              className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer space-y-2 group"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>সংগৃহীত লিড</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">{leads.length}</p>
              <p className="text-[11px] text-amber-400 font-semibold">{leads.filter(l => l.status === 'HOT').length} জন হট লিড</p>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: AGENTS */}
      {activeSubTab === 'agents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">সমস্ত Voice AI Agents</h3>
            <button
              onClick={() => navigate('/agents/create')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন এজেন্ট তৈরি করুন</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <div
                key={agent.id}
                onClick={() => navigate(`/agents/${agent.id}`)}
                className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{agent.name}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    agent.isActive ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {agent.isActive ? 'Active' : 'Paused'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{agent.firstMessage || agent.instructions}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                  <span>ভাষা: {agent.language}</span>
                  <span>কল: {agent.totalCalls}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: PHONES */}
      {activeSubTab === 'phones' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">বাংলাদেশি ভার্চুয়াল নম্বর (+880)</h3>
            <button
              onClick={() => navigate('/phones')}
              className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              নম্বর ম্যানেজমেন্ট পেজ <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {phoneNumbers.map((phone) => (
              <div key={phone.id} className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-sm font-mono font-bold text-white">{phone.number}</p>
                  <p className="text-xs text-slate-400">{phone.provider} • {phone.status}</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-emerald-950 text-emerald-300 text-xs font-semibold">
                  {phone.connectedAgentName || 'Unassigned'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 4: KNOWLEDGE */}
      {activeSubTab === 'knowledge' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">নলেজ বেস ডকুমেন্টস</h3>
            <button
              onClick={() => navigate('/knowledge')}
              className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              ডকুমেন্ট আপলোড করুন <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-2">
            {knowledgeDocs.map((doc) => (
              <div key={doc.id} className="p-4 rounded-xl bg-[#0d1322] border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <p className="font-bold text-white">{doc.fileName}</p>
                  <p className="text-slate-400">{doc.size} • {doc.type}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 5: CALLS */}
      {activeSubTab === 'calls' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">সাম্প্রতিক কল হিস্ট্রি</h3>
            <button
              onClick={() => navigate('/calls')}
              className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              সম্পূর্ণ কল লগ <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Caller</th>
                  <th className="p-3">Agent</th>
                  <th className="p-3">Duration</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {calls.slice(0, 5).map((c) => (
                  <tr key={c.id}>
                    <td className="p-3 font-mono">{c.caller}</td>
                    <td className="p-3">{c.agentName}</td>
                    <td className="p-3 font-mono">{c.duration}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 6: LEADS */}
      {activeSubTab === 'leads' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">সংগৃহীত লিডসমূহ</h3>
            <button
              onClick={() => navigate('/leads')}
              className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              সিআরএম ভিউ <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Interest</th>
                  <th className="p-3">Score</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {leads.slice(0, 5).map((l) => (
                  <tr key={l.id}>
                    <td className="p-3 font-bold text-white">{l.name}</td>
                    <td className="p-3 font-mono">{l.phone}</td>
                    <td className="p-3">{l.interest}</td>
                    <td className="p-3 font-mono text-amber-400">{l.score || 85}/100</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        l.status === 'HOT' ? 'bg-rose-950 text-rose-300' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUB-TAB 7: TEAM */}
      {activeSubTab === 'team' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">টিম মেম্বারস</h3>
            <button
              onClick={() => navigate('/team')}
              className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              টিম ম্যানেজমেন্ট পেজ <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-2 text-xs">
            {teamMembers.map((m) => (
              <div key={m.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">{m.name} ({m.email})</p>
                  <p className="text-[11px] text-slate-400">{m.role} • {m.department}</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 8: INTEGRATIONS */}
      {activeSubTab === 'integrations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">ইন্টিগ্রেশন ও API কানেকশন</h3>
            <button
              onClick={() => navigate('/integrations')}
              className="text-xs text-indigo-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              সব ইন্টিগ্রেশন দেখুন <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 text-xs text-slate-300 space-y-2">
            <p className="text-slate-400">
              VoiceAI BD-কে আপনার বিদ্যমান CRM, WhatsApp Cloud API, Bangladesh Bulk SMS Gateway, এবং Webhook এর সাথে কানেক্ট করুন।
            </p>
          </div>
        </div>
      )}

      {/* SUB-TAB 9: WEBSITE CMS & A-TO-Z CONTROL */}
      {activeSubTab === 'website' && (
        <WebsiteCmsEditor />
      )}
    </div>
  );
};
