import React, { useState, useEffect } from 'react';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Image as ImageIcon,
  ExternalLink,
  Plus,
} from 'lucide-react';
import { MediaItem } from '../../types/database';
import { DB, supabase, isSupabaseConfigured } from '../../lib/supabase';

export const AdminMediaLibrary: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const loadMedia = async () => {
    const list = await DB.getMedia();
    setMediaItems(list);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not an image.`);
        continue;
      }

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert(`Image ${file.name} exceeds 10MB limit.`);
        continue;
      }

      try {
        let publicUrl = '';

        if (isSupabaseConfigured) {
          // Upload to Supabase Storage bucket 'website-assets'
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const { data, error } = await supabase.storage
            .from('website-assets')
            .upload(fileName, file);

          if (!error && data) {
            const { data: urlData } = supabase.storage
              .from('website-assets')
              .getPublicUrl(fileName);
            publicUrl = urlData.publicUrl;
          }
        }

        // If offline or storage didn't return URL, convert to data URL
        if (!publicUrl) {
          publicUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });
        }

        await DB.addMedia({
          name: file.name,
          url: publicUrl,
          size_bytes: file.size,
          mime_type: file.type,
          alt_text: file.name.split('.')[0],
        });

        await DB.logActivity('Media Uploaded', 'Media Library', `Uploaded: ${file.name}`);
      } catch (err) {
        console.error('File upload error', err);
      }
    }

    setIsUploading(false);
    loadMedia();
  };

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete ${name} from media library?`)) {
      await DB.deleteMedia(id);
      await DB.logActivity('Media Deleted', 'Media Library', `Deleted file: ${name}`);
      loadMedia();
    }
  };

  const filtered = mediaItems.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif-display font-medium text-white">
            Media Library & Storage
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Store and manage photographic assets using Supabase Storage buckets.
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <label className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow">
            <Upload className="w-4 h-4" />
            <span>{isUploading ? 'Uploading...' : 'Upload Images'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center justify-between">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search filenames..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0B0B0B] border border-white/10 rounded px-3 py-1.5 pl-8 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D91B24]"
          />
          <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
        </div>

        <span className="text-xs text-neutral-400 font-mono">
          {filtered.length} files
        </span>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-[#0B0B0B] rounded-lg border border-white/10 overflow-hidden flex flex-col justify-between group"
          >
            <div className="relative aspect-square bg-neutral-900 overflow-hidden">
              <img
                src={item.url}
                alt={item.alt_text || item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="p-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-black transition-colors"
                  title="Copy URL"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(item.id, item.name)}
                  className="p-2 rounded-full bg-white/10 hover:bg-red-600 text-white transition-colors"
                  title="Delete Image"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-2.5 space-y-1">
              <p className="text-[11px] text-white truncate font-medium" title={item.name}>
                {item.name}
              </p>
              <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                <span>{item.size_bytes ? `${Math.round(item.size_bytes / 1024)} KB` : 'Asset'}</span>
                <button
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className="text-[#D91B24] hover:underline"
                >
                  {copiedId === item.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminMediaLibrary;
