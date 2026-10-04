import React, { useState } from 'react';
import { Agent } from '../types';
import {
  X,
  Code2,
  Globe,
  Copy,
  Check,
  Phone,
  Webhook,
  Terminal,
  ExternalLink,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

interface AgentIntegrationModalProps {
  agent: Agent;
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'html' | 'react' | 'curl' | 'webhook' | 'telephony';

export const AgentIntegrationModal: React.FC<AgentIntegrationModalProps> = ({
  agent,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('html');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const assistantId = agent.vapiAssistantId || 'b37b72e1-047d-408b-9096-cc5cf21256cd';
  const publicKey = '51a6f3cb-3964-4047-87f0-7e7278a94e0b';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const htmlSnippet = `<!-- 1. Vapi Voice AI Call Button (যেকোনো ওয়েবসাইট, WordPress, Shopify, HTML-এ বসান) -->
<script
  src="https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js"
  defer
></script>

<vapi-btn
  public-key="${publicKey}"
  assistant-id="${assistantId}"
  position="bottom-right"
  color="#4f46e5"
></vapi-btn>`;

  const reactSnippet = `// 1. প্যাকেজ ইনস্টল করুন:
// npm install @vapi-ai/web lucide-react

import React, { useState, useEffect } from 'react';
import Vapi from '@vapi-ai/web';

const vapi = new Vapi('${publicKey}');

export const VoiceCallButton = () => {
  const [isCalling, setIsCalling] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    vapi.on('call-start', () => setIsCalling(true));
    vapi.on('call-end', () => {
      setIsCalling(false);
      setIsSpeaking(false);
    });
    vapi.on('speech-start', () => setIsSpeaking(true));
    vapi.on('speech-end', () => setIsSpeaking(false));
  }, []);

  const toggleCall = () => {
    if (isCalling) {
      vapi.stop();
    } else {
      vapi.start('${assistantId}');
    }
  };

  return (
    <button
      onClick={toggleCall}
      className="px-5 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold flex items-center gap-2 shadow-lg cursor-pointer"
    >
      <span>{isCalling ? (isSpeaking ? 'Agent Speaking...' : 'Listening...') : 'Call AI Assistant'}</span>
    </button>
  );
};`;

  const curlSnippet = `# Vapi REST API দিয়ে সরাসরি আউটবাউন্ড কল বা ওয়েব টেস্ট করুন
curl -X POST https://api.vapi.ai/call/web \\
  -H "Authorization: Bearer c2eb13b8-1dd0-4604-9f7d-eafc8e2e9134" \\
  -H "Content-Type: application/json" \\
  -d '{
    "assistantId": "${assistantId}"
  }'`;

  const webhookSnippet = `// Vapi Webhook Handler (Node.js / Express)
// কল শেষ হলে Vapi স্বয়ংক্রিয়ভাবে পুরো ট্রান্সক্রিপ্ট ও লিড ডেটা পাঠাবে
app.post('/api/vapi-webhook', (req, res) => {
  const event = req.body.message;

  if (event.type === 'end-of-call-report') {
    const { transcript, summary, customer } = event;
    console.log('Customer Lead:', customer?.number);
    console.log('Call Summary:', summary);
    console.log('Full Transcript:', transcript);
    // এখানে আপনার CRM বা Google Sheets-এ সেভ করতে পারেন
  }

  res.status(200).json({ status: 'ok' });
});`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#0b0f17] border border-slate-800 shadow-2xl overflow-hidden my-auto text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-[#0d131f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-md">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Connect & Embed Agent</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800">
                  Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                <strong className="text-indigo-300">{agent.name}</strong>-কে ওয়েবসাইট, অ্যাপ বা ফোনে কানেক্ট করার কোড
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Assistant Keys Bar */}
        <div className="p-3 sm:px-5 bg-[#070a10] border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Assistant ID:</span>
            <span className="font-mono text-cyan-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 text-[11px]">
              {assistantId}
            </span>
            <button
              onClick={() => copyToClipboard(assistantId, 'assistant-id')}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Copy ID"
            >
              {copiedKey === 'assistant-id' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Public Key:</span>
            <span className="font-mono text-indigo-300 bg-slate-900 px-2 py-1 rounded border border-slate-800 text-[11px] truncate max-w-[120px] sm:max-w-none">
              {publicKey}
            </span>
            <button
              onClick={() => copyToClipboard(publicKey, 'public-key')}
              className="p-1 text-slate-400 hover:text-white transition-colors"
              title="Copy Public Key"
            >
              {copiedKey === 'public-key' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-[#0d131f] px-2 sm:px-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'html'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Website Widget (HTML/CMS)</span>
          </button>

          <button
            onClick={() => setActiveTab('react')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'react'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>React / Next.js App</span>
          </button>

          <button
            onClick={() => setActiveTab('telephony')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'telephony'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Phone Number (IP/Twilio)</span>
          </button>

          <button
            onClick={() => setActiveTab('webhook')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'webhook'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Webhook className="w-3.5 h-3.5" />
            <span>Webhooks & CRM</span>
          </button>

          <button
            onClick={() => setActiveTab('curl')}
            className={`px-3 py-2.5 text-xs font-semibold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
              activeTab === 'curl'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>REST API</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* TAB 1: HTML Script Widget */}
          {activeTab === 'html' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-800/40 text-xs text-indigo-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">১-ক্লিকে যেকোনো সাইটে যুক্ত করুন:</strong> নিচের কোডটি আপনার
                  WordPress, Shopify, Webflow, Wix বা সাধারণ HTML ওয়েবসাইটের <code className="text-cyan-300 font-mono">&lt;/body&gt;</code> ট্যাগের ঠিক আগে পেস্ট করে দিন। সাথে সাথে ওয়েবসাইটে সুন্দর একটি ফ্লোটিং ভয়েস কল বাটন দেখতে পাবেন!
                </div>
              </div>

              <div className="relative">
                <pre className="p-3.5 rounded-xl bg-[#070a10] border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                  {htmlSnippet}
                </pre>
                <button
                  onClick={() => copyToClipboard(htmlSnippet, 'html')}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  {copiedKey === 'html' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>কপি কোড</span>
                    </>
                  )}
                </button>
              </div>

              <div className="space-y-1.5 text-xs text-slate-400">
                <p className="font-semibold text-slate-300">WordPress সাইটে বসানোর ধাপ:</p>
                <ol className="list-decimal list-inside space-y-1 pl-1 text-[11px]">
                  <li>WordPress Dashboard এ যান &gt; <strong>Plugins</strong> &gt; Add New &gt; <em>"WPCode"</em> বা <em>"Insert Headers and Footers"</em> ইনস্টল করুন।</li>
                  <li><strong>Scripts in Footer</strong> বক্সে উপরের কোডটি পেস্ট করে Save Changes চাপুন।</li>
                  <li>ওয়েবসাইট রিফ্রেশ করলেই ডানদিকের নিচে কল বাটন ভেসে উঠবে।</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: React / Next.js */}
          {activeTab === 'react' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                <Code2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  React বা Next.js ফ্রন্টএন্ডে <code className="text-cyan-300 font-mono">@vapi-ai/web</code> SDK দিয়ে সরাসরি ইন্টারঅ্যাক্টিভ ভয়েস বাটন বা কাস্টম ইন্টারফেস তৈরি করতে পারেন।
                </div>
              </div>

              <div className="relative">
                <pre className="p-3.5 rounded-xl bg-[#070a10] border border-slate-800 text-[11px] font-mono text-indigo-300 overflow-x-auto max-h-64">
                  {reactSnippet}
                </pre>
                <button
                  onClick={() => copyToClipboard(reactSnippet, 'react')}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  {copiedKey === 'react' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>কপি কোড</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Telephony (Real Phone Call) */}
          {activeTab === 'telephony' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-xs text-amber-200 flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white">সরাসরি মোবাইল বা টেলিফোন নম্বর থেকে কল নেওয়ার নিয়ম:</strong>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#070a10] border border-slate-800 space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2 font-bold text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>পদ্ধতি ১: Vapi Dashboard এ Twilio বা দেশীয় নম্বর যুক্ত করা</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                  ১. <a href="https://dashboard.vapi.ai/phone-numbers" target="_blank" rel="noreferrer" className="text-cyan-400 underline inline-flex items-center gap-1">Vapi Phone Numbers <ExternalLink className="w-3 h-3" /></a> সেকশনে যান।<br />
                  ২. <strong>"Import Twilio Number"</strong> অথবা <strong>"SIP Trunk"</strong> সিলেক্ট করুন।<br />
                  ৩. আপনার কেনা নম্বরের সাথে <strong>Assistant ID ({assistantId})</strong> সিলেক্ট করে দিন।<br />
                  ৪. এবার ওই নম্বরে সাধারণ ফোন থেকে কল করলে স্বয়ংক্রিয়ভাবে আপনার এআই এজেন্ট বাংলায় কল রিসিভ করবে!
                </p>

                <div className="flex items-center gap-2 font-bold text-white pt-2 border-t border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>পদ্ধতি ২: বাংলাদেশী IP-TSP (BTCL, AmberIT, Brilliant, BDCom)</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed pl-6">
                  বাংলাদেশী +880 096xx সিরিজের নম্বর দিয়ে Vapi তে SIP Trunking কনফিগার করা যায়, যার ফলে লোকাল কল রেটে গ্রাহকরা সরাসরি এজেন্টকে কল করতে পারেন।
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Webhooks & CRM */}
          {activeTab === 'webhook' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-800/40 text-xs text-purple-200 flex items-start gap-2.5">
                <Webhook className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  প্রতিটি কল শেষ হওয়ার পর কলারের নাম, ফোন নম্বর, সমস্যা এবং অডিও রেকর্ডিং স্বয়ংক্রিয়ভাবে আপনার সার্ভার বা CRM-এ চলে যাবে।
                </div>
              </div>

              <div className="relative">
                <pre className="p-3.5 rounded-xl bg-[#070a10] border border-slate-800 text-[11px] font-mono text-purple-300 overflow-x-auto max-h-56">
                  {webhookSnippet}
                </pre>
                <button
                  onClick={() => copyToClipboard(webhookSnippet, 'webhook')}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  {copiedKey === 'webhook' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>কপি কোড</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: REST API / cURL */}
          {activeTab === 'curl' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300">
                ব্যাকএন্ড সার্ভিস বা পাইথন/নোডজেএস স্ক্রিপ্ট থেকে API রিকোয়েস্ট পাঠিয়ে কল শুরু বা স্ট্যাটাস চেক করতে পারেন।
              </div>

              <div className="relative">
                <pre className="p-3.5 rounded-xl bg-[#070a10] border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto">
                  {curlSnippet}
                </pre>
                <button
                  onClick={() => copyToClipboard(curlSnippet, 'curl')}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1 border border-slate-700 cursor-pointer"
                >
                  {copiedKey === 'curl' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">কপি হয়েছে</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>কপি কোড</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0d131f] flex items-center justify-between">
          <span className="text-xs text-slate-400">
            সমস্যা হলে Vapi Dashboard থেকে সরাসরি কনফিগারেশন চেক করতে পারেন।
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs cursor-pointer shadow-md"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
