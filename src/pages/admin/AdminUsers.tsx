import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Edit2, UserCheck, X } from 'lucide-react';
import { AdminUser, UserRole } from '../../types/database';
import { DB } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const AdminUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<AdminUser> | null>(null);

  const loadUsers = async () => {
    const list = await DB.getUsers();
    setUsers(list);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenNew = () => {
    setEditingUser({
      full_name: '',
      email: '',
      role: 'editor',
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.email || !editingUser?.full_name) return;

    const savedUser: AdminUser = {
      id: editingUser.id || 'user-' + Date.now(),
      email: editingUser.email.trim(),
      full_name: editingUser.full_name.trim(),
      role: (editingUser.role as UserRole) || 'editor',
      created_at: editingUser.created_at || new Date().toISOString(),
    };

    await DB.saveUser(savedUser);
    await DB.logActivity('Admin User Updated', 'Access Control', `User: ${savedUser.email} (${savedUser.role})`);
    setIsEditing(false);
    setEditingUser(null);
    loadUsers();
  };

  const handleDelete = async (id: string, email: string) => {
    if (users.length <= 1) {
      alert('Cannot delete the sole administrator account.');
      return;
    }
    if (confirm(`Remove administrator "${email}"?`)) {
      await DB.deleteUser(id);
      await DB.logActivity('Admin User Removed', 'Access Control', `Removed user: ${email}`);
      loadUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif-display font-medium text-white">
            Admin User Management & RBAC
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Role-based permissions governing studio CMS privileges and security.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Admin User</span>
        </button>
      </div>

      {/* Role explanation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-lg bg-[#0B0B0B] border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Shield className="w-4 h-4 text-[#D91B24]" />
            <span>Super Admin</span>
          </div>
          <p className="text-neutral-400 text-[11px]">
            Master studio access: database configuration, billing, user management, and all CMS operations.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0B0B0B] border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>Admin</span>
          </div>
          <p className="text-neutral-400 text-[11px]">
            Full website content, gallery, services, packages, and lead inquiry management.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-[#0B0B0B] border border-white/10 space-y-1">
          <div className="flex items-center gap-2 text-white font-semibold">
            <Shield className="w-4 h-4 text-neutral-400" />
            <span>Editor</span>
          </div>
          <p className="text-neutral-400 text-[11px]">
            Content updates, gallery additions, and testimonial moderation. Inquiries are restricted.
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0B0B0B] rounded-lg border border-white/10 overflow-hidden shadow">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px] bg-white/[0.02]">
              <th className="py-3 px-4 font-semibold">Name & Email</th>
              <th className="py-3 px-4 font-semibold">Role</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold">Created</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-neutral-300">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="py-3.5 px-4 font-medium text-white">
                  <div>{u.full_name}</div>
                  <div className="text-[11px] text-neutral-400 font-mono">{u.email}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                      u.role === 'super_admin'
                        ? 'bg-red-950 text-red-400 border border-red-500/40'
                        : u.role === 'admin'
                        ? 'bg-blue-950 text-blue-400 border border-blue-500/40'
                        : 'bg-neutral-800 text-neutral-300'
                    }`}
                  >
                    {u.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="flex items-center gap-1.5 text-emerald-400 text-[11px]">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Active</span>
                  </span>
                </td>
                <td className="py-3.5 px-4 text-[10px] text-neutral-500 font-mono">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setEditingUser(u);
                        setIsEditing(true);
                      }}
                      className="text-neutral-400 hover:text-white p-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id, u.email)}
                      className="text-neutral-400 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      {isEditing && editingUser && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif-display text-white font-medium">
                {editingUser.id ? 'Edit Admin User' : 'Add Admin User'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ria Das"
                  value={editingUser.full_name || ''}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, full_name: e.target.value })
                  }
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="editor@saikatphotography.com"
                  value={editingUser.email || ''}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Assigned Permission Role
                </label>
                <select
                  value={editingUser.role || 'editor'}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value as UserRole })
                  }
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value="editor">Editor (Content & Moderation)</option>
                  <option value="admin">Admin (Content + Leads + Packages)</option>
                  <option value="super_admin">Super Admin (Full Master Privileges)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded bg-white/5 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#D91B24] text-white font-semibold"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
