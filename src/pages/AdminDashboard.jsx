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
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header Bar */}
      <header className="bg-[#074476] text-white py-4 px-8 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-4">
          <img src="/images/inexserv-white.avif" alt="IES Logo" className="h-8 w-auto" />
          <span className="text-xl font-bold border-l border-white/20 pl-4">Content Management System (CMS)</span>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${isUsingSupabase ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
            {isUsingSupabase ? '● Live Supabase Connected' : '▲ Local Mode (Fallback data.json)'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#04A552] hover:bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium shadow transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Publishing...' : '💾 Save & Publish Changes'}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main CMS Container */}
      <div className="flex-1 flex max-w-[1800px] w-full mx-auto p-6 gap-6">
        {/* Left Navigation Tabs */}
        <aside className="w-64 bg-white rounded-xl shadow-md p-4 space-y-2 flex-shrink-0 h-fit">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Sections</p>
          {[
            { id: 'hero', label: '🚀 Hero Section' },
            { id: 'services', label: '💼 Services Section' },
            { id: 'solutions', label: '💡 Solutions Section' },
            { id: 'tech', label: '⚙️ Tech Stack & Hire Dev' },
            { id: 'cta', label: '📢 CTA Banner' },
            { id: 'footer', label: '📍 Contact & Footer Info' },
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
          <div className="pt-6 border-t border-gray-100">
            <a href="/" target="_blank" rel="noreferrer" className="block text-center text-sm text-[#074476] font-semibold hover:underline">
              🔗 View Live Website ↗
            </a>
          </div>
        </aside>

        {/* Right Editor Area */}
        <main className="flex-1 bg-white rounded-xl shadow-md p-8 overflow-y-auto max-h-[85vh]">
          {statusMsg && (
            <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${statusMsg.startsWith('✓') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
              {statusMsg}
            </div>
          )}

          {/* HERO EDITOR */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">Hero Section Editor</h3>

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
                  value={formData.hero.keywords.join(', ')}
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
            </div>
          )}

          {/* SERVICES EDITOR */}
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
                <h4 className="font-semibold text-gray-800">Services Cards:</h4>
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
                      className="w-full p-2 border rounded font-medium text-sm text-gray-800"
                    />
                    <textarea
                      rows={2}
                      value={serv.desc}
                      onChange={(e) => {
                        const updated = [...formData.servicesSection.services];
                        updated[idx].desc = e.target.value;
                        setFormData({ ...formData, servicesSection: { ...formData.servicesSection, services: updated } });
                      }}
                      className="w-full p-2 border rounded text-xs text-gray-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SOLUTIONS EDITOR */}
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

              <div className="space-y-4 pt-4">
                {formData.solutionsSection.solutions.map((sol, idx) => (
                  <div key={idx} className="p-4 border rounded-xl bg-slate-50 space-y-3">
                    <input
                      type="text"
                      value={sol.title}
                      onChange={(e) => {
                        const updated = [...formData.solutionsSection.solutions];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, solutionsSection: { ...formData.solutionsSection, solutions: updated } });
                      }}
                      className="w-full p-2 border rounded font-medium text-sm text-gray-800"
                    />
                    <textarea
                      rows={2}
                      value={sol.desc}
                      onChange={(e) => {
                        const updated = [...formData.solutionsSection.solutions];
                        updated[idx].desc = e.target.value;
                        setFormData({ ...formData, solutionsSection: { ...formData.solutionsSection, solutions: updated } });
                      }}
                      className="w-full p-2 border rounded text-xs text-gray-700"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TECH STACK EDITOR */}
          {activeTab === 'tech' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">Tech Stack & Hire Dev Editor</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack Heading Prefix</label>
                <input
                  type="text"
                  value={formData.techStackSection.titlePrefix}
                  onChange={(e) => setFormData({ ...formData, techStackSection: { ...formData.techStackSection, titlePrefix: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack Heading Highlight</label>
                <input
                  type="text"
                  value={formData.techStackSection.titleHighlight}
                  onChange={(e) => setFormData({ ...formData, techStackSection: { ...formData.techStackSection, titleHighlight: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>
            </div>
          )}

          {/* CTA BANNER EDITOR */}
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
            </div>
          )}

          {/* FOOTER EDITOR */}
          {activeTab === 'footer' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-[#0f2b48] border-b pb-2">Contact & Footer Info</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Strategic Consulting Paragraph</label>
                <textarea
                  rows={3}
                  value={formData.footer.strategicConsultingParagraph}
                  onChange={(e) => setFormData({ ...formData, footer: { ...formData.footer, strategicConsultingParagraph: e.target.value } })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Office Address (Oman)</label>
                <input
                  type="text"
                  value={formData.footer.contactInfo.address}
                  onChange={(e) => setFormData({
                    ...formData,
                    footer: { ...formData.footer, contactInfo: { ...formData.footer.contactInfo, address: e.target.value } }
                  })}
                  className="w-full p-3 border rounded-lg text-sm text-gray-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={formData.footer.contactInfo.phone}
                  onChange={(e) => setFormData({
                    ...formData,
                    footer: { ...formData.footer, contactInfo: { ...formData.footer.contactInfo, phone: e.target.value } }
                  })}
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
