import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSiteData } from '../hooks/useSiteData';
import { supabase } from '../lib/supabaseClient';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { data, loading, isUsingSupabase, updateSiteData } = useSiteData();
  const [activeTab, setActiveTab] = useState('hero');
  const [formData, setFormData] = useState(null);
  const [statusMsg, setStatusMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isAuth = localStorage.getItem('ies_admin_auth');
    if (!isAuth) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (data) {
      setFormData(JSON.parse(JSON.stringify(data)));
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
      await supabase.auth.signOut();
    }
    localStorage.removeItem('ies_admin_auth');
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Admin Header Bar */}
      <header className="bg-[#074476] text-white py-4 px-8 flex justify-between items-center shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <img src="/images/inexserv-white.avif" alt="IES Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold border-l border-white/20 pl-4">Admin Content Manager (CMS)</span>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${isUsingSupabase ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
            {isUsingSupabase ? '● Live Supabase Database' : '▲ Local Mode (Fallback data.json)'}
          </span>
        </div>
        <div className="flex items-center gap-4">
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
            { id: 'hero', label: '🚀 Hero & Marquee' },
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
          <div className="pt-4 border-t border-gray-100 mt-4">
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
                  value={formData.header.contactButtonText}
                  onChange={(e) => setFormData({ ...formData, header: { ...formData.header, contactButtonText: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mega Menu Title</label>
                <input
                  type="text"
                  value={formData.header.megaMenu.title}
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
                  value={formData.header.megaMenu.description}
                  onChange={(e) => setFormData({
                    ...formData,
                    header: { ...formData.header, megaMenu: { ...formData.header.megaMenu, description: e.target.value } }
                  })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div className="space-y-4 pt-2">
                <h4 className="font-semibold text-gray-800">Nav Bar Links:</h4>
                {formData.header.navLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-4 items-center bg-slate-50 p-3 rounded-lg border">
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const updated = [...formData.header.navLinks];
                        updated[idx].label = e.target.value;
                        setFormData({ ...formData, header: { ...formData.header, navLinks: updated } });
                      }}
                      className="w-1/2 p-2 border rounded text-sm text-gray-800"
                      placeholder="Label"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => {
                        const updated = [...formData.header.navLinks];
                        updated[idx].href = e.target.value;
                        setFormData({ ...formData, header: { ...formData.header, navLinks: updated } });
                      }}
                      className="w-1/2 p-2 border rounded text-sm text-gray-800"
                      placeholder="URL Path"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. HERO EDITOR */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">Hero Section & Marquee Editor</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.hero.tagline}
                  onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, tagline: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline Line 1</label>
                <input
                  type="text"
                  value={formData.hero.titleLine1}
                  onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, titleLine1: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Headline Line 2</label>
                <input
                  type="text"
                  value={formData.hero.titleLine2}
                  onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, titleLine2: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rotating Keywords (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.hero.keywords ? formData.hero.keywords.join(', ') : ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    hero: { ...formData.hero, keywords: e.target.value.split(',').map(s => s.trim()) }
                  })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Main Paragraph Description</label>
                <textarea
                  rows={4}
                  value={formData.hero.description}
                  onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, description: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button 1 Text</label>
                  <input
                    type="text"
                    value={formData.hero.ctaLetstalk || "Let's Talk"}
                    onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, ctaLetstalk: e.target.value } })}
                    className="w-full p-3 border rounded-lg text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CTA Button 2 Text</label>
                  <input
                    type="text"
                    value={formData.hero.ctaLearnMore || 'Learn More'}
                    onChange={(e) => setFormData({ ...formData, hero: { ...formData.hero, ctaLearnMore: e.target.value } })}
                    className="w-full p-3 border rounded-lg text-sm text-gray-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 3. SERVICES EDITOR */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">Services Section Editor</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={formData.servicesSection.title}
                  onChange={(e) => setFormData({ ...formData, servicesSection: { ...formData.servicesSection, title: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={formData.servicesSection.subtitle}
                  onChange={(e) => setFormData({ ...formData, servicesSection: { ...formData.servicesSection, subtitle: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="font-semibold text-gray-800">Services Cards (6 Items):</h4>
                {formData.servicesSection.services.map((serv, idx) => (
                  <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                    <input
                      type="text"
                      value={serv.title}
                      onChange={(e) => {
                        const updated = [...formData.servicesSection.services];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, servicesSection: { ...formData.servicesSection, services: updated } });
                      }}
                      className="w-full p-2.5 border rounded font-bold text-sm text-gray-800"
                      placeholder="Service Title"
                    />
                    <textarea
                      rows={3}
                      value={serv.desc}
                      onChange={(e) => {
                        const updated = [...formData.servicesSection.services];
                        updated[idx].desc = e.target.value;
                        setFormData({ ...formData, servicesSection: { ...formData.servicesSection, services: updated } });
                      }}
                      className="w-full p-2.5 border rounded text-xs text-gray-700"
                      placeholder="Service Description"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. SOLUTIONS EDITOR */}
          {activeTab === 'solutions' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">Solutions Section Editor</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                <input
                  type="text"
                  value={formData.solutionsSection.title}
                  onChange={(e) => setFormData({ ...formData, solutionsSection: { ...formData.solutionsSection, title: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section Subtitle</label>
                <input
                  type="text"
                  value={formData.solutionsSection.subtitle}
                  onChange={(e) => setFormData({ ...formData, solutionsSection: { ...formData.solutionsSection, subtitle: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="font-semibold text-gray-800">Stage Solution Cards (3 Cards):</h4>
                {formData.solutionsSection.solutions.map((sol, idx) => (
                  <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                    <div className="flex gap-4">
                      <input
                        type="text"
                        value={sol.subtitle}
                        onChange={(e) => {
                          const updated = [...formData.solutionsSection.solutions];
                          updated[idx].subtitle = e.target.value;
                          setFormData({ ...formData, solutionsSection: { ...formData.solutionsSection, solutions: updated } });
                        }}
                        className="w-1/3 p-2.5 border rounded text-xs text-gray-700"
                        placeholder="Tag (e.g. I'm a)"
                      />
                      <input
                        type="text"
                        value={sol.title}
                        onChange={(e) => {
                          const updated = [...formData.solutionsSection.solutions];
                          updated[idx].title = e.target.value;
                          setFormData({ ...formData, solutionsSection: { ...formData.solutionsSection, solutions: updated } });
                        }}
                        className="w-2/3 p-2.5 border rounded font-bold text-sm text-gray-800"
                        placeholder="Title"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={sol.desc}
                      onChange={(e) => {
                        const updated = [...formData.solutionsSection.solutions];
                        updated[idx].desc = e.target.value;
                        setFormData({ ...formData, solutionsSection: { ...formData.solutionsSection, solutions: updated } });
                      }}
                      className="w-full p-2.5 border rounded text-xs text-gray-700"
                      placeholder="Description"
                    />
                    <input
                      type="text"
                      value={sol.buttonText}
                      onChange={(e) => {
                        const updated = [...formData.solutionsSection.solutions];
                        updated[idx].buttonText = e.target.value;
                        setFormData({ ...formData, solutionsSection: { ...formData.solutionsSection, solutions: updated } });
                      }}
                      className="w-full p-2.5 border rounded text-xs font-semibold text-sky-700"
                      placeholder="Button Text"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. TECH STACK EDITOR */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">Tech Stack Categories Editor</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heading Prefix</label>
                  <input
                    type="text"
                    value={formData.techStackSection.titlePrefix}
                    onChange={(e) => setFormData({ ...formData, techStackSection: { ...formData.techStackSection, titlePrefix: e.target.value } })}
                    className="w-full p-3 border rounded-lg text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heading Highlight</label>
                  <input
                    type="text"
                    value={formData.techStackSection.titleHighlight}
                    onChange={(e) => setFormData({ ...formData, techStackSection: { ...formData.techStackSection, titleHighlight: e.target.value } })}
                    className="w-full p-3 border rounded-lg text-sm text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.techStackSection.subtitle}
                  onChange={(e) => setFormData({ ...formData, techStackSection: { ...formData.techStackSection, subtitle: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div className="space-y-4 pt-4">
                <h4 className="font-semibold text-gray-800">Tech Categories (6 Categories):</h4>
                {formData.techStackSection.categories.map((cat, idx) => (
                  <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                    <input
                      type="text"
                      value={cat.title}
                      onChange={(e) => {
                        const updated = [...formData.techStackSection.categories];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, techStackSection: { ...formData.techStackSection, categories: updated } });
                      }}
                      className="w-full p-2.5 border rounded font-bold text-sm text-gray-800"
                      placeholder="Category Title"
                    />
                    <textarea
                      rows={2}
                      value={cat.desc}
                      onChange={(e) => {
                        const updated = [...formData.techStackSection.categories];
                        updated[idx].desc = e.target.value;
                        setFormData({ ...formData, techStackSection: { ...formData.techStackSection, categories: updated } });
                      }}
                      className="w-full p-2.5 border rounded text-xs text-gray-700"
                      placeholder="Category Description"
                    />
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Bullets (Comma Separated)</label>
                      <input
                        type="text"
                        value={cat.bullets ? cat.bullets.join(', ') : ''}
                        onChange={(e) => {
                          const updated = [...formData.techStackSection.categories];
                          updated[idx].bullets = e.target.value.split(',').map(s => s.trim());
                          setFormData({ ...formData, techStackSection: { ...formData.techStackSection, categories: updated } });
                        }}
                        className="w-full p-2 border rounded text-xs text-gray-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. HIRE DEV EDITOR */}
          {activeTab === 'hire' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">Hire Developers Section Editor</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title Part 1</label>
                  <input
                    type="text"
                    value={formData.hireDevSection.titlePart1}
                    onChange={(e) => setFormData({ ...formData, hireDevSection: { ...formData.hireDevSection, titlePart1: e.target.value } })}
                    className="w-full p-3 border rounded-lg text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title Part 2</label>
                  <input
                    type="text"
                    value={formData.hireDevSection.titlePart2}
                    onChange={(e) => setFormData({ ...formData, hireDevSection: { ...formData.hireDevSection, titlePart2: e.target.value } })}
                    className="w-full p-3 border rounded-lg text-sm text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search Placeholder</label>
                <input
                  type="text"
                  value={formData.hireDevSection.searchPlaceholder}
                  onChange={(e) => setFormData({ ...formData, hireDevSection: { ...formData.hireDevSection, searchPlaceholder: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description Paragraph</label>
                <textarea
                  rows={3}
                  value={formData.hireDevSection.description}
                  onChange={(e) => setFormData({ ...formData, hireDevSection: { ...formData.hireDevSection, description: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>
            </div>
          )}

          {/* 7. CTA BANNER EDITOR */}
          {activeTab === 'cta' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">CTA Banner Editor</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title Line 1</label>
                <input
                  type="text"
                  value={formData.ctaBanner.titleLine1}
                  onChange={(e) => setFormData({ ...formData, ctaBanner: { ...formData.ctaBanner, titleLine1: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Title Line 2</label>
                <input
                  type="text"
                  value={formData.ctaBanner.titleLine2}
                  onChange={(e) => setFormData({ ...formData, ctaBanner: { ...formData.ctaBanner, titleLine2: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paragraph</label>
                <textarea
                  rows={3}
                  value={formData.ctaBanner.paragraph}
                  onChange={(e) => setFormData({ ...formData, ctaBanner: { ...formData.ctaBanner, paragraph: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                <input
                  type="text"
                  value={formData.ctaBanner.buttonText}
                  onChange={(e) => setFormData({ ...formData, ctaBanner: { ...formData.ctaBanner, buttonText: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>
            </div>
          )}

          {/* 8. LOCATIONS EDITOR */}
          {activeTab === 'locations' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">Office Locations (USA, UAE, OMAN)</h3>
              {formData.officeLocations.map((loc, idx) => (
                <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                  <h4 className="font-bold text-gray-800 text-base">{loc.country} Office</h4>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Address</label>
                    <input
                      type="text"
                      value={loc.address}
                      onChange={(e) => {
                        const updated = [...formData.officeLocations];
                        updated[idx].address = e.target.value;
                        setFormData({ ...formData, officeLocations: updated });
                      }}
                      className="w-full p-2.5 border rounded text-xs text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={loc.phone}
                      onChange={(e) => {
                        const updated = [...formData.officeLocations];
                        updated[idx].phone = e.target.value;
                        setFormData({ ...formData, officeLocations: updated });
                      }}
                      className="w-full p-2.5 border rounded text-xs text-gray-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 9. FOOTER EDITOR */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">Footer & Contact Details</h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Banner Title</label>
                <input
                  type="text"
                  value={formData.footer.consultationTitle}
                  onChange={(e) => setFormData({ ...formData, footer: { ...formData.footer, consultationTitle: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultation Description</label>
                <textarea
                  rows={2}
                  value={formData.footer.consultationDesc}
                  onChange={(e) => setFormData({ ...formData, footer: { ...formData.footer, consultationDesc: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Strategic Consulting Paragraph</label>
                <textarea
                  rows={3}
                  value={formData.footer.strategicConsultingParagraph}
                  onChange={(e) => setFormData({ ...formData, footer: { ...formData.footer, strategicConsultingParagraph: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email(s)</label>
                  <input
                    type="text"
                    value={formData.footer.contactInfo.emails ? formData.footer.contactInfo.emails.join(', ') : ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      footer: {
                        ...formData.footer,
                        contactInfo: {
                          ...formData.footer.contactInfo,
                          emails: e.target.value.split(',').map(s => s.trim())
                        }
                      }
                    })}
                    className="w-full p-3 border rounded-lg text-sm text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                  <input
                    type="text"
                    value={formData.footer.contactInfo.phone}
                    onChange={(e) => setFormData({
                      ...formData,
                      footer: {
                        ...formData.footer,
                        contactInfo: { ...formData.footer.contactInfo, phone: e.target.value }
                      }
                    })}
                    className="w-full p-3 border rounded-lg text-sm text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Statement</label>
                <input
                  type="text"
                  value={formData.footer.copyright}
                  onChange={(e) => setFormData({ ...formData, footer: { ...formData.footer, copyright: e.target.value } })}
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
