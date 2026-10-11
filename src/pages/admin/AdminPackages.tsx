import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Sparkles,
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Image as ImageIcon,
  DollarSign,
  Star,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  FolderPlus,
  ExternalLink,
  ChevronRight,
  ListFilter,
  Sliders,
  Tag,
  Search
} from 'lucide-react';
import { MainPackage, SubPackage } from '../../types/database';
import { DB } from '../../lib/supabase';

interface AdminPackagesProps {
  onRefresh?: () => void | Promise<void>;
  onNotify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminPackages: React.FC<AdminPackagesProps> = ({ onRefresh, onNotify }) => {
  const [activeTab, setActiveTab] = useState<'sub_packages' | 'categories'>('sub_packages');
  const [selectedMainPackageId, setSelectedMainPackageId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [mainPackages, setMainPackages] = useState<MainPackage[]>([]);
  const [subPackages, setSubPackages] = useState<SubPackage[]>([]);
  const [loading, setLoading] = useState(true);

  // Sub-package Modal State
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [subEditingItem, setSubEditingItem] = useState<SubPackage | null>(null);
  const [subFormData, setSubFormData] = useState<Partial<SubPackage>>({
    name: '',
    main_package_id: '',
    price: '₹15,000',
    price_formatted: '₹15,000',
    description: '',
    features: [''],
    badge: '',
    is_popular: false,
    is_active: true,
    display_order: 1,
    image_url: '',
    duration: '',
    deliverables: '',
    photographers_count: 2
  });

  // Main Package Modal State
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [mainEditingItem, setMainEditingItem] = useState<MainPackage | null>(null);
  const [mainFormData, setMainFormData] = useState<Partial<MainPackage>>({
    name: '',
    slug: '',
    description: '',
    subtitle: '',
    badge: '',
    is_active: true,
    display_order: 1,
    icon_name: 'Sparkles',
    color_accent: '#D4AF37'
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: 'main' | 'sub';
    id: string;
    name: string;
  } | null>(null);

  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [mPkgs, sPkgs] = await Promise.all([
        DB.getMainPackages(false),
        DB.getSubPackages(undefined, false)
      ]);
      setMainPackages(mPkgs);
      setSubPackages(sPkgs);
    } catch (err) {
      console.error('Error loading package data:', err);
      onNotify?.('Error loading packages', 'error');
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SUB-PACKAGE HANDLERS
  // ==========================================
  const handleOpenSubModal = (item?: SubPackage) => {
    if (item) {
      setSubEditingItem(item);
      setSubFormData({
        ...item,
        features: item.features && item.features.length > 0 ? [...item.features] : ['']
      });
    } else {
      setSubEditingItem(null);
      const defaultMainId =
        selectedMainPackageId !== 'all'
          ? selectedMainPackageId
          : mainPackages[0]?.id || 'main-pkg-silver';
      setSubFormData({
        name: '',
        main_package_id: defaultMainId,
        price: '₹10,000',
        price_formatted: '₹10,000',
        description: '',
        features: [
          'Full Day Event Coverage',
          'Cinematic 4K Highlights Video',
          '350+ Master Color-Graded Photos',
          'Online Private Client Gallery'
        ],
        badge: '',
        is_popular: false,
        is_active: true,
        display_order: subPackages.length + 1,
        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=900',
        duration: '1 Full Day Coverage',
        deliverables: '350+ High-res edited photos & 4K cinematic teaser',
        photographers_count: 2
      });
    }
    setIsSubModalOpen(true);
  };

  const handleSaveSubPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subFormData.name || !subFormData.main_package_id) {
      onNotify?.('Please fill in required fields (Name and Main Package Category)', 'error');
      return;
    }

    try {
      const cleanFeatures = (subFormData.features || [])
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const priceStr = String(subFormData.price || '₹0').trim();

      const payload = {
        ...subFormData,
        id: subEditingItem ? subEditingItem.id : undefined,
        name: subFormData.name.trim(),
        main_package_id: subFormData.main_package_id,
        price: priceStr,
        price_formatted: subFormData.price_formatted || priceStr,
        features: cleanFeatures
      };

      await DB.saveSubPackage(payload);
      onNotify?.(
        subEditingItem ? 'Sub-package updated successfully' : 'Sub-package created successfully',
        'success'
      );
      setIsSubModalOpen(false);
      await loadData();
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Error saving sub-package:', err);
      onNotify?.('Failed to save sub-package', 'error');
    }
  };

  const handleDeleteSub = async (id: string) => {
    try {
      await DB.deleteSubPackage(id);
      onNotify?.('Sub-package deleted successfully', 'success');
      setDeleteConfirm(null);
      await loadData();
    } catch (err) {
      console.error('Error deleting sub-package:', err);
      onNotify?.('Failed to delete sub-package', 'error');
    }
  };

  const handleToggleSubStatus = async (item: SubPackage) => {
    try {
      await DB.saveSubPackage({ ...item, is_active: !item.is_active });
      onNotify?.(
        `Package ${item.is_active ? 'deactivated' : 'activated'} successfully`,
        'success'
      );
      await loadData();
    } catch (err) {
      console.error('Error toggling status:', err);
      onNotify?.('Failed to update package status', 'error');
    }
  };

  // ==========================================
  // MAIN PACKAGE CATEGORY HANDLERS
  // ==========================================
  const handleOpenMainModal = (item?: MainPackage) => {
    if (item) {
      setMainEditingItem(item);
      setMainFormData({ ...item });
    } else {
      setMainEditingItem(null);
      setMainFormData({
        name: '',
        slug: '',
        description: '',
        subtitle: '',
        badge: '',
        is_active: true,
        display_order: mainPackages.length + 1,
        icon_name: 'Sparkles',
        color_accent: '#D4AF37'
      });
    }
    setIsMainModalOpen(true);
  };

  const handleSaveMainPackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainFormData.name) {
      onNotify?.('Please provide a category name', 'error');
      return;
    }

    try {
      const slug =
        mainFormData.slug ||
        mainFormData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');

      const payload = {
        ...mainFormData,
        id: mainEditingItem ? mainEditingItem.id : undefined,
        name: mainFormData.name.trim(),
        slug
      };

      await DB.saveMainPackage(payload);
      onNotify?.(
        mainEditingItem ? 'Category updated successfully' : 'Category created successfully',
        'success'
      );
      setIsMainModalOpen(false);
      await loadData();
      if (onRefresh) await onRefresh();
    } catch (err) {
      console.error('Error saving main package:', err);
      onNotify?.('Failed to save category', 'error');
    }
  };

  const handleDeleteMain = async (id: string) => {
    try {
      await DB.deleteMainPackage(id);
      onNotify?.('Main package category deleted successfully', 'success');
      setDeleteConfirm(null);
      if (selectedMainPackageId === id) {
        setSelectedMainPackageId('all');
      }
      await loadData();
    } catch (err) {
      console.error('Error deleting main package:', err);
      onNotify?.('Failed to delete category', 'error');
    }
  };

  // Helper feature list manipulation
  const addFeature = () => {
    if (featureInput.trim()) {
      setSubFormData({
        ...subFormData,
        features: [...(subFormData.features || []), featureInput.trim()]
      });
      setFeatureInput('');
    }
  };

  const removeFeature = (idx: number) => {
    setSubFormData({
      ...subFormData,
      features: (subFormData.features || []).filter((_, i) => i !== idx)
    });
  };

  // Filtered sub-packages
  const filteredSubPackages = subPackages.filter((item) => {
    const matchesCategory =
      selectedMainPackageId === 'all' || item.main_package_id === selectedMainPackageId;
    const matchesSearch =
      searchQuery === '' ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.features || []).some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getMainPackageName = (id: string) => {
    const found = mainPackages.find((m) => m.id === id);
    return found ? found.name : 'Unknown Category';
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Dynamic Package Management System
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif text-white">
              Packages & Pricing Architecture
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
              Create and manage main packages (Silver, Gold, Diamond, or custom) and add unlimited
              sub-packages with custom pricing, included features, and custom images.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => handleOpenMainModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-700 hover:border-neutral-600 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-200 text-sm font-medium transition"
            >
              <FolderPlus className="w-4 h-4 text-amber-400" />
              Add Main Category
            </button>
            <button
              onClick={() => handleOpenSubModal()}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-semibold transition shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" />
              Add Sub-Package
            </button>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-neutral-800">
          <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/60">
            <span className="text-xs text-neutral-500 uppercase tracking-wider block">
              Main Categories
            </span>
            <span className="text-2xl font-semibold text-white mt-1 block">
              {mainPackages.length}
            </span>
            <span className="text-xs text-neutral-400 mt-0.5 block">
              {mainPackages.filter((m) => m.is_active).length} active
            </span>
          </div>
          <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/60">
            <span className="text-xs text-neutral-500 uppercase tracking-wider block">
              Total Sub-Packages
            </span>
            <span className="text-2xl font-semibold text-white mt-1 block">
              {subPackages.length}
            </span>
            <span className="text-xs text-neutral-400 mt-0.5 block">
              {subPackages.filter((s) => s.is_active).length} published
            </span>
          </div>
          <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/60">
            <span className="text-xs text-neutral-500 uppercase tracking-wider block">
              Lowest Price
            </span>
            <span className="text-2xl font-semibold text-amber-400 mt-1 block">
              {subPackages.length > 0
                ? (() => {
                    const prices = subPackages
                      .map((s) => Number(String(s.price).replace(/[^0-9]/g, '')))
                      .filter((n) => !isNaN(n) && n > 0);
                    return prices.length > 0
                      ? `₹${Math.min(...prices).toLocaleString('en-IN')}`
                      : subPackages[0].price;
                  })()
                : '₹0'}
            </span>
            <span className="text-xs text-neutral-400 mt-0.5 block">Starting package</span>
          </div>
          <div className="bg-neutral-950/50 p-4 rounded-xl border border-neutral-800/60">
            <span className="text-xs text-neutral-500 uppercase tracking-wider block">
              Highest Tier
            </span>
            <span className="text-2xl font-semibold text-amber-400 mt-1 block">
              {subPackages.length > 0
                ? (() => {
                    const prices = subPackages
                      .map((s) => Number(String(s.price).replace(/[^0-9]/g, '')))
                      .filter((n) => !isNaN(n) && n > 0);
                    return prices.length > 0
                      ? `₹${Math.max(...prices).toLocaleString('en-IN')}`
                      : subPackages[subPackages.length - 1].price;
                  })()
                : '₹0'}
            </span>
            <span className="text-xs text-neutral-400 mt-0.5 block">Flagship collection</span>
          </div>
        </div>
      </div>

      {/* TOP VIEW NAVIGATION TABS */}
      <div className="flex border-b border-neutral-800">
        <button
          onClick={() => setActiveTab('sub_packages')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition ${
            activeTab === 'sub_packages'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          Sub-Packages ({subPackages.length})
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-6 py-3.5 text-sm font-medium border-b-2 transition ${
            activeTab === 'categories'
              ? 'border-amber-500 text-amber-400 bg-amber-500/5'
              : 'border-transparent text-neutral-400 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" />
          Main Categories ({mainPackages.length})
        </button>
      </div>

      {/* TAB 1: SUB-PACKAGES VIEW */}
      {activeTab === 'sub_packages' && (
        <div className="space-y-6">
          {/* CATEGORY SELECTOR + SEARCH */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Category tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
              <button
                onClick={() => setSelectedMainPackageId('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedMainPackageId === 'all'
                    ? 'bg-amber-500 text-neutral-950 font-semibold'
                    : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                All Categories ({subPackages.length})
              </button>
              {mainPackages.map((mp) => {
                const count = subPackages.filter((s) => s.main_package_id === mp.id).length;
                return (
                  <button
                    key={mp.id}
                    onClick={() => setSelectedMainPackageId(mp.id)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                      selectedMainPackageId === mp.id
                        ? 'bg-amber-500 text-neutral-950 font-semibold'
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span>{mp.name}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        selectedMainPackageId === mp.id
                          ? 'bg-neutral-900/20 text-neutral-950'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search */}
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search sub-packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* LIST OF SUB-PACKAGES */}
          {loading ? (
            <div className="text-center py-20 text-neutral-500">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-amber-500" />
              Loading package catalog...
            </div>
          ) : filteredSubPackages.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
              <Layers className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-white mb-1">No Sub-Packages Found</h3>
              <p className="text-sm text-neutral-400 mb-6 max-w-md mx-auto">
                {selectedMainPackageId !== 'all'
                  ? `There are no sub-packages created under "${getMainPackageName(
                      selectedMainPackageId
                    )}" yet.`
                  : 'Start by creating your first tier sub-package under Silver, Gold, or Diamond.'}
              </p>
              <button
                onClick={() => handleOpenSubModal()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-sm font-semibold transition"
              >
                <Plus className="w-4 h-4" />
                Create New Sub-Package
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubPackages.map((pkg) => {
                const mainName = getMainPackageName(pkg.main_package_id);
                return (
                  <div
                    key={pkg.id}
                    className={`bg-neutral-900 border rounded-2xl overflow-hidden flex flex-col transition hover:border-neutral-700 ${
                      pkg.is_popular
                        ? 'border-amber-500/50 shadow-lg shadow-amber-500/5'
                        : 'border-neutral-800'
                    }`}
                  >
                    {/* Top thumbnail if available */}
                    {pkg.image_url && (
                      <div className="h-44 w-full relative overflow-hidden bg-neutral-950">
                        <img
                          src={pkg.image_url}
                          alt={pkg.name}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                          <span className="px-2.5 py-1 rounded-md bg-neutral-900/90 backdrop-blur-sm text-amber-400 text-[11px] font-semibold tracking-wide border border-amber-500/30">
                            {mainName}
                          </span>
                          {pkg.badge && (
                            <span className="px-2.5 py-1 rounded-md bg-amber-500 text-neutral-950 text-[11px] font-bold">
                              {pkg.badge}
                            </span>
                          )}
                        </div>

                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <button
                            onClick={() => handleToggleSubStatus(pkg)}
                            title={pkg.is_active ? 'Click to deactivate' : 'Click to activate'}
                            className={`p-1.5 rounded-md backdrop-blur-sm transition ${
                              pkg.is_active
                                ? 'bg-emerald-500/80 text-white'
                                : 'bg-neutral-800/80 text-neutral-400'
                            }`}
                          >
                            {pkg.is_active ? (
                              <Eye className="w-3.5 h-3.5" />
                            ) : (
                              <EyeOff className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="p-6 flex-1 flex flex-col">
                      {!pkg.image_url && (
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-neutral-800 text-amber-400 border border-neutral-700">
                            {mainName}
                          </span>
                          {pkg.badge && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                              {pkg.badge}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-lg font-serif font-medium text-white">{pkg.name}</h3>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            pkg.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-neutral-800 text-neutral-400'
                          }`}
                        >
                          {pkg.is_active ? 'Active' : 'Draft'}
                        </span>
                      </div>

                      {/* Pricing header */}
                      <div className="mt-3 pb-4 border-b border-neutral-800">
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-semibold text-amber-400">
                            {pkg.price_formatted || pkg.price}
                          </span>
                          <span className="text-xs text-neutral-400">/ package</span>
                        </div>
                        {pkg.duration && (
                          <span className="text-xs text-neutral-400 mt-1 block">
                            ⏱ {pkg.duration}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-xs text-neutral-400 mt-3 line-clamp-2">
                        {pkg.description || 'No package description provided.'}
                      </p>

                      {/* Features list */}
                      <div className="mt-4 space-y-1.5 flex-1">
                        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500 block">
                          Included Features ({pkg.features?.length || 0})
                        </span>
                        {pkg.features?.slice(0, 4).map((feat, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-neutral-300">
                            <Check className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                            <span className="line-clamp-1">{feat}</span>
                          </div>
                        ))}
                        {(pkg.features?.length || 0) > 4 && (
                          <span className="text-[11px] text-neutral-500 block pt-1">
                            +{pkg.features.length - 4} more inclusions
                          </span>
                        )}
                      </div>

                      {/* Card actions */}
                      <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between gap-2">
                        <span className="text-[11px] text-neutral-500">
                          Order: #{pkg.display_order}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenSubModal(pkg)}
                            className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition"
                            title="Edit Sub-Package"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirm({
                                type: 'sub',
                                id: pkg.id,
                                name: pkg.name
                              })
                            }
                            className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                            title="Delete Sub-Package"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MAIN CATEGORIES VIEW */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-serif text-white">Main Package Categories</h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Manage high-level groups shown as tabs on your website (Silver, Gold, Diamond, or custom).
              </p>
            </div>
            <button
              onClick={() => handleOpenMainModal()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold transition"
            >
              <Plus className="w-3.5 h-3.5" />
              New Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mainPackages.map((cat) => {
              const childrenCount = subPackages.filter((s) => s.main_package_id === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-700 transition"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          cat.is_active
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-neutral-800 text-neutral-400'
                        }`}
                      >
                        {cat.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <h3 className="text-xl font-serif text-white">{cat.name}</h3>
                    {cat.subtitle && (
                      <p className="text-xs text-amber-400/80 mt-0.5">{cat.subtitle}</p>
                    )}
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-3">
                      {cat.description || 'No category description provided.'}
                    </p>

                    <div className="mt-4 p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-500">Connected Sub-Packages:</span>
                        <span className="text-white font-semibold">{childrenCount} packages</span>
                      </div>
                      <div className="flex items-center justify-between text-xs mt-1">
                        <span className="text-neutral-500">URL Slug:</span>
                        <span className="text-amber-400/80 font-mono text-[11px]">{cat.slug}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <span className="text-xs text-neutral-500">Display Order #{cat.display_order}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenMainModal(cat)}
                        className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirm({
                            type: 'main',
                            id: cat.id,
                            name: cat.name
                          })
                        }
                        className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================
          SUB-PACKAGE MODAL
      ======================================================== */}
      {isSubModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-xl font-serif text-white">
                  {subEditingItem ? 'Edit Sub-Package' : 'Create New Sub-Package'}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Set pricing, duration, deliverables, and included benefits.
                </p>
              </div>
              <button
                onClick={() => setIsSubModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubPackage} className="mt-6 space-y-5">
              {/* Category Selector */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Main Package Category <span className="text-amber-500">*</span>
                </label>
                <select
                  value={subFormData.main_package_id}
                  onChange={(e) =>
                    setSubFormData({ ...subFormData, main_package_id: e.target.value })
                  }
                  required
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                >
                  {mainPackages.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sub-package Name & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Sub-Package Name <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silver Standard, Gold Premium"
                    value={subFormData.name}
                    onChange={(e) => setSubFormData({ ...subFormData, name: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Badge / Tag (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Most Popular, Recommended"
                    value={subFormData.badge || ''}
                    onChange={(e) => setSubFormData({ ...subFormData, badge: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Price (INR ₹) <span className="text-amber-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subFormData.price || ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSubFormData({
                        ...subFormData,
                        price: val,
                        price_formatted: val
                      });
                    }}
                    placeholder="e.g. ₹15,000 or ₹25,000"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Display Label / Formatted Price
                  </label>
                  <input
                    type="text"
                    value={subFormData.price_formatted || ''}
                    onChange={(e) =>
                      setSubFormData({ ...subFormData, price_formatted: e.target.value })
                    }
                    placeholder="₹15,000"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Duration and Team Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Coverage Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1 Full Day (10-12 Hours)"
                    value={subFormData.duration || ''}
                    onChange={(e) => setSubFormData({ ...subFormData, duration: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Photographers / Crew Size
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={subFormData.photographers_count || 2}
                    onChange={(e) =>
                      setSubFormData({
                        ...subFormData,
                        photographers_count: Number(e.target.value)
                      })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Package Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Summarize what this sub-package delivers..."
                  value={subFormData.description || ''}
                  onChange={(e) =>
                    setSubFormData({ ...subFormData, description: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Deliverables summary */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Deliverables Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. 350+ edited photos, 1 teaser video, 1 handcrafted album"
                  value={subFormData.deliverables || ''}
                  onChange={(e) =>
                    setSubFormData({ ...subFormData, deliverables: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Thumbnail Image URL (Unsplash or direct URL)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  value={subFormData.image_url || ''}
                  onChange={(e) => setSubFormData({ ...subFormData, image_url: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Included Features Editor */}
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Included Features & Benefits
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Type an inclusion and press Add..."
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-medium transition"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {(subFormData.features || []).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-2 bg-neutral-950 rounded-lg border border-neutral-800 text-xs text-neutral-200"
                    >
                      <span className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        {feat}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFeature(idx)}
                        className="text-neutral-500 hover:text-rose-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Controls: Display Order, Popular, Active */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-neutral-800">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={subFormData.display_order || 1}
                    onChange={(e) =>
                      setSubFormData({ ...subFormData, display_order: Number(e.target.value) })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_popular"
                    checked={subFormData.is_popular || false}
                    onChange={(e) =>
                      setSubFormData({ ...subFormData, is_popular: e.target.checked })
                    }
                    className="rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-950 w-4 h-4"
                  />
                  <label htmlFor="is_popular" className="text-xs text-neutral-300">
                    Mark as Highlighted / Popular
                  </label>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={subFormData.is_active ?? true}
                    onChange={(e) =>
                      setSubFormData({ ...subFormData, is_active: e.target.checked })
                    }
                    className="rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-950 w-4 h-4"
                  />
                  <label htmlFor="is_active" className="text-xs text-neutral-300">
                    Active (Visible on Website)
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsSubModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold transition"
                >
                  {subEditingItem ? 'Update Sub-Package' : 'Create Sub-Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MAIN PACKAGE CATEGORY MODAL
      ======================================================== */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div>
                <h3 className="text-xl font-serif text-white">
                  {mainEditingItem ? 'Edit Category' : 'New Main Category'}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  e.g., Silver Package, Gold Package, Diamond Package
                </p>
              </div>
              <button
                onClick={() => setIsMainModalOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMainPackage} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Category Name <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diamond Package"
                  value={mainFormData.name}
                  onChange={(e) => setMainFormData({ ...mainFormData, name: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Subtitle / Tagline (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Master Signature Wedding Coverage"
                  value={mainFormData.subtitle || ''}
                  onChange={(e) => setMainFormData({ ...mainFormData, subtitle: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe this category tier..."
                  value={mainFormData.description || ''}
                  onChange={(e) =>
                    setMainFormData({ ...mainFormData, description: e.target.value })
                  }
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={mainFormData.display_order || 1}
                    onChange={(e) =>
                      setMainFormData({ ...mainFormData, display_order: Number(e.target.value) })
                    }
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="main_active"
                    checked={mainFormData.is_active ?? true}
                    onChange={(e) =>
                      setMainFormData({ ...mainFormData, is_active: e.target.checked })
                    }
                    className="rounded border-neutral-700 text-amber-500 focus:ring-amber-500 bg-neutral-950 w-4 h-4"
                  />
                  <label htmlFor="main_active" className="text-xs text-neutral-300">
                    Category Active
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsMainModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-semibold transition"
                >
                  {mainEditingItem ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          DELETE CONFIRMATION MODAL
      ======================================================== */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-neutral-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 text-center">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-white mb-1">
              Delete {deleteConfirm.type === 'main' ? 'Category' : 'Sub-Package'}?
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Are you sure you want to delete{' '}
              <strong className="text-white">"{deleteConfirm.name}"</strong>? This action cannot be
              undone.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-xs text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteConfirm.type === 'main') {
                    handleDeleteMain(deleteConfirm.id);
                  } else {
                    handleDeleteSub(deleteConfirm.id);
                  }
                }}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;
