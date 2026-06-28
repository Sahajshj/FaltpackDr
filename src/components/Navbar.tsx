import { useState, useEffect, useRef } from 'react';
import { 
  Menu, X, Phone, ArrowRight, ShieldCheck, ChevronDown, ChevronRight,
  Wrench, Layers, Layout, Bed, FolderKanban, Tv, Laptop, Sun, 
  ShieldAlert, RefreshCw, Ruler, Move, Sparkles, Hammer, Trash2, 
  Activity, MoveUpRight, Maximize2, Shuffle, CheckCircle2, Search, PackageOpen
} from 'lucide-react';
import { Page } from '../types';
import { SERVICES_DATA, ADDITIONAL_SERVICES_DATA } from '../data';

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onQuoteClick: () => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
}

export default function Navbar({ 
  currentPage, 
  setCurrentPage, 
  onQuoteClick,
  selectedServiceId,
  setSelectedServiceId
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isHomeMenuOpen, setIsHomeMenuOpen] = useState(false);
  const [activeHomeSection, setActiveHomeSection] = useState(() => decodeURIComponent(window.location.hash.slice(1)));
  
  // Mobile accordion states
  const [isMobileHomeExpanded, setIsMobileHomeExpanded] = useState(false);
  const [isMobileGeneralExpanded, setIsMobileGeneralExpanded] = useState(false);
  const [isMobileAdditionalExpanded, setIsMobileAdditionalExpanded] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const homeMenuRef = useRef<HTMLDivElement>(null);
  const homeTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const syncHomeSection = () => {
      setActiveHomeSection(decodeURIComponent(window.location.hash.slice(1)));
    };
    window.addEventListener('popstate', syncHomeSection);
    return () => window.removeEventListener('popstate', syncHomeSection);
  }, []);

  // Refresh the active Home subsection when opening the drawer. Accordion
  // expansion is intentionally preserved between openings.
  useEffect(() => {
    if (isMobileMenuOpen) {
      setActiveHomeSection(decodeURIComponent(window.location.hash.slice(1)));
    }
  }, [isMobileMenuOpen]);

  // Prevent page scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close menu panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Services dropdown click outside
      if (
        isServicesMenuOpen &&
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsServicesMenuOpen(false);
      }

      // Home dropdown click outside
      if (
        isHomeMenuOpen &&
        homeMenuRef.current && 
        !homeMenuRef.current.contains(event.target as Node) &&
        homeTriggerRef.current &&
        !homeTriggerRef.current.contains(event.target as Node)
      ) {
        setIsHomeMenuOpen(false);
      }
    };
    if (isServicesMenuOpen || isHomeMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isServicesMenuOpen, isHomeMenuOpen]);

  // Map service icons to Lucide elements inside the dropdown
  const getServiceIcon = (iconName: string, className: string = "w-4 h-4") => {
    switch (iconName) {
      case 'Wrench': return <Wrench className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Layout': return <Layout className={className} />;
      case 'Bed': return <Bed className={className} />;
      case 'FolderKanban': return <FolderKanban className={className} />;
      case 'Tv': return <Tv className={className} />;
      case 'Laptop': return <Laptop className={className} />;
      case 'Sun': return <Sun className={className} />;
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'RefreshCw': return <RefreshCw className={className} />;
      case 'Ruler': return <Ruler className={className} />;
      case 'Move': return <Move className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Hammer': return <Hammer className={className} />;
      case 'Trash2': return <Trash2 className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'MoveUpRight': return <MoveUpRight className={className} />;
      case 'Maximize2': return <Maximize2 className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Shuffle': return <Shuffle className={className} />;
      case 'CheckCircle2': return <CheckCircle2 className={className} />;
      default: return <Wrench className={className} />;
    }
  };

  const navLinks: { label: string; page: Page }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Services', page: 'services' },
    { label: 'Gallery', page: 'gallery' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const toggleServicesMenu = () => {
    setIsHomeMenuOpen(false);
    setIsServicesMenuOpen(!isServicesMenuOpen);
  };

  const toggleHomeMenu = () => {
    setIsServicesMenuOpen(false);
    if (!isHomeMenuOpen) {
      setActiveHomeSection(decodeURIComponent(window.location.hash.slice(1)));
    }
    setIsHomeMenuOpen(!isHomeMenuOpen);
  };

  const handleNavClick = (page: Page) => {
    if (page === 'home') setActiveHomeSection('');
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    setIsServicesMenuOpen(false);
    setIsHomeMenuOpen(false);
    // On mobile, wait for the drawer's body-scroll lock to be removed.
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const handleHomeSectionClick = (sectionId: string) => {
    setActiveHomeSection(sectionId);
    setIsMobileMenuOpen(false);
    setIsServicesMenuOpen(false);
    setIsHomeMenuOpen(false);
    const sectionUrl = `/#${encodeURIComponent(sectionId)}`;

    if (currentPage !== 'home') {
      setCurrentPage('home');
      // setCurrentPage creates the history entry; retain it and attach the section hash.
      window.history.replaceState({}, '', sectionUrl);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    } else {
      const currentUrl = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      if (currentUrl !== sectionUrl) {
        window.history.pushState({}, '', sectionUrl);
      }
      window.setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
      }, 50);
    }
  };

  const isHomeSectionActive = (sectionId: string) =>
    currentPage === 'home' && activeHomeSection === sectionId;

  const mobileHomeSectionClass = (sectionId: string) =>
    `w-full text-left py-2.5 px-3 rounded-lg font-semibold text-xs flex items-center justify-between transition-colors ${
      isHomeSectionActive(sectionId)
        ? 'bg-emerald-50 text-emerald-950'
        : 'text-stone-750 hover:bg-stone-50 hover:text-emerald-800'
    }`;

  const handleServiceItemSelect = (id: string, isAdditional: boolean = false) => {
    const targetPage: Page = isAdditional ? 'additional-services' : 'services';
    const isSameCategory = currentPage === targetPage;

    setSelectedServiceId(id);
    setCurrentPage(targetPage);
    setIsServicesMenuOpen(false);
    setIsHomeMenuOpen(false);
    setIsMobileMenuOpen(false);

    // Same-category selections replace/highlight the card in place.
    if (isSameCategory) return;

    // Between catalogs, preserve the deliberate top-then-service transition.
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
    window.setTimeout(() => {
      const isMobile = window.matchMedia('(max-width: 767px)').matches;
      const catalog = isAdditional ? 'additional' : 'general';
      const prefix = isMobile ? `mobile-${catalog}-service-` : `${catalog}-service-`;
      document.getElementById(`${prefix}${id}`)?.scrollIntoView({
        behavior: 'smooth',
        block: isMobile ? 'start' : 'center',
      });
    }, 350);
  };

  return (
    <>
      <nav
        id="main-navbar"
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled || isServicesMenuOpen || isHomeMenuOpen
            ? 'bg-[#fcfbfa]/95 backdrop-blur-md border-b border-stone-200/50 py-3 shadow-sm'
            : 'bg-transparent py-5'
        }`}
      >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Left Side: Brand Text Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex flex-col cursor-pointer group"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold tracking-tight text-stone-900 group-hover:text-emerald-800 transition-colors">
                Flatpack <span className="text-emerald-800">Doctors</span>
              </span>
              <PackageOpen className="w-4 h-4 text-emerald-700" />
            </div>
            <span className="text-[10px] text-stone-500 font-mono tracking-wider uppercase hidden sm:inline">
              Furniture Assembly Done Properly
            </span>
          </div>

          {/* Center Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              if (link.page === 'home') {
                return (
                  <button
                    key={link.page}
                    ref={homeTriggerRef}
                    onClick={toggleHomeMenu}
                    className={`text-xs font-medium px-3 py-1.5 rounded transition-all duration-200 inline-flex items-center gap-1.5 ${
                      currentPage === 'home' || isHomeMenuOpen
                        ? 'text-emerald-950 font-semibold'
                        : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                    }`}
                  >
                    {currentPage === 'home' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-900 shrink-0" />}
                    {link.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isHomeMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                );
              }

              if (link.page === 'services') {
                return (
                  <button
                    key={link.page}
                    ref={triggerRef}
                    onClick={toggleServicesMenu}
                    className={`text-xs font-medium px-3 py-1.5 rounded transition-all duration-200 inline-flex items-center gap-1.5 ${
                      currentPage === 'services' || currentPage === 'additional-services' || isServicesMenuOpen
                        ? 'text-emerald-950 font-semibold'
                        : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                    }`}
                  >
                    {(currentPage === 'services' || currentPage === 'additional-services') && <span className="w-1.5 h-1.5 rounded-full bg-emerald-900 shrink-0" />}
                    {link.label}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isServicesMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                );
              }

              return (
                <button
                  key={link.page}
                  onClick={() => handleNavClick(link.page)}
                  className={`text-xs font-medium px-3 py-1.5 rounded transition-all duration-200 inline-flex items-center gap-1.5 ${
                    currentPage === link.page
                      ? 'text-emerald-950 font-semibold'
                      : 'text-stone-600 hover:text-stone-950 hover:bg-stone-50'
                  }`}
                >
                  {currentPage === link.page && <span className="w-1.5 h-1.5 rounded-full bg-emerald-900 shrink-0" />}
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Right Action Trigger (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            <a
              href="tel:0489220855"
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-800 hover:text-emerald-800 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              0489 220 855
            </a>
            <button
              onClick={onQuoteClick}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs py-2 px-4 rounded transition-all duration-300 shadow-sm"
            >
              Get a Free Quote
            </button>
          </div>

          {/* Hamburger Menu (Mobile/Tablet) */}
          <div className="flex lg:hidden items-center gap-3">
            <a
              href="tel:0489220855"
              className="flex items-center justify-center w-8 h-8 rounded-full bg-stone-100 text-stone-800"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-stone-800 hover:text-emerald-800 p-1"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* DESKTOP HOME DROPDOWN PANEL */}
      {isHomeMenuOpen && (
        <div 
          ref={homeMenuRef}
          className="absolute left-1/2 -translate-x-1/2 top-full w-full max-w-7xl px-4 sm:px-6 lg:px-8 z-50 mt-1"
        >
          <div className="bg-[#fdfcfb] rounded-2xl border border-stone-200/90 shadow-2xl p-8 grid grid-cols-12 gap-8 animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Left Column: Summary of company / CTA */}
            <div className="col-span-4 border-r border-stone-200/40 pr-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="text-sm font-bold tracking-tight text-stone-900">
                    Flatpack <span className="text-emerald-800">Doctors</span>
                  </span>
                  <PackageOpen className="w-4 h-4 text-emerald-700" />
                </div>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  Professional flatpack furniture assembly done properly. Victoria's trusted specialists for wardrobes, modular layouts, and complex builds with dynamic leveling and stud assessments.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-emerald-850 font-bold bg-emerald-50/50 px-3 py-2 rounded-xl border border-emerald-100/50">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Fully Insured Assembly Specialists</span>
                </div>
              </div>
              <div className="pt-4 border-t border-stone-100 mt-4">
                <button
                  onClick={() => {
                    setIsHomeMenuOpen(false);
                    onQuoteClick();
                  }}
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs py-2.5 px-4 rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                >
                  Book Setup Consultation
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Home navigation sections (8 / 12 width) */}
            <div className="col-span-8 pl-4">
              <h3 className="text-[11px] font-mono uppercase tracking-widest font-bold text-emerald-800 mb-4 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> Navigation & Features
              </h3>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                
                {/* 1. Search */}
                <button
                  onClick={() => handleNavClick('home')}
                  aria-current={isHomeSectionActive('') ? 'page' : undefined}
                  className={`flex items-start gap-3 p-2 -mx-2 rounded-lg text-left group/item transition-colors ${isHomeSectionActive('') ? 'bg-emerald-50 ring-1 ring-emerald-100' : 'hover:bg-emerald-50/40'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${isHomeSectionActive('') ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 group-hover/item:bg-emerald-800 group-hover/item:text-white'}`}>
                    <Search className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold transition-colors ${isHomeSectionActive('') ? 'text-emerald-900' : 'text-stone-800 group-hover/item:text-emerald-800'}`}>
                      Search Flatpacks
                    </h4>
                    <p className="text-[10px] text-stone-400 leading-normal mt-0.5">
                      Instantly search for items or estimate pricing for custom builds.
                    </p>
                  </div>
                </button>

                {/* 2. Popular Builds */}
                <button
                  onClick={() => handleHomeSectionClick('popular-builds')}
                  aria-current={isHomeSectionActive('popular-builds') ? 'location' : undefined}
                  className={`flex items-start gap-3 p-2 -mx-2 rounded-lg text-left group/item transition-colors ${isHomeSectionActive('popular-builds') ? 'bg-emerald-50 ring-1 ring-emerald-100' : 'hover:bg-emerald-50/40'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${isHomeSectionActive('popular-builds') ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 group-hover/item:bg-emerald-800 group-hover/item:text-white'}`}>
                    <Bed className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold transition-colors ${isHomeSectionActive('popular-builds') ? 'text-emerald-900' : 'text-stone-800 group-hover/item:text-emerald-800'}`}>
                      Popular Builds
                    </h4>
                    <p className="text-[10px] text-stone-400 leading-normal mt-0.5">
                      Browse pricing and categories for common IKEA and modular furniture.
                    </p>
                  </div>
                </button>

                {/* 3. Our Quality Standards */}
                <button
                  onClick={() => handleHomeSectionClick('quality-standards')}
                  aria-current={isHomeSectionActive('quality-standards') ? 'location' : undefined}
                  className={`flex items-start gap-3 p-2 -mx-2 rounded-lg text-left group/item transition-colors ${isHomeSectionActive('quality-standards') ? 'bg-emerald-50 ring-1 ring-emerald-100' : 'hover:bg-emerald-50/40'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${isHomeSectionActive('quality-standards') ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 group-hover/item:bg-emerald-800 group-hover/item:text-white'}`}>
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold transition-colors ${isHomeSectionActive('quality-standards') ? 'text-emerald-900' : 'text-stone-800 group-hover/item:text-emerald-800'}`}>
                      Our Quality Standards
                    </h4>
                    <p className="text-[10px] text-stone-400 leading-normal mt-0.5">
                      Zero-damage floor protection, active leveling, and laser alignment.
                    </p>
                  </div>
                </button>

                {/* 4. Five Step Process */}
                <button
                  onClick={() => handleHomeSectionClick('five-step-process')}
                  aria-current={isHomeSectionActive('five-step-process') ? 'location' : undefined}
                  className={`flex items-start gap-3 p-2 -mx-2 rounded-lg text-left group/item transition-colors ${isHomeSectionActive('five-step-process') ? 'bg-emerald-50 ring-1 ring-emerald-100' : 'hover:bg-emerald-50/40'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${isHomeSectionActive('five-step-process') ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 group-hover/item:bg-emerald-800 group-hover/item:text-white'}`}>
                    <Shuffle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold transition-colors ${isHomeSectionActive('five-step-process') ? 'text-emerald-900' : 'text-stone-800 group-hover/item:text-emerald-800'}`}>
                      Five Step Process
                    </h4>
                    <p className="text-[10px] text-stone-400 leading-normal mt-0.5">
                      How we go from booking to a polished handover seamlessly.
                    </p>
                  </div>
                </button>

                {/* 5. Assembly Support */}
                <button
                  onClick={() => handleHomeSectionClick('integrated-support')}
                  aria-current={isHomeSectionActive('integrated-support') ? 'location' : undefined}
                  className={`flex items-start gap-3 p-2 -mx-2 rounded-lg text-left group/item transition-colors ${isHomeSectionActive('integrated-support') ? 'bg-emerald-50 ring-1 ring-emerald-100' : 'hover:bg-emerald-50/40'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${isHomeSectionActive('integrated-support') ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 group-hover/item:bg-emerald-800 group-hover/item:text-white'}`}>
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold transition-colors ${isHomeSectionActive('integrated-support') ? 'text-emerald-900' : 'text-stone-800 group-hover/item:text-emerald-800'}`}>
                      Integrated Support
                    </h4>
                    <p className="text-[10px] text-stone-400 leading-normal mt-0.5">
                      Anti-tip safety anchoring, skirting removals, and cardboard recycling.
                    </p>
                  </div>
                </button>

                {/* 6. Reviews & Feedback */}
                <button
                  onClick={() => handleHomeSectionClick('reviews')}
                  aria-current={isHomeSectionActive('reviews') ? 'location' : undefined}
                  className={`flex items-start gap-3 p-2 -mx-2 rounded-lg text-left group/item transition-colors ${isHomeSectionActive('reviews') ? 'bg-emerald-50 ring-1 ring-emerald-100' : 'hover:bg-emerald-50/40'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${isHomeSectionActive('reviews') ? 'bg-emerald-800 text-white' : 'bg-stone-100 text-stone-600 group-hover/item:bg-emerald-800 group-hover/item:text-white'}`}>
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className={`text-xs font-bold transition-colors ${isHomeSectionActive('reviews') ? 'text-emerald-900' : 'text-stone-800 group-hover/item:text-emerald-800'}`}>
                      Reviews & Feedback
                    </h4>
                    <p className="text-[10px] text-stone-400 leading-normal mt-0.5">
                      See real ratings and project stories from homeowners across Victoria.
                    </p>
                  </div>
                </button>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* DESKTOP MEGA MENU DROPDOWN PANEL */}
      {isServicesMenuOpen && (
        <div 
          ref={menuRef}
          className="absolute left-1/2 -translate-x-1/2 top-full w-full max-w-7xl px-4 sm:px-6 lg:px-8 z-50 mt-1"
        >
          <div className="bg-[#fdfcfb] rounded-2xl border border-stone-200/90 shadow-2xl p-8 grid grid-cols-12 gap-8">
            
            {/* Column 1: General Services (7 / 12 width) */}
            <div className="col-span-7 border-r border-stone-200/40 pr-8">
              <h3 className="text-[11px] font-mono uppercase tracking-widest font-bold text-emerald-800 mb-4 flex items-center gap-1.5">
                <Wrench className="w-3.5 h-3.5" /> General Services
              </h3>
              
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {SERVICES_DATA.map((service) => {
                  const isActive = currentPage === 'services' && selectedServiceId === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleServiceItemSelect(service.id, false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-start gap-3 p-2 -mx-2 rounded-lg text-left group/item transition-colors ${
                        isActive ? 'bg-emerald-50 ring-1 ring-emerald-100' : 'hover:bg-emerald-50/40'
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                        isActive
                          ? 'bg-emerald-800 text-white'
                          : 'bg-stone-100 text-stone-600 group-hover/item:bg-emerald-800 group-hover/item:text-white'
                      }`}>
                        {getServiceIcon(service.iconName, 'w-4 h-4')}
                      </div>
                      <div>
                        <h4 className={`text-xs font-bold transition-colors ${
                          isActive ? 'text-emerald-900' : 'text-stone-800 group-hover/item:text-emerald-800'
                        }`}>
                          {service.title}
                        </h4>
                        <p className="text-[10px] text-stone-400 line-clamp-1 mt-0.5">
                          {service.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 border-t border-stone-100 pt-3">
                <button
                  onClick={() => {
                    setSelectedServiceId(null);
                    handleNavClick('services');
                  }}
                  className="text-left text-xs font-extrabold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1.5 transition-colors"
                >
                  View All General Services
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Column 2: Additional Services (5 / 12 width) */}
            <div className="col-span-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-mono uppercase tracking-widest font-bold text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Additional Services
                </h3>
                <span className="text-[9px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200/40 rounded-full shadow-2xs">
                  Cost Extra
                </span>
              </div>

              <div className="grid grid-cols-1 gap-y-1">
                {ADDITIONAL_SERVICES_DATA.slice(0, 7).map((service) => {
                  const isActive = currentPage === 'additional-services' && selectedServiceId === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleServiceItemSelect(service.id, true)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-start gap-3 p-1.5 -mx-1.5 rounded-lg text-left group/item transition-colors ${
                        isActive ? 'bg-emerald-50 ring-1 ring-emerald-100' : 'hover:bg-emerald-50/40'
                      }`}
                    >
                      <div className={`w-6.5 h-6.5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                        isActive
                          ? 'bg-emerald-800 text-white'
                          : 'bg-stone-100 text-stone-500 group-hover/item:bg-emerald-800 group-hover/item:text-white'
                      }`}>
                        {getServiceIcon(service.iconName, 'w-3.5 h-3.5')}
                      </div>
                      <div>
                        <h4 className={`text-xs font-semibold transition-colors ${
                          isActive ? 'text-emerald-900' : 'text-stone-800 group-hover/item:text-emerald-800'
                        }`}>
                          {service.title}
                        </h4>
                        <p className="text-[10px] text-stone-400 line-clamp-1">
                          {service.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
                
                <button
                  onClick={() => {
                    setSelectedServiceId(null);
                    handleNavClick('additional-services');
                  }}
                  className="mt-2 text-left p-1.5 -mx-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-1.5 transition-colors"
                >
                  View all preparation services
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Bottom Panel Banner */}
            <div className="col-span-12 border-t border-stone-200/60 pt-4 mt-2 flex items-center justify-between text-xs text-stone-500 font-medium">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Fully Insured Assembly Specialists serving Victoria. IKEA, Koala & Custom Modular builds.</span>
              </div>
              <button
                onClick={() => {
                  setIsServicesMenuOpen(false);
                  onQuoteClick();
                }}
                className="bg-stone-900 hover:bg-black text-white font-bold text-xs py-2 px-4 rounded-lg shadow-sm transition-all flex items-center gap-1"
              >
                Book Build Setup
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}
      </nav>

      {/* MOBILE DRAWER PORTAL (BACKDROP & DRAWER PANEL) */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden ${
          isMobileMenuOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        {/* Backdrop overlay */}
        <div
          className={`absolute inset-0 bg-stone-900/40 transition-all duration-500 ease-out ${
            isMobileMenuOpen ? 'opacity-100 backdrop-blur-xs' : 'opacity-0 backdrop-blur-none'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute right-0 top-0 bottom-0 h-full w-[290px] sm:w-[330px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out border-l border-stone-200/50 ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Drawer Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-bold tracking-tight text-stone-900">
                Flatpack <span className="text-emerald-800">Doctors</span>
              </span>
              <PackageOpen className="w-3.5 h-3.5 text-emerald-700" />
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-stone-500 hover:text-stone-800 p-1 rounded-full hover:bg-stone-50 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
            <div className="flex flex-col space-y-1">
              {/* Home Accordion */}
              <div>
                <button
                  onClick={() => setIsMobileHomeExpanded(!isMobileHomeExpanded)}
                  className={`w-full text-sm font-bold py-3.5 px-4 rounded-xl text-left transition-all flex items-center justify-between ${
                    currentPage === 'home'
                      ? 'bg-emerald-50 text-emerald-950'
                      : isMobileHomeExpanded
                      ? 'bg-stone-50/80 text-stone-900' 
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <span>Home</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isMobileHomeExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isMobileHomeExpanded && (
                  <div className="pl-4 pr-1 py-1 space-y-0.5 bg-stone-50/50 rounded-xl border border-stone-200/40 mt-1 mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <button
                      onClick={() => handleNavClick('home')}
                      aria-current={isHomeSectionActive('') ? 'page' : undefined}
                      className={mobileHomeSectionClass('')}
                    >
                      <span className="truncate flex items-center gap-2">
                        {isHomeSectionActive('') && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" />}
                        Search
                      </span>
                      <ChevronRight className="w-3 h-3 text-stone-300" />
                    </button>

                    <button
                      onClick={() => handleHomeSectionClick('popular-builds')}
                      aria-current={isHomeSectionActive('popular-builds') ? 'location' : undefined}
                      className={mobileHomeSectionClass('popular-builds')}
                    >
                      <span className="truncate flex items-center gap-2">
                        {isHomeSectionActive('popular-builds') && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" />}
                        Popular Builds
                      </span>
                      <ChevronRight className="w-3 h-3 text-stone-300" />
                    </button>

                    <button
                      onClick={() => handleHomeSectionClick('quality-standards')}
                      aria-current={isHomeSectionActive('quality-standards') ? 'location' : undefined}
                      className={mobileHomeSectionClass('quality-standards')}
                    >
                      <span className="truncate flex items-center gap-2">
                        {isHomeSectionActive('quality-standards') && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" />}
                        Our Standards
                      </span>
                      <ChevronRight className="w-3 h-3 text-stone-300" />
                    </button>

                    <button
                      onClick={() => handleHomeSectionClick('five-step-process')}
                      aria-current={isHomeSectionActive('five-step-process') ? 'location' : undefined}
                      className={mobileHomeSectionClass('five-step-process')}
                    >
                      <span className="truncate flex items-center gap-2">
                        {isHomeSectionActive('five-step-process') && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" />}
                        Five Step Process
                      </span>
                      <ChevronRight className="w-3 h-3 text-stone-300" />
                    </button>

                    <button
                      onClick={() => handleHomeSectionClick('integrated-support')}
                      aria-current={isHomeSectionActive('integrated-support') ? 'location' : undefined}
                      className={mobileHomeSectionClass('integrated-support')}
                    >
                      <span className="truncate flex items-center gap-2">
                        {isHomeSectionActive('integrated-support') && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" />}
                        Assembly Support
                      </span>
                      <ChevronRight className="w-3 h-3 text-stone-300" />
                    </button>

                    <button
                      onClick={() => handleHomeSectionClick('reviews')}
                      aria-current={isHomeSectionActive('reviews') ? 'location' : undefined}
                      className={mobileHomeSectionClass('reviews')}
                    >
                      <span className="truncate flex items-center gap-2">
                        {isHomeSectionActive('reviews') && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" />}
                        Reviews
                      </span>
                      <ChevronRight className="w-3 h-3 text-stone-300" />
                    </button>
                  </div>
                )}
              </div>

              {/* General Services Accordion */}
              <div>
                <button
                  onClick={() => setIsMobileGeneralExpanded(!isMobileGeneralExpanded)}
                  className={`w-full text-sm font-bold py-3.5 px-4 rounded-xl text-left transition-all flex items-center justify-between ${
                    currentPage === 'services'
                      ? 'bg-emerald-50 text-emerald-950'
                      : isMobileGeneralExpanded
                      ? 'bg-stone-50/80 text-stone-900' 
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <span>General Services</span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isMobileGeneralExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isMobileGeneralExpanded && (
                  <div className="pl-4 pr-1 py-1 space-y-0.5 bg-stone-50/50 rounded-xl border border-stone-200/40 mt-1 mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <button
                      onClick={() => {
                        setSelectedServiceId(null);
                        setCurrentPage('services');
                        window.history.replaceState({}, '', '/services');
                        setIsMobileMenuOpen(false);
                        window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
                      }}
                      aria-current={currentPage === 'services' && !selectedServiceId ? 'page' : undefined}
                      className={`w-full text-left py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-between transition-colors ${
                        currentPage === 'services' && !selectedServiceId
                          ? 'bg-emerald-50 text-emerald-950'
                          : 'text-emerald-800 hover:bg-emerald-50/50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {currentPage === 'services' && !selectedServiceId && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" />}
                        View All General Services
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {SERVICES_DATA.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceItemSelect(service.id, false)}
                        aria-current={currentPage === 'services' && selectedServiceId === service.id ? 'page' : undefined}
                        className={`w-full text-left py-2.5 px-3 rounded-lg font-semibold text-xs flex items-center justify-between transition-colors ${
                          currentPage === 'services' && selectedServiceId === service.id
                            ? 'bg-emerald-50 text-emerald-950'
                            : 'text-stone-750 hover:bg-stone-50 hover:text-emerald-800'
                        }`}
                      >
                        <span className="truncate flex items-center gap-2">
                          {currentPage === 'services' && selectedServiceId === service.id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" />}
                          {service.title}
                        </span>
                        <ChevronRight className="w-3 h-3 text-stone-300" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Additional Services Accordion */}
              <div>
                <button
                  onClick={() => setIsMobileAdditionalExpanded(!isMobileAdditionalExpanded)}
                  className={`w-full text-sm font-bold py-3.5 px-4 rounded-xl text-left transition-all flex items-center justify-between ${
                    currentPage === 'additional-services'
                      ? 'bg-emerald-50 text-emerald-950'
                      : isMobileAdditionalExpanded
                      ? 'bg-stone-50/80 text-stone-900' 
                      : 'text-stone-700 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    Additional Services
                    <span className="text-[9px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold uppercase border border-amber-200/50 shrink-0">Cost Extra</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isMobileAdditionalExpanded ? 'rotate-180' : ''}`} />
                </button>
                {isMobileAdditionalExpanded && (
                  <div className="pl-4 pr-1 py-1 space-y-0.5 bg-stone-50/50 rounded-xl border border-stone-200/40 mt-1 mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <button
                      onClick={() => {
                        setSelectedServiceId(null);
                        setCurrentPage('additional-services');
                        window.history.replaceState({}, '', '/additional-services');
                        setIsMobileMenuOpen(false);
                        window.setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
                      }}
                      aria-current={currentPage === 'additional-services' && !selectedServiceId ? 'page' : undefined}
                      className={`w-full text-left py-2.5 px-3 rounded-lg font-bold text-xs flex items-center justify-between transition-colors ${
                        currentPage === 'additional-services' && !selectedServiceId
                          ? 'bg-emerald-50 text-emerald-950'
                          : 'text-emerald-800 hover:bg-emerald-50/50'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {currentPage === 'additional-services' && !selectedServiceId && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" />}
                        All Prep & Additional Services
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    {ADDITIONAL_SERVICES_DATA.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceItemSelect(service.id, true)}
                        aria-current={currentPage === 'additional-services' && selectedServiceId === service.id ? 'page' : undefined}
                        className={`w-full text-left py-2.5 px-3 rounded-lg font-semibold text-xs flex items-center justify-between transition-colors ${
                          currentPage === 'additional-services' && selectedServiceId === service.id
                            ? 'bg-emerald-50 text-emerald-950'
                            : 'text-stone-750 hover:bg-stone-50 hover:text-emerald-800'
                        }`}
                      >
                        <span className="truncate flex items-center gap-2">
                          {currentPage === 'additional-services' && selectedServiceId === service.id && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800 shrink-0" />}
                          {service.title}
                        </span>
                        <ChevronRight className="w-3 h-3 text-stone-300" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Gallery */}
              <button
                onClick={() => handleNavClick('gallery')}
                className={`text-sm font-bold py-3.5 px-4 rounded-xl text-left transition-all flex items-center justify-between ${
                  currentPage === 'gallery'
                    ? 'bg-emerald-50 text-emerald-950'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <span>Gallery</span>
                {currentPage === 'gallery' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800" />}
              </button>

              {/* About */}
              <button
                onClick={() => handleNavClick('about')}
                className={`text-sm font-bold py-3.5 px-4 rounded-xl text-left transition-all flex items-center justify-between ${
                  currentPage === 'about'
                    ? 'bg-emerald-50 text-emerald-950'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <span>About</span>
                {currentPage === 'about' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800" />}
              </button>

              {/* Contact */}
              <button
                onClick={() => handleNavClick('contact')}
                className={`text-sm font-bold py-3.5 px-4 rounded-xl text-left transition-all flex items-center justify-between ${
                  currentPage === 'contact'
                    ? 'bg-emerald-50 text-emerald-950'
                    : 'text-stone-700 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <span>Contact</span>
                {currentPage === 'contact' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-800" />}
              </button>
            </div>
          </div>

          {/* Drawer Footer (Actions) */}
          <div className="p-4 border-t border-stone-100 space-y-2.5 shrink-0 bg-[#faf8f5]/60">
            <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono px-1">
              <span>Victoria-wide team</span>
              <span className="text-emerald-800 font-bold">Fully Insured</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
