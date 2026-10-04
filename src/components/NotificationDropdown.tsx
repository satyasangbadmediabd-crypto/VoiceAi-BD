import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Users,
  Bot,
  Trash2,
  ExternalLink,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, clearNotification, navigate } = useApp();

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleItemClick = (notificationId: string, link?: string) => {
    markNotificationAsRead(notificationId);
    if (link) {
      navigate(link);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-[#0d1322] border border-slate-700 shadow-2xl z-50 overflow-hidden">
        {/* Header */}
        <div className="p-3.5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white">নোটিফিকেশন সেন্টার</h4>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              onClick={markAllNotificationsAsRead}
              className="text-[11px] text-indigo-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <Check className="w-3 h-3" />
              <span>সব পড়া হয়েছে</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60 text-xs">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-slate-400 space-y-1">
              <Bell className="w-6 h-6 text-slate-600 mx-auto" />
              <p className="text-xs">নতুন কোনো নোটিফিকেশন নেই</p>
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-3.5 hover:bg-slate-800/40 transition-colors flex items-start justify-between gap-2.5 cursor-pointer ${
                  !notif.read ? 'bg-indigo-950/20' : ''
                }`}
                onClick={() => handleItemClick(notif.id, notif.link)}
              >
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 mt-0.5 flex-shrink-0 text-indigo-400">
                    {notif.category === 'agent' && <Bot className="w-3.5 h-3.5" />}
                    {notif.category === 'lead' && <Users className="w-3.5 h-3.5 text-emerald-400" />}
                    {notif.category === 'usage' && <AlertCircle className="w-3.5 h-3.5 text-amber-400" />}
                    {notif.category === 'billing' && <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />}
                    {notif.category === 'system' && <Bell className="w-3.5 h-3.5 text-purple-400" />}
                  </div>

                  <div className="space-y-0.5 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-xs font-bold truncate ${!notif.read ? 'text-white' : 'text-slate-300'}`}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 ml-1.5 flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-slate-500 pt-0.5">{notif.time}</p>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(notif.id);
                  }}
                  className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                  title="মুছে ফেলুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 text-center">
          <span className="text-[10px] text-slate-400">
            রিয়েল-টাইম সিমুলেটেড সিস্টেম অ্যালার্ট
          </span>
        </div>
      </div>
    </AnimatePresence>
  );
};
