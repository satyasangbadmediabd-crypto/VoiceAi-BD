import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PRICING_PLANS } from '../mockData';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  Download,
  Plus,
  Trash2,
  Check,
  X,
  FileText,
  Phone,
  HardDrive
} from 'lucide-react';
import { PricingPlan } from '../types';

export const BillingPage: React.FC = () => {
  const {
    user,
    openCheckout,
    invoices,
    cancelSubscription,
    changePlan,
    phoneNumbers,
    knowledgeDocs,
    openConfirmDialog,
    addToast,
    billingConfig,
    transactions
  } = useApp();

  const currentPlanName = user?.plan || 'Starter';
  const minutesUsed = user?.minutesUsed || 82;
  const minutesLimit = user?.minutesLimit || 100;
  const percentage = Math.min(100, Math.round((minutesUsed / minutesLimit) * 100));

  // Phone and storage usage
  const phonesUsed = phoneNumbers.length;
  const phonesLimit = currentPlanName === 'Starter' ? 1 : currentPlanName === 'Business' ? 3 : 10;

  const storageUsedMB = knowledgeDocs.length * 4.2;
  const storageLimitMB = currentPlanName === 'Starter' ? 50 : currentPlanName === 'Business' ? 250 : 1000;

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'pm-1',
      provider: 'bKash Auto-Debit',
      details: '+880 1712-***88',
      type: 'MFS',
      isDefault: true
    },
    {
      id: 'pm-2',
      provider: 'Nagad Gateway',
      details: '+880 1845-***12',
      type: 'MFS',
      isDefault: false
    },
    {
      id: 'pm-3',
      provider: 'BRAC Bank Visa',
      details: '•••• •••• •••• 4092',
      type: 'Card',
      isDefault: false
    }
  ]);

  const [showAddMethodModal, setShowAddMethodModal] = useState(false);
  const [newMethodProvider, setNewMethodProvider] = useState('bKash');
  const [newMethodAccount, setNewMethodAccount] = useState('');

  // Top-up minutes pack
  const handleBuyMinutesPack = (packMinutes: number, packPrice: number) => {
    openCheckout({
      id: `topup-${packMinutes}`,
      name: `Top-up প্যাক (+${packMinutes} মিনিট)`,
      price: packPrice,
      priceLabel: `৳${packPrice} BDT`,
      billingCycle: 'এককালীন (Top-up)',
      agentLimit: 5,
      minutesLimit: packMinutes,
      description: `অতিরিক্ত ${packMinutes} AI ভয়েস মিনিট ইনস্ট্যান্ট টপ-আপ`,
      features: [
        `${packMinutes} অতিরিক্ত AI কল মিনিট`,
        '২৪/৭ নিরবচ্ছিন্ন টেলিফোনি সেবা',
        'কোনো মেয়াদোত্তীর্ণ হওয়ার ঝুঁকি নেই'
      ]
    });
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    addToast(
      'ইনভয়েস PDF ডাউনলোড শুরু হয়েছে (Simulated)',
      `ফাইল: Invoice_${invoiceId}.pdf (VoiceAI BD Ltd)`
    );
  };

  const handleAddPaymentMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethodAccount.trim()) return;
    setPaymentMethods((prev) => [
      ...prev,
      {
        id: `pm-${Date.now()}`,
        provider: newMethodProvider,
        details: newMethodAccount,
        type: newMethodProvider.includes('Card') ? 'Card' : 'MFS',
        isDefault: false
      }
    ]);
    setNewMethodAccount('');
    setShowAddMethodModal(false);
    addToast('নতুন পেমেন্ট মেথড যুক্ত হয়েছে!', newMethodProvider);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-indigo-400" />
          <span>Billing, Usage & Subscription Plans</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          আপনার সাবস্ক্রিপশন প্ল্যান, ভয়েস মিনিট ব্যালেন্স, দেশীয় পেমেন্ট মেথড ও ইনভয়েস হিস্ট্রি
        </p>
      </div>

      {/* THRESHOLD ALERT: >= 80% */}
      {percentage >= 80 && (
        <div className={`rounded-2xl p-4 border flex items-start justify-between gap-4 ${
          percentage >= 95
            ? 'bg-rose-950/50 border-rose-800 text-rose-200'
            : 'bg-amber-950/50 border-amber-800 text-amber-200'
        }`}>
          <div className="flex items-start gap-3">
            <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${percentage >= 95 ? 'text-rose-400' : 'text-amber-400'}`} />
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-bold">
                সতর্কতা: আপনার মাসিক ভয়েস মিনিটের {percentage}% ব্যবহৃত হয়েছে!
              </h4>
              <p className="text-xs opacity-90">
                সীমা অতিক্রম করলে ইনকামিং কল স্বয়ংক্রিয়ভাবে ভয়েসমেইলে চলে যেতে পারে। নিরবচ্ছিন্ন সার্ভিসের জন্য টপ-আপ করুন বা প্ল্যান আপগ্রেড করুন।
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => handleBuyMinutesPack(50, 500)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-colors cursor-pointer whitespace-nowrap shadow"
            >
              +৫০ মিনিট কিনুন (৳৫০০)
            </button>
          </div>
        </div>
      )}

      {/* Current Subscription Status Card */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-indigo-950/70 via-[#0e1628] to-purple-950/50 border border-indigo-900/60 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
                বর্তমান সাবস্ক্রিপশন
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>
            <h3 className="text-2xl font-black text-white">{currentPlanName} Plan</h3>
            <p className="text-xs text-slate-300 mt-0.5">
              পরবর্তী বিলিং সাইকেল: আগামী ১২ অক্টোবর, ২০২৬ (স্বয়ংক্রিয় নবায়ন)
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() =>
                openConfirmDialog({
                  title: 'সাবস্ক্রিপশন বাতিল করতে চান?',
                  message: 'সাবস্ক্রিপশন বাতিল করলে বর্তমান মেয়াদের পর আপনার এজেন্ট ফ্রি কোটায় নেমে আসবে।',
                  confirmText: 'বাতিল নিশ্চিত করুন',
                  isDestructive: true,
                  onConfirm: cancelSubscription
                })
              }
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700 text-xs font-semibold cursor-pointer"
            >
              সাবস্ক্রিপশন বাতিল
            </button>

            <button
              onClick={() => openCheckout(PRICING_PLANS[1])}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-950 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>প্ল্যান পরিবর্তন করুন</span>
            </button>
          </div>
        </div>

        {/* Multi-Metric Usage Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Minutes Usage */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>AI ভয়েস মিনিট</span>
              </span>
              <span className="font-mono font-bold text-white">
                {minutesUsed} / {minutesLimit} মিনিট ({percentage}%)
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentage >= 95 ? 'bg-rose-500' : percentage >= 80 ? 'bg-amber-500' : 'bg-indigo-500'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Virtual Phone Numbers Usage */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <Phone className="w-4 h-4 text-purple-400" />
                <span>ভার্চুয়াল নম্বর কোটা</span>
              </span>
              <span className="font-mono font-bold text-white">
                {phonesUsed} / {phonesLimit} নম্বর
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full"
                style={{ width: `${Math.min(100, (phonesUsed / phonesLimit) * 100)}%` }}
              />
            </div>
          </div>

          {/* Knowledge Storage Usage */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 font-bold">
                <HardDrive className="w-4 h-4 text-emerald-400" />
                <span>নলেজ বেস স্টোরেজ</span>
              </span>
              <span className="font-mono font-bold text-white">
                {storageUsedMB.toFixed(1)} / {storageLimitMB} MB
              </span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${Math.min(100, (storageUsedMB / storageLimitMB) * 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Top-up Packs */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-bold text-white">জরুরি অতিরিক্ত মিনিট প্রয়োজন?</p>
            <p className="text-[11px] text-slate-400">সাবস্ক্রিপশন মেয়াদ শেষ না হলেও অতিরিক্ত মিনিট ক্রয় করে ব্যালেন্স বাড়ান।</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBuyMinutesPack(50, 500)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold border border-slate-700 cursor-pointer"
            >
              +৫০ মিনিট (৳৫০০)
            </button>
            <button
              onClick={() => handleBuyMinutesPack(100, 900)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
            >
              +১০০ মিনিট (৳৯০০)
            </button>
          </div>
        </div>
      </div>

      {/* Subscription Plans Pricing Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white">সকল সাবস্ক্রিপশন প্যাকেজসমূহ</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan) => {
            const isCurrent = currentPlanName === plan.name;
            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 flex flex-col justify-between border transition-all ${
                  isCurrent
                    ? 'bg-indigo-950/30 border-indigo-500 shadow-xl'
                    : 'bg-[#0d1322] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-white">{plan.name}</h4>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                        CURRENT
                      </span>
                    )}
                  </div>

                  <div>
                    <span className="text-3xl font-black text-white">{plan.priceLabel}</span>
                    <span className="text-xs text-slate-400"> /মাস</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">{plan.description}</p>

                  <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  {isCurrent ? (
                    <button
                      disabled
                      className="w-full py-2.5 rounded-xl bg-slate-800 text-slate-400 font-bold text-xs cursor-default text-center"
                    >
                      বর্তমান প্ল্যান
                    </button>
                  ) : (
                    <button
                      onClick={() => openCheckout(plan)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors cursor-pointer shadow-lg"
                    >
                      {plan.name} প্ল্যানে পরিবর্তন করুন
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Payment Methods Section */}
      <div className="p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span>পেমেন্ট মেথড (Payment Methods)</span>
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              বিকাশ, নগদ ও দেশীয় ক্রেডিট কার্ড স্বয়ংক্রিয় রিনিউয়াল সাপোর্ট করে।
            </p>
          </div>

          <button
            onClick={() => setShowAddMethodModal(true)}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>নতুন মেথড যোগ করুন</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {paymentMethods.map((pm) => (
            <div
              key={pm.id}
              className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">{pm.provider}</span>
                  {pm.isDefault && (
                    <span className="px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 text-[9px] font-bold">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-0.5">{pm.details}</p>
              </div>

              {!pm.isDefault && (
                <button
                  onClick={() => {
                    setPaymentMethods((prev) =>
                      prev.map((p) => ({ ...p, isDefault: p.id === pm.id }))
                    );
                    addToast('ডিফল্ট পেমেন্ট মেথড আপডেট হয়েছে!', pm.provider);
                  }}
                  className="text-[10px] text-indigo-400 hover:text-white cursor-pointer"
                >
                  ডিফল্ট করুন
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Official bKash & Nagad Receiver Info Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-950/40 via-[#0d1322] to-orange-950/40 border border-slate-800 space-y-3 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-pink-400" />
              <span>অফিশিয়াল bKash ও Nagad পেমেন্ট ডিপোজিট তথ্য</span>
            </h3>
            <p className="text-slate-400 mt-0.5">
              যেকোনো প্ল্যান বা মিনিট প্যাক কিনতে নিচের বিকাশ বা নগদ নম্বরে নির্ধারিত ফি Send Money করুন:
            </p>
          </div>

          <button
            onClick={() => openCheckout(PRICING_PLANS[1])}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold transition-all cursor-pointer shadow-lg self-start sm:self-auto"
          >
            পেমেন্ট চেকআউট খুলুন
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-pink-900/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-pink-300 font-bold uppercase tracking-wider">bKash Personal:</span>
              <p className="text-base font-black text-white font-mono mt-0.5">{billingConfig?.bkashNumber || '01712-345678'}</p>
              <p className="text-[10px] text-slate-400">{billingConfig?.bkashType || 'Send Money'}</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(billingConfig?.bkashNumber || '01712-345678');
                addToast('বিকাশ নম্বর কপি করা হয়েছে!', `${billingConfig?.bkashNumber || '01712-345678'}`);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-pink-950 hover:bg-pink-900 border border-pink-700 text-pink-300 text-[10px] font-bold cursor-pointer"
            >
              কপি
            </button>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/90 border border-orange-900/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-orange-300 font-bold uppercase tracking-wider">Nagad Personal:</span>
              <p className="text-base font-black text-white font-mono mt-0.5">{billingConfig?.nagadNumber || '01819-987654'}</p>
              <p className="text-[10px] text-slate-400">Send Money</p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(billingConfig?.nagadNumber || '01819-987654');
                addToast('নগদ নম্বর কপি করা হয়েছে!', `${billingConfig?.nagadNumber || '01819-987654'}`);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-orange-950 hover:bg-orange-900 border border-orange-700 text-orange-300 text-[10px] font-bold cursor-pointer"
            >
              কপি
            </button>
          </div>
        </div>
      </div>

      {/* Customer TrxID Submission & Verification Tracking */}
      {transactions.length > 0 && (
        <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden text-xs">
          <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>আমার সাবমিটকৃত ট্রানজেকশন ট্র্যাকিং (TrxID Verification)</span>
            </h3>
            <span className="text-[11px] text-slate-400">রিয়েল-টাইম অ্যাডমিন ভেরিফিকেশন স্ট্যাটাস</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3.5">TrxID</th>
                  <th className="p-3.5">পদ্ধতি</th>
                  <th className="p-3.5">প্রেরক নম্বর</th>
                  <th className="p-3.5">প্ল্যান</th>
                  <th className="p-3.5">পরিমাণ</th>
                  <th className="p-3.5">তারিখ</th>
                  <th className="p-3.5 text-right">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {transactions.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/30">
                    <td className="p-3.5 font-mono font-bold text-emerald-400">{t.transactionId}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-800 font-semibold text-[10px]">{t.paymentMethod}</span>
                    </td>
                    <td className="p-3.5 font-mono text-[11px]">{t.senderNumber}</td>
                    <td className="p-3.5 font-medium">{t.planName}</td>
                    <td className="p-3.5 font-mono font-bold text-white">৳ {t.amount} BDT</td>
                    <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                      {new Date(t.createdAt).toLocaleDateString('bn-BD', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="p-3.5 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        t.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                        t.status === 'PENDING' ? 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse' :
                        'bg-rose-950 text-rose-300 border border-rose-800'
                      }`}>
                        {t.status === 'APPROVED' ? 'অনুমোদিত (Approved)' :
                         t.status === 'PENDING' ? 'যাচাই চলছে (Pending)' : 'বাতিল (Rejected)'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoices History Table */}
      <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden text-xs">
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>ইনভয়েস ও বিলিং হিস্ট্রি (Invoice History)</span>
          </h3>
          <span className="text-[11px] text-slate-400">VAT & NBR Compliant Automated Receipts</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3.5">Invoice ID</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Plan / Description</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-white">{inv.id}</td>
                  <td className="p-3.5 text-slate-400">{inv.date}</td>
                  <td className="p-3.5 font-medium">{inv.plan}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">{inv.amount}</td>
                  <td className="p-3.5 text-slate-400">{inv.method}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => handleDownloadInvoice(inv.id)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1 border border-slate-800 text-[11px]"
                      title="Download PDF"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddMethodModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-slate-700 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <span>পেমেন্ট মেথড যোগ করুন</span>
              </h3>
              <button
                onClick={() => setShowAddMethodModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddPaymentMethod} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">পেমেন্ট গেটওয়ে নির্বাচন করুন</label>
                <select
                  value={newMethodProvider}
                  onChange={(e) => setNewMethodProvider(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="bKash">bKash (Tokenized Auto-Debit)</option>
                  <option value="Nagad">Nagad Direct Payment</option>
                  <option value="Visa / Mastercard">Visa / Mastercard (City/BRAC/EBL)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">
                  {newMethodProvider.includes('Card') ? 'কার্ড নম্বর' : 'মোবাইল নম্বর'} *
                </label>
                <input
                  type="text"
                  required
                  value={newMethodAccount}
                  onChange={(e) => setNewMethodAccount(e.target.value)}
                  placeholder={newMethodProvider.includes('Card') ? '4111 2222 3333 4444' : '+880 1700-000000'}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddMethodModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
