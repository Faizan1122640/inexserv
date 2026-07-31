import React from 'react';
import fallbackData from '../data/data.json';

export default function SolutionsSection({ data }) {
  const solutionsSection = data || fallbackData.solutionsSection;

  return (
    <div className="w-full bg-[#074476] py-16 text-white overflow-hidden">
      <div className="max-w-[1800px] md:w-[90%] w-full mx-auto px-4 md:px-0">
        
        {/* Section Header */}
        <div className="pb-12">
          <p className="font-normal md:text-5xl text-2xl text-white mb-2">
            {solutionsSection.title}
          </p>
          <div className="flex items-center gap-1.5 my-3">
            <span className="w-2.5 h-1 bg-[#04A552] rounded-full inline-block"></span>
            <span className="w-24 h-1 bg-[#04A552] rounded-full inline-block"></span>
          </div>
          <p className="font-normal text-lg text-slate-300 max-w-3xl">
            {solutionsSection.subtitle}
          </p>
        </div>

        {/* 3 Solution Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {solutionsSection.solutions.map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 p-8 rounded-2xl flex flex-col justify-between hover:border-[#04A552] transition-colors duration-300">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#04A552] font-semibold">{item.subtitle}</span>
                <h3 className="text-2xl font-bold text-white mt-1 mb-4">{item.title}</h3>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">{item.desc}</p>
              </div>
              <a
                href={item.href}
                className="inline-flex items-center justify-between w-full py-3 px-6 rounded-lg bg-[#04A552] hover:bg-emerald-600 text-white font-medium transition-colors duration-200 text-sm"
              >
                <span>{item.buttonText}</span>
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z"></path>
                </svg>
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
