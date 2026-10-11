import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Eye,
  EyeOff,
  Star,
  FolderPlus,
  MoveUp,
  MoveDown,
  X,
  Check,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { GalleryImage, GalleryCategory } from '../../types/database';
import { DB } from '../../lib/supabase';

interface AdminGalleryProps {
  categories: GalleryCategory[];
  images: GalleryImage[];
  onRefresh: () => void;
  openNewModalTrigger?: boolean;
}

export const AdminGallery: React.FC<AdminGalleryProps> = ({
  categories,
  images,
  onRefresh,
}) => {
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [isEditingImage, setIsEditingImage] = useState<boolean>(false);
  const [currentImage, setCurrentImage] = useState<Partial<GalleryImage> | null>(null);

  const [isManagingCategories, setIsManagingCategories] = useState<boolean>(false);
  const [categoryName, setCategoryName] = useState<string>('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Filtered list
  const filtered = images.filter((img) => {
    if (selectedCategoryFilter === 'all') return true;
    return img.category_id === selectedCategoryFilter;
  });

  const handleOpenNewImage = () => {
    setCurrentImage({
      title: '',
      description: '',
      category_id: categories[0]?.id || 'cat-weddings',
      category_name: categories[0]?.name || 'Weddings',
      image_url: '',
      alt_text: '',
      is_featured: false,
      is_published: true,
      display_order: images.length + 1,
    });
    setIsEditingImage(true);
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentImage?.title || !currentImage?.image_url) {
      alert('Please provide at least a title and image URL');
      return;
    }

    const matchedCat = categories.find((c) => c.id === currentImage.category_id);

    await DB.saveGalleryImage({
      ...currentImage,
      category_name: matchedCat?.name || 'General',
    } as any);

    await DB.logActivity(
      currentImage.id ? 'Image Updated' : 'Image Uploaded',
      'Gallery',
      `Photograph: ${currentImage.title}`
    );

    setIsEditingImage(false);
    setCurrentImage(null);
    onRefresh();
  };

  const handleDeleteImage = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await DB.deleteGalleryImage(id);
      await DB.logActivity('Image Deleted', 'Gallery', `Deleted photograph: ${title}`);
      onRefresh();
    }
  };

  const handleTogglePublish = async (img: GalleryImage) => {
    await DB.saveGalleryImage({
      ...img,
      is_published: !img.is_published,
    });
    onRefresh();
  };

  const handleToggleFeatured = async (img: GalleryImage) => {
    await DB.saveGalleryImage({
      ...img,
      is_featured: !img.is_featured,
    });
    onRefresh();
  };

  // Category Actions
  const handleSaveCategory = async () => {
    if (!categoryName.trim()) return;
    const currentCats = [...categories];

    if (editingCategoryId) {
      const idx = currentCats.findIndex((c) => c.id === editingCategoryId);
      if (idx !== -1) {
        currentCats[idx].name = categoryName.trim();
        currentCats[idx].slug = categoryName.trim().toLowerCase().replace(/\s+/g, '-');
      }
    } else {
      currentCats.push({
        id: 'cat-' + Date.now(),
        name: categoryName.trim(),
        slug: categoryName.trim().toLowerCase().replace(/\s+/g, '-'),
        display_order: currentCats.length + 1,
        is_active: true,
      });
    }

    await DB.saveCategories(currentCats);
    setCategoryName('');
    setEditingCategoryId(null);
    onRefresh();
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (confirm(`Delete category "${name}"? Existing images will be preserved.`)) {
      const updated = categories.filter((c) => c.id !== id);
      await DB.saveCategories(updated);
      onRefresh();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif-display font-medium text-white">
            Portfolio Gallery Management
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Upload high-resolution photography, assign categories, and control live status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsManagingCategories(true)}
            className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            <span>Manage Categories</span>
          </button>
          <button
            onClick={handleOpenNewImage}
            className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photograph</span>
          </button>
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategoryFilter('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
            selectedCategoryFilter === 'all'
              ? 'bg-[#D91B24] text-white'
              : 'bg-neutral-900 text-neutral-400 hover:text-white'
          }`}
        >
          All ({images.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategoryFilter(c.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
              selectedCategoryFilter === c.id
                ? 'bg-[#D91B24] text-white'
                : 'bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            {c.name} ({images.filter((i) => i.category_id === c.id).length})
          </button>
        ))}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((img) => (
          <div
            key={img.id}
            className="bg-[#0B0B0B] rounded-lg border border-white/10 overflow-hidden flex flex-col justify-between group shadow"
          >
            {/* Image Preview Container */}
            <div className="relative aspect-[4/5] bg-neutral-900 overflow-hidden">
              <img
                src={img.image_url}
                alt={img.alt_text || img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Status Badges */}
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <button
                  onClick={() => handleTogglePublish(img)}
                  title={img.is_published ? 'Published on website' : 'Draft only'}
                  className={`p-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition-colors ${
                    img.is_published
                      ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                      : 'bg-amber-950/80 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {img.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => handleToggleFeatured(img)}
                  title={img.is_featured ? 'Featured image' : 'Mark as featured'}
                  className={`p-1.5 rounded-full backdrop-blur-md transition-colors ${
                    img.is_featured
                      ? 'bg-[#D91B24] text-white'
                      : 'bg-black/50 text-neutral-400 hover:text-white'
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" />
                </button>
              </div>

              <div className="absolute top-2 right-2">
                <span className="text-[10px] font-semibold bg-black/70 backdrop-blur-md text-neutral-300 px-2 py-0.5 rounded border border-white/10">
                  {img.category_name}
                </span>
              </div>
            </div>

            {/* Info and Actions */}
            <div className="p-3.5 space-y-2">
              <h3 className="text-sm font-semibold text-white truncate" title={img.title}>
                {img.title}
              </h3>
              {img.description && (
                <p className="text-[11px] text-neutral-400 line-clamp-1">
                  {img.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/10">
                <span className="text-[10px] text-neutral-500 font-mono">
                  Order: {img.display_order}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentImage(img);
                      setIsEditingImage(true);
                    }}
                    className="p-1 text-neutral-400 hover:text-white transition-colors"
                    title="Edit Details"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteImage(img.id, img.title)}
                    className="p-1 text-neutral-400 hover:text-red-400 transition-colors"
                    title="Delete Image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Image Modal */}
      {isEditingImage && currentImage && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif-display text-white font-medium">
                {currentImage.id ? 'Edit Photograph' : 'Add New Photograph'}
              </h3>
              <button
                onClick={() => setIsEditingImage(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveImage} className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Photograph Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Whispers Under The Mandap"
                  value={currentImage.title || ''}
                  onChange={(e) => setCurrentImage({ ...currentImage, title: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Image URL (or Supabase Storage URL) *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={currentImage.image_url || ''}
                  onChange={(e) => setCurrentImage({ ...currentImage, image_url: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Paste any high-resolution image URL or one uploaded from the Media Library.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-300 font-medium block mb-1">
                    Category
                  </label>
                  <select
                    value={currentImage.category_id || categories[0]?.id}
                    onChange={(e) =>
                      setCurrentImage({ ...currentImage, category_id: e.target.value })
                    }
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-neutral-300 font-medium block mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={currentImage.display_order || 1}
                    onChange={(e) =>
                      setCurrentImage({
                        ...currentImage,
                        display_order: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional moment background story..."
                  value={currentImage.description || ''}
                  onChange={(e) => setCurrentImage({ ...currentImage, description: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Accessibility Alt Text
                </label>
                <input
                  type="text"
                  placeholder="Descriptive text for screen readers and SEO"
                  value={currentImage.alt_text || ''}
                  onChange={(e) => setCurrentImage({ ...currentImage, alt_text: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(currentImage.is_published)}
                    onChange={(e) =>
                      setCurrentImage({ ...currentImage, is_published: e.target.checked })
                    }
                    className="accent-[#D91B24]"
                  />
                  <span className="text-neutral-300">Published on Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(currentImage.is_featured)}
                    onChange={(e) =>
                      setCurrentImage({ ...currentImage, is_featured: e.target.checked })
                    }
                    className="accent-[#D91B24]"
                  />
                  <span className="text-neutral-300">Featured Highlight</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsEditingImage(false)}
                  className="px-4 py-2 rounded bg-white/5 hover:bg-white/10 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-[#D91B24] hover:bg-[#b5141c] text-white font-semibold"
                >
                  Save Photograph
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {isManagingCategories && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D0D0D] border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif-display text-white font-medium">
                Gallery Categories
              </h3>
              <button
                onClick={() => setIsManagingCategories(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Add or Edit Category Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Category name (e.g. Drone Landscapes)"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                className="flex-1 bg-[#050505] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24]"
              />
              <button
                type="button"
                onClick={handleSaveCategory}
                className="bg-[#D91B24] text-white px-3 py-2 rounded text-xs font-semibold"
              >
                {editingCategoryId ? 'Update' : 'Add'}
              </button>
            </div>

            {/* Categories List */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {categories.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between p-2.5 rounded bg-[#050505] border border-white/5 text-xs text-white"
                >
                  <span>{c.name}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingCategoryId(c.id);
                        setCategoryName(c.name);
                      }}
                      className="text-neutral-400 hover:text-white p-1"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(c.id, c.name)}
                      className="text-neutral-400 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-white/10">
              <button
                onClick={() => setIsManagingCategories(false)}
                className="px-4 py-1.5 rounded bg-white/10 text-xs text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
