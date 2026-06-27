/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
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

const PAGE_PATHS: Record<Page, string> = {
  home: '/',
  services: '/services',
  'additional-services': '/additional-services',
  quote: '/quote',
  gallery: '/gallery',
  reviews: '/#reviews',
  about: '/about',
  contact: '/contact',
};

const PATH_PAGES: Record<string, Page> = {
  '/': 'home',
  '/services': 'services',
  '/additional-services': 'additional-services',
  '/quote': 'quote',
  '/gallery': 'gallery',
  '/about': 'about',
  '/contact': 'contact',
};

const readLocation = () => {
  const pathname = window.location.pathname.replace(/\/$/, '') || '/';
  const page = PATH_PAGES[pathname] ?? 'home';
  const params = new URLSearchParams(window.location.search);

  return {
    page,
    selectedServiceId:
      page === 'services' || page === 'additional-services'
        ? params.get('service')
        : null,
    quoteItems: page === 'quote' ? params.get('items') ?? '' : '',
  };
};

const scrollToLocationHash = (behavior: ScrollBehavior = 'auto') => {
  const sectionId = decodeURIComponent(window.location.hash.slice(1));
  if (!sectionId) return;

  // Wait for the home view to mount when arriving from another page or a direct URL.
  window.setTimeout(() => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior, block: 'start' });
  }, 100);
};

export default function App() {
  const initialLocation = useRef(readLocation()).current;
  const [currentPage, setCurrentPageState] = useState<Page>(initialLocation.page);
  const [selectedServiceId, setSelectedServiceIdState] = useState<string | null>(initialLocation.selectedServiceId);
  const selectedServiceIdRef = useRef<string | null>(initialLocation.selectedServiceId);
  const [preselectedQuoteService, setPreselectedQuoteService] = useState<string>(initialLocation.quoteItems);

  const setSelectedServiceId = (id: string | null) => {
    selectedServiceIdRef.current = id;
    setSelectedServiceIdState(id);
  };

  const navigateToPage = (requestedPage: Page, quoteItems = '') => {
    // Reviews are a section on the home page rather than a standalone view.
    const isReviewsSection = requestedPage === 'reviews';
    const page: Page = isReviewsSection ? 'home' : requestedPage;
    const params = new URLSearchParams();

    if ((page === 'services' || page === 'additional-services') && selectedServiceIdRef.current) {
      params.set('service', selectedServiceIdRef.current);
    }
    if (page === 'quote' && quoteItems) {
      params.set('items', quoteItems);
    }

    const query = params.toString();
    const nextUrl = isReviewsSection
      ? PAGE_PATHS.reviews
      : `${PAGE_PATHS[page]}${query ? `?${query}` : ''}`;
    const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;

    if (currentUrl !== nextUrl) {
      window.history.pushState({}, '', nextUrl);
    }
    setCurrentPageState(page);
  };

  useEffect(() => {
    const handlePopState = () => {
      const location = readLocation();
      selectedServiceIdRef.current = location.selectedServiceId;
      setSelectedServiceIdState(location.selectedServiceId);
      setPreselectedQuoteService(location.quoteItems);
      setCurrentPageState(location.page);
      if (location.page === 'home') {
        scrollToLocationHash();
      }
    };

    window.addEventListener('popstate', handlePopState);
    scrollToLocationHash();
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const titles: Record<Page, string> = {
      home: 'Flatpack Doctors | Furniture Assembly Victoria',
      services: 'Furniture Assembly Services | Flatpack Doctors',
      'additional-services': 'Additional Services | Flatpack Doctors',
      quote: 'Get a Quote | Flatpack Doctors',
      gallery: 'Recent Work | Flatpack Doctors',
      reviews: 'Customer Reviews | Flatpack Doctors',
      about: 'About Us | Flatpack Doctors',
      contact: 'Contact Us | Flatpack Doctors',
    };
    document.title = titles[currentPage];
  }, [currentPage]);

  const handleQuoteClick = (serviceName?: string) => {
    if (serviceName && typeof serviceName === 'string') {
      setPreselectedQuoteService(serviceName);
    } else {
      setPreselectedQuoteService('');
    }
    navigateToPage('quote', serviceName || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Render current view
  const renderView = () => {
    switch (currentPage) {
      case 'home':
        return (
          <HomeView
            setCurrentPage={navigateToPage}
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
            setCurrentPage={navigateToPage}
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
            setCurrentPage={navigateToPage}
          />
        );
      case 'contact':
        return <ContactView onQuoteClick={handleQuoteClick} />;
      case 'quote':
        return <QuoteView initialItems={preselectedQuoteService} />;
      default:
        return (
          <HomeView
            setCurrentPage={navigateToPage}
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
        setCurrentPage={navigateToPage}
        onQuoteClick={handleQuoteClick}
        selectedServiceId={selectedServiceId}
        setSelectedServiceId={setSelectedServiceId}
      />

      {/* Main Viewport container */}
      <main className="flex-grow">
        {renderView()}
      </main>

      {/* Global Footer */}
      <Footer
        setCurrentPage={navigateToPage}
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
