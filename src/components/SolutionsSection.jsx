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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return [ref, isInView];
}

export default function SolutionsSection() {
  const { solutionsSection } = siteData;
  const [headerRef, headerInView] = useInView({ threshold: 0.2 });
  const [gridRef, gridInView] = useInView({ threshold: 0.1 });

  return (
    <section className="md:my-16 my-8 relative overflow-hidden">
      <div className="max-w-[1800px] mx-auto md:w-[90%] w-full relative z-10 md:px-0">
        
        {/* Decorative background layers image */}
        <div className="absolute -right-[5%] top-0 z-0 hidden md:block pointer-events-none opacity-40">
          <img
            alt="Background Layers"
            width="800"
            height="800"
            className="w-auto h-auto"
            src="/images/layers.svg"
          />
        </div>

        {/* Section Header with Scroll Reveal */}
        <div
          ref={headerRef}
          className="max-w-[1800px] mx-auto px-4 sm:px-0 w-full relative z-10 transition-all duration-700 ease-out"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <h2 className="md:text-5xl text-2xl mb-4 text-[#0f2b48]">
            {solutionsSection.title}
          </h2>
          <div className="flex items-center gap-1.5 my-2 mb-4 justify-start">
            <span className="w-2.5 h-1 bg-[#04A552] rounded-full inline-block"></span>
            <span className="w-24 h-1 bg-[#04A552] rounded-full inline-block"></span>
          </div>
          <p className="md:text-xl text-base font-normal text-[#0f2b48] max-w-4xl mb-16">
            {solutionsSection.subtitle}
          </p>

          {/* 3 Dark Blue Cards Grid */}
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10 mx-auto"
          >
            {solutionsSection.solutions.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-[#074476] sm:px-8 px-6 py-6 sm:py-8 text-left hover:shadow-[8px_8px_20px_rgba(0,0,0,0.35)] transition-all duration-500 ease-out relative w-full cursor-pointer group flex flex-col justify-between"
                style={{
                  opacity: gridInView ? 1 : 0,
                  transform: gridInView ? 'translateY(0)' : 'translateY(50px)',
                  transitionDelay: `${idx * 120}ms`,
                }}
              >
                <div>
                  <p className="text-xl md:text-2xl text-white/90 mb-1 pt-4 font-normal">
                    {item.subtitle}
                  </p>
                  <h3 className="text-3xl md:text-4xl text-white mb-4 font-normal">
                    {item.title}
                  </h3>
                  <p className="text-base text-white/80 font-normal mb-8 min-h-[90px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                {/* Button */}
                <div className="pt-2">
                  <a href={item.href}>
                    <button
                      type="button"
                      className="cursor-pointer bg-[#074476] border border-white text-white hover:rounded-full px-6 py-3 rounded-lg flex items-center justify-between gap-3 text-sm md:text-base font-medium transition-all duration-300 w-full sm:w-auto hover:bg-white/10 group-hover:border-[#04A552]"
                    >
                      <span>{item.buttonText}</span>
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
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
