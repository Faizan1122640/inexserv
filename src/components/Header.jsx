import React, { useState, useEffect } from 'react';
import fallbackData from '../data/data.json';

export default function Header({ data, onOpenContact }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const header = data || fallbackData.header;

  // Bind Services mega dropdown using JS hover
  useEffect(() => {
    const navItem = document.getElementById('services-nav-item');
    const dropdown = document.getElementById('services-mega-dropdown');
    if (!navItem || !dropdown) return;

    let timeout;

    const show = () => {
      clearTimeout(timeout);
      dropdown.style.opacity = '1';
      dropdown.style.visibility = 'visible';
      dropdown.style.pointerEvents = 'auto';
    };

    const hide = () => {
      timeout = setTimeout(() => {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.pointerEvents = 'none';
      }, 120);
    };

    navItem.addEventListener('mouseenter', show);
    navItem.addEventListener('mouseleave', hide);
    dropdown.addEventListener('mouseenter', show);
    dropdown.addEventListener('mouseleave', hide);

    return () => {
      navItem.removeEventListener('mouseenter', show);
      navItem.removeEventListener('mouseleave', hide);
      dropdown.removeEventListener('mouseenter', show);
      dropdown.removeEventListener('mouseleave', hide);
    };
  }, []);

  return (
    <div style={{ opacity: 1 }}>
      <div>
        {/* ── Main Navbar Bar ── */}
        <div className="w-full z-[999] fixed shadow-md top-0 bg-white flex px-4 sm:px-0 py-4">
          <div className="max-w-[1800px] md:w-[90%] w-full md:px-0 mx-auto flex bg-white items-center justify-between">
            <nav className="relative flex items-center justify-between w-full bg-white">

              {/* Brand Logo */}
              <a className="font-bold cursor-pointer mr-8 transition-opacity duration-200" href="/">
                <img
                  alt="IES"
                  width="3376"
                  height="948"
                  decoding="async"
                  className="w-auto h-10 md:h-16 transition-transform duration-200 hover:scale-105"
                  style={{ color: 'transparent' }}
                  src="/images/inexserv-logo.png"
                />
              </a>

              {/* Desktop Nav Links */}
              <ul className="hidden lg:flex flex-1 justify-center items-center space-x-7 text-base font-medium text-sky-secondary">
                {header.navLinks.map((link) => {
                  if (link.hasDropdown) {
                    return (
                      <li key={link.label} id="services-nav-item" className="relative z-20 hover:text-sky-primary group py-2">
                        <button className="flex items-center justify-between text-sm hover:text-yellow-primary transition-colors duration-200 py-2">
                          <span className="cursor-pointer text-base font-normal hover:text-sky-primary text-sky-secondary">{link.label}</span>
                          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512"
                            className="ml-1.5 w-4 h-3 transition-transform duration-200" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                            <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"></path>
                          </svg>
                        </button>

                        {/* Mega Menu */}
                        <div id="services-mega-dropdown"
                          className="absolute top-full left-[70%] pt-3 lg:-translate-x-[67%] xl:-translate-x-[30%] 2xl:-translate-x-[35%] z-50 transition-all duration-300 ease-out"
                          style={{ opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}>
                          <div className="w-full bg-white rounded-2xl shadow-xl">
                            <div className="grid lg:w-[78vw] bg-white z-[9999] lg:grid-cols-4 bg-contain p-2 lg:p-0 lg:pl-16 lg:pr-10 lg:pt-6 lg:pb-10 lg:mt-2 rounded-lg">
                              <div className="lg:col-span-1 lg:pr-18">
                                <p className="font-normal text-xl lg:block hidden text-[#1e3a5f] mb-2">{header.megaMenu.title}</p>
                                <p className="font-normal text-lg lg:block hidden text-left text-slate-400">
                                  {header.megaMenu.description}
                                </p>
                              </div>

                              <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 lg:gap-6">
                                {header.megaMenu.items.map((item) => (
                                  <a key={item.href} href={item.href}>
                                    <div className="w-full rounded-lg flex items-center border border-transparent hover:border-sky-primary cursor-pointer py-2 px-1">
                                      <div className="lg:block hidden">
                                        <img alt={item.label} loading="lazy" width="150" height="150" decoding="async"
                                          style={{ color: 'transparent' }} src={item.img} />
                                      </div>
                                      <div>
                                        <p className="font-normal text-base sm:text-lg text-[#1e3a5f] flex items-center w-full">
                                          <span className="text-2xl text-sky-primary flex items-center h-full leading-none lg:hidden">•</span>
                                          <span className="ml-2 lg:ml-0 flex items-center">{item.label}</span>
                                        </p>
                                        <p className="font-normal text-slate-400 text-base text-left lg:block hidden">{item.desc}</p>
                                      </div>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  }
                  return (
                    <li key={link.label} className="relative z-20 hover:text-sky-primary">
                      <a href={link.href} className="flex items-center justify-between text-sm hover:text-yellow-primary transition-colors duration-200 py-2">
                        <span className="cursor-pointer text-base font-normal hover:text-sky-primary text-sky-secondary">{link.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Contact Us Button */}
              <button
                onClick={onOpenContact}
                className="hidden lg:inline-block ml-8 px-4 cursor-pointer py-2 rounded-lg bg-sky-primary text-white md:text-lg text-base shadow hover:rounded-full hover:shadow-lg hover:bg-sky-primary/90 transition-all duration-300">
                {header.contactButtonText}
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden cursor-pointer p-1.5 rounded-md hover:bg-slate-100 transition-colors duration-200 z-20"
                aria-label="Toggle menu">
                {isMobileOpen ? (
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256"
                    className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                  </svg>
                ) : (
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256"
                    className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
                  </svg>
                )}
              </button>
            </nav>
          </div>
        </div>

        {/* Mobile Slide Drawer */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-[1000] lg:hidden">
            <div className="absolute inset-0 bg-gray-900/90" onClick={() => setIsMobileOpen(false)}></div>
            <nav className="relative h-full w-full max-w-[300px] ml-auto bg-white overflow-y-auto">
              <div className="flex items-center justify-between p-4 border-b border-slate-100">
                <img alt="IES" className="w-auto h-8" src="/images/inexserv-logo.png" />
                <button onClick={() => setIsMobileOpen(false)} className="p-1.5 rounded-md hover:bg-slate-100">
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 256 256"
                    className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                  </svg>
                </button>
              </div>
              <div className="py-4 px-4 text-sky-secondary space-y-1">
                {header.navLinks.map(link => (
                  <a key={link.label} href={link.href} onClick={() => setIsMobileOpen(false)}
                    className="flex items-center w-full text-base font-normal text-sky-secondary hover:text-sky-primary py-2.5 px-3 rounded-md hover:bg-slate-50 transition-colors">
                    {link.label}
                  </a>
                ))}
                <button onClick={() => { setIsMobileOpen(false); onOpenContact?.(); }}
                  className="w-full mt-4 py-3 rounded-xl bg-sky-primary text-white font-semibold text-center hover:bg-emerald-600 transition-colors">
                  {header.contactButtonText}
                </button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
}
