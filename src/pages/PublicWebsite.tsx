import React, { useState, useEffect } from 'react';
import {
  SiteSettings,
  GalleryCategory,
  GalleryImage,
  Service,
  Package,
  Testimonial,
  HomepageSection,
} from '../types/database';
import { DB, CMS_UPDATE_EVENT } from '../lib/supabase';
import PublicHeader from '../components/public/PublicHeader';
import HeroSection from '../components/public/HeroSection';
import AboutSection from '../components/public/AboutSection';
import PortfolioSection from '../components/public/PortfolioSection';
import ServicesSection from '../components/public/ServicesSection';
import PackagesSection from '../components/public/PackagesSection';
import TestimonialsSection from '../components/public/TestimonialsSection';
import ContactSection from '../components/public/ContactSection';
import PublicFooter from '../components/public/PublicFooter';
import ClientPortalModal from '../components/public/ClientPortalModal';
import FaqSection from '../components/public/FaqSection';
import { initGoogleAnalytics, trackEvent } from '../lib/analytics';
import { MessageCircle, KeyRound, Shield } from 'lucide-react';

export const PublicWebsite: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [prefilledPackage, setPrefilledPackage] = useState<string | undefined>(undefined);
  const [clientPortalOpen, setClientPortalOpen] = useState(false);

  const loadData = async () => {
    try {
      const [
        siteSettings,
        cats,
        imgs,
        servs,
        pkgs,
        tests,
        secs,
        analytics,
      ] = await Promise.all([
        DB.getSettings(),
        DB.getCategories(),
        DB.getGalleryImages(true),
        DB.getServices(true),
        DB.getPackages(true),
        DB.getTestimonials(true),
        DB.getSections(),
        DB.getAnalyticsSettings(),
      ]);

      setSettings(siteSettings);
      setCategories(cats);
      setImages(imgs);
      setServices(servs);
      setPackages(pkgs);
      setTestimonials(tests);
      setSections(secs);

      // Inject Google Analytics 4 tags
      initGoogleAnalytics(analytics);
    } catch (err) {
      console.error('Error loading public site data:', err);
    }
  };

  useEffect(() => {
    loadData();

    // Listen for live CMS updates so changes in Admin appear immediately
    window.addEventListener(CMS_UPDATE_EVENT, loadData);
    return () => window.removeEventListener(CMS_UPDATE_EVENT, loadData);
  }, []);

  const handleOpenBooking = (prefill?: string) => {
    if (prefill) {
      setPrefilledPackage(prefill);
    }
    const contactElem = document.getElementById('contact');
    if (contactElem) {
      contactElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-8 h-8 border-2 border-[#D91B24] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs uppercase tracking-[0.3em] text-neutral-400 font-medium">
            Loading Saikat Photography...
          </span>
        </div>
      </div>
    );
  }

  // Sort enabled sections according to admin configuration
  const sortedSections = [...sections]
    .filter((s) => s.is_enabled)
    .sort((a, b) => a.display_order - b.display_order);

  return (
    <div className="bg-[#050505] text-white selection:bg-[#D91B24] selection:text-white min-h-screen">
      {/* Public Navigation Header */}
      <PublicHeader
        settings={settings}
        onOpenBooking={() => handleOpenBooking()}
        onOpenClientPortal={() => setClientPortalOpen(true)}
      />

      {/* Main Dynamic Homepage Sections */}
      <main>
        {sortedSections.map((sec) => {
          switch (sec.section_key) {
            case 'hero':
              return (
                <HeroSection
                  key={sec.id}
                  settings={settings}
                  onOpenBooking={() => handleOpenBooking()}
                />
              );
            case 'about':
              return (
                <AboutSection
                  key={sec.id}
                  settings={settings}
                  onOpenBooking={() => handleOpenBooking()}
                />
              );
            case 'gallery':
              return (
                <PortfolioSection
                  key={sec.id}
                  categories={categories}
                  images={images}
                />
              );
            case 'services':
              return (
                <ServicesSection
                  key={sec.id}
                  services={services}
                  onSelectService={(title) => handleOpenBooking(`Service: ${title}`)}
                />
              );
            case 'packages':
              return (
                <PackagesSection
                  key={sec.id}
                  packages={packages}
                  onSelectPackage={(title) => handleOpenBooking(`Package: ${title}`)}
                />
              );
            case 'testimonials':
              return (
                <TestimonialsSection
                  key={sec.id}
                  testimonials={testimonials}
                />
              );
            case 'cta':
              return (
                <section
                  key={sec.id}
                  className="py-20 bg-gradient-to-r from-red-950/40 via-neutral-900/60 to-red-950/40 border-y border-white/10 text-center relative overflow-hidden"
                >
                  <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
                    <p className="text-xs uppercase tracking-[0.3em] text-[#D91B24] font-semibold">
                      Limited Commissions For 2026-2027 Season
                    </p>
                    <h3 className="text-3xl sm:text-5xl font-serif-display font-light text-white">
                      Let's Create Unforgettable Art Together
                    </h3>
                    <p className="text-neutral-400 text-sm sm:text-base max-w-xl mx-auto font-light leading-relaxed">
                      Reach out today to discuss your vision, check date availability, or schedule a coffee consultation with Saikat.
                    </p>
                    <button
                      onClick={() => handleOpenBooking()}
                      className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs uppercase tracking-[0.25em] font-semibold px-8 py-3.5 rounded transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(217,27,36,0.5)] cursor-pointer"
                    >
                      Reserve Your Date Now
                    </button>
                  </div>
                </section>
              );
            case 'contact':
              return (
                <ContactSection
                  key={sec.id}
                  settings={settings}
                  prefillPackageOrService={prefilledPackage}
                  onClearPrefill={() => setPrefilledPackage(undefined)}
                />
              );
            default:
              return null;
          }
        })}

        {/* Public Frequently Asked Questions */}
        <FaqSection onOpenBooking={() => handleOpenBooking()} />
      </main>

      {/* Floating WhatsApp Concierge Widget */}
      {settings.whatsapp_number && (
        <a
          href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
            'Hello Saikat Photography! I am interested in checking wedding date availability and packages.'
          )}`}
          target="_blank"
          rel="noreferrer"
          onClick={() => trackEvent('click_whatsapp', { source: 'floating_concierge' })}
          className="fixed bottom-6 right-6 z-40 bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] flex items-center gap-2.5 transition-all duration-300 group cursor-pointer hover:scale-105"
          title="Direct WhatsApp Chat with Studio"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
          </span>
          <MessageCircle className="w-5 h-5" />
          <span className="hidden md:inline text-xs font-semibold tracking-wide pr-1">
            Chat with Studio
          </span>
        </a>
      )}

      {/* Client Proofing Portal PIN Modal */}
      <ClientPortalModal
        isOpen={clientPortalOpen}
        onClose={() => setClientPortalOpen(false)}
      />

      {/* Public Footer */}
      <PublicFooter settings={settings} onOpenBooking={() => handleOpenBooking()} />
    </div>
  );
};

export default PublicWebsite;
