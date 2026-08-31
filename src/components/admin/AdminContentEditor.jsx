import React, { useState } from 'react';
import {
  Sparkles,
  Layers,
  Globe,
  Plus,
  Trash2,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  Briefcase,
  Code2,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  FileText,
  Zap,
  ArrowUp,
  ArrowDown,
  Edit3,
  Eye,
  Sliders,
  Send,
  RotateCcw
} from 'lucide-react';
import AdminImageUpload from './AdminImageUpload';
import defaultData from '../../data/data.json';

export default function AdminContentEditor({
  activeSection,
  formData,
  setFormData,
  cmsSections = []
}) {
  const currentSectionMeta = cmsSections.find((s) => s.id === activeSection) || cmsSections[0];

  // Dynamic Form Builder State
  const [newField, setNewField] = useState({
    label: '',
    subLabel: '',
    name: '',
    type: 'text',
    placeholder: '',
    required: false,
    halfWidth: true,
    options: ''
  });
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [editingFieldId, setEditingFieldId] = useState(null);

  // Helper to safely update top-level section data
  const updateSection = (sectionKey, updater) => {
    setFormData((prev) => {
      const current = prev[sectionKey] || {};
      const updated = typeof updater === 'function' ? updater(current) : updater;
      return {
        ...prev,
        [sectionKey]: updated
      };
    });
  };

  const updateByPath = (path, value) => {
    setFormData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      let curr = copy;
      for (let i = 0; i < path.length - 1; i++) {
        curr = curr[path[i]];
      }
      curr[path[path.length - 1]] = value;
      return copy;
    });
  };

  const formatFieldLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase());
  };

  // Helper to detect if a field represents an image, icon, logo, or banner
  const isImageField = (key, val) => {
    const k = String(key || '').toLowerCase();
    const isKeyMatch =
      k.includes('icon') ||
      k.includes('img') ||
      k.includes('image') ||
      k.includes('src') ||
      k.includes('logo') ||
      k.includes('avatar') ||
      k.includes('bgimage') ||
      k.includes('photo') ||
      k.includes('banner') ||
      k.includes('thumbnail');

    const isValMatch =
      typeof val === 'string' &&
      (val.startsWith('/images/') ||
        val.startsWith('/uploads/') ||
        val.includes('supabase.co/storage') ||
        val.endsWith('.svg') ||
        val.endsWith('.png') ||
        val.endsWith('.webp') ||
        val.endsWith('.avif') ||
        val.endsWith('.jpg') ||
        val.endsWith('.jpeg'));

    return isKeyMatch || isValMatch;
  };

  // Section 1: HEADER & NAVIGATION EDITOR
  const renderHeaderEditor = () => {
    const header = formData.header || {};
    const megaMenu = header.megaMenu || { items: [] };

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-[#0f2b48] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#04A552]" />
            <span>General Header Settings</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                CTA Contact Button Text
              </label>
              <input
                type="text"
                value={header.contactButtonText || ''}
                onChange={(e) =>
                  updateSection('header', (h) => ({ ...h, contactButtonText: e.target.value }))
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mega Menu Heading Title
              </label>
              <input
                type="text"
                value={megaMenu.title || ''}
                onChange={(e) =>
                  updateSection('header', (h) => ({
                    ...h,
                    megaMenu: { ...(h.megaMenu || {}), title: e.target.value }
                  }))
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Mega Menu Description
            </label>
            <textarea
              rows={2}
              value={megaMenu.description || ''}
              onChange={(e) =>
                updateSection('header', (h) => ({
                  ...h,
                  megaMenu: { ...(h.megaMenu || {}), description: e.target.value }
                }))
              }
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
            />
          </div>
        </div>

        {/* Mega Menu Items with Supabase Image Uploader */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#0f2b48]">
                Mega Menu Service Items ({megaMenu.items?.length || 0})
              </h4>
              <p className="text-xs text-slate-400">
                Dropdown services appearing in the top navigation mega menu
              </p>
            </div>
            <button
              onClick={() => {
                const items = megaMenu.items ? [...megaMenu.items] : [];
                items.push({
                  href: '/services/new-service',
                  label: 'New Service Item',
                  desc: 'Short description of the new service.',
                  img: '/images/servisec-manu/webdevelopment.svg'
                });
                updateSection('header', (h) => ({
                  ...h,
                  megaMenu: { ...(h.megaMenu || {}), items }
                }));
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#04A552] text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-600 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Service Item</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(megaMenu.items || []).map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#074476]">Item #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const items = megaMenu.items.filter((_, i) => i !== idx);
                      updateSection('header', (h) => ({
                        ...h,
                        megaMenu: { ...(h.megaMenu || {}), items }
                      }));
                    }}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Label
                    </label>
                    <input
                      type="text"
                      value={item.label || ''}
                      onChange={(e) => {
                        const items = [...megaMenu.items];
                        items[idx] = { ...items[idx], label: e.target.value };
                        updateSection('header', (h) => ({
                          ...h,
                          megaMenu: { ...(h.megaMenu || {}), items }
                        }));
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Link (URL)
                    </label>
                    <input
                      type="text"
                      value={item.href || ''}
                      onChange={(e) => {
                        const items = [...megaMenu.items];
                        items[idx] = { ...items[idx], href: e.target.value };
                        updateSection('header', (h) => ({
                          ...h,
                          megaMenu: { ...(h.megaMenu || {}), items }
                        }));
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                    />
                  </div>
                </div>

                {/* Supabase Image Uploader for Mega Menu Icon */}
                <AdminImageUpload
                  label="Service Icon / Image"
                  value={item.img || ''}
                  onChange={(newUrl) => {
                    const items = [...megaMenu.items];
                    items[idx] = { ...items[idx], img: newUrl };
                    updateSection('header', (h) => ({
                      ...h,
                      megaMenu: { ...(h.megaMenu || {}), items }
                    }));
                  }}
                  hint="Upload SVG or PNG icon to Supabase bucket"
                />

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={item.desc || ''}
                    onChange={(e) => {
                      const items = [...megaMenu.items];
                      items[idx] = { ...items[idx], desc: e.target.value };
                      updateSection('header', (h) => ({
                        ...h,
                        megaMenu: { ...(h.megaMenu || {}), items }
                      }));
                    }}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Section 2: HERO SECTION EDITOR
  const renderHeroEditor = () => {
    const hero = formData.hero || {};
    const keywords = hero.keywords || [];
    const partnerLogos = hero.partnerLogos || [];

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-[#0f2b48] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#04A552]" />
            <span>Hero Headline &amp; Tagline</span>
          </h4>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tagline Badge
            </label>
            <input
              type="text"
              value={hero.tagline || ''}
              onChange={(e) => updateSection('hero', (h) => ({ ...h, tagline: e.target.value }))}
              placeholder="e.g. Transforming Ideas into Impactful Software"
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headline Line 1
              </label>
              <input
                type="text"
                value={hero.titleLine1 || ''}
                onChange={(e) =>
                  updateSection('hero', (h) => ({ ...h, titleLine1: e.target.value }))
                }
                placeholder="Innovate. Accelerate. Succeed."
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Headline Line 2 (Highlighted)
              </label>
              <input
                type="text"
                value={hero.titleLine2 || ''}
                onChange={(e) =>
                  updateSection('hero', (h) => ({ ...h, titleLine2: e.target.value }))
                }
                placeholder="Empowering Your Vision"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Hero Description Paragraph
            </label>
            <textarea
              rows={4}
              value={hero.description || ''}
              onChange={(e) =>
                updateSection('hero', (h) => ({ ...h, description: e.target.value }))
              }
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
            />
          </div>

          {/* Keywords Array / Badges */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Hero Floating Animated Keywords
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {keywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>{kw}</span>
                  <button
                    onClick={() => {
                      const next = keywords.filter((_, idx) => idx !== i);
                      updateSection('hero', (h) => ({ ...h, keywords: next }));
                    }}
                    className="text-emerald-500 hover:text-red-500 cursor-pointer"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                id="newKeywordInput"
                placeholder="Add keyword (e.g. AI, DevOps, Blockchain)..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.target.value.trim()) {
                    e.preventDefault();
                    updateSection('hero', (h) => ({
                      ...h,
                      keywords: [...(h.keywords || []), e.target.value.trim()]
                    }));
                    e.target.value = '';
                  }
                }}
                className="flex-1 p-2 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById('newKeywordInput');
                  if (input && input.value.trim()) {
                    updateSection('hero', (h) => ({
                      ...h,
                      keywords: [...(h.keywords || []), input.value.trim()]
                    }));
                    input.value = '';
                  }
                }}
                className="px-3.5 py-2 bg-[#04A552] text-white rounded-xl text-xs font-bold hover:bg-emerald-600 cursor-pointer"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Partner Logos Carousel Management */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-[#0f2b48]">
                Partner &amp; Client Logos ({partnerLogos.length})
              </h4>
              <p className="text-xs text-slate-400">
                Logos scrolling in the infinite marquee under the hero headline
              </p>
            </div>
            <button
              onClick={() => {
                const next = [...partnerLogos];
                next.push({
                  name: 'New Partner',
                  src: '/images/oracle.png'
                });
                updateSection('hero', (h) => ({ ...h, partnerLogos: next }));
              }}
              className="px-3.5 py-1.5 bg-[#04A552] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-600 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Partner Logo</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {partnerLogos.map((logo, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#074476]">Logo #{idx + 1}</span>
                  <button
                    onClick={() => {
                      const next = partnerLogos.filter((_, i) => i !== idx);
                      updateSection('hero', (h) => ({ ...h, partnerLogos: next }));
                    }}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Partner Name
                  </label>
                  <input
                    type="text"
                    value={logo.name || ''}
                    onChange={(e) => {
                      const next = [...partnerLogos];
                      next[idx] = { ...next[idx], name: e.target.value };
                      updateSection('hero', (h) => ({ ...h, partnerLogos: next }));
                    }}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                  />
                </div>

                <AdminImageUpload
                  label="Partner Logo Image"
                  value={logo.src || ''}
                  onChange={(newUrl) => {
                    const next = [...partnerLogos];
                    next[idx] = { ...next[idx], src: newUrl };
                    updateSection('hero', (h) => ({ ...h, partnerLogos: next }));
                  }}
                  hint="Upload partner logo to Supabase bucket"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Section 3: SERVICES SECTION EDITOR
  const renderServicesEditor = () => {
    const sec = formData.servicesSection || {};
    const services = sec.services || [];

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h4 className="text-sm font-bold text-[#0f2b48]">Section Intro &amp; Header</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Title
              </label>
              <input
                type="text"
                value={sec.title || ''}
                onChange={(e) =>
                  updateSection('servicesSection', (s) => ({ ...s, title: e.target.value }))
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Subtitle / Description
              </label>
              <input
                type="text"
                value={sec.subtitle || ''}
                onChange={(e) =>
                  updateSection('servicesSection', (s) => ({ ...s, subtitle: e.target.value }))
                }
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Services Cards with Supabase Image Uploader */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-[#0f2b48]">
              Service Offerings Cards ({services.length})
            </h4>
            <button
              onClick={() => {
                const next = [...services];
                next.push({
                  title: 'New Service Card',
                  desc: 'Comprehensive software development and digital transformation.',
                  img: '/images/servisec-manu/webdevelopment.svg',
                  href: '/services/new-service'
                });
                updateSection('servicesSection', (s) => ({ ...s, services: next }));
              }}
              className="px-3.5 py-1.5 bg-[#04A552] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-600 shadow-sm cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Service Card</span>
            </button>
          </div>

          <div className="space-y-4">
            {services.map((srv, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#074476] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#074476] text-white flex items-center justify-center text-[10px]">
                      {idx + 1}
                    </span>
                    <span>{srv.title || 'Untitled Card'}</span>
                  </span>
                  <button
                    onClick={() => {
                      const next = services.filter((_, i) => i !== idx);
                      updateSection('servicesSection', (s) => ({ ...s, services: next }));
                    }}
                    className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Card Title
                    </label>
                    <input
                      type="text"
                      value={srv.title || ''}
                      onChange={(e) => {
                        const next = [...services];
                        next[idx] = { ...next[idx], title: e.target.value };
                        updateSection('servicesSection', (s) => ({ ...s, services: next }));
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                      Link URL (href)
                    </label>
                    <input
                      type="text"
                      value={srv.href || ''}
                      onChange={(e) => {
                        const next = [...services];
                        next[idx] = { ...next[idx], href: e.target.value };
                        updateSection('servicesSection', (s) => ({ ...s, services: next }));
                      }}
                      className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                    />
                  </div>
                </div>

                {/* Supabase Image Uploader for Service Card Icon (srv.img or srv.icon) */}
                <AdminImageUpload
                  label="Service Icon / SVG"
                  value={srv.img || srv.icon || ''}
                  onChange={(newUrl) => {
                    const next = [...services];
                    next[idx] = { ...next[idx], img: newUrl, icon: newUrl };
                    updateSection('servicesSection', (s) => ({ ...s, services: next }));
                  }}
                  hint="Upload card icon to Supabase bucket"
                />

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-0.5">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={srv.desc || srv.description || ''}
                    onChange={(e) => {
                      const next = [...services];
                      next[idx] = { ...next[idx], desc: e.target.value, description: e.target.value };
                      updateSection('servicesSection', (s) => ({ ...s, services: next }));
                    }}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white text-slate-800"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Section 4: GENERAL RECURSIVE RENDERER FOR OTHER SECTIONS (Solutions, Tech Stack, CTA, Locations, Footer, etc.)
  const renderGenericFields = (val, path = [], label = '') => {
    const lastKey = path[path.length - 1];

    // Check if current field is an image/icon/logo
    if (typeof val === 'string' && isImageField(lastKey, val)) {
      return (
        <div className="my-2">
          <AdminImageUpload
            label={label || formatFieldLabel(String(lastKey))}
            value={val ?? ''}
            onChange={(newUrl) => updateByPath(path, newUrl)}
          />
        </div>
      );
    }

    if (Array.isArray(val)) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            {label && <h4 className="text-xs font-bold text-[#0f2b48]">{label} ({val.length})</h4>}
            <button
              type="button"
              onClick={() => {
                const sample =
                  val.length > 0 && typeof val[0] === 'object'
                    ? JSON.parse(JSON.stringify(val[0]))
                    : 'New Item';
                const nextArr = [...val, sample];
                updateByPath(path, nextArr);
              }}
              className="px-2.5 py-1 bg-[#04A552] text-white rounded-lg text-[11px] font-bold hover:bg-emerald-600 flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {val.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative"
              >
                <div className="flex items-center justify-between pb-1 border-b border-slate-200/60">
                  <span className="text-[11px] font-bold text-[#074476]">
                    {label ? `${label} #${idx + 1}` : `Item #${idx + 1}`}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const nextArr = val.filter((_, i) => i !== idx);
                      updateByPath(path, nextArr);
                    }}
                    className="text-[11px] text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Remove</span>
                  </button>
                </div>
                {renderGenericFields(item, [...path, idx], '')}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (val && typeof val === 'object') {
      return (
        <div className="space-y-4">
          {label && <h4 className="text-xs font-bold text-[#0f2b48]">{label}</h4>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(val).map(([subKey, subVal]) => (
              <div
                key={subKey}
                className={
                  typeof subVal === 'object' ||
                  (typeof subVal === 'string' && (subVal.length > 100 || isImageField(subKey, subVal)))
                    ? 'md:col-span-2'
                    : ''
                }
              >
                {renderGenericFields(subVal, [...path, subKey], formatFieldLabel(subKey))}
              </div>
            ))}
          </div>
        </div>
      );
    }

    const isLongText = typeof val === 'string' && val.length > 100;
    return (
      <div>
        {label && (
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">{label}</label>
        )}
        {isLongText ? (
          <textarea
            rows={3}
            value={val ?? ''}
            onChange={(e) => updateByPath(path, e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:border-[#04A552]"
          />
        ) : (
          <input
            type="text"
            value={val ?? ''}
            onChange={(e) => updateByPath(path, e.target.value)}
            className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-800 focus:outline-none focus:border-[#04A552]"
          />
        )}
      </div>
    );
  };

  // Section: CONTACT US & DYNAMIC FORM BUILDER EDITOR
  const renderContactUsEditor = () => {
    const contact = formData.contactUs || {};
    const directContact = contact.directContact || {};
    const formConfig = contact.formConfig || {};
    const fields = formConfig.fields || [];

    const handleAddField = () => {
      if (!newField.label.trim()) {
        alert('Please enter a field label');
        return;
      }
      const generatedName =
        newField.name.trim() ||
        newField.label
          .toLowerCase()
          .replace(/[^a-z0-9]/g, '_')
          .replace(/^_+|_+$/g, '');

      const parsedOptions =
        newField.type === 'select'
          ? typeof newField.options === 'string'
            ? newField.options
                .split(',')
                .map((o) => o.trim())
                .filter(Boolean)
            : newField.options
          : undefined;

      const finalOptions =
        newField.type === 'select'
          ? parsedOptions && parsedOptions.length > 0
            ? parsedOptions
            : ['Option 1', 'Option 2', 'Option 3']
          : undefined;

      const fieldObj = {
        id: `field_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        name: generatedName,
        label: newField.label.trim(),
        subLabel: newField.subLabel ? newField.subLabel.trim() : undefined,
        type: newField.type || 'text',
        placeholder: newField.placeholder || '',
        required: Boolean(newField.required),
        halfWidth: Boolean(newField.halfWidth),
        ...(finalOptions && { options: finalOptions })
      };

      updateSection('contactUs', (c) => {
        const currFields = (c.formConfig && c.formConfig.fields) || [];
        return {
          ...c,
          formConfig: {
            ...(c.formConfig || {}),
            fields: [...currFields, fieldObj]
          }
        };
      });

      setNewField({
        label: '',
        subLabel: '',
        name: '',
        type: 'text',
        placeholder: '',
        required: false,
        halfWidth: true,
        options: ''
      });
      setShowAddFieldModal(false);
    };

    const handleDeleteField = (fieldId) => {
      if (!window.confirm('Are you sure you want to remove this form field?')) return;
      updateSection('contactUs', (c) => {
        const currFields = (c.formConfig && c.formConfig.fields) || [];
        return {
          ...c,
          formConfig: {
            ...(c.formConfig || {}),
            fields: currFields.filter((f) => f.id !== fieldId)
          }
        };
      });
    };

    const handleMoveField = (index, direction) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= fields.length) return;
      updateSection('contactUs', (c) => {
        const currFields = [...((c.formConfig && c.formConfig.fields) || [])];
        const temp = currFields[index];
        currFields[index] = currFields[targetIndex];
        currFields[targetIndex] = temp;
        return {
          ...c,
          formConfig: {
            ...(c.formConfig || {}),
            fields: currFields
          }
        };
      });
    };

    const handleUpdateFieldProp = (fieldId, propKey, propVal) => {
      updateSection('contactUs', (c) => {
        const currFields = ((c.formConfig && c.formConfig.fields) || []).map((f) => {
          if (f.id === fieldId) {
            return { ...f, [propKey]: propVal };
          }
          return f;
        });
        return {
          ...c,
          formConfig: {
            ...(c.formConfig || {}),
            fields: currFields
          }
        };
      });
    };

    return (
      <div className="space-y-6">
        {/* 1. Form General Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-[#074476]" />
            <h4 className="text-sm font-bold text-[#0f2b48]">Form General Settings</h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Form Heading</label>
              <input
                type="text"
                value={formConfig.formTitle || 'Send us a message'}
                onChange={(e) =>
                  updateSection('contactUs', (c) => ({
                    ...c,
                    formConfig: { ...(c.formConfig || {}), formTitle: e.target.value }
                  }))
                }
                placeholder="e.g. Send us a message"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Submit Button Text</label>
              <input
                type="text"
                value={formConfig.submitButtonText || 'SEND INQUIRY'}
                onChange={(e) =>
                  updateSection('contactUs', (c) => ({
                    ...c,
                    formConfig: { ...(c.formConfig || {}), submitButtonText: e.target.value }
                  }))
                }
                placeholder="e.g. SEND INQUIRY"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Response Guarantee Text</label>
              <input
                type="text"
                value={contact.responseSla || 'Guaranteed Response < 2 Hours'}
                onChange={(e) =>
                  updateSection('contactUs', (c) => ({ ...c, responseSla: e.target.value }))
                }
                placeholder="e.g. Guaranteed Response < 2 Hours"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Success Title</label>
              <input
                type="text"
                value={formConfig.successTitle || 'Inquiry Received!'}
                onChange={(e) =>
                  updateSection('contactUs', (c) => ({
                    ...c,
                    formConfig: { ...(c.formConfig || {}), successTitle: e.target.value }
                  }))
                }
                placeholder="e.g. Inquiry Received!"
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Success Message</label>
              <input
                type="text"
                value={
                  formConfig.successMessage ||
                  'Thank you for reaching out. An executive consultant has received your inquiry and will get in touch within 2 hours.'
                }
                onChange={(e) =>
                  updateSection('contactUs', (c) => ({
                    ...c,
                    formConfig: { ...(c.formConfig || {}), successMessage: e.target.value }
                  }))
                }
                placeholder="Thank you message displayed after submission..."
                className="w-full p-2.5 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552]"
              />
            </div>
          </div>
        </div>

        {/* 3. DYNAMIC FORM BUILDER */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-[#0f2b48] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#04A552]" />
                <span>Dynamic Form Fields Builder ({fields.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Add, reorder, configure required validation, or remove fields. All changes sync live to Supabase.
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to restore all form fields to standard defaults?')) {
                    const defaultFields = defaultData.contactUs.formConfig.fields;
                    updateSection('contactUs', (c) => ({
                      ...c,
                      formConfig: {
                        ...(c.formConfig || {}),
                        fields: JSON.parse(JSON.stringify(defaultFields))
                      }
                    }));
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 cursor-pointer shadow-sm"
                title="Restore standard default form fields"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                <span>Restore Default Fields</span>
              </button>
              <button
                type="button"
                onClick={() => setShowAddFieldModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#04A552] hover:bg-emerald-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Field</span>
              </button>
            </div>
          </div>

          {/* Add Field Modal / Expandable Box */}
          {showAddFieldModal && (
            <div className="p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-[#04A552] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#074476] uppercase tracking-wider">
                  Create New Form Field
                </span>
                <button
                  onClick={() => setShowAddFieldModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
                >
                  ✕ Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Field Label *</label>
                  <input
                    type="text"
                    placeholder="e.g. First Name"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#04A552]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Sub-label (e.g. First, Last)</label>
                  <input
                    type="text"
                    placeholder="e.g. First"
                    value={newField.subLabel}
                    onChange={(e) => setNewField({ ...newField, subLabel: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#04A552]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Field Key (API Name)</label>
                  <input
                    type="text"
                    placeholder="e.g. firstName"
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#04A552]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Input Type</label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#04A552]"
                  >
                    <option value="text">Text (Single Line)</option>
                    <option value="email">Email Address</option>
                    <option value="tel">Phone / Mobile</option>
                    <option value="select">Dropdown Select</option>
                    <option value="textarea">Textarea (Multi-line)</option>
                    <option value="number">Number</option>
                    <option value="checkbox">Checkbox (Yes/No)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Placeholder Text</label>
                  <input
                    type="text"
                    placeholder="e.g. Select your budget range..."
                    value={newField.placeholder}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#04A552]"
                  />
                </div>

                {newField.type === 'select' && (
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Dropdown Options (comma-separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. <$10k, $10k-$50k, $50k-$100k, $100k+"
                      value={newField.options}
                      onChange={(e) => setNewField({ ...newField, options: e.target.value })}
                      className="w-full p-2 border border-slate-200 rounded-xl text-xs bg-white focus:outline-none focus:border-[#04A552]"
                    />
                  </div>
                )}

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newField.required}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                      className="w-4 h-4 text-[#04A552] rounded border-slate-300 focus:ring-[#04A552]"
                    />
                    <span className="text-xs font-semibold text-slate-700">Required Field</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newField.halfWidth}
                      onChange={(e) => setNewField({ ...newField, halfWidth: e.target.checked })}
                      className="w-4 h-4 text-[#04A552] rounded border-slate-300 focus:ring-[#04A552]"
                    />
                    <span className="text-xs font-semibold text-slate-700">Half Width (Grid)</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleAddField}
                  className="px-4 py-2 bg-[#04A552] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow cursor-pointer"
                >
                  Save &amp; Add Field
                </button>
              </div>
            </div>
          )}

          {/* Form Fields List */}
          <div className="space-y-3">
            {fields.map((field, idx) => {
              const isEditing = editingFieldId === field.id;

              return (
                <div
                  key={field.id || idx}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-[#074476] text-xs font-extrabold flex items-center justify-center flex-shrink-0 shadow-sm">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#0f2b48] truncate">
                            {field.label}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 font-mono">
                            {field.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 block truncate">
                          Placeholder: {field.placeholder || 'None'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Type Badge */}
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-700 uppercase">
                        {field.type}
                      </span>

                      {/* Required Toggle Badge */}
                      <button
                        type="button"
                        onClick={() => handleUpdateFieldProp(field.id, 'required', !field.required)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md cursor-pointer transition-colors ${
                          field.required
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                        title="Click to toggle required status"
                      >
                        {field.required ? 'Required *' : 'Optional'}
                      </button>

                      {/* Width Badge */}
                      <button
                        type="button"
                        onClick={() => handleUpdateFieldProp(field.id, 'halfWidth', !field.halfWidth)}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-700 cursor-pointer hover:bg-purple-200 transition-colors"
                        title="Click to toggle between Half Width and Full Width"
                      >
                        {field.halfWidth ? 'Half Width (1/2)' : 'Full Width (1/1)'}
                      </button>

                      {/* Move Up / Down */}
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveField(idx, -1)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#074476] disabled:opacity-30 cursor-pointer shadow-sm"
                        title="Move Field Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === fields.length - 1}
                        onClick={() => handleMoveField(idx, 1)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-[#074476] disabled:opacity-30 cursor-pointer shadow-sm"
                        title="Move Field Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit Inline Toggle */}
                      <button
                        type="button"
                        onClick={() => setEditingFieldId(isEditing ? null : field.id)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 hover:text-emerald-600 cursor-pointer shadow-sm"
                        title="Edit Field Configuration"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDeleteField(field.id)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 cursor-pointer shadow-sm"
                        title="Delete Field"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Edit Form */}
                  {isEditing && (
                    <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-fadeIn">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Field Label</label>
                        <input
                          type="text"
                          value={field.label}
                          onChange={(e) => handleUpdateFieldProp(field.id, 'label', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Sub-label (e.g. First, Last)</label>
                        <input
                          type="text"
                          value={field.subLabel || ''}
                          onChange={(e) => handleUpdateFieldProp(field.id, 'subLabel', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                          placeholder="e.g. First"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Placeholder</label>
                        <input
                          type="text"
                          value={field.placeholder || ''}
                          onChange={(e) => handleUpdateFieldProp(field.id, 'placeholder', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-600 mb-1">Input Type</label>
                        <select
                          value={field.type}
                          onChange={(e) => handleUpdateFieldProp(field.id, 'type', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                        >
                          <option value="text">Text</option>
                          <option value="email">Email</option>
                          <option value="tel">Phone / Tel</option>
                          <option value="select">Dropdown Select</option>
                          <option value="textarea">Textarea</option>
                          <option value="number">Number</option>
                          <option value="checkbox">Checkbox</option>
                        </select>
                      </div>

                      {field.type === 'select' && (
                        <div className="sm:col-span-3">
                          <label className="block text-[10px] font-semibold text-slate-600 mb-1">
                            Options (comma-separated)
                          </label>
                          <input
                            type="text"
                            value={Array.isArray(field.options) ? field.options.join(', ') : field.options || ''}
                            onChange={(e) =>
                              handleUpdateFieldProp(
                                field.id,
                                'options',
                                e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                              )
                            }
                            className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-white"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. LIVE FORM PREVIEW MOCKUP */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="text-sm font-bold text-[#0f2b48] flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#074476]" />
              <span>Live Visual Form Preview (What visitors see on /contact)</span>
            </h4>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
              Live Interactive Mockup
            </span>
          </div>

          <div className="max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-300 shadow-xl grid grid-cols-1 md:grid-cols-12 min-h-[420px]">
            {/* Left Image Mockup */}
            <div className="md:col-span-5 relative bg-[#131b23] overflow-hidden flex items-center justify-center p-6 text-center">
              <img
                src="https://images.unsplash.com/photo-1520923642038-b4259acecca7?auto=format&fit=crop&w=800&q=80"
                alt="Vintage Phone preview"
                className="absolute inset-0 w-full h-full object-cover filter brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-300/40 to-emerald-500/40 backdrop-blur-md border border-white/50 shadow-2xl inline-flex items-center justify-center mb-3">
                  <Mail className="w-8 h-8 text-white stroke-[1.75]" />
                </div>
                <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-white text-[10px] font-semibold">
                  ⚡ Guaranteed Response &lt; 2 Hours
                </div>
              </div>
            </div>

            {/* Right Light-Blue Form Panel */}
            <div className="md:col-span-7 bg-[#dcebf9] p-6 md:p-8 flex flex-col justify-between">
              <div>
                <h5 className="text-xl font-extrabold text-[#0f2b48] mb-4">
                  {formConfig.formTitle || 'Send us a message'}
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fields.map((f) => (
                    <div
                      key={f.id}
                      className={f.halfWidth ? 'sm:col-span-1' : 'sm:col-span-2'}
                    >
                      <label className="block text-xs font-bold text-[#0f2b48] mb-1">
                        {f.label} {f.required && <span className="text-red-500">*</span>}
                      </label>
                      {f.type === 'textarea' ? (
                        <div>
                          <textarea
                            rows={3}
                            disabled
                            placeholder={f.placeholder}
                            className="w-full p-2.5 rounded-md border border-[#3b4b60]/60 text-xs bg-[#d5e7f7]/90 text-slate-800 opacity-90 cursor-not-allowed shadow-inner"
                          />
                          {f.subLabel && (
                            <span className="block text-[10px] text-slate-500 font-medium mt-0.5">
                              {f.subLabel}
                            </span>
                          )}
                        </div>
                      ) : f.type === 'select' ? (
                        <select
                          disabled
                          className="w-full p-2.5 rounded-md border border-[#3b4b60]/60 text-xs bg-[#d5e7f7]/90 text-slate-800 opacity-90 cursor-not-allowed shadow-inner"
                        >
                          <option>{f.placeholder || 'Select option...'}</option>
                          {(f.options || []).map((o, idx) => (
                            <option key={idx}>{o}</option>
                          ))}
                        </select>
                      ) : (
                        <div>
                          <input
                            type={f.type || 'text'}
                            disabled
                            placeholder={f.placeholder}
                            className="w-full p-2.5 rounded-md border border-[#3b4b60]/60 text-xs bg-[#d5e7f7]/90 text-slate-800 opacity-90 cursor-not-allowed shadow-inner"
                          />
                          {f.subLabel && (
                            <span className="block text-[10px] text-slate-500 font-medium mt-0.5">
                              {f.subLabel}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-5">
                  <button
                    type="button"
                    disabled
                    className="px-8 py-3 bg-[#007aff] text-white rounded-md text-xs font-extrabold uppercase tracking-wider opacity-90 cursor-not-allowed shadow"
                  >
                    {formConfig.submitButtonText || 'SEND INQUIRY'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn font-sans">
      {/* Section Header Card */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-semibold mb-2">
            <span>Website Module</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#0f2b48] flex items-center gap-2">
            <span>{currentSectionMeta.title}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Upload images to Supabase Storage, modify text, cards, and links. Changes publish live upon saving.
          </p>
        </div>
      </div>

      {/* Editor Body */}
      {activeSection === 'header' && renderHeaderEditor()}
      {activeSection === 'hero' && renderHeroEditor()}
      {activeSection === 'contactUs' && renderContactUsEditor()}
      {activeSection === 'servicesSection' && renderServicesEditor()}
      {!['header', 'hero', 'contactUs', 'servicesSection'].includes(activeSection) && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          {renderGenericFields(formData[activeSection], [activeSection], currentSectionMeta.label)}
        </div>
      )}
    </div>
  );
}
