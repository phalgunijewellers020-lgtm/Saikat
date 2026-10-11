import React, { useState, useEffect } from 'react';
import {
  Images,
  Mail,
  Briefcase,
  Layers,
  MessageSquare,
  Plus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Trash2,
  Calendar as CalendarIcon,
  DollarSign,
  TrendingUp,
  Activity,
  Share2,
  Globe,
  FileText,
  UserCheck,
  Check,
  Edit3,
} from 'lucide-react';
import {
  GalleryImage,
  Service,
  Package,
  Testimonial,
  Inquiry,
  StudioBooking,
} from '../../types/database';
import { AdminTab } from '../../components/admin/AdminLayout';
import { DB } from '../../lib/supabase';

interface AdminDashboardProps {
  images: GalleryImage[];
  services: Service[];
  packages: Package[];
  testimonials: Testimonial[];
  inquiries: Inquiry[];
  setActiveTab: (tab: AdminTab) => void;
  onOpenNewImage: () => void;
  onOpenNewService: () => void;
  onOpenNewPackage: () => void;
  onOpenNewTestimonial: () => void;
  onUpdateInquiryStatus: (id: string, status: Inquiry['status']) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  images,
  services,
  packages,
  testimonials,
  inquiries,
  setActiveTab,
  onOpenNewImage,
  onOpenNewService,
  onOpenNewPackage,
  onOpenNewTestimonial,
  onUpdateInquiryStatus,
}) => {
  const [bookings, setBookings] = useState<StudioBooking[]>([]);
  const [liveVisitors, setLiveVisitors] = useState(4);
  const [chartPeriod, setChartPeriod] = useState<'7d' | '30d'>('7d');
  const [studioNote, setStudioNote] = useState(() => {
    return localStorage.getItem('saikat_studio_notes') || '';
  });
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    DB.getBookings().then(setBookings);
  }, []);

  // Live visitors simulation pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1;
        return Math.max(2, Math.min(12, prev + delta));
      });
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSaveNote = () => {
    localStorage.setItem('saikat_studio_notes', studioNote);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2000);
  };

  const publishedImages = images.filter((i) => i.is_published).length;
  const draftImages = images.length - publishedImages;
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;
  const activePackages = packages.filter((p) => p.is_active).length;
  const activeServices = services.filter((s) => s.is_active).length;
  const confirmedShoots = bookings.filter((b) => b.status === 'confirmed').length;

  // Estimated pipeline calculation based on active packages or inquiries
  const estimatedPipeline = inquiries.length * 125000;

  const statusColors = {
    new: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
    contacted: 'bg-blue-950/60 text-blue-400 border-blue-500/30',
    follow_up: 'bg-amber-950/60 text-amber-400 border-amber-500/30',
    booked: 'bg-purple-950/60 text-purple-400 border-purple-500/30',
    closed: 'bg-neutral-800 text-neutral-400 border-neutral-700',
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome & Quick Actions Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-white">
              Studio Executive Dashboard
            </h1>
            <div className="flex items-center gap-1.5 bg-black/60 border border-white/10 px-2.5 py-1 rounded-full text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-neutral-300 font-mono text-[11px]">
                {liveVisitors} Live Visitors
              </span>
            </div>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Real-time control center for Saikat Photography web presence, bookings, and inquiries.
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenNewImage}
            className="bg-[#D91B24] hover:bg-[#b5141c] text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer shadow"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Photo</span>
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[#D91B24]" />
            <span>Shoots Calendar</span>
          </button>
          <button
            onClick={() => setActiveTab('invoicing')}
            className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          >
            <FileText className="w-3.5 h-3.5 text-neutral-300" />
            <span>Create Quote</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Analytics Hub</span>
          </button>
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Site</span>
          </a>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Inquiries */}
        <div
          onClick={() => setActiveTab('inquiries')}
          className="bg-[#0B0B0B] p-5 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
              Total Inquiries
            </span>
            <div className="p-2 rounded bg-white/5 text-[#D91B24]">
              <Mail className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display-modern font-bold text-white tabular-nums">
              {inquiries.length}
            </span>
            {newInquiries > 0 ? (
              <span className="text-xs text-emerald-400 font-medium">
                ({newInquiries} action needed)
              </span>
            ) : (
              <span className="text-xs text-neutral-500">All answered</span>
            )}
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Incoming booking inquiries from public site
          </p>
        </div>

        {/* Metric 2: Estimated Pipeline */}
        <div
          onClick={() => setActiveTab('invoicing')}
          className="bg-[#0B0B0B] p-5 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
              Pipeline Estimate
            </span>
            <div className="p-2 rounded bg-white/5 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-display-modern font-bold text-white tabular-nums">
              ₹{(estimatedPipeline / 100000).toFixed(1)}L
            </span>
            <span className="text-xs text-emerald-400 font-medium">+18% MoM</span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            Projected value of active weddings & shoots
          </p>
        </div>

        {/* Metric 3: Portfolio Photos */}
        <div
          onClick={() => setActiveTab('gallery')}
          className="bg-[#0B0B0B] p-5 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
              Portfolio Photos
            </span>
            <div className="p-2 rounded bg-white/5 text-[#D91B24]">
              <Images className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display-modern font-bold text-white tabular-nums">
              {images.length}
            </span>
            <span className="text-xs text-neutral-400">
              ({publishedImages} live)
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            {draftImages > 0 ? `${draftImages} in draft mode` : 'All published on live portfolio'}
          </p>
        </div>

        {/* Metric 4: Booked Shoots */}
        <div
          onClick={() => setActiveTab('calendar')}
          className="bg-[#0B0B0B] p-5 rounded-lg border border-white/10 hover:border-white/20 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
              Scheduled Shoots
            </span>
            <div className="p-2 rounded bg-white/5 text-purple-400">
              <CalendarIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-display-modern font-bold text-white tabular-nums">
              {bookings.length}
            </span>
            <span className="text-xs text-purple-400 font-medium">
              ({confirmedShoots} confirmed)
            </span>
          </div>
          <p className="text-[11px] text-neutral-500 mt-2">
            View shoot agenda & deadlines
          </p>
        </div>
      </div>

      {/* Visual Analytics & Funnel Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Traffic & Inquiries Trends */}
        <div className="lg:col-span-8 bg-[#0B0B0B] rounded-lg border border-white/10 p-5 sm:p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-base font-semibold text-white">Website Traffic & Engagement Curve</h2>
              <p className="text-xs text-neutral-400">Daily pageviews and portfolio impressions</p>
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded border border-white/10">
              <button
                onClick={() => setChartPeriod('7d')}
                className={`px-2.5 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                  chartPeriod === '7d' ? 'bg-[#D91B24] text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setChartPeriod('30d')}
                className={`px-2.5 py-0.5 text-xs rounded transition-colors cursor-pointer ${
                  chartPeriod === '30d' ? 'bg-[#D91B24] text-white font-semibold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                30 Days
              </button>
            </div>
          </div>

          {/* SVG Visual Area Chart */}
          <div className="h-44 w-full relative pt-4">
            <svg viewBox="0 0 600 140" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D91B24" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#D91B24" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <polygon
                fill="url(#curveGradient)"
                points="0,120 40,95 100,105 160,70 220,80 280,45 340,60 400,30 460,40 520,20 600,15 600,140 0,140"
              />

              {/* Line */}
              <polyline
                fill="none"
                stroke="#D91B24"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,120 40,95 100,105 160,70 220,80 280,45 340,60 400,30 460,40 520,20 600,15"
              />

              {/* Dots */}
              {[[40, 95], [160, 70], [280, 45], [400, 30], [520, 20], [600, 15]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="3.5" fill="#FFFFFF" stroke="#D91B24" strokeWidth="2" />
              ))}
            </svg>

            {/* Labels */}
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono pt-2">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun (Peak)</span>
            </div>
          </div>

          {/* Conversion Funnel */}
          <div className="pt-4 border-t border-white/5 space-y-2">
            <span className="text-xs font-semibold text-neutral-300 block">
              Inquiry Conversion Funnel
            </span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className="bg-white/[0.02] p-2 rounded border border-white/5">
                <span className="text-[10px] text-neutral-500 block">1. Site Visitors</span>
                <strong className="text-white font-mono">100%</strong>
              </div>
              <div className="bg-white/[0.02] p-2 rounded border border-white/5">
                <span className="text-[10px] text-neutral-500 block">2. Viewed Gallery</span>
                <strong className="text-neutral-300 font-mono">68%</strong>
              </div>
              <div className="bg-white/[0.02] p-2 rounded border border-white/5">
                <span className="text-[10px] text-neutral-500 block">3. Checked Pricing</span>
                <strong className="text-neutral-300 font-mono">34%</strong>
              </div>
              <div className="bg-white/[0.02] p-2 rounded border border-white/5">
                <span className="text-[10px] text-[#D91B24] block">4. Inquiry Sent</span>
                <strong className="text-[#D91B24] font-mono">5.2%</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Studio Scratchpad & Upcoming Shoots Agenda */}
        <div className="lg:col-span-4 space-y-6">
          {/* Upcoming Shoots Widget */}
          <div className="bg-[#0B0B0B] rounded-lg border border-white/10 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-[#D91B24]" />
                <span>Upcoming Shoots</span>
              </h3>
              <button
                onClick={() => setActiveTab('calendar')}
                className="text-xs text-[#D91B24] hover:underline"
              >
                All
              </button>
            </div>

            {bookings.length === 0 ? (
              <p className="text-xs text-neutral-500 py-3">No upcoming shoots scheduled.</p>
            ) : (
              <div className="space-y-2">
                {bookings.slice(0, 3).map((b) => (
                  <div key={b.id} className="p-2.5 rounded bg-white/[0.02] border border-white/5 text-xs">
                    <div className="flex justify-between items-center">
                      <strong className="text-white truncate pr-2">{b.client_name}</strong>
                      <span className="text-[10px] text-emerald-400 capitalize">{b.status}</span>
                    </div>
                    <div className="flex justify-between items-center text-neutral-400 text-[11px] mt-1">
                      <span>{b.event_type}</span>
                      <span className="font-mono text-neutral-300">{b.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Studio Quick Notes Scratchpad */}
          <div className="bg-[#0B0B0B] rounded-lg border border-white/10 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-[#D91B24]" />
                <span>Studio Scratchpad</span>
              </h3>
              {noteSaved && <span className="text-[10px] text-emerald-400">Saved!</span>}
            </div>

            <textarea
              rows={4}
              value={studioNote}
              onChange={(e) => setStudioNote(e.target.value)}
              placeholder="Quick reminders, assistant details, equipment checklist..."
              className="w-full bg-[#141414] border border-white/10 rounded p-2.5 text-xs text-neutral-300 focus:outline-none focus:border-[#D91B24] resize-none leading-relaxed"
            />

            <button
              onClick={handleSaveNote}
              className="w-full bg-white/5 hover:bg-white/10 text-white text-xs font-semibold py-1.5 rounded border border-white/10 transition-colors cursor-pointer"
            >
              Save Scratchpad Note
            </button>
          </div>
        </div>
      </div>

      {/* Recent Client Inquiries Table */}
      <div className="bg-[#0B0B0B] rounded-lg border border-white/10 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Client Inquiries</h2>
            <p className="text-xs text-neutral-400">Latest leads submitted through public website</p>
          </div>
          <button
            onClick={() => setActiveTab('inquiries')}
            className="text-xs text-[#D91B24] hover:underline font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({inquiries.length})</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {inquiries.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            No inquiries received yet. Submit a test inquiry on the public contact form!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/5 text-neutral-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 font-semibold">Client Name</th>
                  <th className="py-2.5 font-semibold">Celebration</th>
                  <th className="py-2.5 font-semibold">Event Date</th>
                  <th className="py-2.5 font-semibold">Status</th>
                  <th className="py-2.5 font-semibold text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {inquiries.slice(0, 5).map((inq) => (
                  <tr key={inq.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 font-medium text-white">
                      <div>{inq.name}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{inq.phone}</div>
                    </td>
                    <td className="py-3 text-neutral-300">{inq.event_type}</td>
                    <td className="py-3 text-neutral-400 font-mono text-[11px]">
                      {inq.event_date || 'TBD'}
                    </td>
                    <td className="py-3">
                      <select
                        value={inq.status}
                        onChange={(e) => onUpdateInquiryStatus(inq.id, e.target.value as any)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border bg-transparent cursor-pointer capitalize ${
                          statusColors[inq.status]
                        }`}
                      >
                        <option value="new" className="bg-[#141414] text-emerald-400">New</option>
                        <option value="contacted" className="bg-[#141414] text-blue-400">Contacted</option>
                        <option value="follow_up" className="bg-[#141414] text-amber-400">Follow Up</option>
                        <option value="booked" className="bg-[#141414] text-purple-400">Booked</option>
                        <option value="closed" className="bg-[#141414] text-neutral-400">Closed</option>
                      </select>
                    </td>
                    <td className="py-3 text-right">
                      {inq.phone && (
                        <a
                          href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                            `Hello ${inq.name}! Thank you for inquiring with Saikat Photography regarding your ${inq.event_type}. We would love to discuss your celebration in detail.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-500/30"
                        >
                          <Share2 className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
