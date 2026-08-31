import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useSiteData } from '../hooks/useSiteData';
import { supabase } from '../lib/supabaseClient';
import defaultData from '../data/data.json';

// Admin Components
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';
import AdminContentEditor from '../components/admin/AdminContentEditor';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading, isUsingSupabase, isUsingBackend, updateSiteData } = useSiteData();

  // Sidebar & Section State
  const [activeCmsSection, setActiveCmsSection] = useState('hero');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // CMS Form Data
  const [formData, setFormData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success' | 'error', text: '' }

  const cmsSections = [
    { id: 'header', label: 'Header & Mega Menu', title: 'Header & Navigation Editor' },
    { id: 'hero', label: 'Hero & Keywords', title: 'Hero Section Editor' },
    { id: 'contactUs', label: 'Contact Us & Form Builder', title: 'Contact Us Page & Form Builder' },
    { id: 'servicesSection', label: 'Services Cards', title: 'Services Section Editor' },
    { id: 'solutionsSection', label: 'Solutions', title: 'Solutions Section Editor' },
    { id: 'techStackSection', label: 'Tech Stack Categories', title: 'Tech Stack Editor' },
    { id: 'hireDevSection', label: 'Hire Developers', title: 'Hire Developers Editor' },
    { id: 'ctaBanner', label: 'CTA Banner', title: 'CTA Banner Editor' },
    { id: 'officeLocations', label: 'Office Locations', title: 'Office Locations Editor' },
    { id: 'footer', label: 'Footer & Contacts', title: 'Footer Editor' }
  ];

  // Auth Guard
  useEffect(() => {
    const isAuth =
      localStorage.getItem('ies_admin_auth') || localStorage.getItem('admin_token');
    if (!isAuth) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Sync Form Data with Site Data
  useEffect(() => {
    if (data) {
      const merged = {
        ...defaultData,
        ...data,
        header: { ...defaultData.header, ...(data.header || {}) },
        hero: { ...defaultData.hero, ...(data.hero || {}) },
        contactUs: { ...defaultData.contactUs, ...(data.contactUs || {}) },
        servicesSection: { ...defaultData.servicesSection, ...(data.servicesSection || {}) },
        solutionsSection: { ...defaultData.solutionsSection, ...(data.solutionsSection || {}) },
        techStackSection: { ...defaultData.techStackSection, ...(data.techStackSection || {}) },
        ctaBanner: { ...defaultData.ctaBanner, ...(data.ctaBanner || {}) },
        hireDevSection: { ...defaultData.hireDevSection, ...(data.hireDevSection || {}) },
        footer: { ...defaultData.footer, ...(data.footer || {}) },
        officeLocations: data.officeLocations || defaultData.officeLocations
      };
      setFormData(JSON.parse(JSON.stringify(merged)));
    }
  }, [data]);

  // Toast Notification helper
  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Save & Publish
  const handleSave = async () => {
    if (!formData) return;
    setSaving(true);
    try {
      await updateSiteData(formData);
      showToast('success', '✓ All changes published successfully and synchronized live!');
    } catch (err) {
      showToast('error', '❌ Error saving changes: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Keyboard shortcut: Ctrl + S / Cmd + S to save
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  // Restore Default Content
  const handleRestoreDefaults = async () => {
    if (!window.confirm('Are you sure you want to restore all website content and form fields to original defaults?')) {
      return;
    }
    setSaving(true);
    try {
      const restored = JSON.parse(JSON.stringify(defaultData));
      setFormData(restored);
      await updateSiteData(restored);
      showToast('success', '✓ Website content restored to original defaults successfully!');
    } catch (err) {
      showToast('error', '❌ Error restoring defaults: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Signout notice:', e.message);
      }
    }
    dispatch(logout());
    navigate('/admin/login');
  };

  const activeCmsSectionMeta = cmsSections.find((s) => s.id === activeCmsSection);

  if (loading || !formData) {
    return (
      <div className="min-h-screen bg-[#0c1d2e] flex flex-col items-center justify-center text-white space-y-4 font-sans">
        <div className="w-12 h-12 border-4 border-[#04A552]/30 border-t-[#04A552] rounded-full animate-spin"></div>
        <p className="text-sm font-semibold tracking-wide text-slate-300">
          Initializing Inexserv Admin Studio...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-800 selection:bg-[#04A552] selection:text-white">
      {/* 1. Full-Width Top Navbar covering complete line with website branding */}
      <AdminNavbar
        activeTabLabel={activeCmsSectionMeta?.label || 'Website Content'}
        activeSubLabel={null}
        isUsingSupabase={isUsingSupabase}
        isUsingBackend={isUsingBackend}
        saving={saving}
        onSave={handleSave}
        onRestoreDefault={handleRestoreDefaults}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
      />

      {/* 2. Body Area: 9 Website Sections Sidebar on left, Content Editor on right */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto p-4 gap-5">
        {/* Desktop 9 Sections Sidebar UNDER Navbar */}
        <div className="hidden lg:block sticky top-[4.75rem] h-[calc(100vh-5.75rem)] flex-shrink-0 z-40">
          <AdminSidebar
            activeCmsSection={activeCmsSection}
            setActiveCmsSection={setActiveCmsSection}
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            onLogout={handleLogout}
            cmsSections={cmsSections}
          />
        </div>

        {/* Mobile Drawer Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            ></div>
            <div className="relative z-10 w-72 h-full bg-[#0c1d2e] p-3">
              <AdminSidebar
                activeCmsSection={activeCmsSection}
                setActiveCmsSection={(sec) => {
                  setActiveCmsSection(sec);
                  setMobileMenuOpen(false);
                }}
                collapsed={false}
                setCollapsed={() => {}}
                onLogout={handleLogout}
                cmsSections={cmsSections}
              />
            </div>
          </div>
        )}

        {/* Right Main Section Editor Workspace */}
        <main className="flex-1 min-w-0">
          <AdminContentEditor
            activeSection={activeCmsSection}
            formData={formData}
            setFormData={setFormData}
            cmsSections={cmsSections}
          />
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-bold transition-all flex items-center gap-3 border ${
            toast.type === 'success'
              ? 'bg-[#0c1d2e] text-emerald-400 border-emerald-500/40 shadow-emerald-950/40'
              : 'bg-red-900 text-white border-red-700 shadow-red-950/40'
          }`}
        >
          <span>{toast.text}</span>
          <button
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-white text-sm ml-2"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
