import React, { useState } from 'react';
import { Save, Globe, Phone, Share2, Sparkles, Image, CheckCircle2, Shield } from 'lucide-react';
import { SiteSettings } from '../../types/database';
import { DB } from '../../lib/supabase';
import BrandLogo from '../../components/BrandLogo';

interface AdminSiteSettingsProps {
  settings: SiteSettings;
  onRefresh: () => void;
}

export const AdminSiteSettings: React.FC<AdminSiteSettingsProps> = ({ settings, onRefresh }) => {
  const [formData, setFormData] = useState<SiteSettings>({ ...settings });
  const [activeTab, setActiveTab] = useState<'brand' | 'hero' | 'contact' | 'social' | 'seo'>('brand');
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await DB.updateSettings(formData);
    await DB.logActivity('Site Settings Updated', 'Settings', `Updated section: ${activeTab}`);
    setIsSaving(false);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif-display font-medium text-white">
            Site & Brand Configuration
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Control brand identity, hero banners, studio contact channels, and SEO meta.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {successMessage && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Saved to Supabase!</span>
            </span>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto scrollbar-none">
        {[
          { id: 'brand', label: 'Branding & About' },
          { id: 'hero', label: 'Hero Banner' },
          { id: 'contact', label: 'Contact & Studio' },
          { id: 'social', label: 'Social Channels' },
          { id: 'seo', label: 'SEO & Meta Tags' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#D91B24] text-white shadow'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: BRANDING & ABOUT */}
        {activeTab === 'brand' && (
          <div className="bg-[#0B0B0B] p-6 rounded-lg border border-white/10 space-y-6">
            <h3 className="text-base font-semibold text-white">
              Brand Identity & About Section
            </h3>

            {/* Logo Preview */}
            <div className="p-4 rounded bg-[#050505] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-white">Official Brand Logo Preview</p>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  The primary identity features dark contrast, red brush splash, signature script, and clean PHOTOGRAPHY type.
                </p>
              </div>
              <div className="p-3 bg-black rounded border border-white/10">
                <BrandLogo size="md" customLogoUrl={formData.logo_url} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Custom Logo URL (Optional replacement)
                </label>
                <input
                  type="url"
                  placeholder="Leave empty to use official vector logo"
                  value={formData.logo_url || ''}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Photographer Name
                </label>
                <input
                  type="text"
                  value={formData.photographer_name}
                  onChange={(e) => setFormData({ ...formData, photographer_name: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Studio Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Photographer Portrait Image URL
                </label>
                <input
                  type="url"
                  value={formData.photographer_image}
                  onChange={(e) => setFormData({ ...formData, photographer_image: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  About Headline
                </label>
                <input
                  type="text"
                  value={formData.bio_headline}
                  onChange={(e) => setFormData({ ...formData, bio_headline: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  About Philosophy Story
                </label>
                <textarea
                  rows={3}
                  value={formData.bio_description}
                  onChange={(e) => setFormData({ ...formData, bio_description: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Secondary Quote / Highlight
                </label>
                <textarea
                  rows={2}
                  value={formData.bio_secondary_text || ''}
                  onChange={(e) => setFormData({ ...formData, bio_secondary_text: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4 border-t border-white/10">
              <div>
                <label className="text-neutral-400 block mb-1">Years Experience</label>
                <input
                  type="number"
                  value={formData.experience_years}
                  onChange={(e) =>
                    setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">Weddings Captured</label>
                <input
                  type="number"
                  value={formData.weddings_count}
                  onChange={(e) =>
                    setFormData({ ...formData, weddings_count: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">Happy Couples</label>
                <input
                  type="number"
                  value={formData.happy_clients_count}
                  onChange={(e) =>
                    setFormData({ ...formData, happy_clients_count: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-400 block mb-1">Events Covered</label>
                <input
                  type="number"
                  value={formData.events_count}
                  onChange={(e) =>
                    setFormData({ ...formData, events_count: parseInt(e.target.value) || 0 })
                  }
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-1.5 text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HERO BANNER */}
        {activeTab === 'hero' && (
          <div className="bg-[#0B0B0B] p-6 rounded-lg border border-white/10 space-y-5 text-xs">
            <h3 className="text-base font-semibold text-white">Hero Section Appearance</h3>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                Hero Full-Screen Background Image URL *
              </label>
              <input
                type="url"
                required
                value={formData.hero_image}
                onChange={(e) => setFormData({ ...formData, hero_image: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                Hero Main Headline (supports line breaks)
              </label>
              <textarea
                rows={2}
                value={formData.hero_title}
                onChange={(e) => setFormData({ ...formData, hero_title: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                Hero Subtitle
              </label>
              <textarea
                rows={2}
                value={formData.hero_subtitle}
                onChange={(e) => setFormData({ ...formData, hero_subtitle: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 focus:border-[#D91B24] rounded px-3 py-2 text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Primary CTA Text
                </label>
                <input
                  type="text"
                  value={formData.hero_cta_text}
                  onChange={(e) => setFormData({ ...formData, hero_cta_text: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Primary CTA Link (e.g. #portfolio)
                </label>
                <input
                  type="text"
                  value={formData.hero_cta_link}
                  onChange={(e) => setFormData({ ...formData, hero_cta_link: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Secondary CTA Text
                </label>
                <input
                  type="text"
                  value={formData.hero_secondary_cta_text}
                  onChange={(e) =>
                    setFormData({ ...formData, hero_secondary_cta_text: e.target.value })
                  }
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Secondary CTA Link (e.g. #contact)
                </label>
                <input
                  type="text"
                  value={formData.hero_secondary_cta_link}
                  onChange={(e) =>
                    setFormData({ ...formData, hero_secondary_cta_link: e.target.value })
                  }
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Overlay Darkness (Opacity: {formData.hero_overlay_opacity})
                </label>
                <input
                  type="range"
                  min="0.2"
                  max="0.85"
                  step="0.05"
                  value={formData.hero_overlay_opacity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero_overlay_opacity: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-[#D91B24]"
                />
              </div>
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Hero Text Alignment
                </label>
                <select
                  value={formData.hero_alignment}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      hero_alignment: e.target.value as any,
                    })
                  }
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
                >
                  <option value="center">Centered (Default Cinema)</option>
                  <option value="left">Left Aligned</option>
                  <option value="right">Right Aligned</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CONTACT & STUDIO */}
        {activeTab === 'contact' && (
          <div className="bg-[#0B0B0B] p-6 rounded-lg border border-white/10 space-y-5 text-xs">
            <h3 className="text-base font-semibold text-white">Direct Studio Channels</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  WhatsApp Number (with country code)
                </label>
                <input
                  type="text"
                  value={formData.whatsapp_number}
                  onChange={(e) => setFormData({ ...formData, whatsapp_number: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  Inquiry Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-neutral-300 font-medium block mb-1">
                  City / Base Region
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                Studio Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                Working / Consultation Hours
              </label>
              <input
                type="text"
                value={formData.working_hours}
                onChange={(e) => setFormData({ ...formData, working_hours: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        )}

        {/* TAB 4: SOCIAL CHANNELS */}
        {activeTab === 'social' && (
          <div className="bg-[#0B0B0B] p-6 rounded-lg border border-white/10 space-y-4 text-xs">
            <h3 className="text-base font-semibold text-white">Social Media Links</h3>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={formData.instagram_url}
                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={formData.facebook_url}
                onChange={(e) => setFormData({ ...formData, facebook_url: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                YouTube Channel URL
              </label>
              <input
                type="url"
                value={formData.youtube_url}
                onChange={(e) => setFormData({ ...formData, youtube_url: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>
          </div>
        )}

        {/* TAB 5: SEO & META */}
        {activeTab === 'seo' && (
          <div className="bg-[#0B0B0B] p-6 rounded-lg border border-white/10 space-y-4 text-xs">
            <h3 className="text-base font-semibold text-white">Search Engine Optimization</h3>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                Browser Title Tag (&lt;title&gt;)
              </label>
              <input
                type="text"
                value={formData.site_title}
                onChange={(e) => setFormData({ ...formData, site_title: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
              />
            </div>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                Search Engine Meta Description
              </label>
              <textarea
                rows={3}
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white resize-none"
              />
            </div>

            <div className="p-3 rounded bg-[#050505] border border-white/5 space-y-1">
              <span className="text-[11px] font-semibold text-neutral-300">Google Search Snippet Preview:</span>
              <p className="text-blue-400 font-medium text-sm truncate">{formData.site_title}</p>
              <p className="text-emerald-500 text-[10px]">https://saikatphotography.com</p>
              <p className="text-neutral-400 text-xs line-clamp-2">{formData.tagline}</p>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#D91B24] hover:bg-[#b5141c] disabled:opacity-50 text-white text-xs uppercase tracking-wider font-semibold px-6 py-3 rounded flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Settings to Database'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSiteSettings;
