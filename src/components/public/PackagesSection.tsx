import React, { useState, useEffect } from 'react';
import {
  Check,
  Star,
  Sparkles,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Send,
  X,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Layers,
} from 'lucide-react';
import { MainPackage, SubPackage, Package } from '../../types/database';
import { DB, CMS_UPDATE_EVENT } from '../../lib/supabase';
import { trackEvent } from '../../lib/analytics';

interface PackagesSectionProps {
  packages?: Package[];
  onSelectPackage?: (packageName: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onSelectPackage }) => {
  const [mainPackages, setMainPackages] = useState<MainPackage[]>([]);
  const [subPackages, setSubPackages] = useState<SubPackage[]>([]);
  const [selectedMainId, setSelectedMainId] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Enquiry Modal State
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [selectedSubForEnquiry, setSelectedSubForEnquiry] = useState<SubPackage | null>(null);
  const [selectedMainForEnquiry, setSelectedMainForEnquiry] = useState<MainPackage | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    event_date: '',
    location: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submittedRefId, setSubmittedRefId] = useState<string>('');

  const loadPackagesData = async () => {
    try {
      const [mList, sList] = await Promise.all([
        DB.getMainPackages(true), // only active main packages
        DB.getSubPackages(undefined, true), // only active sub-packages
      ]);
      setMainPackages(mList);
      setSubPackages(sList);

      // Default select the first active main package
      if (mList.length > 0 && (!selectedMainId || !mList.some((m) => m.id === selectedMainId))) {
        setSelectedMainId(mList[0].id);
      }
    } catch (err) {
      console.error('Error fetching dynamic packages', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPackagesData();
    window.addEventListener(CMS_UPDATE_EVENT, loadPackagesData);
    return () => window.removeEventListener(CMS_UPDATE_EVENT, loadPackagesData);
  }, []);

  const activeMainPackage = mainPackages.find((m) => m.id === selectedMainId) || mainPackages[0];

  const activeSubPackages = subPackages
    .filter((s) => s.main_package_id === selectedMainId && s.is_active)
    .sort((a, b) => a.display_order - b.display_order);

  // Open Enquiry Modal with auto-populated Main Package, Sub-Package, and Price
  const handleOpenEnquiry = (sub: SubPackage, main: MainPackage) => {
    setSelectedSubForEnquiry(sub);
    setSelectedMainForEnquiry(main);
    setFormData({
      name: '',
      phone: '',
      email: '',
      event_date: '',
      location: '',
      message: `Hello Saikat! We would love to enquire about reserving the ${sub.name} (${sub.price}) under ${main.name}. Please let us know date availability and booking procedure.`,
    });
    setErrorMessage(null);
    setSubmitSuccess(false);
    setIsEnquiryModalOpen(true);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubForEnquiry || !selectedMainForEnquiry) return;

    // Form Validation
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    if (!formData.phone.trim() || formData.phone.trim().length < 7) {
      setErrorMessage('Please provide a valid phone or WhatsApp number.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const created = await DB.createPackageEnquiry({
        customer_name: formData.name.trim(),
        customer_email: formData.email.trim(),
        customer_phone: formData.phone.trim(),
        message: formData.message.trim() || 'Enquiry submitted for ' + selectedSubForEnquiry.name,
        main_package_id: selectedMainForEnquiry.id,
        main_package_name: selectedMainForEnquiry.name,
        sub_package_id: selectedSubForEnquiry.id,
        sub_package_name: selectedSubForEnquiry.name,
        package_price: selectedSubForEnquiry.price,
        event_date: formData.event_date.trim() || undefined,
        location: formData.location.trim() || undefined,
        status: 'new',
      });

      trackEvent('package_enquiry_submitted', {
        main_package: selectedMainForEnquiry.name,
        sub_package: selectedSubForEnquiry.name,
        price: selectedSubForEnquiry.price,
      });

      setSubmittedRefId(created.id);
      setSubmitSuccess(true);
    } catch (err) {
      console.error('Error submitting package enquiry', err);
      setErrorMessage('Unable to submit enquiry right now. Please reach out to us directly via WhatsApp or phone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="packages" className="py-24 sm:py-32 bg-[#050505] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-red-950/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-2">
            <span className="w-6 h-[2px] bg-[#D91B24]" />
            <span className="text-xs uppercase tracking-[0.3em] font-medium text-neutral-400">
              Curated Collections & Pricing
            </span>
            <span className="w-6 h-[2px] bg-[#D91B24]" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif-display font-light text-white tracking-tight">
            Investment & Packages
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 font-light leading-relaxed">
            Transparent collections sculpted for your celebration. Compare deliverables, select your preferred tier, and receive a dedicated consultation proposal.
          </p>
        </div>

        {/* Main Package Categories Tabs (Silver, Gold, Diamond, etc.) */}
        {mainPackages.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-14">
            {mainPackages.map((cat) => {
              const isSelected = cat.id === selectedMainId;
              const subsCount = subPackages.filter((s) => s.main_package_id === cat.id && s.is_active).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedMainId(cat.id)}
                  className={`px-5 py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-300 flex items-center gap-2.5 cursor-pointer relative ${
                    isSelected
                      ? 'bg-gradient-to-r from-red-950/80 via-[#181818] to-red-950/80 border border-[#D91B24] text-white shadow-[0_0_25px_rgba(217,27,36,0.3)] scale-105'
                      : 'bg-[#0E0E0E] hover:bg-[#151515] text-neutral-400 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  <span className="font-serif-display text-base tracking-wide">{cat.name}</span>
                  {cat.badge && (
                    <span className="bg-[#D91B24] text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded">
                      {cat.badge}
                    </span>
                  )}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white font-semibold' : 'bg-white/5 text-neutral-400'
                    }`}
                  >
                    {subsCount} {subsCount === 1 ? 'tier' : 'tiers'}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Category Description Banner */}
        {activeMainPackage && (
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-1">
            <h3 className="text-xl sm:text-2xl font-serif-display text-white font-light">
              {activeMainPackage.name} Collections
            </h3>
            {activeMainPackage.description && (
              <p className="text-xs sm:text-sm text-neutral-400 font-light">
                {activeMainPackage.description}
              </p>
            )}
          </div>
        )}

        {/* Sub-Packages Dynamic Cards Grid */}
        {isLoading ? (
          <div className="py-20 text-center text-xs text-neutral-400">
            <div className="w-8 h-8 border-2 border-[#D91B24] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading investment options...
          </div>
        ) : activeSubPackages.length === 0 ? (
          <div className="text-center py-16 px-6 bg-[#0A0A0A] rounded-xl border border-white/10 max-w-xl mx-auto space-y-4">
            <Layers className="w-10 h-10 text-neutral-600 mx-auto" />
            <h4 className="text-base font-serif-display text-white">
              Tiers Under Formulation
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              We are currently finalizing custom investment deliverables for {activeMainPackage?.name || 'this collection'}. Inquire directly for a bespoke itinerary proposal.
            </p>
            <button
              onClick={() => onSelectPackage && onSelectPackage(`Bespoke ${activeMainPackage?.name || 'Collection'}`)}
              className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs uppercase tracking-[0.2em] font-semibold px-6 py-3 rounded transition-all cursor-pointer shadow"
            >
              Request Custom Proposal &rarr;
            </button>
          </div>
        ) : (
          <div className={`grid grid-cols-1 gap-6 lg:gap-8 items-stretch ${
            activeSubPackages.length === 1
              ? 'max-w-md mx-auto'
              : activeSubPackages.length === 2
              ? 'max-w-4xl mx-auto md:grid-cols-2'
              : activeSubPackages.length === 3
              ? 'md:grid-cols-2 lg:grid-cols-3'
              : 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
          }`}>
            {activeSubPackages.map((sub) => {
              const isHighlight = Boolean(sub.is_popular);

              return (
                <div
                  key={sub.id}
                  className={`relative rounded-xl flex flex-col justify-between transition-all duration-300 overflow-hidden group ${
                    isHighlight
                      ? 'bg-gradient-to-b from-[#141414] via-[#0E0E0E] to-[#121212] border-2 border-[#D91B24] shadow-[0_0_35px_rgba(217,27,36,0.22)] lg:-translate-y-2'
                      : 'bg-[#0A0A0A] border border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Badge if set */}
                  {sub.badge && (
                    <div className="absolute top-4 right-4 z-20">
                      <span className="bg-[#D91B24] text-white text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded shadow-md">
                        {sub.badge}
                      </span>
                    </div>
                  )}

                  {/* Thumbnail Image Header if configured */}
                  {sub.image_url && (
                    <div className="h-44 w-full relative overflow-hidden bg-neutral-900 border-b border-white/5">
                      <img
                        src={sub.image_url}
                        alt={sub.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30" />
                    </div>
                  )}

                  {/* Card Content Body */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      {/* Sub-Package Title & Category Reference */}
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-[#D91B24] font-semibold block mb-1">
                          {activeMainPackage?.name}
                        </span>
                        <h4 className="text-xl sm:text-2xl font-serif-display text-white font-medium">
                          {sub.name}
                        </h4>
                        {sub.description && (
                          <p className="text-xs text-neutral-400 font-light mt-1.5 leading-relaxed min-h-[32px]">
                            {sub.description}
                          </p>
                        )}
                      </div>

                      {/* Prominent Price */}
                      <div className="pt-2 pb-4 border-b border-white/10">
                        <div className="text-[10px] uppercase tracking-widest text-neutral-400 mb-0.5">
                          Investment
                        </div>
                        <div className="text-3xl sm:text-4xl font-display-modern font-bold text-white tracking-tight">
                          {sub.price}
                        </div>
                      </div>

                      {/* Included Features and Benefits */}
                      <div className="space-y-2.5">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-neutral-400">
                          Included Deliverables:
                        </p>
                        <div className="space-y-2">
                          {(sub.features || []).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-300">
                              <Check className="w-3.5 h-3.5 text-[#D91B24] shrink-0 mt-0.5" />
                              <span className="leading-snug">{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* "Enquire Now" Action Button */}
                    <div className="pt-6">
                      <button
                        onClick={() => handleOpenEnquiry(sub, activeMainPackage)}
                        className={`w-full py-3.5 rounded text-xs uppercase tracking-[0.2em] font-semibold transition-all duration-300 cursor-pointer active:scale-95 flex items-center justify-center gap-2 ${
                          isHighlight
                            ? 'bg-[#D91B24] hover:bg-[#b5141c] text-white shadow-xl hover:shadow-[0_0_25px_rgba(217,27,36,0.6)]'
                            : 'bg-white/10 hover:bg-[#D91B24] text-white border border-white/10 hover:border-transparent'
                        }`}
                      >
                        <span>Enquire Now</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Bespoke Advisory Note */}
        <div className="mt-16 text-center text-xs text-neutral-400 max-w-xl mx-auto space-y-2">
          <p>
            Require a custom multi-day itinerary, destination travel, or bespoke album specifications?
          </p>
          <button
            onClick={() => {
              const contactElem = document.getElementById('contact');
              if (contactElem) contactElem.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-white hover:text-[#D91B24] underline underline-offset-4 cursor-pointer font-medium"
          >
            Speak directly with our studio coordinator &rarr;
          </button>
        </div>
      </div>

      {/* DEDICATED CUSTOMER PACKAGE ENQUIRY MODAL */}
      {isEnquiryModalOpen && selectedSubForEnquiry && selectedMainForEnquiry && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0C0C0C] border border-white/15 rounded-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-8 space-y-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setIsEnquiryModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitSuccess ? (
              /* Successful Submission Screen */
              <div className="py-8 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif-display text-white">
                    Enquiry Received!
                  </h3>
                  <p className="text-xs text-neutral-300 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-white">{formData.name}</strong>. Your enquiry for the{' '}
                    <span className="text-[#D91B24] font-semibold">{selectedSubForEnquiry.name}</span> ({selectedSubForEnquiry.price}) under{' '}
                    <span className="text-white">{selectedMainForEnquiry.name}</span> has been logged directly with Saikat's studio desk.
                  </p>
                </div>

                {/* Summary Box */}
                <div className="bg-[#141414] border border-white/10 rounded-xl p-4 max-w-md mx-auto text-left text-xs space-y-1.5">
                  <div className="flex justify-between text-neutral-400">
                    <span>Package Tier:</span>
                    <span className="text-white font-medium">{selectedSubForEnquiry.name}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Price Quoted:</span>
                    <span className="text-emerald-400 font-mono font-bold">{selectedSubForEnquiry.price}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Contact Number:</span>
                    <span className="text-white">{formData.phone}</span>
                  </div>
                  {submittedRefId && (
                    <div className="flex justify-between text-neutral-500 text-[10px] pt-1 border-t border-white/5">
                      <span>Ref ID:</span>
                      <span className="font-mono">{submittedRefId}</span>
                    </div>
                  )}
                </div>

                <p className="text-[11px] text-neutral-400">
                  Our coordinator will reach out to you via WhatsApp / phone call within 24 business hours to discuss date availability and answer any questions.
                </p>

                <button
                  onClick={() => setIsEnquiryModalOpen(false)}
                  className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs uppercase tracking-widest font-semibold px-8 py-3 rounded transition-colors shadow-lg cursor-pointer"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Enquiry Input Form */
              <div className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#D91B24] font-semibold mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Official Studio Enquiry</span>
                  </div>
                  <h3 className="text-2xl font-serif-display text-white">
                    Enquire for {selectedSubForEnquiry.name}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Please provide your contact details to check date availability and receive our official booking dossier.
                  </p>
                </div>

                {/* Pre-populated Package Summary Card */}
                <div className="bg-gradient-to-r from-red-950/40 via-[#141414] to-neutral-900 border border-[#D91B24]/40 rounded-xl p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Selected Category & Tier
                    </span>
                    <div className="text-base font-serif-display font-medium text-white">
                      {selectedMainForEnquiry.name} &bull; {selectedSubForEnquiry.name}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      Deliverables: {selectedSubForEnquiry.features?.length || 0} inclusions
                    </div>
                  </div>
                  <div className="text-right border-l border-white/10 pl-4">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                      Price
                    </span>
                    <span className="text-xl font-bold font-mono text-emerald-400">
                      {selectedSubForEnquiry.price}
                    </span>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-red-950/60 border border-red-500/40 rounded-lg p-3 text-xs text-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleEnquirySubmit} className="space-y-4 text-xs">
                  {/* Name and Mobile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-medium block">
                        Your Full Name <span className="text-[#D91B24]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#161616] border border-white/10 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D91B24]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-medium block">
                        Mobile / WhatsApp Number <span className="text-[#D91B24]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#161616] border border-white/10 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D91B24]"
                      />
                    </div>
                  </div>

                  {/* Email & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-medium block">
                        Email Address <span className="text-[#D91B24]">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. ananya@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-[#161616] border border-white/10 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D91B24]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-medium block">
                        Planned Celebration Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={formData.event_date}
                        onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                        className="w-full bg-[#161616] border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#D91B24]"
                      />
                    </div>
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-medium block">
                      City / Venue Location (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Udaipur, Kolkata, Goa, Delhi NCR"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-[#161616] border border-white/10 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D91B24]"
                    />
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label className="text-neutral-300 font-medium block">
                      Enquiry Message or Notes
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Tell us a little about your ceremonies, timings, or any specific photography requirements..."
                      className="w-full bg-[#161616] border border-white/10 rounded-lg p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-[#D91B24]"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-lg bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs uppercase tracking-widest font-semibold transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(217,27,36,0.5)] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Enquiry...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Submit Package Enquiry for {selectedSubForEnquiry.price}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default PackagesSection;
