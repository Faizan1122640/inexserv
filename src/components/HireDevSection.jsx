import React, { useState } from 'react';
import siteData from '../data/data.json';

export default function HireDevSection() {
  const { hireDevSection } = siteData;
  const hireCategories = hireDevSection.hireCategories;
  const [activeTab, setActiveTab] = useState(hireCategories[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const currentCategory = hireCategories.find(c => c.id === activeTab) || hireCategories[0];
  const filteredTechs = currentCategory.techs.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="md:my-16 my-4 w-full">
      <div className="mx-auto sm:py-8 mt-10 px-4 md:w-[95%] w-full max-w-[1800px]">
        {/* Header and Search */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="w-full">
            <div className="flex flex-col sm:flex-row sm:gap-2 gap-1 w-full items-start sm:items-center justify-between">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-normal leading-tight">
                <span className="text-[#0f2b48]">{hireDevSection.titlePart1}</span>
                <span className="text-[#04A552]">{hireDevSection.titlePart2}</span>
              </h2>

              {/* Search Bar */}
              <div className="mt-4 sm:mt-0 w-full sm:w-auto">
                <div className="relative flex items-center w-full sm:w-72">
                  <span className="absolute left-3 text-gray-400">
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className="w-4 h-4 text-[#0f2b48]" xmlns="http://www.w3.org/2000/svg">
                      <path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path>
                    </svg>
                  </span>
                  <input
                    type="search"
                    placeholder={hireDevSection.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:border-[#04A552] transition-colors"
                  />
                </div>
              </div>
            </div>

            <p className="text-sm sm:text-lg font-normal text-gray-600 mt-3 max-w-3xl">
              {hireDevSection.description}
            </p>
          </div>
        </div>

        {/* Tab Buttons Row */}
        <div className="hidden md:block overflow-hidden mb-6">
          <div className="grid grid-cols-7 border border-[#04A552] rounded-lg overflow-hidden">
            {hireCategories.map((cat) => {
              const isActive = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`text-lg cursor-pointer py-3.5 px-4 text-center border-r border-[#04A552] last:border-r-0 transition-colors font-medium ${isActive
                      ? 'bg-[#04A552] text-white'
                      : 'bg-white text-[#0f2b48] hover:bg-gray-50'
                    }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tech Cards Grid */}
        <div className="flex flex-wrap justify-center max-w-[1800px] w-full mx-auto gap-2 mb-16">
          {filteredTechs.map((tech, idx) => (
            <div
              key={idx}
              className="w-28 h-28 flex flex-col items-center justify-center p-2.5 border border-[#04A552] rounded-sm hover:shadow-md transition-all bg-white"
            >
              <div className="mb-2 min-h-12 flex items-center justify-center">
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-sm font-medium text-[#0f2b48] text-center leading-tight">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
