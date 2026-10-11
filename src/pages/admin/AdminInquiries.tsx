import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MessageSquare,
  Search,
  Filter,
  Calendar,
  MapPin,
  Trash2,
  ExternalLink,
  Clock,
  X,
  FileText,
  Save,
} from 'lucide-react';
import { Inquiry, InquiryStatus } from '../../types/database';
import { DB } from '../../lib/supabase';

interface AdminInquiriesProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
}

export const AdminInquiries: React.FC<AdminInquiriesProps> = ({ inquiries, onRefresh }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const filtered = inquiries.filter((inq) => {
    if (statusFilter !== 'all' && inq.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.phone.toLowerCase().includes(q) ||
        (inq.location && inq.location.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const statusConfig: Record<
    InquiryStatus,
    { label: string; bg: string; text: string; border: string }
  > = {
    new: {
      label: 'New Lead',
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-400',
      border: 'border-emerald-500/40',
    },
    contacted: {
      label: 'Contacted',
      bg: 'bg-blue-950/60',
      text: 'text-blue-400',
      border: 'border-blue-500/40',
    },
    follow_up: {
      label: 'Follow Up',
      bg: 'bg-amber-950/60',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
    },
    booked: {
      label: 'Booked / Confirmed',
      bg: 'bg-purple-950/60',
      text: 'text-purple-400',
      border: 'border-purple-500/40',
    },
    closed: {
      label: 'Closed / Archived',
      bg: 'bg-neutral-800',
      text: 'text-neutral-400',
      border: 'border-neutral-700',
    },
  };

  const handleOpenDetail = (inq: Inquiry) => {
    setSelectedInquiry(inq);
    setInternalNotes(inq.internal_notes || '');
  };

  const handleUpdateStatus = async (id: string, newStatus: InquiryStatus) => {
    await DB.updateInquiryStatus(id, newStatus);
    await DB.logActivity('Inquiry Status Changed', 'Inquiries', `Status changed to ${newStatus}`);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry({ ...selectedInquiry, status: newStatus });
    }
    onRefresh();
  };

  const handleSaveNotes = async () => {
    if (!selectedInquiry) return;
    setIsSavingNotes(true);
    await DB.updateInquiryStatus(selectedInquiry.id, selectedInquiry.status, internalNotes);
    await DB.logActivity('Inquiry Notes Updated', 'Inquiries', `Notes updated for ${selectedInquiry.name}`);
    setSelectedInquiry({ ...selectedInquiry, internal_notes: internalNotes });
    setIsSavingNotes(false);
    onRefresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Permanently delete inquiry from "${name}"?`)) {
      await DB.deleteInquiry(id);
      await DB.logActivity('Inquiry Deleted', 'Inquiries', `Deleted inquiry from ${name}`);
      if (selectedInquiry?.id === id) setSelectedInquiry(null);
      onRefresh();
    }
  };

  const getCleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif-display font-medium text-white">
            Client Inquiries & Booking Leads
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Confidential lead pipeline stored securely in Supabase.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400 font-mono">
            Total Leads: <strong className="text-white">{inquiries.length}</strong>
          </span>
          <span className="text-neutral-600">|</span>
          <span className="text-emerald-400 font-mono">
            New: <strong>{inquiries.filter((i) => i.status === 'new').length}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        {/* Status segmented tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {['all', 'new', 'contacted', 'follow_up', 'booked', 'closed'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                statusFilter === st
                  ? 'bg-[#D91B24] text-white'
                  : 'bg-[#0B0B0B] border border-white/10 text-neutral-400 hover:text-white'
              }`}
            >
              <span className="capitalize">{st.replace('_', ' ')}</span>
              <span className="ml-1.5 text-[10px] opacity-75">
                (
                {st === 'all'
                  ? inquiries.length
                  : inquiries.filter((i) => i.status === st).length}
                )
              </span>
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0B0B] border border-white/10 rounded px-3 py-1.5 pl-8 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D91B24]"
          />
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-[#0B0B0B] rounded-lg border border-white/10 overflow-hidden shadow">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-neutral-400">
            No inquiries match your current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 uppercase tracking-wider text-[10px] bg-white/[0.02]">
                  <th className="py-3 px-4 font-semibold">Client Name</th>
                  <th className="py-3 px-4 font-semibold">Event</th>
                  <th className="py-3 px-4 font-semibold">Event Date</th>
                  <th className="py-3 px-4 font-semibold">Location</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold">Received</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-neutral-300">
                {filtered.map((inq) => {
                  const cfg = statusConfig[inq.status];
                  return (
                    <tr
                      key={inq.id}
                      onClick={() => handleOpenDetail(inq)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="flex items-center gap-2">
                          <span>{inq.name}</span>
                          {inq.status === 'new' && (
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          )}
                        </div>
                        <div className="text-[11px] text-neutral-400 font-mono">{inq.phone}</div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-300">{inq.event_type}</td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-400">
                        {inq.event_date || 'Undecided'}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-400 truncate max-w-[150px]">
                        {inq.location || '—'}
                      </td>
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={inq.status}
                          onChange={(e) =>
                            handleUpdateStatus(inq.id, e.target.value as InquiryStatus)
                          }
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded border focus:outline-none cursor-pointer ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <option value="new">New Lead</option>
                          <option value="contacted">Contacted</option>
                          <option value="follow_up">Follow Up</option>
                          <option value="booked">Booked</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-[10px] text-neutral-500 font-mono">
                        {new Date(inq.created_at).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenDetail(inq)}
                            className="text-[#D91B24] hover:underline font-medium text-[11px]"
                          >
                            Review
                          </button>
                          <button
                            onClick={() => handleDelete(inq.id, inq.name)}
                            className="text-neutral-500 hover:text-red-400 p-1"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#D91B24] font-semibold">
                  Lead Details
                </span>
                <h3 className="text-xl font-serif-display text-white font-medium">
                  {selectedInquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact Action Bar */}
            <div className="flex flex-wrap items-center gap-3 p-3 rounded bg-white/5 border border-white/5">
              <a
                href={`tel:${selectedInquiry.phone}`}
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D91B24]" />
                <span>Call ({selectedInquiry.phone})</span>
              </a>

              <a
                href={`https://wa.me/${getCleanPhone(
                  selectedInquiry.phone
                )}?text=${encodeURIComponent(
                  `Hello ${selectedInquiry.name}! Thank you for your inquiry with Saikat Photography regarding your upcoming ${selectedInquiry.event_type}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>Open WhatsApp Chat</span>
              </a>

              <a
                href={`mailto:${selectedInquiry.email}?subject=Saikat Photography Inquiry: ${selectedInquiry.event_type}`}
                className="px-3 py-1.5 rounded bg-white/10 hover:bg-white/20 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#D91B24]" />
                <span>Email Client</span>
              </a>
            </div>

            {/* Inquiry Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded bg-[#050505] border border-white/5">
                <span className="text-neutral-500 block mb-0.5">Celebration Type</span>
                <span className="text-white font-medium">{selectedInquiry.event_type}</span>
              </div>
              <div className="p-3 rounded bg-[#050505] border border-white/5">
                <span className="text-neutral-500 block mb-0.5">Event Date</span>
                <span className="text-white font-mono">{selectedInquiry.event_date || 'TBD'}</span>
              </div>
              <div className="p-3 rounded bg-[#050505] border border-white/5">
                <span className="text-neutral-500 block mb-0.5">Location / Venue</span>
                <span className="text-white">{selectedInquiry.location || 'Not provided'}</span>
              </div>
              <div className="p-3 rounded bg-[#050505] border border-white/5">
                <span className="text-neutral-500 block mb-0.5">Estimated Budget</span>
                <span className="text-white font-medium">{selectedInquiry.budget || 'Open / Flexible'}</span>
              </div>
            </div>

            {/* Message Body */}
            <div>
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block mb-2">
                Client's Vision & Note
              </label>
              <div className="p-4 rounded bg-[#050505] border border-white/5 text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.message}
              </div>
            </div>

            {/* Status Selector */}
            <div className="flex items-center gap-3">
              <label className="text-xs text-neutral-300 font-medium">Pipeline Status:</label>
              <select
                value={selectedInquiry.status}
                onChange={(e) =>
                  handleUpdateStatus(selectedInquiry.id, e.target.value as InquiryStatus)
                }
                className="bg-[#050505] border border-white/10 text-white text-xs px-3 py-1.5 rounded focus:outline-none"
              >
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="follow_up">Follow Up</option>
                <option value="booked">Booked & Locked</option>
                <option value="closed">Closed / Archived</option>
              </select>
            </div>

            {/* Internal Studio Notes */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <label className="text-xs uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-between">
                <span>Internal Studio Notes (Private)</span>
                {isSavingNotes && <span className="text-emerald-400 text-[10px]">Saving...</span>}
              </label>
              <textarea
                rows={3}
                placeholder="Log call discussion, agreed pricing, deposit details, coordinator contact..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24] resize-none"
              />
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => handleDelete(selectedInquiry.id, selectedInquiry.name)}
                  className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Inquiry</span>
                </button>
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs px-4 py-2 rounded font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Notes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;
