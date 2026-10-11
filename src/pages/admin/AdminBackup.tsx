import React, { useState } from 'react';
import {
  Database,
  Download,
  Upload,
  Trash2,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  HardDrive,
  ShieldCheck,
  FileJson,
} from 'lucide-react';
import { DB, isSupabaseConfigured } from '../../lib/supabase';

export const AdminBackup: React.FC = () => {
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleExport = async () => {
    setIsProcessing(true);
    try {
      const json = await DB.exportBackupJson();
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `saikat-photography-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setStatusMsg({
        type: 'success',
        text: 'Studio backup successfully downloaded to your device as JSON.',
      });
    } catch (e) {
      console.error(e);
      setStatusMsg({ type: 'error', text: 'Failed to export backup file.' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const text = await file.text();
      const ok = await DB.importBackupJson(text);
      if (ok) {
        setStatusMsg({
          type: 'success',
          text: 'Backup successfully restored! All studio content refreshed.',
        });
      } else {
        setStatusMsg({ type: 'error', text: 'Invalid JSON backup format.' });
      }
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Could not read or parse file.' });
    } finally {
      setIsProcessing(false);
      e.target.value = '';
    }
  };

  const handleCleanData = async () => {
    if (
      confirm(
        'WARNING: This will wipe all photos, services, packages, reviews, inquiries, and media records to a fresh clean empty state. Are you sure?'
      )
    ) {
      setIsProcessing(true);
      await DB.clearAllData();
      setIsProcessing(false);
      setStatusMsg({
        type: 'success',
        text: 'All demo and test data wiped. Studio database is now clean and empty.',
      });
    }
  };

  const handleSeedData = async () => {
    if (
      confirm(
        'Load curated luxury photography sample data? This will populate royal wedding photos, services, packages, reviews, bookings, and sample inquiries.'
      )
    ) {
      setIsProcessing(true);
      await DB.seedDemoData();
      setIsProcessing(false);
      setStatusMsg({
        type: 'success',
        text: 'Curated luxury photography sample data loaded successfully!',
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-white">
            Data Storage, Backups & Reset
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Complete database snapshot export, full restore, clean state wipe, or one-click luxury portfolio seeding.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-xs px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${
              isSupabaseConfigured
                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                : 'bg-neutral-800 text-neutral-300 border-neutral-700'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Local Storage Mode'}</span>
          </span>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-lg border text-xs flex items-center gap-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
              : 'bg-red-950/60 text-red-300 border-red-500/30'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Main Grid: Export / Import / Clean / Seed */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: JSON Export */}
        <div className="bg-[#0B0B0B] border border-white/10 rounded-lg p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-2.5 rounded bg-white/5 text-[#D91B24] inline-block">
              <Download className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Full Database Backup (JSON)</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Downloads a complete snapshot of all site settings, gallery photos, pricing packages, services, reviews, customer inquiries, FAQs, and scheduled shoots.
            </p>
          </div>

          <button
            onClick={handleExport}
            disabled={isProcessing}
            className="w-full bg-[#181818] hover:bg-white/10 text-white text-xs font-semibold py-2.5 px-4 rounded border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#D91B24]" />
            <span>Download Backup (.json)</span>
          </button>
        </div>

        {/* Card 2: Restore from Backup */}
        <div className="bg-[#0B0B0B] border border-white/10 rounded-lg p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-2.5 rounded bg-white/5 text-blue-400 inline-block">
              <Upload className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Restore from Backup</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Upload a previously exported JSON backup file to instantly restore your entire website and admin configurations.
            </p>
          </div>

          <label className="w-full bg-[#181818] hover:bg-white/10 text-white text-xs font-semibold py-2.5 px-4 rounded border border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 text-blue-400" />
            <span>Select JSON File to Restore</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
              disabled={isProcessing}
            />
          </label>
        </div>

        {/* Card 3: Seed Curated Luxury Demo Data */}
        <div className="bg-[#0B0B0B] border border-white/10 rounded-lg p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-2.5 rounded bg-white/5 text-amber-400 inline-block">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Load Curated Luxury Showcase</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Populate the website with royal wedding photo galleries, 4K cinema packages, services, genuine reviews, scheduled shoots, and lead inquiries.
            </p>
          </div>

          <button
            onClick={handleSeedData}
            disabled={isProcessing}
            className="w-full bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-xs font-semibold py-2.5 px-4 rounded border border-amber-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Seed Luxury Sample Data</span>
          </button>
        </div>

        {/* Card 4: Clean All Demo Data */}
        <div className="bg-[#0B0B0B] border border-white/10 rounded-lg p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="p-2.5 rounded bg-white/5 text-red-400 inline-block">
              <Trash2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-white">Clean All Data (Fresh Empty State)</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Completely wipes all test photos, demo services, packages, inquiries, and reviews, leaving a totally clean canvas for the studio.
            </p>
          </div>

          <button
            onClick={handleCleanData}
            disabled={isProcessing}
            className="w-full bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-semibold py-2.5 px-4 rounded border border-red-500/30 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4 text-red-400" />
            <span>Clean All Data to Empty</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminBackup;
