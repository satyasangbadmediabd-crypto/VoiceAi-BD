import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Server,
  Users,
  DollarSign,
  Activity,
  Cpu,
  Database,
  Radio,
  Power,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Trash2,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  PhoneCall,
  ArrowUpRight,
  Settings2,
  ShieldCheck,
  CreditCard
} from 'lucide-react';
import { PlatformUser, ActivityLog } from '../types';
import { fetchApiStatus, getDemoUsageStats, ApiStatusResponse, DemoUsageStats, changeAdminPasswordApi } from '../services/apiService';
import { AdminSecurityGate } from '../components/AdminSecurityGate';
import { AdminAccessDenied } from '../components/AdminAccessDenied';
import { isUserAdmin } from '../utils/adminAuth';

export const SuperAdminPanelPage: React.FC = () => {
  const {
    user,
    platformUsers,
    updatePlatformUserStatus,
    updatePlatformUserPlan,
    deletePlatformUser,
    activityLogs,
    openConfirmDialog,
    addToast,
    navigate,
    isSuperAdminUnlocked,
    lockAdmin,
    transactions,
    approveTransaction,
    rejectTransaction,
    refreshTransactions,
    billingConfig,
    updateBillingConfig
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'revenue' | 'logs' | 'infra' | 'settings'>('overview');
  const [userSearch, setUserSearch] = useState('');
  const [userPlanFilter, setUserPlanFilter] = useState('ALL');
  const [userStatusFilter, setUserStatusFilter] = useState('ALL');

  const [logSearch, setLogSearch] = useState('');
  const [logCategoryFilter, setLogCategoryFilter] = useState('ALL');

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [systemFailureSimulated, setSystemFailureSimulated] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatusResponse | null>(null);
  const [demoUsage, setDemoUsage] = useState<DemoUsageStats>(getDemoUsageStats());

  // Gateway edit state
  const [isEditingGateway, setIsEditingGateway] = useState(false);
  const [editBkash, setEditBkash] = useState(billingConfig?.bkashNumber || '01712-345678');
  const [editNagad, setEditNagad] = useState(billingConfig?.nagadNumber || '01819-987654');
  const [editInstructions, setEditInstructions] = useState(billingConfig?.bkashInstructions || '');

  // Password change state
  const [superCurrentPass, setSuperCurrentPass] = useState('');
  const [superNewPass, setSuperNewPass] = useState('');
  const [superConfirmPass, setSuperConfirmPass] = useState('');
  const [isUpdatingSuperPass, setIsUpdatingSuperPass] = useState(false);

  // Access Control: Only the primary admin (satyasangbad.media.bd@gmail.com) can access
  if (!isUserAdmin(user)) {
    return <AdminAccessDenied />;
  }

  // Security Gate
  if (!isSuperAdminUnlocked) {
    return <AdminSecurityGate role="superadmin" title="সুপার অ্যাডমিন প্ল্যাটফর্ম রুট সিকিউরিটি" />;
  }

  useEffect(() => {
    fetchApiStatus().then(setApiStatus);
    const handleUsageUpdate = () => setDemoUsage(getDemoUsageStats());
    window.addEventListener('voiceai_usage_updated', handleUsageUpdate);
    return () => window.removeEventListener('voiceai_usage_updated', handleUsageUpdate);
  }, []);

  // Platform Metrics
  const totalUsers = platformUsers.length;
  const activeUsers = platformUsers.filter((u) => u.status === 'Active').length;
  const totalCallsCount = platformUsers.reduce((acc, u) => acc + (u.totalCalls || 0), 0);
  const totalMinutesSpent = platformUsers.reduce((acc, u) => acc + u.minutesUsed, 0);

  // Simulated MRR calculation in BDT
  const mrrTotal = platformUsers.reduce((acc, u) => {
    if (u.status !== 'Active') return acc;
    if (u.plan === 'Starter') return acc + 1999;
    if (u.plan === 'Business') return acc + 4999;
    if (u.plan === 'Pro') return acc + 9999;
    return acc;
  }, 0);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return platformUsers.filter((u) => {
      const matchQuery =
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.business.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchPlan = userPlanFilter === 'ALL' || u.plan === userPlanFilter;
      const matchStatus = userStatusFilter === 'ALL' || u.status === userStatusFilter;
      return matchQuery && matchPlan && matchStatus;
    });
  }, [platformUsers, userSearch, userPlanFilter, userStatusFilter]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return activityLogs.filter((log) => {
      const matchQuery =
        log.user.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
        log.resource.toLowerCase().includes(logSearch.toLowerCase());
      const matchCategory = logCategoryFilter === 'ALL' || log.category === logCategoryFilter;
      return matchQuery && matchCategory;
    });
  }, [activityLogs, logSearch, logCategoryFilter]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchApiStatus().then(setApiStatus);
    setDemoUsage(getDemoUsageStats());
    setTimeout(() => {
      setIsRefreshing(false);
      addToast('সুপার অ্যাডমিন মেট্রিক্স রিফ্রেশ সম্পন্ন', 'সার্ভার ও টেলিকম মেট্রিক্স হালনাগাদ করা হয়েছে।');
    }, 500);
  };

  const toggleFailover = () => {
    const next = !systemFailureSimulated;
    setSystemFailureSimulated(next);
    if (next) {
      addToast('সতর্কবার্তা: টেস্ট ক্লাস্টার ফেইলওভার চালু', 'ব্যাকআপ টেলিকম রাউটারে সুইচ করা হয়েছে।', 'warning');
    } else {
      addToast('সিস্টেম স্বাভাবিক মোডে ফিরেছে', 'মূল SIP ক্লাস্টার কার্যকর।', 'success');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Super Admin Top Banner & Switch */}
      <div className="rounded-2xl bg-gradient-to-r from-rose-950/60 via-[#140c14] to-indigo-950/60 border border-rose-900/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-rose-900/60 border border-rose-700 text-rose-300">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-rose-950 border border-rose-700 text-rose-300 text-[10px] font-black uppercase tracking-wider">
                Root Access • Super Admin
              </span>
              <span className="text-[11px] text-slate-400">Platform Owner Console</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              VoiceAI BD Master Platform Operations
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => lockAdmin('superadmin')}
            className="px-3.5 py-2 rounded-xl bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow"
            title="লক করুন"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>লক করুন (Lock)</span>
          </button>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-rose-400' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => navigate('/admin')}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-lg shadow-indigo-950"
          >
            <span>কাস্টমার অ্যাডমিন প্যানেল</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto text-xs">
        {[
          { id: 'overview', label: 'Platform Overview', icon: Layers },
          { id: 'users', label: `Platform Users (${totalUsers})`, icon: Users },
          { id: 'revenue', label: 'Revenue & MRR', icon: DollarSign },
          { id: 'logs', label: `System Logs (${activityLogs.length})`, icon: Activity },
          { id: 'infra', label: 'Telephony & Infra', icon: Server },
          { id: 'settings', label: 'Global Settings', icon: Settings2 }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl font-semibold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-rose-950 text-rose-200 border border-rose-800'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PLATFORM OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Monthly Recurring Revenue (MRR)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-white">৳ {mrrTotal.toLocaleString('en-US')}</p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +18.4% from last month
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Tenants</span>
                <Users className="w-4 h-4 text-indigo-400" />
              </div>
              <p className="text-2xl font-black text-white">{activeUsers} <span className="text-xs text-slate-500 font-normal">/ {totalUsers} total</span></p>
              <p className="text-[11px] text-indigo-400 font-semibold">
                Dhaka, Chittagong, Sylhet
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Calls Handled</span>
                <PhoneCall className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-2xl font-black text-white">{totalCallsCount.toLocaleString('en-US')}</p>
              <p className="text-[11px] text-purple-400 font-semibold">
                Average call length: 2m 14s
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Total Voice Minutes</span>
                <Activity className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-2xl font-black text-white">{totalMinutesSpent.toLocaleString('en-US')} <span className="text-xs text-slate-500 font-normal">mins</span></p>
              <p className="text-[11px] text-amber-400 font-semibold">
                99.8% Speech Synthesis Uptime
              </p>
            </div>
          </div>

          {/* API Connectivity & Server-Side Security Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d1322] via-slate-900 to-[#120d20] border border-indigo-900/40 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-700/60 text-indigo-400">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>API Connectivity & Engine Status</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-[10px] text-emerald-300 font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Server-side Proxy Active
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live proxy status for Google Gemini & ElevenLabs. Secret API keys are guarded in backend environment.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/settings/integrations')}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
              >
                <span>Manage API Status</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              {/* Gemini API Status */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">Gemini API</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      apiStatus?.gemini.configured
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {apiStatus?.gemini.configured ? 'Connected' : 'Not Configured'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-900 pt-2 font-mono">
                  <span>Total Gemini Requests:</span>
                  <strong className="text-white text-sm">{demoUsage.geminiRequests} calls</strong>
                </div>
                <p className="text-[11px] text-slate-500">
                  Model: <span className="text-slate-300">{apiStatus?.gemini.model || 'gemini-3.8-flash'}</span> • Instructions & Live Conversation Generation
                </p>
              </div>

              {/* ElevenLabs API Status */}
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">ElevenLabs API</span>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      apiStatus?.elevenlabs.configured
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {apiStatus?.elevenlabs.configured ? 'Connected' : 'Not Configured'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-900 pt-2 font-mono">
                  <span>Total ElevenLabs Requests:</span>
                  <strong className="text-white text-sm">{demoUsage.elevenLabsRequests} calls</strong>
                </div>
                <p className="text-[11px] text-slate-500">
                  Neural TTS Engine • Bangla & Multilingual Voice Synthesis
                </p>
              </div>
            </div>
          </div>

          {/* Quick Platform Status & Top Tenants */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-rose-400" />
                  <span>Recent Business Tenants</span>
                </h3>
                <button
                  onClick={() => setActiveTab('users')}
                  className="text-xs text-rose-300 hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  সব দেখুন <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900/60 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                    <tr>
                      <th className="p-3">Business</th>
                      <th className="p-3">Contact</th>
                      <th className="p-3">Plan</th>
                      <th className="p-3">Calls</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {platformUsers.slice(0, 4).map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40">
                        <td className="p-3 font-semibold text-white">{u.business}</td>
                        <td className="p-3 text-slate-400">{u.name} ({u.email})</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.plan === 'Pro' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                            u.plan === 'Business' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                            'bg-slate-800 text-slate-300'
                          }`}>
                            {u.plan}
                          </span>
                        </td>
                        <td className="p-3 font-mono">{u.totalCalls}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.status === 'Active' ? 'bg-emerald-950 text-emerald-300' :
                            u.status === 'Trial' ? 'bg-amber-950 text-amber-300' :
                            'bg-rose-950 text-rose-300'
                          }`}>
                            {u.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Health Status */}
            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>Telecom & Gateway Health</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">Bangladesh SIP Trunk #01</p>
                    <p className="text-[11px] text-slate-400">BTCL / Summit Interconnect</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                    Online (18ms)
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">ElevenLabs Turbo v2.5</p>
                    <p className="text-[11px] text-slate-400">Bangla Neural Synthesis</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                    Connected
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-white">bKash Merchant Webhook</p>
                    <p className="text-[11px] text-slate-400">Tokenized Recurring Checkout</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLATFORM USERS MANAGEMENT */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filters and search bar */}
          <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="ব্যবসার নাম, ইউজার বা ইমেইল সার্চ..."
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={userPlanFilter}
                onChange={(e) => setUserPlanFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
              >
                <option value="ALL">সকল প্ল্যান</option>
                <option value="Starter">Starter (৳১,৯৯৯)</option>
                <option value="Business">Business (৳৪,৯৯৯)</option>
                <option value="Pro">Pro (৳৯,৯৯৯)</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => setUserStatusFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
              >
                <option value="ALL">সকল স্ট্যাটাস</option>
                <option value="Active">Active</option>
                <option value="Trial">Trial</option>
                <option value="Suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* User Table */}
          <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Business & Contact</th>
                    <th className="p-3.5">Subscription Plan</th>
                    <th className="p-3.5">Usage (Mins)</th>
                    <th className="p-3.5">Calls & Agents</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        কোনো ইউজার অ্যাকাউন্ট পাওয়া যায়নি।
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-3.5">
                          <p className="font-bold text-white text-xs">{u.business}</p>
                          <p className="text-[11px] text-slate-400">{u.name} • {u.email}</p>
                          <p className="text-[10px] text-slate-500">{u.phone}</p>
                        </td>

                        <td className="p-3.5">
                          <select
                            value={u.plan}
                            onChange={(e) => updatePlatformUserPlan(u.id, e.target.value as any)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs font-semibold focus:outline-none"
                          >
                            <option value="Starter">Starter</option>
                            <option value="Business">Business</option>
                            <option value="Pro">Pro</option>
                          </select>
                        </td>

                        <td className="p-3.5 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span>{u.minutesUsed}m</span>
                            <span className="text-slate-500">/ {u.plan === 'Starter' ? 100 : u.plan === 'Business' ? 300 : 800}m</span>
                          </div>
                        </td>

                        <td className="p-3.5">
                          <p className="font-mono text-white">{u.totalCalls} calls</p>
                          <p className="text-[10px] text-slate-500">{u.agentsCount} AI Agents</p>
                        </td>

                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.status === 'Active' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                            u.status === 'Trial' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                            'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {u.status}
                          </span>
                        </td>

                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {u.status === 'Active' ? (
                              <button
                                onClick={() =>
                                  openConfirmDialog({
                                    title: 'ইউজার অ্যাকাউন্ট স্থগিত করবেন?',
                                    message: `${u.business}-এর অ্যাকাউন্ট সাময়িকভাবে সাসপেন্ড করলে তাদের এজেন্ট কল গ্রহণ করা বন্ধ করবে।`,
                                    confirmText: 'স্থগিত করুন',
                                    isDestructive: true,
                                    onConfirm: () => updatePlatformUserStatus(u.id, 'Suspended')
                                  })
                                }
                                className="px-2.5 py-1 rounded-lg bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-800 text-[11px] font-semibold cursor-pointer"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() => updatePlatformUserStatus(u.id, 'Active')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 text-[11px] font-semibold cursor-pointer"
                              >
                                Activate
                              </button>
                            )}

                            <button
                              onClick={() =>
                                openConfirmDialog({
                                  title: 'অ্যাকাউন্ট স্থায়ীভাবে ডিলিট করবেন?',
                                  message: `${u.business} অ্যাকাউন্টটি ডিলিট করলে এর সকল এজেন্ট ও ডেটা মুছে যাবে। এই কাজ ফিরিয়ে নেওয়া যাবে না।`,
                                  confirmText: 'ডিলিট করুন',
                                  isDestructive: true,
                                  onConfirm: () => deletePlatformUser(u.id)
                                })
                              }
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors cursor-pointer"
                              title="Delete Account"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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

      {/* TAB 3: REVENUE & MRR DASHBOARD */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Total MRR</span>
              <p className="text-3xl font-black text-white">৳ {mrrTotal.toLocaleString('en-US')}</p>
              <p className="text-[11px] text-emerald-400">+14% month-over-month growth</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Annual Run Rate (ARR)</span>
              <p className="text-3xl font-black text-white">৳ {(mrrTotal * 12).toLocaleString('en-US')}</p>
              <p className="text-[11px] text-indigo-400">Estimated Bangladesh Enterprise Runway</p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400">Gateway Distribution</span>
              <p className="text-sm font-bold text-white pt-2">
                bKash (62%) • Nagad (25%) • Cards (13%)
              </p>
              <p className="text-[11px] text-slate-400">100% automated simulated collection</p>
            </div>
          </div>

          {/* Revenue Details Table */}
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">প্ল্যাটফর্ম সাবস্ক্রিপশন ইনকাম ব্রেকডাউন</h3>
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Pro Plan Tier (৳৯,৯৯৯/month)</p>
                  <p className="text-[11px] text-slate-400">4 Active Tenants • High volume call centers</p>
                </div>
                <p className="text-sm font-mono font-bold text-emerald-400">৳ ৩৯,৯৯৬</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Business Plan Tier (৳৪,৯৯৯/month)</p>
                  <p className="text-[11px] text-slate-400">8 Active Tenants • E-commerce & Healthcare</p>
                </div>
                <p className="text-sm font-mono font-bold text-emerald-400">৳ ৩৯,৯৯২</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Starter Plan Tier (৳১,৯৯৯/month)</p>
                  <p className="text-[11px] text-slate-400">5 Active Tenants • Startups & Boutiques</p>
                </div>
                <p className="text-sm font-mono font-bold text-emerald-400">৳ ৯,৯৯৫</p>
              </div>
            </div>
          </div>

          {/* MFS Receiver Gateway Configuration */}
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-pink-400" />
                  <span>সুপার অ্যাডমিন bKash / Nagad ডিপোজিট গেটওয়ে কনফিগারেশন</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  গ্রাহক সাবস্ক্রিপশন ফি জমা নেওয়ার বিকাশ ও নগদ অ্যাকাউন্ট নম্বর নিয়ন্ত্রণ করুন।
                </p>
              </div>

              {!isEditingGateway ? (
                <button
                  onClick={() => setIsEditingGateway(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors cursor-pointer self-start sm:self-auto"
                >
                  গেটওয়ে এডিট করুন
                </button>
              ) : null}
            </div>

            {isEditingGateway ? (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const success = await updateBillingConfig({
                    bkashNumber: editBkash.trim(),
                    nagadNumber: editNagad.trim(),
                    bkashInstructions: editInstructions.trim()
                  });
                  if (success) setIsEditingGateway(false);
                }}
                className="space-y-3 pt-2 border-t border-slate-800"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">বিকাশ প্রাপক নম্বর:</label>
                    <input
                      type="text"
                      value={editBkash}
                      onChange={(e) => setEditBkash(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">নগদ প্রাপক নম্বর:</label>
                    <input
                      type="text"
                      value={editNagad}
                      onChange={(e) => setEditNagad(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-slate-300 font-medium mb-1">কাস্টমার পেমেন্ট নির্দেশিকা:</label>
                    <input
                      type="text"
                      value={editInstructions}
                      onChange={(e) => setEditInstructions(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow"
                  >
                    গেটওয়ে সেভ করুন
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400">সক্রিয় বিকাশ নম্বর:</span>
                  <p className="text-base font-black text-pink-400 font-mono mt-0.5">{billingConfig?.bkashNumber}</p>
                  <span className="text-[10px] text-slate-500">{billingConfig?.bkashType || 'Send Money'}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400">সক্রিয় নগদ নম্বর:</span>
                  <p className="text-base font-black text-orange-400 font-mono mt-0.5">{billingConfig?.nagadNumber}</p>
                  <span className="text-[10px] text-slate-500">Send Money</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400">Telegram Bot অ্যালার্ট:</span>
                  <p className="text-sm font-bold text-sky-400 font-mono mt-0.5">
                    {billingConfig?.telegramEnabled && billingConfig?.telegramBotToken ? '✓ সক্রিয় (Active)' : 'নিষ্ক্রিয়'}
                  </p>
                  <span className="text-[10px] text-slate-500">তাৎক্ষণিক মেসেজ</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[11px] text-slate-400">WhatsApp নম্বর:</span>
                  <p className="text-sm font-bold text-emerald-400 font-mono mt-0.5">{billingConfig?.whatsappNumber || '+880 1712-345678'}</p>
                  <span className="text-[10px] text-slate-500">ডিরেক্ট চ্যাট ও অ্যালার্ট</span>
                </div>
              </div>
            )}
          </div>

          {/* Master Transactions Approval Table */}
          <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden text-xs">
            <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white">গ্রাহক সাবস্ক্রিপশন ট্রানজেকশন অনুমোদন (TrxID Verifications)</h4>
                <p className="text-[11px] text-slate-400">বিকাশ ও নগদ পেমেন্টের TrxID যাচাই করে অ্যাকাউন্ট এপ্রুভ করুন।</p>
              </div>
              <button
                onClick={refreshTransactions}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                রিফ্রেশ
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">TrxID / মাধ্যম</th>
                    <th className="p-3.5">কাস্টমার / ফোন</th>
                    <th className="p-3.5">প্ল্যান</th>
                    <th className="p-3.5">টাকার পরিমাণ</th>
                    <th className="p-3.5">তারিখ</th>
                    <th className="p-3.5">স্ট্যাটাস</th>
                    <th className="p-3.5 text-right">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300 font-sans">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/30">
                      <td className="p-3.5 font-mono">
                        <span className="font-bold text-emerald-400">{t.transactionId}</span>
                        <p className="text-[10px] text-slate-400 font-sans">{t.paymentMethod}</p>
                      </td>
                      <td className="p-3.5">
                        <p className="font-bold text-white">{t.customerName}</p>
                        <p className="font-mono text-slate-400 text-[11px]">{t.senderNumber}</p>
                      </td>
                      <td className="p-3.5 text-slate-200 font-semibold">{t.planName}</td>
                      <td className="p-3.5 font-mono font-bold text-white">৳ {t.amount.toLocaleString('en-US')}</td>
                      <td className="p-3.5 font-mono text-[11px] text-slate-400">
                        {new Date(t.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          t.status === 'PENDING' ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' :
                          'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {t.status === 'PENDING' ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => approveTransaction(t.id)}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold cursor-pointer"
                            >
                              অনুমোদন
                            </button>
                            <button
                              onClick={() => rejectTransaction(t.id)}
                              className="px-2.5 py-1 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-rose-200 text-[11px] font-bold cursor-pointer"
                            >
                              বাতিল
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">{t.verifiedBy || 'Completed'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SYSTEM ACTIVITY LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                placeholder="লগ সার্চ (ইউজার, অ্যাকশন, রিসোর্স)..."
                className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={logCategoryFilter}
                onChange={(e) => setLogCategoryFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
              >
                <option value="ALL">সকল ক্যাটাগরি</option>
                <option value="Agents">Agents</option>
                <option value="Calls">Calls</option>
                <option value="Billing">Billing</option>
                <option value="Telephony">Telephony</option>
                <option value="Users">Users</option>
                <option value="Security">Security</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                  <tr>
                    <th className="p-3.5">Time</th>
                    <th className="p-3.5">Initiator</th>
                    <th className="p-3.5">Action</th>
                    <th className="p-3.5">Resource</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 text-slate-400">{log.time}</td>
                      <td className="p-3.5 text-white font-semibold font-sans">{log.user}</td>
                      <td className="p-3.5 text-indigo-300 font-sans">{log.action}</td>
                      <td className="p-3.5 text-slate-300">{log.resource}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">
                          {log.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'Success' ? 'bg-emerald-950 text-emerald-300' :
                          log.status === 'Warning' ? 'bg-amber-950 text-amber-300' :
                          'bg-rose-950 text-rose-300'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: TELEPHONY & INFRASTRUCTURE */}
      {activeTab === 'infra' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400" />
                <span>সিমুলেটেড ক্লাউড ব্যাকআপ ও ফেইলওভার সুইচ</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                টেলিকম ও ভয়েস মডেল ডাউনটাইম টেস্ট করার জন্য তাৎক্ষণিক ব্যাকআপ ক্লাস্টারে ট্রাফিক ডাইভার্ট করুন।
              </p>
            </div>

            <button
              onClick={toggleFailover}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                systemFailureSimulated
                  ? 'bg-rose-600 hover:bg-rose-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{systemFailureSimulated ? 'ফেইলওভার সক্রিয়' : 'ফেইলওভার টেস্ট'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>Bangla Voice AI Inference Nodes</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                GPU cluster located in Singapore with edge CDN endpoints in Dhaka (Dhaka-IX).
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Inference Latency:</span>
                  <span className="font-mono text-emerald-400">118ms</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Concurrent Streams:</span>
                  <span className="font-mono text-white">42 / 200</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Packet Loss:</span>
                  <span className="font-mono text-emerald-400">0.002%</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-3">
              <h4 className="font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-400" />
                <span>Knowledge Base Vector Index</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                Semantic retrieval engine powered by embedded vectors for Bangla FAQs.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Indexed Documents:</span>
                  <span className="font-mono text-white">128 PDFs & Files</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Query Similarity Time:</span>
                  <span className="font-mono text-emerald-400">34ms</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Embedding Cache Hit Rate:</span>
                  <span className="font-mono text-emerald-400">96.8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: GLOBAL SETTINGS */}
      {activeTab === 'settings' && (
        <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 max-w-2xl text-xs">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-rose-400" />
            <span>গ্লোবাল প্ল্যাটফর্ম কনফিগারেশন</span>
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-400 mb-1">ডিফল্ট ফ্রি ট্রায়াল মিনিট</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">সিমুলেটেড টেলিফোনি প্রোভাইডার ডিফল্ট</label>
              <input
                type="text"
                defaultValue="Telecom BD - Dhaka Node 01"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={() => addToast('সেটিংস সংরক্ষিত হয়েছে', 'গ্লোবাল কনফিগারেশন আপডেট সম্পন্ন।')}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold cursor-pointer transition-colors shadow-lg"
              >
                সেটিংস সেভ করুন
              </button>
            </div>
          </div>

          {/* Super Admin Security Password Change */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>সুপার অ্যাডমিন মাস্টার পাসওয়ার্ড পরিবর্তন</span>
            </h4>
            <p className="text-[11px] text-slate-400">
              ডিফল্ট পাসওয়ার্ড: <span className="font-mono text-amber-300">superadmin2026</span>। নিজের নিরাপদ পাসওয়ার্ড সেট করুন।
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (!superCurrentPass) {
                  addToast('সতর্কতা', 'বর্তমান পাসওয়ার্ড দিন।', 'warning');
                  return;
                }
                if (superNewPass.length < 6) {
                  addToast('সতর্কতা', 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।', 'warning');
                  return;
                }
                if (superNewPass !== superConfirmPass) {
                  addToast('সতর্কতা', 'পাসওয়ার্ড দুটি মিলছে না।', 'warning');
                  return;
                }

                setIsUpdatingSuperPass(true);
                try {
                  const res = await changeAdminPasswordApi('superadmin', superCurrentPass, superNewPass);
                  if (res.success) {
                    addToast('মাস্টার পাসওয়ার্ড সফলভাবে পরিবর্তিত!', 'নতুন পাসওয়ার্ড দিয়ে লগইন সচল থাকবে।', 'success');
                    setSuperCurrentPass('');
                    setSuperNewPass('');
                    setSuperConfirmPass('');
                  } else {
                    addToast('ত্রুটি', res.message || 'বর্তমান পাসওয়ার্ড সঠিক নয়।', 'error');
                  }
                } catch {
                  addToast('ব্যর্থ', 'পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।', 'error');
                } finally {
                  setIsUpdatingSuperPass(false);
                }
              }}
              className="space-y-3 pt-2"
            >
              <div>
                <label className="block text-slate-400 mb-1">বর্তমান মাস্টার পাসওয়ার্ড:</label>
                <input
                  type="password"
                  value={superCurrentPass}
                  onChange={(e) => setSuperCurrentPass(e.target.value)}
                  placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">নতুন পাসওয়ার্ড:</label>
                <input
                  type="password"
                  value={superNewPass}
                  onChange={(e) => setSuperNewPass(e.target.value)}
                  placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">নতুন পাসওয়ার্ড নিশ্চিত করুন:</label>
                <input
                  type="password"
                  value={superConfirmPass}
                  onChange={(e) => setSuperConfirmPass(e.target.value)}
                  placeholder="নতুন পাসওয়ার্ড পুনরায় লিখুন"
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white font-mono"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingSuperPass}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer transition-colors shadow-lg disabled:opacity-50"
              >
                {isUpdatingSuperPass ? 'আপডেট হচ্ছে...' : 'মাস্টার পাসওয়ার্ড পরিবর্তন করুন'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
