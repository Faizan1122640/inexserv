import React from 'react';
import {
  FolderKanban,
  MessageSquare,
  Sparkles,
  Layers,
  Activity,
  ArrowUpRight,
  ShieldCheck,
  Zap,
  Globe,
  Database,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function AdminDashboardOverview({
  formData,
  leads = [],
  isUsingSupabase,
  isUsingBackend,
  onNavigateSection,
  onNavigateTab
}) {
  const servicesCount = formData?.servicesSection?.services?.length || formData?.header?.megaMenu?.items?.length || 6;
  const solutionsCount = formData?.solutionsSection?.solutions?.length || 4;
  const techCategoriesCount = formData?.techStackSection?.categories?.length || 6;
  const officesCount = formData?.officeLocations?.length || 4;

  const statCards = [
    {
      label: 'Customer Leads',
      value: leads.length,
      sub: `${leads.filter(l => l.status === 'New' || !l.status).length} new / pending`,
      icon: MessageSquare,
      color: 'from-blue-500 to-indigo-600',
      tab: 'leads'
    },
    {
      label: 'Active Services',
      value: servicesCount,
      sub: 'Published in Mega Menu & Cards',
      icon: Sparkles,
      color: 'from-[#04A552] to-emerald-600',
      tab: 'cms',
      section: 'servicesSection'
    },
    {
      label: 'Tech Categories',
      value: techCategoriesCount,
      sub: 'Stacks & Frameworks',
      icon: Layers,
      color: 'from-amber-500 to-orange-600',
      tab: 'cms',
      section: 'techStackSection'
    },
    {
      label: 'Global Offices',
      value: officesCount,
      sub: 'Locations in Footer & Contact',
      icon: Globe,
      color: 'from-[#074476] to-sky-600',
      tab: 'cms',
      section: 'officeLocations'
    }
  ];

  const quickActions = [
    {
      title: 'Hero & Tagline Editor',
      desc: 'Update headline, sub-headline, and keywords',
      section: 'hero',
      icon: Sparkles
    },
    {
      title: 'Services Cards',
      desc: 'Add, remove, or modify core service offerings',
      section: 'servicesSection',
      icon: Layers
    },
    {
      title: 'Solutions Showcase',
      desc: 'Manage enterprise solution cards & features',
      section: 'solutionsSection',
      icon: Zap
    },
    {
      title: 'Navigation & Mega Menu',
      desc: 'Configure links, mega menu cards, and CTA button',
      section: 'header',
      icon: Globe
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0c1d2e] via-[#0f2b48] to-[#074476] p-8 text-white shadow-xl shadow-slate-900/10">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inexserv Live CMS Engine</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome to the Admin Command Center
            </h2>
            <p className="text-sm text-slate-300">
              Manage website content, customer leads, navigation items, and tech stack categories with instant synchronization.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                onNavigateTab('cms');
                onNavigateSection('hero');
              }}
              className="px-5 py-2.5 rounded-xl bg-white text-[#0c1d2e] font-bold text-xs hover:bg-slate-100 transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>Edit Hero Section</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigateTab('leads')}
              className="px-5 py-2.5 rounded-xl bg-[#04A552] text-white font-bold text-xs hover:bg-emerald-600 transition-all shadow-md cursor-pointer flex items-center gap-2"
            >
              <span>View Leads ({leads.length})</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute right-0 top-0 -mt-8 -mr-8 w-72 h-72 bg-[#04A552]/20 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => {
                onNavigateTab(card.tab);
                if (card.section) onNavigateSection(card.section);
              }}
              className="group relative bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${card.color} text-white flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-[#0f2b48] tracking-tight">
                  {card.value}
                </span>
                <p className="text-xs font-medium text-slate-500 mt-1">
                  {card.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grid: Quick CMS Section Editors & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Quick Action Editors */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-[#0f2b48]">
              Quick CMS Section Jump
            </h3>
            <span className="text-xs text-slate-500 font-medium">9 active sections</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <div
                  key={i}
                  onClick={() => {
                    onNavigateTab('cms');
                    onNavigateSection(action.section);
                  }}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-[#04A552]/50 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#04A552] flex items-center justify-center flex-shrink-0 group-hover:bg-[#04A552] group-hover:text-white transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#0f2b48] group-hover:text-[#04A552] transition-colors truncate">
                        {action.title}
                      </h4>
                      <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-[#04A552] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {action.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: System & Sync Status */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-[#0f2b48] flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#04A552]" />
            <span>System Connectivity</span>
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <Database className="w-4 h-4 text-[#074476]" />
                <span className="text-xs font-semibold text-slate-700">Supabase Cloud</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isUsingSupabase ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                {isUsingSupabase ? 'Connected' : 'Standby'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-700">Express REST API</span>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${isUsingBackend ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {isUsingBackend ? 'Active' : 'Offline'}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/60">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-semibold text-slate-700">JWT Authentication</span>
              </div>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                Secured
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => onNavigateTab('settings')}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all text-center"
            >
              ⚙️ Manage Backups &amp; Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
