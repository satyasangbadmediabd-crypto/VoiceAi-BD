import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CallLog } from '../types';
import {
  PhoneForwarded,
  Play,
  Square,
  FileText,
  Sparkles,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  User,
  Bot,
  Calendar,
  X,
  TrendingUp,
  Share2
} from 'lucide-react';

export const CallHistoryPage: React.FC = () => {
  const { calls, agents } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [agentFilter, setAgentFilter] = useState('ALL');

  // Modals state
  const [activeTranscriptCall, setActiveTranscriptCall] = useState<CallLog | null>(null);
  const [activeSummaryCall, setActiveSummaryCall] = useState<CallLog | null>(null);
  const [playingCallId, setPlayingCallId] = useState<string | null>(null);

  const filteredCalls = calls.filter((c) => {
    const matchesSearch =
      c.caller.includes(search) ||
      c.agentName.toLowerCase().includes(search.toLowerCase()) ||
      c.summary.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    const matchesAgent = agentFilter === 'ALL' || c.agentId === agentFilter;
    return matchesSearch && matchesStatus && matchesAgent;
  });

  const handleSimulateAudioPlay = (call: CallLog) => {
    if (playingCallId === call.id) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setPlayingCallId(null);
      return;
    }

    setPlayingCallId(call.id);
    if ('speechSynthesis' in window && call.transcript.length > 0) {
      try {
        window.speechSynthesis.cancel();
        const firstLine = call.transcript[0].text;
        const utterance = new SpeechSynthesisUtterance(firstLine);
        utterance.lang = 'bn-BD';
        utterance.onend = () => setPlayingCallId(null);
        utterance.onerror = () => setPlayingCallId(null);
        window.speechSynthesis.speak(utterance);
      } catch {
        setTimeout(() => setPlayingCallId(null), 3500);
      }
    } else {
      setTimeout(() => setPlayingCallId(null), 3500);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <PhoneForwarded className="w-6 h-6 text-indigo-400" />
            <span>Call History & Logs</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            সকল ইনকামিং কলের ফুল অডিও সিমুলেশন, বাংলা ট্রান্সক্রিপ্ট ও এআই সামারি
          </p>
        </div>

        <span className="text-xs text-slate-400">
          মোট রেকর্ডকৃত কল: <strong className="text-white">{calls.length}টি</strong>
        </span>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="কলার নম্বর বা সামারি দিয়ে সার্চ..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">সকল কল স্টেটাস</option>
            <option value="Qualified Lead">Qualified Lead</option>
            <option value="Interested">Interested</option>
            <option value="Appointment Booked">Appointment Booked</option>
            <option value="Resolved">Resolved</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
        </div>

        {/* Agent Filter */}
        <div className="relative">
          <select
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">সকল AI Agent</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Calls Table */}
      <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden shadow-lg">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Caller</th>
                <th className="px-5 py-3">Agent</th>
                <th className="px-5 py-3">Duration</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredCalls.map((call, idx) => (
                <tr key={`${call.id}-${idx}`} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 font-mono font-bold text-white flex items-center gap-2">
                    <PhoneForwarded className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{call.caller}</span>
                  </td>
                  <td className="px-5 py-3.5 font-medium text-slate-200">{call.agentName}</td>
                  <td className="px-5 py-3.5 font-mono text-slate-300">{call.duration}</td>
                  <td className="px-5 py-3.5 text-slate-400">{call.date}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        call.status === 'Qualified Lead'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                          : call.status === 'Interested'
                          ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {call.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {/* Play Audio Button */}
                      <button
                        onClick={() => handleSimulateAudioPlay(call)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                          playingCallId === call.id
                            ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        }`}
                      >
                        {playingCallId === call.id ? (
                          <>
                            <Square className="w-3 h-3 fill-current" />
                            <span>থামুন</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" />
                            <span>Play Audio</span>
                          </>
                        )}
                      </button>

                      {/* View Transcript */}
                      <button
                        onClick={() => setActiveTranscriptCall(call)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-indigo-950 hover:text-indigo-300 border border-slate-700 text-slate-300 text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Transcript</span>
                      </button>

                      {/* AI Summary */}
                      <button
                        onClick={() => setActiveSummaryCall(call)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-[11px] font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>AI Summary</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-slate-800">
          {filteredCalls.map((call, idx) => (
            <div key={`${call.id}-${idx}`} className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-white text-xs">{call.caller}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    call.status === 'Qualified Lead'
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      : 'bg-indigo-950 text-indigo-300 border-indigo-700'
                  }`}
                >
                  {call.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{call.agentName}</span>
                <span className="font-mono">{call.duration} • {call.date}</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => handleSimulateAudioPlay(call)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <Play className="w-3 h-3" />
                  <span>Audio</span>
                </button>
                <button
                  onClick={() => setActiveTranscriptCall(call)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <FileText className="w-3 h-3" />
                  <span>Transcript</span>
                </button>
                <button
                  onClick={() => setActiveSummaryCall(call)}
                  className="flex-1 py-1.5 rounded-lg bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-semibold flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Summary</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transcript Modal with realistic Bangla dialogues */}
      {activeTranscriptCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-[#0d1322] border border-slate-700 p-5 space-y-4 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span>Full Call Transcript</span>
                </h3>
                <p className="text-[11px] text-slate-400">
                  {activeTranscriptCall.caller} • {activeTranscriptCall.agentName} ({activeTranscriptCall.duration})
                </p>
              </div>
              <button
                onClick={() => setActiveTranscriptCall(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Dialogue list */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {activeTranscriptCall.transcript.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl ${
                    msg.speaker === 'AI'
                      ? 'bg-indigo-950/60 border border-indigo-800/60 text-indigo-100 ml-4'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 mr-4'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1">
                      {msg.speaker === 'AI' ? <Bot className="w-3 h-3 text-indigo-400" /> : <User className="w-3 h-3 text-slate-400" />}
                      {msg.speaker === 'AI' ? 'AI Agent' : 'Caller'}
                    </span>
                    <span className="font-mono">{msg.time}</span>
                  </div>
                  <p className="leading-relaxed font-sans">{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveTranscriptCall(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Summary Modal */}
      {activeSummaryCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-slate-700 p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">AI Call Summary</h3>
                  <p className="text-[11px] text-slate-400">{activeSummaryCall.caller}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSummaryCall(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Customer Interest:</span>
                  <span className="font-bold text-emerald-400">High (৮৫%)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Intent:</span>
                  <span className="font-bold text-indigo-300">Course / Product Inquiry</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Collected Lead:</span>
                  <span className="font-bold text-emerald-400">Yes (Auto-Synced)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Follow-up:</span>
                  <span className="font-bold text-amber-400">Required within 24h</span>
                </div>
              </div>

              <div>
                <h5 className="text-[11px] font-semibold text-slate-300 mb-1">কথোপকথনের মূল পয়েন্ট:</h5>
                <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 leading-relaxed font-sans">
                  {activeSummaryCall.summary}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveSummaryCall(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md cursor-pointer"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
