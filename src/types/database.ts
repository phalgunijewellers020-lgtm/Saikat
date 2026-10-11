export type UserRole = 'super_admin' | 'admin' | 'editor';

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  site_title: string;
  photographer_name: string;
  tagline: string;
  bio_headline: string;
  bio_description: string;
  bio_secondary_text?: string;
  photographer_image: string;
  experience_years: number;
  weddings_count: number;
  happy_clients_count: number;
  events_count: number;
  logo_url: string;
  favicon_url: string;
  phone: string;
  whatsapp_number: string;
  email: string;
  address: string;
  city: string;
  working_hours: string;
  google_maps_url: string;
  instagram_url: string;
  instagram_handle?: string;
  facebook_url: string;
  youtube_url: string;
  hero_title: string;
  hero_subtitle: string;
  hero_image: string;
  hero_cta_text: string;
  hero_cta_link: string;
  hero_secondary_cta_text: string;
  hero_secondary_cta_link: string;
  hero_overlay_opacity: number;
  hero_alignment: 'left' | 'center' | 'right';
  announcement_enabled?: boolean;
  announcement_text?: string;
  announcement_link?: string;
  enable_watermark?: boolean;
  watermark_text?: string;
  enable_right_click_protection?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GoogleAnalyticsSettings {
  id?: string;
  ga4_measurement_id: string;
  gtm_container_id: string;
  meta_pixel_id: string;
  custom_head_code: string;
  custom_body_code: string;
  enable_ga: boolean;
  enable_pixel: boolean;
  track_whatsapp_clicks: boolean;
  track_inquiries: boolean;
}

export interface ClientGallery {
  id: string;
  client_name: string;
  event_title: string;
  event_date: string;
  cover_image: string;
  access_pin: string;
  images_count: number;
  is_active: boolean;
  download_allowed: boolean;
  external_album_url?: string;
  created_at: string;
}

export interface StudioBooking {
  id: string;
  client_name: string;
  event_type: string;
  date: string;
  status: 'confirmed' | 'tentative' | 'completed' | 'blocked';
  location: string;
  notes?: string;
  created_at?: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'delivery' | 'equipment';
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface QuotationItem {
  description: string;
  amount: number;
}

export interface StudioQuotation {
  id: string;
  quotation_number: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  event_type: string;
  event_date: string;
  items: QuotationItem[];
  total_amount: number;
  currency: string;
  notes?: string;
  status: 'draft' | 'sent' | 'accepted' | 'declined';
  created_at: string;
}

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  category_id: string;
  category_name?: string;
  image_url: string;
  thumbnail_url?: string;
  alt_text: string;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  camera_model?: string;
  lens_model?: string;
  aperture?: string;
  shutter_speed?: string;
  iso?: string;
  focal_length?: string;
  width?: number;
  height?: number;
  created_at?: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  image_url: string;
  starting_price: number | string;
  price_type: 'fixed' | 'starting_at' | 'contact';
  features: string[];
  cta_text: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
}

export interface Package {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number | string;
  price_type: 'fixed' | 'starting_at' | 'contact';
  currency: string;
  duration: string;
  photographers_count: number;
  edited_photos_count: number;
  albums_count: number;
  video_included: boolean;
  pre_wedding_included: boolean;
  drone_included: boolean;
  features: string[];
  badge?: string;
  is_popular: boolean;
  is_active: boolean;
  display_order: number;
  created_at?: string;
}

export interface MainPackage {
  id: string;
  name: string;
  slug: string;
  description: string;
  subtitle?: string;
  badge?: string;
  icon_name?: string;
  color_accent?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
}

export interface SubPackage {
  id: string;
  main_package_id: string;
  name: string;
  price: string;
  price_formatted?: string;
  description: string;
  features: string[];
  image_url?: string;
  badge?: string;
  duration?: string;
  photographers_count?: number;
  deliverables?: string;
  is_popular?: boolean;
  is_active: boolean;
  display_order: number;
  created_at?: string;
}

export type PackageEnquiryStatus = 'new' | 'contacted' | 'in_progress' | 'closed';

export interface PackageEnquiry {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  message: string;
  main_package_id: string;
  main_package_name: string;
  sub_package_id: string;
  sub_package_name: string;
  package_price: string;
  event_date?: string;
  location?: string;
  status: PackageEnquiryStatus;
  internal_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Testimonial {
  id: string;
  client_name: string;
  event_type: string;
  client_image?: string;
  rating: number;
  review_text: string;
  event_date?: string;
  is_published: boolean;
  display_order: number;
  created_at?: string;
}

export type InquiryStatus = 'new' | 'contacted' | 'follow_up' | 'booked' | 'closed';

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date?: string;
  location?: string;
  budget?: string;
  message: string;
  status: InquiryStatus;
  internal_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface HomepageSection {
  id: string;
  section_key: 'hero' | 'about' | 'gallery' | 'services' | 'packages' | 'testimonials' | 'cta' | 'contact';
  title: string;
  subtitle?: string;
  is_enabled: boolean;
  display_order: number;
}

export interface ThemeSettings {
  id?: string;
  primary_color: string;
  accent_red: string;
  background_color: string;
  text_color: string;
  button_radius: 'none' | 'sm' | 'md' | 'full';
  font_heading: 'cormorant' | 'syne' | 'sans';
  section_spacing: 'compact' | 'normal' | 'relaxed';
  enable_animations: boolean;
}

export interface SeoSettings {
  id?: string;
  meta_title: string;
  meta_description: string;
  keywords: string;
  canonical_url: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_card: string;
  robots: string;
}

export interface ActivityLog {
  id: string;
  admin_email: string;
  action: string;
  entity: string;
  details?: string;
  created_at: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size_bytes?: number;
  mime_type?: string;
  alt_text?: string;
  created_at: string;
}

export interface NotificationTemplate {
  id: string;
  name: string;
  category: 'inquiry' | 'booking' | 'reminder' | 'delivery' | 'review';
  channel: 'whatsapp' | 'email';
  subject?: string;
  body: string;
  variables: string[];
}
