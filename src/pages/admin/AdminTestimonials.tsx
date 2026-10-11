import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Star, Quote, X, Check } from 'lucide-react';
import { Testimonial } from '../../types/database';
import { DB } from '../../lib/supabase';

interface AdminTestimonialsProps {
  testimonials: Testimonial[];
  onRefresh: () => void;
}

export const AdminTestimonials: React.FC<AdminTestimonialsProps> = ({
  testimonials,
  onRefresh,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial> | null>(null);

  const handleOpenNew = () => {
    setCurrentTestimonial({
      client_name: '',
      event_type: 'Wedding Celebration',
      client_image: '',
      rating: 5,
      review_text: '',
      event_date: 'Recently',
      is_published: true,
      display_order: testimonials.length + 1,
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTestimonial?.client_name || !currentTestimonial?.review_text) return;

    await DB.saveTestimonial(currentTestimonial as any);
    await DB.logActivity(
      currentTestimonial.id ? 'Testimonial Updated' : 'Testimonial Added',
      'Testimonials',
      `Client: ${currentTestimonial.client_name}`
    );
    setIsEditing(false);
    setCurrentTestimonial(null);
    onRefresh();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete testimonial from "${name}"?`)) {
      await DB.deleteTestimonial(id);
      await DB.logActivity('Testimonial Deleted', 'Testimonials', `Deleted: ${name}`);
      onRefresh();
    }
  };

  const handleTogglePublish = async (t: Testimonial) => {
    await DB.saveTestimonial({
      ...t,
      is_published: !t.is_published,
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif-display font-medium text-white">
            Client Testimonials & Kind Words
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Manage couple reviews, star ratings, and celebratory quotes on the public website.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((test) => (
          <div
            key={test.id}
            className="bg-[#0B0B0B] p-5 rounded-lg border border-white/10 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-[#D91B24]">
                  {Array.from({ length: test.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <button
                  onClick={() => handleTogglePublish(test)}
                  className={`text-[9px] px-2 py-0.5 rounded font-semibold uppercase ${
                    test.is_published
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {test.is_published ? 'Published' : 'Draft'}
                </button>
              </div>

              <p className="text-xs text-neutral-300 italic line-clamp-4">
                "{test.review_text}"
              </p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {test.client_image ? (
                  <img
                    src={test.client_image}
                    alt={test.client_name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-white">
                    {test.client_name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="text-xs font-semibold text-white">{test.client_name}</h4>
                  <p className="text-[10px] text-neutral-500">{test.event_type}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setCurrentTestimonial(test);
                    setIsEditing(true);
                  }}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(test.id, test.client_name)}
                  className="p-1 text-neutral-400 hover:text-red-400"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Testimonial Modal */}
      {isEditing && currentTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif-display text-white font-medium">
                {currentTestimonial.id ? 'Edit Testimonial' : 'Add Testimonial'}
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
                  Client / Couple Names *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya & Rohan Mukherjee"
                  value={currentTestimonial.client_name || ''}
                  onChange={(e) =>
                    setCurrentTestimonial({
                      ...currentTestimonial,
                      client_name: e.target.value,
                    })
                  }
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">
                    Event / Celebration Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Wedding at Jaipur"
                    value={currentTestimonial.event_type || ''}
                    onChange={(e) =>
                      setCurrentTestimonial({
                        ...currentTestimonial,
                        event_type: e.target.value,
                      })
                    }
                    className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">
                    Date / Month
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. December 2025"
                    value={currentTestimonial.event_date || ''}
                    onChange={(e) =>
                      setCurrentTestimonial({
                        ...currentTestimonial,
                        event_date: e.target.value,
                      })
                    }
                    className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Client Avatar Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={currentTestimonial.client_image || ''}
                  onChange={(e) =>
                    setCurrentTestimonial({
                      ...currentTestimonial,
                      client_image: e.target.value,
                    })
                  }
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Star Rating (1 - 5)
                </label>
                <select
                  value={currentTestimonial.rating || 5}
                  onChange={(e) =>
                    setCurrentTestimonial({
                      ...currentTestimonial,
                      rating: parseInt(e.target.value) || 5,
                    })
                  }
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white focus:outline-none"
                >
                  <option value={5}>5 Stars (★★★★★)</option>
                  <option value={4}>4 Stars (★★★★☆)</option>
                  <option value={3}>3 Stars (★★★☆☆)</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Testimonial Review Text *
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="The couple's heartfelt review..."
                  value={currentTestimonial.review_text || ''}
                  onChange={(e) =>
                    setCurrentTestimonial({
                      ...currentTestimonial,
                      review_text: e.target.value,
                    })
                  }
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="test-pub"
                  checked={Boolean(currentTestimonial.is_published)}
                  onChange={(e) =>
                    setCurrentTestimonial({
                      ...currentTestimonial,
                      is_published: e.target.checked,
                    })
                  }
                  className="accent-[#D91B24]"
                />
                <label htmlFor="test-pub" className="text-neutral-300 cursor-pointer">
                  Publish on public website
                </label>
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
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTestimonials;
