import React, { useState, useEffect, useRef } from 'react';
import siteData from '../data/data.json';

function useInView(options = { threshold: 0.15 }) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, options);

    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return [ref, isInView];
}

export default function TechStackSection() {
  const { techStackSection } = siteData;
  const categories = techStackSection.categories;
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [headerRef, headerInView] = useInView({ threshold: 0.2 });
  const [bodyRef, bodyInView] = useInView({ threshold: 0.1 });

  const activeData = categories.find(c => c.id === activeCategory) || categories[0];

  return (
    <section className="md:my-24 my-12 bg-white">
      <div className="max-w-[1800px] mx-auto md:w-[90%] w-full sm:px-0 px-4">

        {/* Section Header with Scroll Reveal */}
        <div
          ref={headerRef}
          className="pb-12 transition-all duration-700 ease-out"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <p className="font-normal text-[#0f2b48] md:text-5xl text-2xl mb-4">
            {techStackSection.titlePrefix}{' '}
            <span className="text-[#04A552] md:text-5xl text-2xl">
              {techStackSection.titleHighlight}
            </span>
          </p>
          <p className="text-[#0f2b48] text-lg md:text-xl font-normal">
            {techStackSection.subtitle}
          </p>
        </div>

        {/* Desktop Layout (Grid Selector + Active Details Panel) */}
        <div
          ref={bodyRef}
          className="flex flex-col lg:flex-row sm:pb-8 mx-auto lg:gap-16 transition-all duration-700 ease-out"
          style={{
            opacity: bodyInView ? 1 : 0,
            transform: bodyInView ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          {/* Left Side: 6 Category Cards Grid (3x2) */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:w-1/2 w-full">
            {categories.map(cat => {
              const isActive = cat.id === activeCategory;
              return (
                <div
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="cursor-pointer transition duration-300 w-full"
                >
                  <div
                    className={`h-52 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 shadow-md hover:shadow-[6px_5px_10px_rgba(0,0,0,0.2)] ${isActive
                      ? 'bg-[#074476] text-white'
                      : 'bg-white border border-[#04A552] text-[#0f2b48]'
                      }`}
                  >
                    <img
                      src={cat.img}
                      alt={cat.title}
                      className="w-12 h-12 object-contain mb-3"
                      style={isActive ? { filter: 'brightness(0) invert(1)' } : undefined}
                    />
                    <div className="text-center w-32 px-1 text-sm sm:text-lg leading-snug font-medium">
                      {cat.title}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Side: Active Category Details Panel */}
          <div className="lg:w-1/2 w-full mt-8 lg:mt-0 flex flex-col justify-between pt-2">
            <div>
              {/* Active Category Title */}
              <h3 className="text-3xl md:text-4xl font-normal text-[#0f2b48] mb-3">
                {activeData.title}
              </h3>

              {/* Description */}
              <p className="text-slate-600 text-base md:text-lg leading-relaxed mb-6">
                {activeData.desc}
              </p>

              {/* Bullet Points */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
                {activeData.bullets.map((bullet, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg
                      stroke="currentColor"
                      fill="currentColor"
                      strokeWidth="0"
                      viewBox="0 0 24 24"
                      className="w-4 h-4 text-[#04A552] flex-shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12Z" />
                    </svg>
                    <span className="text-base text-[#0f2b48] font-normal">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>

              {/* Tech Stack SVGs Row */}
              <div className="flex flex-wrap gap-3 items-center mb-8 max-w-[480px]">
                {activeData.techLogos.map((logoSrc, idx) => (
                  <div key={idx} className="w-8 h-8 flex items-center justify-center">
                    <img
                      src={logoSrc}
                      alt={`Tech Logo ${idx + 1}`}
                      className="w-7 h-7 object-contain"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <div>
              <a href={`/services/${activeData.id}`}>
                <button
                  type="submit"
                  className="cursor-pointer border border-[#04A552] text-[#04A552] hover:bg-[#04A552] hover:text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-between gap-3 group hover:rounded-full min-w-[140px]"
                >
                  <span>View More</span>
                  <svg
                    stroke="currentColor"
                    fill="currentColor"
                    strokeWidth="0"
                    viewBox="0 0 448 512"
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M190.5 66.9l22.2-22.2c9.4-9.4 24.6-9.4 33.9 0L441 239c9.4 9.4 9.4 24.6 0 33.9L246.6 467.3c-9.4 9.4-24.6 9.4-33.9 0l-22.2-22.2c-9.5-9.5-9.3-25 .4-34.3L311.4 296H24c-13.3 0-24-10.7-24-24v-32c0-13.3 10.7-24 24-24h287.4L190.9 101.2c-9.8-9.3-10-24.8-.4-34.3z" />
                  </svg>
                </button>
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
