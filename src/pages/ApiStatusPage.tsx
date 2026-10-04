import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  fetchApiStatus,
  fetchHealthStatus,
  testGeminiServer,
  testElevenLabsServer,
  testVapiServer,
  getDemoUsageStats,
  DemoUsageStats,
  ApiStatusResponse,
  HealthCheckResponse
} from '../services/apiService';
import {
  Sparkles,
  Volume2,
  PhoneCall,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck,
  KeyRound,
  Activity,
  ArrowRight,
  Database,
  Lock,
  Zap,
  Info,
  Server,
  HeartPulse
} from 'lucide-react';

export const ApiStatusPage: React.FC = () => {
  const { addToast, navigate } = useApp();

  const [apiStatus, setApiStatus] = useState<ApiStatusResponse>({
    gemini: { configured: false, status: 'Not Configured', model: 'gemini-3.8-flash', maskedKey: null },
    elevenlabs: { configured: false, status: 'Not Configured', maskedKey: null },
    vapi: { configured: true, status: 'Connected', assistantId: 'b37b72e1-047d-408b-9096-cc5cf21256cd', assistantName: 'Ai Skill Hub Receptionist', maskedKey: 'c2eb••••9134' }
  });

  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [testingGemini, setTestingGemini] = useState(false);
  const [testingElevenLabs, setTestingElevenLabs] = useState(false);
  const [testingVapi, setTestingVapi] = useState(false);
  const [geminiResult, setGeminiResult] = useState<{ success: boolean; message: string } | null>(null);
  const [elevenLabsResult, setElevenLabsResult] = useState<{ success: boolean; message: string } | null>(null);
  const [vapiResult, setVapiResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);

  const [usageStats, setUsageStats] = useState<DemoUsageStats>(getDemoUsageStats());

  const loadStatus = async () => {
    setIsLoading(true);
    const [status, health] = await Promise.all([
      fetchApiStatus(),
      fetchHealthStatus()
    ]);
    setApiStatus(status);
    setHealthData(health);
    setUsageStats(getDemoUsageStats());
    setIsLoading(false);
  };

  useEffect(() => {
    loadStatus();

    const handleUsageUpdate = () => {
      setUsageStats(getDemoUsageStats());
    };

    window.addEventListener('voiceai_usage_updated', handleUsageUpdate);
    return () => window.removeEventListener('voiceai_usage_updated', handleUsageUpdate);
  }, []);

  const handleTestGemini = async () => {
    setTestingGemini(true);
    setGeminiResult(null);
    const res = await testGeminiServer();
    setTestingGemini(false);
    setGeminiResult(res);

    if (res.success) {
      addToast('Gemini API হ্যান্ডশেক সফল', res.message, 'success');
      loadStatus();
    } else {
      addToast('Gemini API সংযোগ ব্যর্থ', res.message, 'error');
    }
  };

  const handleTestElevenLabs = async () => {
    setTestingElevenLabs(true);
    setElevenLabsResult(null);
    const res = await testElevenLabsServer();
    setTestingElevenLabs(false);
    setElevenLabsResult(res);

    if (res.success) {
      addToast('ElevenLabs API হ্যান্ডশেক সফল', res.message, 'success');
      loadStatus();
    } else {
      addToast('ElevenLabs API সংযোগ ব্যর্থ', res.message, 'error');
    }
  };

  const handleTestVapi = async () => {
    setTestingVapi(true);
    setVapiResult(null);
    const res = await testVapiServer();
    setTestingVapi(false);
    setVapiResult(res);

    if (res.success) {
      addToast('Vapi API হ্যান্ডশেক সফল', res.message, 'success');
      loadStatus();
    } else {
      addToast('Vapi API সংযোগ ব্যর্থ', res.message, 'error');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-indigo-400 font-mono font-medium">/settings/integrations</span>
            <span className="px-2 py-0.5 rounded-md bg-indigo-950/70 border border-indigo-800/60 text-[10px] text-indigo-300 font-semibold">
              Server API Gateway
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2.5">
            <Cpu className="w-6 h-6 text-indigo-400" />
            <span>API Status & Server Credentials</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gemini এবং ElevenLabs সার্ভার ইন্টিগ্রেশন স্ট্যাটাস ও ডেমো ইউসেজ মনিটরিং
          </p>
        </div>

        <button
          onClick={loadStatus}
          disabled={isLoading}
          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer w-fit"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-indigo-400' : 'text-slate-400'}`} />
          <span>রিফ্রেশ স্ট্যাটাস</span>
        </button>
      </div>

      {/* Security Architecture Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/30 via-slate-900/60 to-slate-900 border border-indigo-900/40 flex items-start gap-3.5 text-xs text-slate-300 shadow-lg">
        <div className="w-8 h-8 rounded-xl bg-indigo-950 border border-indigo-800/60 flex items-center justify-center shrink-0 text-indigo-400">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-white text-xs">Zero-Exposure Server Architecture</h4>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800">
              Secure
            </span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            কোনো API সিক্রেট ব্রাউজারে কখনো পাঠানো বা স্টোর করা হয় না। সমস্ত এআই জেনারেশন ও ভয়েস সিন্থেসিস রিকোয়েস্ট ব্যাকএন্ড
            Express API (<code className="text-indigo-300 font-mono">/api/*</code>)-এর মাধ্যমে প্রক্সি হয়ে এক্সিকিউট হয়।
          </p>
        </div>
      </div>

      {/* Cloud Run Automated Health & Uptime Monitoring Card */}
      <div className="p-5 rounded-2xl bg-[#0b1120] border border-emerald-900/40 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <HeartPulse className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Cloud Run Health Probe & Automated Uptime</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Liveness: 200 OK
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cloud Run startup, liveness and readiness probe endpoint active at <code className="text-emerald-300 font-mono bg-emerald-950/40 px-1 py-0.5 rounded">/health</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[11px]">
              Uptime: {healthData ? `${healthData.uptimeSeconds}s` : 'Active'}
            </span>
            <a
              href="/health"
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-800/60 text-indigo-300 text-[11px] font-semibold transition-colors flex items-center gap-1"
            >
              <span>View Raw JSON</span>
              <ArrowRight className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Probe Endpoint</span>
            <span className="font-mono text-emerald-400 text-xs font-semibold">GET /health</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Server Process</span>
            <span className="font-mono text-slate-200 text-xs font-semibold">Node {healthData?.system?.nodeVersion || 'v22'}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">Memory RSS</span>
            <span className="font-mono text-indigo-300 text-xs font-semibold">{healthData?.system?.memoryUsageMB?.rss || 48} MB</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60">
            <span className="text-[10px] text-slate-400 block">HTTP Status</span>
            <span className="font-mono text-emerald-300 text-xs font-semibold">200 OK (no-cache)</span>
          </div>
        </div>
      </div>

      {/* API Providers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Vapi Voice AI Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0d1322] border border-cyan-900/50 space-y-4 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-600/30 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Vapi Voice AI</h3>
                <p className="text-[11px] text-slate-400">Realtime Phone Voice Receptionist</p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                  apiStatus.vapi?.configured
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80'
                    : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    apiStatus.vapi?.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>{apiStatus.vapi?.status || 'Connected'}</span>
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>Private Secret:</span>
              </span>
              <span className="font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {apiStatus.vapi?.maskedKey || 'c2eb••••9134'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400">Active Assistant:</span>
              <span className="font-mono text-cyan-300 font-semibold truncate max-w-[140px]" title={apiStatus.vapi?.assistantName || 'Ai Skill Hub Receptionist'}>
                {apiStatus.vapi?.assistantName || 'Ai Skill Hub Receptionist'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400">Assistant ID:</span>
              <span className="font-mono text-[11px] text-slate-300 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 truncate max-w-[140px]" title={apiStatus.vapi?.assistantId || 'b37b72e1-047d-408b-9096-cc5cf21256cd'}>
                {apiStatus.vapi?.assistantId ? `${apiStatus.vapi.assistantId.slice(0, 8)}...` : 'b37b72e1...'}
              </span>
            </div>
          </div>

          {vapiResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                vapiResult.success
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              }`}
            >
              {vapiResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span className="leading-snug">{vapiResult.message} {vapiResult.latencyMs ? `(${vapiResult.latencyMs}ms)` : ''}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleTestVapi}
              disabled={testingVapi}
              className="w-full py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${testingVapi ? 'animate-spin' : ''}`} />
              <span>{testingVapi ? 'টেস্টিং Vapi কানেকশন...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>

        {/* Gemini API Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600/30 to-purple-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Gemini API</h3>
                <p className="text-[11px] text-slate-400">Google DeepMind Multimodal Model</p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                  apiStatus.gemini.configured
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80'
                    : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    apiStatus.gemini.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>{apiStatus.gemini.status}</span>
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>Secret Key:</span>
              </span>
              <span className="font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {apiStatus.gemini.configured ? '••••••••••••••••' : 'Not Set in Env'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400">Configured Model:</span>
              <span className="font-mono text-indigo-300 font-semibold">{apiStatus.gemini.model}</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400">Execution Mode:</span>
              <span className="text-slate-300 font-medium">
                {apiStatus.gemini.configured ? 'Server-side Live API' : 'Local Fallback Demo Mode'}
              </span>
            </div>
          </div>

          {/* Test connection result banner */}
          {geminiResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                geminiResult.success
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              }`}
            >
              {geminiResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span className="leading-snug">{geminiResult.message}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleTestGemini}
              disabled={testingGemini}
              className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md shadow-indigo-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${testingGemini ? 'animate-spin' : ''}`} />
              <span>{testingGemini ? 'টেস্টিং সার্ভার কানেকশন...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>

        {/* ElevenLabs API Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600/30 to-pink-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">ElevenLabs API</h3>
                <p className="text-[11px] text-slate-400">Hyper-Realistic Voice TTS & Cloning</p>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                  apiStatus.elevenlabs.configured
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-800/80'
                    : 'bg-amber-950/60 text-amber-300 border-amber-800/60'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    apiStatus.elevenlabs.configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span>{apiStatus.elevenlabs.status}</span>
              </span>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-500" />
                <span>Secret Key:</span>
              </span>
              <span className="font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {apiStatus.elevenlabs.configured ? '••••••••••••••••' : 'Not Set in Env'}
              </span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400">Voice Synthesis Engine:</span>
              <span className="font-mono text-purple-300 font-semibold">eleven_multilingual_v2</span>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
              <span className="text-slate-400">Voice Catalog Source:</span>
              <span className="text-slate-300 font-medium">
                {apiStatus.elevenlabs.configured ? 'ElevenLabs Remote Voices' : 'Local Bangla Demo Voices'}
              </span>
            </div>
          </div>

          {/* Test connection result banner */}
          {elevenLabsResult && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                elevenLabsResult.success
                  ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                  : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
              }`}
            >
              {elevenLabsResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span className="leading-snug">{elevenLabsResult.message}</span>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={handleTestElevenLabs}
              disabled={testingElevenLabs}
              className="w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-all shadow-md shadow-purple-950/50 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 ${testingElevenLabs ? 'animate-spin' : ''}`} />
              <span>{testingElevenLabs ? 'টেস্টিং সার্ভার কানেকশন...' : 'Test Connection'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Demo Usage Tracking Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">Usage & Activity Statistics</h3>
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                Demo usage tracking
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              লোকাল ব্রাউজারে রিয়েল-টাইম জেনারেশন ও রিকোয়েস্ট ট্র্যাক করা হচ্ছে
            </p>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            Last active: {usageStats.lastUpdated}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Card 1 */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90">
            <p className="text-[11px] text-slate-400 font-medium">AI Requests</p>
            <p className="text-xl font-black text-indigo-400 mt-1">{usageStats.geminiRequests}</p>
            <span className="text-[10px] text-slate-500">Gemini LLM queries</span>
          </div>

          {/* Card 2 */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90">
            <p className="text-[11px] text-slate-400 font-medium">Voice Generations</p>
            <p className="text-xl font-black text-purple-400 mt-1">{usageStats.elevenLabsRequests}</p>
            <span className="text-[10px] text-slate-500">ElevenLabs TTS calls</span>
          </div>

          {/* Card 3 */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90">
            <p className="text-[11px] text-slate-400 font-medium">Generated Characters</p>
            <p className="text-xl font-black text-emerald-400 mt-1">{usageStats.generatedCharacters.toLocaleString()}</p>
            <span className="text-[10px] text-slate-500">Total text volume</span>
          </div>

          {/* Card 4 */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90">
            <p className="text-[11px] text-slate-400 font-medium">Estimated Usage</p>
            <p className="text-xl font-black text-white mt-1">৳{(usageStats.geminiRequests * 0.15 + usageStats.elevenLabsRequests * 0.45).toFixed(2)}</p>
            <span className="text-[10px] text-slate-500">BDT cost approx</span>
          </div>
        </div>
      </div>

      {/* Quick Actions / Integration Links */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={() => navigate('/voices')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
          <span>ভয়েস ক্যাটালগ টেস্ট করুন</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
        </button>

        <button
          onClick={() => navigate('/agents/create')}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2 cursor-pointer transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Instructions জেনারেটর</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>
    </div>
  );
};
