-- ==============================================================================
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

-- 18. MEDIA ITEMS LIBRARY
CREATE TABLE IF NOT EXISTS public.media_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  size_bytes BIGINT,
  mime_type TEXT,
  alt_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 19. STORAGE BUCKETS
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('website-assets', 'website-assets', true),
  ('gallery', 'gallery', true),
  ('services', 'services', true),
  ('branding', 'branding', true)
ON CONFLICT (id) DO NOTHING;

-- 20. INDEXES FOR HIGH-SPEED QUERYING
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON public.gallery_images(category_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_published ON public.gallery_images(is_published);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON public.inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_services_active ON public.services(is_active);
CREATE INDEX IF NOT EXISTS idx_packages_active ON public.packages(is_active);
CREATE INDEX IF NOT EXISTS idx_client_galleries_pin ON public.client_galleries(access_pin);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON public.faqs(is_active);

-- 21. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
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
ALTER TABLE public.media_items ENABLE ROW LEVEL SECURITY;

-- 22. POLICIES: PUBLIC VISITOR READ ACCESS
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public read active categories" ON public.gallery_categories FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read published images" ON public.gallery_images FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Public read active services" ON public.services FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read active packages" ON public.packages FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read published testimonials" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_published = true);
CREATE POLICY "Public read active faqs" ON public.faqs FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read active client galleries" ON public.client_galleries FOR SELECT TO anon, authenticated USING (is_active = true);
CREATE POLICY "Public read analytics settings" ON public.analytics_settings FOR SELECT TO anon, authenticated USING (true);

-- 23. POLICIES: PUBLIC INQUIRY SUBMISSION
CREATE POLICY "Public submit inquiry" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (status = 'new');

-- 24. POLICIES: ADMIN MANAGEMENT (FULL ACCESS)
CREATE POLICY "Admin full site_settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full categories" ON public.gallery_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full images" ON public.gallery_images FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full services" ON public.services FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full packages" ON public.packages FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full testimonials" ON public.testimonials FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full inquiries" ON public.inquiries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full activity_logs" ON public.activity_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full client_galleries" ON public.client_galleries FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full studio_bookings" ON public.studio_bookings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full studio_quotations" ON public.studio_quotations FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full faqs" ON public.faqs FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full templates" ON public.notification_templates FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full analytics" ON public.analytics_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin full media" ON public.media_items FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 25. STORAGE POLICIES
CREATE POLICY "Public storage read" ON storage.objects FOR SELECT USING (bucket_id IN ('website-assets', 'gallery', 'services', 'branding'));
CREATE POLICY "Admin storage upload" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id IN ('website-assets', 'gallery', 'services', 'branding'));
CREATE POLICY "Admin storage manage" ON storage.objects FOR ALL TO authenticated USING (bucket_id IN ('website-assets', 'gallery', 'services', 'branding'));
