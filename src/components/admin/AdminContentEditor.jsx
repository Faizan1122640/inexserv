import React from 'react';
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
  Zap
} from 'lucide-react';
import AdminImageUpload from './AdminImageUpload';

export default function AdminContentEditor({
  activeSection,
  formData,
  setFormData,
  cmsSections = []
}) {
  const currentSectionMeta = cmsSections.find((s) => s.id === activeSection) || cmsSections[0];

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
      {activeSection === 'servicesSection' && renderServicesEditor()}
      {!['header', 'hero', 'servicesSection'].includes(activeSection) && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          {renderGenericFields(formData[activeSection], [activeSection], currentSectionMeta.label)}
        </div>
      )}
    </div>
  );
}
