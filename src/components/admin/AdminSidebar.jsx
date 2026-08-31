import React from 'react';
import {
  Compass,
  Sparkles,
  Briefcase,
  Zap,
  Code2,
  Users,
  Megaphone,
  MapPin,
  FileText,
  Menu,
  ChevronLeft,
  LogOut,
  Layers,
  Mail
} from 'lucide-react';

export default function AdminSidebar({
  activeCmsSection,
  setActiveCmsSection,
  collapsed,
  setCollapsed,
  onLogout,
  cmsSections = []
}) {
  // Mapping icons to sections
  const iconMap = {
    header: Compass,
    hero: Sparkles,
    contactUs: Mail,
    servicesSection: Briefcase,
    solutionsSection: Zap,
    techStackSection: Code2,
    hireDevSection: Users,
    ctaBanner: Megaphone,
    officeLocations: MapPin,
    footer: FileText
  };

  return (
    <aside
      className={`relative flex flex-col h-full rounded-2xl bg-[#074476] border border-[#115b99]/70 text-slate-100 shadow-xl transition-all duration-300 ease-in-out select-none flex-shrink-0 overflow-hidden ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Top Sidebar Header with Collapse Toggle */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/15 flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Website Sections
            </span>
            <button
              onClick={() => setCollapsed(true)}
              className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Collapse Sidebar"
              aria-label="Collapse Sidebar"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="w-full flex justify-center">
            <button
              onClick={() => setCollapsed(false)}
              className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Expand Sidebar"
              aria-label="Expand Sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* 9 CMS Sections Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 space-y-1.5 no-scrollbar py-3">
        {cmsSections.map((section) => {
          const Icon = iconMap[section.id] || Layers;
          const isActive = activeCmsSection === section.id;

          return (
            <div key={section.id} className="relative group">
              <button
                onClick={() => setActiveCmsSection(section.id)}
                className={`w-full flex items-center transition-all duration-200 cursor-pointer rounded-2xl ${
                  collapsed
                    ? 'justify-center h-12 w-12 mx-auto'
                    : 'justify-between px-3.5 py-3'
                } ${
                  isActive
                    ? 'bg-white text-[#074476] shadow-lg shadow-black/20 font-bold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                      isActive
                        ? 'text-[#074476] stroke-[2.4]'
                        : 'text-white/70 group-hover:text-white group-hover:scale-110'
                    }`}
                  />
                  {!collapsed && (
                    <span className="text-xs font-semibold tracking-tight truncate">
                      {section.label}
                    </span>
                  )}
                </div>

                {!collapsed && isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#04A552] flex-shrink-0 animate-pulse"></span>
                )}
              </button>

              {/* Floating Tooltip in Collapsed Rail Mode */}
              {collapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-white text-[#074476] font-bold text-xs rounded-lg shadow-xl shadow-black/40 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50 flex items-center gap-1.5 border border-slate-200">
                  <span>{section.label}</span>
                  {/* Tooltip arrow */}
                  <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rotate-45 border-l border-b border-slate-200"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Administrator Profile Card */}
      <div className="p-3 border-t border-white/15 mt-auto flex-shrink-0">
        {!collapsed ? (
          <div className="flex items-center justify-between bg-[#05335a] p-2.5 rounded-2xl border border-white/15 shadow-inner">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#04A552] to-sky-400 p-0.5 flex items-center justify-center flex-shrink-0">
                  <div className="w-full h-full bg-[#074476] rounded-[9px] flex items-center justify-center text-xs font-bold text-white">
                    AD
                  </div>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#05335a] rounded-full"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-white truncate">
                  Admin Master
                </span>
                <span className="text-[10px] text-white/70 truncate">
                  Administrator
                </span>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-xl text-white/70 hover:text-red-300 hover:bg-red-500/20 transition-colors cursor-pointer"
              title="Log out"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="relative group flex justify-center">
            <button
              onClick={onLogout}
              className="w-12 h-12 rounded-2xl bg-[#05335a] border border-white/15 hover:border-red-400/50 flex items-center justify-center text-white/70 hover:text-red-300 hover:bg-red-500/20 transition-all cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-red-600 text-white font-semibold text-xs rounded-lg shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-200 z-50">
              Sign Out
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
