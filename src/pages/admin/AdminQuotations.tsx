import React, { useState, useEffect } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Printer,
  Share2,
  Eye,
  CheckCircle2,
  X,
  Edit2,
  Download,
  DollarSign,
  Send,
} from 'lucide-react';
import { StudioQuotation, QuotationItem } from '../../types/database';
import { DB } from '../../lib/supabase';
import BrandLogo from '../../components/BrandLogo';

export const AdminQuotations: React.FC = () => {
  const [quotations, setQuotations] = useState<StudioQuotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewQuote, setPreviewQuote] = useState<StudioQuotation | null>(null);

  const [formData, setFormData] = useState<Partial<StudioQuotation>>({
    client_name: '',
    client_email: '',
    client_phone: '',
    event_type: 'Luxury Wedding Storytelling',
    event_date: new Date().toISOString().split('T')[0],
    currency: 'INR',
    items: [
      { description: 'Gold Signature 2-Day Wedding Coverage (4 Crew)', amount: 150000 },
      { description: '4K Drone Aerial Cinematography Upgrade', amount: 15000 },
      { description: 'Handcrafted Italian Leather Heirloom Album (40 Pages)', amount: 20000 },
    ],
    notes: '50% advance to block wedding dates. 30% on wedding morning. 20% on final album delivery.',
    status: 'draft',
  });

  const loadQuotations = async () => {
    setIsLoading(true);
    try {
      const list = await DB.getQuotations();
      setQuotations(list);
    } catch (err) {
      console.error('Error loading quotations', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuotations();
  }, []);

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...(formData.items || []), { description: '', amount: 0 }],
    });
  };

  const handleRemoveItem = (index: number) => {
    const updated = [...(formData.items || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, items: updated });
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, val: any) => {
    const updated = [...(formData.items || [])];
    updated[index] = { ...updated[index], [field]: val };
    setFormData({ ...formData, items: updated });
  };

  const calculateTotal = (items?: QuotationItem[]) => {
    if (!items) return 0;
    return items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name?.trim()) {
      alert('Client name is required.');
      return;
    }
    await DB.saveQuotation({
      ...formData,
      items: formData.items || [],
      client_name: formData.client_name,
    });
    setIsModalOpen(false);
    loadQuotations();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this quotation record?')) {
      await DB.deleteQuotation(id);
      loadQuotations();
    }
  };

  const handleShareWhatsApp = (q: StudioQuotation) => {
    const text = encodeURIComponent(
      `Hello ${q.client_name}! Here is your bespoke quotation ${q.quotation_number} from Saikat Photography for your ${q.event_type} (${q.currency} ${q.total_amount.toLocaleString()}). Please let us know if you would like to proceed with reserving the date!`
    );
    window.open(`https://wa.me/${q.client_phone.replace(/[^0-9]/g, '')}?text=${text}`, '_blank');
  };

  const statusColors = {
    draft: 'bg-neutral-800 text-neutral-400 border-neutral-700',
    sent: 'bg-blue-950/60 text-blue-400 border-blue-500/30',
    accepted: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
    declined: 'bg-red-950/60 text-red-400 border-red-500/30',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-white">
            Quotes & Invoicing Studio
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Generate bespoke itemized proposals, invoices, and payment receipts with official studio branding.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              client_name: '',
              client_email: '',
              client_phone: '',
              event_type: 'Luxury Wedding Storytelling',
              event_date: new Date().toISOString().split('T')[0],
              currency: 'INR',
              items: [
                { description: 'Gold Signature 2-Day Wedding Coverage (4 Crew)', amount: 150000 },
                { description: '4K Drone Aerial Cinematography Upgrade', amount: 15000 },
              ],
              notes: '50% advance to block wedding dates. 30% on wedding morning. 20% on final album delivery.',
              status: 'draft',
            });
            setIsModalOpen(true);
          }}
          className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Quotation</span>
        </button>
      </div>

      {/* Quotation List */}
      <div className="space-y-3.5">
        {quotations.length === 0 ? (
          <div className="bg-[#0B0B0B] border border-white/10 rounded-lg p-10 text-center text-xs text-neutral-500">
            No quotations created yet. Click "New Quotation" to generate an itemized client proposal.
          </div>
        ) : (
          quotations.map((q) => (
            <div
              key={q.id}
              className="bg-[#0B0B0B] border border-white/10 hover:border-white/20 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-semibold text-[#D91B24] bg-[#D91B24]/10 px-2 py-0.5 rounded">
                    {q.quotation_number}
                  </span>
                  <h3 className="text-base font-semibold text-white">{q.client_name}</h3>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                      statusColors[q.status] || statusColors.draft
                    }`}
                  >
                    {q.status}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400">
                  <span>{q.event_type}</span>
                  {q.event_date && <span>• Date: {q.event_date}</span>}
                  {q.client_phone && <span>• {q.client_phone}</span>}
                </div>

                <p className="text-sm font-semibold text-white pt-1">
                  Total: {q.currency} {Number(q.total_amount).toLocaleString()}
                  <span className="text-xs font-normal text-neutral-400 ml-2">
                    ({q.items?.length || 0} line items)
                  </span>
                </p>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
                <button
                  onClick={() => setPreviewQuote(q)}
                  className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview & Print</span>
                </button>

                {q.client_phone && (
                  <button
                    onClick={() => handleShareWhatsApp(q)}
                    className="p-2 rounded bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-400 border border-emerald-500/30 transition-colors cursor-pointer"
                    title="Share via WhatsApp"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                )}

                <button
                  onClick={() => {
                    setFormData(q);
                    setIsModalOpen(true);
                  }}
                  className="p-2 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Edit quotation"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(q.id)}
                  className="p-2 rounded bg-white/5 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                  title="Delete quotation"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#101010] border border-white/15 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-serif-display font-medium text-white">
                {formData.id ? 'Edit Proposal / Invoice' : 'Create New Client Proposal'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.client_name || ''}
                    onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                    placeholder="e.g. Debashish & Ananya"
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Client Phone (WhatsApp)
                  </label>
                  <input
                    type="text"
                    value={formData.client_phone || ''}
                    onChange={(e) => setFormData({ ...formData, client_phone: e.target.value })}
                    placeholder="+91 98301 22345"
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Event Celebration
                  </label>
                  <input
                    type="text"
                    value={formData.event_type || ''}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    placeholder="e.g. Bengali Royal Wedding (2 Days)"
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.event_date || ''}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.currency || 'INR'}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || 'draft'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  >
                    <option value="draft">Draft Proposal</option>
                    <option value="sent">Sent to Client</option>
                    <option value="accepted">Accepted / Booked</option>
                    <option value="declined">Declined</option>
                  </select>
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-300">
                    Itemized Deliverables & Inclusions
                  </label>
                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="text-xs text-[#D91B24] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                {formData.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Service / Deliverable description"
                      value={item.description}
                      onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                      className="flex-1 bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                    />
                    <div className="w-32 relative">
                      <input
                        type="number"
                        required
                        placeholder="Amount"
                        value={item.amount}
                        onChange={(e) => handleItemChange(idx, 'amount', Number(e.target.value))}
                        className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      className="p-2 text-neutral-500 hover:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                <div className="text-right pt-2 text-sm font-semibold text-white">
                  Calculated Total: {formData.currency}{' '}
                  {calculateTotal(formData.items).toLocaleString()}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Payment Milestones & Terms
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded bg-white/5 hover:bg-white/10 text-neutral-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold rounded bg-[#D91B24] hover:bg-[#b5141c] text-white transition-colors cursor-pointer"
                >
                  Save Proposal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Luxury Printable Invoice Preview Modal */}
      {previewQuote && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white text-neutral-900 rounded-xl max-w-2xl w-full p-8 shadow-2xl relative space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#D91B24]">
                  OFFICIAL STUDIO PROPOSAL
                </span>
                <h2 className="text-2xl font-serif font-bold text-neutral-900">
                  Saikat Photography
                </h2>
                <p className="text-xs text-neutral-500">Luxury Weddings & Fine-Art Cinema</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono font-bold text-[#D91B24]">
                  {previewQuote.quotation_number}
                </p>
                <p className="text-xs text-neutral-500">Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="bg-neutral-50 p-4 rounded-lg flex justify-between text-xs">
              <div>
                <strong className="block text-neutral-800 text-sm">{previewQuote.client_name}</strong>
                <span className="text-neutral-500">{previewQuote.event_type}</span>
                {previewQuote.event_date && (
                  <span className="block text-neutral-500">Event Date: {previewQuote.event_date}</span>
                )}
              </div>
              <div className="text-right text-neutral-500">
                {previewQuote.client_phone && <div>Tel: {previewQuote.client_phone}</div>}
                <div>Studio: +91 98765 43210</div>
                <div>Kolkata, India</div>
              </div>
            </div>

            {/* Table */}
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-neutral-300 text-neutral-600 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5">Deliverable Description</th>
                  <th className="py-2.5 text-right">Investment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {previewQuote.items?.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-medium text-neutral-800">{it.description}</td>
                    <td className="py-3 text-right font-mono font-semibold text-neutral-900">
                      {previewQuote.currency} {Number(it.amount).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Total */}
            <div className="border-t-2 border-neutral-900 pt-3 flex justify-between items-baseline">
              <span className="font-bold text-sm uppercase tracking-wider">Total Investment</span>
              <span className="text-2xl font-bold font-mono text-[#D91B24]">
                {previewQuote.currency} {Number(previewQuote.total_amount).toLocaleString()}
              </span>
            </div>

            {/* Notes */}
            {previewQuote.notes && (
              <div className="bg-neutral-50 p-3 rounded text-[11px] text-neutral-600 border border-neutral-200">
                <strong>Terms & Inclusions:</strong> {previewQuote.notes}
              </div>
            )}

            {/* Actions */}
            <div className="pt-4 border-t border-neutral-200 flex justify-between items-center print:hidden">
              <button
                onClick={() => setPreviewQuote(null)}
                className="px-4 py-2 text-xs font-semibold rounded bg-neutral-200 hover:bg-neutral-300 text-neutral-800 cursor-pointer"
              >
                Close Preview
              </button>

              <button
                onClick={() => window.print()}
                className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print or Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuotations;
