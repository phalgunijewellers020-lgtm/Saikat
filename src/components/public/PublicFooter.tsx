import React, { useState } from 'react';
import { Instagram, Facebook, Youtube, Phone, Mail, MapPin, MessageSquare, Heart } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { SiteSettings } from '../../types/database';
import LegalModal from './LegalModal';

interface PublicFooterProps {
  settings: SiteSettings;
  onOpenBooking: () => void;
}

export const PublicFooter: React.FC<PublicFooterProps> = ({ settings, onOpenBooking }) => {
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  const whatsappCleanNumber = (settings.whatsapp_number || '+919876543210').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappCleanNumber}`;

  return (
    <>
      <footer className="bg-[#050505] border-t border-white/10 pt-20 pb-12 relative overflow-hidden">
        {/* Subtle decorative top hairline glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-[#D91B24]/40 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-white/5">
            {/* Col 1: Brand Logo & Editorial Bio */}
            <div className="lg:col-span-5 space-y-6">
              <a href="#hero" className="inline-block">
                <BrandLogo size="lg" customLogoUrl={settings.logo_url} />
              </a>
              <p className="text-sm text-neutral-400 font-light leading-relaxed max-w-sm">
                Fine-art luxury wedding cinematography & timeless photography. Sculpting natural light, raw emotions, and royal traditions into eternal visual heirlooms.
              </p>
              
              {/* Social Media Links */}
              <div className="flex items-center space-x-3 pt-2">
                {settings.instagram_url && (
                  <a
                    href={settings.instagram_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-[#D91B24] transition-all"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {settings.facebook_url && (
                  <a
                    href={settings.facebook_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-[#D91B24] transition-all"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
                {settings.youtube_url && (
                  <a
                    href={settings.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-[#D91B24] transition-all"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </a>
                )}
                {settings.whatsapp_number && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-full bg-white/5 text-neutral-400 hover:text-white hover:bg-emerald-600 transition-all"
                    aria-label="WhatsApp"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="lg:col-span-3 space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] font-semibold text-white">
                Navigation
              </p>
              <ul className="space-y-2.5 text-xs uppercase tracking-wider text-neutral-400 font-medium">
                <li>
                  <a href="#hero" className="hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About Saikat
                  </a>
                </li>
                <li>
                  <a href="#portfolio" className="hover:text-white transition-colors">
                    Portfolio Gallery
                  </a>
                </li>
                <li>
                  <a href="#services" className="hover:text-white transition-colors">
                    Services
                  </a>
                </li>
                <li>
                  <a href="#packages" className="hover:text-white transition-colors">
                    Investment & Packages
                  </a>
                </li>
                <li>
                  <a href="#testimonials" className="hover:text-white transition-colors">
                    Client Testimonials
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact Studio
                  </a>
                </li>
              </ul>
            </div>

            {/* Col 3: Studio Contact Info */}
            <div className="lg:col-span-4 space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] font-semibold text-white">
                Studio Contact
              </p>
              <div className="space-y-3 text-xs text-neutral-400">
                {settings.address && (
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-[#D91B24] shrink-0 mt-0.5" />
                    <span>{settings.address}, {settings.city}</span>
                  </div>
                )}
                {settings.phone && (
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-[#D91B24] shrink-0" />
                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-white transition-colors">
                      {settings.phone}
                    </a>
                  </div>
                )}
                {settings.email && (
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-[#D91B24] shrink-0" />
                    <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                      {settings.email}
                    </a>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={onOpenBooking}
                  className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-[11px] uppercase tracking-widest font-semibold px-5 py-2.5 rounded transition-all cursor-pointer"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Legal (NO ADMIN LINK) */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
            <p>
              &copy; {new Date().getFullYear()} {settings.photographer_name} Photography. All rights reserved.
            </p>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => setLegalModalType('privacy')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => setLegalModalType('terms')}
                className="hover:text-neutral-300 transition-colors cursor-pointer"
              >
                Terms of Service
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal Dialog */}
      <LegalModal
        type={legalModalType}
        onClose={() => setLegalModalType(null)}
        brandName={settings.photographer_name + ' Photography'}
      />
    </>
  );
};

export default PublicFooter;
