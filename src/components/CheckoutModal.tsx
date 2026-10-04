import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Copy,
  Check,
  HelpCircle,
  Smartphone,
  AlertCircle,
  ArrowRight,
  MessageSquare,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutOpen,
    checkoutPlan,
    closeCheckout,
    billingConfig,
    submitBillingTransaction,
    addToast
  } = useApp();

  const [selectedMethod, setSelectedMethod] = useState<'bKash' | 'Nagad' | 'Bank'>('bKash');
  const [senderNumber, setSenderNumber] = useState('');
  const [trxId, setTrxId] = useState('');
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(false);

  if (!isCheckoutOpen || !checkoutPlan) return null;

  const activeReceiverNumber =
    selectedMethod === 'bKash'
      ? billingConfig.bkashNumber || '01712-345678'
      : selectedMethod === 'Nagad'
      ? billingConfig.nagadNumber || '01819-987654'
      : 'BRAC Bank Gulshan Branch';

  const activeInstructions =
    selectedMethod === 'bKash'
      ? billingConfig.bkashInstructions ||
        'আপনার বিকাশ অ্যাপ থেকে Send Money অপশনে গিয়ে উপরে উল্লেখিত নম্বরে নির্ধারিত ফি প্রদান করুন। রেফারেন্স হিসেবে আপনার নাম বা মোবাইল নম্বর লিখুন এবং প্রাপ্ত TrxID প্রদান করুন।'
      : selectedMethod === 'Nagad'
      ? billingConfig.nagadInstructions ||
        'নগদ অ্যাপ অথবা *167# ডায়াল করে Send Money করুন এবং ট্রানজেকশন নিশ্চিতকরণের পর প্রাপ্ত TrxID প্রদান করুন।'
      : billingConfig.bankDetails;

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(activeReceiverNumber);
    setCopiedNumber(true);
    addToast('নম্বর কপি করা হয়েছে!', `${activeReceiverNumber} ক্লিপবোর্ডে কপি সম্পন্ন।`, 'success');
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderNumber || senderNumber.trim().length < 11) {
      addToast('সতর্কতা', 'অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন।', 'warning');
      return;
    }
    if (!trxId || trxId.trim().length < 6) {
      addToast('সতর্কতা', 'অনুগ্রহ করে সঠিক TrxID লিখুন।', 'warning');
      return;
    }

    setIsProcessing(true);
    const success = await submitBillingTransaction({
      paymentMethod: selectedMethod === 'Bank' ? 'Bank' : selectedMethod,
      senderNumber: senderNumber.trim(),
      transactionId: trxId.trim().toUpperCase(),
      notes: notes.trim()
    });

    setIsProcessing(false);
    if (success) {
      setIsSubmittedSuccess(true);
    }
  };

  const handleClose = () => {
    setIsSubmittedSuccess(false);
    setSenderNumber('');
    setTrxId('');
    setNotes('');
    closeCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-lg rounded-2xl bg-[#0b101c] border border-slate-700/80 shadow-2xl overflow-hidden my-auto"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 to-indigo-950/60">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>VoiceAI সাবস্ক্রিপশন চেকআউট</span>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-800 font-semibold">
                Official Gateway
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              সিলেক্টেড প্ল্যান: <strong className="text-indigo-300 font-bold">{checkoutPlan.name}</strong> •{' '}
              <span className="text-emerald-400 font-black">৳{checkoutPlan.price} BDT/মাস</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmittedSuccess ? (
          /* Success Receipt View */
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-emerald-950">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-white">পেমেন্ট রিকোয়েস্ট সফলভাবে জমা হয়েছে!</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                আপনার প্রদত্ত TrxID <strong className="text-emerald-300 font-mono font-bold">{trxId.toUpperCase()}</strong> আমাদের কেন্দ্রীয় অ্যাডমিন প্যানেলে সংরক্ষিত হয়েছে।
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-left text-xs space-y-2 max-w-sm mx-auto">
              <div className="flex justify-between">
                <span className="text-slate-400">প্ল্যান:</span>
                <span className="text-white font-bold">{checkoutPlan.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">পরিশোধিত ফি:</span>
                <span className="text-emerald-400 font-bold font-mono">৳{checkoutPlan.price} BDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">পেমেন্ট মাধ্যম:</span>
                <span className="text-slate-200">{selectedMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">প্রেরকের নম্বর:</span>
                <span className="text-slate-200 font-mono">{senderNumber}</span>
              </div>
              <div className="flex justify-between border-t border-slate-800 pt-2">
                <span className="text-slate-400">স্ট্যাটাস:</span>
                <span className="text-amber-400 font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  অ্যাডমিন অনুমোদনের অপেক্ষমাণ (Pending)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-300 text-[11px] flex items-center justify-center gap-2 max-w-sm mx-auto">
              <Send className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>টেলিগ্রাম ও হোয়াটসঅ্যাপে অ্যাডমিনের কাছে নোটিফিকেশন পাঠানো হয়েছে।</span>
            </div>

            <p className="text-[11px] text-slate-400">
              অ্যাডমিন আপনার বিকাশ/নগদ ব্যালেন্স ভেরিফাই করে অনুমোদন করলেই সাথে সাথে প্যাকেজ সক্রিয় হবে।
            </p>

            <div className="space-y-2 pt-1 max-w-sm mx-auto">
              <a
                href={`https://wa.me/${(billingConfig?.whatsappNumber || '+8801712345678').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `আসসালামু আলাইকুম! VoiceAI BD-তে আমি ${checkoutPlan.name} প্যাকেজ (৳${checkoutPlan.price} BDT) অর্ডার করেছি।\n\nপ্রেরকের নম্বর: ${senderNumber}\nপেমেন্ট মেথড: ${selectedMethod}\nTrxID: ${trxId.toUpperCase()}\n\nঅনুগ্রহ করে ভেরিফাই করে অনুমোদন করুন। ধন্যবাদ!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50"
              >
                <MessageSquare className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপে TrxID ও স্ক্রিনশট পাঠান</span>
              </a>

              <button
                onClick={handleClose}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                ঠিক আছে, বন্ধ করুন
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form View */
          <form onSubmit={handleSubmitPayment} className="p-5 space-y-4 text-xs">
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                পেমেন্ট গেটওয়ে নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('bKash')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    selectedMethod === 'bKash'
                      ? 'border-pink-500 bg-pink-950/40 text-pink-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-black text-pink-400">bKash</span>
                  <span className="text-[10px]">বিকাশ (Personal)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('Nagad')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    selectedMethod === 'Nagad'
                      ? 'border-orange-500 bg-orange-950/40 text-orange-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-black text-orange-400">Nagad</span>
                  <span className="text-[10px]">নগদ (Personal)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('Bank')}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                    selectedMethod === 'Bank'
                      ? 'border-indigo-500 bg-indigo-950/40 text-indigo-300 shadow-sm'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-400" />
                  <span className="text-[10px]">ব্যাংক ট্রান্সফার</span>
                </button>
              </div>
            </div>

            {/* Official Receiver Number & Copy Card */}
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-semibold text-slate-300">
                  {selectedMethod === 'bKash'
                    ? 'অফিশিয়াল বিকাশ প্রাপক নম্বর:'
                    : selectedMethod === 'Nagad'
                    ? 'অফিশিয়াল নগদ প্রাপক নম্বর:'
                    : 'অফিশিয়াল ব্যাংক অ্যাকাউন্ট:'}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-300 font-mono">
                  {selectedMethod === 'bKash'
                    ? billingConfig.bkashType || 'Send Money'
                    : selectedMethod === 'Nagad'
                    ? billingConfig.nagadType || 'Send Money'
                    : 'Online Deposit'}
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-950/90 border border-slate-700/60 rounded-xl p-2.5">
                <span className="text-sm sm:text-base font-black font-mono text-emerald-400 tracking-wider">
                  {activeReceiverNumber}
                </span>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedNumber ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>কপি করুন</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                {activeInstructions}
              </p>
            </div>

            {/* Customer Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  আপনার প্রেরকের {selectedMethod} মোবাইল নম্বর:
                </label>
                <input
                  type="text"
                  placeholder="যেমন: 01711223344"
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  ট্রানজেকশন আইডি (TrxID):
                </label>
                <input
                  type="text"
                  placeholder="যেমন: BK9A7X21MN"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400 uppercase font-bold placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  অতিরিক্ত নোট বা রেফারেন্স (ঐচ্ছিক):
                </label>
                <input
                  type="text"
                  placeholder="যেমন: Dhaka Call Center Upgrade"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500 text-xs"
                />
              </div>
            </div>

            {/* Total Summary */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-400">পরিশোধযোগ্য মোট ফি:</p>
                <p className="text-base font-black text-white font-mono">
                  ৳ {checkoutPlan.price.toLocaleString('en-US')} BDT
                </p>
              </div>
              <div className="text-right text-[11px] text-indigo-300">
                <span>{checkoutPlan.minutesLimit} AI ভয়েস মিনিট অন্তর্ভুক্ত</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-xs shadow-lg shadow-emerald-950 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  <span>ট্রানজেকশন প্রসেসিং ও সংরক্ষণ হচ্ছে...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>পেমেন্ট নিশ্চিত করুন ও অনুমোদনের জন্য জমা দিন</span>
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
