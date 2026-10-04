import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KnowledgeDocument } from '../types';
import {
  BookOpen,
  UploadCloud,
  FileText,
  Trash2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Plus,
  Sparkles,
  Search,
  Layers,
  HelpCircle
} from 'lucide-react';

export const KnowledgeBasePage: React.FC = () => {
  const { knowledgeDocs, addKnowledgeDoc, deleteKnowledgeDoc, addToast } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(knowledgeDocs[0] || null);
  const [isUploading, setIsUploading] = useState(false);
  const [simulatedFileName, setSimulatedFileName] = useState('');

  const handleSimulatedUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulatedFileName.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      addKnowledgeDoc({
        name: simulatedFileName.endsWith('.pdf') ? simulatedFileName : `${simulatedFileName}.pdf`,
        size: '1.2 MB',
        type: 'PDF',
        preview: `প্রতিষ্ঠানের বিশেষ নির্দেশিকা এবং প্রশ্নোত্তরের সংক্ষিপ্ত বিবরণী: ${simulatedFileName} ফাইল থেকে সফলভাবে ৮টি ইনসাইট এক্সট্র্যাক্ট করা হয়েছে।`
      });
      setSimulatedFileName('');
    }, 1000);
  };

  const handleQuickAddPrebuilt = (name: string, preview: string) => {
    addKnowledgeDoc({
      name,
      size: '1.6 MB',
      type: 'PDF',
      preview
    });
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <span>Knowledge Base</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            আপনার কোম্পানির তথ্য, প্রোডাক্ট ক্যাটালগ ও FAQ আপলোড করুন যা থেকে AI এজেন্ট উত্তর দেবে
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
            ইনডেক্সড ডকুমেন্টস: <strong className="text-indigo-300">{knowledgeDocs.length}টি</strong>
          </span>
        </div>
      </div>

      {/* Upload Zone & Quick Prebuilts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Upload Area */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0d1322] border-2 border-dashed border-slate-700/80 p-6 text-center hover:border-indigo-500/60 transition-colors">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mx-auto">
              <UploadCloud className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">PDF, DOCX বা TXT upload করুন</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                ড্র্যাগ অ্যান্ড ড্রপ করুন অথবা ডেমো ফাইল নির্বাচন করুন (Max 25MB)
              </p>
            </div>

            {/* Quick Demo Upload Form */}
            <form onSubmit={handleSimulatedUpload} className="flex gap-2 pt-2">
              <input
                type="text"
                value={simulatedFileName}
                onChange={(e) => setSimulatedFileName(e.target.value)}
                placeholder="ফাইলের নাম লিখুন (যেমন: Company_Policy.pdf)"
                className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                disabled={!simulatedFileName.trim() || isUploading}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs shadow-md shadow-indigo-950 transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                {isUploading ? (
                  <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Upload Document</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>ডেমো মোড: ফাইল তৎক্ষণাৎ ভেক্টরাইজড ও রেডি স্টেটাসে চলে যাবে</span>
            </div>
          </div>
        </div>

        {/* Info & Sample Prebuilts */}
        <div className="rounded-2xl bg-[#0d1322] border border-slate-800 p-5 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>সহজ ডেমো টেস্ট</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              ক্লিক করলেই ডেমো ব্যবসায়িক ডকুমেন্ট আপনার নলেজ বেসে যুক্ত হয়ে যাবে:
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickAddPrebuilt('Branch_Locations.pdf', 'ঢাকা, চট্টগ্রাম, সিলেট ও খুলনা শাখার ঠিকানা ও ম্যানেজার কন্টাক্ট নম্বর।')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 flex items-center justify-between transition-colors"
              >
                <span>+ Branch Locations.pdf</span>
                <span className="text-[10px] text-indigo-400">Add</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickAddPrebuilt('Return_Refund_Policy.pdf', '৭ দিনের মধ্যে ত্রুটিযুক্ত পণ্য ক্যাশ অন ডেলিভারি রিটার্ন করার নিয়মাবলী।')}
                className="w-full text-left p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 flex items-center justify-between transition-colors"
              >
                <span>+ Return Refund Policy.pdf</span>
                <span className="text-[10px] text-indigo-400">Add</span>
              </button>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 mt-4 leading-normal">
            *AI ভয়েস এজেন্ট শুধুমাত্র এই ডকুমেন্টস থেকে তথ্য নিয়ে উত্তর দেবে।
          </p>
        </div>
      </div>

      {/* Documents List & Knowledge Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Document Table */}
        <div className="lg:col-span-2 rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden shadow-lg">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">সংযুক্ত ডকুমেন্টস</h3>
            <span className="text-xs text-slate-400">স্ট্যাটাস: Ready</span>
          </div>

          <div className="divide-y divide-slate-800">
            {knowledgeDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className={`p-4 flex items-center justify-between gap-4 transition-colors cursor-pointer ${
                  selectedDoc?.id === doc.id
                    ? 'bg-indigo-950/40 border-l-4 border-indigo-500'
                    : 'hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-indigo-900/40 border border-indigo-700/50 flex items-center justify-center text-indigo-400 flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">{doc.fileName}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {doc.size} • আপলোড: {doc.uploadDate} • {doc.itemCount}টি পয়েন্ট
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>{doc.status}</span>
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`ডকুমেন্ট "${doc.fileName}" রিমুভ করবেন?`)) {
                        deleteKnowledgeDoc(doc.id);
                        if (selectedDoc?.id === doc.id) setSelectedDoc(null);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="ডিলিট"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Knowledge Preview */}
        <div className="rounded-2xl bg-[#0d1322] border border-slate-800 p-5 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-indigo-400" />
                <span>Knowledge Preview</span>
              </h3>
              <span className="text-[10px] text-slate-400">এক্সট্র্যাক্টেড ডাটা</span>
            </div>

            {selectedDoc ? (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <p className="text-xs font-bold text-white mb-1">{selectedDoc.fileName}</p>
                  <p className="text-[11px] text-slate-400 font-mono">সাইজ: {selectedDoc.size}</p>
                </div>

                <div>
                  <h5 className="text-[11px] font-semibold text-indigo-300 mb-1">
                    নলেজ সারাংশ ও সেগমেন্টস:
                  </h5>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed font-mono">
                    {selectedDoc.previewExcerpt}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-900/50 text-[11px] text-indigo-300 leading-normal">
                  ✓ কলার এই ডকুমেন্টে উল্লেখিত যেকোনো প্রশ্ন করলে AI এজেন্ট তাৎক্ষণিক সঠিক উত্তর দেবে।
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                প্রিভিউ দেখতে বামপাশের যেকোনো ডকুমেন্টে ক্লিক করুন
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400">
            *Demo integration: ব্রাউজারে সংরক্ষিত ও সিঙ্ক করা
          </div>
        </div>
      </div>
    </div>
  );
};
