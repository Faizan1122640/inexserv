import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fallbackData from '../data/data.json';

export default function Hero({ data, onOpenContact }) {
  const navigate = useNavigate();
  const hero = data || fallbackData.hero;
  const [kwIdx, setKwIdx] = useState(0);
  const [kwVisible, setKwVisible] = useState(true);

  const partnerLogos = hero.partnerLogos || fallbackData.hero.partnerLogos;
  const marqueeLogos = [...partnerLogos, ...partnerLogos, ...partnerLogos];

  const handleContactClick = () => {
    if (onOpenContact) {
      onOpenContact();
    } else {
      navigate('/contact');
    }
  };

  useEffect(() => {
    if (!hero.keywords || hero.keywords.length === 0) return;
    const id = setInterval(() => {
      setKwVisible(false);
      setTimeout(() => {
        setKwIdx(prev => (prev + 1) % hero.keywords.length);
        setKwVisible(true);
      }, 300);
    }, 2800);
    return () => clearInterval(id);
  }, [hero.keywords]);

  return (
    <div className="max-w-[1800px] relative mx-auto w-full overflow-hidden" style={{ opacity: 1 }}>

      {/* ── Background coding video ── */}
      <div className="absolute right-0 top-7 lg:top-0 bottom-0 h-full max-h-full w-[1000px] z-[0] pointer-events-none overflow-hidden">
        <video
          className="w-full h-full object-cover block scale-110 origin-right"
          autoPlay loop muted playsInline preload="auto"
          src="/images/hero-section/coding-videoo.mp4"
        />
      </div>

      {/* ── Hero Content ── */}
      <div
        className="relative z-[1] w-full max-w-[1800px] md:w-[90%] mx-auto sm:min-h-[100vh] bg-cover bg-center bg-no-repeat lg:py-16 2xl:py-24 pt-10 md:pb-32 md:pt-16 sm:px-4 px-2 md:px-0 overflow-hidden"
        style={{ backgroundImage: "url('/images/hero-section/Bg-curv.png')" }}
      >
        <div>
          {/* Tag line */}
          <div style={{ opacity: 1, transform: 'none' }}>
            <p className="md:text-xl uppercase text-lg text-sky-primary pt-14 mb-4 pl-1 text-left font-normal">
              {hero.tagline}
            </p>
          </div>

          {/* Headline + rotating keyword */}
          <div style={{ opacity: 1, transform: 'none' }}>
            <p className="lg:text-5xl text-2xl text-[#1e3a5f] pl-1 sm:mb-4 leading-10 sm:leading-tight text-left font-normal">
              {hero.titleLine1}
            </p>

            <div className="flex flex-wrap sm:mb-8 justify-start sm:flex-row flex-col items-start">
              <p className="lg:text-5xl text-2xl max-w-3xl text-[#1e3a5f] pl-1 leading-10 sm:leading-[3.5rem] text-left mr-2 mb-0 font-normal">
                {hero.titleLine2}
              </p>
              <span
                className="inline-block border border-sky-primary ml-1 sm:ml-0 px-4 py-2 rounded-xl md:text-5xl text-2xl align-middle text-center overflow-hidden relative"
                style={{
                  transition: 'opacity 0.3s, transform 0.3s',
                  opacity: kwVisible ? 1 : 0,
                  transform: kwVisible ? 'translateY(0)' : 'translateY(-8px)',
                }}
              >
                <span className="text-gradient inline-block whitespace-nowrap">
                  {hero.keywords?.[kwIdx] || 'AI'}
                </span>
              </span>
            </div>

            <p className="md:text-xl text-lg text-slate-500 lg:w-[57%] w-[100%] pl-1 mb-6 mt-6 text-left font-normal">
              {hero.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="mb-10 ml-1 flex md:flex-row flex-col gap-8 sm:items-center justify-start" style={{ opacity: 1, transform: 'none' }}>
            <button
              onClick={handleContactClick}
              className="cursor-pointer flex items-center justify-center bg-sky-primary text-base md:text-lg py-3 md:py-3.5 px-6 md:px-8 text-white rounded-lg hover:rounded-full transition-all duration-300 font-medium shadow min-w-[150px]"
              type="button"
            >
              {hero.ctaLetstalk || "Let's Talk"}
            </button>

            <a
              href="#services"
              className="flex gap-2.5 hover:cursor-pointer items-center group"
            >
              <p className="text-sky-primary text-base md:text-lg font-medium group-hover:text-sky-primary transition-colors duration-200">
                {hero.ctaLearnMore || 'Learn More'}
              </p>
              <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 20 20"
                aria-hidden="true"
                className="text-sky-primary text-xl transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110"
                height="24" width="24" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd"
                  d="M2 10a.75.75 0 0 1 .75-.75h12.59l-2.1-1.95a.75.75 0 1 1 1.02-1.1l3.5 3.25a.75.75 0 0 1 0 1.1l-3.5 3.25a.75.75 0 1 1-1.02-1.1l2.1-1.95H2.75A.75.75 0 0 1 2 10Z"
                  clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* ── Partner Logos Marquee ── */}
      <div
        className="md:absolute md:bottom-0 w-full z-10 bg-[#074476] py-4"
        style={{ opacity: 1, transform: 'none' }}
      >
        <div className="max-w-[1800px] md:w-[90%] w-full mx-auto px-4">
          <div className="overflow-hidden relative">
            <div className="flex gap-8 items-center animate-marquee">
              {marqueeLogos.map((logo, idx) => (
                <div key={idx} className="flex justify-center px-2 flex-shrink-0">
                  <div className="flex items-center justify-center w-full h-full">
                    <img
                      alt={logo.name}
                      width="400"
                      height="400"
                      decoding="async"
                      className="h-10 md:h-12 lg:h-14 w-auto object-contain mx-auto"
                      style={{ color: 'transparent' }}
                      src={logo.src}
                      onError={e => { e.target.style.display = 'none'; }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
