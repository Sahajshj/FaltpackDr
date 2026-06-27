/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Phone, MessageSquare, ShieldCheck, ArrowUp } from 'lucide-react';
import { Page } from './types';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import ServicesView from './components/ServicesView';
import AdditionalServicesView from './components/AdditionalServicesView';
import GalleryView from './components/GalleryView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import QuoteView from './components/QuoteView';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  const [preselectedQuoteService, setPreselectedQuoteService] = useState<string>('');

  const handleQuoteClick = (serviceName?: string) => {
    if (serviceName && typeof serviceName === 'string') {
      setPreselectedQuoteService(serviceName);
    } else {
      setPreselectedQuoteService('');
    }
    setCurrentPage('quote');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render current view
  const renderView = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomeView
            setCurrentPage={setCurrentPage}
            onQuoteClick={handleQuoteClick}
            setSelectedServiceId={setSelectedServiceId}
          />
        );
      case 'services':
        return (
          <ServicesView
            onQuoteClick={handleQuoteClick}
            selectedServiceId={selectedServiceId}
            setSelectedServiceId={setSelectedServiceId}
          />
        );
      case 'additional-services':
        return (
          <AdditionalServicesView
            onQuoteClick={handleQuoteClick}
            setCurrentPage={setCurrentPage}
            selectedServiceId={selectedServiceId}
            setSelectedServiceId={setSelectedServiceId}
          />
        );
      case 'gallery':
        return <GalleryView onQuoteClick={handleQuoteClick} />;

      case 'about':
        return (
          <AboutView
            onQuoteClick={handleQuoteClick}
            setCurrentPage={setCurrentPage}
          />
        );
      case 'contact':
        return <ContactView onQuoteClick={handleQuoteClick} />;
      case 'quote':
        return <QuoteView initialItems={preselectedQuoteService} />;
      default:
        return (
          <HomeView
            setCurrentPage={setCurrentPage}
            onQuoteClick={handleQuoteClick}
            setSelectedServiceId={setSelectedServiceId}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] font-sans antialiased flex flex-col justify-between selection:bg-emerald-100 selection:text-emerald-950">
      
      {/* Sticky Translucent Navbar */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        onQuoteClick={handleQuoteClick}
        setSelectedServiceId={setSelectedServiceId}
      />

      {/* Main Viewport container */}
      <main className="flex-grow">
        {renderView()}
      </main>

      {/* Global Footer */}
      <Footer
        setCurrentPage={setCurrentPage}
        onQuoteClick={handleQuoteClick}
      />

      {/* 1. FLOATING WHATSAPP CHAT BUBBLE */}
      <a
        href="https://wa.me/61489220855"
        target="_blank"
        rel="noreferrer referrer"
        className="fixed bottom-20 md:bottom-6 right-6 z-40 bg-[#25D366] hover:bg-[#20ba5a] text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hidden md:flex items-center justify-center group"
        aria-label="Chat with Prabh on WhatsApp"
        title="Chat with Prabh on WhatsApp"
      >
        <MessageSquare className="w-6 h-6 fill-white text-[#25D366] group-hover:rotate-12 transition-transform duration-300" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs group-hover:ml-2 transition-all duration-500 font-semibold text-xs whitespace-nowrap">
          WhatsApp Prabh
        </span>
      </a>

      {/* 2. MOBILE STICKY BOTTOM ACTION CTA BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-[#fcfbfa]/95 backdrop-blur border-t border-stone-200 shadow-xl z-40 grid grid-cols-2 lg:hidden py-3 px-4 gap-3">
        <a
          href="https://wa.me/61489220855"
          target="_blank"
          rel="noreferrer referrer"
          className="bg-stone-100 hover:bg-stone-200 text-stone-900 font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-stone-200"
        >
          <MessageSquare className="w-4 h-4 text-[#25D366]" />
          WhatsApp Prabh
        </a>
        <button
          onClick={handleQuoteClick}
          className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow"
        >
          <ShieldCheck className="w-4 h-4" />
          Get Quote
        </button>
      </div>

    </div>
  );
}
