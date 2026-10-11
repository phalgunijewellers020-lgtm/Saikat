/**
 * Google Analytics 4 (GA4), GTM, and Web Traffic Engine
 * Supports real GA4 injection and simulated live metrics
 */
import { GoogleAnalyticsSettings } from '../types/database';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

const GA_SCRIPT_ID = 'saikat-google-analytics';
const GTM_SCRIPT_ID = 'saikat-google-tag-manager';

/**
 * Initializes or updates Google Analytics 4 and GTM on the document head
 */
export function initGoogleAnalytics(settings?: GoogleAnalyticsSettings | null) {
  if (typeof window === 'undefined') return;

  // Remove existing scripts if disabled or reconfiguring
  const existingGa = document.getElementById(GA_SCRIPT_ID);
  if (existingGa) existingGa.remove();

  const existingGtm = document.getElementById(GTM_SCRIPT_ID);
  if (existingGtm) existingGtm.remove();

  if (!settings || !settings.enable_ga) return;

  const gaId = settings.ga4_measurement_id?.trim();
  const gtmId = settings.gtm_container_id?.trim();

  // Inject GA4 if measurement ID exists
  if (gaId && gaId.startsWith('G-')) {
    const script = document.createElement('script');
    script.id = GA_SCRIPT_ID;
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', gaId, {
      send_page_view: true,
      anonymize_ip: true,
    });
    console.info(`[Analytics] Google Analytics 4 initialized with ${gaId}`);
  }

  // Inject GTM if container ID exists
  if (gtmId && gtmId.startsWith('GTM-')) {
    const script = document.createElement('script');
    script.id = GTM_SCRIPT_ID;
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gtmId}');`;
    document.head.appendChild(script);
    console.info(`[Analytics] Google Tag Manager initialized with ${gtmId}`);
  }
}

/**
 * Dispatch custom tracking event to GA4
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    try {
      window.gtag('event', eventName, params);
      console.debug(`[Analytics Event] ${eventName}`, params);
    } catch (e) {
      console.warn('Failed to dispatch GA event', e);
    }
  }

  // Also log locally to event stream for admin visualization
  logLocalAnalyticsEvent(eventName, params);
}

// Local analytics event stream for real-time visualization in Admin Panel
export interface AnalyticsEventRecord {
  id: string;
  eventName: string;
  params?: Record<string, any>;
  timestamp: string;
}

const LOCAL_EVENTS_KEY = 'saikat_analytics_recent_events';

export function getLocalAnalyticsEvents(): AnalyticsEventRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    if (!raw) return getDefaultEventStream();
    return JSON.parse(raw);
  } catch {
    return getDefaultEventStream();
  }
}

export function logLocalAnalyticsEvent(eventName: string, params?: Record<string, any>) {
  try {
    const events = getLocalAnalyticsEvents();
    const newRecord: AnalyticsEventRecord = {
      id: 'evt-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      eventName,
      params,
      timestamp: new Date().toISOString(),
    };
    events.unshift(newRecord);
    // Keep last 40 events
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(events.slice(0, 40)));
  } catch (e) {
    console.warn('Failed to record local analytics event', e);
  }
}

function getDefaultEventStream(): AnalyticsEventRecord[] {
  const now = Date.now();
  return [
    {
      id: 'evt-1',
      eventName: 'page_view',
      params: { page_title: 'Home / Hero', path: '/' },
      timestamp: new Date(now - 45000).toISOString(),
    },
    {
      id: 'evt-2',
      eventName: 'view_gallery',
      params: { category: 'Weddings', photo_count: 12 },
      timestamp: new Date(now - 120000).toISOString(),
    },
    {
      id: 'evt-3',
      eventName: 'view_packages',
      params: { tier: 'Royal Heritage' },
      timestamp: new Date(now - 340000).toISOString(),
    },
    {
      id: 'evt-4',
      eventName: 'click_whatsapp',
      params: { source: 'floating_concierge' },
      timestamp: new Date(now - 560000).toISOString(),
    },
    {
      id: 'evt-5',
      eventName: 'inquiry_form_submit',
      params: { event_type: 'Wedding', location: 'Kolkata' },
      timestamp: new Date(now - 1200000).toISOString(),
    },
  ];
}
