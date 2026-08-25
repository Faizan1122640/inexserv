import React, { useState } from 'react';
import {
  Save,
  RotateCcw,
  ExternalLink,
  Menu,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function AdminNavbar({
  activeTabLabel,
  activeSubLabel,
  isUsingSupabase,
  isUsingBackend,
  saving,
  onSave,
  onRestoreDefault,
  onOpenMobileMenu
}) {
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const confirmRestore = () => {
    setShowRestoreModal(false);
    onRestoreDefault();
  };

  return (
    <>
      {/* ── Top Navbar covering complete line with website color scheme ── */}
      <header className="w-full sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-sm transition-all">
        <div className="flex items-center justify-between gap-4 px-4 sm:px-8 py-3.5 max-w-[1920px] mx-auto">
          {/* Left: Brand Logo & Breadcrumb Navigation */}
          <div className="flex items-center gap-4 min-w-0">
            {/* Mobile Drawer Toggle */}
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-[#0f2b48] hover:bg-slate-100 transition-colors"
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Official Integrated Excellence Service Logo */}
            <a href="/" className="flex items-center gap-2 cursor-pointer flex-shrink-0">
              <img
                src="/images/inexserv-logo.png"
                alt="Integrated Excellence Service L.L.C"
                className="h-9 sm:h-11 w-auto object-contain transition-transform duration-200 hover:scale-105"
              />
            </a>

            {/* Vertical Divider */}
            <div className="hidden sm:block h-6 w-px bg-slate-200"></div>

            {/* Breadcrumb Path in Website Navy */}
            <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span className="text-[#0f2b48] font-bold">Admin CMS</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[#074476]">{activeTabLabel}</span>
              {activeSubLabel && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-[#04A552] font-bold">{activeSubLabel}</span>
                </>
              )}
            </div>

            {/* Live Database Sync Badge */}
            <div className="hidden xl:flex items-center gap-1.5 ml-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-50 border border-slate-200/80">
              <span
                className={`w-2 h-2 rounded-full ${
                  isUsingSupabase
                    ? 'bg-[#04A552] animate-pulse'
                    : isUsingBackend
                    ? 'bg-blue-600 animate-pulse'
                    : 'bg-amber-500'
                }`}
              ></span>
              <span className="text-slate-700">
                {isUsingSupabase
                  ? 'Supabase Cloud Sync'
                  : isUsingBackend
                  ? 'Express REST API'
                  : 'Local Cache Mode'}
              </span>
            </div>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-3">
            {/* View Live Site */}
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0f2b48] hover:text-[#074476] bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-200"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Live Website</span>
            </a>

            {/* Restore Defaults Button */}
            <button
              onClick={() => setShowRestoreModal(true)}
              disabled={saving}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-xl border border-amber-200 transition-all cursor-pointer disabled:opacity-50"
              title="Reset website content to factory defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Defaults</span>
            </button>

            {/* Primary Save & Publish CTA Button (Matching green Contact Us pill) */}
            <button
              onClick={onSave}
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#04A552] hover:bg-[#038843] rounded-xl shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all cursor-pointer disabled:opacity-60 active:scale-95"
            >
              {saving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 stroke-[2.5]" />
                  <span>Save &amp; Publish</span>
                  <span className="hidden lg:inline text-[10px] opacity-80 font-normal bg-black/20 px-1.5 py-0.5 rounded">
                    Ctrl+S
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Restore Defaults Confirmation Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4 my-auto max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#0f2b48]">Restore Original Defaults?</h3>
                <p className="text-xs text-slate-500">This will reset all 9 CMS sections to default content.</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 bg-amber-50 p-3 rounded-xl border border-amber-200">
              ⚠️ Any recent edits made to hero text, service cards, or footer details will be restored to the base dataset.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmRestore}
                className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-colors shadow-md cursor-pointer"
              >
                Yes, Restore Defaults
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
