import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { GalleryImage } from '../../types/database';

interface LightboxModalProps {
  image: GalleryImage | null;
  images: GalleryImage[];
  onClose: () => void;
  onSelectImage: (image: GalleryImage) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  image,
  images,
  onClose,
  onSelectImage,
}) => {
  if (!image) return null;

  const currentIndex = images.findIndex((img) => img.id === image.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < images.length - 1;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasPrev) onSelectImage(images[currentIndex - 1]);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNext) onSelectImage(images[currentIndex + 1]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && hasPrev) onSelectImage(images[currentIndex - 1]);
      if (e.key === 'ArrowRight' && hasNext) onSelectImage(images[currentIndex + 1]);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, hasPrev, hasNext, images, onClose, onSelectImage]);

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 transition-all duration-300 animate-fadeIn select-none"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-neutral-400 z-10 py-2">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.25em] text-[#D91B24] font-semibold">
            {image.category_name || 'Portfolio'}
          </span>
          <span className="text-neutral-600">/</span>
          <span className="text-xs text-neutral-400 font-mono">
            {currentIndex + 1} of {images.length}
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2 text-neutral-300 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          aria-label="Close Lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Frame with Previous/Next Controls */}
      <div className="relative flex-1 flex items-center justify-center my-auto min-h-0">
        {/* Previous Button */}
        {hasPrev && (
          <button
            onClick={handlePrev}
            className="absolute left-2 sm:left-6 z-20 p-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/80 rounded-full backdrop-blur-md transition-all cursor-pointer border border-white/10 hover:border-white/30"
            aria-label="Previous Image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* The Hero Image */}
        <div
          className="relative max-h-full max-w-full flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={image.image_url}
            alt={image.alt_text || image.title}
            className="max-h-[75vh] max-w-[90vw] sm:max-w-[80vw] object-contain rounded shadow-2xl transition-all duration-300"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Next Button */}
        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-2 sm:right-6 z-20 p-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/80 rounded-full backdrop-blur-md transition-all cursor-pointer border border-white/10 hover:border-white/30"
            aria-label="Next Image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Information Bar */}
      <div
        className="max-w-3xl mx-auto w-full text-center py-3 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 className="text-lg sm:text-2xl font-serif-display text-white font-medium mb-1">
          {image.title}
        </h4>
        {image.description && (
          <p className="text-xs sm:text-sm text-neutral-400 font-light max-w-xl mx-auto">
            {image.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default LightboxModal;
