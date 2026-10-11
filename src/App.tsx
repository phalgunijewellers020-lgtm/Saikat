import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import PublicWebsite from './pages/PublicWebsite';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => {
    const path = window.location.pathname.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    const search = window.location.search.toLowerCase();
    return (
      path.startsWith('/admin') ||
      hash.startsWith('#admin') ||
      search.includes('admin=true') ||
      search.includes('admin=1')
    );
  });

  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      
      // If user typed /admin, normalize URL to /#admin
      if (path.startsWith('/admin')) {
        window.history.replaceState(null, '', '/#admin');
      }

      const isAdmin =
        window.location.hash.toLowerCase().startsWith('#admin') ||
        path.startsWith('/admin') ||
        hash.startsWith('#admin') ||
        search.includes('admin=true') ||
        search.includes('admin=1');
      setIsAdminRoute(isAdmin);

      // Update document title dynamically
      if (isAdmin) {
        document.title = 'Saikat Photography – Studio CMS & Admin Portal';
      } else {
        document.title = 'Saikat Photography – Luxury Visuals & Cinematic Heirlooms';
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);

    // Initial check
    handleRouteChange();

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  return (
    <AuthProvider>
      {isAdminRoute ? <AdminPanel /> : <PublicWebsite />}
    </AuthProvider>
  );
}
