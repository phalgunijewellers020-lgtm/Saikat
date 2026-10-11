import React, { useState, useMemo } from 'react';
import { Maximize2, Sparkles } from 'lucide-react';
import { GalleryCategory, GalleryImage } from '../../types/database';
import LightboxModal from './LightboxModal';

interface PortfolioSectionProps {
  categories: GalleryCategory[];
  images: GalleryImage[];
}

export const PortfolioSection: React.FC<PortfolioSectionProps> = ({ categories, images }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);

  // Active categories only
  const activeCategories = useMemo(
    () => categories.filter((c) => c.is_active).sort((a, b) => a.display_order - b.display_order),
    [categories]
  );

  // Filtered images
  const filteredImages = useMemo(() => {
    const list = images.filter((img) => img.is_published);
    if (selectedCategory === 'all') return list;
    return list.filter((img) => img.category_id === selectedCategory);
  }, [images, selectedCategory]);

  return (
    <section id="portfolio" className="py-24 sm:py-32 bg-[#050505] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-white/10 pb-8 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[2px] bg-[#D91B24]" />
              <span className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-400">
                Visual Heirlooms
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif-display font-light text-white tracking-tight">
              Selected Works & Stories
            </h2>
          </div>

          <p className="text-sm text-neutral-400 max-w-md font-light leading-relaxed">
            Every celebration holds an unrepeatable rhythm. Browse through our favorite moments across candid rituals, regal destination vows, and intimate portraits.
          </p>
        </div>

        {/* Dynamic Category Segmented Controls (Buttons, not pill enclosures) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium rounded transition-all duration-300 cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#D91B24] text-white shadow-lg shadow-red-950/50'
                : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
            }`}
          >
            All Works ({images.filter((i) => i.is_published).length})
          </button>

          {activeCategories.map((category) => {
            const count = images.filter((i) => i.is_published && i.category_id === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 text-xs uppercase tracking-[0.2em] font-medium rounded transition-all duration-300 cursor-pointer whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-[#D91B24] text-white shadow-lg shadow-red-950/50'
                    : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Portfolio Gallery Grid */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-20 px-6 bg-[#0D0D0D]/60 rounded-xl border border-white/5 max-w-xl mx-auto space-y-3">
            <p className="text-sm font-medium text-neutral-200">New Portfolio Works In Curation</p>
            <p className="text-xs text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
              Our latest wedding stories, editorial portraits, and destination films are currently being updated in our studio archive. Contact our studio for private client previews.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredImages.map((image, idx) => (
              <div
                key={image.id}
                onClick={() => setLightboxImage(image)}
                className="group relative overflow-hidden rounded bg-[#0D0D0D] border border-white/10 cursor-pointer shadow-lg aspect-[4/5] transition-all duration-500 hover:border-white/30 hover:-translate-y-1"
              >
                {/* Image */}
                <img
                  src={image.image_url}
                  alt={image.alt_text || image.title}
                  className="w-full h-full object-cover object-center filter grayscale-[25%] group-hover:grayscale-0 transition-all duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    // Fallback to high quality photography placeholder
                    (e.target as HTMLImageElement).src =
                      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85';
                  }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

                {/* Hover Content */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between transition-transform duration-300">
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[11px] uppercase tracking-[0.25em] text-[#D91B24] font-semibold">
                      {image.category_name || 'Portfolio'}
                    </span>
                    <span className="p-2 bg-black/60 rounded-full text-white backdrop-blur-md">
                      <Maximize2 className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-xl sm:text-2xl font-serif-display text-white font-medium mb-1">
                      {image.title}
                    </h3>
                    {image.description && (
                      <p className="text-xs text-neutral-300 line-clamp-2 font-light opacity-90">
                        {image.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <LightboxModal
        image={lightboxImage}
        images={filteredImages}
        onClose={() => setLightboxImage(null)}
        onSelectImage={(img) => setLightboxImage(img)}
      />
    </section>
  );
};

export default PortfolioSection;
