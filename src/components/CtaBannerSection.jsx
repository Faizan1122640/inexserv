import React from 'react';
import siteData from '../data/data.json';

export default function CtaBannerSection() {
  const { ctaBanner } = siteData;

  return (
    <div className="md:my-16 my-4 w-full">
      <div className="md:px-0 px-4 sm:p-16 p-8 bg-[#074476] relative overflow-hidden">
        {/* Background SVG overlay */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none select-none" aria-hidden="true">
          <img 
            src="/images/backgroundimage.svg" 
            alt="" 
            className="w-full h-full object-cover opacity-50"
          />
        </div>

        <div className="flex flex-col w-full md:flex-row md:justify-between items-start md:items-center gap-6 max-w-[1440px] md:w-[90%] mx-auto relative z-10">
          {/* Left Text */}
          <div className="w-full md:w-[70%]">
            <h2 className="font-bold text-3xl md:text-5xl text-white leading-tight tracking-tight">
              {ctaBanner.titleLine1}<br />
              {ctaBanner.titleLine2}
            </h2>
            <p className="text-sm md:text-lg text-white/90 mt-3 font-normal leading-relaxed max-w-2xl">
              {ctaBanner.paragraph}
            </p>
          </div>

          {/* Right Button */}
          <div className="flex items-center sm:justify-end justify-start w-full md:w-auto whitespace-nowrap mt-2 md:mt-0">
            <button 
              type="button"
              className="font-medium text-sm md:text-base bg-[#5c6e82]/80 border border-white/30 text-white hover:bg-[#04A552] hover:border-[#04A552] transition-all duration-300 px-6 py-3 rounded-xl flex gap-2.5 items-center justify-center cursor-pointer shadow-md"
            >
              <span>{ctaBanner.buttonText}</span>
              <svg 
                stroke="currentColor" 
                fill="currentColor" 
                strokeWidth="0" 
                viewBox="0 0 448 512" 
                className="w-4 h-4 text-white" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
