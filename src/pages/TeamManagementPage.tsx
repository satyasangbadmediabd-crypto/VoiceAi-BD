import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  UserCheck,
  Users,
  UserPlus,
  Shield,
  Trash2,
  Edit2,
  Mail,
  Building,
  CheckCircle2,
  Search,
  Filter,
  X,
  Check
} from 'lucide-react';
import { TeamMember } from '../types';

export const TeamManagementPage: React.FC = () => {
  const { teamMembers, addTeamMember, updateTeamMember, removeTeamMember, openConfirmDialog, addToast } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // New member form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TeamMember['role']>('Manager');
  const [department, setDepartment] = useState('Sales & Support');

  // Edit member modal state
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((m) => {
      const matchSearch =
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (m.department || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchRole = roleFilter === 'ALL' || m.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [teamMembers, searchQuery, roleFilter]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      addToast('অনুগ্রহ করে নাম এবং ইমেইল প্রদান করুন', '', 'warning');
      return;
    }

    const defaultPermissions =
      role === 'Owner'
        ? ['all']
        : role === 'Admin'
        ? ['manage_agents', 'manage_knowledge', 'view_calls', 'manage_leads', 'view_billing']
        : role === 'Manager'
        ? ['manage_agents', 'view_calls', 'manage_leads']
        : ['view_agents', 'view_calls', 'view_leads'];

    addTeamMember({
      name,
      email,
      role,
      department,
      status: 'Active',
      permissions: defaultPermissions
    });

    setName('');
    setEmail('');
    setIsInviteModalOpen(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    updateTeamMember(editingMember.id, {
      name: editingMember.name,
      role: editingMember.role,
      department: editingMember.department,
      status: editingMember.status
    });
    setEditingMember(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              Workspace Collaboration
            </span>
            <span className="text-xs text-slate-400">টিম পারমিশন ও অ্যাক্সেস কন্ট্রোল</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2 mt-1">
            <UserCheck className="w-6 h-6 text-indigo-400" />
            <span>টিম ম্যানেজমেন্ট (Team Management)</span>
          </h2>
        </div>

        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-colors cursor-pointer shadow-lg shadow-indigo-950 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>নতুন সদস্য আমন্ত্রণ করুন</span>
        </button>
      </div>

      {/* Role Descriptions Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
          <p className="font-bold text-purple-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Owner
          </p>
          <p className="text-[11px] text-slate-400">সম্পূর্ণ কন্ট্রোল, বিলিং, প্ল্যান পরিবর্তন ও ডিলিট পারমিশন।</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
          <p className="font-bold text-indigo-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Admin
          </p>
          <p className="text-[11px] text-slate-400">এজেন্ট তৈরি, নলেজ আপলোড, ফোন নম্বর ও টিম ম্যানেজমেন্ট।</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
          <p className="font-bold text-emerald-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Manager
          </p>
          <p className="text-[11px] text-slate-400">কল হিস্ট্রি ও লিড স্ট্যাটাস পরিবর্তন এবং রিপোর্ট দেখা।</p>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800 space-y-1">
          <p className="font-bold text-slate-400 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> Agent Viewer
          </p>
          <p className="text-[11px] text-slate-400">শুধুমাত্র কল লগ, ট্রান্সক্রিপ্ট ও পারফরম্যান্স বিশ্লেষণ দেখতে পারে।</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, ইমেইল বা বিভাগ সার্চ করুন..."
            className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-xs focus:outline-none"
          >
            <option value="ALL">সকল রোল</option>
            <option value="Owner">Owner</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Agent Viewer">Agent Viewer</option>
          </select>
        </div>
      </div>

      {/* Members Table */}
      <div className="rounded-2xl bg-[#0d1322] border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900 text-slate-400 text-[11px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3.5">Member Name</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Joined Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5">
                    <p className="font-bold text-white text-xs">{member.name}</p>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-slate-500" />
                      <span>{member.email}</span>
                    </p>
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      member.role === 'Owner' ? 'bg-purple-950 text-purple-300 border border-purple-800' :
                      member.role === 'Admin' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' :
                      member.role === 'Manager' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                      'bg-slate-800 text-slate-300'
                    }`}>
                      {member.role}
                    </span>
                  </td>

                  <td className="p-3.5 text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-slate-500" />
                      <span>{member.department}</span>
                    </span>
                  </td>

                  <td className="p-3.5 font-mono text-slate-400">
                    {member.joinedDate}
                  </td>

                  <td className="p-3.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      member.status === 'Active' ? 'bg-emerald-950 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {member.status}
                    </span>
                  </td>

                  <td className="p-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setEditingMember(member)}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit Permissions"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      {member.role !== 'Owner' && (
                        <button
                          onClick={() =>
                            openConfirmDialog({
                              title: 'টিম মেম্বার রিমুভ করবেন?',
                              message: `আপনি কি নিশ্চিত যে ${member.name} কে আপনার টিম থেকে বাদ দিতে চান?`,
                              confirmText: 'রিমুভ করুন',
                              isDestructive: true,
                              onConfirm: () => removeTeamMember(member.id)
                            })
                          }
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Remove Member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-slate-700 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-400" />
                <span>নতুন টিম মেম্বার আমন্ত্রণ জানান</span>
              </h3>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInvite} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">পূর্ণ নাম *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="উদাঃ রফিকুল ইসলাম"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">অফিসিয়াল ইমেইল *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rafiq@company.com"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">রোল ও পারমিশন</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none"
                >
                  <option value="Admin">Admin (পূর্ণ অ্যাক্সেস)</option>
                  <option value="Manager">Manager (কল ও লিড ম্যানেজমেন্ট)</option>
                  <option value="Agent Viewer">Agent Viewer (শুধুমাত্র দেখার অনুমতি)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">বিভাগ / Department</label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Customer Support / Sales"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  ইনভাইট পাঠান
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0d1322] border border-slate-700 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-400" />
                <span>সদস্য সম্পাদনা: {editingMember.name}</span>
              </h3>
              <button
                onClick={() => setEditingMember(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">নাম</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">রোল</label>
                <select
                  value={editingMember.role}
                  onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="Owner">Owner</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Agent Viewer">Agent Viewer</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">বিভাগ</label>
                <input
                  type="text"
                  value={editingMember.department}
                  onChange={(e) => setEditingMember({ ...editingMember, department: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">স্ট্যাটাস</label>
                <select
                  value={editingMember.status}
                  onChange={(e) => setEditingMember({ ...editingMember, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold cursor-pointer"
                >
                  সেভ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
