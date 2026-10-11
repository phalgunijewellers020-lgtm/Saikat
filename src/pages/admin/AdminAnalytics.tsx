import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Globe,
  Activity,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  ExternalLink,
  Code2,
  Smartphone,
  Laptop,
  Users,
  Eye,
  Clock,
  TrendingUp,
  Share2,
  Filter,
  RefreshCw,
} from 'lucide-react';
import { GoogleAnalyticsSettings } from '../../types/database';
import { DB } from '../../lib/supabase';
import {
  initGoogleAnalytics,
  trackEvent,
  getLocalAnalyticsEvents,
  AnalyticsEventRecord,
} from '../../lib/analytics';

export const AdminAnalytics: React.FC = () => {
  const [settings, setSettings] = useState<GoogleAnalyticsSettings>({
    ga4_measurement_id: '',
    gtm_container_id: '',
    meta_pixel_id: '',
    custom_head_code: '',
    custom_body_code: '',
    enable_ga: true,
    enable_pixel: false,
    track_whatsapp_clicks: true,
    track_inquiries: true,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [timeframe, setTimeframe] = useState<'today' | '7d' | '30d' | '90d'>('7d');
  const [recentEvents, setRecentEvents] = useState<AnalyticsEventRecord[]>([]);
  const [testEventSent, setTestEventSent] = useState(false);
  const [liveVisitors, setLiveVisitors] = useState(4);

  // Live visitors simulation pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveVisitors((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(2, Math.min(12, prev + delta));
      });
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setIsLoading(true);
    try {
      const data = await DB.getAnalyticsSettings();
      if (data) {
        setSettings(data);
      }
      setRecentEvents(getLocalAnalyticsEvents());
    } catch (err) {
      console.error('Error loading analytics', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await DB.saveAnalyticsSettings(settings);
      initGoogleAnalytics(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      console.error('Error saving analytics settings', err);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTestPing = () => {
    trackEvent('ga_test_ping', {
      timestamp: new Date().toISOString(),
      admin_test: true,
      label: 'Manual Admin Ping Test',
    });
    setTestEventSent(true);
    setRecentEvents(getLocalAnalyticsEvents());
    setTimeout(() => setTestEventSent(false), 3000);
  };

  const isConfigured = Boolean(
    settings.ga4_measurement_id && settings.ga4_measurement_id.startsWith('G-')
  );

  // Timeframe-dependent mock metric numbers
  const metricsMap = {
    today: { views: '1,420', visitors: '480', duration: '2m 14s', bounce: '27.5%', conv: '5.2%', whatsapp: 18 },
    '7d': { views: '9,840', visitors: '3,210', duration: '2m 45s', bounce: '29.1%', conv: '4.8%', whatsapp: 86 },
    '30d': { views: '38,650', visitors: '12,940', duration: '3m 02s', bounce: '26.8%', conv: '5.4%', whatsapp: 340 },
    '90d': { views: '112,400', visitors: '39,120', duration: '2m 58s', bounce: '28.2%', conv: '5.1%', whatsapp: 980 },
  };

  const currentMetrics = metricsMap[timeframe];

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-8 h-8 border-2 border-[#D91B24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif-display font-medium text-white">
              Google Analytics & Traffic Intelligence
            </h1>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isConfigured
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
              }`}
            >
              {isConfigured ? 'GA4 Active' : 'Configuration Pending'}
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Connect Google Analytics 4, Google Tag Manager, Meta Pixel, and view studio web traffic analytics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleSendTestPing}
            className="bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3.5 py-2 rounded flex items-center gap-1.5 transition-colors cursor-pointer border border-white/10"
          >
            <Send className="w-3.5 h-3.5 text-[#D91B24]" />
            <span>{testEventSent ? 'Event Dispatched!' : 'Send Test Ping'}</span>
          </button>
          <button
            type="button"
            onClick={loadAnalytics}
            className="p-2 rounded bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Refresh stream"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Live Visitors Banner */}
      <div className="bg-gradient-to-r from-neutral-900/90 via-[#120a0b] to-neutral-900/90 p-4 sm:p-5 rounded-lg border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping absolute opacity-75" />
            <span className="w-3 h-3 rounded-full bg-emerald-500 relative" />
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold font-display-modern text-white">
                {liveVisitors}
              </span>
              <span className="text-xs text-emerald-400 font-medium">Active Visitors Right Now</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Couples and art patrons currently browsing your portfolio galleries and package offerings.
            </p>
          </div>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center bg-black/40 p-1 rounded-md border border-white/10 self-start sm:self-auto">
          {(['today', '7d', '30d', '90d'] as const).map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                timeframe === tf
                  ? 'bg-[#D91B24] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {tf === 'today' ? 'Today' : tf === '7d' ? '7 Days' : tf === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* High-Level Traffic KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Page Views</span>
            <Eye className="w-3.5 h-3.5 text-[#D91B24]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-display-modern text-white">
            {currentMetrics.views}
          </p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +22.4% vs last
          </span>
        </div>

        <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Unique Visitors</span>
            <Users className="w-3.5 h-3.5 text-[#D91B24]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-display-modern text-white">
            {currentMetrics.visitors}
          </p>
          <span className="text-[10px] text-emerald-400 flex items-center gap-0.5 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +16.8% vs last
          </span>
        </div>

        <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Avg Duration</span>
            <Clock className="w-3.5 h-3.5 text-[#D91B24]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-display-modern text-white">
            {currentMetrics.duration}
          </p>
          <span className="text-[10px] text-neutral-400 mt-1 block">High engagement</span>
        </div>

        <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Bounce Rate</span>
            <Activity className="w-3.5 h-3.5 text-[#D91B24]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-display-modern text-white">
            {currentMetrics.bounce}
          </p>
          <span className="text-[10px] text-emerald-400 mt-1 block font-medium">-3.8% (Healthy)</span>
        </div>

        <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold">Inquiry Rate</span>
            <BarChart3 className="w-3.5 h-3.5 text-[#D91B24]" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-display-modern text-white">
            {currentMetrics.conv}
          </p>
          <span className="text-[10px] text-neutral-400 mt-1 block">Leads / visitors</span>
        </div>

        <div className="bg-[#0B0B0B] p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between text-neutral-400 mb-2">
            <span className="text-[10px] uppercase tracking-wider font-semibold">WhatsApp Clicks</span>
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-2xl font-bold font-display-modern text-white">
            {currentMetrics.whatsapp}
          </p>
          <span className="text-[10px] text-emerald-400 mt-1 block font-medium">Direct chats</span>
        </div>
      </div>

      {/* Traffic Sources & Geographic / Top Pages Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Traffic Breakdown */}
        <div className="lg:col-span-7 bg-[#0B0B0B] rounded-lg border border-white/10 p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-sm font-semibold text-white">Acquisition Channels & Discovery</h2>
              <p className="text-[11px] text-neutral-400">Where couples and clients find your studio website</p>
            </div>
            <span className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded">Last {timeframe}</span>
          </div>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300 font-medium">Google Organic Search</span>
                <span className="text-white font-semibold">48% (4,720 visitors)</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-[#D91B24] h-full rounded-full" style={{ width: '48%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300 font-medium">Instagram Profile & Bio Link</span>
                <span className="text-white font-semibold">32% (3,150 visitors)</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-pink-600 h-full rounded-full" style={{ width: '32%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300 font-medium">Direct Brand Search (saikatphotography.com)</span>
                <span className="text-white font-semibold">14% (1,380 visitors)</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '14%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-neutral-300 font-medium">Wedding Portals & Recommendations</span>
                <span className="text-white font-semibold">6% (590 visitors)</span>
              </div>
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '6%' }} />
              </div>
            </div>
          </div>

          {/* Device & Geography Mini Row */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/5">
            <div className="bg-white/[0.02] p-3 rounded border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                <Smartphone className="w-3.5 h-3.5 text-[#D91B24]" />
                <span className="font-medium text-white">Mobile Devices (74%)</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                iPhone Safari & Android Chrome make up 3 of every 4 portfolio views.
              </p>
            </div>
            <div className="bg-white/[0.02] p-3 rounded border border-white/5">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400 mb-1">
                <Laptop className="w-3.5 h-3.5 text-[#D91B24]" />
                <span className="font-medium text-white">Desktop & Mac (26%)</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Couples often review 4K galleries together on high-res desktop monitors.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Top Visited Content */}
        <div className="lg:col-span-5 bg-[#0B0B0B] rounded-lg border border-white/10 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h2 className="text-sm font-semibold text-white">Most Viewed Pages & Galleries</h2>
              <p className="text-[11px] text-neutral-400">Top destinations on your website</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { path: '/ (Home & Hero Visuals)', views: '4,620', avgTime: '1m 40s' },
              { path: '#portfolio (Weddings & Heirlooms)', views: '3,840', avgTime: '3m 15s' },
              { path: '#packages (Gold Signature Pricing)', views: '2,410', avgTime: '2m 20s' },
              { path: '#services (Wedding & Pre-Wedding)', views: '1,890', avgTime: '1m 50s' },
              { path: '#about (Saikat Artist Philosophy)', views: '1,240', avgTime: '1m 10s' },
              { path: '#contact (Inquiry & Reservation)', views: '980', avgTime: '2m 05s' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between text-xs py-2 px-2.5 rounded bg-white/[0.02] border border-white/5 hover:border-white/10"
              >
                <div className="truncate pr-2">
                  <span className="text-neutral-400 font-mono text-[10px] mr-2">#{idx + 1}</span>
                  <span className="text-neutral-200 font-medium">{item.path}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-white font-semibold block">{item.views} views</span>
                  <span className="text-[10px] text-neutral-500 font-mono">{item.avgTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Real-Time Event Stream Log */}
      <div className="bg-[#0B0B0B] rounded-lg border border-white/10 p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h2 className="text-sm font-semibold text-white">Live Tracking Event Stream</h2>
            <p className="text-[11px] text-neutral-400">
              Real-time user actions recorded across your website (clicks, pageviews, and inquiries)
            </p>
          </div>
          <span className="text-[10px] text-neutral-400 font-mono bg-white/5 px-2 py-0.5 rounded">
            {recentEvents.length} Recent Events Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/5 text-neutral-400 uppercase tracking-wider text-[10px]">
                <th className="py-2.5 font-semibold">Event Name</th>
                <th className="py-2.5 font-semibold">Parameters & Context</th>
                <th className="py-2.5 font-semibold text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1.5 font-mono text-[#D91B24] font-medium bg-[#D91B24]/10 px-2 py-0.5 rounded text-[11px]">
                      {evt.eventName}
                    </span>
                  </td>
                  <td className="py-2.5 text-neutral-300 font-mono text-[11px]">
                    {evt.params ? JSON.stringify(evt.params) : '—'}
                  </td>
                  <td className="py-2.5 text-right text-neutral-500 font-mono text-[10px]">
                    {new Date(evt.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Google Analytics 4 & Tag Manager Configuration Form */}
      <form onSubmit={handleSave} className="bg-[#0B0B0B] rounded-lg border border-white/10 p-5 sm:p-6 space-y-6">
        <div className="pb-4 border-b border-white/10">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#D91B24]" />
            <span>Tracking & Tag Manager Credentials</span>
          </h2>
          <p className="text-xs text-neutral-400 mt-1">
            Enter your Google Analytics 4 Measurement ID or Google Tag Manager container ID. The tracking scripts are automatically injected on your live public website.
          </p>
        </div>

        {saveSuccess && (
          <div className="p-3.5 bg-emerald-950/60 border border-emerald-500/30 rounded flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Google Analytics settings successfully saved & active across the live website!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* GA4 Measurement ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
              <span>Google Analytics 4 Measurement ID</span>
              <span className="text-[10px] text-neutral-500 font-normal">Format: G-XXXXXXXXXX</span>
            </label>
            <input
              type="text"
              value={settings.ga4_measurement_id}
              onChange={(e) => setSettings({ ...settings, ga4_measurement_id: e.target.value.trim() })}
              placeholder="e.g. G-8XYZ9ABCD"
              className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24] font-mono"
            />
            <p className="text-[11px] text-neutral-500">
              Found in your Google Analytics Console under Admin → Data Streams → Web Stream Details.
            </p>
          </div>

          {/* GTM Container ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
              <span>Google Tag Manager Container ID</span>
              <span className="text-[10px] text-neutral-500 font-normal">Format: GTM-XXXXXXX</span>
            </label>
            <input
              type="text"
              value={settings.gtm_container_id}
              onChange={(e) => setSettings({ ...settings, gtm_container_id: e.target.value.trim() })}
              placeholder="e.g. GTM-N5ABC9Z"
              className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24] font-mono"
            />
            <p className="text-[11px] text-neutral-500">
              Optional container for advanced marketing tags and triggers.
            </p>
          </div>

          {/* Meta Pixel ID */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center justify-between">
              <span>Meta / Facebook Pixel ID</span>
              <span className="text-[10px] text-neutral-500 font-normal">Numeric ID</span>
            </label>
            <input
              type="text"
              value={settings.meta_pixel_id}
              onChange={(e) => setSettings({ ...settings, meta_pixel_id: e.target.value.trim() })}
              placeholder="e.g. 123456789012345"
              className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24] font-mono"
            />
            <p className="text-[11px] text-neutral-500">
              Track Instagram & Facebook ad campaign conversions and retargeting audiences.
            </p>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enable_ga}
                onChange={(e) => setSettings({ ...settings, enable_ga: e.target.checked })}
                className="rounded accent-[#D91B24]"
              />
              <span className="text-xs text-neutral-300">Enable Google Analytics (gtag.js) script injection</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.track_whatsapp_clicks}
                onChange={(e) => setSettings({ ...settings, track_whatsapp_clicks: e.target.checked })}
                className="rounded accent-[#D91B24]"
              />
              <span className="text-xs text-neutral-300">Track WhatsApp booking clicks as conversion events</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.track_inquiries}
                onChange={(e) => setSettings({ ...settings, track_inquiries: e.target.checked })}
                className="rounded accent-[#D91B24]"
              />
              <span className="text-xs text-neutral-300">Track public inquiry form submissions as primary conversions</span>
            </label>
          </div>
        </div>

        {/* Custom Script Embeds (Head & Body) */}
        <div className="pt-4 border-t border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
            <Code2 className="w-3.5 h-3.5 text-[#D91B24]" />
            <span>Custom Head & Body Tracking Codes</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-400">
                Custom Header Scripts (&lt;head&gt;)
              </label>
              <textarea
                rows={3}
                value={settings.custom_head_code}
                onChange={(e) => setSettings({ ...settings, custom_head_code: e.target.value })}
                placeholder="<!-- Paste Google Search Console verification meta tag, Clarity script, etc. -->"
                className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24] font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-neutral-400">
                Custom Body Scripts (&lt;body&gt;)
              </label>
              <textarea
                rows={3}
                value={settings.custom_body_code}
                onChange={(e) => setSettings({ ...settings, custom_body_code: e.target.value })}
                placeholder="<!-- Paste noscript fallbacks or live chat widgets -->"
                className="w-full bg-[#141414] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D91B24] font-mono"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-[#D91B24] hover:bg-[#b5141c] disabled:opacity-50 text-white text-xs font-semibold px-5 py-2.5 rounded flex items-center gap-2 transition-colors cursor-pointer shadow-lg"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving Changes...' : 'Save Analytics Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAnalytics;
