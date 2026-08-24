import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { useSiteData } from '../hooks/useSiteData';
import { supabase } from '../lib/supabaseClient';
import defaultData from '../data/data.json';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, loading, isUsingSupabase, updateSiteData } = useSiteData();
  const [activeTab, setActiveTab] = useState('hero');
  const [formData, setFormData] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('ies_admin_auth') || localStorage.getItem('admin_token');
    if (!isAuth) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (data) {
      const merged = {
        ...defaultData,
        ...data,
        header: { ...defaultData.header, ...(data.header || {}) },
        hero: { ...defaultData.hero, ...(data.hero || {}) },
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

  if (loading || !formData) {
    return (
      <div className="min-h-screen bg-[#074476] flex items-center justify-center text-white">
        <p className="text-xl font-medium">Loading CMS Data...</p>
      </div>
    );
  }

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

  const handleSave = async () => {
    setSaving(true);
    setStatusMsg('');
    try {
      await updateSiteData(formData);
      setStatusMsg('✓ All content updated successfully and published live!');
    } catch (err) {
      setStatusMsg('❌ Error updating content: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleRestoreDefaultData = async () => {
    if (window.confirm('⚠️ Are you sure you want to restore all website content to its original default (data.json)? This will recover all deleted cards, categories, and text.')) {
      setSaving(true);
      setStatusMsg('');
      try {
        const restored = JSON.parse(JSON.stringify(defaultData));
        setFormData(restored);
        await updateSiteData(restored);
        setStatusMsg('✓ Website content successfully restored to original default data!');
      } catch (err) {
        setStatusMsg('❌ Error restoring default data: ' + err.message);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-[#074476] text-white py-4 px-8 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/images/inexserv-white.avif" alt="IES Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold border-l border-white/20 pl-4">Admin Content Manager (CMS)</span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${isUsingSupabase ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
            {isUsingSupabase ? '● Live REST API & DB Mode' : '▲ Local Fallback Mode'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRestoreDefaultData}
            disabled={saving}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-lg font-medium shadow transition-all cursor-pointer text-xs flex items-center gap-1.5"
            title="Recover all deleted cards and reset to original content"
          >
            🔄 Restore Original Default Data
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#04A552] hover:bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium shadow transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 text-sm"
          >
            {saving ? 'Publishing...' : '💾 Save & Publish All Changes'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main CMS Workspace */}
      <div className="flex-1 flex max-w-[1800px] w-full mx-auto p-6 gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-white rounded-xl shadow-md p-4 space-y-1.5 flex-shrink-0 h-fit sticky top-24">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-3">Website Sections</p>
          {[
            { id: 'header', label: '🔝 Header & Navbar' },
            { id: 'hero', label: '🚀 Hero & Partner Logos' },
            { id: 'services', label: '💼 Services Cards' },
            { id: 'solutions', label: '💡 Solutions (Founders/Enterprise)' },
            { id: 'tech', label: '⚙️ Tech Stack Categories' },
            { id: 'hire', label: '👨‍💻 Hire Developers' },
            { id: 'cta', label: '📢 CTA Banner' },
            { id: 'locations', label: '📍 Office Locations' },
            { id: 'footer', label: '🦶 Footer & Contacts' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#074476] text-white shadow'
                  : 'text-gray-700 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="pt-4 border-t border-gray-100 mt-4 space-y-2">
            <a href="/" target="_blank" rel="noreferrer" className="block text-center text-sm text-[#074476] font-semibold hover:underline">
              🔗 View Live Website ↗
            </a>
          </div>
        </aside>

        {/* Right Content Editor Area */}
        <main className="flex-1 bg-white rounded-xl shadow-md p-8 overflow-y-auto max-h-[85vh]">
          {statusMsg && (
            <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${statusMsg.startsWith('✓') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {statusMsg}
            </div>
          )}

          {/* 1. HEADER EDITOR */}
          {activeTab === 'header' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">Header & Navigation Editor</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Button Text</label>
                <input
                  type="text"
                  value={formData.header?.contactButtonText || ''}
                  onChange={(e) => setFormData({ ...formData, header: { ...formData.header, contactButtonText: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mega Menu Title</label>
                <input
                  type="text"
                  value={formData.header?.megaMenu?.title || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    header: { ...formData.header, megaMenu: { ...formData.header.megaMenu, title: e.target.value } }
                  })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mega Menu Description</label>
                <textarea
                  rows={2}
                  value={formData.header?.megaMenu?.description || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    header: { ...formData.header, megaMenu: { ...formData.header.megaMenu, description: e.target.value } }
                  })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>
            </div>
          )}

          {/* 2. HERO EDITOR */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">Hero Section Editor</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline Badge</label>
                <input
                  type="text"
                  value={formData.hero?.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, tagline: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline Line 1</label>
                <input
                  type="text"
                  value={formData.hero?.titleLine1 || ''}
                  onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, titleLine1: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline Line 2</label>
                <input
                  type="text"
                  value={formData.hero?.titleLine2 || ''}
                  onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, titleLine2: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraph</label>
                <textarea
                  rows={4}
                  value={formData.hero?.description || ''}
                  onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, description: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
