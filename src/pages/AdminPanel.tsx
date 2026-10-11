import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DB, CMS_UPDATE_EVENT } from '../lib/supabase';
import {
  SiteSettings,
  GalleryCategory,
  GalleryImage,
  Service,
  Package,
  PackageEnquiry,
  Testimonial,
  Inquiry,
} from '../types/database';
import AdminLayout, { AdminTab } from '../components/admin/AdminLayout';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminGallery from './admin/AdminGallery';
import AdminServices from './admin/AdminServices';
import AdminPackages from './admin/AdminPackages';
import AdminPackageEnquiries from './admin/AdminPackageEnquiries';
import AdminTestimonials from './admin/AdminTestimonials';
import AdminInquiries from './admin/AdminInquiries';
import AdminMediaLibrary from './admin/AdminMediaLibrary';
import AdminSiteSettings from './admin/AdminSiteSettings';
import AdminHomepageLayout from './admin/AdminHomepageLayout';
import AdminThemeSettings from './admin/AdminThemeSettings';
import AdminUsers from './admin/AdminUsers';
import AdminActivityLogs from './admin/AdminActivityLogs';
import AdminDatabaseSetup from './admin/AdminDatabaseSetup';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminCalendar from './admin/AdminCalendar';
import AdminQuotations from './admin/AdminQuotations';
import AdminClientGalleries from './admin/AdminClientGalleries';
import AdminFaqs from './admin/AdminFaqs';
import AdminTemplates from './admin/AdminTemplates';
import AdminBackup from './admin/AdminBackup';
import AdminHelpGuide from './admin/AdminHelpGuide';

export const AdminPanel: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [packageEnquiries, setPackageEnquiries] = useState<PackageEnquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const loadData = async () => {
    try {
      const [s, c, i, serv, p, t, inqs, pEnqs] = await Promise.all([
        DB.getSettings(),
        DB.getCategories(),
        DB.getGalleryImages(false),
        DB.getServices(false),
        DB.getPackages(false),
        DB.getTestimonials(false),
        DB.getInquiries(),
        DB.getPackageEnquiries(),
      ]);

      setSettings(s);
      setCategories(c);
      setImages(i);
      setServices(serv);
      setPackages(p);
      setTestimonials(t);
      setInquiries(inqs);
      setPackageEnquiries(pEnqs);
    } catch (err) {
      console.error('Error fetching admin data', err);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener(CMS_UPDATE_EVENT, loadData);
    return () => window.removeEventListener(CMS_UPDATE_EVENT, loadData);
  }, []);

  const handleUpdateInquiryStatus = async (id: string, status: Inquiry['status']) => {
    await DB.updateInquiryStatus(id, status);
    loadData();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D91B24] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, show secure login
  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => loadData()} />;
  }

  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;
  const newPackageEnquiriesCount = packageEnquiries.filter((e) => e.status === 'new').length;

  return (
    <AdminLayout
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      inquiryCount={newInquiriesCount}
      packageEnquiryCount={newPackageEnquiriesCount}
    >
      {activeTab === 'dashboard' && (
        <AdminDashboard
          images={images}
          services={services}
          packages={packages}
          testimonials={testimonials}
          inquiries={inquiries}
          setActiveTab={setActiveTab}
          onOpenNewImage={() => setActiveTab('gallery')}
          onOpenNewService={() => setActiveTab('services')}
          onOpenNewPackage={() => setActiveTab('packages')}
          onOpenNewTestimonial={() => setActiveTab('testimonials')}
          onUpdateInquiryStatus={handleUpdateInquiryStatus}
        />
      )}

      {activeTab === 'gallery' && (
        <AdminGallery
          categories={categories}
          images={images}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'services' && (
        <AdminServices
          services={services}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'packages' && (
        <AdminPackages
          onRefresh={loadData}
        />
      )}

      {activeTab === 'package-enquiries' && (
        <AdminPackageEnquiries
          enquiries={packageEnquiries}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'analytics' && <AdminAnalytics />}

      {activeTab === 'calendar' && <AdminCalendar />}

      {activeTab === 'invoicing' && <AdminQuotations />}

      {activeTab === 'client-galleries' && <AdminClientGalleries />}

      {activeTab === 'testimonials' && (
        <AdminTestimonials
          testimonials={testimonials}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'faqs' && <AdminFaqs />}

      {activeTab === 'templates' && <AdminTemplates />}

      {activeTab === 'inquiries' && (
        <AdminInquiries
          inquiries={inquiries}
          onRefresh={loadData}
        />
      )}

      {activeTab === 'media' && <AdminMediaLibrary />}

      {activeTab === 'site-settings' && settings && (
        <AdminSiteSettings settings={settings} onRefresh={loadData} />
      )}

      {activeTab === 'homepage-layout' && <AdminHomepageLayout />}

      {activeTab === 'theme' && <AdminThemeSettings />}

      {activeTab === 'backup' && <AdminBackup />}

      {activeTab === 'users' && <AdminUsers />}

      {activeTab === 'logs' && <AdminActivityLogs />}

      {activeTab === 'database' && <AdminDatabaseSetup />}

      {activeTab === 'guide' && (
        <AdminHelpGuide onNavigate={(tab) => setActiveTab(tab)} />
      )}
    </AdminLayout>
  );
};

export default AdminPanel;
