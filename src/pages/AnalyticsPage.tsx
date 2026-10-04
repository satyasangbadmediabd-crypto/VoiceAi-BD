import React from 'react';
import { useApp } from '../context/AppContext';
import {
  TrendingUp,
  PhoneCall,
  CheckCircle2,
  Clock,
  Target,
  BarChart3,
  PieChart,
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { user } = useApp();

  const dailyCalls = [
    { day: 'রবিবার', calls: 32, leads: 8 },
    { day: 'সোমবার', calls: 48, leads: 14 },
    { day: 'মঙ্গলবার', calls: 52, leads: 16 },
    { day: 'বুধবার', calls: 45, leads: 11 },
    { day: 'বৃহস্পতিবার', calls: 62, leads: 19 },
    { day: 'শুক্রবার', calls: 24, leads: 6 },
    { day: 'শনিবার', calls: 38, leads: 10 }
  ];

  const purposes = [
    { label: 'কোর্স / প্রোডাক্ট ইনকোয়ারি', percentage: 46, color: 'bg-indigo-500' },
    { label: 'প্রাইসিং ও ডিসকাউন্ট অফার', percentage: 24, color: 'bg-purple-500' },
    { label: 'কাস্টমার সাপোর্ট ও হেল্পলাইন', percentage: 18, color: 'bg-emerald-500' },
    { label: 'অর্ডার স্ট্যাটাস ও ডেলিভারি', percentage: 12, color: 'bg-amber-500' }
  ];

  const maxCall = Math.max(...dailyCalls.map((d) => d.calls));

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
            <span>Voice Analytics & Insights</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            AI Voice Agent-এর কল পারফরম্যান্স, অ্যানসারিং রেট ও কনভার্সন অ্যানালাইসিস
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 font-medium">
            গত ৭ দিনের রিপোর্ট
          </span>
        </div>
      </div>

      {/* 4 Key Performance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Calls</span>
            <PhoneCall className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-white">142</div>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+২২% গত সপ্তাহের চেয়ে</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Answered Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">98.4%</div>
          <p className="text-[11px] text-slate-400 mt-1">০% মিসড কল (২৪/৭ অনলাইন)</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Avg Call Duration</span>
            <Clock className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">2m 14s</div>
          <p className="text-[11px] text-slate-400 mt-1">টু-দ্য-পয়েন্ট ও প্রাসঙ্গিক উত্তর</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0d1322] border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Lead Conversion</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-400">34%</div>
          <p className="text-[11px] text-emerald-400 mt-1">৪৮টি কোয়ালিফাইড লিড</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calls by Day Bar Visual */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0d1322] border border-slate-800 p-5 sm:p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">দৈনিক কল ও লিড ভলিউম (গত ৭ দিন)</h3>
              <p className="text-xs text-slate-400 mt-0.5">সবচেয়ে বেশি কল বৃহস্পতিবারে রেকর্ড হয়েছে</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                <span>কল</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
                <span>লিড</span>
              </div>
            </div>
          </div>

          <div className="pt-6 grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 border-b border-slate-800 pb-2">
            {dailyCalls.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] text-slate-400 font-mono group-hover:text-white transition-colors">
                  {item.calls}
                </div>
                <div className="w-full max-w-[36px] flex items-end gap-1 h-40">
                  {/* Calls Bar */}
                  <div
                    className="w-1/2 bg-indigo-600 rounded-t-md group-hover:bg-indigo-500 transition-all"
                    style={{ height: `${(item.calls / maxCall) * 100}%` }}
                    title={`কল: ${item.calls}`}
                  />
                  {/* Leads Bar */}
                  <div
                    className="w-1/2 bg-emerald-500 rounded-t-md group-hover:bg-emerald-400 transition-all"
                    style={{ height: `${(item.leads / maxCall) * 100}%` }}
                    title={`লিড: ${item.leads}`}
                  />
                </div>
                <span className="text-[10px] sm:text-xs text-slate-400 font-medium truncate w-full text-center">
                  {item.day.slice(0, 3)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call Purpose Breakdown */}
        <div className="rounded-2xl bg-[#0d1322] border border-slate-800 p-5 sm:p-6 shadow-lg flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">কলের উদ্দেশ্য বিশ্লেষণ</h3>
            <p className="text-xs text-slate-400 mb-5">কাস্টমাররা কী বিষয় নিয়ে বেশি কথা বলছেন</p>

            <div className="space-y-4">
              {purposes.map((p, i) => (
                <div key={i} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300">{p.label}</span>
                    <span className="font-bold text-white font-mono">{p.percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${p.color} rounded-full`}
                      style={{ width: `${p.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-900/50 text-[11px] text-indigo-300 leading-relaxed mt-4">
            💡 <strong>এআই সামারি ইনসাইট:</strong> বেশিরভাগ কলার কোর্স ফি ও ডিসকাউন্ট সম্পর্কে জানতে চান। Knowledge Base-এ আরও প্রোমোশনাল অফার যোগ করলে সেলস বৃদ্ধি পাবে।
          </div>
        </div>
      </div>
    </div>
  );
};
