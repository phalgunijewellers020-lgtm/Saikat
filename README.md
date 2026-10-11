# SAIKAT PHOTOGRAPHY & STUDIO CMS

A luxury, cinematic photography brand website and complete bespoke Admin CMS panel built for **Saikat Photography**.

---

## 1. Project Architecture

The application comprises two strictly separated interfaces powered by the same PostgreSQL / Supabase backend:

1. **Public Photography Website (`/`)**
   - High-contrast, dark cinematic luxury aesthetic (#050505, brand crimson accent, crisp typography)
   - Official Saikat Photography brand logo
   - Dynamic Hero with customizable overlay, title, subtitle, and CTAs
   - Photographer About & philosophy narrative with live experience counters
   - Dynamic Portfolio Gallery with category filters and fullscreen Lightbox viewer
   - Services breakdown with starting rates and deliverable lists
   - Curated Packages & Pricing with popular badges, inclusion checklists, and direct booking pre-selection
   - Heartfelt Client Testimonials with star ratings and portraits
   - Secure Booking Inquiry form validating inputs and saving leads directly to database
   - Contact actions: direct call, WhatsApp chat with pre-filled message, email, and studio location
   - Zero links to `/admin` in header, footer, or public navigation

2. **Private Admin CMS Panel (`/admin`)**
   - Completely separate administration panel accessed only by visiting `/admin` (or `#admin`)
   - Protected by authentication and Role-Based Access Control (Super Admin, Admin, Editor)
   - Real-time Dashboard with inquiry KPIs, photo stats, and quick actions
   - Portfolio & Category Manager: Add, edit, reorder, delete, and toggle draft/published status
   - Services & Packages CMS: Full CRUD for packages, deliverables, pricing, and active status
   - Inquiries Pipeline: Filter by status (New, Contacted, Follow-up, Booked, Closed), search, review messages, save internal private notes, and trigger direct WhatsApp/call responses
   - Media Library: Upload and manage photography assets with Supabase Storage integration
   - Site & Brand Settings: Change hero banners, photographer bio, contact phone/WhatsApp/email, social media links, and SEO tags
   - Homepage Section Builder: Reorder sections up/down and toggle visibility
   - Theme Customizer: Fine-tune brand accent red, canvas shade, typography, and element radius
   - Security Audit Log: Immutable tracking of all CMS actions

---

## 2. Admin Portal Credentials

- **Admin URL:** `https://your-domain.com/admin` (or append `#admin` in preview mode)
- **Default Master Admin Email:** `admin@saikatphotography.com`
- **Default Master Admin Password:** `admin1234`
*(One-click demo login helper is also available on the `/admin` login screen for instant verification)*

---

## 3. Supabase Database & Storage Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** > **New Query**.
3. Open `supabase/schema.sql` (or click **Copy Schema SQL** under Admin > Database & SQL).
4. Paste and execute the SQL query. This provisions:
   - Tables: `profiles`, `site_settings`, `gallery_categories`, `gallery_images`, `services`, `packages`, `testimonials`, `inquiries`, `activity_logs`
   - Storage Buckets: `website-assets`, `gallery`, `services`, `branding`
   - Row Level Security (RLS) rules: Public read for published content; public insert for new inquiries; authenticated admin access for management.

---

## 4. Environment Variables

Create `.env` based on `.env.example`:

```bash
VITE_SUPABASE_URL="https://your-project-id.supabase.co"
VITE_SUPABASE_ANON_KEY="your-supabase-anon-key"
```

*Note: The application includes a resilient local database engine with complete reactivity, so you can preview, edit, upload, and test every single feature even prior to configuring live Supabase keys.*

---

## 5. Deployment (GitHub + Vercel)

1. Push this repository to GitHub.
2. In [Vercel](https://vercel.com), click **Add New Project** and import the repository.
3. Add the environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**.
