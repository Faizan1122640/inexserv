import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  UploadCloud,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  ExternalLink,
  Check,
  Maximize2,
  X,
  Sparkles,
  Layers,
  Copy
} from 'lucide-react';
import { uploadImageToStorage } from '../../utils/imageUpload';

// Built-in common website assets for 1-click selection
const PRESET_ASSETS = [
  { label: 'Web Dev Icon', path: '/images/webdevelopment.svg' },
  { label: 'Mobile App Icon', path: '/images/mobiledevelopment.svg' },
  { label: 'AI Development Icon', path: '/images/aidevelopment.svg' },
  { label: 'Automation & DevOps', path: '/images/devcops.svg' },
  { label: 'Desktop & E-Commerce', path: '/images/ecommerence.svg' },
  { label: 'Blockchain Icon', path: '/images/blockchaincard.svg' },
  { label: 'Mega AI Dev', path: '/images/servisec-manu/aidevelopment.svg' },
  { label: 'Mega Web Dev', path: '/images/servisec-manu/webdevelopment.svg' },
  { label: 'Mega Mobile Dev', path: '/images/servisec-manu/mobiledevelopment.svg' },
  { label: 'Dubai Location', path: '/images/dubai.svg' },
  { label: 'USA Location', path: '/images/usa.svg' },
  { label: 'Oman Location', path: '/images/omans.svg' },
  { label: 'Official Logo', path: '/images/inexserv-logo.png' }
];

export default function AdminImageUpload({
  label = 'Image / Icon',
  value = '',
  onChange,
  bucket = 'website-assets',
  hint = 'Upload to Supabase Storage or enter path/URL'
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [showPresets, setShowPresets] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Detect file extension / format badge
  const getFormatBadge = (url) => {
    if (!url) return null;
    if (url.endsWith('.svg') || url.includes('.svg')) return 'SVG';
    if (url.endsWith('.png') || url.includes('.png')) return 'PNG';
    if (url.endsWith('.webp') || url.includes('.webp')) return 'WEBP';
    if (url.endsWith('.avif') || url.includes('.avif')) return 'AVIF';
    if (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.includes('.jpg')) return 'JPG';
    return 'IMG';
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    setErrorMsg('');

    try {
      const result = await uploadImageToStorage(file, bucket);
      if (result.success && result.publicUrl) {
        onChange(result.publicUrl);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleCopyUrl = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Close on ESC key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showLightbox) {
        setShowLightbox(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showLightbox]);

  return (
    <div className="space-y-2 font-sans">
      {/* Field Label & Top Actions */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label}
        </label>
        <div className="flex items-center gap-2">
          {/* Quick Presets Toggle */}
          <button
            type="button"
            onClick={() => setShowPresets(!showPresets)}
            className="text-[11px] font-semibold text-[#074476] hover:text-[#04A552] transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <Layers className="w-3 h-3" />
            <span>Preset Gallery</span>
          </button>
          {/* Direct URL Toggle */}
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlInput ? 'Hide URL' : 'Edit URL / Path'}</span>
          </button>
        </div>
      </div>

      {/* Preset Assets Dropdown Picker */}
      {showPresets && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2 animate-fadeIn">
          <p className="text-[11px] font-bold text-slate-600">Select standard website icon or asset:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {PRESET_ASSETS.map((preset) => (
              <button
                key={preset.path}
                type="button"
                onClick={() => {
                  onChange(preset.path);
                  setShowPresets(false);
                }}
                className={`p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                  value === preset.path
                    ? 'bg-[#074476] text-white border-[#074476] shadow-sm'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center p-1 flex-shrink-0">
                  <img src={preset.path} alt="" className="w-full h-full object-contain" />
                </div>
                <span className="text-[10px] font-semibold truncate">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Manual URL / Path Input Field (if toggled) */}
      {showUrlInput && (
        <div className="flex items-center gap-2 animate-fadeIn">
          <div className="relative flex-1">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. https://supabase.../image.png or /images/..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#04A552] focus:ring-1 focus:ring-[#04A552] transition-all"
            />
          </div>
          {value && (
            <button
              type="button"
              onClick={handleCopyUrl}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Copy URL"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          )}
        </div>
      )}

      {/* Image Preview & Upload Control Card */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-3 transition-all duration-200 flex flex-col gap-2.5 bg-white ${
          isDragOver
            ? 'border-[#04A552] bg-emerald-50/50 scale-[1.01]'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp, image/svg+xml, image/gif, image/avif"
          className="hidden"
        />

        {/* Upper Row: Image Preview Thumbnail + Name/Status */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            onClick={() => value && setShowLightbox(true)}
            className={`relative group w-14 h-14 rounded-xl flex items-center justify-center p-1.5 flex-shrink-0 transition-all shadow-sm ${
              value
                ? 'bg-slate-900/5 border border-slate-200 cursor-pointer hover:shadow-md'
                : 'bg-slate-100 border border-slate-200'
            }`}
          >
            {value ? (
              <>
                <img
                  src={value}
                  alt={label}
                  className="w-full h-full object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Maximize2 className="w-4 h-4 drop-shadow" />
                </div>
              </>
            ) : (
              <ImageIcon className="w-6 h-6 text-slate-300" />
            )}

            {/* Format Badge */}
            {value && getFormatBadge(value) && (
              <span className="absolute -top-1.5 -right-1.5 px-1 py-0.2 rounded text-[8px] font-bold bg-[#074476] text-white shadow">
                {getFormatBadge(value)}
              </span>
            )}
          </div>

          {/* Details / Path summary */}
          <div className="flex-1 min-w-0 space-y-0.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800 truncate">
                {value ? value.split('/').pop().split('?')[0] : 'No image uploaded'}
              </span>
              {value && (
                <span className="w-2 h-2 rounded-full bg-[#04A552] flex-shrink-0" title="Active Supabase Asset"></span>
              )}
            </div>
            <p className="text-[10px] text-slate-500 truncate" title={value || hint}>
              {value ? (value.includes('supabase.co') ? '☁️ Supabase CDN' : value) : hint}
            </p>
          </div>
        </div>

        {/* Lower Action Row: Upload / Replace + Remove buttons strictly aligned and contained */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#074476] hover:bg-[#063963] text-white rounded-xl text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-60"
          >
            {uploading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud className="w-3.5 h-3.5" />
                <span>{value ? 'Replace Image' : 'Upload to Supabase'}</span>
              </>
            )}
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors border border-slate-200 cursor-pointer flex-shrink-0"
              title="Remove image"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Error Notice */}
      {errorMsg && (
        <p className="text-xs text-red-600 font-semibold bg-red-50 p-2.5 rounded-xl border border-red-200 flex items-center gap-1.5">
          <span>⚠️</span>
          <span>{errorMsg}</span>
        </p>
      )}

      {/* Fullscreen Lightbox Modal via Portal at document.body with highest z-index */}
      {showLightbox && typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowLightbox(false);
            }}
          >
            <div className="relative max-w-lg w-full bg-[#074476] border border-[#115b99] rounded-3xl p-5 shadow-2xl space-y-3.5 text-white animate-fadeIn my-auto">
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-xl bg-[#04A552]/20 text-[#04A552]">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{label} Preview</h4>
                    <p className="text-[10px] text-white/70">Full resolution asset preview</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowLightbox(false)}
                  className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Compact Lightbox Image Stage */}
              <div className="w-full h-48 sm:h-56 rounded-2xl bg-black/25 border border-white/15 flex items-center justify-center p-4 overflow-hidden relative">
                <img
                  src={value}
                  alt={label}
                  className="max-w-full max-h-full object-contain rounded-lg drop-shadow-xl transition-transform hover:scale-105 duration-200"
                />
              </div>

              {/* Asset URL & Actions */}
              <div className="flex items-center justify-between text-xs text-white/80 gap-2 pt-1">
                <span className="truncate flex-1 max-w-[200px] sm:max-w-[260px] bg-black/20 px-3 py-1.5 rounded-xl border border-white/10 text-[11px] font-mono text-white select-all">
                  {value}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy URL'}</span>
                  </button>
                  <a
                    href={value}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-xl bg-[#04A552] text-white hover:bg-[#038843] transition-colors shadow-md"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
