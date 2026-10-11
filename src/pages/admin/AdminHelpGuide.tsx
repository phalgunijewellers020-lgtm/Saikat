import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Image as ImageIcon,
  Video,
  FileText,
  Shield,
  Sliders,
  Database,
  ArrowRight,
  FolderTree,
  Mail,
  Calendar,
  Layers,
  KeyRound,
  Globe,
  Sparkles,
  Smartphone,
  BarChart3,
  MessageSquare,
  HardDrive,
  Copy,
  Check,
  Printer,
  Info,
  Maximize2,
  Minimize2,
  Download,
  FileDown,
  X,
  Eye,
  FileCode,
} from 'lucide-react';
import { AdminTab } from '../../components/admin/AdminLayout';
import {
  generatePrintableHtml,
  generateMarkdownText,
  downloadFile,
  openCleanPrintWindow,
  printDocumentViaIframe,
} from '../../lib/guideExport';

interface AdminHelpGuideProps {
  onNavigate?: (tab: AdminTab) => void;
}

type GuideCategory =
  | 'all'
  | 'website'
  | 'modules'
  | 'images'
  | 'videos'
  | 'files'
  | 'roles'
  | 'settings'
  | 'troubleshooting'
  | 'best-practices';

interface GuideSection {
  id: string;
  category: GuideCategory;
  title: string;
  badge?: string;
  summary: string;
  keywords: string[];
  moduleTab?: AdminTab;
  content: React.ReactNode;
}

export const AdminHelpGuide: React.FC<AdminHelpGuideProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<GuideCategory>('all');
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'website-overview': true,
    'module-dashboard': true,
    'image-specs': true,
  });
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Print & Export Engine States
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isPaperMode, setIsPaperMode] = useState(false);
  const [printNotification, setPrintNotification] = useState<string | null>(null);
  const [copiedManual, setCopiedManual] = useState(false);

  const toggleSection = (id: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    guideSections.forEach((s) => {
      allExpanded[s.id] = true;
    });
    setExpandedSections(allExpanded);
  };

  const collapseAll = () => {
    setExpandedSections({});
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Define comprehensive guide sections
  const guideSections: GuideSection[] = useMemo(() => [
    // ----------------------------------------------------
    // 1. WEBSITE OVERVIEW & PUBLIC FRONTEND
    // ----------------------------------------------------
    {
      id: 'website-overview',
      category: 'website',
      title: 'Public Website Architecture & Features',
      badge: 'Frontend Structure',
      summary: 'Detailed explanation of every customer-facing page, section, interactive modal, and menu item.',
      keywords: ['website', 'public', 'frontend', 'sections', 'hero', 'about', 'gallery', 'services', 'packages', 'contact', 'whatsapp', 'client portal'],
      content: (
        <div className="space-y-6 text-sm text-neutral-300 leading-relaxed">
          <p>
            The public website for <strong>Saikat Photography</strong> is designed as a luxury single-page portfolio experience built for elite wedding couples, portrait clients, and commercial commissions. It combines cinematic aesthetics with conversion-focused lead generation tools.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#D91B24]" />
                1. Navigation Header & Branding
              </h4>
              <p className="text-xs text-neutral-400">
                A sticky, glassmorphic dark navbar that features the Saikat Photography brand monogram, quick navigation anchors (Portfolio, Services, Investment, About, Inquire), direct contact shortcuts, a "Book Session" call-to-action button, and a private "Client Portal" entry point.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D91B24]" />
                2. Hero Visual Section
              </h4>
              <p className="text-xs text-neutral-400">
                The visual first impression of the website. Supports high-resolution cinematic imagery or looping video banners, custom editorial typography, subtitle, primary booking button, secondary portfolio link, and adjustable background overlay darkness.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-[#D91B24]" />
                3. Portfolio & Filterable Gallery
              </h4>
              <p className="text-xs text-neutral-400">
                Displays curated photo collections divided into categories (e.g., Luxury Weddings, Pre-Wedding, Editorial, Destination). Visitors can filter categories dynamically. Clicking any photo launches a responsive full-screen Lightbox with camera metadata (aperture, shutter speed, ISO).
              </p>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#D91B24]" />
                4. Artist Biography & Milestone Counters
              </h4>
              <p className="text-xs text-neutral-400">
                Introduces Saikat Roy with an artist portrait, narrative bio, and animated live proof counters: Years of Experience, Weddings Captured, Happy Couples, and Exclusive Events.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#D91B24]" />
                5. Services & Curated Packages
              </h4>
              <p className="text-xs text-neutral-400">
                Features bespoke photography services and tiered investment packages. Each package displays duration, photographer team count, edited photos, custom heirloom albums, and drone/cinema inclusions. Clicking "Reserve Package" automatically pre-populates the booking form.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#D91B24]" />
                6. Testimonials & Studio FAQs
              </h4>
              <p className="text-xs text-neutral-400">
                Showcases genuine 5-star reviews from real couples with event details and client avatars. Accompanied by an interactive FAQ accordion answering booking timeline, delivery turnaround, and gear redundancy questions.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D91B24]" />
                7. Interactive Lead & Booking Form
              </h4>
              <p className="text-xs text-neutral-400">
                A seamless inquiry form capturing full name, email, phone number, event type, shoot date, venue location, budget range, and custom message. Automatically logs leads directly into the admin dashboard with instant Google Analytics conversion tracking.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <h4 className="text-white font-semibold flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#D91B24]" />
                8. Private Client Proofing Portal
              </h4>
              <p className="text-xs text-neutral-400">
                Couples can access their private, PIN-protected wedding album by entering their 4-digit code in the modal popup. Shows event details, delivery status, and direct high-resolution album download links.
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // ----------------------------------------------------
    // 2. ADMIN MODULES GUIDE (ALL 20 MODULES)
    // ----------------------------------------------------
    {
      id: 'module-dashboard',
      category: 'modules',
      title: 'Module 1: Executive Dashboard',
      badge: 'Admin Panel',
      moduleTab: 'dashboard',
      summary: 'Central overview of studio operations, incoming revenue inquiries, shoot metrics, and quick actions.',
      keywords: ['dashboard', 'metrics', 'stats', 'revenue', 'inquiries', 'overview'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            The <strong>Executive Dashboard</strong> is the central nerve center of your photography business. It aggregates metrics across your galleries, packages, inquiries, and customer interactions into real-time visual cards.
          </p>
          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10 space-y-3">
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider text-[#D91B24]">Key Features & Buttons:</h5>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-300">
              <li><strong>Quick Stat Cards:</strong> Live counts of Total Gallery Photos, Active Packages, 5-Star Testimonials, and Unread Inquiries with direct links to edit.</li>
              <li><strong>Incoming Leads Stream:</strong> Shows the newest client inquiries with status indicators (New, Contacted, Booked) and direct WhatsApp reply actions.</li>
              <li><strong>Quick Action Launchpad:</strong> One-click shortcuts to upload a new photo, add a pricing package, register a client testimonial, or check shoot schedules.</li>
              <li><strong>Revenue & Inquiry Conversion Funnel:</strong> Visual breakdown of inquiries turning into confirmed wedding bookings.</li>
            </ul>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('dashboard')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Executive Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-analytics',
      category: 'modules',
      title: 'Module 2: Google Analytics & Traffic Center',
      badge: 'Admin Panel',
      moduleTab: 'analytics',
      summary: 'Configure Google Analytics 4 (GA4), Meta Pixel, Google Tag Manager, and view real-time traffic telemetry.',
      keywords: ['analytics', 'google analytics', 'ga4', 'meta pixel', 'traffic', 'gtm', 'tracking', 'events'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Connect and configure advanced tracking tools to analyze visitor behavior, geographic locations, device types, and advertising conversions.
          </p>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-black/40 rounded border border-white/10">
              <span className="text-white font-semibold">GA4 Measurement ID (G-XXXXXXXXXX):</span>
              <p className="text-neutral-400 mt-1">Injects Google Analytics 4 tag into your site to track page views, sessions, bounce rate, and user geography.</p>
            </div>
            <div className="p-3 bg-black/40 rounded border border-white/10">
              <span className="text-white font-semibold">Meta Pixel ID (15-16 digit code):</span>
              <p className="text-neutral-400 mt-1">Tracks Facebook & Instagram ad conversions, retargeting website visitors with wedding campaigns.</p>
            </div>
            <div className="p-3 bg-black/40 rounded border border-white/10">
              <span className="text-white font-semibold">Automated Event Telemetry:</span>
              <p className="text-neutral-400 mt-1">Automatically tracks <code>click_whatsapp</code>, <code>submit_inquiry</code>, <code>open_client_portal</code>, and <code>view_package</code> without any manual coding.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('analytics')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Analytics Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-inquiries',
      category: 'modules',
      title: 'Module 3: Leads & Client Inquiries',
      badge: 'Admin Panel',
      moduleTab: 'inquiries',
      summary: 'Manage booking requests, filter by status, track event dates, log internal notes, and initiate 1-click WhatsApp chats.',
      keywords: ['inquiries', 'leads', 'messages', 'contacts', 'bookings', 'whatsapp'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Every submission through the website's booking form arrives here in real time. Never miss a luxury wedding opportunity.
          </p>
          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10 space-y-2 text-xs">
            <h5 className="text-white font-semibold uppercase tracking-wider text-[#D91B24]">Step-by-Step Inquiry Workflow:</h5>
            <ol className="list-decimal list-inside space-y-1 text-neutral-300">
              <li>Review client's event date, venue location, requested services, and estimated budget.</li>
              <li>Click <strong>Status Dropdown</strong> to change lead from <span className="text-blue-400 font-semibold">New</span> to <span className="text-yellow-400 font-semibold">Contacted</span> or <span className="text-emerald-400 font-semibold">Booked</span>.</li>
              <li>Click <strong>WhatsApp Icon</strong> to open an instant prefilled chat message to the couple's phone number.</li>
              <li>Add private <strong>Internal Notes</strong> (e.g. "Spoke with bride Anita on phone, prefers Sunset shoot").</li>
              <li>Export all inquiries as a clean CSV file for accounting or marketing email lists.</li>
            </ol>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('inquiries')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Inquiries Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-calendar',
      category: 'modules',
      title: 'Module 4: Shoots & Production Calendar',
      badge: 'Admin Panel',
      moduleTab: 'calendar',
      summary: 'Visual month calendar to schedule weddings, pre-shoots, editing deadlines, and block personal off-dates.',
      keywords: ['calendar', 'shoots', 'schedule', 'dates', 'production', 'bookings'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Keep your production team synchronized. Prevents accidental double-booking of popular wedding dates across peak seasons.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-emerald-400 font-semibold">Confirmed Shoots (Green):</span>
              <p className="text-neutral-400 mt-1">Booked contracts with advance deposits collected. Team and gear assigned.</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-amber-400 font-semibold">Tentative Inquiries (Yellow):</span>
              <p className="text-neutral-400 mt-1">Couples who requested the date and are pending quotation approval.</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-red-400 font-semibold">Blocked Dates (Red):</span>
              <p className="text-neutral-400 mt-1">Studio holidays, maintenance days, or travel days.</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-blue-400 font-semibold">Completed Shoots (Blue):</span>
              <p className="text-neutral-400 mt-1">Shoots concluded and currently in post-production retouching queue.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('calendar')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Shoots Calendar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-invoicing',
      category: 'modules',
      title: 'Module 5: Quotations & Estimates Generator',
      badge: 'Admin Panel',
      moduleTab: 'invoicing',
      summary: 'Generate elegant PDF estimates, custom package pricing, itemized line items, and track quotation acceptance.',
      keywords: ['quotations', 'invoices', 'estimates', 'pricing', 'bills', 'payments'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Create formal, branded estimates for couples requesting custom deliverables (e.g. Drone pilot + 2 Traditional videographers + 3 Luxury Canvera albums).
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-neutral-300">
            <li>Generate professional estimate numbers (e.g., <code>EST-2026-001</code>).</li>
            <li>Add multiple line items with specific descriptions and monetary amounts in INR (₹) or USD ($).</li>
            <li>Status tracking: <strong>Draft</strong>, <strong>Sent</strong>, <strong>Accepted</strong>, or <strong>Declined</strong>.</li>
            <li>1-click Print to PDF or direct WhatsApp share to the client's phone.</li>
          </ul>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('invoicing')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Quotations Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-client-galleries',
      category: 'modules',
      title: 'Module 6: Client Proofing & PIN Portals',
      badge: 'Admin Panel',
      moduleTab: 'client-galleries',
      summary: 'Create private password-protected online galleries for couples to review their proofs with custom 4-digit PIN codes.',
      keywords: ['client galleries', 'proofing', 'pin', 'albums', 'passwords', 'privacy', 'wedding photos'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Deliver private wedding collections securely. Clients access their photos by typing their secret PIN code into the website's Client Portal popup.
          </p>
          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10 space-y-2 text-xs">
            <h5 className="text-white font-semibold uppercase tracking-wider text-[#D91B24]">How to Create a New Client Gallery:</h5>
            <ol className="list-decimal list-inside space-y-1 text-neutral-300">
              <li>Click <strong>Create Client Gallery</strong>.</li>
              <li>Input Couple's Name (e.g., <em>Rohit & Sunita Wedding</em>), Event Date, and Total Photo Count.</li>
              <li>Assign a unique <strong>4-Digit Access PIN</strong> (e.g., <code>4821</code>).</li>
              <li>Paste the Cover Photo URL (or select from Media Library).</li>
              <li>Provide the full-resolution download drive link (Google Drive, Pixieset, or Dropbox).</li>
              <li>Toggle <strong>Allow Downloads</strong> and <strong>Is Active</strong>.</li>
            </ol>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('client-galleries')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Client Proofing Galleries</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-templates',
      category: 'modules',
      title: 'Module 7: WhatsApp & Communication Templates',
      badge: 'Admin Panel',
      moduleTab: 'templates',
      summary: 'Pre-written professional responses for inquiry follow-ups, date availability, payment reminders, and album delivery.',
      keywords: ['templates', 'whatsapp', 'messages', 'communication', 'email', 'responses'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Standardize your studio communication with fast 1-click messaging templates. Supports dynamic tokens such as <code>{'{client_name}'}</code>, <code>{'{event_date}'}</code>, and <code>{'{studio_name}'}</code>.
          </p>
          <div className="p-3 bg-black/40 border border-white/10 rounded text-xs">
            <p className="text-white font-semibold">Available Categories:</p>
            <p className="text-neutral-400 mt-1">Inquiry First Response, Date Confirmation, Advance Payment Request, Pre-Wedding Shoot Checklist, Final Album Delivery & Google Review Request.</p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('templates')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Message Templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-gallery',
      category: 'modules',
      title: 'Module 8: Gallery & Category Manager',
      badge: 'Admin Panel',
      moduleTab: 'gallery',
      summary: 'Upload portfolio photos, assign categories, reorder images, add camera EXIF metadata, and toggle featured items.',
      keywords: ['gallery', 'categories', 'photos', 'portfolio', 'exif', 'camera', 'featured', 'upload'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Manage the visual backbone of your portfolio. Add, edit, reorder, or feature high-impact photographs.
          </p>
          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10 space-y-2 text-xs">
            <h5 className="text-white font-semibold uppercase tracking-wider text-[#D91B24]">Pro Tips for Gallery Images:</h5>
            <ul className="list-disc list-inside space-y-1 text-neutral-300">
              <li><strong>Featured Toggle:</strong> Marks the image with a gold star to appear prominently on the homepage header or top of portfolio.</li>
              <li><strong>Category Assignment:</strong> Every image must belong to an active category (e.g. Weddings, Pre-Wedding, Maternity, Destination).</li>
              <li><strong>Display Order:</strong> Lower numbers (e.g. 1, 2, 3) display first. Use this to put your finest award-winning shots at the very top.</li>
              <li><strong>EXIF Camera Data:</strong> Enter camera model, lens, aperture, shutter speed, and ISO to impress photography enthusiasts and commercial art directors.</li>
            </ul>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('gallery')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Gallery Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-services',
      category: 'modules',
      title: 'Module 9: Services & Specializations',
      badge: 'Admin Panel',
      moduleTab: 'services',
      summary: 'Manage your photography service offerings, starting rates, bullet feature checklists, and call-to-actions.',
      keywords: ['services', 'offerings', 'weddings', 'pre-wedding', 'cinematography', 'pricing'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Define your distinct service offerings (e.g., Luxury Wedding Photography, Cinematic Film Production, Pre-Wedding Heirlooms, High-Fashion Editorial).
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300">
            <li><strong>Title & Slug:</strong> URL-friendly names (e.g. <code>wedding-photography</code>).</li>
            <li><strong>Price Type:</strong> Choose between Fixed Price, "Starting at ₹XX,XXX", or "Contact for Custom Quote".</li>
            <li><strong>Feature List:</strong> Bullet points highlighting what's included (e.g. "2 Candid Photographers", "Drone 4K aerial shots").</li>
            <li><strong>Active Toggle:</strong> Temporarily hide a seasonal service without deleting it.</li>
          </ul>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('services')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Services Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-package-enquiries',
      category: 'modules',
      title: 'Module 3B: Package Enquiries Management',
      badge: 'Admin Panel',
      moduleTab: 'package-enquiries',
      summary: 'Manage dedicated customer enquiries submitted directly for specific package tiers with locked-in pricing and deliverable selections.',
      keywords: ['package enquiries', 'package leads', 'tier bookings', 'silver package', 'gold package', 'diamond package', 'pricing', 'whatsapp'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            When website visitors browse your Investment catalog and click <strong>"Enquire Now"</strong> on any sub-package (e.g. Silver Basic at ₹5,000 or Gold Standard at ₹30,000), their enquiry is automatically linked with the selected main package, sub-package name, and locked-in price.
          </p>
          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10 space-y-2 text-xs">
            <h5 className="text-white font-semibold uppercase tracking-wider text-[#D91B24]">Package Enquiry Features:</h5>
            <ol className="list-decimal list-inside space-y-1 text-neutral-300">
              <li><strong>Automatic Package Linkage:</strong> Customer's selected tier (e.g., <em>Gold Package &rarr; Gold Standard (₹30,000)</em>) is permanently recorded with the submission date and time.</li>
              <li><strong>Lead Status Tracking:</strong> Update status seamlessly between <span className="text-emerald-400 font-semibold">New</span>, <span className="text-blue-400 font-semibold">Contacted</span>, <span className="text-amber-400 font-semibold">In Progress</span>, and <span className="text-purple-400 font-semibold">Closed / Booked</span>.</li>
              <li><strong>1-Click Instant Communication:</strong> Launch pre-filled WhatsApp messages, phone calls, or emails directly to the prospective couple.</li>
              <li><strong>Internal Staff Notes:</strong> Maintain phone consultation history, requested discounts, customized drone add-ons, or special instructions.</li>
              <li><strong>Filter & Search:</strong> Search by customer name, phone, email, package name, or filter by category (Silver, Gold, Diamond).</li>
            </ol>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('package-enquiries')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Package Enquiries Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-packages',
      category: 'modules',
      title: 'Module 10: Dynamic Package Management (Main & Sub-Packages)',
      badge: 'Admin Panel',
      moduleTab: 'packages',
      summary: 'Dynamic multi-tier package engine: manage main categories (Silver, Gold, Diamond) and unlimited sub-packages with custom pricing, features, and image assets.',
      keywords: ['packages', 'silver package', 'gold package', 'diamond package', 'sub-packages', 'pricing', 'tiers', 'deliverables', 'investment'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            The studio features a fully dynamic <strong>Package Management System</strong>. Instead of rigid hardcoded plans, administrators have full control over main package collections and unlimited sub-package tiers.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-black/40 border border-white/10 rounded-lg space-y-1.5">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D91B24]" />
                Main Package Categories
              </span>
              <p className="text-neutral-400">
                Default collections include <strong>Silver Package</strong>, <strong>Gold Package</strong>, and <strong>Diamond Package</strong>. Administrators can rename existing categories, adjust descriptions, assign badges (e.g. "Most Popular"), add new categories (e.g. Platinum, Pre-Wedding), reorder tabs, or deactivate.
              </p>
            </div>

            <div className="p-3.5 bg-black/40 border border-white/10 rounded-lg space-y-1.5">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Unlimited Sub-Package Tiers
              </span>
              <p className="text-neutral-400">
                <strong>No 3-tier limit!</strong> Create as many sub-packages as needed under each category (e.g. Silver Basic, Silver Standard, Silver Premium, Silver Elite). Set unique prices (e.g. ₹5,000, ₹10,000, ₹15,000, ₹50,000, ₹1,00,000), descriptions, and display orders.
              </p>
            </div>

            <div className="p-3.5 bg-black/40 border border-white/10 rounded-lg space-y-1.5">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Dynamic Deliverables Checklist
              </span>
              <p className="text-neutral-400">
                Add granular feature bullets (e.g. <em>2 Master Photographers, 4K Drone Aerial, 30-Page Handcrafted Leather Album, 60s Reel</em>). Includes convenient 1-click suggestion chips for rapid configuration.
              </p>
            </div>

            <div className="p-3.5 bg-black/40 border border-white/10 rounded-lg space-y-1.5">
              <span className="text-white font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                Customer "Enquire Now" Modal Flow
              </span>
              <p className="text-neutral-400">
                On the public website, customers browse categorized tabs (Silver, Gold, Diamond). Clicking "Enquire Now" opens a dedicated modal with the category, sub-package, and exact price pre-locked, saving directly into the database.
              </p>
            </div>
          </div>

          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10 space-y-2 text-xs">
            <h5 className="text-white font-semibold uppercase tracking-wider text-[#D91B24]">Recommended Image Specifications for Package Thumbnails:</h5>
            <ul className="list-disc list-inside space-y-1 text-neutral-300">
              <li><strong>Dimensions:</strong> 800 &times; 600 px (4:3 ratio) or 1200 &times; 800 px (3:2 ratio)</li>
              <li><strong>Maximum File Size:</strong> 600 KB (optimized for instant mobile loading)</li>
              <li><strong>Format:</strong> WebP or JPG at 85% compression quality</li>
              <li><strong>Subject:</strong> High-emotion wedding portrait or luxury album presentation</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('packages')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Package Management</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-testimonials',
      category: 'modules',
      title: 'Module 11: Testimonials & Client Reviews',
      badge: 'Admin Panel',
      moduleTab: 'testimonials',
      summary: 'Publish verified client reviews, star ratings, event titles, and couple avatar portraits.',
      keywords: ['testimonials', 'reviews', 'ratings', 'feedback', 'couples'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Social proof is the #1 deciding factor for luxury weddings. Manage real client reviews that appear in the public reviews carousel.
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300">
            <li><strong>Client Name & Event:</strong> (e.g., <em>Arjun & Priya – Grand Palace Wedding, Udaipur</em>).</li>
            <li><strong>Star Rating:</strong> 1 to 5 stars.</li>
            <li><strong>Avatar Photo:</strong> Square 1:1 image of the happy couple.</li>
            <li><strong>Published Switch:</strong> Control whether the review is live on the site.</li>
          </ul>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('testimonials')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Testimonials Module</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-faqs',
      category: 'modules',
      title: 'Module 12: Studio FAQs',
      badge: 'Admin Panel',
      moduleTab: 'faqs',
      summary: 'Manage frequently asked questions categorized by General, Booking, Delivery, and Equipment.',
      keywords: ['faqs', 'questions', 'answers', 'help', 'accordion'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Educate potential clients beforehand to address common objections regarding RAW files, booking advances, backup cameras, and travel logistics.
          </p>
          <div className="p-3 bg-black/40 border border-white/10 rounded text-xs space-y-1">
            <span className="text-white font-semibold">Available Categories:</span>
            <p className="text-neutral-400">General Questions, Booking & Advance Payments, Delivery & Turnaround Time, Equipment & Redundancy.</p>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('faqs')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Studio FAQs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-media',
      category: 'modules',
      title: 'Module 13: Media Library & Asset Storage',
      badge: 'Admin Panel',
      moduleTab: 'media',
      summary: 'Central repository of all uploaded photos, banners, logos, and graphics with 1-click CDN link copying.',
      keywords: ['media', 'library', 'assets', 'storage', 'upload', 'cdn', 'images'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            The media storage hub saves uploaded images directly into the Supabase Storage bucket <code>website-assets</code> (or resilient local offline storage).
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300">
            <li><strong>Drag-and-Drop Uploader:</strong> Upload multiple files simultaneously (JPG, PNG, WebP).</li>
            <li><strong>1-Click Copy URL:</strong> Instantly copy the asset's public CDN link to paste into site settings, services, or hero sections.</li>
            <li><strong>Image Preview & Metadata:</strong> Inspect file size in kilobytes and original dimensions.</li>
            <li><strong>Safe Delete:</strong> Remove obsolete assets to free up storage space.</li>
          </ul>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('media')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Media Library</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-site-settings',
      category: 'modules',
      title: 'Module 14: Site & Brand Settings',
      badge: 'Admin Panel',
      moduleTab: 'site-settings',
      summary: 'Configure master studio details: artist bio, phone, WhatsApp number, studio address, social links, and security options.',
      keywords: ['settings', 'brand', 'bio', 'phone', 'whatsapp', 'instagram', 'address', 'watermark', 'right-click'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Houses the core brand identity and contact information rendered across your website's header, footer, meta tags, and contact forms.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-white font-semibold">Contact & Social Channels:</span>
              <p className="text-neutral-400 mt-1">Official studio phone number, direct WhatsApp number with country code, Instagram profile URL, and Google Maps embed location.</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-white font-semibold">Artist Biography & Story:</span>
              <p className="text-neutral-400 mt-1">Main bio headline, detailed narrative, milestone counters (Years experience, weddings shot, happy clients).</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-white font-semibold">Right-Click & Image Protection:</span>
              <p className="text-neutral-400 mt-1">Toggle right-click disabling on all public portfolio photographs to deter unauthorized downloads.</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-white font-semibold">Announcement Top Bar:</span>
              <p className="text-neutral-400 mt-1">Publish a broadcast message banner across the top of the website (e.g., "Now accepting bookings for 2026/27").</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('site-settings')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Site Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-homepage-layout',
      category: 'modules',
      title: 'Module 15: Homepage Layout & Section Reordering',
      badge: 'Admin Panel',
      moduleTab: 'homepage-layout',
      summary: 'Enable, disable, and rearrange the display order of all homepage sections with live preview order.',
      keywords: ['layout', 'homepage', 'sections', 'reorder', 'enable', 'disable', 'order'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Control the visual flow of your homepage. Reorder sections or hide sections you aren't ready to show.
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300">
            <li><strong>Toggle Switch:</strong> Instantly enable or hide any section (e.g. hide Testimonials until you've collected enough reviews).</li>
            <li><strong>Display Order Input:</strong> Enter numbers 1, 2, 3, etc., to control vertical stacking sequence on the live homepage.</li>
            <li><strong>Supported Sections:</strong> Hero Banner, About/Bio, Portfolio Gallery, Services, Packages, Testimonials, Limited Commissions CTA, and Contact Form.</li>
          </ul>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('homepage-layout')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Homepage Layout</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-theme',
      category: 'modules',
      title: 'Module 16: Theme & Typography Settings',
      badge: 'Admin Panel',
      moduleTab: 'theme',
      summary: 'Fine-tune brand colors (Crimson Red #D91B24), typography styles (Cormorant Garamond, Syne), and button corner radius.',
      keywords: ['theme', 'colors', 'typography', 'fonts', 'design', 'accent'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Customize the aesthetic presentation without writing CSS code.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-white font-semibold">Accent & Brand Colors:</span>
              <p className="text-neutral-400 mt-1">Default is luxury Crimson Red (<code>#D91B24</code>). Can be changed to Champagne Gold, Emerald, or Royal Platinum.</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-white font-semibold">Heading Typography:</span>
              <p className="text-neutral-400 mt-1">Choose between Cormorant Garamond (Classical Luxury), Syne (Modern Avant-Garde), or Inter/Sans.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('theme')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Theme Settings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-backup',
      category: 'modules',
      title: 'Module 17: Data Backup & Reset Center',
      badge: 'Admin Panel',
      moduleTab: 'backup',
      summary: 'Download 1-click full JSON database backups, restore previous backups, or reset demo content.',
      keywords: ['backup', 'export', 'import', 'restore', 'json', 'data', 'security'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Safeguard your studio data against accidental deletion. Provides 1-click export and import of all 14 database collections.
          </p>
          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10 space-y-2 text-xs">
            <h5 className="text-white font-semibold uppercase tracking-wider text-[#D91B24]">Backup Best Practices:</h5>
            <ul className="list-disc list-inside space-y-1 text-neutral-300">
              <li>Click <strong>Export Full Backup (JSON)</strong> at the start of each month or before making major site layout edits.</li>
              <li>Store your backup file securely on an external drive or cloud storage.</li>
              <li>To restore, click <strong>Choose Backup File</strong> and select your verified JSON backup.</li>
            </ul>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('backup')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Backup & Reset</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-users',
      category: 'modules',
      title: 'Module 18: Admin Users & Staff Roles (RBAC)',
      badge: 'Admin Panel',
      moduleTab: 'users',
      summary: 'Manage administrator accounts, assign role permissions (Super Admin, Admin, Editor), and protect security.',
      keywords: ['users', 'roles', 'rbac', 'permissions', 'staff', 'super admin', 'editor', 'security'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Maintain role-based access control (RBAC) so junior assistants or retouchers have restricted access without risking site settings or database credentials.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-black/40 border border-red-500/30 rounded">
              <span className="text-red-400 font-semibold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> Super Admin
              </span>
              <p className="text-neutral-400 mt-1">Full control over database credentials, user accounts, system reset, backups, analytics, and all content.</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-white font-semibold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-neutral-400" /> Admin
              </span>
              <p className="text-neutral-400 mt-1">Can edit all content, portfolio, pricing, inquiries, quotations, client galleries. Cannot delete database.</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-neutral-300 font-semibold flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-neutral-500" /> Editor / Assistant
              </span>
              <p className="text-neutral-400 mt-1">Limited to uploading photos, updating calendar shoot notes, and viewing inquiries. No settings access.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('users')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Admin Users</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-logs',
      category: 'modules',
      title: 'Module 19: Security & Activity Logs',
      badge: 'Admin Panel',
      moduleTab: 'logs',
      summary: 'Audit log tracking every modification, login, image upload, package edit, or inquiry status change with timestamp.',
      keywords: ['logs', 'audit', 'activity', 'security', 'history', 'timestamps'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Every critical action inside the admin panel is automatically recorded with the responsible user's email, action name, affected module, and exact timestamp.
          </p>
          <ul className="list-disc list-inside space-y-1 text-xs text-neutral-300">
            <li>Search audit logs by admin email or keyword.</li>
            <li>Filter by module category (Access Control, Gallery, Packages, Settings, Inquiries).</li>
            <li>Export audit trail for studio records and compliance.</li>
          </ul>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('logs')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Activity Logs</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    {
      id: 'module-database',
      category: 'modules',
      title: 'Module 20: Database & Supabase Command Center',
      badge: 'Admin Panel',
      moduleTab: 'database',
      summary: 'Live PostgreSQL connection status, table health monitor for all 14 tables, 1-click cloud synchronization, and SQL runner.',
      keywords: ['database', 'supabase', 'sql', 'postgresql', 'sync', 'tables', 'connection', 'cloud'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            The engine ensuring your website data is saved to a persistent PostgreSQL cloud database hosted on Supabase, accessible from anywhere in the world 24/7.
          </p>
          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10 space-y-2 text-xs">
            <h5 className="text-white font-semibold uppercase tracking-wider text-[#D91B24]">Key Database Tools:</h5>
            <ul className="list-disc list-inside space-y-1 text-neutral-300">
              <li><strong>Live Connection Health Badge:</strong> Shows green <span className="text-emerald-400 font-semibold">Connected</span> or amber <span className="text-amber-400 font-semibold">Resilient Store</span>.</li>
              <li><strong>14 Table Health Check:</strong> Runs instantaneous queries across <code>site_settings</code>, <code>gallery_categories</code>, <code>gallery_images</code>, <code>services</code>, <code>packages</code>, <code>testimonials</code>, <code>inquiries</code>, <code>homepage_sections</code>, <code>theme_settings</code>, <code>media_library</code>, <code>activity_logs</code>, <code>admin_users</code>, <code>client_galleries</code>, <code>studio_bookings</code>, <code>studio_quotations</code>, <code>faqs</code>, and <code>analytics_settings</code>.</li>
              <li><strong>1-Click Local to Cloud Sync:</strong> Pushes all studio data created locally into your live Supabase cloud database with 1 button.</li>
              <li><strong>1-Click Cloud to Local Pull:</strong> Downloads all live cloud data to your local workstation.</li>
              <li><strong>Complete Schema SQL Viewer:</strong> 1-click copy of the PostgreSQL setup script to run in the Supabase SQL Editor.</li>
            </ul>
          </div>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigate?.('database')}
              className="px-3 py-1.5 bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold rounded flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Go to Database Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ),
    },

    // ----------------------------------------------------
    // 3. SECTION-SPECIFIC IMAGE UPLOAD GUIDELINES
    // ----------------------------------------------------
    {
      id: 'image-specs',
      category: 'images',
      title: 'Comprehensive Image Upload Specifications',
      badge: 'Section-Specific Guidelines',
      summary: 'Exact pixel dimensions, aspect ratios, file formats, maximum file size, and quality guidelines for every section.',
      keywords: ['image', 'dimensions', 'aspect ratio', 'file size', 'webp', 'jpg', 'hero', 'portrait', 'portfolio', 'avatar', 'logo', 'favicon'],
      content: (
        <div className="space-y-6 text-sm text-neutral-300">
          <p>
            To maintain lightning-fast website load speeds, pristine retina display sharpness, and high Google PageSpeed scores, follow the section-specific requirements outlined below:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-white/10 rounded-lg overflow-hidden">
              <thead className="bg-[#121212] text-white uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3">Section / Element</th>
                  <th className="p-3">Dimensions (px)</th>
                  <th className="p-3">Aspect Ratio</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Max Size</th>
                  <th className="p-3">Quality & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/40">
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Hero Banner (Desktop)</td>
                  <td className="p-3 font-mono text-neutral-300">2560 × 1440 px</td>
                  <td className="p-3">16:9 Widescreen</td>
                  <td className="p-3 text-emerald-400">WebP / JPG</td>
                  <td className="p-3 font-mono text-amber-400">1.5 MB</td>
                  <td className="p-3 text-neutral-400">High-impact cinematic landscape. Subject centered or slightly offset to right.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Hero Banner (Mobile)</td>
                  <td className="p-3 font-mono text-neutral-300">1080 × 1920 px</td>
                  <td className="p-3">9:16 Vertical</td>
                  <td className="p-3 text-emerald-400">WebP / JPG</td>
                  <td className="p-3 font-mono text-amber-400">800 KB</td>
                  <td className="p-3 text-neutral-400">Optimized for smartphones. High vertical framing.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Artist Biography Portrait</td>
                  <td className="p-3 font-mono text-neutral-300">1200 × 1600 px</td>
                  <td className="p-3">3:4 Vertical</td>
                  <td className="p-3 text-emerald-400">WebP / JPG</td>
                  <td className="p-3 font-mono text-amber-400">800 KB</td>
                  <td className="p-3 text-neutral-400">Editorial studio portrait of Saikat holding camera. Clean neutral background.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Portfolio Showcase (Landscape)</td>
                  <td className="p-3 font-mono text-neutral-300">2048 × 1365 px</td>
                  <td className="p-3">3:2 Classic</td>
                  <td className="p-3 text-emerald-400">WebP / JPG</td>
                  <td className="p-3 font-mono text-amber-400">1.2 MB</td>
                  <td className="p-3 text-neutral-400">sRGB color profile. Sharpened for web display (85% JPEG quality).</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Portfolio Showcase (Portrait)</td>
                  <td className="p-3 font-mono text-neutral-300">1365 × 2048 px</td>
                  <td className="p-3">2:3 Classic</td>
                  <td className="p-3 text-emerald-400">WebP / JPG</td>
                  <td className="p-3 font-mono text-amber-400">1.2 MB</td>
                  <td className="p-3 text-neutral-400">Retains rich shadow detail in wedding gowns and royal sherwanis.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Service Cover Cards</td>
                  <td className="p-3 font-mono text-neutral-300">1200 × 800 px</td>
                  <td className="p-3">3:2 Landscape</td>
                  <td className="p-3 text-emerald-400">WebP / JPG</td>
                  <td className="p-3 font-mono text-amber-400">600 KB</td>
                  <td className="p-3 text-neutral-400">Clean visual representing each service specialty.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Testimonial Client Avatars</td>
                  <td className="p-3 font-mono text-neutral-300">400 × 400 px</td>
                  <td className="p-3">1:1 Square</td>
                  <td className="p-3 text-emerald-400">WebP / JPG / PNG</td>
                  <td className="p-3 font-mono text-amber-400">250 KB</td>
                  <td className="p-3 text-neutral-400">Circular cropped in UI. Couple's faces clearly centered.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Client Proofing Cover Photo</td>
                  <td className="p-3 font-mono text-neutral-300">1920 × 1080 px</td>
                  <td className="p-3">16:9 Landscape</td>
                  <td className="p-3 text-emerald-400">WebP / JPG</td>
                  <td className="p-3 font-mono text-amber-400">1.0 MB</td>
                  <td className="p-3 text-neutral-400">Representative hero image of the specific wedding event.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Studio Brand Logo</td>
                  <td className="p-3 font-mono text-neutral-300">600 × 160 px</td>
                  <td className="p-3">Horizontal (approx. 4:1)</td>
                  <td className="p-3 text-blue-400">SVG / PNG (Alpha)</td>
                  <td className="p-3 font-mono text-amber-400">300 KB</td>
                  <td className="p-3 text-neutral-400">Transparent background. Crisp vector lines or high-density 2x PNG.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Website Favicon</td>
                  <td className="p-3 font-mono text-neutral-300">512 × 512 px</td>
                  <td className="p-3">1:1 Square</td>
                  <td className="p-3 text-blue-400">PNG / ICO</td>
                  <td className="p-3 font-mono text-amber-400">100 KB</td>
                  <td className="p-3 text-neutral-400">Simplified high-contrast monogram icon visible at 16×16px tab scale.</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Social Share Card (Open Graph)</td>
                  <td className="p-3 font-mono text-neutral-300">1200 × 630 px</td>
                  <td className="p-3">1.91:1 Landscape</td>
                  <td className="p-3 text-emerald-400">JPG / PNG</td>
                  <td className="p-3 font-mono text-amber-400">800 KB</td>
                  <td className="p-3 text-neutral-400">Displays on Facebook, WhatsApp, Twitter, and iMessage shared links.</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10 space-y-3">
            <h5 className="text-white font-semibold text-xs uppercase tracking-wider text-[#D91B24]">Important Image Optimization Rules:</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-neutral-300">
              <div className="p-3 bg-black/40 rounded border border-white/5">
                <span className="text-white font-semibold">1. Convert RAW to Web-Optimized sRGB:</span>
                <p className="text-neutral-400 mt-1">Never upload uncompressed 35MB RAW/TIFF camera files directly. Export from Lightroom or Photoshop using the <strong>sRGB IEC61966-2.1</strong> color space to prevent washed-out colors on iPhones and web browsers.</p>
              </div>
              <div className="p-3 bg-black/40 rounded border border-white/5">
                <span className="text-white font-semibold">2. WebP Preferred Format:</span>
                <p className="text-neutral-400 mt-1">Modern WebP compression offers 30% smaller file sizes compared to traditional JPEG with identical visual fidelity.</p>
              </div>
              <div className="p-3 bg-black/40 rounded border border-white/5">
                <span className="text-white font-semibold">3. Resolution vs. DPI:</span>
                <p className="text-neutral-400 mt-1">DPI (72 vs 300) does not affect web screen display; only total pixel dimensions (e.g. 2048px width) govern sharpness.</p>
              </div>
              <div className="p-3 bg-black/40 rounded border border-white/5">
                <span className="text-white font-semibold">4. Naming Convention:</span>
                <p className="text-neutral-400 mt-1">Use SEO-friendly lowercase filenames with hyphens (e.g., <code>udaipur-luxury-palace-wedding-01.jpg</code> rather than <code>IMG_8492.JPG</code>).</p>
              </div>
            </div>
          </div>
        </div>
      ),
    },

    // ----------------------------------------------------
    // 4. VIDEO UPLOAD GUIDELINES
    // ----------------------------------------------------
    {
      id: 'video-specs',
      category: 'videos',
      title: 'Video Upload & Streaming Guidelines',
      badge: 'Section-Specific Guidelines',
      summary: 'Aspect ratios, resolutions, codecs, duration caps, and autoplay policies for video banners and cinematic highlights.',
      keywords: ['video', 'mp4', 'h264', 'resolutions', 'hero video', 'reels', 'cinematic', 'duration', 'bitrate'],
      content: (
        <div className="space-y-6 text-sm text-neutral-300">
          <p>
            Adding cinematic video clips dramatically increases engagement. However, video requires strict bitrate and codec adherence to prevent buffering on mobile connections.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#D91B24]" />
                  A. Hero Background Video (Looping Banner)
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Background</span>
              </div>
              <ul className="space-y-1 text-xs text-neutral-300">
                <li><strong>Resolution:</strong> 1920 × 1080 (1080p Full HD). (4K is not recommended for background loops due to heavy mobile data usage).</li>
                <li><strong>Aspect Ratio:</strong> 16:9 Widescreen Landscape.</li>
                <li><strong>Format & Codec:</strong> MP4 container with H.264 (AVC) video stream.</li>
                <li><strong>Duration Limit:</strong> 10 to 30 seconds seamless loop.</li>
                <li><strong>Max File Size:</strong> <strong>15 MB – 25 MB maximum</strong>.</li>
                <li><strong>Target Bitrate:</strong> 2.5 Mbps to 3.5 Mbps.</li>
                <li><strong>Critical Audio Requirement:</strong> Must be <strong>Muted</strong> (no audio track or silent audio) to comply with Chrome, Safari, and iOS autoplay policies.</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-white font-semibold flex items-center gap-2">
                  <Video className="w-4 h-4 text-blue-400" />
                  B. Cinematic Wedding Highlights & Teaser Reels
                </h4>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">Client Films</span>
              </div>
              <ul className="space-y-1 text-xs text-neutral-300">
                <li><strong>Resolution:</strong> 1920 × 1080 (Landscape) or 1080 × 1920 (Vertical 9:16 Instagram Reels).</li>
                <li><strong>Format:</strong> MP4 (H.264 / AAC audio 320kbps).</li>
                <li><strong>Duration:</strong> 1 to 5 minutes for highlight trailers. Full 30-min wedding films should be hosted on Vimeo / YouTube and embedded via URL.</li>
                <li><strong>Max Direct File Size:</strong> 50 MB for short teaser clips.</li>
                <li><strong>Frame Rate:</strong> 24 fps (Cinematic standard) or 60 fps (Ultra-smooth slow motion).</li>
                <li><strong>Audio:</strong> Mastered stereo mix normalized to -14 LUFS.</li>
              </ul>
            </div>
          </div>

          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10 space-y-2 text-xs">
            <h5 className="text-white font-semibold uppercase tracking-wider text-[#D91B24]">How to Compress Videos with Free HandBrake Tool:</h5>
            <ol className="list-decimal list-inside space-y-1 text-neutral-300">
              <li>Download free <strong>HandBrake</strong> (handbrake.fr).</li>
              <li>Load your master exported video file from Premiere Pro or DaVinci Resolve.</li>
              <li>Select the preset: <strong>Web &gt; Fast 1080p30</strong>.</li>
              <li>Check the box for <strong>Web Optimized</strong> (moves MP4 moov atom to the beginning so streaming starts instantly).</li>
              <li>Set <strong>Constant Quality (RF)</strong> to <code>22</code> (visually lossless compression that cuts file size by up to 80%).</li>
              <li>Click <strong>Start Encode</strong> and upload the resulting file to the Media Library.</li>
            </ol>
          </div>
        </div>
      ),
    },

    // ----------------------------------------------------
    // 5. FILE & STORAGE MANAGEMENT
    // ----------------------------------------------------
    {
      id: 'file-management',
      category: 'files',
      title: 'File & Storage Management Guide',
      badge: 'Storage Architecture',
      summary: 'Supported file types, upload caps, storage buckets, replacing media assets, and CDN URL generation.',
      keywords: ['files', 'storage', 'supabase storage', 'bucket', 'upload limit', 'delete', 'replace', 'cdn'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            The media management architecture uses Supabase Object Storage with high-speed CDN delivery and resilient local offline fallbacks.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-white font-semibold">Supported File Types:</span>
              <p className="text-neutral-400 mt-1">Images: <code>.jpg</code>, <code>.jpeg</code>, <code>.png</code>, <code>.webp</code>, <code>.svg</code>, <code>.ico</code><br />Videos: <code>.mp4</code>, <code>.webm</code><br />Documents: <code>.pdf</code>, <code>.json</code></p>
            </div>
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-white font-semibold">Storage Bucket:</span>
              <p className="text-neutral-400 mt-1">Bucket name: <code>website-assets</code> (configured as Public bucket with unrestricted read access).</p>
            </div>
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <span className="text-white font-semibold">Upload Size Limit:</span>
              <p className="text-neutral-400 mt-1">Max 10 MB per individual image file in the browser uploader to ensure stable network transfers.</p>
            </div>
          </div>

          <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10 space-y-2 text-xs">
            <h5 className="text-white font-semibold uppercase tracking-wider text-[#D91B24]">Step-by-Step Media Management:</h5>
            <ol className="list-decimal list-inside space-y-1.5 text-neutral-300">
              <li><strong>Uploading:</strong> Navigate to <strong>Media Library</strong>, click <em>Upload Assets</em> or drag files onto the dropzone.</li>
              <li><strong>Retrieving URL:</strong> Click the <strong>Copy URL</strong> icon on any image card to copy the permanent CDN address.</li>
              <li><strong>Replacing an Image:</strong> To replace an image in a service or hero banner, copy the new asset's URL and paste it into the respective module's Image URL field.</li>
              <li><strong>Deleting:</strong> Click the trash icon on the media card. Confirm deletion. The asset is removed from the storage bucket.</li>
            </ol>
          </div>
        </div>
      ),
    },

    // ----------------------------------------------------
    // 6. ROLES & PERMISSIONS (RBAC)
    // ----------------------------------------------------
    {
      id: 'roles-security',
      category: 'roles',
      title: 'Permissions Matrix & Role-Based Access Control',
      badge: 'Security & Access',
      summary: 'Detailed privilege comparison between Super Admin, Admin, and Editor roles.',
      keywords: ['roles', 'permissions', 'super admin', 'admin', 'editor', 'security', 'rbac', 'staff access'],
      content: (
        <div className="space-y-6 text-sm text-neutral-300">
          <p>
            Role-Based Access Control (RBAC) enforces strict separation of duties to protect database integrity and confidential client financial data.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-white/10 rounded-lg overflow-hidden">
              <thead className="bg-[#121212] text-white uppercase text-[10px] tracking-wider border-b border-white/10">
                <tr>
                  <th className="p-3">Feature / Module Action</th>
                  <th className="p-3 text-red-400 text-center">Super Admin</th>
                  <th className="p-3 text-white text-center">Admin</th>
                  <th className="p-3 text-neutral-400 text-center">Editor / Staff</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 bg-black/40">
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Upload & Edit Gallery Photos</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">View & Manage Incoming Inquiries</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-blue-400">View Only</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Create Quotes & Invoices</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-neutral-500">✕ Denied</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Edit Services & Pricing Packages</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-neutral-500">✕ Denied</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Manage Client Proofing PIN Portals</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-blue-400">View Only</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Modify Site Brand & Theme Settings</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-neutral-500">✕ Denied</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Configure Google Analytics & Pixel IDs</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-neutral-500">✕ Denied</td>
                  <td className="p-3 text-center text-neutral-500">✕ Denied</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Manage Admin Users & Grant Privileges</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-neutral-500">✕ Denied</td>
                  <td className="p-3 text-center text-neutral-500">✕ Denied</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Connect / Disconnect Supabase Database</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-neutral-500">✕ Denied</td>
                  <td className="p-3 text-center text-neutral-500">✕ Denied</td>
                </tr>
                <tr className="hover:bg-white/5">
                  <td className="p-3 font-semibold text-white">Trigger Database Reset / Delete Records</td>
                  <td className="p-3 text-center text-emerald-400 font-bold">✓ Full</td>
                  <td className="p-3 text-center text-neutral-500">✕ Denied</td>
                  <td className="p-3 text-center text-neutral-500">✕ Denied</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-lg bg-black/40 border border-white/10 space-y-2 text-xs">
            <h5 className="text-white font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D91B24]" />
              Staff Security Best Practices:
            </h5>
            <ul className="list-disc list-inside space-y-1 text-neutral-400">
              <li>Never share a single administrator login across multiple staff members.</li>
              <li>Assign junior retouchers and interns the <strong>Editor</strong> role.</li>
              <li>Always click <strong>Logout</strong> before leaving shared studio computers or editing bays.</li>
            </ul>
          </div>
        </div>
      ),
    },

    // ----------------------------------------------------
    // 7. SETTINGS & CONFIGURATIONS REFERENCE
    // ----------------------------------------------------
    {
      id: 'settings-reference',
      category: 'settings',
      title: 'Settings & Configuration Options Reference',
      badge: 'Configuration Manual',
      summary: 'Complete glossary of every setting toggle, input field, and its real-world effect on the website.',
      keywords: ['settings', 'configuration', 'watermark', 'right click', 'announcement', 'analytics', 'meta tags', 'ga4'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Reference table documenting what each setting controls and when to adjust it:
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Enable Right-Click Protection</span>
                <span className="text-neutral-400">Site Settings</span>
              </div>
              <p className="text-neutral-400 mt-1">
                <strong>What it controls:</strong> Disables browser context menu (right-click) and image dragging on all public portfolio photographs.<br />
                <strong>When to use:</strong> Recommended ON at all times to prevent casual theft of your high-resolution wedding captures.
              </p>
            </div>

            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Announcement Top Bar</span>
                <span className="text-neutral-400">Site Settings</span>
              </div>
              <p className="text-neutral-400 mt-1">
                <strong>What it controls:</strong> Displays a high-visibility crimson broadcast banner along the very top of every webpage.<br />
                <strong>When to use:</strong> Use during peak booking windows (e.g., <em>"Now accepting 2026/27 Winter Wedding Commissions – Inquire for available dates"</em>).
              </p>
            </div>

            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Hero Background Overlay Opacity (0.0 to 1.0)</span>
                <span className="text-neutral-400">Site Settings</span>
              </div>
              <p className="text-neutral-400 mt-1">
                <strong>What it controls:</strong> Regulates the darkness of the black gradient layer placed over your hero banner image/video.<br />
                <strong>When to use:</strong> If your hero photograph is bright (e.g. sunny beach wedding), increase overlay to <code>0.6</code> or <code>0.7</code> to ensure the white text remains legible.
              </p>
            </div>

            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">WhatsApp Number Format</span>
                <span className="text-neutral-400">Site Settings</span>
              </div>
              <p className="text-neutral-400 mt-1">
                <strong>What it controls:</strong> Powers the floating WhatsApp chat concierge and inquiry direct-reply shortcuts.<br />
                <strong>Format:</strong> Must include country code with no plus sign, spaces, or dashes (e.g., <code>919876543210</code> for India or <code>15551234567</code> for USA).
              </p>
            </div>

            <div className="p-3 bg-black/40 border border-white/10 rounded">
              <div className="flex items-center justify-between">
                <span className="text-white font-semibold">Google Analytics 4 Measurement ID</span>
                <span className="text-neutral-400">Analytics Settings</span>
              </div>
              <p className="text-neutral-400 mt-1">
                <strong>What it controls:</strong> Live visitor tracking, acquisition sources, device breakdowns, and conversion telemetry.<br />
                <strong>Format:</strong> Starts with <code>G-</code> followed by 10 alphanumeric characters (e.g., <code>G-XXXXXXXXXX</code>).
              </p>
            </div>
          </div>
        </div>
      ),
    },

    // ----------------------------------------------------
    // 8. TROUBLESHOOTING & SOLUTIONS
    // ----------------------------------------------------
    {
      id: 'troubleshooting-guide',
      category: 'troubleshooting',
      title: 'Troubleshooting Guide & Common Errors',
      badge: 'Diagnostics & Fixes',
      summary: 'Step-by-step solutions for database disconnections, broken images, WhatsApp links, PIN portal issues, and analytics.',
      keywords: ['troubleshooting', 'errors', 'fix', 'supabase disconnected', 'broken image', 'whatsapp error', 'pin error', 'analytics not working'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Encountering an issue? Refer to the diagnosis steps and verified solutions below:
          </p>

          <div className="space-y-3">
            <details className="group bg-black/40 border border-white/10 rounded-lg p-3 open:border-[#D91B24]/40">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Issue 1: "Supabase status displays 'Resilient Store' instead of 'Connected'"
                </span>
                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-neutral-400" />
              </summary>
              <div className="mt-2.5 pt-2 border-t border-white/5 text-xs text-neutral-300 space-y-1.5">
                <p><strong>Cause:</strong> Your Supabase Project URL or Public Anon Key has not been entered in the Database module, or the entered credentials have a typo.</p>
                <p><strong>Solution:</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400">
                  <li>Navigate to <strong>Database & SQL</strong> in the admin panel.</li>
                  <li>Log into your Supabase Dashboard at <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" className="text-[#D91B24] underline">supabase.com</a>.</li>
                  <li>Copy your <strong>Project URL</strong> (e.g., <code>https://xyzcompany.supabase.co</code>) and <strong>anon public key</strong>.</li>
                  <li>Paste both into the credentials inputs and click <strong>Save & Connect Supabase</strong>.</li>
                  <li>Click <strong>Test All 14 Tables Now</strong> to verify connectivity. The indicator will turn green immediately.</li>
                </ol>
              </div>
            </details>

            <details className="group bg-black/40 border border-white/10 rounded-lg p-3 open:border-[#D91B24]/40">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Issue 2: "An uploaded photo appears as a broken image icon"
                </span>
                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-neutral-400" />
              </summary>
              <div className="mt-2.5 pt-2 border-t border-white/5 text-xs text-neutral-300 space-y-1.5">
                <p><strong>Cause:</strong> The image URL points to a private drive link (such as an unshared Google Drive link or temporary local file path), or the file has spaces in its name.</p>
                <p><strong>Solution:</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400">
                  <li>Upload the photo directly via the <strong>Media Library</strong> module.</li>
                  <li>Copy the resulting public CDN URL.</li>
                  <li>Paste that verified URL into the image field.</li>
                </ol>
              </div>
            </details>

            <details className="group bg-black/40 border border-white/10 rounded-lg p-3 open:border-[#D91B24]/40">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Issue 3: "Client says their PIN code is rejected on the proofing portal"
                </span>
                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-neutral-400" />
              </summary>
              <div className="mt-2.5 pt-2 border-t border-white/5 text-xs text-neutral-300 space-y-1.5">
                <p><strong>Cause:</strong> Either the client gallery is toggled to <em>Inactive</em>, or the client is entering spaces around their 4-digit code.</p>
                <p><strong>Solution:</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400">
                  <li>Go to <strong>Client Proofing & PINs</strong> module.</li>
                  <li>Locate the couple's gallery card and confirm the <strong>Is Active</strong> switch is enabled.</li>
                  <li>Verify the exact 4-digit PIN in the admin view and resend it to the client via WhatsApp.</li>
                </ol>
              </div>
            </details>

            <details className="group bg-black/40 border border-white/10 rounded-lg p-3 open:border-[#D91B24]/40">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Issue 4: "Google Analytics is not recording live sessions"
                </span>
                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-neutral-400" />
              </summary>
              <div className="mt-2.5 pt-2 border-t border-white/5 text-xs text-neutral-300 space-y-1.5">
                <p><strong>Cause:</strong> The Measurement ID was entered with leading spaces, or an ad blocker is enabled in your testing browser.</p>
                <p><strong>Solution:</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400">
                  <li>Verify in <strong>Google Analytics & Traffic</strong> that the ID follows format <code>G-XXXXXXXXXX</code> and <strong>Enable GA4 Tracking</strong> is toggled ON.</li>
                  <li>Open the website in an incognito window without ad blockers enabled.</li>
                  <li>Check the <strong>Realtime</strong> dashboard in Google Analytics to see your live session.</li>
                </ol>
              </div>
            </details>

            <details className="group bg-black/40 border border-white/10 rounded-lg p-3 open:border-[#D91B24]/40">
              <summary className="font-semibold text-white cursor-pointer flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                  Issue 5: "Website edits in Admin are not visible immediately on live site"
                </span>
                <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180 text-neutral-400" />
              </summary>
              <div className="mt-2.5 pt-2 border-t border-white/5 text-xs text-neutral-300 space-y-1.5">
                <p><strong>Cause:</strong> Your browser has cached an older version of the page, or the edit wasn't saved.</p>
                <p><strong>Solution:</strong></p>
                <ol className="list-decimal list-inside space-y-1 text-neutral-400">
                  <li>Confirm you clicked the <strong>Save Changes</strong> button and saw the green confirmation notification.</li>
                  <li>Perform a hard refresh on the public page by pressing <code>Ctrl + F5</code> (Windows) or <code>Cmd + Shift + R</code> (Mac).</li>
                </ol>
              </div>
            </details>
          </div>
        </div>
      ),
    },

    // ----------------------------------------------------
    // 9. BEST PRACTICES & PRECAUTIONS
    // ----------------------------------------------------
    {
      id: 'best-practices',
      category: 'best-practices',
      title: 'Operational Best Practices & Precautions',
      badge: 'Studio Standards',
      summary: 'Recommended workflows, data hygiene rules, SEO maintenance, and mistakes administrators must avoid.',
      keywords: ['best practices', 'dos and donts', 'precautions', 'workflows', 'security', 'seo', 'hygiene'],
      content: (
        <div className="space-y-4 text-sm text-neutral-300">
          <p>
            Proven workflows to keep your studio website performing at the highest tier of the luxury photography market:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/20 space-y-2">
              <h4 className="text-emerald-400 font-semibold flex items-center gap-2 text-xs uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Recommended Best Practices (DO):
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                <li>✓ <strong>Curate Quality Over Quantity:</strong> Show 15-25 breathtaking, award-winning images per category rather than dumping 300 average shots. Luxury clients evaluate you by your weakest photo.</li>
                <li>✓ <strong>Compress All Images:</strong> Always run photos through JPEGmini, Lightroom Web Export, or TinyPNG before uploading.</li>
                <li>✓ <strong>Respond Within 2 Hours:</strong> Use the WhatsApp templates to acknowledge inquiries swiftly while couple interest is highest.</li>
                <li>✓ <strong>Export Weekly Backups:</strong> Download a full JSON backup every Sunday evening via the Backup module.</li>
                <li>✓ <strong>Fill In Alt Text:</strong> Provide descriptive alt tags on photos (e.g. <em>"Bengali wedding bridal portrait Kolkata"</em>) to rank high on Google Images.</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg bg-red-950/20 border border-red-500/20 space-y-2">
              <h4 className="text-red-400 font-semibold flex items-center gap-2 text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-red-400" />
                Things Administrators Must Avoid (DON'T):
              </h4>
              <ul className="space-y-1.5 text-xs text-neutral-300">
                <li>✕ <strong>Never Upload Uncompressed RAW/TIFFs:</strong> A single 40MB file can exhaust a mobile visitor's cellular data and cause them to bounce.</li>
                <li>✕ <strong>Never Delete Database Tables in Supabase:</strong> Only run verified ALTER or CREATE statements from the Database setup script.</li>
                <li>✕ <strong>Never Share Super Admin Passwords:</strong> Keep master credentials restricted to the studio principal.</li>
                <li>✕ <strong>Avoid Generic Filenames:</strong> Never upload files named <code>screenshot.png</code> or <code>DSC01928.JPG</code>.</li>
                <li>✕ <strong>Don't Leave Test Leads in Active Status:</strong> Regularly close or delete internal test submissions so inquiry conversion analytics remain accurate.</li>
              </ul>
            </div>
          </div>
        </div>
      ),
    },
  ], [onNavigate]);

  // Filter sections based on category and search query
  const filteredSections = useMemo(() => {
    return guideSections.filter((section) => {
      // Category match
      const categoryMatch = selectedCategory === 'all' || section.category === selectedCategory;
      if (!categoryMatch) return false;

      // Search match
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const inTitle = section.title.toLowerCase().includes(q);
      const inSummary = section.summary.toLowerCase().includes(q);
      const inKeywords = section.keywords.some((k) => k.toLowerCase().includes(q));

      return inTitle || inSummary || inKeywords;
    });
  }, [guideSections, selectedCategory, searchQuery]);

  const categoriesList: { id: GuideCategory; label: string; count: number }[] = [
    { id: 'all', label: 'All Topics', count: guideSections.length },
    { id: 'website', label: 'Website Guide', count: guideSections.filter((s) => s.category === 'website').length },
    { id: 'modules', label: 'Admin Modules (1-20)', count: guideSections.filter((s) => s.category === 'modules').length },
    { id: 'images', label: 'Image Guidelines', count: guideSections.filter((s) => s.category === 'images').length },
    { id: 'videos', label: 'Video Guidelines', count: guideSections.filter((s) => s.category === 'videos').length },
    { id: 'files', label: 'File Management', count: guideSections.filter((s) => s.category === 'files').length },
    { id: 'roles', label: 'Roles & Security', count: guideSections.filter((s) => s.category === 'roles').length },
    { id: 'settings', label: 'Settings Reference', count: guideSections.filter((s) => s.category === 'settings').length },
    { id: 'troubleshooting', label: 'Troubleshooting & Fixes', count: guideSections.filter((s) => s.category === 'troubleshooting').length },
    { id: 'best-practices', label: 'Best Practices', count: guideSections.filter((s) => s.category === 'best-practices').length },
  ];

  // Direct print handler with automatic section expansion and iframe protection
  const handleDirectPrint = async () => {
    // 1. Expand all sections first so on-screen view is also complete
    expandAll();
    setPrintNotification('Preparing complete 20-module studio handbook for printing...');

    try {
      const html = generatePrintableHtml();
      const printed = await printDocumentViaIframe(html);
      if (printed) {
        setPrintNotification('Print dialog launched successfully! Select your printer or "Save as PDF".');
        setTimeout(() => setPrintNotification(null), 4000);
      } else {
        handleDownloadHtml();
        setPrintNotification('Direct print blocked by browser sandbox: automatically downloaded complete offline manual (.html) for you!');
      }
    } catch (err) {
      console.warn('Direct print error:', err);
      handleDownloadHtml();
    }
  };

  const handleDownloadHtml = () => {
    const html = generatePrintableHtml();
    const filename = `Saikat-Photography-Admin-Handbook-${new Date().toISOString().slice(0, 10)}.html`;
    downloadFile(html, filename, 'text/html;charset=utf-8');
    setPrintNotification('Downloaded complete offline handbook (.html)!');
    setTimeout(() => setPrintNotification(null), 3500);
  };

  const handleOpenCleanTab = () => {
    const html = generatePrintableHtml();
    const success = openCleanPrintWindow(html);
    if (!success) {
      handleDownloadHtml();
    } else {
      setPrintNotification('Opened print-ready document in clean new tab!');
      setTimeout(() => setPrintNotification(null), 3000);
    }
  };

  const handleCopyManualMarkdown = () => {
    const md = generateMarkdownText();
    navigator.clipboard.writeText(md);
    setCopiedManual(true);
    setPrintNotification('Copied complete manual in Markdown to clipboard!');
    setTimeout(() => {
      setCopiedManual(false);
      setPrintNotification(null);
    }, 3000);
  };

  return (
    <div className={`space-y-8 max-w-7xl mx-auto pb-16 transition-colors duration-200 ${
      isPaperMode ? 'bg-[#fcfcfc] text-neutral-900 p-6 sm:p-8 rounded-2xl shadow-2xl border border-neutral-300' : ''
    }`}>
      {/* Toast Notification Banner */}
      {printNotification && (
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-950/80 to-[#121212] border border-[#D91B24]/40 text-white text-xs flex items-center justify-between shadow-xl animate-fade-in no-print">
          <div className="flex items-center gap-2.5">
            <Info className="w-4 h-4 text-[#D91B24] shrink-0" />
            <span>{printNotification}</span>
          </div>
          <button
            onClick={() => setPrintNotification(null)}
            className="p-1 text-neutral-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className={`relative overflow-hidden rounded-2xl border p-6 sm:p-8 no-print ${
        isPaperMode
          ? 'bg-neutral-100 border-neutral-300 text-neutral-900'
          : 'bg-gradient-to-r from-red-950/40 via-neutral-900/80 to-[#0B0B0B] border-white/10 text-white'
      }`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D91B24]/20 border border-[#D91B24]/30 text-[#D91B24] text-[11px] font-semibold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Studio Master Operating Handbook</span>
            </div>
            <h1 className={`text-2xl sm:text-4xl font-serif-display font-medium tracking-tight ${
              isPaperMode ? 'text-black' : 'text-white'
            }`}>
              Information & Help Guide
            </h1>
            <p className={`text-xs sm:text-sm max-w-2xl font-light leading-relaxed ${
              isPaperMode ? 'text-neutral-700' : 'text-neutral-300'
            }`}>
              Complete user manual and technical documentation for Saikat Photography administrators and staff. Explains every website feature, all 20 admin modules, upload specifications, role security, and step-by-step troubleshooting.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {/* Paper Reading Mode Toggle */}
            <button
              onClick={() => setIsPaperMode(!isPaperMode)}
              className={`px-3 py-1.5 rounded text-xs font-medium border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isPaperMode
                  ? 'bg-amber-500 text-black border-amber-400 font-semibold shadow'
                  : 'bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border-white/10'
              }`}
              title="Toggle black-on-white Paper Reading Mode"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{isPaperMode ? 'Dark Theme' : 'Paper Mode'}</span>
            </button>

            {/* Expand / Collapse All */}
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Expand all sections"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand All</span>
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Collapse all sections"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Collapse All</span>
            </button>

            {/* 1-Click Offline Download */}
            <button
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 text-xs font-medium border border-emerald-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Download standalone offline HTML manual"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download HTML</span>
            </button>

            {/* Main Print / Save PDF Trigger */}
            <button
              onClick={handleDirectPrint}
              className="px-3.5 py-1.5 rounded bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold shadow-lg hover:shadow-[0_0_15px_rgba(217,27,36,0.5)] transition-all flex items-center gap-1.5 cursor-pointer"
              title="Print documentation or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            {/* Export Center Trigger */}
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Open Export Center with PDF, HTML, and Markdown options"
            >
              <FileDown className="w-3.5 h-3.5 text-neutral-400" />
              <span className="hidden lg:inline">Export Options</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-4">
        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documentation (e.g. image dimensions, hero video, PIN portal, Supabase, GA4, permissions)..."
            className="w-full bg-[#0B0B0B] border border-white/10 rounded-xl pl-11 pr-10 py-3.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#D91B24] transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-white px-1.5 py-0.5 rounded bg-white/10"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categoriesList.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-[#D91B24] text-white border-[#D91B24] shadow-md font-semibold'
                    : 'bg-[#0B0B0B] text-neutral-400 hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-neutral-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Summary Highlights Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#0B0B0B] border border-white/10 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Total Modules</span>
          <p className="text-lg font-serif-display font-medium text-white">20 Modules Documented</p>
          <span className="text-[11px] text-emerald-400">100% Complete</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0B0B0B] border border-white/10 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Hero Media</span>
          <p className="text-lg font-serif-display font-medium text-white">2560 × 1440 px</p>
          <span className="text-[11px] text-neutral-400">16:9 Widescreen (1.5MB)</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0B0B0B] border border-white/10 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Looping Video</span>
          <p className="text-lg font-serif-display font-medium text-white">1080p Full HD</p>
          <span className="text-[11px] text-neutral-400">H.264 MP4 (Muted)</span>
        </div>
        <div className="p-3.5 rounded-xl bg-[#0B0B0B] border border-white/10 space-y-1">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold">Access Level</span>
          <p className="text-lg font-serif-display font-medium text-white">Admin-Only</p>
          <span className="text-[11px] text-[#D91B24]">Hidden from Public</span>
        </div>
      </div>

      {/* Main Content Sections List */}
      <div className="space-y-4">
        {filteredSections.length === 0 ? (
          <div className="text-center py-16 bg-[#0B0B0B] rounded-2xl border border-white/10 space-y-3">
            <HelpCircle className="w-10 h-10 text-neutral-500 mx-auto" />
            <h3 className="text-base font-medium text-white">No Matching Guide Topics Found</h3>
            <p className="text-xs text-neutral-400 max-w-md mx-auto">
              We couldn't find any guide articles matching "{searchQuery}". Try searching for terms like "image", "hero", "package", "pin", or "supabase".
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-4 py-2 bg-[#D91B24] text-white text-xs font-semibold rounded hover:bg-[#b5141c] transition-colors"
            >
              Reset Search & Filters
            </button>
          </div>
        ) : (
          filteredSections.map((section) => {
            const isExpanded = Boolean(expandedSections[section.id]);
            return (
              <div
                key={section.id}
                id={section.id}
                className={`rounded-xl border overflow-hidden transition-all duration-200 ${
                  isPaperMode
                    ? 'bg-white border-neutral-300 text-neutral-900 shadow-sm'
                    : 'bg-[#0B0B0B] border-white/10 text-white'
                }`}
              >
                {/* Section Header Button */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full p-4 sm:p-5 flex items-start sm:items-center justify-between text-left transition-colors cursor-pointer gap-4 ${
                    isPaperMode ? 'hover:bg-neutral-100/70' : 'hover:bg-white/5'
                  }`}
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-base sm:text-lg font-serif-display font-medium ${
                        isPaperMode ? 'text-black font-semibold' : 'text-white'
                      }`}>
                        {section.title}
                      </span>
                      {section.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${
                          isPaperMode
                            ? 'bg-neutral-100 text-neutral-700 border-neutral-300'
                            : 'bg-white/10 text-neutral-300 border-white/10'
                        }`}>
                          {section.badge}
                        </span>
                      )}
                      {section.moduleTab && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D91B24]/20 text-[#D91B24] font-semibold border border-[#D91B24]/30">
                          Interactive Module
                        </span>
                      )}
                    </div>
                    <p className={`text-xs line-clamp-1 ${isPaperMode ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      {section.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-1 sm:pt-0">
                    <span className={`text-xs hidden sm:inline ${isPaperMode ? 'text-neutral-500' : 'text-neutral-500'}`}>
                      {isExpanded ? 'Collapse' : 'Expand'}
                    </span>
                    <div className={`p-1.5 rounded-full transition-transform duration-200 ${
                      isPaperMode
                        ? isExpanded ? 'rotate-180 bg-neutral-200 text-neutral-800' : 'bg-neutral-100 text-neutral-600'
                        : isExpanded ? 'rotate-180 text-white bg-white/10' : 'bg-white/5 text-neutral-400'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Section Body */}
                {isExpanded && (
                  <div className={`p-4 sm:p-6 pt-0 border-t space-y-4 ${
                    isPaperMode
                      ? 'border-neutral-200 bg-neutral-50 text-neutral-900'
                      : 'border-white/5 bg-[#080808]/50 text-neutral-300'
                  }`}>
                    {section.content}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Quick Help & Support Footer Notice */}
      <div className="p-6 rounded-2xl bg-[#0B0B0B] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-[#D91B24]" />
            Administrator Confidentiality Notice
          </h4>
          <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
            This Information & Help Guide is strictly confidential and reserved for authorized Saikat Photography staff and studio management. It is dynamically restricted to the admin portal and never rendered on the public website.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3.5 py-2 rounded bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors"
          >
            Back to Top ↑
          </button>
        </div>
      </div>

      {/* Print & Export Center Modal */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0e0e0e] border border-white/15 rounded-2xl max-w-xl w-full p-6 space-y-6 shadow-2xl relative text-left">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#D91B24]/15 border border-[#D91B24]/30 text-[#D91B24]">
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-serif-display font-medium text-white">
                    Print & Export Studio Handbook
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Multiple reliable export methods designed for offline archiving, printing, and sharing.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification alert if direct print had an issue */}
            {printNotification && (
              <div className="p-3 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{printNotification}</span>
              </div>
            )}

            {/* Export Options Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Option 1: Direct Browser Print */}
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 hover:border-[#D91B24]/50 transition-all space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs">
                    <Printer className="w-4 h-4 text-[#D91B24]" />
                    <span>Direct Browser Print</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Expands all 20 modules and launches your browser's native print / Save to PDF dialog.
                  </p>
                </div>
                <button
                  onClick={handleDirectPrint}
                  className="w-full mt-2 py-2 px-3 rounded bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Launch Print Dialog</span>
                </button>
              </div>

              {/* Option 2: Download Standalone HTML */}
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 hover:border-emerald-500/50 transition-all space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs">
                    <Download className="w-4 h-4 text-emerald-400" />
                    <span>Download Offline HTML</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    1-click self-contained manual with embedded CSS. Opens in any browser without iframe restrictions.
                  </p>
                </div>
                <button
                  onClick={handleDownloadHtml}
                  className="w-full mt-2 py-2 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .html Manual</span>
                </button>
              </div>

              {/* Option 3: Open in Clean Tab */}
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 hover:border-blue-500/50 transition-all space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs">
                    <ExternalLink className="w-4 h-4 text-blue-400" />
                    <span>Open in Clean Tab</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Opens a standalone print-ready page in a fresh browser tab with a dedicated print button.
                  </p>
                </div>
                <button
                  onClick={handleOpenCleanTab}
                  className="w-full mt-2 py-2 px-3 rounded bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Clean Tab</span>
                </button>
              </div>

              {/* Option 4: Copy Full Markdown Text */}
              <div className="p-4 rounded-xl bg-black/50 border border-white/10 hover:border-amber-500/50 transition-all space-y-2 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-white font-semibold text-xs">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    <span>Copy Full Markdown</span>
                  </div>
                  <p className="text-[11px] text-neutral-400 leading-relaxed">
                    Copies complete structured text ready to paste into Google Docs, Word, or Notion.
                  </p>
                </div>
                <button
                  onClick={handleCopyManualMarkdown}
                  className="w-full mt-2 py-2 px-3 rounded bg-white/10 hover:bg-white/15 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {copiedManual ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-bold">Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy All Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* In-app paper view toggle hint */}
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-center justify-between text-xs text-neutral-300">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-amber-400" />
                <span>Paper Reading Mode (High-Contrast White Paper)</span>
              </span>
              <button
                onClick={() => {
                  setIsPaperMode(!isPaperMode);
                  setIsPrintModalOpen(false);
                }}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-medium text-[11px] transition-colors"
              >
                {isPaperMode ? 'Switch to Dark Mode' : 'Enable Paper View'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHelpGuide;
