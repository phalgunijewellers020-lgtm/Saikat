import { createClient } from '@supabase/supabase-js';
import {
  SiteSettings,
  GalleryCategory,
  GalleryImage,
  Service,
  Package,
  MainPackage,
  SubPackage,
  PackageEnquiry,
  PackageEnquiryStatus,
  Testimonial,
  Inquiry,
  HomepageSection,
  ThemeSettings,
  SeoSettings,
  AdminUser,
  ActivityLog,
  MediaItem,
  GoogleAnalyticsSettings,
  ClientGallery,
  StudioBooking,
  FaqItem,
  StudioQuotation,
  QuotationItem,
  NotificationTemplate,
} from '../types/database';

// ==========================================
// DYNAMIC SUPABASE CLIENT & CREDENTIAL ENGINE
// (Connects from Environment Variables or UI Dashboard)
// ==========================================

export function getActiveSupabaseCredentials(): {
  url: string;
  key: string;
  source: 'UI (Dashboard Config)' | 'Environment Variable (.env)' | 'None';
} {
  const localUrl = (typeof window !== 'undefined' ? localStorage.getItem('saikat_supabase_url') || '' : '').trim();
  const localKey = (typeof window !== 'undefined' ? localStorage.getItem('saikat_supabase_anon_key') || '' : '').trim();

  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  const isEnvValid =
    Boolean(envUrl) &&
    Boolean(envKey) &&
    envUrl !== 'https://your-project-id.supabase.co' &&
    !envUrl.includes('your-project-id');

  if (localUrl && localKey) {
    return { url: localUrl, key: localKey, source: 'UI (Dashboard Config)' };
  }
  if (isEnvValid) {
    return { url: envUrl, key: envKey, source: 'Environment Variable (.env)' };
  }
  return { url: '', key: '', source: 'None' };
}

export function isSupabaseActive(): boolean {
  const { url, key } = getActiveSupabaseCredentials();
  return Boolean(url && key && url.startsWith('http'));
}

export let isSupabaseConfigured = isSupabaseActive();

function instantiateClient() {
  const { url, key } = getActiveSupabaseCredentials();
  if (url && key && url.startsWith('http')) {
    return createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return createClient(
    'https://placeholder-saikat.supabase.co',
    'placeholder-anon-key',
    { auth: { persistSession: true, autoRefreshToken: true } }
  );
}

let _supabaseClientInstance = instantiateClient();

export function updateSupabaseCredentials(url: string, key: string) {
  if (typeof window !== 'undefined') {
    if (url && key) {
      localStorage.setItem('saikat_supabase_url', url.trim());
      localStorage.setItem('saikat_supabase_anon_key', key.trim());
    } else {
      localStorage.removeItem('saikat_supabase_url');
      localStorage.removeItem('saikat_supabase_anon_key');
    }
  }
  isSupabaseConfigured = isSupabaseActive();
  _supabaseClientInstance = instantiateClient();
  notifyDataChanged();
}

// Proxy wrapper so any direct usage of `supabase` automatically routes to current active instance
export const supabase: any = new Proxy({} as any, {
  get(_target, prop) {
    return (_supabaseClientInstance as any)[prop];
  },
});

export interface TableCheckResult {
  name: string;
  label: string;
  exists: boolean;
  count: number;
  error?: string;
}

export interface SupabaseHealthReport {
  isConnected: boolean;
  url: string;
  source: 'UI (Dashboard Config)' | 'Environment Variable (.env)' | 'None';
  latencyMs: number;
  tables: TableCheckResult[];
  allTablesReady: boolean;
  errorMessage?: string;
}

export async function checkSupabaseFullHealth(): Promise<SupabaseHealthReport> {
  const creds = getActiveSupabaseCredentials();
  if (!creds.url || !creds.key) {
    return {
      isConnected: false,
      url: '',
      source: 'None',
      latencyMs: 0,
      tables: [],
      allTablesReady: false,
      errorMessage: 'Supabase URL and API Key are not configured yet.',
    };
  }

  const tableList = [
    { name: 'site_settings', label: 'Site Settings' },
    { name: 'gallery_categories', label: 'Gallery Categories' },
    { name: 'gallery_images', label: 'Gallery Images' },
    { name: 'services', label: 'Services' },
    { name: 'packages', label: 'Packages (Legacy)' },
    { name: 'main_packages', label: 'Main Package Categories (Silver, Gold, Diamond)' },
    { name: 'sub_packages', label: 'Sub-Packages (Tier Details & Pricing)' },
    { name: 'package_enquiries', label: 'Package Enquiries (Customer Leads)' },
    { name: 'testimonials', label: 'Testimonials' },
    { name: 'inquiries', label: 'Inquiries (Leads)' },
    { name: 'activity_logs', label: 'Activity Logs' },
    { name: 'client_galleries', label: 'Client Proofing Galleries' },
    { name: 'studio_bookings', label: 'Studio Bookings & Calendar' },
    { name: 'studio_quotations', label: 'Quotations & Invoices' },
    { name: 'faqs', label: 'FAQs' },
    { name: 'notification_templates', label: 'Notification Templates' },
    { name: 'analytics_settings', label: 'Google Analytics & Tracking' },
  ];

  const startTime = Date.now();
  const tablesReport: TableCheckResult[] = [];
  let isConnected = false;

  for (const t of tableList) {
    try {
      const { data, error, count } = await (_supabaseClientInstance as any)
        .from(t.name)
        .select('*', { count: 'exact', head: true });

      if (error) {
        tablesReport.push({
          name: t.name,
          label: t.label,
          exists: false,
          count: 0,
          error: error.message,
        });
      } else {
        isConnected = true;
        tablesReport.push({
          name: t.name,
          label: t.label,
          exists: true,
          count: count ?? (Array.isArray(data) ? data.length : 0),
        });
      }
    } catch (err: any) {
      tablesReport.push({
        name: t.name,
        label: t.label,
        exists: false,
        count: 0,
        error: err.message,
      });
    }
  }

  const latencyMs = Date.now() - startTime;
  const allTablesReady = tablesReport.length > 0 && tablesReport.every((t) => t.exists);

  return {
    isConnected,
    url: creds.url,
    source: creds.source,
    latencyMs,
    tables: tablesReport,
    allTablesReady,
    errorMessage: isConnected
      ? undefined
      : 'Could not connect to Supabase. Please verify your Project URL and Anon Key.',
  };
}

// ==========================================
// DEFAULT SEED DATA (Curated for Saikat Photography)
// ==========================================

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  id: 'site-settings-main',
  site_title: 'Saikat Photography | Cinematic Luxury Weddings & Portraits',
  photographer_name: 'Saikat',
  tagline: 'Capturing Moments. Creating Memories.',
  bio_headline: 'Crafting timeless visual heirlooms with emotion, light, and soul.',
  bio_description:
    'Founded by Saikat, our studio elevates raw moments into grand cinematic art. Every frame is sculpted with intentional light, deep contrast, and authentic feeling.',
  bio_secondary_text:
    'We believe the truest photographs are not posed, but felt. Preserving the heartbeat of your once-in-a-lifetime celebration.',
  photographer_image:
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
  experience_years: 0,
  weddings_count: 0,
  happy_clients_count: 0,
  events_count: 0,
  logo_url: '',
  favicon_url: '',
  phone: '+91 98765 43210',
  whatsapp_number: '+919876543210',
  email: 'studio@saikatphotography.com',
  address: 'Studio 4, Heritage Arts Arcade, Park Street',
  city: 'Kolkata, India',
  working_hours: 'Monday – Saturday: 10:00 AM – 8:00 PM',
  google_maps_url: 'https://maps.google.com',
  instagram_url: 'https://instagram.com/saikatphotography',
  facebook_url: 'https://facebook.com/saikatphotography',
  youtube_url: 'https://youtube.com/@saikatphotography',
  hero_title: 'CAPTURING MOMENTS.\nCREATING MEMORIES.',
  hero_subtitle:
    'Luxury wedding cinematography & fine art photography crafted for those who cherish authentic, timeless visual storytelling.',
  hero_image:
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85',
  hero_cta_text: 'Explore Portfolio',
  hero_cta_link: '#portfolio',
  hero_secondary_cta_text: 'Book a Session',
  hero_secondary_cta_link: '#contact',
  hero_overlay_opacity: 0.55,
  hero_alignment: 'center',
};

export const DEFAULT_CATEGORIES: GalleryCategory[] = [
  { id: 'cat-weddings', name: 'Weddings', slug: 'weddings', display_order: 1, is_active: true },
  { id: 'cat-pre-weddings', name: 'Pre-Weddings', slug: 'pre-weddings', display_order: 2, is_active: true },
  { id: 'cat-portraits', name: 'Portraits & Fashion', slug: 'portraits', display_order: 3, is_active: true },
  { id: 'cat-events', name: 'Events & Rituals', slug: 'events', display_order: 4, is_active: true },
  { id: 'cat-maternity', name: 'Baby & Maternity', slug: 'maternity', display_order: 5, is_active: true },
];

export const DEFAULT_GALLERY_IMAGES: GalleryImage[] = [];

export const DEFAULT_SERVICES: Service[] = [];

export const DEFAULT_PACKAGES: Package[] = [];

export const DEFAULT_MAIN_PACKAGES: MainPackage[] = [
  {
    id: 'main-pkg-silver',
    name: 'Silver Package',
    slug: 'silver-package',
    description: 'Essential luxury coverage crafted for intimate ceremonies and couples seeking timeless photographic elegance.',
    badge: 'Essential',
    is_active: true,
    display_order: 1,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'main-pkg-gold',
    name: 'Gold Package',
    slug: 'gold-package',
    description: 'Our signature full-celebration collection with comprehensive dual photography, cinematic film, and luxury photobooks.',
    badge: 'Most Popular',
    is_active: true,
    display_order: 2,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'main-pkg-diamond',
    name: 'Diamond Package',
    slug: 'diamond-package',
    description: 'The ultimate royal VIP heirloom collection. Complete multi-day master cinematography, drone aerials, and bespoke handcrafted albums.',
    badge: 'Signature Royal',
    is_active: true,
    display_order: 3,
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const DEFAULT_SUB_PACKAGES: SubPackage[] = [
  // Silver Sub-packages
  {
    id: 'sub-silver-basic',
    main_package_id: 'main-pkg-silver',
    name: 'Silver Basic',
    price: '₹5,000',
    description: 'Intimate single-session ceremony coverage with dedicated candid photographer and digital delivery.',
    features: [
      '1 Professional Candid Photographer',
      '100+ Master High-Res Retouched Images',
      'Up to 4 Hours Ceremony Coverage',
      'High-Speed Digital Cloud Gallery Download',
      'Personal Print Rights Included',
    ],
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    badge: 'Starter',
    is_popular: false,
    is_active: true,
    display_order: 1,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'sub-silver-standard',
    main_package_id: 'main-pkg-silver',
    name: 'Silver Standard',
    price: '₹10,000',
    description: 'Extended full-ceremony coverage with dual perspective and a keepsake coffee table photobook.',
    features: [
      '1 Master + 1 Traditional Photographer',
      '200+ Master Color-Graded Photos',
      'Up to 8 Hours Comprehensive Coverage',
      '20-Page Hardcover Fine Art Photobook',
      'Online Private Client Proofing Gallery',
      'High-Resolution Delivery within 2 Weeks',
    ],
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
    badge: 'Best Value',
    is_popular: true,
    is_active: true,
    display_order: 2,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'sub-silver-premium',
    main_package_id: 'main-pkg-silver',
    name: 'Silver Premium',
    price: '₹15,000',
    description: 'Full-day premium still photography with handcrafted leather album and 60-second teaser reel.',
    features: [
      '2 Master Photographers All Day',
      '300+ Premium Retouched High-Res Photos',
      'Unlimited Hours Single-Day Coverage',
      '30-Page Flush Mount Italian Leather Album',
      '60-Second Social Media Teaser Reel',
      'Signature Wooden USB Pen Drive Box',
    ],
    image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    badge: 'Premium Tier',
    is_popular: false,
    is_active: true,
    display_order: 3,
    created_at: '2026-01-01T00:00:00Z',
  },

  // Gold Sub-packages
  {
    id: 'sub-gold-basic',
    main_package_id: 'main-pkg-gold',
    name: 'Gold Basic',
    price: '₹20,000',
    description: 'Combined photography and cinematography package with full day multi-camera coverage and highlight film.',
    features: [
      '2 Photographers + 1 Cinematographer',
      '400+ Master Retouched Photos',
      '3–5 Minute 4K Cinematic Highlight Reel',
      'Full Day Coverage (Morning rituals till reception)',
      '30-Page Luxury Silk Fabric Photobook',
      'Drone Aerial Filming (Venue dependent)',
    ],
    image_url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    badge: 'Photo + Video',
    is_popular: false,
    is_active: true,
    display_order: 1,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'sub-gold-standard',
    main_package_id: 'main-pkg-gold',
    name: 'Gold Standard',
    price: '₹30,000',
    description: 'Two-day complete wedding celebration coverage with 4-person crew and 4K aerial drone film.',
    features: [
      '2 Master Photographers + 2 Senior Cinematographers',
      '600+ Retouched High-Res Images',
      '2 Days Coverage (Sangeet/Mehendi + Wedding Day)',
      '4K Drone Aerial Cinematic Visuals',
      '5–7 Minute 4K Cinematic Film + 60s Teaser',
      '2 Hardbound Velvet Albums (Couple + Parents)',
    ],
    image_url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=800&q=80',
    badge: 'Most Popular',
    is_popular: true,
    is_active: true,
    display_order: 2,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'sub-gold-premium',
    main_package_id: 'main-pkg-gold',
    name: 'Gold Premium',
    price: '₹40,000',
    description: 'Complete 5-member elite team with romantic pre-wedding film and heirloom album box set.',
    features: [
      '5-Person Elite Studio Team (Photo + Cinema + Drone)',
      'Complimentary Pre-Wedding Shoot Included (Half Day)',
      '800+ Retouched Images + All Raw Captures on Drive',
      '7–10 Minute Cinematic Documentary Film',
      '2 Royal Heirloom Albums + 2 Miniature Parent Albums',
      'Express Sneak-Peek in 48 Hours',
    ],
    image_url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80',
    badge: 'Deluxe Choice',
    is_popular: false,
    is_active: true,
    display_order: 3,
    created_at: '2026-01-01T00:00:00Z',
  },

  // Diamond Sub-packages
  {
    id: 'sub-diamond-basic',
    main_package_id: 'main-pkg-diamond',
    name: 'Diamond Basic',
    price: '₹50,000',
    description: 'Multi-day palace grand celebration with 6-person master crew, drone pilots, and same-day edit reel.',
    features: [
      'Multi-Day Coverage (Haldi, Mehendi, Sangeet, Wedding, Reception)',
      '6 Master Artists (3 Candid Photographers + 3 Cinematographers)',
      'Licensed 4K Drone Aerial Cinematography',
      'Same-Day Edit (SDE) Teaser for Reception Screen',
      '50-Page Handcrafted Italian Heritage Leather Album',
      'High-Speed Cloud Archive Access For 10 Years',
    ],
    image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    badge: 'Grand Wedding',
    is_popular: false,
    is_active: true,
    display_order: 1,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'sub-diamond-standard',
    main_package_id: 'main-pkg-diamond',
    name: 'Diamond Standard',
    price: '₹75,000',
    description: 'Destination wedding elite coverage across India or abroad with full film documentary and parent keepsake suite.',
    features: [
      '8-Person Production Crew with Cinema Lenses & Dual Drones',
      'Full Destination Wedding Coverage (Up to 3 Days)',
      'Full Pre-Wedding Cinematic Concept Video Included',
      '15–20 Minute Grand Documentary Feature Film',
      '2 Master Acrylic-Cover Albums + 4 Pocket Parent Books',
      'Complete Raw 4K Footage on Encrypted Rugged SSD',
    ],
    image_url: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=800&q=80',
    badge: 'Destination Special',
    is_popular: true,
    is_active: true,
    display_order: 2,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'sub-diamond-premium',
    main_package_id: 'main-pkg-diamond',
    name: 'Diamond Premium',
    price: '₹1,00,000',
    description: 'The pinnacle of luxury wedding storytelling. Saikat personally directs and shoots your royal celebration without limits.',
    features: [
      'Saikat Personally Directs All Creative Photography & Cinema',
      'Unlimited Shooting Days & Multi-City Destination Coverage',
      '10-Person World-Class Production Unit with Cinema Rigging',
      '30-Minute Cinematic Feature Film + 60s Instagram Teasers',
      'Luxury Bespoke Velvet Presentation Trunk with 3 Handcrafted Albums',
      'Next-Day Express Preview of 50 Color-Graded Master Frames',
      'Lifetime VIP Concierge & Archive Guarantee',
    ],
    image_url: 'https://images.unsplash.com/photo-1583939411023-14783179e581?auto=format&fit=crop&w=800&q=80',
    badge: 'Royal VIP Signature',
    is_popular: false,
    is_active: true,
    display_order: 3,
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const DEFAULT_PACKAGE_ENQUIRIES: PackageEnquiry[] = [];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [];

export const DEFAULT_HOMEPAGE_SECTIONS: HomepageSection[] = [
  { id: 'sec-hero', section_key: 'hero', title: 'Hero Banner', is_enabled: true, display_order: 1 },
  { id: 'sec-about', section_key: 'about', title: 'About Saikat & Philosophy', subtitle: 'The Artist Behind The Lens', is_enabled: true, display_order: 2 },
  { id: 'sec-gallery', section_key: 'gallery', title: 'Featured Portfolio', subtitle: 'Curated Visual Heirlooms', is_enabled: true, display_order: 3 },
  { id: 'sec-services', section_key: 'services', title: 'Our Services', subtitle: 'Bespoke Photography Disciplines', is_enabled: true, display_order: 4 },
  { id: 'sec-packages', section_key: 'packages', title: 'Curated Packages', subtitle: 'Transparent Investment For Your Memories', is_enabled: true, display_order: 5 },
  { id: 'sec-testimonials', section_key: 'testimonials', title: 'Kind Words', subtitle: 'Heartfelt Stories From Our Couples', is_enabled: true, display_order: 6 },
  { id: 'sec-cta', section_key: 'cta', title: 'Call To Action Banner', subtitle: 'Let Us Tell Your Story', is_enabled: true, display_order: 7 },
  { id: 'sec-contact', section_key: 'contact', title: 'Inquire & Reserve', subtitle: 'Start The Conversation', is_enabled: true, display_order: 8 },
];

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  primary_color: '#050505',
  accent_red: '#D91B24',
  background_color: '#050505',
  text_color: '#FFFFFF',
  button_radius: 'md',
  font_heading: 'cormorant',
  section_spacing: 'normal',
  enable_animations: true,
};

export const DEFAULT_SEO_SETTINGS: SeoSettings = {
  meta_title: 'Saikat Photography – Luxury Wedding & Portrait Photographer',
  meta_description:
    'Award-winning luxury wedding photography and cinematic visual storytelling studio founded by Saikat. Available across India and worldwide.',
  keywords: 'Saikat photography, luxury wedding photographer, cinematic wedding film, pre-wedding shoot, destination wedding India, fine art portrait',
  canonical_url: 'https://saikatphotography.com',
  og_title: 'Saikat Photography – Luxury Visuals & Cinematic Heirlooms',
  og_description:
    'Capturing moments, creating memories. Fine-art weddings, couple shoots, and editorial visual artistry.',
  og_image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
  twitter_card: 'summary_large_image',
  robots: 'index, follow',
};

export const DEFAULT_INQUIRIES: Inquiry[] = [];

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: 'user-super-1',
    email: 'admin@saikatphotography.com',
    full_name: 'Saikat (Master Studio)',
    role: 'super_admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=85',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-admin-2',
    email: 'editor@saikatphotography.com',
    full_name: 'Ria Das (Studio Manager)',
    role: 'editor',
    created_at: '2026-02-15T00:00:00Z',
  },
];

export const DEFAULT_ANALYTICS_SETTINGS: GoogleAnalyticsSettings = {
  ga4_measurement_id: '',
  gtm_container_id: '',
  meta_pixel_id: '',
  custom_head_code: '',
  custom_body_code: '',
  enable_ga: true,
  enable_pixel: false,
  track_whatsapp_clicks: true,
  track_inquiries: true,
};

export const DEFAULT_TEMPLATES: NotificationTemplate[] = [
  {
    id: 'tmpl-1',
    name: 'New Lead Instant WhatsApp Reply',
    category: 'inquiry',
    channel: 'whatsapp',
    body: 'Hello {{client_name}}! Thank you for reaching out to Saikat Photography. We have received your inquiry for your {{event_type}} on {{event_date}}. We would love to discuss your artistic vision in detail. Are you available for a brief consultation call today?',
    variables: ['client_name', 'event_type', 'event_date'],
  },
  {
    id: 'tmpl-2',
    name: 'Wedding Booking Confirmation',
    category: 'booking',
    channel: 'whatsapp',
    body: 'Warmest congratulations {{client_name}}! Your wedding date ({{event_date}}) is officially reserved with Saikat Photography. We are deeply honored to document your legacy and celebrate this milestone with you.',
    variables: ['client_name', 'event_date'],
  },
  {
    id: 'tmpl-3',
    name: 'Pre-Shoot Checklist & Reminder',
    category: 'reminder',
    channel: 'whatsapp',
    body: 'Hi {{client_name}}, Saikat Photography here! Just a quick reminder that our session is scheduled for {{shoot_date}} at {{location}}. Please arrive 15 minutes prior for wardrobe adjustment. Can\'t wait to create magic together!',
    variables: ['client_name', 'shoot_date', 'location'],
  },
  {
    id: 'tmpl-4',
    name: 'Private Proofing Gallery Ready',
    category: 'delivery',
    channel: 'whatsapp',
    body: 'Hello {{client_name}}! Your private heirloom gallery is ready for preview. Access your photos with your secure PIN: {{access_pin}}. Please select your favorite frames for your heirloom art book!',
    variables: ['client_name', 'access_pin'],
  },
];

export const DEFAULT_FAQS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'How far in advance should we reserve our wedding date?',
    answer: 'We accept a strictly limited number of luxury weddings each calendar year to ensure complete devotion to each gallery and film. We recommend reserving your date 6 to 12 months in advance, especially for auspicious peak winter and destination dates.',
    category: 'booking',
    display_order: 1,
    is_active: true,
  },
  {
    id: 'faq-2',
    question: 'What is your signature photography and cinematography approach?',
    answer: 'Our visual language balances raw documentary emotion with editorial, high-fashion styling. We prioritize unobtrusive candid storytelling throughout sacred rituals, accompanied by deliberate, cinematic fine-art portraits sculpted by intentional natural and dramatic light.',
    category: 'general',
    display_order: 2,
    is_active: true,
  },
  {
    id: 'faq-3',
    question: 'Do you travel for destination weddings across India and internationally?',
    answer: 'Yes! Saikat and our master crew travel extensively across Rajasthan, Goa, Kerala, South East Asia, Europe, and the Middle East. All bespoke travel and logistics are transparently organized beforehand.',
    category: 'booking',
    display_order: 3,
    is_active: true,
  },
  {
    id: 'faq-4',
    question: 'When will we receive our photographs and cinematic film?',
    answer: 'We provide an exclusive 48-hour sneak-peek preview of 25–40 signature edited frames for sharing with family. Complete high-resolution color-graded galleries and cinematic film teasers are delivered within 3 to 4 weeks.',
    category: 'delivery',
    display_order: 4,
    is_active: true,
  },
  {
    id: 'faq-5',
    question: 'How do you ensure data safety and backup of our once-in-a-lifetime moments?',
    answer: 'We employ dual-card redundancy in every camera on-site. Raw files are immediately duplicated onto dual rugged NVMe solid-state drives before leaving the venue, and subsequently mirrored to encrypted off-site cloud archives.',
    category: 'equipment',
    display_order: 5,
    is_active: true,
  },
];

// ==========================================
// LOCAL STORAGE REACTIVE STORE BACKEND
// (Guarantees zero broken buttons & instant responsive updates)
// ==========================================

const STORAGE_KEY_PREFIX = 'saikat_cms_';

// One-time automatic clean of previously cached demo data in user's browser localStorage
if (typeof window !== 'undefined') {
  const CLEAN_VERSION = 'v2_clean_demo_data';
  const currentCleanVersion = localStorage.getItem(STORAGE_KEY_PREFIX + 'clean_version');
  if (currentCleanVersion !== CLEAN_VERSION) {
    const demoKeys = [
      'gallery_images',
      'services',
      'packages',
      'sub_packages',
      'package_enquiries',
      'testimonials',
      'inquiries',
      'studio_bookings',
      'studio_quotations',
      'client_galleries',
      'media_library',
      'logs',
      'saikat_studio_notes'
    ];
    demoKeys.forEach((k) => {
      localStorage.removeItem(STORAGE_KEY_PREFIX + k);
      localStorage.removeItem(k);
    });
    localStorage.setItem(STORAGE_KEY_PREFIX + 'clean_version', CLEAN_VERSION);
  }
}

function getStoredItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function setStoredItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage quota or write error', e);
  }
}

// Global Event for cross-component reactive sync
export const CMS_UPDATE_EVENT = 'saikat_cms_data_updated';
export function notifyDataChanged() {
  window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT));
}

// Complete Unified Store & Database Service
export const DB = {
  // --- Site Settings ---
  getSettings: async (): Promise<SiteSettings> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('site_settings').select('*').single();
        if (!error && data) return data as SiteSettings;
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local store', err);
      }
    }
    return getStoredItem<SiteSettings>('site_settings', DEFAULT_SITE_SETTINGS);
  },

  updateSettings: async (settings: Partial<SiteSettings>): Promise<SiteSettings> => {
    const current = await DB.getSettings();
    const updated = { ...current, ...settings, updated_at: new Date().toISOString() };
    setStoredItem('site_settings', updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('site_settings').upsert(updated);
      } catch (err) {
        console.error('Supabase update failed:', err);
      }
    }
    notifyDataChanged();
    return updated;
  },

  // --- Categories ---
  getCategories: async (): Promise<GalleryCategory[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('gallery_categories').select('*').order('display_order');
        if (!error && data && data.length > 0) return data as GalleryCategory[];
      } catch (err) {
        console.warn('Supabase fetch categories failed', err);
      }
    }
    return getStoredItem<GalleryCategory[]>('categories', DEFAULT_CATEGORIES);
  },

  saveCategories: async (categories: GalleryCategory[]): Promise<GalleryCategory[]> => {
    setStoredItem('categories', categories);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('gallery_categories').upsert(categories);
      } catch (err) {
        console.error('Supabase categories save failed', err);
      }
    }
    notifyDataChanged();
    return categories;
  },

  // --- Gallery Images ---
  getGalleryImages: async (onlyPublished = false): Promise<GalleryImage[]> => {
    let images: GalleryImage[] = [];
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('gallery_images').select('*').order('display_order');
        if (onlyPublished) query = query.eq('is_published', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) images = data as GalleryImage[];
      } catch (err) {
        console.warn('Supabase gallery fetch failed', err);
      }
    }
    if (images.length === 0) {
      images = getStoredItem<GalleryImage[]>('gallery_images', DEFAULT_GALLERY_IMAGES);
    }
    return onlyPublished ? images.filter((img) => img.is_published) : images;
  },

  saveGalleryImage: async (image: Partial<GalleryImage> & { title: string; image_url: string }): Promise<GalleryImage> => {
    const images = await DB.getGalleryImages(false);
    let updatedImage: GalleryImage;

    if (image.id) {
      updatedImage = {
        ...images.find((i) => i.id === image.id)!,
        ...image,
      } as GalleryImage;
      const idx = images.findIndex((i) => i.id === image.id);
      if (idx !== -1) images[idx] = updatedImage;
      else images.push(updatedImage);
    } else {
      updatedImage = {
        id: 'img-' + Date.now(),
        title: image.title,
        description: image.description || '',
        category_id: image.category_id || 'cat-weddings',
        category_name: image.category_name || 'Weddings',
        image_url: image.image_url,
        alt_text: image.alt_text || image.title,
        is_featured: Boolean(image.is_featured),
        is_published: image.is_published ?? true,
        display_order: image.display_order ?? images.length + 1,
        created_at: new Date().toISOString(),
      };
      images.push(updatedImage);
    }

    setStoredItem('gallery_images', images);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('gallery_images').upsert(updatedImage);
      } catch (err) {
        console.error('Supabase image save failed', err);
      }
    }
    notifyDataChanged();
    return updatedImage;
  },

  deleteGalleryImage: async (id: string): Promise<void> => {
    const images = (await DB.getGalleryImages(false)).filter((img) => img.id !== id);
    setStoredItem('gallery_images', images);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('gallery_images').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase image delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Services ---
  getServices: async (onlyActive = false): Promise<Service[]> => {
    let services: Service[] = [];
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('services').select('*').order('display_order');
        if (onlyActive) query = query.eq('is_active', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) services = data as Service[];
      } catch (err) {
        console.warn('Supabase services fetch failed', err);
      }
    }
    if (services.length === 0) {
      services = getStoredItem<Service[]>('services', DEFAULT_SERVICES);
    }
    return onlyActive ? services.filter((s) => s.is_active) : services;
  },

  saveService: async (service: Partial<Service> & { title: string }): Promise<Service> => {
    const services = await DB.getServices(false);
    let saved: Service;
    if (service.id) {
      saved = { ...services.find((s) => s.id === service.id)!, ...service } as Service;
      const idx = services.findIndex((s) => s.id === service.id);
      if (idx !== -1) services[idx] = saved;
      else services.push(saved);
    } else {
      saved = {
        id: 'serv-' + Date.now(),
        title: service.title,
        slug: service.slug || service.title.toLowerCase().replace(/\s+/g, '-'),
        short_description: service.short_description || '',
        full_description: service.full_description || '',
        image_url: service.image_url || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
        starting_price: service.starting_price || 'Contact for price',
        price_type: service.price_type || 'starting_at',
        features: service.features || [],
        cta_text: service.cta_text || 'Inquire Now',
        is_active: service.is_active ?? true,
        display_order: service.display_order ?? services.length + 1,
        created_at: new Date().toISOString(),
      };
      services.push(saved);
    }
    setStoredItem('services', services);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('services').upsert(saved);
      } catch (err) {
        console.error('Supabase service save failed', err);
      }
    }
    notifyDataChanged();
    return saved;
  },

  deleteService: async (id: string): Promise<void> => {
    const services = (await DB.getServices(false)).filter((s) => s.id !== id);
    setStoredItem('services', services);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('services').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase service delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Packages ---
  getPackages: async (onlyActive = false): Promise<Package[]> => {
    let pkgs: Package[] = [];
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('packages').select('*').order('display_order');
        if (onlyActive) query = query.eq('is_active', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) pkgs = data as Package[];
      } catch (err) {
        console.warn('Supabase packages fetch failed', err);
      }
    }
    if (pkgs.length === 0) {
      pkgs = getStoredItem<Package[]>('packages', DEFAULT_PACKAGES);
    }
    return onlyActive ? pkgs.filter((p) => p.is_active) : pkgs;
  },

  savePackage: async (pkg: Partial<Package> & { title: string }): Promise<Package> => {
    const pkgs = await DB.getPackages(false);
    let saved: Package;
    if (pkg.id) {
      saved = { ...pkgs.find((p) => p.id === pkg.id)!, ...pkg } as Package;
      const idx = pkgs.findIndex((p) => p.id === pkg.id);
      if (idx !== -1) pkgs[idx] = saved;
      else pkgs.push(saved);
    } else {
      saved = {
        id: 'pkg-' + Date.now(),
        title: pkg.title,
        slug: pkg.slug || pkg.title.toLowerCase().replace(/\s+/g, '-'),
        description: pkg.description || '',
        price: pkg.price || 'Contact for price',
        price_type: pkg.price_type || 'fixed',
        currency: pkg.currency || 'INR',
        duration: pkg.duration || 'Full Day',
        photographers_count: pkg.photographers_count ?? 2,
        edited_photos_count: pkg.edited_photos_count ?? 300,
        albums_count: pkg.albums_count ?? 1,
        video_included: Boolean(pkg.video_included),
        pre_wedding_included: Boolean(pkg.pre_wedding_included),
        drone_included: Boolean(pkg.drone_included),
        features: pkg.features || [],
        badge: pkg.badge || '',
        is_popular: Boolean(pkg.is_popular),
        is_active: pkg.is_active ?? true,
        display_order: pkg.display_order ?? pkgs.length + 1,
        created_at: new Date().toISOString(),
      };
      pkgs.push(saved);
    }
    setStoredItem('packages', pkgs);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('packages').upsert(saved);
      } catch (err) {
        console.error('Supabase package save failed', err);
      }
    }
    notifyDataChanged();
    return saved;
  },

  deletePackage: async (id: string): Promise<void> => {
    const pkgs = (await DB.getPackages(false)).filter((p) => p.id !== id);
    setStoredItem('packages', pkgs);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('packages').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase package delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Dynamic Main Packages (Silver, Gold, Diamond, etc.) ---
  getMainPackages: async (onlyActive = false): Promise<MainPackage[]> => {
    let mainPkgs: MainPackage[] = [];
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('main_packages').select('*').order('display_order');
        if (onlyActive) query = query.eq('is_active', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) mainPkgs = data as MainPackage[];
      } catch (err) {
        console.warn('Supabase main_packages fetch failed', err);
      }
    }
    if (mainPkgs.length === 0) {
      mainPkgs = getStoredItem<MainPackage[]>('main_packages', DEFAULT_MAIN_PACKAGES);
    }
    return onlyActive ? mainPkgs.filter((p) => p.is_active) : mainPkgs;
  },

  saveMainPackage: async (pkg: Partial<MainPackage> & { name: string }): Promise<MainPackage> => {
    const mainPkgs = await DB.getMainPackages(false);
    let saved: MainPackage;
    if (pkg.id) {
      saved = { ...mainPkgs.find((p) => p.id === pkg.id)!, ...pkg } as MainPackage;
      const idx = mainPkgs.findIndex((p) => p.id === pkg.id);
      if (idx !== -1) mainPkgs[idx] = saved;
      else mainPkgs.push(saved);
    } else {
      saved = {
        id: 'main-pkg-' + Date.now(),
        name: pkg.name,
        slug: pkg.slug || pkg.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: pkg.description || '',
        badge: pkg.badge || '',
        is_active: pkg.is_active ?? true,
        display_order: pkg.display_order ?? mainPkgs.length + 1,
        created_at: new Date().toISOString(),
      };
      mainPkgs.push(saved);
    }
    setStoredItem('main_packages', mainPkgs);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('main_packages').upsert(saved);
      } catch (err) {
        console.error('Supabase main_package save failed', err);
      }
    }
    notifyDataChanged();
    return saved;
  },

  deleteMainPackage: async (id: string): Promise<void> => {
    const mainPkgs = (await DB.getMainPackages(false)).filter((p) => p.id !== id);
    setStoredItem('main_packages', mainPkgs);

    // Also remove any linked sub-packages locally
    const subPkgs = (await DB.getSubPackages(undefined, false)).filter((s) => s.main_package_id !== id);
    setStoredItem('sub_packages', subPkgs);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('sub_packages').delete().eq('main_package_id', id);
        await supabase.from('main_packages').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase main_package delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Dynamic Sub-Packages (Any number per main package) ---
  getSubPackages: async (mainPackageId?: string, onlyActive = false): Promise<SubPackage[]> => {
    let subPkgs: SubPackage[] = [];
    if (isSupabaseConfigured) {
      try {
        let query = supabase.from('sub_packages').select('*').order('display_order');
        if (mainPackageId) query = query.eq('main_package_id', mainPackageId);
        if (onlyActive) query = query.eq('is_active', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) subPkgs = data as SubPackage[];
      } catch (err) {
        console.warn('Supabase sub_packages fetch failed', err);
      }
    }
    if (subPkgs.length === 0) {
      subPkgs = getStoredItem<SubPackage[]>('sub_packages', DEFAULT_SUB_PACKAGES);
    }
    let result = subPkgs;
    if (mainPackageId) {
      result = result.filter((s) => s.main_package_id === mainPackageId);
    }
    if (onlyActive) {
      result = result.filter((s) => s.is_active);
    }
    return result.sort((a, b) => a.display_order - b.display_order);
  },

  saveSubPackage: async (sub: Partial<SubPackage> & { name: string; price: string; main_package_id: string }): Promise<SubPackage> => {
    const allSubs = await DB.getSubPackages(undefined, false);
    let saved: SubPackage;
    if (sub.id) {
      saved = { ...allSubs.find((s) => s.id === sub.id)!, ...sub } as SubPackage;
      const idx = allSubs.findIndex((s) => s.id === sub.id);
      if (idx !== -1) allSubs[idx] = saved;
      else allSubs.push(saved);
    } else {
      saved = {
        id: 'sub-pkg-' + Date.now(),
        main_package_id: sub.main_package_id,
        name: sub.name,
        price: sub.price,
        description: sub.description || '',
        features: sub.features || [],
        image_url: sub.image_url || '',
        badge: sub.badge || '',
        is_popular: Boolean(sub.is_popular),
        is_active: sub.is_active ?? true,
        display_order: sub.display_order ?? allSubs.filter((s) => s.main_package_id === sub.main_package_id).length + 1,
        created_at: new Date().toISOString(),
      };
      allSubs.push(saved);
    }
    setStoredItem('sub_packages', allSubs);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('sub_packages').upsert(saved);
      } catch (err) {
        console.error('Supabase sub_package save failed', err);
      }
    }
    notifyDataChanged();
    return saved;
  },

  deleteSubPackage: async (id: string): Promise<void> => {
    const allSubs = (await DB.getSubPackages(undefined, false)).filter((s) => s.id !== id);
    setStoredItem('sub_packages', allSubs);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('sub_packages').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase sub_package delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Dynamic Package Enquiries (Customer Submissions) ---
  getPackageEnquiries: async (): Promise<PackageEnquiry[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('package_enquiries').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as PackageEnquiry[];
      } catch (err) {
        console.warn('Supabase package_enquiries fetch failed', err);
      }
    }
    return getStoredItem<PackageEnquiry[]>('package_enquiries', DEFAULT_PACKAGE_ENQUIRIES);
  },

  createPackageEnquiry: async (enquiryData: Omit<PackageEnquiry, 'id' | 'status' | 'created_at' | 'updated_at'> & { status?: PackageEnquiryStatus }): Promise<PackageEnquiry> => {
    const nowIso = new Date().toISOString();
    const newEnq: PackageEnquiry = {
      ...enquiryData,
      id: 'enq-pkg-' + Date.now(),
      status: enquiryData.status || 'new',
      created_at: nowIso,
      updated_at: nowIso,
    };
    const current = await DB.getPackageEnquiries();
    setStoredItem('package_enquiries', [newEnq, ...current]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('package_enquiries').insert([newEnq]);
      } catch (err) {
        console.error('Supabase package_enquiries insert failed', err);
      }
    }

    // Also register in general inquiries so it reflects in primary leads feed
    try {
      await DB.createInquiry({
        name: newEnq.customer_name,
        email: newEnq.customer_email,
        phone: newEnq.customer_phone,
        event_type: `${newEnq.main_package_name} – ${newEnq.sub_package_name} (${newEnq.package_price})`,
        event_date: newEnq.event_date,
        location: newEnq.location,
        budget: newEnq.package_price,
        message: newEnq.message,
      });
    } catch (e) {
      console.warn('Secondary lead feed insert warning', e);
    }

    notifyDataChanged();
    return newEnq;
  },

  updatePackageEnquiryStatus: async (id: string, status: PackageEnquiryStatus, internal_notes?: string): Promise<void> => {
    const list = await DB.getPackageEnquiries();
    const idx = list.findIndex((e) => e.id === id);
    if (idx !== -1) {
      list[idx].status = status;
      if (internal_notes !== undefined) {
        list[idx].internal_notes = internal_notes;
      }
      list[idx].updated_at = new Date().toISOString();
      setStoredItem('package_enquiries', list);
    }
    if (isSupabaseConfigured) {
      try {
        const payload: any = { status, updated_at: new Date().toISOString() };
        if (internal_notes !== undefined) payload.internal_notes = internal_notes;
        await supabase.from('package_enquiries').update(payload).eq('id', id);
      } catch (err) {
        console.error('Supabase update package_enquiry failed', err);
      }
    }
    notifyDataChanged();
  },

  deletePackageEnquiry: async (id: string): Promise<void> => {
    const list = (await DB.getPackageEnquiries()).filter((e) => e.id !== id);
    setStoredItem('package_enquiries', list);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('package_enquiries').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase package_enquiry delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Testimonials ---
  getTestimonials: async (onlyPublished = false): Promise<Testimonial[]> => {
    let list: Testimonial[] = [];
    if (isSupabaseConfigured) {
      try {
        let q = supabase.from('testimonials').select('*').order('display_order');
        if (onlyPublished) q = q.eq('is_published', true);
        const { data, error } = await q;
        if (!error && data && data.length > 0) list = data as Testimonial[];
      } catch (err) {
        console.warn('Supabase testimonials fetch failed', err);
      }
    }
    if (list.length === 0) {
      list = getStoredItem<Testimonial[]>('testimonials', DEFAULT_TESTIMONIALS);
    }
    return onlyPublished ? list.filter((t) => t.is_published) : list;
  },

  saveTestimonial: async (test: Partial<Testimonial> & { client_name: string; review_text: string }): Promise<Testimonial> => {
    const list = await DB.getTestimonials(false);
    let saved: Testimonial;
    if (test.id) {
      saved = { ...list.find((t) => t.id === test.id)!, ...test } as Testimonial;
      const idx = list.findIndex((t) => t.id === test.id);
      if (idx !== -1) list[idx] = saved;
      else list.push(saved);
    } else {
      saved = {
        id: 'test-' + Date.now(),
        client_name: test.client_name,
        event_type: test.event_type || 'Wedding',
        client_image: test.client_image || '',
        rating: test.rating || 5,
        review_text: test.review_text,
        event_date: test.event_date || 'Recently',
        is_published: test.is_published ?? true,
        display_order: test.display_order ?? list.length + 1,
        created_at: new Date().toISOString(),
      };
      list.push(saved);
    }
    setStoredItem('testimonials', list);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('testimonials').upsert(saved);
      } catch (err) {
        console.error('Supabase testimonial save failed', err);
      }
    }
    notifyDataChanged();
    return saved;
  },

  deleteTestimonial: async (id: string): Promise<void> => {
    const list = (await DB.getTestimonials(false)).filter((t) => t.id !== id);
    setStoredItem('testimonials', list);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('testimonials').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase testimonial delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Inquiries ---
  getInquiries: async (): Promise<Inquiry[]> => {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as Inquiry[];
      } catch (err) {
        console.warn('Supabase inquiries fetch failed', err);
      }
    }
    return getStoredItem<Inquiry[]>('inquiries', DEFAULT_INQUIRIES);
  },

  createInquiry: async (inquiryData: Omit<Inquiry, 'id' | 'status' | 'created_at'>): Promise<Inquiry> => {
    const newInq: Inquiry = {
      ...inquiryData,
      id: 'inq-' + Date.now(),
      status: 'new',
      created_at: new Date().toISOString(),
    };
    const current = await DB.getInquiries();
    setStoredItem('inquiries', [newInq, ...current]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('inquiries').insert([newInq]);
      } catch (err) {
        console.error('Supabase inquiry insert failed', err);
      }
    }
    notifyDataChanged();
    return newInq;
  },

  updateInquiryStatus: async (id: string, status: Inquiry['status'], internal_notes?: string): Promise<void> => {
    const list = await DB.getInquiries();
    const target = list.find((i) => i.id === id);
    if (target) {
      target.status = status;
      if (internal_notes !== undefined) target.internal_notes = internal_notes;
      target.updated_at = new Date().toISOString();
      setStoredItem('inquiries', list);

      if (isSupabaseConfigured) {
        try {
          await supabase.from('inquiries').update({ status, internal_notes, updated_at: target.updated_at }).eq('id', id);
        } catch (err) {
          console.error('Supabase inquiry update failed', err);
        }
      }
      notifyDataChanged();
    }
  },

  deleteInquiry: async (id: string): Promise<void> => {
    const list = (await DB.getInquiries()).filter((i) => i.id !== id);
    setStoredItem('inquiries', list);
    if (isSupabaseConfigured) {
      try {
        await supabase.from('inquiries').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase inquiry delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Homepage Sections ---
  getSections: async (): Promise<HomepageSection[]> => {
    return getStoredItem<HomepageSection[]>('sections', DEFAULT_HOMEPAGE_SECTIONS);
  },

  saveSections: async (sections: HomepageSection[]): Promise<void> => {
    setStoredItem('sections', sections);
    notifyDataChanged();
  },

  // --- Theme Settings ---
  getTheme: async (): Promise<ThemeSettings> => {
    return getStoredItem<ThemeSettings>('theme', DEFAULT_THEME_SETTINGS);
  },

  saveTheme: async (theme: ThemeSettings): Promise<void> => {
    setStoredItem('theme', theme);
    notifyDataChanged();
  },

  // --- SEO Settings ---
  getSeo: async (): Promise<SeoSettings> => {
    return getStoredItem<SeoSettings>('seo', DEFAULT_SEO_SETTINGS);
  },

  saveSeo: async (seo: SeoSettings): Promise<void> => {
    setStoredItem('seo', seo);
    notifyDataChanged();
  },

  // --- Activity Log ---
  getLogs: async (): Promise<ActivityLog[]> => {
    return getStoredItem<ActivityLog[]>('logs', []);
  },

  logActivity: async (action: string, entity: string, details?: string): Promise<void> => {
    const current = await DB.getLogs();
    const newLog: ActivityLog = {
      id: 'log-' + Date.now(),
      admin_email: localStorage.getItem('saikat_admin_email') || 'admin@saikatphotography.com',
      action,
      entity,
      details,
      created_at: new Date().toISOString(),
    };
    setStoredItem('logs', [newLog, ...current.slice(0, 49)]);
  },

  // --- Media Library ---
  getMedia: async (): Promise<MediaItem[]> => {
    return getStoredItem<MediaItem[]>('media_library', []);
  },

  addMedia: async (item: Omit<MediaItem, 'id' | 'created_at'>): Promise<MediaItem> => {
    const list = await DB.getMedia();
    const newItem: MediaItem = {
      ...item,
      id: 'media-' + Date.now(),
      created_at: new Date().toISOString(),
    };
    setStoredItem('media_library', [newItem, ...list]);
    return newItem;
  },

  deleteMedia: async (id: string): Promise<void> => {
    const list = (await DB.getMedia()).filter((m) => m.id !== id);
    setStoredItem('media_library', list);
  },

  // --- Admin Users ---
  getUsers: async (): Promise<AdminUser[]> => {
    return getStoredItem<AdminUser[]>('admin_users', DEFAULT_ADMIN_USERS);
  },

  saveUser: async (user: AdminUser): Promise<void> => {
    const users = await DB.getUsers();
    const idx = users.findIndex((u) => u.id === user.id);
    if (idx !== -1) users[idx] = user;
    else users.push(user);
    setStoredItem('admin_users', users);
    notifyDataChanged();
  },

  deleteUser: async (id: string): Promise<void> => {
    const users = (await DB.getUsers()).filter((u) => u.id !== id);
    setStoredItem('admin_users', users);
    notifyDataChanged();
  },

  // --- Google Analytics & Pixel Settings ---
  getAnalyticsSettings: async (): Promise<GoogleAnalyticsSettings> => {
    if (isSupabaseActive()) {
      try {
        const { data, error } = await supabase.from('analytics_settings').select('*').single();
        if (!error && data) return data as GoogleAnalyticsSettings;
      } catch (err) {
        console.warn('Supabase analytics fetch failed', err);
      }
    }
    return getStoredItem<GoogleAnalyticsSettings>('analytics_settings', DEFAULT_ANALYTICS_SETTINGS);
  },

  saveAnalyticsSettings: async (settings: GoogleAnalyticsSettings): Promise<void> => {
    setStoredItem('analytics_settings', settings);
    if (isSupabaseActive()) {
      try {
        await supabase.from('analytics_settings').upsert({ id: 'analytics-settings-main', ...settings });
      } catch (err) {
        console.error('Supabase analytics save failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Client Proofing Private Galleries ---
  getClientGalleries: async (): Promise<ClientGallery[]> => {
    if (isSupabaseActive()) {
      try {
        const { data, error } = await supabase.from('client_galleries').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as ClientGallery[];
      } catch (err) {
        console.warn('Supabase client galleries fetch failed', err);
      }
    }
    return getStoredItem<ClientGallery[]>('client_galleries', []);
  },

  saveClientGallery: async (gallery: Partial<ClientGallery> & { client_name: string; event_title: string }): Promise<ClientGallery> => {
    const list = await DB.getClientGalleries();
    let saved: ClientGallery;
    if (gallery.id) {
      saved = { ...list.find((g) => g.id === gallery.id)!, ...gallery } as ClientGallery;
      const idx = list.findIndex((g) => g.id === gallery.id);
      if (idx !== -1) list[idx] = saved;
      else list.push(saved);
    } else {
      saved = {
        id: 'cg-' + Date.now(),
        client_name: gallery.client_name,
        event_title: gallery.event_title,
        event_date: gallery.event_date || new Date().toISOString().split('T')[0],
        cover_image: gallery.cover_image || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
        access_pin: gallery.access_pin || Math.floor(1000 + Math.random() * 9000).toString(),
        images_count: gallery.images_count || 0,
        is_active: gallery.is_active ?? true,
        download_allowed: gallery.download_allowed ?? true,
        external_album_url: gallery.external_album_url || '',
        created_at: new Date().toISOString(),
      };
      list.push(saved);
    }
    setStoredItem('client_galleries', list);
    if (isSupabaseActive()) {
      try {
        await supabase.from('client_galleries').upsert(saved);
      } catch (err) {
        console.error('Supabase client gallery save failed', err);
      }
    }
    notifyDataChanged();
    return saved;
  },

  deleteClientGallery: async (id: string): Promise<void> => {
    const list = (await DB.getClientGalleries()).filter((g) => g.id !== id);
    setStoredItem('client_galleries', list);
    if (isSupabaseActive()) {
      try {
        await supabase.from('client_galleries').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase client gallery delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Studio Bookings & Calendar ---
  getBookings: async (): Promise<StudioBooking[]> => {
    if (isSupabaseActive()) {
      try {
        const { data, error } = await supabase.from('studio_bookings').select('*').order('date', { ascending: true });
        if (!error && data && data.length > 0) return data as StudioBooking[];
      } catch (err) {
        console.warn('Supabase bookings fetch failed', err);
      }
    }
    return getStoredItem<StudioBooking[]>('studio_bookings', []);
  },

  saveBooking: async (booking: Partial<StudioBooking> & { client_name: string; date: string }): Promise<StudioBooking> => {
    const list = await DB.getBookings();
    let saved: StudioBooking;
    if (booking.id) {
      saved = { ...list.find((b) => b.id === booking.id)!, ...booking } as StudioBooking;
      const idx = list.findIndex((b) => b.id === booking.id);
      if (idx !== -1) list[idx] = saved;
      else list.push(saved);
    } else {
      saved = {
        id: 'book-' + Date.now(),
        client_name: booking.client_name,
        event_type: booking.event_type || 'Wedding Shoot',
        date: booking.date,
        status: booking.status || 'tentative',
        location: booking.location || '',
        notes: booking.notes || '',
        created_at: new Date().toISOString(),
      };
      list.push(saved);
    }
    setStoredItem('studio_bookings', list);
    if (isSupabaseActive()) {
      try {
        await supabase.from('studio_bookings').upsert(saved);
      } catch (err) {
        console.error('Supabase booking save failed', err);
      }
    }
    notifyDataChanged();
    return saved;
  },

  deleteBooking: async (id: string): Promise<void> => {
    const list = (await DB.getBookings()).filter((b) => b.id !== id);
    setStoredItem('studio_bookings', list);
    if (isSupabaseActive()) {
      try {
        await supabase.from('studio_bookings').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase booking delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- FAQs Manager ---
  getFaqs: async (onlyActive = false): Promise<FaqItem[]> => {
    if (isSupabaseActive()) {
      try {
        let query = supabase.from('faqs').select('*').order('display_order');
        if (onlyActive) query = query.eq('is_active', true);
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data as FaqItem[];
      } catch (err) {
        console.warn('Supabase faqs fetch failed', err);
      }
    }
    const list = getStoredItem<FaqItem[]>('faqs', DEFAULT_FAQS);
    return onlyActive ? list.filter((f) => f.is_active) : list;
  },

  saveFaq: async (faq: Partial<FaqItem> & { question: string; answer: string }): Promise<FaqItem> => {
    const list = await DB.getFaqs(false);
    let saved: FaqItem;
    if (faq.id) {
      saved = { ...list.find((f) => f.id === faq.id)!, ...faq } as FaqItem;
      const idx = list.findIndex((f) => f.id === faq.id);
      if (idx !== -1) list[idx] = saved;
      else list.push(saved);
    } else {
      saved = {
        id: 'faq-' + Date.now(),
        question: faq.question,
        answer: faq.answer,
        category: faq.category || 'general',
        display_order: faq.display_order ?? list.length + 1,
        is_active: faq.is_active ?? true,
        created_at: new Date().toISOString(),
      };
      list.push(saved);
    }
    setStoredItem('faqs', list);
    if (isSupabaseActive()) {
      try {
        await supabase.from('faqs').upsert(saved);
      } catch (err) {
        console.error('Supabase faq save failed', err);
      }
    }
    notifyDataChanged();
    return saved;
  },

  deleteFaq: async (id: string): Promise<void> => {
    const list = (await DB.getFaqs(false)).filter((f) => f.id !== id);
    setStoredItem('faqs', list);
    if (isSupabaseActive()) {
      try {
        await supabase.from('faqs').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase faq delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Quotations Generator ---
  getQuotations: async (): Promise<StudioQuotation[]> => {
    if (isSupabaseActive()) {
      try {
        const { data, error } = await supabase.from('studio_quotations').select('*').order('created_at', { ascending: false });
        if (!error && data && data.length > 0) return data as StudioQuotation[];
      } catch (err) {
        console.warn('Supabase quotations fetch failed', err);
      }
    }
    return getStoredItem<StudioQuotation[]>('studio_quotations', []);
  },

  saveQuotation: async (quotation: Partial<StudioQuotation> & { client_name: string; items: QuotationItem[] }): Promise<StudioQuotation> => {
    const list = await DB.getQuotations();
    let saved: StudioQuotation;
    const computedTotal = quotation.items.reduce((acc, it) => acc + (Number(it.amount) || 0), 0);

    if (quotation.id) {
      saved = { ...list.find((q) => q.id === quotation.id)!, ...quotation, total_amount: computedTotal } as StudioQuotation;
      const idx = list.findIndex((q) => q.id === quotation.id);
      if (idx !== -1) list[idx] = saved;
      else list.push(saved);
    } else {
      saved = {
        id: 'quot-' + Date.now(),
        quotation_number: 'SP-' + Math.floor(10000 + Math.random() * 90000),
        client_name: quotation.client_name,
        client_email: quotation.client_email || '',
        client_phone: quotation.client_phone || '',
        event_type: quotation.event_type || 'Wedding Photography & Cinema',
        event_date: quotation.event_date || '',
        items: quotation.items,
        total_amount: computedTotal,
        currency: quotation.currency || 'INR',
        notes: quotation.notes || 'Valid for 14 calendar days from proposal date.',
        status: quotation.status || 'draft',
        created_at: new Date().toISOString(),
      };
      list.push(saved);
    }
    setStoredItem('studio_quotations', list);
    if (isSupabaseActive()) {
      try {
        await supabase.from('studio_quotations').upsert(saved);
      } catch (err) {
        console.error('Supabase quotation save failed', err);
      }
    }
    notifyDataChanged();
    return saved;
  },

  deleteQuotation: async (id: string): Promise<void> => {
    const list = (await DB.getQuotations()).filter((q) => q.id !== id);
    setStoredItem('studio_quotations', list);
    if (isSupabaseActive()) {
      try {
        await supabase.from('studio_quotations').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase quotation delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Data Export & Import ---
  exportBackupJson: async (): Promise<string> => {
    const backup = {
      timestamp: new Date().toISOString(),
      site_settings: await DB.getSettings(),
      categories: await DB.getCategories(),
      gallery_images: await DB.getGalleryImages(false),
      services: await DB.getServices(false),
      packages: await DB.getPackages(false),
      testimonials: await DB.getTestimonials(false),
      inquiries: await DB.getInquiries(),
      analytics_settings: await DB.getAnalyticsSettings(),
      faqs: await DB.getFaqs(false),
      bookings: await DB.getBookings(),
      quotations: await DB.getQuotations(),
      client_galleries: await DB.getClientGalleries(),
      theme: await DB.getTheme(),
      seo: await DB.getSeo(),
    };
    return JSON.stringify(backup, null, 2);
  },

  importBackupJson: async (jsonString: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonString);
      if (data.site_settings) setStoredItem('site_settings', data.site_settings);
      if (data.categories) setStoredItem('categories', data.categories);
      if (data.gallery_images) setStoredItem('gallery_images', data.gallery_images);
      if (data.services) setStoredItem('services', data.services);
      if (data.packages) setStoredItem('packages', data.packages);
      if (data.testimonials) setStoredItem('testimonials', data.testimonials);
      if (data.inquiries) setStoredItem('inquiries', data.inquiries);
      if (data.analytics_settings) setStoredItem('analytics_settings', data.analytics_settings);
      if (data.faqs) setStoredItem('faqs', data.faqs);
      if (data.bookings) setStoredItem('studio_bookings', data.bookings);
      if (data.quotations) setStoredItem('studio_quotations', data.quotations);
      if (data.client_galleries) setStoredItem('client_galleries', data.client_galleries);
      if (data.theme) setStoredItem('theme', data.theme);
      if (data.seo) setStoredItem('seo', data.seo);
      notifyDataChanged();
      return true;
    } catch (e) {
      console.error('Backup import parse error', e);
      return false;
    }
  },

  // --- Notification Templates ---
  getTemplates: async (): Promise<NotificationTemplate[]> => {
    if (isSupabaseActive()) {
      try {
        const { data, error } = await supabase.from('notification_templates').select('*');
        if (!error && data && data.length > 0) return data as NotificationTemplate[];
      } catch (err) {
        console.warn('Supabase templates fetch failed', err);
      }
    }
    return getStoredItem<NotificationTemplate[]>('notification_templates', DEFAULT_TEMPLATES);
  },

  saveTemplate: async (template: Partial<NotificationTemplate> & { name: string; body: string }): Promise<NotificationTemplate> => {
    const list = await DB.getTemplates();
    let saved: NotificationTemplate;
    if (template.id) {
      saved = { ...list.find((t) => t.id === template.id)!, ...template } as NotificationTemplate;
      const idx = list.findIndex((t) => t.id === template.id);
      if (idx !== -1) list[idx] = saved;
      else list.push(saved);
    } else {
      saved = {
        id: 'tmpl-' + Date.now(),
        name: template.name,
        category: template.category || 'inquiry',
        channel: template.channel || 'whatsapp',
        subject: template.subject || '',
        body: template.body,
        variables: template.variables || ['client_name'],
      };
      list.push(saved);
    }
    setStoredItem('notification_templates', list);
    if (isSupabaseActive()) {
      try {
        await supabase.from('notification_templates').upsert(saved);
      } catch (err) {
        console.error('Supabase template save failed', err);
      }
    }
    notifyDataChanged();
    return saved;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    const list = (await DB.getTemplates()).filter((t) => t.id !== id);
    setStoredItem('notification_templates', list);
    if (isSupabaseActive()) {
      try {
        await supabase.from('notification_templates').delete().eq('id', id);
      } catch (err) {
        console.error('Supabase template delete failed', err);
      }
    }
    notifyDataChanged();
  },

  // --- Seed Curated Luxury Demo Data (Optional for Admin) ---
  seedDemoData: async (): Promise<void> => {
    const luxuryImages: GalleryImage[] = [
      {
        id: 'img-w1',
        title: 'Royalty in Crimson & Gold',
        description: 'Traditional Bengali Royal wedding reception at The Rajbari Bawali.',
        category_id: 'cat-weddings',
        category_name: 'Weddings',
        image_url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1400&q=85',
        alt_text: 'Bride in red Benarasi sari with gold jewelry',
        is_featured: true,
        is_published: true,
        display_order: 1,
        camera_model: 'Sony A7R V',
        lens_model: 'FE 50mm f/1.2 GM',
        aperture: 'f/1.4',
        shutter_speed: '1/320s',
        iso: '160',
      },
      {
        id: 'img-w2',
        title: 'The Sacred Seven Vows',
        description: 'Saptapadi ritual captured around the holy Agni flame.',
        category_id: 'cat-weddings',
        category_name: 'Weddings',
        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85',
        alt_text: 'Wedding couple hands tied in holy matrimony',
        is_featured: true,
        is_published: true,
        display_order: 2,
        camera_model: 'Sony A1',
        lens_model: 'FE 85mm f/1.4 GM',
        aperture: 'f/1.8',
        shutter_speed: '1/400s',
        iso: '250',
      },
      {
        id: 'img-pw1',
        title: 'Golden Hour at Princep Ghat',
        description: 'Dramatic pre-wedding silhouettes alongside the majestic Vidyasagar Setu.',
        category_id: 'cat-pre-weddings',
        category_name: 'Pre-Weddings',
        image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=85',
        alt_text: 'Couple embracing during golden hour sunset',
        is_featured: true,
        is_published: true,
        display_order: 3,
        camera_model: 'Leica SL2',
        lens_model: 'Summilux-SL 50mm f/1.4 ASPH',
        aperture: 'f/2.0',
        shutter_speed: '1/1000s',
        iso: '100',
      },
      {
        id: 'img-p1',
        title: 'Elegance & Chiaroscuro',
        description: 'Fine-art editorial portrait celebrating heritage handwoven textiles.',
        category_id: 'cat-portraits',
        category_name: 'Portraits & Fashion',
        image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1400&q=85',
        alt_text: 'Moody editorial fashion portrait',
        is_featured: true,
        is_published: true,
        display_order: 4,
        camera_model: 'Hasselblad X2D 100C',
        lens_model: 'XCD 80mm f/1.9',
        aperture: 'f/2.2',
        shutter_speed: '1/250s',
        iso: '64',
      },
      {
        id: 'img-e1',
        title: 'Sindoor Khela Ecstasy',
        description: 'Festive red hues and joyous emotions during Durga Puja immersion.',
        category_id: 'cat-events',
        category_name: 'Events & Rituals',
        image_url: 'https://images.unsplash.com/photo-1609137144822-261556041065?auto=format&fit=crop&w=1400&q=85',
        alt_text: 'Celebratory red vermilion flying in festival',
        is_featured: false,
        is_published: true,
        display_order: 5,
        camera_model: 'Sony A7R V',
        lens_model: 'FE 24-70mm f/2.8 GM II',
        aperture: 'f/2.8',
        shutter_speed: '1/800s',
        iso: '400',
      },
      {
        id: 'img-m1',
        title: 'Newborn Serenity',
        description: 'Gentle, natural-light fine art motherhood portrait.',
        category_id: 'cat-maternity',
        category_name: 'Baby & Maternity',
        image_url: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=1400&q=85',
        alt_text: 'Mother holding baby with soft warm lighting',
        is_featured: false,
        is_published: true,
        display_order: 6,
        camera_model: 'Canon EOS R5',
        lens_model: 'RF 50mm f/1.2L USM',
        aperture: 'f/1.6',
        shutter_speed: '1/200s',
        iso: '100',
      },
    ];

    const luxuryServices: Service[] = [
      {
        id: 'serv-1',
        title: 'Luxury Wedding Storytelling',
        slug: 'luxury-weddings',
        short_description: 'Multi-day coverage by Saikat and our master cinematography crew, immortalizing every emotion with fine-art precision.',
        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85',
        starting_price: '₹1,50,000',
        price_type: 'starting_at',
        features: [
          'Full-day candid & traditional photography',
          '4K UHD Cinematic wedding highlight film',
          'Handcrafted Italian leather heirloom album',
          'Drone aerial cinematography',
          'Online private client proofing gallery',
        ],
        cta_text: 'Reserve Wedding Date',
        is_active: true,
        display_order: 1,
      },
      {
        id: 'serv-2',
        title: 'Cinematic Pre-Wedding Shoots',
        slug: 'pre-wedding-cinematography',
        short_description: 'Editorial concepts, destination landscapes, and romantic storytelling styled specifically around your love story.',
        image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1000&q=85',
        starting_price: '₹45,000',
        price_type: 'starting_at',
        features: [
          'Full day shooting at up to 2 picturesque locations',
          '3-minute 4K cinematic teaser film',
          '40 high-end color-graded retouched stills',
          'Styling, moodboard, and wardrobe consultation',
        ],
        cta_text: 'Plan Couple Session',
        is_active: true,
        display_order: 2,
      },
      {
        id: 'serv-3',
        title: 'Editorial & Celebrity Portraits',
        slug: 'editorial-portraits',
        short_description: 'Studio chiaroscuro and magazine-grade fashion portraits for artists, entrepreneurs, and discerning individuals.',
        image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
        starting_price: '₹25,000',
        price_type: 'starting_at',
        features: [
          'Studio lighting & creative direction',
          'Master skin retouching without skin texture loss',
          'High-resolution commercial print licenses',
        ],
        cta_text: 'Book Portrait Shoot',
        is_active: true,
        display_order: 3,
      },
    ];

    const luxuryPackages: Package[] = [
      {
        id: 'pkg-1',
        title: 'Silver Heirloom',
        slug: 'silver-heirloom',
        description: 'Comprehensive coverage for intimate single-day weddings and traditional ceremonies.',
        price: '₹75,000',
        price_type: 'starting_at',
        currency: 'INR',
        duration: '1 Full Day (10 Hours)',
        photographers_count: 2,
        edited_photos_count: 250,
        albums_count: 1,
        video_included: true,
        pre_wedding_included: false,
        drone_included: false,
        features: [
          '2 Senior Photographers (Candid + Traditional)',
          'Full HD highlight film (5-7 mins)',
          '1 Premium 40-page Photobook',
          'Private online delivery within 30 days',
        ],
        is_popular: false,
        is_active: true,
        display_order: 1,
      },
      {
        id: 'pkg-2',
        title: 'Gold Signature',
        slug: 'gold-signature',
        description: 'Our most sought-after multi-day wedding and pre-wedding complete heirloom suite.',
        price: '₹1,50,000',
        price_type: 'starting_at',
        currency: 'INR',
        duration: '2 Days (Complete Ceremonies)',
        photographers_count: 4,
        edited_photos_count: 550,
        albums_count: 2,
        video_included: true,
        pre_wedding_included: true,
        drone_included: true,
        features: [
          'Directed personally by Saikat',
          '4 Master Photographers & Cinematographers',
          'Pre-wedding sunset couple shoot included',
          'Aerial drone 4K coverage',
          '2 Bespoke flush-mount leather albums',
          'Same-day wedding preview reel for Instagram',
        ],
        badge: 'MOST POPULAR',
        is_popular: true,
        is_active: true,
        display_order: 2,
      },
      {
        id: 'pkg-3',
        title: 'Royal Heritage & Destination',
        slug: 'royal-heritage',
        description: 'Bespoke destination coverage crafted for grand palace celebrations and 3+ day festivities.',
        price: '₹2,80,000',
        price_type: 'starting_at',
        currency: 'INR',
        duration: '3+ Days (Unlimited Hours)',
        photographers_count: 6,
        edited_photos_count: 1000,
        albums_count: 3,
        video_included: true,
        pre_wedding_included: true,
        drone_included: true,
        features: [
          'Full Saikat Photography core team (6 specialists)',
          'Feature-length 4K documentary film (20-30 mins)',
          'Licensed drone & FPV cinematography',
          '3 Luxury handcrafted Italian albums & parent minis',
          'Next-morning social media teaser delivery',
          'Raw footage & archival master SSD drive',
        ],
        badge: 'ROYAL EXPERIENCE',
        is_popular: false,
        is_active: true,
        display_order: 3,
      },
    ];

    const luxuryTestimonials: Testimonial[] = [
      {
        id: 'test-1',
        client_name: 'Ananya & Debashish Sen',
        event_type: 'Destination Wedding at The Rajbari',
        rating: 5,
        review_text: 'Choosing Saikat was without doubt the finest decision of our entire wedding. He and his crew operated like invisible artists, capturing moments of raw tearful laughter and heritage elegance that bring tears to our eyes every time we open our album.',
        event_date: 'December 2025',
        is_published: true,
        display_order: 1,
      },
      {
        id: 'test-2',
        client_name: 'Priyanka & Rishabh Ghosh',
        event_type: 'Pre-Wedding & Royal Wedding',
        rating: 5,
        review_text: 'Saikat has an unbelievable eye for light and raw emotion. He made us feel so effortless during our pre-wedding shoot, and our wedding film feels like a Bollywood feature picture. Truly the master of his craft.',
        event_date: 'November 2025',
        is_published: true,
        display_order: 2,
      },
      {
        id: 'test-3',
        client_name: 'Sohini Mukherjee',
        event_type: 'Fine-Art Portrait & Fashion Editorial',
        rating: 5,
        review_text: 'Saikat is not just taking photos; he is sculpting light. The portraits he created for my classical dance showcase have been celebrated across magazines. An absolute genius.',
        event_date: 'January 2026',
        is_published: true,
        display_order: 3,
      },
    ];

    const sampleInquiries: Inquiry[] = [
      {
        id: 'inq-seed-1',
        name: 'Sayantan & Debopriya',
        email: 'sayantan.debopriya@gmail.com',
        phone: '+91 98301 22345',
        event_type: 'Bengali Destination Wedding',
        event_date: '2026-12-14',
        location: 'Vedic Village Spa Resort, Kolkata',
        budget: '₹1,50,000 - ₹2,00,000',
        message: 'Hello Saikat Da! We love your royal cinematic tone. We are planning a 2-day wedding with Sangeet and reception. Are you available for these dates?',
        status: 'new',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
      },
      {
        id: 'inq-seed-2',
        name: 'Arindam Banerjee',
        email: 'arindam.b@outlook.com',
        phone: '+91 98310 99887',
        event_type: 'Pre-Wedding Couple Shoot',
        event_date: '2026-11-05',
        location: 'Princep Ghat & Eco Park',
        budget: '₹40,000 - ₹60,000',
        message: 'Looking for a cinematic sunset pre-wedding video teaser and 30-40 frames.',
        status: 'contacted',
        created_at: new Date(Date.now() - 3600000 * 28).toISOString(),
      },
    ];

    const sampleBookings: StudioBooking[] = [
      {
        id: 'book-seed-1',
        client_name: 'Debopriya & Sayantan Wedding',
        event_type: 'Destination Wedding (2 Days)',
        date: '2026-12-14',
        status: 'confirmed',
        location: 'Vedic Village, Rajarhat, Kolkata',
        notes: 'Deposit received ₹50,000. 4-member crew assigned.',
        created_at: new Date().toISOString(),
      },
      {
        id: 'book-seed-2',
        client_name: 'Rohan & Sreeparna Pre-Wedding',
        event_type: 'Pre-Wedding Shoot',
        date: '2026-11-20',
        status: 'confirmed',
        location: 'Raichak on Ganges',
        notes: 'Sunset shoot + drone clearance secured.',
        created_at: new Date().toISOString(),
      },
    ];

    const sampleQuotations: StudioQuotation[] = [
      {
        id: 'quot-seed-1',
        quotation_number: 'SP-2026-042',
        client_name: 'Sayantan & Debopriya',
        client_email: 'sayantan.debopriya@gmail.com',
        client_phone: '+91 98301 22345',
        event_type: 'Bengali Royal Wedding (2 Days)',
        event_date: '2026-12-14',
        items: [
          { description: 'Gold Signature 2-Day Wedding Coverage (Saikat + 3 Crew)', amount: 150000 },
          { description: '4K Drone Aerial Cinematography Upgrade', amount: 15000 },
          { description: 'Luxury Handcrafted Italian Leather Album (40 Pages)', amount: 20000 },
        ],
        total_amount: 185000,
        currency: 'INR',
        notes: '50% advance to confirm date, 30% on wedding day, 20% on final album delivery.',
        status: 'sent',
        created_at: new Date().toISOString(),
      },
    ];

    const sampleClientGalleries: ClientGallery[] = [
      {
        id: 'cg-seed-1',
        client_name: 'Ananya & Debashish',
        event_title: 'The Royal Bawali Celebration',
        event_date: '2025-12-18',
        cover_image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85',
        access_pin: '4821',
        images_count: 145,
        is_active: true,
        download_allowed: true,
        external_album_url: '',
        created_at: new Date().toISOString(),
      },
    ];

    setStoredItem('gallery_images', luxuryImages);
    setStoredItem('services', luxuryServices);
    setStoredItem('packages', luxuryPackages);
    setStoredItem('testimonials', luxuryTestimonials);
    setStoredItem('inquiries', sampleInquiries);
    setStoredItem('studio_bookings', sampleBookings);
    setStoredItem('studio_quotations', sampleQuotations);
    setStoredItem('client_galleries', sampleClientGalleries);

    const curSettings = await DB.getSettings();
    if (curSettings) {
      await DB.updateSettings({
        ...curSettings,
        experience_years: 12,
        weddings_count: 420,
        happy_clients_count: 850,
        events_count: 650,
      });
    }

    notifyDataChanged();
  },

  // --- Clean All Data ---

  clearAllData: async (): Promise<void> => {
    const keysToWipe = [
      'gallery_images',
      'services',
      'packages',
      'sub_packages',
      'package_enquiries',
      'testimonials',
      'inquiries',
      'studio_bookings',
      'studio_quotations',
      'client_galleries',
      'media_library',
      'logs',
    ];
    keysToWipe.forEach((k) => {
      localStorage.removeItem(STORAGE_KEY_PREFIX + k);
    });
    localStorage.removeItem('saikat_studio_notes');
    setStoredItem('gallery_images', []);
    setStoredItem('services', []);
    setStoredItem('packages', []);
    setStoredItem('sub_packages', []);
    setStoredItem('package_enquiries', []);
    setStoredItem('testimonials', []);
    setStoredItem('inquiries', []);
    setStoredItem('studio_bookings', []);
    setStoredItem('studio_quotations', []);
    setStoredItem('client_galleries', []);
    setStoredItem('media_library', []);
    setStoredItem('logs', []);

    if (isSupabaseConfigured) {
      try {
        await Promise.allSettled([
          supabase.from('gallery_images').delete().neq('id', '___nonexistent___'),
          supabase.from('services').delete().neq('id', '___nonexistent___'),
          supabase.from('packages').delete().neq('id', '___nonexistent___'),
          supabase.from('sub_packages').delete().neq('id', '___nonexistent___'),
          supabase.from('package_enquiries').delete().neq('id', '___nonexistent___'),
          supabase.from('testimonials').delete().neq('id', '___nonexistent___'),
          supabase.from('inquiries').delete().neq('id', '___nonexistent___'),
          supabase.from('studio_bookings').delete().neq('id', '___nonexistent___'),
          supabase.from('studio_quotations').delete().neq('id', '___nonexistent___'),
          supabase.from('client_galleries').delete().neq('id', '___nonexistent___'),
        ]);
      } catch (err) {
        console.warn('Supabase clean data operation:', err);
      }
    }
    notifyDataChanged();
  },
};

// ==========================================
// 1-CLICK BI-DIRECTIONAL SUPABASE SYNC TOOLS
// ==========================================

export async function syncLocalDataToSupabase(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseActive()) {
    return { success: false, message: 'Supabase credentials are not configured yet.' };
  }

  try {
    const results: string[] = [];

    // 1. Settings
    const settings = await DB.getSettings();
    const { error: errSettings } = await supabase.from('site_settings').upsert(settings);
    if (!errSettings) results.push('Site Settings');

    // 2. Categories
    const categories = await DB.getCategories();
    if (categories.length > 0) {
      const { error: errCat } = await supabase.from('gallery_categories').upsert(categories);
      if (!errCat) results.push(`${categories.length} Categories`);
    }

    // 3. Images
    const images = await DB.getGalleryImages(false);
    if (images.length > 0) {
      const { error: errImg } = await supabase.from('gallery_images').upsert(images);
      if (!errImg) results.push(`${images.length} Photos`);
    }

    // 4. Services
    const services = await DB.getServices(false);
    if (services.length > 0) {
      const { error: errServ } = await supabase.from('services').upsert(services);
      if (!errServ) results.push(`${services.length} Services`);
    }

    // 5. Packages
    const packages = await DB.getPackages(false);
    if (packages.length > 0) {
      const { error: errPkg } = await supabase.from('packages').upsert(packages);
      if (!errPkg) results.push(`${packages.length} Packages`);
    }

    // 6. Testimonials
    const testimonials = await DB.getTestimonials(false);
    if (testimonials.length > 0) {
      const { error: errTest } = await supabase.from('testimonials').upsert(testimonials);
      if (!errTest) results.push(`${testimonials.length} Testimonials`);
    }

    // 7. FAQs
    const faqs = await DB.getFaqs(false);
    if (faqs.length > 0) {
      const { error: errFaq } = await supabase.from('faqs').upsert(faqs);
      if (!errFaq) results.push(`${faqs.length} FAQs`);
    }

    // 8. Bookings
    const bookings = await DB.getBookings();
    if (bookings.length > 0) {
      const { error: errBook } = await supabase.from('studio_bookings').upsert(bookings);
      if (!errBook) results.push(`${bookings.length} Shoots`);
    }

    // 9. Quotations
    const quotations = await DB.getQuotations();
    if (quotations.length > 0) {
      const { error: errQuot } = await supabase.from('studio_quotations').upsert(quotations);
      if (!errQuot) results.push(`${quotations.length} Quotes`);
    }

    // 10. Client Galleries
    const clientGalleries = await DB.getClientGalleries();
    if (clientGalleries.length > 0) {
      const { error: errCg } = await supabase.from('client_galleries').upsert(clientGalleries);
      if (!errCg) results.push(`${clientGalleries.length} Proofing Portals`);
    }

    // 11. Templates
    const templates = await DB.getTemplates();
    if (templates.length > 0) {
      const { error: errTmpl } = await supabase.from('notification_templates').upsert(templates);
      if (!errTmpl) results.push(`${templates.length} Templates`);
    }

    // 12. Analytics
    const analytics = await DB.getAnalyticsSettings();
    await supabase.from('analytics_settings').upsert({ id: 'analytics-settings-main', ...analytics });
    results.push('Analytics Config');

    return {
      success: true,
      message: `Successfully synced to cloud PostgreSQL database: ${results.join(', ')}.`,
    };
  } catch (err: any) {
    return { success: false, message: `Sync error: ${err.message}` };
  }
}

export async function pullCloudDataToLocal(): Promise<{ success: boolean; message: string }> {
  if (!isSupabaseActive()) {
    return { success: false, message: 'Supabase credentials are not configured yet.' };
  }

  try {
    const [
      { data: settings },
      { data: categories },
      { data: images },
      { data: services },
      { data: packages },
      { data: testimonials },
      { data: inquiries },
      { data: faqs },
      { data: bookings },
      { data: clientGalleries },
      { data: quotations },
      { data: templates },
      { data: analytics },
    ] = await Promise.all([
      supabase.from('site_settings').select('*').single(),
      supabase.from('gallery_categories').select('*').order('display_order'),
      supabase.from('gallery_images').select('*').order('display_order'),
      supabase.from('services').select('*').order('display_order'),
      supabase.from('packages').select('*').order('display_order'),
      supabase.from('testimonials').select('*').order('display_order'),
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('faqs').select('*').order('display_order'),
      supabase.from('studio_bookings').select('*'),
      supabase.from('client_galleries').select('*'),
      supabase.from('studio_quotations').select('*'),
      supabase.from('notification_templates').select('*'),
      supabase.from('analytics_settings').select('*').single(),
    ]);

    if (settings) setStoredItem('site_settings', settings);
    if (categories && categories.length > 0) setStoredItem('categories', categories);
    if (images && images.length > 0) setStoredItem('gallery_images', images);
    if (services && services.length > 0) setStoredItem('services', services);
    if (packages && packages.length > 0) setStoredItem('packages', packages);
    if (testimonials && testimonials.length > 0) setStoredItem('testimonials', testimonials);
    if (inquiries && inquiries.length > 0) setStoredItem('inquiries', inquiries);
    if (faqs && faqs.length > 0) setStoredItem('faqs', faqs);
    if (bookings && bookings.length > 0) setStoredItem('studio_bookings', bookings);
    if (clientGalleries && clientGalleries.length > 0) setStoredItem('client_galleries', clientGalleries);
    if (quotations && quotations.length > 0) setStoredItem('studio_quotations', quotations);
    if (templates && templates.length > 0) setStoredItem('notification_templates', templates);
    if (analytics) setStoredItem('analytics_settings', analytics);

    notifyDataChanged();
    return {
      success: true,
      message: 'Successfully refreshed local website data from your live Supabase cloud database!',
    };
  } catch (err: any) {
    return { success: false, message: `Pull error: ${err.message}` };
  }
}

// Automatic cleanup of legacy demo data in local storage
(() => {
  try {
    const CLEAN_KEY = 'saikat_demo_cleaned_v3';
    if (!localStorage.getItem(CLEAN_KEY)) {
      const keysToWipe = [
        'gallery_images',
        'services',
        'packages',
        'testimonials',
        'inquiries',
        'media_library',
      ];
      keysToWipe.forEach((k) => {
        localStorage.removeItem(STORAGE_KEY_PREFIX + k);
      });
      setStoredItem('gallery_images', []);
      setStoredItem('services', []);
      setStoredItem('packages', []);
      setStoredItem('testimonials', []);
      setStoredItem('inquiries', []);
      setStoredItem('media_library', []);
      localStorage.setItem(CLEAN_KEY, 'true');
    }
  } catch (e) {
    console.warn('Storage cleanup init error', e);
  }
})();

