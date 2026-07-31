import React, { useState } from 'react';
import fallbackData from '../data/data.json';

export default function TechStackSection({ data }) {
  const techStackSection = data || fallbackData.techStackSection;
  const [activeTabId, setActiveTabId] = useState(techStackSection.categories[0]?.id || 'product-engineering');

  const activeCategory = techStackSection.categories.find(c => c.id === activeTabId) || techStackSection.categories[0];

  return (
    <div className="max-w-[1800px] md:w-[90%] w-full mx-auto px-4 md:px-0 py-16">
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-normal text-[#0f2b48]">
          {techStackSection.titlePrefix}
          <span className="text-[#04A552] font-semibold">{techStackSection.titleHighlight}</span>
        </h2>
        <div className="flex items-center gap-1.5 my-3">
          <span className="w-2.5 h-1 bg-[#04A552] rounded-full inline-block"></span>
          <span className="w-24 h-1 bg-[#04A552] rounded-full inline-block"></span>
        </div>
        <p className="text-slate-500 text-lg max-w-3xl">{techStackSection.subtitle}</p>
      </div>

      {/* Grid Layout: Left Tabs / Right Active Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Categories Selector */}
        <div className="lg:col-span-4 space-y-3">
          {techStackSection.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveTabId(cat.id)}
              className={`w-full text-left p-4 rounded-xl border flex items-center gap-4 transition-all duration-300 cursor-pointer ${
                activeTabId === cat.id
                  ? 'bg-[#074476] text-white border-[#074476] shadow-lg'
                  : 'bg-white text-[#0f2b48] border-slate-200 hover:border-[#04A552]'
              }`}
            >
              <img src={cat.img} alt={cat.title} className="w-8 h-8 object-contain filter brightness-0 invert opacity-90" />
              <span className="font-medium text-base md:text-lg">{cat.title}</span>
            </button>
          ))}
        </div>

        {/* Right Active Category Details */}
        <div className="lg:col-span-8 bg-slate-50 border border-slate-200 rounded-2xl p-8 space-y-6">
          <h3 className="text-2xl font-bold text-[#0f2b48]">{activeCategory.title}</h3>
          <p className="text-slate-600 text-base leading-relaxed">{activeCategory.desc}</p>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm uppercase tracking-wider text-[#04A552]">Capabilities:</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeCategory.bullets.map((b, idx) => (
                <li key={idx} className="flex items-center gap-2 text-slate-700 font-medium text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#04A552]"></span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
