import React, { useState } from 'react';
import {
  Package,
  Layers,
  Search,
  Filter,
  Calendar,
  MapPin,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  ChevronRight,
  X,
  FileText,
  Save,
  Tag,
  DollarSign,
  Send,
} from 'lucide-react';
import { PackageEnquiry, PackageEnquiryStatus } from '../../types/database';
import { DB } from '../../lib/supabase';

interface AdminPackageEnquiriesProps {
  enquiries: PackageEnquiry[];
  onRefresh: () => void;
}

export const AdminPackageEnquiries: React.FC<AdminPackageEnquiriesProps> = ({
  enquiries,
  onRefresh,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [packageFilter, setPackageFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<PackageEnquiry | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Derive unique main package names for filtering
  const uniqueMainPackages = Array.from(
    new Set(enquiries.map((e) => e.main_package_name).filter(Boolean))
  );

  const filtered = enquiries.filter((enq) => {
    if (statusFilter !== 'all' && enq.status !== statusFilter) return false;
    if (packageFilter !== 'all' && enq.main_package_name !== packageFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        enq.customer_name.toLowerCase().includes(q) ||
        enq.customer_email.toLowerCase().includes(q) ||
        enq.customer_phone.toLowerCase().includes(q) ||
        enq.sub_package_name.toLowerCase().includes(q) ||
        enq.main_package_name.toLowerCase().includes(q) ||
        (enq.message && enq.message.toLowerCase().includes(q)) ||
        (enq.location && enq.location.toLowerCase().includes(q));
      if (!match) return false;
    }
    return true;
  });

  const statusConfig: Record<
    PackageEnquiryStatus,
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
    in_progress: {
      label: 'In Progress / Discussion',
      bg: 'bg-amber-950/60',
      text: 'text-amber-400',
      border: 'border-amber-500/40',
    },
    closed: {
      label: 'Closed / Converted',
      bg: 'bg-purple-950/60',
      text: 'text-purple-400',
      border: 'border-purple-500/40',
    },
  };

  const handleOpenDetail = (enq: PackageEnquiry) => {
    setSelectedEnquiry(enq);
    setInternalNotes(enq.internal_notes || '');
  };

  const handleUpdateStatus = async (id: string, newStatus: PackageEnquiryStatus) => {
    await DB.updatePackageEnquiryStatus(id, newStatus);
    await DB.logActivity(
      'Package Enquiry Status Updated',
      'Package Enquiries',
      `Status changed to ${newStatus}`
    );
    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
    }
    onRefresh();
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setIsSavingNotes(true);
    try {
      await DB.updatePackageEnquiryStatus(
        selectedEnquiry.id,
        selectedEnquiry.status,
        internalNotes
      );
      await DB.logActivity(
        'Package Enquiry Notes Saved',
        'Package Enquiries',
        `Notes updated for ${selectedEnquiry.customer_name}`
      );
      setSelectedEnquiry({ ...selectedEnquiry, internal_notes: internalNotes });
      onRefresh();
    } finally {
      setIsSavingNotes(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Permanently delete package enquiry from "${name}"?`)) {
      await DB.deletePackageEnquiry(id);
      await DB.logActivity(
        'Package Enquiry Deleted',
        'Package Enquiries',
        `Deleted enquiry from: ${name}`
      );
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      onRefresh();
    }
  };

  const getCleanPhone = (phone: string) => phone.replace(/[^0-9+]/g, '');

  const newCount = enquiries.filter((e) => e.status === 'new').length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-serif-display font-medium text-white">
              Package Enquiries & Bookings
            </h1>
            {newCount > 0 && (
              <span className="bg-[#D91B24] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">
                {newCount} New
              </span>
            )}
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Customer inquiries submitted directly from the website packages catalog with selected tier & pricing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-neutral-400">Total Enquiries:</span>
            <span className="text-sm font-semibold text-white ml-1.5">{enquiries.length}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-[#0A0A0A] p-3.5 rounded-lg border border-white/5">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search customer name, phone, email, package or message..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-white/10 rounded pl-9 pr-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D91B24]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Main Package Filter */}
          <select
            value={packageFilter}
            onChange={(e) => setPackageFilter(e.target.value)}
            aria-label="Filter by Package Category"
            className="bg-[#121212] border border-white/10 rounded px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-[#D91B24]"
          >
            <option value="all">All Package Categories</option>
            {uniqueMainPackages.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by Status"
            className="bg-[#121212] border border-white/10 rounded px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none focus:border-[#D91B24]"
          >
            <option value="all">All Statuses ({enquiries.length})</option>
            <option value="new">New ({enquiries.filter((e) => e.status === 'new').length})</option>
            <option value="contacted">Contacted ({enquiries.filter((e) => e.status === 'contacted').length})</option>
            <option value="in_progress">In Progress ({enquiries.filter((e) => e.status === 'in_progress').length})</option>
            <option value="closed">Closed ({enquiries.filter((e) => e.status === 'closed').length})</option>
          </select>
        </div>
      </div>

      {/* Enquiries List / Table */}
      {filtered.length === 0 ? (
        <div className="bg-[#0A0A0A] rounded-lg border border-white/5 p-12 text-center space-y-3">
          <Layers className="w-10 h-10 text-neutral-600 mx-auto" />
          <h3 className="text-sm font-medium text-white">No Package Enquiries Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'all' || packageFilter !== 'all'
              ? 'Try adjusting your search criteria or filters.'
              : 'Customer inquiries submitted from the website packages section will appear here automatically.'}
          </p>
        </div>
      ) : (
        <div className="bg-[#0A0A0A] rounded-lg border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.02] text-neutral-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 font-semibold">Customer</th>
                  <th className="py-3 px-4 font-semibold">Contact</th>
                  <th className="py-3 px-4 font-semibold">Selected Package</th>
                  <th className="py-3 px-4 font-semibold">Price</th>
                  <th className="py-3 px-4 font-semibold">Date & Location</th>
                  <th className="py-3 px-4 font-semibold">Submitted</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((enq) => {
                  const cfg = statusConfig[enq.status] || statusConfig.new;
                  const formattedDate = new Date(enq.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  return (
                    <tr
                      key={enq.id}
                      onClick={() => handleOpenDetail(enq)}
                      className="hover:bg-white/[0.03] transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div className="flex items-center gap-2">
                          {enq.status === 'new' && (
                            <span className="w-2 h-2 rounded-full bg-[#D91B24] shrink-0" />
                          )}
                          <span>{enq.customer_name}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-300">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-neutral-500 shrink-0" />
                            <span>{enq.customer_phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-neutral-400 text-[11px]">
                            <Mail className="w-3 h-3 text-neutral-500 shrink-0" />
                            <span className="truncate max-w-[150px]">{enq.customer_email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div>
                          <span className="text-[10px] text-neutral-400 block">
                            {enq.main_package_name}
                          </span>
                          <span className="font-medium text-white text-xs">
                            {enq.sub_package_name}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-emerald-400 font-mono">
                          {enq.package_price}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                        <div>
                          {enq.event_date ? (
                            <div className="flex items-center gap-1 text-neutral-300">
                              <Calendar className="w-3 h-3 text-[#D91B24] shrink-0" />
                              <span>{enq.event_date}</span>
                            </div>
                          ) : (
                            <span className="text-neutral-500">Date not set</span>
                          )}
                          {enq.location && (
                            <div className="flex items-center gap-1 text-neutral-400 text-[10px] mt-0.5">
                              <MapPin className="w-2.5 h-2.5 text-neutral-500 shrink-0" />
                              <span>{enq.location}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-400 text-[11px] whitespace-nowrap">
                        {formattedDate}
                      </td>

                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={enq.status}
                          onChange={(e) =>
                            handleUpdateStatus(enq.id, e.target.value as PackageEnquiryStatus)
                          }
                          aria-label={`Status for ${enq.customer_name}`}
                          className={`text-[10px] uppercase font-semibold tracking-wider px-2 py-1 rounded border focus:outline-none cursor-pointer ${cfg.bg} ${cfg.text} ${cfg.border}`}
                        >
                          <option value="new">New</option>
                          <option value="contacted">Contacted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="closed">Closed</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenDetail(enq)}
                            className="p-1.5 rounded hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
                            title="View Full Details"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(enq.id, enq.customer_name)}
                            className="p-1.5 rounded hover:bg-red-950/60 text-neutral-500 hover:text-red-400 transition-colors"
                            title="Delete Enquiry"
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
        </div>
      )}

      {/* Details Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                    Package Enquiry Details
                  </span>
                  <span
                    className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded border ${
                      statusConfig[selectedEnquiry.status].bg
                    } ${statusConfig[selectedEnquiry.status].text} ${
                      statusConfig[selectedEnquiry.status].border
                    }`}
                  >
                    {statusConfig[selectedEnquiry.status].label}
                  </span>
                </div>
                <h2 className="text-xl font-serif-display font-medium text-white mt-1">
                  {selectedEnquiry.customer_name}
                </h2>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Submitted on {new Date(selectedEnquiry.created_at).toLocaleString()}
                </p>
              </div>

              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-neutral-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Selected Package Banner */}
            <div className="bg-gradient-to-r from-red-950/40 via-[#141414] to-red-950/20 border border-[#D91B24]/30 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-[#D91B24] font-semibold">
                  Selected Investment Tier
                </span>
                <div className="text-lg font-serif-display font-medium text-white">
                  {selectedEnquiry.main_package_name} &rarr; {selectedEnquiry.sub_package_name}
                </div>
                <div className="text-xs text-neutral-400">
                  Customer inquired for this specific tier
                </div>
              </div>
              <div className="text-right sm:border-l sm:border-white/10 sm:pl-5">
                <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
                  Displayed Price
                </div>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {selectedEnquiry.package_price}
                </div>
              </div>
            </div>

            {/* Contact Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-[#121212] p-4 rounded-lg border border-white/5 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium block">
                  Customer Contact
                </span>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-2 text-white">
                    <Phone className="w-3.5 h-3.5 text-[#D91B24] shrink-0" />
                    <span className="font-mono">{selectedEnquiry.customer_phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white">
                    <Mail className="w-3.5 h-3.5 text-[#D91B24] shrink-0" />
                    <span>{selectedEnquiry.customer_email}</span>
                  </div>
                </div>

                {/* Quick Contact Buttons */}
                <div className="pt-3 flex items-center gap-2 border-t border-white/5">
                  <a
                    href={`https://wa.me/${getCleanPhone(selectedEnquiry.customer_phone)}?text=${encodeURIComponent(
                      `Hello ${selectedEnquiry.customer_name}! Thank you for inquiring about the ${selectedEnquiry.sub_package_name} (${selectedEnquiry.package_price}) with Saikat Photography. We would love to discuss your celebration in detail!`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-semibold py-1.5 px-2 rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${getCleanPhone(selectedEnquiry.customer_phone)}`}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-semibold py-1.5 px-2 rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                  <a
                    href={`mailto:${selectedEnquiry.customer_email}?subject=${encodeURIComponent(
                      `Saikat Photography – Consultation for ${selectedEnquiry.sub_package_name}`
                    )}`}
                    className="flex-1 bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-semibold py-1.5 px-2 rounded flex items-center justify-center gap-1 transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    <span>Email</span>
                  </a>
                </div>
              </div>

              <div className="bg-[#121212] p-4 rounded-lg border border-white/5 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium block">
                  Event / Celebration Details
                </span>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Planned Date:</span>
                    <span className="text-white font-medium">
                      {selectedEnquiry.event_date || 'Not specified by client'}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px]">Venue / Location:</span>
                    <span className="text-white font-medium">
                      {selectedEnquiry.location || 'Not specified by client'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Message */}
            <div className="bg-[#121212] p-4 rounded-lg border border-white/5 space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium block">
                Customer Enquiry Message
              </span>
              <p className="text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message || 'No additional message provided.'}
              </p>
            </div>

            {/* Internal Staff Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
                  Internal Staff Notes & Follow-up History
                </span>
                <button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-[11px] font-semibold px-3 py-1 rounded flex items-center gap-1 transition-colors disabled:opacity-50"
                >
                  <Save className="w-3 h-3" />
                  <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
                </button>
              </div>
              <textarea
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Log phone calls, quoted discount, custom add-ons, or follow-up notes here..."
                rows={3}
                className="w-full bg-[#121212] border border-white/10 rounded p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D91B24]"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400">Change Status:</span>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) =>
                    handleUpdateStatus(
                      selectedEnquiry.id,
                      e.target.value as PackageEnquiryStatus
                    )
                  }
                  aria-label="Change enquiry status"
                  className="bg-[#181818] border border-white/10 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_progress">In Progress</option>
                  <option value="closed">Closed / Booked</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() =>
                    handleDelete(selectedEnquiry.id, selectedEnquiry.customer_name)
                  }
                  className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 px-3 py-1.5 rounded hover:bg-red-950/40"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold px-4 py-1.5 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackageEnquiries;
