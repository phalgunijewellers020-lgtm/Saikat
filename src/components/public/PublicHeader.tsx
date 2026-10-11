import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, Calendar, KeyRound } from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { SiteSettings } from '../../types/database';

interface PublicHeaderProps {
  settings: SiteSettings;
  onOpenBooking: () => void;
  onOpenClientPortal?: () => void;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({
  settings,
  onOpenBooking,
  onOpenClientPortal,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'About', href: '#about' },
    { name: 'Portfolio', href: '#portfolio' },
    { name: 'Services', href: '#services' },
    { name: 'Packages', href: '#packages' },
    { name: 'Kind Words', href: '#testimonials' },
    { name: 'FAQs', href: '#faqs' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/5 py-3 shadow-2xl'
            : 'bg-gradient-to-b from-black/80 via-black/40 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Official Brand Logo */}
          <a href="#hero" className="flex items-center focus:outline-none">
            <BrandLogo size="md" customLogoUrl={settings.logo_url} />
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-6" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-300 hover:text-white transition-colors relative py-1 group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#D91B24] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {onOpenClientPortal && (
              <button
                onClick={onOpenClientPortal}
                className="text-neutral-300 hover:text-white text-xs px-3 py-2 rounded border border-white/10 hover:border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                title="Enter 4-digit PIN for Private Client Gallery"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#D91B24]" />
                <span className="hidden xl:inline">Client Proofing</span>
              </button>
            )}

            <button
              onClick={onOpenBooking}
              className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs uppercase tracking-widest font-semibold px-4.5 py-2 rounded transition-all duration-300 hover:shadow-[0_0_20px_rgba(217,27,36,0.4)] flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Session</span>
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center space-x-2">
            {onOpenClientPortal && (
              <button
                onClick={onOpenClientPortal}
                className="p-1.5 text-neutral-300 border border-white/10 rounded"
                title="Client Proofing"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#D91B24]" />
              </button>
            )}
            <button
              onClick={onOpenBooking}
              className="bg-[#D91B24] text-white text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1.5 rounded"
            >
              Book
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-neutral-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 bg-[#050505]/98 backdrop-blur-xl md:hidden flex flex-col justify-between pt-24 pb-8 px-6 transition-all duration-300 animate-fadeIn">
          <div className="flex flex-col space-y-6 text-center">
            <div className="mx-auto mb-4">
              <BrandLogo size="md" customLogoUrl={settings.logo_url} />
            </div>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base uppercase tracking-[0.25em] font-medium text-neutral-200 hover:text-[#D91B24] transition-colors py-2"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="space-y-4 pt-6 border-t border-neutral-800 text-center">
            {settings.phone && (
              <a
                href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                className="text-sm text-neutral-300 hover:text-white flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-[#D91B24]" />
                <span>{settings.phone}</span>
              </a>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="w-full bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs uppercase tracking-widest font-semibold py-3 rounded transition-all cursor-pointer"
            >
              Reserve Your Date
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PublicHeader;
