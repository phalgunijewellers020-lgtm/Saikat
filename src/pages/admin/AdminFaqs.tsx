import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronDown,
  Eye,
  EyeOff,
} from 'lucide-react';
import { FaqItem } from '../../types/database';
import { DB } from '../../lib/supabase';

export const AdminFaqs: React.FC = () => {
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [formData, setFormData] = useState<Partial<FaqItem>>({
    question: '',
    answer: '',
    category: 'booking',
    display_order: 1,
    is_active: true,
  });

  const loadFaqs = async () => {
    setIsLoading(true);
    try {
      const list = await DB.getFaqs(false);
      setFaqs(list);
    } catch (err) {
      console.error('Error loading FAQs', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFaqs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question?.trim() || !formData.answer?.trim()) {
      alert('Question and answer are required.');
      return;
    }
    await DB.saveFaq(formData as any);
    setIsModalOpen(false);
    loadFaqs();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this FAQ?')) {
      await DB.deleteFaq(id);
      loadFaqs();
    }
  };

  const handleToggleActive = async (faq: FaqItem) => {
    await DB.saveFaq({ ...faq, is_active: !faq.is_active });
    loadFaqs();
  };

  const filteredFaqs = faqs.filter((f) => {
    if (filterCategory === 'all') return true;
    return f.category === filterCategory;
  }).sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-white">
            Studio Questions & FAQs
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Manage frequently asked questions regarding reservations, equipment, deliverables, and turnaround times.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              question: '',
              answer: '',
              category: 'booking',
              display_order: faqs.length + 1,
              is_active: true,
            });
            setIsModalOpen(true);
          }}
          className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Question</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0B0B0B] p-4 rounded-lg border border-white/10">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-neutral-400 font-medium mr-1">Category:</span>
          {['all', 'general', 'booking', 'delivery', 'equipment'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 text-xs rounded-full border cursor-pointer capitalize transition-colors ${
                filterCategory === cat
                  ? 'bg-white/15 text-white border-white/30 font-semibold'
                  : 'bg-white/5 text-neutral-400 border-white/5 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="text-xs text-neutral-400">
          Showing <span className="text-white font-semibold">{filteredFaqs.length}</span> questions
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3.5">
        {filteredFaqs.length === 0 ? (
          <div className="bg-[#0B0B0B] border border-white/10 rounded-lg p-10 text-center text-xs text-neutral-500">
            No questions found for this category.
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-[#0B0B0B] border border-white/10 hover:border-white/20 rounded-lg p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 transition-all"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[10px] uppercase font-semibold text-[#D91B24] bg-[#D91B24]/10 px-2 py-0.5 rounded">
                    {faq.category}
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">
                    Order #{faq.display_order}
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      faq.is_active ? 'bg-emerald-950/60 text-emerald-400' : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    {faq.is_active ? 'Visible on Website' : 'Hidden'}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white">{faq.question}</h3>
                <p className="text-xs text-neutral-400 leading-relaxed">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                <button
                  onClick={() => handleToggleActive(faq)}
                  className={`p-2 rounded border border-white/10 cursor-pointer transition-colors ${
                    faq.is_active ? 'bg-white/5 hover:bg-white/10 text-neutral-300' : 'bg-amber-950/60 text-amber-400'
                  }`}
                  title={faq.is_active ? 'Hide from public site' : 'Show on public site'}
                >
                  {faq.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => {
                    setFormData(faq);
                    setIsModalOpen(true);
                  }}
                  className="p-2 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                  title="Edit question"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 rounded bg-white/5 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 border border-white/10 transition-colors cursor-pointer"
                  title="Delete question"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101010] border border-white/15 rounded-xl max-w-lg w-full p-6 shadow-2xl relative space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-lg font-serif-display font-medium text-white">
                {formData.id ? 'Edit FAQ Item' : 'Add New FAQ Item'}
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
                  Question *
                </label>
                <input
                  type="text"
                  required
                  value={formData.question || ''}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="e.g. When will our wedding gallery and film be delivered?"
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Answer *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.answer || ''}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide an informative and comforting response..."
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category || 'booking'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  >
                    <option value="general">General</option>
                    <option value="booking">Booking & Dates</option>
                    <option value="delivery">Deliverables & Albums</option>
                    <option value="equipment">Cameras & Cinematography</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-300 block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.display_order || 1}
                    onChange={(e) => setFormData({ ...formData, display_order: Number(e.target.value) })}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded accent-[#D91B24]"
                  />
                  <span className="text-xs text-neutral-300">Visible on public website FAQ section</span>
                </label>
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
                  Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFaqs;
