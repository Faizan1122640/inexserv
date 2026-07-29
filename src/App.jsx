import React from 'react';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import SolutionsSection from './components/SolutionsSection';
import TechStackSection from './components/TechStackSection';
import CtaBannerSection from './components/CtaBannerSection';
import HireDevSection from './components/HireDevSection';
import FooterSection from './components/FooterSection';

export default function App() {
  return (
    <div className="min-h-screen bg-white text-[#0f2b48] font-sans antialiased overflow-x-hidden">
      <Preloader />
      <Header />
      <main>
        <Hero />
        <ServicesSection />
        <SolutionsSection />
        <TechStackSection />
        <CtaBannerSection />
        <HireDevSection />
      </main>
      <FooterSection />
    </div>
  );
}
