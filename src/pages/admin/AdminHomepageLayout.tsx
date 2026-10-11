import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Eye, EyeOff, Save, Sliders, CheckCircle2 } from 'lucide-react';
import { HomepageSection } from '../../types/database';
import { DB } from '../../lib/supabase';

export const AdminHomepageLayout: React.FC = () => {
  const [sections, setSections] = useState<HomepageSection[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const load = async () => {
      const s = await DB.getSections();
      setSections(s);
    };
    load();
  }, []);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    updated.forEach((sec, idx) => (sec.display_order = idx + 1));
    setSections(updated);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    updated.forEach((sec, idx) => (sec.display_order = idx + 1));
    setSections(updated);
  };

  const toggleVisibility = (id: string) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, is_enabled: !s.is_enabled } : s
    );
    setSections(updated);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await DB.saveSections(sections);
    await DB.logActivity('Homepage Layout Changed', 'Layout', 'Updated section order and visibility');
    setIsSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl font-serif-display font-medium text-white">
            Homepage Section Builder
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Reorder sections or toggle their visibility on the live website.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#D91B24] hover:bg-[#b5141c] disabled:opacity-50 text-white text-xs font-semibold px-4 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
        >
          <Save className="w-4 h-4" />
          <span>{isSaving ? 'Saving...' : 'Apply Layout'}</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Homepage layout updated successfully!</span>
        </div>
      )}

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={`p-4 rounded-lg border flex items-center justify-between transition-all ${
              section.is_enabled
                ? 'bg-[#0B0B0B] border-white/10'
                : 'bg-neutral-900/40 border-white/5 opacity-60'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="w-6 h-6 rounded bg-neutral-800 text-neutral-400 text-xs font-mono flex items-center justify-center font-bold">
                {idx + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-white">{section.title}</h3>
                {section.subtitle && (
                  <p className="text-[11px] text-neutral-400">{section.subtitle}</p>
                )}
                <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-mono">
                  Key: {section.section_key}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisibility(section.id)}
                className={`p-1.5 rounded transition-colors ${
                  section.is_enabled
                    ? 'text-emerald-400 hover:bg-emerald-950/40'
                    : 'text-neutral-500 hover:text-white'
                }`}
                title={section.is_enabled ? 'Section Visible' : 'Section Hidden'}
              >
                {section.is_enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>

              <div className="flex items-center gap-1 border-l border-white/10 pl-2">
                <button
                  disabled={idx === 0}
                  onClick={() => moveUp(idx)}
                  className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-20 transition-colors"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  disabled={idx === sections.length - 1}
                  onClick={() => moveDown(idx)}
                  className="p-1.5 text-neutral-400 hover:text-white disabled:opacity-20 transition-colors"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminHomepageLayout;
