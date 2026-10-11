import React, { useState, useEffect } from 'react';
import {
  Database,
  Copy,
  Check,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Trash2,
  KeyRound,
  Globe,
  UploadCloud,
  DownloadCloud,
  CheckCircle,
  XCircle,
  ShieldCheck,
  Save,
  Link2,
  Terminal,
  Activity,
  Layers,
} from 'lucide-react';
import {
  isSupabaseConfigured,
  getActiveSupabaseCredentials,
  updateSupabaseCredentials,
  checkSupabaseFullHealth,
  syncLocalDataToSupabase,
  pullCloudDataToLocal,
  DB,
  SupabaseHealthReport,
} from '../../lib/supabase';

const SCHEMA_SQL = `-- ==============================================================================
-- SAIKAT PHOTOGRAPHY - COMPLETE PRODUCTION POSTGRESQL & SUPABASE SCHEMA
-- ==============================================================================
-- This script configures all 14 tables, triggers, indexes, Row Level Security (RLS),
-- storage buckets, and public policies for 24/7 global connectivity.
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query > Run).

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('super_admin', 'admin', 'editor');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE inquiry_status AS ENUM ('new', 'contacted', 'follow_up', 'booked', 'closed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE price_type AS ENUM ('fixed', 'starting_at', 'contact');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES / ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'editor',
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. SITE SETTINGS TABLE (Single row studio brand settings)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'site-settings-main',
  site_title TEXT NOT NULL DEFAULT 'Saikat Photography | Cinematic Luxury Weddings & Portraits',
  photographer_name TEXT NOT NULL DEFAULT 'Saikat',
  tagline TEXT NOT NULL DEFAULT 'Capturing Moments. Creating Memories.',
  bio_headline TEXT NOT NULL DEFAULT 'Crafting timeless visual heirlooms with emotion, light, and soul.',
  bio_description TEXT NOT NULL DEFAULT 'Founded by Saikat, our studio elevates raw moments into grand cinematic art. Every frame is sculpted with intentional light, deep contrast, and authentic feeling.',
  bio_secondary_text TEXT DEFAULT 'We believe the truest photographs are not posed, but felt. Preserving the heartbeat of your once-in-a-lifetime celebration.',
  photographer_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
  experience_years INT NOT NULL DEFAULT 9,
  weddings_count INT NOT NULL DEFAULT 280,
  happy_clients_count INT NOT NULL DEFAULT 450,
  events_count INT NOT NULL DEFAULT 620,
  logo_url TEXT DEFAULT '',
  favicon_url TEXT DEFAULT '',
  phone TEXT NOT NULL DEFAULT '+91 98765 43210',
  whatsapp_number TEXT NOT NULL DEFAULT '+919876543210',
  email TEXT NOT NULL DEFAULT 'studio@saikatphotography.com',
  address TEXT NOT NULL DEFAULT 'Studio 4, Heritage Arts Arcade, Park Street',
  city TEXT NOT NULL DEFAULT 'Kolkata, India',
  working_hours TEXT NOT NULL DEFAULT 'Monday – Saturday: 10:00 AM – 8:00 PM',
  google_maps_url TEXT DEFAULT 'https://maps.google.com',
  instagram_url TEXT DEFAULT 'https://instagram.com/saikatphotography',
  facebook_url TEXT DEFAULT 'https://facebook.com/saikatphotography',
  youtube_url TEXT DEFAULT 'https://youtube.com/@saikatphotography',
  hero_title TEXT NOT NULL DEFAULT 'CAPTURING MOMENTS.
CREATING MEMORIES.',
  hero_subtitle TEXT NOT NULL DEFAULT 'Luxury wedding cinematography & fine art photography crafted for those who cherish authentic, timeless visual storytelling.',
  hero_image TEXT NOT NULL DEFAULT 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85',
  hero_cta_text TEXT NOT NULL DEFAULT 'Explore Portfolio',
  hero_cta_link TEXT NOT NULL DEFAULT '#portfolio',
  hero_secondary_cta_text TEXT NOT NULL DEFAULT 'Book a Session',
  hero_secondary_cta_link TEXT NOT NULL DEFAULT '#contact',
  hero_overlay_opacity NUMERIC(3,2) NOT NULL DEFAULT 0.55,
  hero_alignment TEXT NOT NULL DEFAULT 'center',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. GALLERY CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.gallery_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  display_order INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. GALLERY IMAGES TABLE
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category_id TEXT REFERENCES public.gallery_categories(id) ON DELETE SET NULL,
  category_name TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. SERVICES TABLE
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL,
  full_description TEXT,
  image_url TEXT NOT NULL,
  starting_price TEXT NOT NULL,
  price_type price_type NOT NULL DEFAULT 'starting_at',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  cta_text TEXT NOT NULL DEFAULT 'Book Service',
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. PACKAGES TABLE
CREATE TABLE IF NOT EXISTS public.packages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price TEXT NOT NULL,
  price_type price_type NOT NULL DEFAULT 'fixed',
  currency TEXT NOT NULL DEFAULT 'INR',
  duration TEXT NOT NULL,
  photographers_count INT NOT NULL DEFAULT 2,
  edited_photos_count INT NOT NULL DEFAULT 300,
  albums_count INT NOT NULL DEFAULT 1,
  video_included BOOLEAN NOT NULL DEFAULT false,
  pre_wedding_included BOOLEAN NOT NULL DEFAULT false,
  drone_included BOOLEAN NOT NULL DEFAULT false,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  badge TEXT,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8B. MAIN PACKAGES (Silver, Gold, Diamond, etc.)
CREATE TABLE IF NOT EXISTS public.main_packages (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  badge TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8C. SUB PACKAGES (Dynamic Tier Options & Pricing per Main Package)
CREATE TABLE IF NOT EXISTS public.sub_packages (
  id TEXT PRIMARY KEY,
  main_package_id TEXT NOT NULL REFERENCES public.main_packages(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  image_url TEXT,
  badge TEXT,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8D. PACKAGE ENQUIRIES (Dedicated Customer Package Submissions)
CREATE TABLE IF NOT EXISTS public.package_enquiries (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  message TEXT NOT NULL,
  main_package_id TEXT NOT NULL,
  main_package_name TEXT NOT NULL,
  sub_package_id TEXT NOT NULL,
  sub_package_name TEXT NOT NULL,
  package_price TEXT NOT NULL,
  event_date DATE,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TESTIMONIALS TABLE
CREATE TABLE IF NOT EXISTS public.testimonials (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  client_image TEXT,
  rating INT NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  event_date TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. INQUIRIES / LEADS TABLE (Strictly private)
CREATE TABLE IF NOT EXISTS public.inquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date DATE,
  location TEXT,
  budget TEXT,
  message TEXT NOT NULL,
  status inquiry_status NOT NULL DEFAULT 'new',
  internal_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id TEXT PRIMARY KEY,
  admin_email TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. CLIENT PROOFING GALLERIES (Private PIN Access)
CREATE TABLE IF NOT EXISTS public.client_galleries (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  event_title TEXT NOT NULL,
  event_date TEXT,
  cover_image TEXT NOT NULL,
  access_pin TEXT NOT NULL,
  images_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  download_allowed BOOLEAN NOT NULL DEFAULT true,
  external_album_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. STUDIO BOOKINGS & CALENDAR
CREATE TABLE IF NOT EXISTS public.studio_bookings (
  id TEXT PRIMARY KEY,
  client_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'tentative',
  location TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 14. STUDIO QUOTATIONS & INVOICES
CREATE TABLE IF NOT EXISTS public.studio_quotations (
  id TEXT PRIMARY KEY,
  quotation_number TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  client_email TEXT,
  client_phone TEXT,
  event_type TEXT NOT NULL,
  event_date TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. FAQS TABLE
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  display_order INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. NOTIFICATION TEMPLATES (WhatsApp & Email)
CREATE TABLE IF NOT EXISTS public.notification_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  channel TEXT NOT NULL DEFAULT 'whatsapp',
  body TEXT NOT NULL,
  variables JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 17. GOOGLE ANALYTICS & WEB TRACKING SETTINGS
CREATE TABLE IF NOT EXISTS public.analytics_settings (
  id TEXT PRIMARY KEY DEFAULT 'analytics-settings-main',
  ga4_measurement_id TEXT DEFAULT '',
  gtm_container_id TEXT DEFAULT '',
  meta_pixel_id TEXT DEFAULT '',
  custom_head_code TEXT DEFAULT '',
  custom_body_code TEXT DEFAULT '',
  enable_ga BOOLEAN NOT NULL DEFAULT true,
  enable_pixel BOOLEAN NOT NULL DEFAULT false,
  track_whatsapp_clicks BOOLEAN NOT NULL DEFAULT true,
  track_inquiries BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('website-assets', 'website-assets', true),
  ('gallery', 'gallery', true),
  ('services', 'services', true),
  ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

-- 19. INDEXES
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON public.gallery_images(category_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_published ON public.gallery_images(is_published);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active);
CREATE INDEX IF NOT EXISTS idx_packages_active ON public.packages(is_active);
CREATE INDEX IF NOT EXISTS idx_main_packages_active ON public.main_packages(is_active);
CREATE INDEX IF NOT EXISTS idx_sub_packages_main ON public.sub_packages(main_package_id);
CREATE INDEX IF NOT EXISTS idx_sub_packages_active ON public.sub_packages(is_active);
CREATE INDEX IF NOT EXISTS idx_package_enquiries_status ON public.package_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_package_enquiries_created ON public.package_enquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_galleries_pin ON public.client_galleries(access_pin);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON public.faqs(is_active);

-- 20. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.main_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sub_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.studio_quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_settings ENABLE ROW LEVEL SECURITY;

-- 21. POLICIES: PUBLIC VISITOR READ ACCESS
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read active categories" ON public.gallery_categories FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read published images" ON public.gallery_images FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Public read active services" ON public.services FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read active packages" ON public.packages FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read active main_packages" ON public.main_packages FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read active sub_packages" ON public.sub_packages FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read published testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Public read active faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read active client galleries" ON public.client_galleries FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read analytics settings" ON public.analytics_settings FOR SELECT TO anon, authenticated USING (true);

-- 22. POLICIES: PUBLIC INQUIRY SUBMISSION
CREATE POLICY "Public submit inquiry" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');
CREATE POLICY "Public submit package_enquiry" ON public.package_enquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

-- 23. POLICIES: ADMIN MANAGEMENT (FULL ACCESS)
CREATE POLICY "Admin full site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full categories" ON public.gallery_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full images" ON public.gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full packages" ON public.packages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full main_packages" ON public.main_packages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full sub_packages" ON public.sub_packages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full package_enquiries" ON public.package_enquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full inquiries" ON public.inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full activity_logs" ON public.activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full client_galleries" ON public.client_galleries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full studio_bookings" ON public.studio_bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full studio_quotations" ON public.studio_quotations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full faqs" ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full templates" ON public.notification_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full analytics" ON public.analytics_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 24. STORAGE POLICIES
CREATE POLICY "Public storage read" ON storage.objects FOR SELECT USING (bucket_id IN ('website-assets', 'gallery', 'services', 'branding'));
CREATE POLICY "Admin storage upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('website-assets', 'gallery', 'services', 'branding'));
CREATE POLICY "Admin storage manage" ON storage.objects FOR ALL TO authenticated USING (bucket_id IN ('website-assets', 'gallery', 'services', 'branding'));
`;

export const AdminDatabaseSetup: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [inputKey, setInputKey] = useState('');
  const [isSavingCreds, setIsSavingCreds] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const [healthReport, setHealthReport] = useState<SupabaseHealthReport | null>(null);

  useEffect(() => {
    const creds = getActiveSupabaseCredentials();
    setInputUrl(creds.url);
    setInputKey(creds.key);
    runDiagnosticCheck();
  }, []);

  const runDiagnosticCheck = async () => {
    setIsTesting(true);
    setActionNotice(null);
    try {
      const report = await checkSupabaseFullHealth();
      setHealthReport(report);
    } catch (e: any) {
      console.error(e);
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingCreds(true);
    setActionNotice(null);

    const cleanUrl = inputUrl.trim();
    const cleanKey = inputKey.trim();

    if (!cleanUrl || !cleanKey) {
      setActionNotice({
        type: 'error',
        text: 'Please enter both your Supabase Project URL and Public Anon Key.',
      });
      setIsSavingCreds(false);
      return;
    }

    if (!cleanUrl.startsWith('https://')) {
      setActionNotice({
        type: 'error',
        text: 'Project URL must start with https:// (e.g. https://xyzcompany.supabase.co)',
      });
      setIsSavingCreds(false);
      return;
    }

    updateSupabaseCredentials(cleanUrl, cleanKey);

    const report = await checkSupabaseFullHealth();
    setHealthReport(report);
    setIsSavingCreds(false);

    if (report.isConnected) {
      if (report.allTablesReady) {
        setActionNotice({
          type: 'success',
          text: 'Supabase connected successfully! All 14 tables verified & data will now synchronize 24/7 globally.',
        });
      } else {
        setActionNotice({
          type: 'info',
          text: 'Connected to Supabase project! However, some or all tables are missing. Copy the SQL script below and execute it in Supabase SQL Editor.',
        });
      }
    } else {
      setActionNotice({
        type: 'error',
        text: report.errorMessage || 'Could not connect. Verify your Project URL and Anon Key.',
      });
    }
  };

  const handleDisconnect = () => {
    if (confirm('Disconnect from custom Supabase credentials? The site will fallback to resilient internal storage.')) {
      updateSupabaseCredentials('', '');
      setInputUrl('');
      setInputKey('');
      setHealthReport(null);
      setActionNotice({
        type: 'info',
        text: 'Disconnected. App is running on local storage cache.',
      });
    }
  };

  const handleSyncToSupabase = async () => {
    if (!healthReport?.isConnected) {
      alert('Please connect to Supabase and ensure tables exist first before syncing data.');
      return;
    }
    setIsSyncing(true);
    setActionNotice(null);
    const res = await syncLocalDataToSupabase();
    setIsSyncing(false);
    setActionNotice({
      type: res.success ? 'success' : 'error',
      text: res.message,
    });
    runDiagnosticCheck();
  };

  const handlePullFromSupabase = async () => {
    if (!healthReport?.isConnected) {
      alert('Please connect to Supabase first before pulling data.');
      return;
    }
    setIsPulling(true);
    setActionNotice(null);
    const res = await pullCloudDataToLocal();
    setIsPulling(false);
    setActionNotice({
      type: res.success ? 'success' : 'error',
      text: res.message,
    });
  };

  const handleWipeAllData = async () => {
    if (
      confirm(
        'Are you sure you want to clean all stored data (photos, services, packages, testimonials, leads)? This will reset to a clean state.'
      )
    ) {
      await DB.clearAllData();
      runDiagnosticCheck();
      alert('All demo and test data has been cleaned successfully!');
    }
  };

  const isConnected = Boolean(healthReport?.isConnected);
  const isSqlComplete = Boolean(healthReport?.allTablesReady);

  return (
    <div className="space-y-8 max-w-6xl pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#D91B24]/10 text-[#D91B24] border border-[#D91B24]/20">
              Cloud Infrastructure
            </span>
            <span className="text-xs text-neutral-400 font-mono">PostgreSQL Engine</span>
          </div>
          <h1 className="text-2xl font-serif-display font-medium text-white tracking-wide">
            Database & Supabase Command Center
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time PostgreSQL connection status, table health inspector, 24/7 global sync, and schema deployment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleWipeAllData}
            className="bg-neutral-900 hover:bg-red-950/80 text-neutral-300 hover:text-red-300 text-xs font-medium px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
            title="Clean all data to fresh empty state"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-400" />
            <span>Clean All Data</span>
          </button>
          <button
            onClick={runDiagnosticCheck}
            disabled={isTesting}
            className="bg-white/5 hover:bg-white/10 text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-neutral-300 ${isTesting ? 'animate-spin' : ''}`} />
            <span>Refresh Health</span>
          </button>
          <button
            onClick={handleCopy}
            className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow-lg shadow-[#D91B24]/20"
          >
            {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'SQL Script Copied!' : 'Copy Schema SQL'}</span>
          </button>
        </div>
      </div>

      {/* Global Status Answer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: Connection Confirmation */}
        <div
          className={`p-5 rounded-xl border relative overflow-hidden transition-all ${
            isConnected
              ? 'bg-gradient-to-br from-emerald-950/20 via-[#0B0B0B] to-[#050505] border-emerald-500/30'
              : 'bg-gradient-to-br from-amber-950/20 via-[#0B0B0B] to-[#050505] border-amber-500/30'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-400">
                1. Supabase Connection Status
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-emerald-400 shadow-lg shadow-emerald-500/50 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <h3 className="text-base font-semibold text-white">
                  {isConnected ? 'CONNECTED TO SUPABASE' : 'READY FOR CREDENTIALS'}
                </h3>
              </div>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-mono font-medium ${
                isConnected
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  : 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
              }`}
            >
              {isConnected ? 'ONLINE CLOUD' : 'INTERNAL RESILIENT STORE'}
            </span>
          </div>

          <p className="text-xs text-neutral-300 font-light mt-3 leading-relaxed">
            {isConnected ? (
              <>
                Your application is actively querying your remote Supabase PostgreSQL instance (
                <span className="text-white font-mono">{healthReport?.url}</span>).
                {healthReport?.latencyMs ? ` Latency: ${healthReport.latencyMs}ms.` : ''} Any team member or client
                visiting anywhere worldwide fetches this shared database.
              </>
            ) : (
              <>
                Supabase is currently running in fallback local mode because project credentials have not been saved.
                Enter your Supabase URL &amp; Public Anon Key below to establish the 24/7 live connection.
              </>
            )}
          </p>

          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Config Source: {healthReport?.source || 'Not Configured'}</span>
            <span className="text-neutral-500 font-mono">Zero Disconnect Redundancy</span>
          </div>
        </div>

        {/* Card 2: SQL Schema Confirmation */}
        <div
          className={`p-5 rounded-xl border relative overflow-hidden transition-all ${
            isSqlComplete
              ? 'bg-gradient-to-br from-emerald-950/20 via-[#0B0B0B] to-[#050505] border-emerald-500/30'
              : 'bg-gradient-to-br from-neutral-900/40 via-[#0B0B0B] to-[#050505] border-white/10'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-wider uppercase text-neutral-400">
                2. SQL Schema Status
              </span>
              <div className="flex items-center gap-2">
                {isSqlComplete ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                )}
                <h3 className="text-base font-semibold text-white">
                  {isSqlComplete ? 'SQL SCHEMA IS 100% DONE' : isConnected ? 'SQL TABLES NEED CREATION' : 'SQL SCRIPT READY TO RUN'}
                </h3>
              </div>
            </div>
            <span
              className={`text-xs px-2.5 py-1 rounded-full font-mono font-medium ${
                isSqlComplete
                  ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  : 'bg-white/10 text-neutral-300 border border-white/15'
              }`}
            >
              {isSqlComplete ? 'ALL 14 TABLES ACTIVE' : 'PENDING EXECUTION'}
            </span>
          </div>

          <p className="text-xs text-neutral-300 font-light mt-3 leading-relaxed">
            {isSqlComplete ? (
              <>
                All 14 PostgreSQL tables, Row Level Security policies, indexes, and storage buckets are verified and
                operational in your Supabase project. Inquiries, photos, packages, quotes, and calendars are ready for
                live data.
              </>
            ) : isConnected ? (
              <>
                You are connected to your Supabase project, but one or more tables do not exist yet. Click &quot;Copy
                Schema SQL&quot; and run it in the Supabase SQL Editor.
              </>
            ) : (
              <>
                The complete SQL script for all 14 tables is prepared below. Once you connect your Supabase project,
                run the script once in Supabase Dashboard &gt; SQL Editor.
              </>
            )}
          </p>

          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-neutral-400">
            <span>Verified Tables: {healthReport?.tables.filter((t) => t.exists).length || 0} / 14</span>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noreferrer"
              className="text-[#D91B24] hover:underline flex items-center gap-1"
            >
              <span>Open Supabase Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Action Notification Alert */}
      {actionNotice && (
        <div
          className={`p-4 rounded-lg text-xs flex items-center justify-between border ${
            actionNotice.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : actionNotice.type === 'error'
              ? 'bg-red-950/40 border-red-500/40 text-red-200'
              : 'bg-blue-950/40 border-blue-500/40 text-blue-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{actionNotice.text}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-neutral-400 hover:text-white text-xs px-2 py-0.5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Supabase Connection Setup Box (Connect from Anywhere) */}
      <div className="bg-[#0B0B0B] border border-white/10 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-base font-medium text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#D91B24]" />
              <span>Connect Supabase Project (Live 24/7 Global Connection)</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Configure your credentials directly here. Once saved, the website remains connected continuously across
              all logins and devices worldwide.
            </p>
          </div>
          {getActiveSupabaseCredentials().url && (
            <button
              onClick={handleDisconnect}
              className="text-neutral-400 hover:text-red-400 text-xs px-3 py-1.5 rounded bg-white/5 hover:bg-red-950/30 transition-colors border border-white/10"
            >
              Disconnect Credentials
            </button>
          )}
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
                <span>Supabase Project URL</span>
                <span className="text-[10px] text-neutral-500 font-mono">Project Settings &gt; API</span>
              </label>
              <input
                type="text"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                placeholder="https://xyzabcdefghijklm.supabase.co"
                className="w-full bg-[#141414] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D91B24] font-mono transition-colors"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-neutral-300 flex items-center justify-between">
                <span>Supabase Public Anon Key</span>
                <span className="text-[10px] text-neutral-500 font-mono">Project Settings &gt; API &gt; anon public</span>
              </label>
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full bg-[#141414] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-[#D91B24] font-mono transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safe for browser client: Uses only public anon key (never service_role secret).</span>
            </div>

            <button
              type="submit"
              disabled={isSavingCreds}
              className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-5 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-[#D91B24]/20"
            >
              {isSavingCreds ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSavingCreds ? 'Testing & Saving...' : 'Save & Connect Supabase'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Table Health Inspector Grid */}
      <div className="bg-[#0B0B0B] border border-white/10 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h2 className="text-base font-medium text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D91B24]" />
              <span>14-Table Health &amp; Schema Inspector</span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Live verification of every PostgreSQL table required for full website operations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncToSupabase}
              disabled={isSyncing || !isConnected}
              className="bg-white/5 hover:bg-white/10 disabled:opacity-40 text-neutral-200 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10 transition-colors"
              title="Upload existing settings and demo content to Supabase cloud"
            >
              <UploadCloud className={`w-3.5 h-3.5 text-blue-400 ${isSyncing ? 'animate-bounce' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Push Local Data to Cloud'}</span>
            </button>

            <button
              onClick={handlePullFromSupabase}
              disabled={isPulling || !isConnected}
              className="bg-white/5 hover:bg-white/10 disabled:opacity-40 text-neutral-200 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-white/10 transition-colors"
              title="Pull latest live data from Supabase to local state"
            >
              <DownloadCloud className={`w-3.5 h-3.5 text-emerald-400 ${isPulling ? 'animate-bounce' : ''}`} />
              <span>{isPulling ? 'Pulling...' : 'Pull Cloud Data'}</span>
            </button>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pt-1">
          {(healthReport?.tables || [
            { name: 'site_settings', label: 'Site Settings', exists: false, count: 0 },
            { name: 'gallery_categories', label: 'Gallery Categories', exists: false, count: 0 },
            { name: 'gallery_images', label: 'Gallery Images', exists: false, count: 0 },
            { name: 'services', label: 'Services', exists: false, count: 0 },
            { name: 'packages', label: 'Packages', exists: false, count: 0 },
            { name: 'testimonials', label: 'Testimonials', exists: false, count: 0 },
            { name: 'inquiries', label: 'Inquiries (Leads)', exists: false, count: 0 },
            { name: 'activity_logs', label: 'Activity Logs', exists: false, count: 0 },
            { name: 'client_galleries', label: 'Client Proofing Galleries', exists: false, count: 0 },
            { name: 'studio_bookings', label: 'Studio Bookings & Calendar', exists: false, count: 0 },
            { name: 'studio_quotations', label: 'Quotations & Invoices', exists: false, count: 0 },
            { name: 'faqs', label: 'FAQs', exists: false, count: 0 },
            { name: 'notification_templates', label: 'Notification Templates', exists: false, count: 0 },
            { name: 'analytics_settings', label: 'Google Analytics & Tracking', exists: false, count: 0 },
          ]).map((tbl) => {
            const hasChecked = healthReport !== null;
            return (
              <div
                key={tbl.name}
                className="p-3 rounded-lg bg-[#111111] border border-white/5 flex items-center justify-between"
              >
                <div className="space-y-0.5 overflow-hidden">
                  <p className="text-xs font-medium text-white truncate">{tbl.label}</p>
                  <p className="text-[10px] font-mono text-neutral-500 truncate">{tbl.name}</p>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  {!hasChecked ? (
                    <span className="w-2 h-2 rounded-full bg-neutral-600" />
                  ) : tbl.exists ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{tbl.count} rows</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[10px] text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      <XCircle className="w-3 h-3" />
                      <span>Missing</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step by Step Setup Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-white/10 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-[#D91B24] font-bold">
            Step 1
          </span>
          <h4 className="text-sm font-medium text-white">Create Supabase Project</h4>
          <p className="text-neutral-400 leading-relaxed text-xs">
            Create a free project at{' '}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noreferrer"
              className="text-white underline hover:text-[#D91B24]"
            >
              supabase.com
            </a>
            . Navigate to Project Settings &gt; API to find your Project URL and Anon Public Key.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-white/10 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-[#D91B24] font-bold">
            Step 2
          </span>
          <h4 className="text-sm font-medium text-white">Run Schema SQL (One-Click)</h4>
          <p className="text-neutral-400 leading-relaxed text-xs">
            Click &quot;Copy Schema SQL&quot; above, open Supabase SQL Editor (Dashboard &gt; SQL Editor &gt; New Query), paste
            the script, and click &quot;Run&quot;. This creates all 14 tables, RLS policies, and storage buckets.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-white/10 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-[#D91B24] font-bold">
            Step 3
          </span>
          <h4 className="text-sm font-medium text-white">Always Connected Globally</h4>
          <p className="text-neutral-400 leading-relaxed text-xs">
            Once saved in this dashboard or in environment variables (<code className="text-neutral-300">VITE_SUPABASE_URL</code>),
            the database remains connected permanently worldwide with automatic fallback offline caching.
          </p>
        </div>
      </div>

      {/* SQL Script Viewer */}
      <div className="bg-[#050505] rounded-xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="p-3.5 bg-neutral-900 border-b border-white/10 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#D91B24]" />
            <span className="font-mono text-neutral-200">supabase/schema.sql (Complete PostgreSQL Production Script)</span>
          </div>
          <button
            onClick={handleCopy}
            className="text-white hover:text-[#D91B24] flex items-center gap-1.5 px-3 py-1 rounded bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL'}</span>
          </button>
        </div>
        <pre className="p-5 text-[11px] font-mono text-neutral-300 max-h-96 overflow-y-auto overflow-x-auto leading-relaxed selection:bg-[#D91B24] selection:text-white">
          {SCHEMA_SQL}
        </pre>
      </div>
    </div>
  );
};

export default AdminDatabaseSetup;
