import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Check,
  Send,
  X,
  Share2,
  Smartphone,
  Mail,
  Sparkles,
} from 'lucide-react';
import { NotificationTemplate } from '../../types/database';
import { DB } from '../../lib/supabase';

export const AdminTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [testModalTemplate, setTestModalTemplate] = useState<NotificationTemplate | null>(null);
  const [testPhone, setTestPhone] = useState('+91 98301 22345');
  const [testClientName, setTestClientName] = useState('Ananya');

  const [formData, setFormData] = useState<Partial<NotificationTemplate>>({
    name: '',
    category: 'inquiry',
    channel: 'whatsapp',
    subject: '',
    body: '',
    variables: ['client_name', 'event_type', 'event_date'],
  });

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      const list = await DB.getTemplates();
      setTemplates(list);
    } catch (err) {
      console.error('Error loading templates', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim() || !formData.body?.trim()) {
      alert('Template name and body are required.');
      return;
    }
    await DB.saveTemplate(formData as any);
    setIsModalOpen(false);
    loadTemplates();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this message template?')) {
      await DB.deleteTemplate(id);
      loadTemplates();
    }
  };

  const handleCopy = (t: NotificationTemplate) => {
    navigator.clipboard.writeText(t.body);
    setCopiedId(t.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleLaunchWhatsAppTest = () => {
    if (!testModalTemplate) return;
    let resolved = testModalTemplate.body
      .replace(/{{client_name}}/g, testClientName || 'Client')
      .replace(/{{event_type}}/g, 'Wedding')
      .replace(/{{event_date}}/g, 'December 18, 2026')
      .replace(/{{location}}/g, 'Kolkata')
      .replace(/{{package_name}}/g, 'Gold Signature')
      .replace(/{{access_pin}}/g, '4821');

    const cleanNum = testPhone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNum}?text=${encodeURIComponent(resolved)}`, '_blank');
    setTestModalTemplate(null);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-white">
            WhatsApp & Client Communication Hub
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Pre-approved personalized templates for instantaneous client replies, wedding confirmations, and shoot reminders.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              category: 'inquiry',
              channel: 'whatsapp',
              subject: '',
              body: 'Hello {{client_name}}! Thank you for reaching out to Saikat Photography. We look forward to documenting your {{event_type}} on {{event_date}}.',
              variables: ['client_name', 'event_type', 'event_date'],
            });
            setIsModalOpen(true);
          }}
          className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Template</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((t) => (
          <div
            key={t.id}
            className="bg-[#0B0B0B] border border-white/10 hover:border-white/20 rounded-lg p-5 flex flex-col justify-between space-y-4 transition-all"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    {t.channel === 'whatsapp' ? <Smartphone className="w-3.5 h-3.5" /> : <Mail className="w-3.5 h-3.5" />}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-400">
                    {t.category}
                  </span>
                </div>
                <span className="text-[10px] text-neutral-500 capitalize">{t.channel}</span>
              </div>

              <h3 className="text-sm font-semibold text-white">{t.name}</h3>

              <div className="bg-[#141414] border border-white/5 rounded p-3 text-xs text-neutral-300 font-sans leading-relaxed whitespace-pre-wrap">
                {t.body}
              </div>

              {/* Variable Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {t.variables?.map((v) => (
                  <span
                    key={v}
                    className="text-[10px] font-mono text-[#D91B24] bg-[#D91B24]/10 px-2 py-0.5 rounded"
                  >
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
              <button
                onClick={() => setTestModalTemplate(t)}
                className="bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 text-xs font-semibold py-1.5 px-3 rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-emerald-500/30"
              >
                <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test in WhatsApp</span>
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleCopy(t)}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 cursor-pointer"
                  title="Copy message"
                >
                  {copiedId === t.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => {
                    setFormData(t);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 cursor-pointer"
                  title="Edit template"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded bg-white/5 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 border border-white/10 cursor-pointer"
                  title="Delete template"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101010] border border-white/15 rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-serif-display font-medium text-white">
                {formData.id ? 'Edit Message Template' : 'Create New Template'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Template Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Wedding Booking Confirmation"
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Channel
                  </label>
                  <select
                    value={formData.channel || 'whatsapp'}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  >
                    <option value="whatsapp">WhatsApp</option>
                    <option value="email">Email</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category || 'inquiry'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  >
                    <option value="inquiry">Inquiry Response</option>
                    <option value="booking">Booking Confirmation</option>
                    <option value="reminder">Shoot Day Reminder</option>
                    <option value="delivery">Gallery Delivery</option>
                    <option value="review">Review Request</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.body || ''}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                  placeholder="Use {{client_name}}, {{event_type}}, {{event_date}}, {{location}}..."
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
                <p className="text-[11px] text-neutral-500 mt-1">
                  Insert tokens like <code>&#123;&#123;client_name&#125;&#125;</code>, <code>&#123;&#123;event_date&#125;&#125;</code>, <code>&#123;&#123;package_name&#125;&#125;</code>.
                </p>
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
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Test WhatsApp Modal */}
      {testModalTemplate && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101010] border border-white/15 rounded-xl max-w-md w-full p-6 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Test WhatsApp Dispatch</span>
              </h3>
              <button
                onClick={() => setTestModalTemplate(null)}
                className="text-neutral-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Recipient Phone Number
                </label>
                <input
                  type="text"
                  value={testPhone}
                  onChange={(e) => setTestPhone(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Client Name (Placeholder)
                </label>
                <input
                  type="text"
                  value={testClientName}
                  onChange={(e) => setTestClientName(e.target.value)}
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div className="bg-[#141414] p-3 rounded text-[11px] text-neutral-300 border border-white/5 max-h-36 overflow-y-auto">
                <strong className="block text-neutral-400 mb-1">Resolved Preview:</strong>
                {testModalTemplate.body
                  .replace(/{{client_name}}/g, testClientName || 'Client')
                  .replace(/{{event_type}}/g, 'Wedding')
                  .replace(/{{event_date}}/g, 'December 18, 2026')
                  .replace(/{{location}}/g, 'Kolkata')
                  .replace(/{{package_name}}/g, 'Gold Signature')
                  .replace(/{{access_pin}}/g, '4821')}
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setTestModalTemplate(null)}
                className="px-4 py-2 text-xs font-semibold rounded bg-white/5 hover:bg-white/10 text-neutral-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLaunchWhatsAppTest}
                className="px-5 py-2 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Launch WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTemplates;
