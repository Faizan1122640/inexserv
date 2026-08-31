import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import fallbackData from '../data/data.json';

export default function FooterSection({ data, officeLocations: locationsProp }) {
  const navigate = useNavigate();
  const footer = data || fallbackData.footer;
  const officeLocations = locationsProp || fallbackData.officeLocations;

  return (
    <footer className="w-full text-white bg-[#074476] overflow-hidden">
      {/* Section 1: Consultation Banner & Locations */}
      <div className="w-full bg-[#074476] mt-8 pb-8">
        <div className="max-w-[1800px] md:w-[90%] w-full sm:px-0 px-4 mx-auto">
          {/* Top Callout */}
          <div className="flex flex-col sm:justify-center pt-12 pb-5">
            <p className="rizzui-text-p font-normal sm:text-center text-lg sm:text-2xl md:text-5xl text-white">
              {footer.consultationTitle}
            </p>
            <div className="w-full flex justify-center">
              <p className="text-white max-w-[600px] sm:text-center mt-3 font-normal text-sm sm:text-base md:text-lg">
                {footer.consultationDesc}
              </p>
            </div>
          </div>

          {/* Consultation Button */}
          <div className="flex sm:justify-center mb-4">
            <button 
              type="button"
              onClick={() => navigate('/contact')}
              className="rizzui-button font-medium active:enabled:translate-y-px focus:outline-none focus-visible:ring-[1.8px] focus-visible:ring-offset-2 ring-offset-background transition-colors duration-200 h-10 dark:backdrop-blur hover:bg-primary-dark dark:hover:bg-primary/90 focus-visible:ring-muted group cursor-pointer bg-gray-100/10 border flex gap-3 items-center border-gray-200/30 text-white hover:rounded-full sm:px-8 px-4 md:text-base text-xs py-3 rounded-lg justify-between shadow-md"
            >
              <span>{footer.consultationButtonText}</span>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-4 h-4 text-white duration-300" xmlns="http://www.w3.org/2000/svg">
                <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path>
              </svg>
            </button>
          </div>

          {/* 3 Location Cards (USA, UAE, OMAN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mt-8 md:mt-14 mb-4 md:mb-8 mx-auto max-w-[1800px] w-full sm:px-12">
            {officeLocations.map((loc) => (
              <div key={loc.country} className="flex flex-col w-full gap-2">
                <div className="flex flex-col items-start mb-2">
                  <div className="h-[50px] flex items-end mb-2">
                    <img src={loc.flag} alt={loc.country} className="h-10 w-auto filter brightness-0 invert" />
                  </div>
                  <p className="text-white font-bold text-lg lg:text-xl">{loc.country}</p>
                </div>
                <p className="text-gray-300 font-normal text-xs lg:text-sm">Address: {loc.address}</p>
                <p className="text-gray-300 font-normal text-xs lg:text-sm">Phone No: {loc.phone}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 2: Main 4-Column Section (Logo, Paragraph, Services, Links, Contact) */}
      <div className="w-full bg-[#074476] border-t border-b border-white/20">
        <div className="md:w-[90%] w-full mx-auto flex flex-wrap lg:flex-nowrap justify-between gap-x-6 space-y-2 md:space-y-8 lg:space-y-0 xl:max-w-[1800px]">
          {/* Col 1 (Logo + Strategic Consulting + Let's Talk Button) */}
          <div className="w-full lg:w-1/2 lg:pr-10 lg:pl-10 p-0 lg:border-r lg:border-white/20 py-8 lg:py-16">
            <Link to="/">
              <img 
                alt="Inexserv Logo" 
                src={footer.logo} 
                className="h-12 w-auto object-contain mx-2 cursor-pointer" 
              />
            </Link>
            <p className="text-gray-300 mt-6 font-medium text-base lg:text-lg px-4 sm:px-0">
              {footer.strategicConsultingParagraph}
            </p>
            <div className="mt-10 px-4 sm:px-0 flex items-center justify-start">
              <button 
                type="button"
                onClick={() => navigate('/contact')}
                className="rizzui-button font-medium active:enabled:translate-y-px focus:outline-none focus-visible:ring-[1.8px] focus-visible:ring-offset-2 ring-offset-background transition-colors duration-200 text-sm h-10 dark:backdrop-blur hover:bg-primary-dark dark:hover:bg-primary/90 focus-visible:ring-muted group cursor-pointer bg-gray-100/10 border flex gap-3 items-center border-gray-200/30 text-white hover:rounded-full px-8 py-3 rounded-lg justify-between shadow-md"
              >
                <span>{footer.letsTalkButtonText || "Let's Talk"}</span>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-4 h-4 text-white duration-300" xmlns="http://www.w3.org/2000/svg">
                  <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path>
                </svg>
              </button>
            </div>
          </div>

          {/* Col 2, 3, 4 (Services, Quick Links, Contact Us) */}
          <div className="w-full px-4 sm:px-0 text-left grid grid-cols-1 lg:grid-cols-3 md:gap-4 gap-1 lg:gap-6 sm:py-8 lg:py-16">
            {/* Services */}
            <div>
              <h2 className="text-white mb-4 font-bold text-lg lg:text-2xl">Services</h2>
              {footer.servicesLinks.map(s => (
                <a key={s.href} className="text-gray-300 sm:mb-8 mb-6 font-medium text-sm lg:text-lg flex flex-col cursor-pointer hover:text-white" href={s.href}>{s.label}</a>
              ))}
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-white mb-4 font-bold text-lg lg:text-2xl">Quick Links</h2>
              {footer.quickLinks.map(q => {
                if (q.href === '/contact-us' || q.href === '/contact') {
                  return (
                    <Link key={q.href} to="/contact" className="text-gray-300 sm:mb-8 mb-6 font-medium text-sm lg:text-lg flex flex-col cursor-pointer hover:text-white">
                      {q.label}
                    </Link>
                  );
                }
                return (
                  <a key={q.href} className="text-gray-300 sm:mb-8 mb-6 font-medium text-sm lg:text-lg flex flex-col cursor-pointer hover:text-white" href={q.href}>{q.label}</a>
                );
              })}
            </div>

            {/* Contact Us */}
            <div className="py-2">
              <h2 className="text-white mb-4 font-bold text-lg lg:text-2xl">Contact Us</h2>

              {/* Address */}
              <div className="flex sm:flex-row flex-col sm:items-center sm:mb-8 mb-6">
                <div className="sm:p-2 pb-2 sm:pb-0 sm:ml-0 sm:border w-10 h-10 sm:border-dashed rounded-full border-gray-400 flex items-center justify-center flex-shrink-0">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="text-white text-2xl w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M80 212v236a16 16 0 0 0 16 16h96V328a24 24 0 0 1 24-24h80a24 24 0 0 1 24 24v136h96a16 16 0 0 0 16-16V212"></path>
                    <path fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M480 256 266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256m368-77V64h-48v69"></path>
                  </svg>
                </div>
                <div className="sm:ml-3">
                  <p className="text-white font-semibold text-sm lg:text-lg">Address:</p>
                  <p className="text-gray-300 font-normal text-xs lg:text-sm whitespace-pre-line">{footer.contactInfo.address}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex sm:flex-row flex-col sm:items-center sm:mb-8 mb-6">
                <div className="sm:p-2 pb-2 sm:pb-0 sm:ml-0 sm:border w-10 h-10 sm:border-dashed rounded-full border-gray-400 flex items-center justify-center flex-shrink-0">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="text-white text-2xl w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path fill="none" d="M0 0h24v24H0V0z"></path>
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4V8l8 5 8-5v10zm-8-7L4 6h16l-8 5z"></path>
                  </svg>
                </div>
                <div className="sm:ml-3">
                  <p className="text-white font-semibold text-sm lg:text-lg">Email:</p>
                  <p className="text-gray-300 font-normal text-xs lg:text-sm whitespace-pre-line">{footer.contactInfo.emails ? footer.contactInfo.emails.join('\n') : ''}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex sm:flex-row flex-col sm:items-center sm:mb-8 mb-6">
                <div className="sm:p-2 pb-2 sm:pb-0 sm:ml-0 sm:border w-10 h-10 sm:border-dashed rounded-full border-gray-400 flex items-center justify-center flex-shrink-0">
                  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" className="text-white text-2xl w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="sm:ml-3">
                  <p className="text-white font-semibold text-sm lg:text-lg">Phone:</p>
                  <p className="text-gray-300 font-normal text-xs lg:text-sm">{footer.contactInfo.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Copyright, Policies & Social Media */}
      <div className="w-full bg-[#074476] py-6">
        <div className="md:w-[90%] w-full mx-auto px-4 sm:px-0 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-300 xl:max-w-[1800px]">
          <p>{footer.copyright}</p>
          <div className="flex flex-wrap gap-4 items-center">
            {footer.policyLinks.map((p, idx) => (
              <a key={idx} href={p.href} className="hover:text-white transition-colors">{p.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
