import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { SiteSettings } from '../../types/database';
import { DB } from '../../lib/supabase';
import { trackEvent } from '../../lib/analytics';

interface ContactSectionProps {
  settings: SiteSettings;
  prefillPackageOrService?: string;
  onClearPrefill?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  settings,
  prefillPackageOrService,
  onClearPrefill,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    event_type: 'Wedding Celebration',
    event_date: '',
    location: '',
    budget: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (prefillPackageOrService) {
      setFormData((prev) => ({
        ...prev,
        message: prev.message
          ? prev.message
          : `Hello Saikat! I am interested in inquiring about the "${prefillPackageOrService}" for our upcoming celebration.`,
      }));
    }
  }, [prefillPackageOrService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Strict Validation
    if (!formData.name.trim() || formData.name.length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 7) {
      setErrorMessage('Please enter a valid phone or WhatsApp number.');
      return;
    }
    if (!formData.message.trim()) {
      setErrorMessage('Please share a few details about your celebration.');
      return;
    }

    setIsSubmitting(true);

    try {
      await DB.createInquiry({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        event_type: formData.event_type,
        event_date: formData.event_date || undefined,
        location: formData.location.trim() || undefined,
        budget: formData.budget.trim() || undefined,
        message: formData.message.trim(),
      });

      trackEvent('inquiry_form_submit', {
        event_type: formData.event_type,
        location: formData.location.trim() || 'Unspecified',
        budget: formData.budget.trim() || 'Unspecified',
      });

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        event_type: 'Wedding Celebration',
        event_date: '',
        location: '',
        budget: '',
        message: '',
      });
      if (onClearPrefill) onClearPrefill();
    } catch (err) {
      console.error('Inquiry submission error', err);
      setErrorMessage('Unable to send inquiry at this moment. Please reach out via WhatsApp or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappCleanNumber = (settings.whatsapp_number || '+919876543210').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${whatsappCleanNumber}?text=${encodeURIComponent(
    'Hello Saikat Photography! I would like to inquire about booking a photography session.'
  )}`;

  return (
    <section id="contact" className="py-24 sm:py-32 bg-[#050505] relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#D91B24]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Studio Contact & Information */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[2px] bg-[#D91B24]" />
                <span className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-400">
                  Direct Inquiries
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-serif-display font-light text-white tracking-tight">
                Let Us Preserve Your Heirlooms
              </h2>
              <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed pt-2">
                We accept a strictly limited number of weddings and editorial sessions per season to ensure every film and gallery receives our complete devotion.
              </p>
            </div>

            {/* Studio Info Cards */}
            <div className="space-y-4 pt-4">
              {settings.phone && (
                <a
                  href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                  className="flex items-start gap-4 p-4 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#D91B24]/50 transition-colors group"
                >
                  <div className="p-2.5 rounded bg-white/5 text-[#D91B24] group-hover:bg-[#D91B24] group-hover:text-white transition-colors">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Direct Phone</p>
                    <p className="text-white text-sm font-semibold">{settings.phone}</p>
                  </div>
                </a>
              )}

              {settings.whatsapp_number && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-4 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-emerald-500/50 transition-colors group"
                >
                  <div className="p-2.5 rounded bg-emerald-950/40 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">WhatsApp Studio Chat</p>
                    <p className="text-white text-sm font-semibold">{settings.whatsapp_number}</p>
                    <span className="text-[11px] text-emerald-400 font-medium">Quick 15-min response</span>
                  </div>
                </a>
              )}

              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="flex items-start gap-4 p-4 rounded-lg bg-[#0D0D0D] border border-white/10 hover:border-[#D91B24]/50 transition-colors group"
                >
                  <div className="p-2.5 rounded bg-white/5 text-[#D91B24] group-hover:bg-[#D91B24] group-hover:text-white transition-colors">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Email Inquiries</p>
                    <p className="text-white text-sm font-semibold">{settings.email}</p>
                  </div>
                </a>
              )}

              {settings.address && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-[#0D0D0D] border border-white/10">
                  <div className="p-2.5 rounded bg-white/5 text-[#D91B24]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Studio Location</p>
                    <p className="text-white text-sm">{settings.address}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{settings.city}</p>
                  </div>
                </div>
              )}

              {settings.working_hours && (
                <div className="flex items-start gap-4 p-4 rounded-lg bg-[#0D0D0D] border border-white/10">
                  <div className="p-2.5 rounded bg-white/5 text-neutral-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">Consultation Hours</p>
                    <p className="text-white text-sm">{settings.working_hours}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Booking Form */}
          <div className="lg:col-span-7 bg-[#0D0D0D] p-6 sm:p-10 rounded-xl border border-white/10 shadow-2xl relative">
            {isSuccess ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-950/50 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif-display text-white">
                  Inquiry Received With Gratitude
                </h3>
                <p className="text-sm text-neutral-300 max-w-md mx-auto font-light leading-relaxed">
                  Thank you for considering Saikat Photography. Saikat and our lead coordinator will review your dates and connect with you within 24 hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => setIsSuccess(false)}
                    className="bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-widest px-6 py-3 rounded transition-colors"
                  >
                    Send Another Note
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-serif-display text-white mb-1">
                    Reserve Your Date
                  </h3>
                  <p className="text-xs text-neutral-400 font-light">
                    Kindly complete the form below to check availability and request a detailed studio investment brochure.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-4 rounded bg-red-950/50 border border-red-500/40 text-xs text-red-200 flex items-center gap-3">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Roy & Rohan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Event Type */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                      Celebration Type
                    </label>
                    <select
                      value={formData.event_type}
                      onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                    >
                      <option value="Wedding Celebration">Wedding Celebration</option>
                      <option value="Destination Royal Wedding">Destination Royal Wedding</option>
                      <option value="Pre-Wedding & Couple Story">Pre-Wedding & Couple Story</option>
                      <option value="Engagement / Sangeet">Engagement / Sangeet</option>
                      <option value="Portraits / Editorial Fashion">Portraits / Editorial Fashion</option>
                      <option value="Baby & Maternity">Baby & Maternity</option>
                      <option value="Commercial / Other">Commercial / Other</option>
                    </select>
                  </div>

                  {/* Event Date */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                      Tentative Date
                    </label>
                    <input
                      type="date"
                      value={formData.event_date}
                      onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                      Location / Venue City
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Udaipur / Kolkata / Goa"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Estimated Budget */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                    Estimated Budget Range (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹75,000 - ₹1,50,000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors"
                  />
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-neutral-300 font-medium block">
                    Tell Us About Your Vision & Events *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us about the ceremonies, venues, estimated guest count, and the vibe you are dreaming of..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-4 py-3 text-sm text-white placeholder-neutral-600 focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#D91B24] hover:bg-[#b5141c] disabled:opacity-50 text-white text-xs uppercase tracking-[0.25em] font-semibold py-4 rounded transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(217,27,36,0.4)] active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting to Studio...' : 'Send Booking Inquiry'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
