import React, { useState, useEffect } from 'react';
import {
  Lock,
  Plus,
  Trash2,
  Edit2,
  Share2,
  ExternalLink,
  KeyRound,
  Download,
  Image as ImageIcon,
  Check,
  X,
  Copy,
} from 'lucide-react';
import { ClientGallery } from '../../types/database';
import { DB } from '../../lib/supabase';

export const AdminClientGalleries: React.FC = () => {
  const [galleries, setGalleries] = useState<ClientGallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<ClientGallery>>({
    client_name: '',
    event_title: '',
    event_date: new Date().toISOString().split('T')[0],
    cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
    access_pin: Math.floor(1000 + Math.random() * 9000).toString(),
    images_count: 120,
    download_allowed: true,
    is_active: true,
    external_album_url: '',
  });

  const loadGalleries = async () => {
    setIsLoading(true);
    try {
      const list = await DB.getClientGalleries();
      setGalleries(list);
    } catch (err) {
      console.error('Error loading client galleries', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGalleries();
  }, []);

  const handleGeneratePin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setFormData({ ...formData, access_pin: pin });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_name?.trim() || !formData.event_title?.trim()) {
      alert('Client name and event title are required.');
      return;
    }
    await DB.saveClientGallery({
      ...formData,
      client_name: formData.client_name,
      event_title: formData.event_title,
    });
    setIsModalOpen(false);
    loadGalleries();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this client private album portal?')) {
      await DB.deleteClientGallery(id);
      loadGalleries();
    }
  };

  const handleCopyAccess = (g: ClientGallery) => {
    const text = `Private Gallery Access for ${g.client_name}:\nPortal: ${window.location.origin}\nAccess PIN: ${g.access_pin}`;
    navigator.clipboard.writeText(text);
    setCopiedId(g.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-white">
            Client Proofing & Private Portals
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Create PIN-protected private galleries where wedding couples and patrons view and select their photos.
          </p>
        </div>

        <button
          onClick={() => {
            setFormData({
              client_name: '',
              event_title: '',
              event_date: new Date().toISOString().split('T')[0],
              cover_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
              access_pin: Math.floor(1000 + Math.random() * 9000).toString(),
              images_count: 120,
              download_allowed: true,
              is_active: true,
              external_album_url: '',
            });
            setIsModalOpen(true);
          }}
          className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Client Portal</span>
        </button>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {galleries.length === 0 ? (
          <div className="col-span-full bg-[#0B0B0B] border border-white/10 rounded-lg p-10 text-center text-xs text-neutral-500">
            No private client portals created yet. Click "New Client Portal" to create a PIN-secured album.
          </div>
        ) : (
          galleries.map((g) => (
            <div
              key={g.id}
              className="bg-[#0B0B0B] border border-white/10 hover:border-white/20 rounded-lg overflow-hidden flex flex-col justify-between transition-all group"
            >
              <div className="relative aspect-video bg-neutral-900 overflow-hidden">
                <img
                  src={g.cover_image}
                  alt={g.event_title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
                <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white flex items-center gap-1 border border-white/20">
                  <KeyRound className="w-3 h-3 text-[#D91B24]" />
                  <span>PIN: {g.access_pin}</span>
                </div>
                <div className="absolute bottom-2.5 left-2.5 right-2.5">
                  <h3 className="text-sm font-semibold text-white drop-shadow">{g.client_name}</h3>
                  <p className="text-[11px] text-neutral-300 drop-shadow">{g.event_title}</p>
                </div>
              </div>

              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Date: {g.event_date}</span>
                  <span className="flex items-center gap-1">
                    <ImageIcon className="w-3 h-3 text-[#D91B24]" /> {g.images_count} photos
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className={`px-2 py-0.5 rounded ${g.is_active ? 'bg-emerald-950/60 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}>
                    {g.is_active ? 'Portal Active' : 'Suspended'}
                  </span>
                  <span className="text-neutral-400">
                    {g.download_allowed ? 'Downloads Enabled' : 'Proofing Only'}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleCopyAccess(g)}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-1.5 px-2.5 rounded flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-white/10"
                  >
                    {copiedId === g.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy PIN & Details</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setFormData(g);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 cursor-pointer"
                    title="Edit portal"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(g.id)}
                    className="p-1.5 rounded bg-white/5 hover:bg-red-950/60 text-neutral-400 hover:text-red-400 border border-white/10 cursor-pointer"
                    title="Delete portal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
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
                {formData.id ? 'Edit Client Proofing Portal' : 'Create Client Proofing Portal'}
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
                  Client / Couple Name *
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
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.event_title || ''}
                  onChange={(e) => setFormData({ ...formData, event_title: e.target.value })}
                  placeholder="e.g. The Royal Bawali Wedding Gallery"
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
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
                  <label className="text-xs font-semibold text-neutral-300 block mb-1 flex items-center justify-between">
                    <span>Secret 4-Digit PIN</span>
                    <button
                      type="button"
                      onClick={handleGeneratePin}
                      className="text-[10px] text-[#D91B24] hover:underline"
                    >
                      Regenerate
                    </button>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={formData.access_pin || ''}
                    onChange={(e) => setFormData({ ...formData, access_pin: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24] font-mono font-bold tracking-widest text-center"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  Cover Photo Image URL
                </label>
                <input
                  type="text"
                  value={formData.cover_image || ''}
                  onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-300 block mb-1">
                  External Full Album Link (Google Drive / Pixieset / Dropbox)
                </label>
                <input
                  type="url"
                  value={formData.external_album_url || ''}
                  onChange={(e) => setFormData({ ...formData, external_album_url: e.target.value })}
                  placeholder="https://drive.google.com/..."
                  className="w-full bg-[#181818] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
                />
              </div>

              <div className="flex items-center gap-5 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.download_allowed}
                    onChange={(e) => setFormData({ ...formData, download_allowed: e.target.checked })}
                    className="rounded accent-[#D91B24]"
                  />
                  <span className="text-xs text-neutral-300">Allow 4K Photo Downloads</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded accent-[#D91B24]"
                  />
                  <span className="text-xs text-neutral-300">Portal Visible & Active</span>
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
                  Save Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientGalleries;
