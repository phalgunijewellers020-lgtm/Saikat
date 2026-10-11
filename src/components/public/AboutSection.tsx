import React from 'react';
import { Award, Camera, Heart, Sparkles, MapPin } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { SiteSettings } from '../../types/database';

interface AboutSectionProps {
  settings: SiteSettings;
  onOpenBooking: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onOpenBooking }) => {
  const stats = [
    { label: 'Years of Artistry', value: settings.experience_years > 0 ? `${settings.experience_years}+` : null, icon: Camera },
    { label: 'Weddings Captured', value: settings.weddings_count > 0 ? `${settings.weddings_count}+` : null, icon: Heart },
    { label: 'Happy Couples', value: settings.happy_clients_count > 0 ? `${settings.happy_clients_count}+` : null, icon: Sparkles },
    { label: 'Events Covered', value: settings.events_count > 0 ? `${settings.events_count}+` : null, icon: Award },
  ].filter((s) => s.value !== null);

  return (
    <section id="about" className="py-24 sm:py-32 bg-[#050505] relative overflow-hidden">
      {/* Subtle ambient red glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-[#D91B24]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Photographer Visual Frame */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Backing decorative red accent border */}
              <div className="absolute -inset-4 border border-[#D91B24]/30 rounded-lg -rotate-1 hidden sm:block pointer-events-none" />
              
              <div className="relative rounded-lg overflow-hidden bg-[#0D0D0D] border border-white/10 shadow-2xl group">
                <img
                  src={settings.photographer_image}
                  alt={`${settings.photographer_name} - Master Photographer`}
                  className="w-full h-[520px] object-cover object-center filter grayscale group-hover:grayscale-0 transition-all duration-700 ease-out scale-100 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                
                {/* Gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Overlaid Badges */}
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-[#D91B24] font-semibold">
                      Founder & Creative Director
                    </p>
                    <h3 className="text-2xl font-serif-display text-white font-medium">
                      {settings.photographer_name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-[#D91B24]" />
                    <span>{settings.city || 'India & Worldwide'}</span>
                  </div>
                </div>
              </div>

              {/* Floating Signature element */}
              <div className="absolute -bottom-6 -right-4 hidden sm:block bg-[#0D0D0D] p-3 rounded-lg border border-white/10 shadow-xl">
                <BrandLogo size="sm" customLogoUrl={settings.logo_url} />
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Bio & Philosophy */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#D91B24]" />
                <span className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-400">
                  The Storyteller Behind The Lens
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif-display font-light text-white tracking-tight leading-tight text-balance">
                {settings.bio_headline}
              </h2>
            </div>

            <div className="space-y-5 text-neutral-300 text-base sm:text-lg font-light leading-relaxed">
              <p>{settings.bio_description}</p>
              {settings.bio_secondary_text && (
                <p className="text-neutral-400 text-sm sm:text-base border-l-2 border-[#D91B24] pl-4 italic font-serif-display">
                  "{settings.bio_secondary_text}"
                </p>
              )}
            </div>

            {/* Statistics Bar - Unboxed Editorial Format */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-white/10">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center gap-2 text-neutral-400 mb-1">
                        <Icon className="w-4 h-4 text-[#D91B24]" />
                        <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                          {stat.label}
                        </span>
                      </div>
                      <div className="text-2xl sm:text-3xl font-display-modern font-bold text-white tabular-nums">
                        {stat.value}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Action CTA */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenBooking}
                className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs uppercase tracking-[0.2em] font-semibold px-7 py-3.5 rounded transition-all duration-300 shadow-lg hover:shadow-[0_0_25px_rgba(217,27,36,0.4)] cursor-pointer"
              >
                Inquire For Your Celebration
              </button>
              <a
                href="#portfolio"
                className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-300 hover:text-white px-5 py-3.5 transition-colors"
              >
                View Selected Heirlooms &rarr;
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
