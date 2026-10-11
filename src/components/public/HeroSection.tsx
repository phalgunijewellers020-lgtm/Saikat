import React from 'react';
import { ArrowDown, Sparkles, ChevronRight } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { SiteSettings } from '../../types/database';

interface HeroSectionProps {
  settings: SiteSettings;
  onOpenBooking: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, onOpenBooking }) => {
  const overlayStyle = {
    backgroundColor: `rgba(5, 5, 5, ${settings.hero_overlay_opacity || 0.6})`,
  };

  const alignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }[settings.hero_alignment || 'center'];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={settings.hero_image}
          alt="Saikat Photography Cinematic Visual"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms] transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
        />
        {/* Customizable Dimmer & Vignette Overlay */}
        <div className="absolute inset-0" style={overlayStyle} />
        <div className="absolute inset-0 cinematic-vignette opacity-80" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex flex-col justify-center items-center text-center">
        {/* Subtle Brand Tagline Banner */}
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-[#D91B24] animate-ping" />
          <span className="text-[11px] uppercase tracking-[0.3em] font-medium text-neutral-300">
            Fine Art Wedding & Editorial Studio
          </span>
        </div>

        {/* Brand Logo Presentation */}
        <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
          <BrandLogo size="lg" customLogoUrl={settings.logo_url} />
        </div>

        {/* Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif-display font-light text-white tracking-tight leading-[1.08] mb-6 whitespace-pre-line text-balance max-w-4xl drop-shadow-2xl">
          {settings.hero_title || 'CAPTURING MOMENTS.\nCREATING MEMORIES.'}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl font-light leading-relaxed mb-10 text-balance drop-shadow-md">
          {settings.hero_subtitle}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          <a
            href={settings.hero_cta_link || '#portfolio'}
            className="w-full sm:w-auto bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs uppercase tracking-[0.25em] font-semibold px-8 py-4 rounded transition-all duration-300 shadow-[0_10px_30px_rgba(217,27,36,0.35)] hover:shadow-[0_15px_40px_rgba(217,27,36,0.55)] flex items-center justify-center gap-2 cursor-pointer group active:scale-95"
          >
            <span>{settings.hero_cta_text || 'Explore Portfolio'}</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>

          <button
            onClick={onOpenBooking}
            className="w-full sm:w-auto bg-black/40 hover:bg-white/10 text-neutral-200 hover:text-white border border-white/20 text-xs uppercase tracking-[0.25em] font-semibold px-8 py-4 rounded backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-[#D91B24]" />
            <span>{settings.hero_secondary_cta_text || 'Book a Session'}</span>
          </button>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center text-neutral-400 hover:text-white transition-colors group cursor-pointer"
        aria-label="Scroll to about section"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-medium mb-2 group-hover:text-[#D91B24] transition-colors">
          Scroll Down
        </span>
        <ArrowDown className="w-4 h-4 animate-bounce text-neutral-400 group-hover:text-[#D91B24]" />
      </a>
    </section>
  );
};

export default HeroSection;
