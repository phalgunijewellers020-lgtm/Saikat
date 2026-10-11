import React, { useState, useEffect } from 'react';
import { Palette, Save, CheckCircle2, RotateCcw } from 'lucide-react';
import { ThemeSettings } from '../../types/database';
import { DB, DEFAULT_THEME_SETTINGS } from '../../lib/supabase';

export const AdminThemeSettings: React.FC = () => {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      const t = await DB.getTheme();
      setTheme(t);
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await DB.saveTheme(theme);
    await DB.logActivity('Theme Customization Updated', 'Theme', `Accent: ${theme.accent_red}`);
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleReset = () => {
    setTheme(DEFAULT_THEME_SETTINGS);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif-display font-medium text-white">
            Theme & Design System
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Fine-tune palette accents, typographic pairing, and spacing while maintaining brand integrity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-neutral-400 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#D91B24] hover:bg-[#b5141c] disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Theme'}</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Theme preferences saved!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs">
        {/* Left Column: Palette and Colors */}
        <div className="bg-[#0B0B0B] p-6 rounded-lg border border-white/10 space-y-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Color System & Contrast
          </h3>

          <div className="space-y-4">
            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                Brand Accent Crimson Red
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.accent_red}
                  onChange={(e) => setTheme({ ...theme, accent_red: e.target.value })}
                  className="w-10 h-10 rounded border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.accent_red}
                  onChange={(e) => setTheme({ ...theme, accent_red: e.target.value })}
                  className="flex-1 bg-[#050505] border border-white/10 rounded px-3 py-2 text-white font-mono uppercase"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                Inspired by the authentic crimson brush splash in the Saikat Photography logo.
              </p>
            </div>

            <div>
              <label className="text-neutral-300 font-medium block mb-1">
                Background Canvas Shade
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.background_color}
                  onChange={(e) => setTheme({ ...theme, background_color: e.target.value })}
                  className="w-10 h-10 rounded border border-white/20 bg-transparent cursor-pointer"
                />
                <input
                  type="text"
                  value={theme.background_color}
                  onChange={(e) => setTheme({ ...theme, background_color: e.target.value })}
                  className="flex-1 bg-[#050505] border border-white/10 rounded px-3 py-2 text-white font-mono uppercase"
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">
                Recommended near-black: #050505 or #080808 for maximum cinematic photo pop.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Geometry & Typography */}
        <div className="bg-[#0B0B0B] p-6 rounded-lg border border-white/10 space-y-5">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
            Typography & Layout Geometry
          </h3>

          <div>
            <label className="text-neutral-300 font-medium block mb-1">
              Display Heading Font
            </label>
            <select
              value={theme.font_heading}
              onChange={(e) => setTheme({ ...theme, font_heading: e.target.value as any })}
              className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="cormorant">Cormorant Garamond (Editorial Luxury Serif)</option>
              <option value="syne">Syne (High Fashion Modern Grotesk)</option>
              <option value="sans">Plus Jakarta Sans (Ultra Clean Precision)</option>
            </select>
          </div>

          <div>
            <label className="text-neutral-300 font-medium block mb-1">
              Button & Element Border Radius
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['none', 'sm', 'md', 'full'] as const).map((rad) => (
                <button
                  key={rad}
                  type="button"
                  onClick={() => setTheme({ ...theme, button_radius: rad })}
                  className={`p-2.5 text-center font-medium rounded border transition-colors capitalize ${
                    theme.button_radius === rad
                      ? 'border-[#D91B24] bg-[#D91B24]/20 text-white'
                      : 'border-white/10 bg-[#050505] text-neutral-400 hover:text-white'
                  }`}
                >
                  {rad}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-neutral-300 font-medium block mb-1">
              Vertical Section Spacing
            </label>
            <select
              value={theme.section_spacing}
              onChange={(e) =>
                setTheme({ ...theme, section_spacing: e.target.value as any })
              }
              className="w-full bg-[#050505] border border-white/10 rounded px-3 py-2 text-white"
            >
              <option value="compact">Compact (Py-16)</option>
              <option value="normal">Normal Cinema (Py-24)</option>
              <option value="relaxed">Relaxed Editorial (Py-32)</option>
            </select>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(theme.enable_animations)}
                onChange={(e) =>
                  setTheme({ ...theme, enable_animations: e.target.checked })
                }
                className="accent-[#D91B24]"
              />
              <span className="text-neutral-300">
                Enable Smooth Entrance Animations & Pulse Accents
              </span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminThemeSettings;
