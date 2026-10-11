import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Images,
  FolderTree,
  Briefcase,
  Layers,
  MessageSquare,
  Mail,
  Palette,
  Sliders,
  Globe,
  Users,
  History,
  Database,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ChevronRight,
  Shield,
  CheckCircle2,
  BarChart3,
  Calendar,
  FileText,
  KeyRound,
  HelpCircle,
  Smartphone,
  HardDrive,
  BookOpen,
} from 'lucide-react';
import BrandLogo from '../BrandLogo';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseActive, CMS_UPDATE_EVENT } from '../../lib/supabase';

export type AdminTab =
  | 'dashboard'
  | 'analytics'
  | 'package-enquiries'
  | 'inquiries'
  | 'calendar'
  | 'invoicing'
  | 'client-galleries'
  | 'gallery'
  | 'services'
  | 'packages'
  | 'testimonials'
  | 'faqs'
  | 'media'
  | 'templates'
  | 'site-settings'
  | 'homepage-layout'
  | 'theme'
  | 'backup'
  | 'users'
  | 'logs'
  | 'database'
  | 'guide';

interface AdminLayoutProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  inquiryCount?: number;
  packageEnquiryCount?: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  activeTab,
  setActiveTab,
  inquiryCount = 0,
  packageEnquiryCount = 0,
  children,
}) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDbActive, setIsDbActive] = useState(isSupabaseActive());

  useEffect(() => {
    const handleUpdate = () => setIsDbActive(isSupabaseActive());
    window.addEventListener(CMS_UPDATE_EVENT, handleUpdate);
    return () => window.removeEventListener(CMS_UPDATE_EVENT, handleUpdate);
  }, []);

  const navSections = [
    {
      group: 'INTELLIGENCE & LEADS',
      items: [
        { id: 'dashboard' as AdminTab, label: 'Executive Dashboard', icon: LayoutDashboard },
        { id: 'analytics' as AdminTab, label: 'Google Analytics & Traffic', icon: BarChart3 },
        { id: 'package-enquiries' as AdminTab, label: 'Package Enquiries', icon: Layers, badge: packageEnquiryCount },
        { id: 'inquiries' as AdminTab, label: 'General Inquiries', icon: Mail, badge: inquiryCount },
      ],
    },
    {
      group: 'CLIENTS & PRODUCTION',
      items: [
        { id: 'calendar' as AdminTab, label: 'Shoots & Calendar', icon: Calendar },
        { id: 'invoicing' as AdminTab, label: 'Quotes & Invoicing', icon: FileText },
        { id: 'client-galleries' as AdminTab, label: 'Client Proofing & PINs', icon: KeyRound },
        { id: 'templates' as AdminTab, label: 'WhatsApp & Templates', icon: Smartphone },
      ],
    },
    {
      group: 'WEBSITE CONTENT',
      items: [
        { id: 'gallery' as AdminTab, label: 'Gallery & Categories', icon: Images },
        { id: 'services' as AdminTab, label: 'Services', icon: Briefcase },
        { id: 'packages' as AdminTab, label: 'Package Management', icon: Layers },
        { id: 'testimonials' as AdminTab, label: 'Testimonials', icon: MessageSquare },
        { id: 'faqs' as AdminTab, label: 'Studio FAQs', icon: HelpCircle },
        { id: 'media' as AdminTab, label: 'Media Library', icon: FolderTree },
      ],
    },
    {
      group: 'DESIGN & SETTINGS',
      items: [
        { id: 'site-settings' as AdminTab, label: 'Site & Brand Settings', icon: Globe },
        { id: 'homepage-layout' as AdminTab, label: 'Homepage Layout', icon: Sliders },
        { id: 'theme' as AdminTab, label: 'Theme & Typography', icon: Palette },
      ],
    },
    {
      group: 'SYSTEM & DATA',
      items: [
        { id: 'backup' as AdminTab, label: 'Data Backup & Reset', icon: HardDrive },
        { id: 'users' as AdminTab, label: 'Admin Users', icon: Users },
        { id: 'logs' as AdminTab, label: 'Activity Logs', icon: History },
        { id: 'database' as AdminTab, label: 'Database & SQL', icon: Database },
      ],
    },
    {
      group: 'KNOWLEDGE & MANUAL',
      items: [
        { id: 'guide' as AdminTab, label: 'Information & Help Guide', icon: BookOpen },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#070707] text-white flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`no-print fixed lg:static inset-y-0 left-0 z-50 w-72 bg-[#0B0B0B] border-r border-white/10 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex flex-col">
            <BrandLogo size="sm" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D91B24] font-semibold mt-1">
              Studio Management CMS
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 text-neutral-400 hover:text-white lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
          {navSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <p className="px-3 text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-semibold">
                {section.group}
              </p>
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#D91B24] text-white shadow-md font-semibold'
                        : 'text-neutral-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge !== undefined && item.badge > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          isActive ? 'bg-white text-[#D91B24]' : 'bg-[#D91B24] text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer with Logged In User & Logout */}
        <div className="p-4 border-t border-white/10 bg-[#080808] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0">
                {user?.full_name ? user.full_name.charAt(0) : 'S'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-white truncate">
                  {user?.full_name || 'Studio Admin'}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-neutral-400">
                  <Shield className="w-2.5 h-2.5 text-[#D91B24]" />
                  <span className="capitalize">{user?.role || 'Admin'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                window.location.hash = '';
                window.history.pushState(null, '', '/');
                window.dispatchEvent(new Event('hashchange'));
              }}
              className="p-1.5 text-neutral-400 hover:text-red-400 rounded hover:bg-white/5 transition-colors cursor-pointer"
              title="Logout and return to public website"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Live Supabase connection indicator */}
          <div className="flex items-center justify-between text-[10px] px-2 py-1.5 rounded bg-black/50 border border-white/5 text-neutral-400">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  isDbActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span>{isDbActive ? 'Supabase Connected' : 'Local Studio DB'}</span>
            </span>
            <button
              onClick={() => setActiveTab('database')}
              className="text-[#D91B24] hover:underline cursor-pointer"
            >
              Config
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="no-print h-16 bg-[#0B0B0B] border-b border-white/10 px-4 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-neutral-400 hover:text-white lg:hidden"
              aria-label="Open Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span className="hidden sm:inline">Admin CMS</span>
              <ChevronRight className="w-3.5 h-3.5 hidden sm:inline" />
              <span className="text-white font-medium capitalize">
                {activeTab.replace('-', ' ')}
              </span>
            </div>
          </div>

          {/* Quick Actions in Header */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-all cursor-pointer ${
                activeTab === 'guide'
                  ? 'bg-[#D91B24] text-white border-[#D91B24] shadow'
                  : 'bg-[#D91B24]/10 hover:bg-[#D91B24]/20 text-[#D91B24] border-[#D91B24]/30'
              }`}
              title="Open Information & Help Guidebook"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Admin Help Guide</span>
            </button>

            <button
              onClick={() => {
                window.location.hash = '';
                window.history.pushState(null, '', '/');
                window.dispatchEvent(new Event('hashchange'));
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium border border-white/10 transition-colors cursor-pointer"
              title="Exit Admin and return to Public Website"
            >
              <span>Exit Admin</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium border border-white/10 transition-colors"
              title="Open public website in a new tab"
            >
              <span>Live Website</span>
              <ExternalLink className="w-3 h-3 text-[#D91B24]" />
            </a>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#070707]">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
