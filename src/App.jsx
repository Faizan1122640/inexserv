import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Preloader from './components/Preloader';
import Header from './components/Header';
import Hero from './components/Hero';
import ServicesSection from './components/ServicesSection';
import SolutionsSection from './components/SolutionsSection';
import TechStackSection from './components/TechStackSection';
import CtaBannerSection from './components/CtaBannerSection';
import HireDevSection from './components/HireDevSection';
import FooterSection from './components/FooterSection';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { useSiteData } from './hooks/useSiteData';

function MainWebsite() {
  const { data, loading } = useSiteData();

  if (loading) return null;

  return (
    <div className="min-h-screen bg-white text-[#0f2b48] font-sans antialiased overflow-x-hidden">
      <Preloader />
      <Header />
      <main>
        <Hero data={data.hero} />
        <ServicesSection data={data.servicesSection} />
        <SolutionsSection data={data.solutionsSection} />
        <TechStackSection data={data.techStackSection} />
        <CtaBannerSection data={data.ctaBanner} />
        <HireDevSection data={data.hireDevSection} />
      </main>
      <FooterSection data={data.footer} officeLocations={data.officeLocations} />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainWebsite />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
