import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lead } from '../types';
import {
  Users,
  Download,
  PhoneCall,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Flame,
  ThermometerSun,
  Snowflake,
  FileSpreadsheet
} from 'lucide-react';

export const LeadsPage: React.FC = () => {
  const { leads, updateLeadStatus, openCallSimulator, addToast } = useApp();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search) ||
      lead.interest.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = 'Name,Phone,Interest,Status,Date\n';
    const rows = filteredLeads
      .map((l) => `"${l.name}","${l.phone}","${l.interest}","${l.status}","${l.date}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `VoiceAI_BD_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('CSV এক্সপোর্ট সম্পন্ন', `${filteredLeads.length}টি লিডের ডেটা ডাউনলোড হয়েছে।`);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Customer Leads</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            AI Voice Agent-এর কল থেকে স্বয়ংক্রিয়ভাবে সংগৃহীত সম্ভাব্য ক্রেতা ও ফলো-আপ তালিকা
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-950 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="নাম, ফোন বা আগ্রহ দিয়ে সার্চ করুন..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-full sm:w-auto"
          >
            <option value="ALL">সকল স্ট্যাটাস</option>
            <option value="HOT">🔥 HOT Leads</option>
            <option value="WARM">☀️ WARM Leads</option>
            <option value="COLD">❄️ COLD Leads</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden shadow-lg">
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">সংগৃহীত লিড তালিকা</h3>
          <span className="text-xs text-slate-400">মোট লিড: {filteredLeads.length}টি</span>
        </div>

        {/* Desktop View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3">Customer Name</th>
                <th className="px-5 py-3">Phone Number</th>
                <th className="px-5 py-3">Interest / Query</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-white">{lead.name}</td>
                  <td className="px-5 py-3.5 font-mono text-indigo-300">{lead.phone}</td>
                  <td className="px-5 py-3.5 text-slate-200 max-w-xs truncate">{lead.interest}</td>
                  <td className="px-5 py-3.5 text-slate-400">{lead.date}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={lead.status}
                      onChange={(e) => updateLeadStatus(lead.id, e.target.value as any)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border cursor-pointer ${
                        lead.status === 'HOT'
                          ? 'bg-rose-950/80 text-rose-300 border-rose-700/60'
                          : lead.status === 'WARM'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-700/60'
                          : 'bg-sky-950/80 text-sky-300 border-sky-700/60'
                      }`}
                    >
                      <option value="HOT">🔥 HOT</option>
                      <option value="WARM">☀️ WARM</option>
                      <option value="COLD">❄️ COLD</option>
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => openCallSimulator(undefined, lead.phone)}
                      className="px-3 py-1 rounded-xl bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/40 text-indigo-300 text-[11px] font-semibold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <PhoneCall className="w-3 h-3" />
                      <span>Call Customer</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="sm:hidden divide-y divide-slate-800">
          {filteredLeads.map((lead) => (
            <div key={lead.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">{lead.name}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    lead.status === 'HOT'
                      ? 'bg-rose-950 text-rose-300 border-rose-700'
                      : lead.status === 'WARM'
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : 'bg-sky-950 text-sky-300 border-sky-700'
                  }`}
                >
                  {lead.status}
                </span>
              </div>
              <p className="font-mono text-xs text-indigo-300">{lead.phone}</p>
              <p className="text-xs text-slate-300">{lead.interest}</p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                <span className="text-slate-500">{lead.date}</span>
                <button
                  onClick={() => openCallSimulator(undefined, lead.phone)}
                  className="px-3 py-1 rounded-lg bg-indigo-600 text-white font-semibold text-xs flex items-center gap-1"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>কল করুন</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
