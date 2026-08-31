import React, { useState } from 'react';
import Header from '../components/Header';
import FooterSection from '../components/FooterSection';
import Preloader from '../components/Preloader';
import { useSiteData } from '../hooks/useSiteData';
import fallbackData from '../data/data.json';
import {
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function ContactUs() {
  const { data } = useSiteData();
  const siteData = data || fallbackData;
  const contactData = siteData.contactUs || fallbackData.contactUs;
  const formConfig = contactData.formConfig || fallbackData.contactUs.formConfig;
  const formFields = formConfig.fields || fallbackData.contactUs.formConfig.fields;

  // Form State
  const [formValues, setFormValues] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleInputChange = (fieldKey, value) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldKey]: value
    }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setErrorMsg('');

    // Client-side required fields validation
    for (const field of formFields) {
      if (field.required) {
        const val = formValues[field.name || field.id];
        if (!val || (typeof val === 'string' && !val.trim())) {
          setErrorMsg(`Please fill in the required field: "${field.label}"`);
          return;
        }
      }
    }

    setSubmitting(true);

    try {
      const fullName =
        formValues.fullName ||
        formValues.name ||
        (formValues.firstName ? `${formValues.firstName} ${formValues.lastName || ''}`.trim() : '') ||
        'Anonymous Inquiry';

      const payload = {
        name: fullName,
        fullName: fullName,
        email: formValues.email || formValues.workEmail || '',
        phone: formValues.phone || formValues.phoneNumber || '',
        company: formValues.company || '',
        notes: formValues.notes || formValues.message || '',
        status: 'New',
        ...formValues,
        formData: formValues
      };

      const res = await fetch(`${API_BASE_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit inquiry. Please try again.');
      }

      setSubmitted(true);
      setFormValues({});
    } catch (err) {
      console.error('Contact form submission error:', err);
      setErrorMsg(err.message || 'An error occurred while submitting your message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf3f8] text-[#0f2b48] font-sans antialiased flex flex-col selection:bg-[#007aff] selection:text-white">
      <Preloader />

      {/* 1. Global Navigation Header */}
      <Header data={siteData.header} />

      {/* 2. Focused Main Workspace: Form Only */}
      <main className="flex-1 flex items-center justify-center pt-28 pb-14 md:pt-32 md:pb-20 px-4 sm:px-6">
        <div className="max-w-5xl w-full mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
            
            {/* ── LEFT HALF: Vintage Phone Photo with Glowing Cyan Envelope Glass Tile ── */}
            <div className="lg:col-span-5 relative bg-[#131b23] overflow-hidden min-h-[280px] lg:min-h-full flex items-center justify-center">
              <img
                src={contactData.leftImage || "https://images.unsplash.com/photo-1520923642038-b4259acecca7?auto=format&fit=crop&w=1200&q=80"}
                alt="Vintage Phone Contact"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90 contrast-105"
                onError={(e) => {
                  e.target.src = '/images/hero-section/Bg-curv.png';
                }}
              />

              {/* Vignette Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pointer-events-none"></div>

              {/* Glowing Cyan/Emerald Glass Mail Envelope Icon */}
              <div className="relative z-10 flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
                <div className="relative group">
                  <div className="absolute -inset-2 bg-emerald-400/40 rounded-3xl blur-xl animate-pulse"></div>
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-teal-300/40 to-emerald-500/40 backdrop-blur-md border border-white/50 shadow-2xl flex items-center justify-center">
                    <Mail className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)] stroke-[1.75]" />
                  </div>
                </div>

                {/* Guaranteed Response Pill Badge */}
                <div className="mt-8 px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white flex items-center gap-1.5 shadow-lg">
                  <span className="text-amber-400 text-xs">⚡</span>
                  <span className="text-xs font-semibold tracking-wide">
                    {contactData.responseSla || 'Guaranteed Response < 2 Hours'}
                  </span>
                </div>
              </div>
            </div>

            {/* ── RIGHT HALF: Crisp Light-Blue Form Panel ── */}
            <div className="lg:col-span-7 bg-[#dcebf9] p-6 sm:p-10 md:p-12 relative flex flex-col justify-between overflow-hidden">
              
              {/* Overhead Coffee Cup Artwork with Coffee Beans */}
              <div 
                className="absolute -bottom-6 -right-6 w-28 h-28 sm:w-36 sm:h-36 pointer-events-none select-none z-10 opacity-95 transition-transform duration-500 hover:scale-105"
                title="Coffee Cup Accent"
              >
                <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                  {/* Saucer */}
                  <circle cx="100" cy="100" r="92" fill="#d0dbe6" stroke="#b8c7d6" strokeWidth="4" />
                  <circle cx="100" cy="100" r="80" fill="#eef4fa" />
                  {/* Cup Rim */}
                  <circle cx="100" cy="100" r="66" fill="#ffffff" stroke="#94a3b8" strokeWidth="3" />
                  {/* Dark Espresso Coffee */}
                  <circle cx="100" cy="100" r="56" fill="#382110" />
                  {/* Coffee Beans / Foam Accents */}
                  <ellipse cx="88" cy="85" rx="10" ry="7" fill="#6d4223" transform="rotate(-20 88 85)" />
                  <ellipse cx="115" cy="98" rx="11" ry="8" fill="#6d4223" transform="rotate(30 115 98)" />
                  <ellipse cx="94" cy="120" rx="9" ry="6" fill="#6d4223" transform="rotate(-45 94 120)" />
                  {/* Handle */}
                  <path d="M 164 86 C 188 86, 188 114, 164 114" fill="none" stroke="#ffffff" strokeWidth="12" strokeLinecap="round" />
                  <path d="M 164 86 C 188 86, 188 114, 164 114" fill="none" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b48] tracking-tight mb-6">
                  {formConfig.formTitle || 'Send us a message'}
                </h2>

                {/* Submission Success View */}
                {submitted ? (
                  <div className="py-10 px-4 text-center space-y-4 animate-fadeIn bg-white/80 backdrop-blur-sm rounded-2xl border border-emerald-300 shadow-sm">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-[#0f2b48]">
                      {formConfig.successTitle || 'Inquiry Received!'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                      {formConfig.successMessage ||
                        'Thank you for reaching out. An executive consultant has received your inquiry and will get in touch within 2 hours.'}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSubmitted(false)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#007aff] hover:bg-[#0066d6] text-white text-xs font-bold transition-all shadow cursor-pointer uppercase tracking-wider"
                    >
                      <span>Send Another Inquiry</span>
                    </button>
                  </div>
                ) : (
                  /* Form Fields Matching Reference Image */
                  <form onSubmit={handleSubmit} className="space-y-4 relative z-20">
                    {errorMsg && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2 animate-fadeIn">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
                      {formFields.map((field) => {
                        const fieldKey = field.name || field.id;
                        const isHalf = field.halfWidth ?? false;
                        const colClass = isHalf ? 'sm:col-span-1' : 'sm:col-span-2';
                        const val = formValues[fieldKey] || '';

                        return (
                          <div key={field.id || fieldKey} className={colClass}>
                            <label className="block text-xs sm:text-sm font-bold text-[#0f2b48] mb-1">
                              {field.label}
                              {field.required && (
                                <span className="text-red-500 font-bold ml-1">*</span>
                              )}
                            </label>

                            {/* Input Handling */}
                            {field.type === 'textarea' ? (
                              <div>
                                <textarea
                                  rows={4}
                                  required={field.required}
                                  placeholder={field.placeholder || ''}
                                  value={val}
                                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-md border border-[#8ea7be] bg-[#cfe2f4]/80 hover:bg-white focus:bg-white text-slate-900 placeholder:text-[#7b93a8] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] transition-all resize-y shadow-inner"
                                />
                                {field.subLabel && (
                                  <span className="block text-[11px] text-slate-500 font-medium mt-0.5">
                                    {field.subLabel}
                                  </span>
                                )}
                              </div>
                            ) : field.type === 'select' ? (
                              <div className="relative">
                                <select
                                  required={field.required}
                                  value={val}
                                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-md border border-[#8ea7be] bg-[#cfe2f4]/80 hover:bg-white focus:bg-white text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] transition-all appearance-none cursor-pointer shadow-inner"
                                >
                                  <option value="" disabled>
                                    {field.placeholder || 'Select a primary service area'}
                                  </option>
                                  {(field.options || []).map((opt) => (
                                    <option key={opt} value={opt}>
                                      {opt}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <input
                                  type={field.type || 'text'}
                                  required={field.required}
                                  placeholder={field.placeholder || ''}
                                  value={val}
                                  onChange={(e) => handleInputChange(fieldKey, e.target.value)}
                                  className="w-full px-3.5 py-2.5 rounded-md border border-[#8ea7be] bg-[#cfe2f4]/80 hover:bg-white focus:bg-white text-slate-900 placeholder:text-[#7b93a8] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#007aff] transition-all shadow-inner"
                                />
                                {field.subLabel && (
                                  <span className="block text-[11px] text-slate-500 font-medium mt-0.5">
                                    {field.subLabel}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="px-8 py-3 rounded-md bg-[#007aff] hover:bg-[#0066d6] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>SENDING...</span>
                          </>
                        ) : (
                          <span>{formConfig.submitButtonText || 'SEND INQUIRY'}</span>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 3. Global Footer */}
      <FooterSection data={siteData.footer} officeLocations={siteData.officeLocations} />
    </div>
  );
}
