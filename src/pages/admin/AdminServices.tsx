import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Eye, EyeOff, Check, X, Briefcase } from 'lucide-react';
import { Service } from '../../types/database';
import { DB } from '../../lib/supabase';

interface AdminServicesProps {
  services: Service[];
  onRefresh: () => void;
}

export const AdminServices: React.FC<AdminServicesProps> = ({ services, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const [featureInput, setFeatureInput] = useState('');

  const handleOpenNew = () => {
    setCurrentService({
      title: '',
      short_description: '',
      full_description: '',
      image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      starting_price: '₹50,000',
      price_type: 'starting_at',
      features: ['Lead Photographer & Assistant', 'Color-Graded High-Res Gallery'],
      cta_text: 'Inquire For Service',
      is_active: true,
      display_order: services.length + 1,
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService?.title) return;

    await DB.saveService(currentService as any);
    await DB.logActivity(
      currentService.id ? 'Service Updated' : 'Service Created',
      'Services',
      `Service: ${currentService.title}`
    );
    setIsEditing(false);
    setCurrentService(null);
    onRefresh();
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Delete service "${title}"?`)) {
      await DB.deleteService(id);
      await DB.logActivity('Service Deleted', 'Services', `Deleted: ${title}`);
      onRefresh();
    }
  };

  const handleToggleActive = async (s: Service) => {
    await DB.saveService({
      ...s,
      is_active: !s.is_active,
    });
    onRefresh();
  };

  const addFeature = () => {
    if (!featureInput.trim() || !currentService) return;
    const currentList = currentService.features || [];
    setCurrentService({
      ...currentService,
      features: [...currentList, featureInput.trim()],
    });
    setFeatureInput('');
  };

  const removeFeature = (idx: number) => {
    if (!currentService) return;
    const currentList = [...(currentService.features || [])];
    currentList.splice(idx, 1);
    setCurrentService({
      ...currentService,
      features: currentList,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif-display font-medium text-white">
            Studio Services
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Configure photography disciplines, rates, visual banners, and inclusions.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Service</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((serv) => (
          <div
            key={serv.id}
            className="bg-[#0B0B0B] rounded-lg border border-white/10 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-44 bg-neutral-900">
              <img
                src={serv.image_url}
                alt={serv.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-transparent" />
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => handleToggleActive(serv)}
                  className={`px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wider backdrop-blur-md ${
                    serv.is_active
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                      : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                  }`}
                >
                  {serv.is_active ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-lg font-serif-display font-medium text-white">
                    {serv.title}
                  </h3>
                  <span className="text-xs font-semibold text-[#D91B24]">
                    {serv.starting_price}
                  </span>
                </div>
                <p className="text-xs text-neutral-400 line-clamp-2">
                  {serv.short_description}
                </p>

                {serv.features && serv.features.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/5 space-y-1">
                    {serv.features.slice(0, 3).map((f, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-neutral-300">
                        <Check className="w-3 h-3 text-[#D91B24]" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <span className="text-[11px] text-neutral-500 font-mono">
                  Order: {serv.display_order}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentService(serv);
                      setIsEditing(true);
                    }}
                    className="p-1.5 text-neutral-400 hover:text-white"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(serv.id, serv.title)}
                    className="p-1.5 text-neutral-400 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {isEditing && currentService && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif-display text-white font-medium">
                {currentService.id ? 'Edit Service' : 'Add New Service'}
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
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={currentService.title || ''}
                  onChange={(e) =>
                    setCurrentService({ ...currentService, title: e.target.value })
                  }
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Banner Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={currentService.image_url || ''}
                  onChange={(e) =>
                    setCurrentService({ ...currentService, image_url: e.target.value })
                  }
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">
                    Price Text
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Starting at ₹75,000"
                    value={currentService.starting_price || ''}
                    onChange={(e) =>
                      setCurrentService({
                        ...currentService,
                        starting_price: e.target.value,
                      })
                    }
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-neutral-300 font-medium block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={currentService.display_order || 1}
                    onChange={(e) =>
                      setCurrentService({
                        ...currentService,
                        display_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Short Description *
                </label>
                <textarea
                  rows={2}
                  required
                  value={currentService.short_description || ''}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none resize-none"
                />
              </div>

              {/* Inclusions / Features */}
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Included Features
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. 4K Drone Aerial Included"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="flex-1 bg-[#050505] border border-white/10 rounded px-3 py-1.5 text-white"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="bg-[#D91B24] text-white px-3 py-1.5 rounded font-semibold"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {currentService.features?.map((f, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 rounded bg-white/5 text-[11px] text-white"
                    >
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-neutral-400 hover:text-red-400"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="srv-active"
                  checked={Boolean(currentService.is_active)}
                  onChange={(e) =>
                    setCurrentService({
                      ...currentService,
                      is_active: e.target.checked,
                    })
                  }
                  className="accent-[#D91B24]"
                />
                <label htmlFor="srv-active" className="text-neutral-300 cursor-pointer">
                  Service is visible on website
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
                  Save Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;
