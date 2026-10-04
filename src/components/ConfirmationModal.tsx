import React from 'react';
import { useApp } from '../context/AppContext';
import { AlertTriangle, X, Check, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ConfirmationModal: React.FC = () => {
  const { confirmDialog, closeConfirmDialog } = useApp();

  if (!confirmDialog || !confirmDialog.isOpen) return null;

  const handleConfirm = () => {
    confirmDialog.onConfirm();
    closeConfirmDialog();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-slate-700 shadow-2xl overflow-hidden"
        >
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${confirmDialog.isDestructive ? 'bg-rose-950/80 text-rose-400 border border-rose-800' : 'bg-amber-950/80 text-amber-400 border border-amber-800'}`}>
                {confirmDialog.isDestructive ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
              </div>
              <h3 className="text-base font-bold text-white">
                {confirmDialog.title}
              </h3>
            </div>
            <button
              onClick={closeConfirmDialog}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {confirmDialog.message}
            </p>
          </div>

          <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              onClick={closeConfirmDialog}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition-colors cursor-pointer"
            >
              {confirmDialog.cancelText || 'বাতিল করুন'}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-5 py-2 rounded-xl text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-lg ${
                confirmDialog.isDestructive
                  ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-950'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-950'
              }`}
            >
              <Check className="w-4 h-4" />
              <span>{confirmDialog.confirmText || 'নিশ্চিত করুন'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
