import React, { useState, useEffect, useRef } from 'react';
import fallbackData from '../data/data.json';

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

export default function ServicesSection({ data }) {
  const servicesSection = data || fallbackData.servicesSection;
  const [headerRef, headerInView] = useInView({ threshold: 0.2 });
  const [gridRef, gridInView] = useInView({ threshold: 0.1 });

  return (
    <div className="md:my-16 my-4">
      <div className="w-full">

        {/* Section Header with Scroll Reveal */}
        <div
          ref={headerRef}
          className="max-w-[1800px] mx-auto px-4 md:w-[90%] w-full md:px-0 pb-16 transition-all duration-700 ease-out"
          style={{
            opacity: headerInView ? 1 : 0,
            transform: headerInView ? 'translateY(0)' : 'translateY(40px)',
          }}
        >
          <p className="font-normal md:text-5xl text-2xl text-[#0f2b48] mb-1">
            {servicesSection.title}
          </p>
          <div className="flex items-center gap-1.5 my-3" alt="Underline">
            <span className="w-2.5 h-1 bg-[#04A552] rounded-full inline-block"></span>
            <span className="w-24 h-1 bg-[#04A552] rounded-full inline-block"></span>
          </div>
          <p className="font-normal text-lg text-[#0f2b48] max-w-4xl">
            {servicesSection.subtitle}
          </p>
        </div>

        {/* 3-Column Services Grid with Staggered Scroll Reveal */}
        <div
          ref={gridRef}
          className="max-w-[1800px] md:w-[90%] w-full mx-auto md:px-0 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6 px-4 pb-14"
        >
          {servicesSection.services.map((item, idx) => (
            <div
              key={idx}
              className="cursor-pointer group h-full transition-all duration-700 ease-out"
              style={{
                opacity: gridInView ? 1 : 0,
                transform: gridInView ? 'translateY(0)' : 'translateY(50px)',
                transitionDelay: `${idx * 100}ms`,
              }}
            >
              <a href={item.href} className="h-full flex flex-col flex-1">
                <div className="bg-center hover:shadow-xl w-full sm:px-0 px-4 md:min-h-[420px] h-full flex flex-col items-center border border-[#04A552] transition-colors duration-300 bg-white">
                  
                  {/* Icon wrapper */}
                  <div
                    className="w-full flex justify-center items-center pt-8 pb-4 transition-all duration-500 ease-out"
                    style={{
                      opacity: gridInView ? 1 : 0,
                      transform: gridInView ? 'scale(1)' : 'scale(0.75)',
                      transitionDelay: `${idx * 100 + 150}ms`,
                    }}
                  >
                    <img
                      src={item.img}
                      alt={item.title}
                      className="w-14 h-14 object-contain mx-auto block"
                    />
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-medium mb-2 text-center leading-9 text-[#0f2b48]">
                    {item.title}
                  </h2>

                  {/* Description + Read More */}
                  <div className="text-[#94a3b8] text-center px-6 md:mb-2 mb-5 text-base leading-8 flex flex-col justify-between flex-1 w-full">
                    <span className="block mb-4">{item.desc}</span>

                    {/* Read More Link */}
                    <span className="mt-auto mb-6 text-[#04A552] whitespace-nowrap font-medium text-base transition-all duration-200 inline-flex items-center justify-center gap-1 group-hover:underline">
                      Read More
                      <svg
                        stroke="currentColor"
                        fill="currentColor"
                        strokeWidth="0"
                        version="1.2"
                        baseProfile="tiny"
                        viewBox="0 0 24 24"
                        className="inline mb-.5 w-[18px] h-[18px] transition-transform duration-300 group-hover:translate-x-1.5"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.293 7.293c-.391.391-.391 1.023 0 1.414l2.293 2.293h-7.586c-.552 0-1 .448-1 1s.448 1 1 1h7.586l-2.293 2.293c-.391.391-.391 1.023 0 1.414.195.195.451.293.707.293s.512-.098.707-.293l4.707-4.707-4.707-4.707c-.391-.391-1.023-.391-1.414 0z" />
                      </svg>
                    </span>
                  </div>

                </div>
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
