import React from 'react';
import siteData from '../data/data.json';

export default function FooterSection() {
  const { footer, officeLocations } = siteData;

  return (
    <footer className="w-full text-white bg-[#074476] overflow-hidden">
      {/* Section 1: Consultation Banner & Locations */}
      <div className="w-full bg-[#074476] mt-8 pb-8">
        <div className="max-w-1800 md:w-[90%] w-full sm:px-0 px-4 mx-auto">
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
              className="rizzui-button font-medium active:enabled:translate-y-px focus:outline-none focus-visible:ring-[1.8px] focus-visible:ring-offset-2 ring-offset-background transition-colors duration-200 h-10 dark:backdrop-blur hover:bg-primary-dark dark:hover:bg-primary/90 focus-visible:ring-muted group cursor-pointer bg-gray-100/10 border flex gap-3 items-center border-gray-200/30 text-white hover:rounded-full sm:px-8 px-2 md:text-base text-xs py-3 rounded-lg justify-between"
            >
              <span>{footer.consultationButtonText}</span>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-4 h-4 text-white duration-300" xmlns="http://www.w3.org/2000/svg">
                <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path>
              </svg>
            </button>
          </div>

          {/* 3 Location Cards (USA, UAE, OMAN) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 mt-8 md:mt-14 mb-4 md:mb-8 mx-auto max-w-1800 w-full sm:px-12">
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
        <div className="md:w-[90%] w-full mx-auto flex flex-wrap lg:flex-nowrap justify-between gap-x-6 space-y-2 md:space-y-8 lg:space-y-0 xl:max-w-1800">
          {/* Col 1 (Logo + Strategic Consulting + Let's Talk Button) */}
          <div className="w-full lg:w-1/2 lg:pr-10 lg:pl-10 p-0 lg:border-r lg:border-white/20 py-8 lg:py-16">
            <img 
              alt="Inexserv Logo" 
              src={footer.logo} 
              className="h-12 w-auto object-contain mx-2" 
            />
            <p className="text-gray-300 mt-6 font-medium text-base lg:text-lg px-4 sm:px-0">
              {footer.strategicConsultingParagraph}
            </p>
            <div className="mt-10 px-4 sm:px-0 flex items-center justify-start">
              <button 
                type="button"
                className="rizzui-button font-medium active:enabled:translate-y-px focus:outline-none focus-visible:ring-[1.8px] focus-visible:ring-offset-2 ring-offset-background transition-colors duration-200 text-sm h-10 dark:backdrop-blur hover:bg-primary-dark dark:hover:bg-primary/90 focus-visible:ring-muted group cursor-pointer bg-gray-100/10 border flex gap-3 items-center border-gray-200/30 text-white hover:rounded-full px-8 py-3 rounded-lg justify-between"
              >
                <span>{footer.letsTalkButtonText}</span>
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
              <h1 className="text-white mb-4 font-bold text-lg lg:text-2xl">Services</h1>
              {footer.servicesLinks.map(s => (
                <a key={s.href} className="text-gray-300 sm:mb-8 mb-6 font-medium text-sm lg:text-lg flex flex-col cursor-pointer hover:text-white" href={s.href}>{s.label}</a>
              ))}
            </div>

            {/* Quick Links */}
            <div>
              <h1 className="text-white mb-4 font-bold text-lg lg:text-2xl">Quick Links</h1>
              {footer.quickLinks.map(q => (
                <a key={q.href} className="text-gray-300 sm:mb-8 mb-6 font-medium text-sm lg:text-lg flex flex-col cursor-pointer hover:text-white" href={q.href}>{q.label}</a>
              ))}
            </div>

            {/* Contact Us */}
            <div className="py-2">
              <h1 className="text-white mb-4 font-bold text-lg lg:text-2xl">Contact Us</h1>

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
                  <p className="text-gray-300 font-normal text-xs lg:text-sm whitespace-pre-line">{footer.contactInfo.emails.join('\n')}</p>
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
                  <p className="text-gray-300 font-normal text-xs lg:text-sm whitespace-pre-line">{footer.contactInfo.phone}</p>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="flex justify-start gap-4 mt-12 pl-1">
                {footer.socialLinks.map(s => {
                  let pathD = '';
                  if (s.platform === 'facebook') pathD = 'M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z';
                  else if (s.platform === 'twitter') pathD = 'M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z';
                  else if (s.platform === 'linkedin') pathD = 'M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z';
                  else if (s.platform === 'instagram') pathD = 'M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z';

                  return (
                    <a 
                      key={s.platform}
                      href={s.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="bg-white text-[#04A552] hover:text-white hover:bg-[#04A552] p-3 rounded-full transition flex items-center justify-center"
                    >
                      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                        <path d={pathD}></path>
                      </svg>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Copyright & Policy Links */}
      <div className="w-full bg-[#074476] py-4 lg:py-10 border-t border-white/20">
        <div className="max-w-1800 w-10/12 mx-auto flex flex-wrap justify-between items-center text-gray-300">
          <p className="text-sm font-medium text-center lg:text-left w-full lg:w-auto">
            {footer.copyright}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center lg:justify-end w-full lg:w-auto">
            {footer.policyLinks.map((p, idx) => (
              <React.Fragment key={p.href}>
                <a className="mx-2 font-medium text-xs lg:text-sm hover:text-white" href={p.href}>{p.label}</a>
                {idx < footer.policyLinks.length - 1 && <span className="ml-3">|</span>}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
