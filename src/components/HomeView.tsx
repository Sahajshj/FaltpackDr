import { useState } from 'react';
import { 
  Wrench, Layers, Layout, Bed, FolderKanban, Tv, Laptop, Sun, 
  ShieldAlert, RefreshCw, Ruler, Move, Check, Sparkles, Hammer, 
  Trash2, Activity, MoveUpRight, ShieldCheck, Shuffle, CheckCircle2, 
  MessageSquare, Phone, ArrowRight, Star, MapPin, ExternalLink,
  Search, X, ChevronRight, Award, Clock, Users, Link, FileText
} from 'lucide-react';
import { Page, ServiceItem, AdditionalService } from '../types';
import { SERVICES_DATA, REVIEWS_PLACEHOLDERS, POPULAR_PROJECTS_DATA, ADDITIONAL_SERVICES_DATA } from '../data';
import Scrollytelling from './Scrollytelling';

interface HomeViewProps {
  setCurrentPage: (page: Page) => void;
  onQuoteClick: (serviceName?: string) => void;
  setSelectedServiceId: (id: string | null) => void;
}

export default function HomeView({ setCurrentPage, onQuoteClick, setSelectedServiceId }: HomeViewProps) {

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedAdditionalService, setSelectedAdditionalService] = useState<AdditionalService | null>(null);

  // Resolve Lucide icons dynamically for our Service cards
  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Wrench': return <Wrench className="w-5 h-5 text-emerald-800" />;
      case 'Layers': return <Layers className="w-5 h-5 text-emerald-800" />;
      case 'Layout': return <Layout className="w-5 h-5 text-emerald-800" />;
      case 'Bed': return <Bed className="w-5 h-5 text-emerald-800" />;
      case 'FolderKanban': return <FolderKanban className="w-5 h-5 text-emerald-800" />;
      case 'Tv': return <Tv className="w-5 h-5 text-emerald-800" />;
      case 'Laptop': return <Laptop className="w-5 h-5 text-emerald-800" />;
      case 'Sun': return <Sun className="w-5 h-5 text-emerald-800" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-emerald-800" />;
      case 'RefreshCw': return <RefreshCw className="w-5 h-5 text-emerald-800" />;
      case 'Ruler': return <Ruler className="w-5 h-5 text-emerald-800" />;
      case 'Move': return <Move className="w-5 h-5 text-emerald-800" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-emerald-800" />;
      case 'Hammer': return <Hammer className="w-5 h-5 text-emerald-800" />;
      case 'Trash2': return <Trash2 className="w-5 h-5 text-emerald-800" />;
      case 'Activity': return <Activity className="w-5 h-5 text-emerald-800" />;
      case 'MoveUpRight': return <MoveUpRight className="w-5 h-5 text-emerald-800" />;
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-800" />;
      case 'Shuffle': return <Shuffle className="w-5 h-5 text-emerald-800" />;
      default: return <Wrench className="w-5 h-5 text-emerald-800" />;
    }
  };

  const handleServiceCardClick = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setCurrentPage('services');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Advanced Search filtering with strict matching and smart sorting
  const getSearchResults = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed) return [];
    const query = trimmed.toLowerCase();
    
    // Combine both datasets first so we can grade them uniformly
    const allServices = [
      ...SERVICES_DATA.map(s => ({ ...s, type: 'general' as const })),
      ...ADDITIONAL_SERVICES_DATA.map(s => ({ ...s, type: 'additional' as const }))
    ];

    // Compute scores for each service item
    const scored = allServices.map(item => {
      const title = item.title.toLowerCase();
      const words = title.split(/[\s\-]+/); // split by whitespace or hyphens
      let score = -1;

      // 1. Title starts with query (Highest priority)
      if (title.startsWith(query)) {
        score = 10;
      }
      // 2. Query matches 2nd or 3rd word (starts with query)
      else if (words.length > 1 && words[1].startsWith(query)) {
        score = 8;
      }
      else if (words.length > 2 && words[2].startsWith(query)) {
        score = 8;
      }
      // 3. Query starts any other word in the title
      else if (words.some(word => word.startsWith(query))) {
        score = 6;
      }
      // 4. Query is a substring in the title itself (e.g. interior part of word)
      else if (title.includes(query)) {
        score = 4;
      }
      // 5. Query is a substring in the examples list
      else if (item.examples && item.examples.some(ex => ex.toLowerCase().includes(query))) {
        score = 2;
      }

      return { item, score };
    });

    // Only keep items that had a positive score (actual matching string in title/examples)
    const filtered = scored.filter(x => x.score > 0);

    // Sort by score descending. For items with the same score, preserve original order or sort alphabetically
    filtered.sort((a, b) => b.score - a.score);

    return filtered.map(x => x.item);
  };

  const searchResults = getSearchResults();

  return (
    <div className="pt-16">
      
      {/* SECTION 1 — HERO (CENTERED & MODERN) */}
      <section id="hero-section" className="relative pt-10 pb-14 sm:pt-14 sm:pb-20 lg:pt-16 lg:pb-24 overflow-hidden border-b border-stone-200/50">
        
        {/* Base Warm Off-White Background */}
        <div className="absolute inset-0 bg-[#FAF9F6] -z-30 pointer-events-none" />
        
        {/* Faint fine-line grid at 4-5% opacity (not affecting readability) */}
        <div className="absolute inset-0 opacity-[0.045] pointer-events-none -z-10" 
             style={{ 
               backgroundImage: `
                 linear-gradient(to right, rgba(28,25,23,0.08) 1px, transparent 1px),
                 linear-gradient(to bottom, rgba(28,25,23,0.08) 1px, transparent 1px)
               `,
               backgroundSize: '36px 36px'
             }} 
        />
        
        {/* Soft, heavily blurred gradient corner glows */}
        {/* Top-left: mint/soft green glow and pale green */}
        <div className="absolute top-0 left-0 w-[70%] h-[70%] bg-[radial-gradient(ellipse_at_top_left,#DDF6E8_0%,#BFE8D1_35%,transparent_70%)] opacity-35 pointer-events-none -z-20 blur-[130px]" />
        {/* Bottom-right: warm sand glow and light beige */}
        <div className="absolute bottom-0 right-0 w-[75%] h-[75%] bg-[radial-gradient(ellipse_at_bottom_right,#F3E6CF_0%,#F7F1E8_40%,transparent_70%)] opacity-55 pointer-events-none -z-20 blur-[140px]" />

        {/* DECORATIVE TECHNICAL ASSEMBLY VISUALS (SVG ILLUSTRATIONS) */}
        
        {/* 1. Top-Left: Drawer slides technical blueprint drawing (Hidden on mobile) */}
        <div className="absolute left-4 lg:left-10 top-12 w-40 lg:w-56 h-auto opacity-75 hidden md:block select-none pointer-events-none -z-10">
          <svg viewBox="0 0 160 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-stone-400 stroke-current">
            {/* Outer track */}
            <path d="M10 20 L130 50 L130 65 L10 35 Z" strokeWidth="1" strokeLinejoin="round" />
            <path d="M10 35 L130 65 L130 68 L10 38 Z" strokeWidth="0.75" />
            {/* Inner slide track */}
            <path d="M30 30 L150 60 L150 70 L30 40 Z" strokeWidth="1" strokeLinejoin="round" strokeDasharray="3 2" />
            {/* Screw holes */}
            <circle cx="25" cy="27" r="2.5" strokeWidth="1" />
            <circle cx="65" cy="37" r="2.5" strokeWidth="1" />
            <circle cx="105" cy="47" r="2.5" strokeWidth="1" />
            {/* Measurement / drafting lines */}
            <line x1="10" y1="15" x2="130" y2="45" strokeWidth="0.5" strokeDasharray="4 4" />
            <line x1="10" y1="12" x2="10" y2="18" strokeWidth="0.75" />
            <line x1="130" y1="42" x2="130" y2="48" strokeWidth="0.75" />
            <text x="55" y="24" className="fill-stone-400 font-mono text-[7px]" transform="rotate(13, 55, 24)">500mm</text>
            <path d="M120 53 C120 51, 125 50, 128 52 C130 53, 131 56, 129 58 C127 59, 122 58, 120 53 Z" strokeWidth="0.75" />
          </svg>
        </div>

        {/* 2. Top-Right: Spirit level (Floating, angled) */}
        {/* On mobile: simplified, smaller, tucked into the top-right corner */}
        <div className="absolute right-[-25px] sm:right-[-10px] md:right-[-20px] lg:right-[-40px] top-6 sm:top-10 md:top-14 w-28 sm:w-36 md:w-48 lg:w-64 h-auto opacity-[0.85] select-none pointer-events-none -z-10 -rotate-12 transform origin-top-right">
          <svg viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto filter drop-shadow-[0_4px_12px_rgba(28,25,23,0.06)]">
            <defs>
              <linearGradient id="vial-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#86EFAC" />
                <stop offset="50%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>
              <linearGradient id="metal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#374151" />
                <stop offset="30%" stopColor="#4B5563" />
                <stop offset="70%" stopColor="#1F2937" />
                <stop offset="100%" stopColor="#111827" />
              </linearGradient>
            </defs>
            {/* Level Body */}
            <rect x="5" y="8" width="190" height="34" rx="3" fill="url(#metal-grad)" stroke="#111827" strokeWidth="1.5" />
            <rect x="7" y="10" width="186" height="30" rx="1.5" fill="none" stroke="#6B7280" strokeWidth="0.75" />
            {/* Metal hand grip cutout */}
            <rect x="25" y="16" width="30" height="18" rx="9" fill="#111827" stroke="#4B5563" strokeWidth="0.75" />
            {/* Center Liquid vial */}
            <rect x="80" y="15" width="40" height="20" rx="2" fill="#111827" stroke="#4B5563" strokeWidth="1" />
            <rect x="85" y="19" width="30" height="12" rx="1" fill="url(#vial-grad)" />
            {/* Liquid vial markings */}
            <line x1="95" y1="19" x2="95" y2="31" stroke="#111827" strokeWidth="1" />
            <line x1="105" y1="19" x2="105" y2="31" stroke="#111827" strokeWidth="1" />
            {/* Level bubble */}
            <ellipse cx="100" cy="25" rx="3.5" ry="2.5" fill="#FFFFFF" fillOpacity="0.85" />
            
            {/* Right Liquid vial (45 degree) */}
            <g transform="translate(145, 15)">
              <rect x="0" y="0" width="22" height="20" rx="2" fill="#111827" stroke="#4B5563" strokeWidth="0.75" />
              <circle cx="11" cy="10" r="7" fill="url(#vial-grad)" />
              <line x1="6" y1="6" x2="16" y2="14" stroke="#111827" strokeWidth="1" />
              <circle cx="11" cy="10" r="2" fill="#FFFFFF" fillOpacity="0.85" />
            </g>

            {/* Left Liquid vial (Vertical) */}
            <g transform="translate(62, 16)">
              <rect x="0" y="0" width="12" height="18" rx="1" fill="url(#vial-grad)" />
              <ellipse cx="6" cy="9" rx="2" ry="1.5" fill="#FFFFFF" fillOpacity="0.85" />
              <line x1="0" y1="9" x2="12" y2="9" stroke="#111827" strokeWidth="0.75" />
            </g>
            
            {/* Ruler markings */}
            <line x1="10" y1="42" x2="190" y2="42" stroke="#4B5563" strokeWidth="1" />
            <line x1="20" y1="38" x2="20" y2="42" stroke="#4B5563" strokeWidth="1" />
            <line x1="40" y1="39" x2="40" y2="42" stroke="#4B5563" strokeWidth="1" />
            <line x1="60" y1="38" x2="60" y2="42" stroke="#4B5563" strokeWidth="1" />
            <line x1="80" y1="39" x2="80" y2="42" stroke="#4B5563" strokeWidth="1" />
            <line x1="100" y1="38" x2="100" y2="42" stroke="#4B5563" strokeWidth="1" />
            <line x1="120" y1="39" x2="120" y2="42" stroke="#4B5563" strokeWidth="1" />
            <line x1="140" y1="38" x2="140" y2="42" stroke="#4B5563" strokeWidth="1" />
            <line x1="160" y1="39" x2="160" y2="42" stroke="#4B5563" strokeWidth="1" />
            <line x1="180" y1="38" x2="180" y2="42" stroke="#4B5563" strokeWidth="1" />
          </svg>
        </div>

        {/* 3. Bottom-Left: Screwdriver (Angled, green/black grip) */}
        {/* On mobile: simplified, smaller, sitting cleanly at the bottom-left edge */}
        <div className="absolute left-[-20px] sm:left-[-10px] md:left-2 lg:left-8 bottom-4 sm:bottom-6 md:bottom-10 w-24 sm:w-36 md:w-48 lg:w-64 h-auto opacity-[0.88] select-none pointer-events-none -z-10 rotate-[22deg] md:rotate-12 transform origin-bottom-left">
          <svg viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto filter drop-shadow-[2px_6px_12px_rgba(28,25,23,0.08)]">
            <defs>
              <linearGradient id="handle-grad-black" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1C1917" />
                <stop offset="50%" stopColor="#292524" />
                <stop offset="100%" stopColor="#0C0A09" />
              </linearGradient>
              <linearGradient id="handle-grad-green" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="50%" stopColor="#047857" />
                <stop offset="100%" stopColor="#065F46" />
              </linearGradient>
              <linearGradient id="metal-shaft-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F1F5F9" />
                <stop offset="40%" stopColor="#CBD5E1" />
                <stop offset="75%" stopColor="#64748B" />
                <stop offset="100%" stopColor="#475569" />
              </linearGradient>
            </defs>
            {/* Metal Shaft */}
            <rect x="75" y="27" width="80" height="6" rx="1" fill="url(#metal-shaft-grad)" />
            {/* Screwdriver Tip */}
            <path d="M155 26 L168 28 L168 32 L155 34 Z" fill="#475569" />
            <rect x="168" y="28.5" width="4" height="3" fill="#0F172A" />
            
            {/* Screwdriver Handle */}
            <g transform="translate(10, 10)">
              <path d="M0 20 C0 8, 15 6, 25 8 C35 10, 45 6, 60 10 C65 11, 68 15, 68 20 C68 25, 65 29, 60 30 C45 34, 35 30, 25 32 C15 34, 0 32, 0 20 Z" fill="url(#handle-grad-black)" stroke="#0C0A09" strokeWidth="0.75" />
              {/* Green rubber panels */}
              <path d="M12 11 C15 11, 20 12, 22 20 C24 28, 15 29, 12 29 Z" fill="url(#handle-grad-green)" />
              <path d="M26 10 C30 10, 34 11, 35 20 C36 29, 30 30, 26 30 Z" fill="url(#handle-grad-green)" />
              <path d="M40 11 C43 11, 46 12, 47 20 C48 28, 43 29, 40 29 Z" fill="url(#handle-grad-green)" />
              {/* End cap */}
              <path d="M0 20 C0 14, 4 14, 5 20 C4 26, 0 26, 0 20 Z" fill="#1C1917" />
              {/* Collar */}
              <rect x="65" y="16" width="3" height="8" rx="1" fill="#475569" />
            </g>
          </svg>
        </div>

        {/* 4. Bottom-Right: Line-art outline of table frame (Hidden on mobile) */}
        <div className="absolute right-4 lg:right-12 bottom-6 lg:bottom-12 w-44 lg:w-64 h-auto opacity-70 hidden md:block select-none pointer-events-none -z-10">
          <svg viewBox="0 0 160 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto text-stone-400 stroke-current">
            {/* Table Top */}
            <path d="M10 40 L110 30 L150 70 L50 80 Z" strokeWidth="1.25" strokeLinejoin="round" />
            {/* Underframe */}
            <path d="M22 47 L108 38 L108 48 L22 57 Z" strokeWidth="1" />
            <path d="M108 38 L142 72 L142 80" strokeWidth="1" />
            {/* Table Legs */}
            <path d="M22 48 L22 130 L28 130 L28 48" strokeWidth="1" strokeLinejoin="round" />
            <path d="M142 72 L142 120 L136 120 L136 72" strokeWidth="1" strokeLinejoin="round" />
            <path d="M108 38 L108 100 L112 100 L112 38" strokeWidth="0.75" strokeDasharray="3 2" />
            <path d="M50 80 L50 135 L56 135 L56 80" strokeWidth="1.25" strokeLinejoin="round" />
            {/* Technical annotations */}
            <line x1="50" y1="138" x2="142" y2="123" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="50" y1="135" x2="50" y2="141" strokeWidth="0.5" />
            <line x1="142" y1="120" x2="142" y2="126" strokeWidth="0.5" />
            <text x="96" y="139" className="fill-stone-400 font-mono text-[6.5px]" transform="rotate(-6, 96, 139)">1200mm</text>
            <line x1="15" y1="40" x2="15" y2="130" strokeWidth="0.5" strokeDasharray="3 3" />
            <line x1="12" y1="40" x2="18" y2="40" strokeWidth="0.5" />
            <line x1="12" y1="130" x2="18" y2="130" strokeWidth="0.5" />
            <text x="-90" y="10" className="fill-stone-400 font-mono text-[6.5px]" transform="rotate(-90)">750mm</text>
          </svg>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* 1. MAIN HEADLINE */}
          <h1 className="text-4xl sm:text-5xl lg:text-[3.75rem] font-black tracking-tight text-stone-900 leading-[1.12] mb-5 sm:mb-6 mt-2">
            Furniture Assembly, <br className="hidden sm:block"/>
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 to-emerald-950 pb-1">
              Done Properly.
              {/* Very faint soft forest-green glow behind the lower part */}
              <span className="absolute -inset-x-12 top-1/2 bottom-0 bg-emerald-500/10 rounded-full blur-xl pointer-events-none -z-10" />
              <span className="absolute left-0 bottom-0.5 w-full h-[6px] bg-emerald-600/10 rounded-full"></span>
            </span>
          </h1>

          {/* 2. SERVICE / QUOTE LAUNCHER CONTAINER */}
          <div className="max-w-2xl mx-auto mb-6 z-30">
            <div className="relative">
              <div className={`flex items-center gap-3 bg-white rounded-xl border px-5 py-4 shadow-md transition-all duration-300 ${isSearchFocused ? 'border-emerald-800 ring-4 ring-emerald-800/10 shadow-[0_4px_24px_rgba(6,95,70,0.12)]' : 'border-stone-200 hover:border-emerald-800/50 hover:shadow-[0_4px_16px_rgba(6,95,70,0.06)]'}`}>
                <Search className="w-5.5 h-5.5 text-stone-400 shrink-0" />
                <input
                  type="text"
                  placeholder="What would you like assembled?"
                  className="w-full bg-transparent border-none outline-none text-stone-900 placeholder-stone-400 text-sm sm:text-base font-semibold"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-all"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                )}
              </div>

              {/* Suggested / Live Results */}
              {isSearchFocused && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden max-h-[380px] overflow-y-auto text-left z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {!searchQuery.trim() ? (
                    <div className="p-4 space-y-3">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold block">
                        Popular Searches
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: 'Wardrobe & PAX Installation', serviceId: 'wardrobe-pax' },
                          { label: 'Bed Assembly', serviceId: 'bed-assembly' },
                          { label: 'TV Units & Storage Cabinets', serviceId: 'tv-units' },
                          { label: 'Desk & Home Office Setup', serviceId: 'desk-office' },
                          { label: 'Wall Fixing & Anchoring', serviceId: 'wall-anchoring' }
                        ].map((item) => (
                          <button
                            key={item.label}
                            onMouseDown={() => {
                              setSelectedServiceId(item.serviceId);
                              setCurrentPage('services');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-stone-50 hover:bg-emerald-50 hover:text-emerald-900 hover:border-emerald-500/30 text-stone-700 px-3.5 py-2 rounded-xl transition-all duration-200 border border-stone-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.01)] hover:shadow-sm text-xs font-bold cursor-pointer hover:scale-[1.01] active:scale-[0.99] flex items-center gap-1.5"
                          >
                            <Search className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      <div className="px-3 py-1.5 text-[10px] uppercase font-mono tracking-wider text-stone-400 font-bold">
                        Matching Services ({searchResults.length})
                      </div>
                      {searchResults.length === 0 ? (
                        <div className="px-5 py-8 text-center space-y-4">
                          <p className="text-stone-600 text-sm max-w-md mx-auto leading-relaxed">
                            We couldn't find a direct match for "<span className="font-semibold text-stone-900">{searchQuery}</span>". 
                            Don't worry, our specialist crew handles almost all custom items! 
                            Explore our full list in the services sections to find the best option for your assembly.
                          </p>
                          <button
                            onMouseDown={() => handleNavClick('services')}
                            className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                          >
                            Browse All Services
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        searchResults.map((item) => (
                          <button
                            key={item.id}
                            onMouseDown={() => {
                              if (item.type === 'general') {
                                handleServiceCardClick(item.id);
                              } else {
                                setSelectedAdditionalService(item as AdditionalService);
                              }
                            }}
                            className="w-full text-left px-3.5 py-3 rounded-xl hover:bg-stone-50 transition-all flex items-start gap-3 border border-transparent hover:border-stone-100"
                          >
                            <div className="bg-emerald-50 text-emerald-800 p-2 rounded-lg shrink-0 mt-0.5">
                              {getServiceIcon(item.iconName)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-bold text-sm text-stone-950 truncate">{item.title}</span>
                                <span className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase font-mono tracking-wider shrink-0 ${
                                  item.type === 'general' 
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-100/50' 
                                    : 'bg-amber-50 text-amber-800 border border-amber-100/50'
                                }`}>
                                  {item.type === 'general' ? 'Assembly' : 'Additional Service'}
                                </span>
                              </div>
                              <p className="text-xs text-stone-500 line-clamp-1">{item.description}</p>
                            </div>
                            <ChevronRight className="w-4 h-4 text-stone-400 mt-2 shrink-0" />
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 4. SUPPORTING PARAGRAPH */}
          <p className="text-stone-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed mb-6 px-4 font-medium">
            Professional flat-pack furniture assembly, wardrobe installations, room preparation, wall anchoring, and after-sales support across Victoria.
          </p>

          {/* 5. TRUST POINTS (MOVED UPWARD FOR MOBILE ONLY) */}
          <div className="max-w-4xl mx-auto mt-8 mb-8 md:hidden">
            <div className="grid grid-cols-2 gap-3 text-center px-2 sm:px-4">
              <div className="bg-white/70 backdrop-blur-md border border-stone-200/50 rounded-xl p-3.5 flex flex-col items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-md hover:border-emerald-800/20">
                <ShieldCheck className="w-5.5 h-5.5 text-emerald-800 mb-2 shrink-0" />
                <span className="text-xs font-bold text-stone-900 leading-tight">Fully Insured</span>
                <span className="text-[10px] text-stone-500 font-mono mt-0.5 leading-none">Liability Protected</span>
              </div>
              <div className="bg-white/70 backdrop-blur-md border border-stone-200/50 rounded-xl p-3.5 flex flex-col items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-md hover:border-emerald-800/20">
                <MapPin className="w-5.5 h-5.5 text-emerald-800 mb-2 shrink-0" />
                <span className="text-xs font-bold text-stone-900 leading-tight">Victoria-Wide Service</span>
                <span className="text-[10px] text-stone-500 font-mono mt-0.5 leading-none">Serving All Suburbs</span>
              </div>
              <div className="bg-white/70 backdrop-blur-md border border-stone-200/50 rounded-xl p-3.5 flex flex-col items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-md hover:border-emerald-800/20">
                <Sparkles className="w-5.5 h-5.5 text-emerald-800 mb-2 shrink-0" />
                <span className="text-xs font-bold text-stone-900 leading-tight">Careful Workmanship</span>
                <span className="text-[10px] text-stone-500 font-mono mt-0.5 leading-none">Floor Protection Used</span>
              </div>
              <div className="bg-white/70 backdrop-blur-md border border-stone-200/50 rounded-xl p-3.5 flex flex-col items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-md hover:border-emerald-800/20">
                <Activity className="w-5.5 h-5.5 text-emerald-800 mb-2 shrink-0" />
                <span className="text-xs font-bold text-stone-900 leading-tight">Alignment Checked</span>
                <span className="text-[10px] text-stone-500 font-mono mt-0.5 leading-none">Stability & Door Tuning</span>
              </div>
              <div className="bg-white/70 backdrop-blur-md border border-stone-200/50 rounded-xl p-3.5 flex flex-col items-center justify-center transition-all duration-300 hover:bg-white hover:shadow-md hover:border-emerald-800/20 col-span-2">
                <CheckCircle2 className="w-5.5 h-5.5 text-emerald-800 mb-2 shrink-0" />
                <span className="text-xs font-bold text-stone-900 leading-tight">1-Year Assembly Support</span>
                <span className="text-[10px] text-stone-500 font-mono mt-0.5 leading-none">No-Cost Fix Guarantee</span>
              </div>
            </div>
          </div>

          {/* 7. CTA BUTTONS */}
          {/* Refined Actions buttons with exactly 10px corner radius */}
          <div className="hidden sm:flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md sm:max-w-3xl mx-auto px-4">
            <button
              onClick={() => onQuoteClick()}
              className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm py-3.5 px-7 rounded-[10px] transition-all duration-200 shadow-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              Get a Free Quote
              <ArrowRight className="w-4 h-4" />
            </button>
            <a
              href="tel:0489220855"
              className="w-full sm:w-auto bg-white hover:bg-stone-50 border border-stone-200 text-stone-900 font-bold text-sm py-3.5 px-7 rounded-[10px] transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <Phone className="w-4 h-4 text-emerald-800" />
              Call 0489 220 855
            </a>
            <a
              href="https://wa.me/61489220855"
              target="_blank"
              rel="noreferrer referrer"
              className="w-full sm:w-auto bg-white hover:bg-stone-50 border border-stone-200 text-stone-900 font-bold text-sm py-3.5 px-7 rounded-[10px] transition-all duration-200 flex items-center justify-center gap-2 shadow-xs active:scale-98"
            >
              <MessageSquare className="w-4 h-4 text-[#25D366]" />
              WhatsApp Us
            </a>
          </div>

        </div>
      </section>

      {/* SECTION 2 — TRUST BAR (Laptop/Desktop screens only) */}
      <section id="trust-bar-section" className="hidden md:block bg-white border-b border-stone-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-5 gap-x-4 items-center text-center divide-x divide-stone-200/50">
            <div className="flex flex-col items-center justify-center p-2">
              <ShieldCheck className="w-5 h-5 text-emerald-800 mb-1.5" />
              <span className="text-xs font-bold text-stone-900">Fully Insured</span>
              <span className="text-[10px] text-stone-400 font-mono">Liability Protected</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <MapPin className="w-5 h-5 text-emerald-800 mb-1.5" />
              <span className="text-xs font-bold text-stone-900">Victoria-Wide Service</span>
              <span className="text-[10px] text-stone-400 font-mono">Serving All Suburbs</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <Sparkles className="w-5 h-5 text-emerald-800 mb-1.5" />
              <span className="text-xs font-bold text-stone-900">Careful Workmanship</span>
              <span className="text-[10px] text-stone-400 font-mono">Floor Protection Used</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <Activity className="w-5 h-5 text-emerald-800 mb-1.5" />
              <span className="text-xs font-bold text-stone-900">Alignment Checked</span>
              <span className="text-[10px] text-stone-400 font-mono">Stability & Door Tuning</span>
            </div>
            <div className="flex flex-col items-center justify-center p-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-800 mb-1.5" />
              <span className="text-xs font-bold text-stone-900">1-Year Assembly Support</span>
              <span className="text-[10px] text-stone-400 font-mono">No-Cost Fix Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed overlay modal for selected Additional Service */}
      {selectedAdditionalService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-[#fcfbfa] max-w-md w-full rounded-2xl shadow-2xl border border-stone-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setSelectedAdditionalService(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="p-6 space-y-4 text-left">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-50 text-emerald-800 p-2.5 rounded-xl border border-emerald-100">
                  {getServiceIcon(selectedAdditionalService.iconName)}
                </div>
                <div>
                  <span className="text-[10px] font-bold font-mono tracking-wider uppercase text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    Additional Care Service
                  </span>
                  <h3 className="font-extrabold text-lg text-stone-900 mt-1">{selectedAdditionalService.title}</h3>
                </div>
              </div>
              
              <p className="text-stone-600 text-sm leading-relaxed">
                {selectedAdditionalService.description}
              </p>

              {selectedAdditionalService.examples && selectedAdditionalService.examples.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-stone-200/60">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-mono">Service Details</h4>
                  <ul className="space-y-2">
                    {selectedAdditionalService.examples.map((ex: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-stone-700 font-medium">
                        <span className="text-emerald-800 text-sm leading-none mt-0.5 shrink-0">•</span>
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t border-stone-200/60">
                <button
                  onClick={() => {
                    onQuoteClick();
                    setSelectedAdditionalService(null);
                  }}
                  className="flex-1 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm py-3 px-4 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  Book this Service
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedAdditionalService(null)}
                  className="px-5 py-3 border border-stone-300 rounded-xl hover:bg-stone-50 text-stone-700 font-bold text-sm transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3 — POPULAR TRENDING PROJECTS */}
      <section id="popular-projects-section" className="bg-stone-50 py-20 lg:py-24 border-b border-stone-200/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-emerald-800">Trending Projects</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900 mt-2">
              Popular Assembly Builds
            </h2>
            <p className="text-stone-500 text-sm mt-3">
              Explore 8 of our most requested flat-pack and custom modular installations across Victoria. Real-world precision, structured alignment, and absolute floor protection.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-6">
            {POPULAR_PROJECTS_DATA.map((project) => (
              <div
                key={project.id}
                className="group bg-white rounded-xl border border-stone-200/50 overflow-hidden hover:border-emerald-800 hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-stone-900/90 text-[8px] sm:text-[9px] font-mono uppercase tracking-wider text-white px-2 sm:px-2.5 py-0.5 sm:py-1 rounded shadow-xs">
                    {project.category}
                  </div>
                </div>

                <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-stone-900 group-hover:text-emerald-800 transition-colors mb-1 sm:mb-2 line-clamp-1 sm:line-clamp-none">
                      {project.title}
                    </h3>
                    <p className="text-stone-500 text-[10px] sm:text-[11px] leading-relaxed mb-3 sm:mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  
                  <div className="border-t border-stone-100 pt-2.5 sm:pt-3 mt-auto flex items-center justify-between text-[10px] sm:text-[11px] font-medium text-stone-600">
                    <span className="text-stone-400 font-mono text-[9px] sm:text-[10px] truncate max-w-[55%]">
                      {project.duration}
                    </span>
                    <button
                      onClick={onQuoteClick}
                      className="text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-0.5 sm:gap-1 transition-colors shrink-0"
                    >
                      <span>Book<span className="hidden xs:inline"> Setup</span></span>
                      <span className="text-xs group-hover:translate-x-0.5 transition-transform">→</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => handleNavClick('services')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              View all services
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 4 — INTERACTIVE SCROLL STORYTELLING */}
      <Scrollytelling onQuoteClick={onQuoteClick} />





      {/* SECTION 7 — HOW IT WORKS */}
      <section id="how-it-works-section" className="bg-white py-20 lg:py-24 border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-emerald-800">Stress-Free Booking</span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-2">
              Simple From Quote to Completion
            </h2>
            <p className="text-stone-500 text-xs mt-2">
              No complicated hourly calculations. We establish clear, transparent flat pricing before we arrive.
            </p>
          </div>

          <div className="md:hidden flex flex-col">

            {/* Step 1 */}
            <div className="flex gap-3 items-start">
              <div className="flex flex-col items-center flex-shrink-0 w-6">
                <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0">
                  1
                </div>
                <div className="w-px flex-1 bg-stone-200 mt-1" style={{ minHeight: '28px' }} />
              </div>
              <div className="pb-4">
                <h3 className="text-xs font-bold text-stone-900 leading-tight">Send Furniture Details</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                  Share product purchase links, dimensions, layout screenshots, and your suburb location.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3 items-start">
              <div className="flex flex-col items-center flex-shrink-0 w-6">
                <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0">
                  2
                </div>
                <div className="w-px flex-1 bg-stone-200 mt-1" style={{ minHeight: '28px' }} />
              </div>
              <div className="pb-4">
                <h3 className="text-xs font-bold text-stone-900 leading-tight">Receive a Quick Quote</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                  Prabh reviews the specific specs and returns a clear, transparent and fixed flat-rate quote.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3 items-start">
              <div className="flex flex-col items-center flex-shrink-0 w-6">
                <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0">
                  3
                </div>
                <div className="w-px flex-1 bg-stone-200 mt-1" style={{ minHeight: '28px' }} />
              </div>
              <div className="pb-4">
                <h3 className="text-xs font-bold text-stone-900 leading-tight">Choose Your Time</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                  Select a suitable date and time. We respect schedule commitments and arrive on the dot.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-3 items-start">
              <div className="flex flex-col items-center flex-shrink-0 w-6">
                <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0">
                  4
                </div>
                <div className="w-px flex-1 bg-stone-200 mt-1" style={{ minHeight: '28px' }} />
              </div>
              <div className="pb-4">
                <h3 className="text-xs font-bold text-stone-900 leading-tight">We Prepare & Assemble</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                  Our technicians lay protective covers, inspect fittings, and assemble each piece with exact care.
                </p>
              </div>
            </div>

            {/* Step 5 — no connector line after last step */}
            <div className="flex gap-3 items-start">
              <div className="flex flex-col items-center flex-shrink-0 w-6">
                <div className="w-6 h-6 rounded-full bg-emerald-800 text-white flex items-center justify-center font-mono text-[11px] font-bold flex-shrink-0">
                  5
                </div>
              </div>
              <div className="pb-2">
                <h3 className="text-xs font-bold text-stone-900 leading-tight">Final Quality Check</h3>
                <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                  We test levelling alignments, lock anti-tip studs, clean wood scraps, and handover the space.
                </p>
              </div>
            </div>

          </div>

          <div className="hidden md:grid grid-cols-5 gap-8 relative">
            
            {/* Step 1 */}
            <div className="space-y-3 relative text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-stone-950 text-white flex items-center justify-center font-mono text-sm font-bold mx-auto md:mx-0">
                1
              </div>
              <h3 className="text-xs font-bold text-stone-900">Send Furniture Details</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Share product purchase links, dimensions, layout screenshots, and your suburb location.
              </p>
            </div>

            {/* Step 2 */}
            <div className="space-y-3 relative text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-stone-950 text-white flex items-center justify-center font-mono text-sm font-bold mx-auto md:mx-0">
                2
              </div>
              <h3 className="text-xs font-bold text-stone-900">Receive a Quick Quote</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Prabh reviews the specific specs and returns a clear, transparent and fixed flat-rate quote.
              </p>
            </div>

            {/* Step 3 */}
            <div className="space-y-3 relative text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-stone-950 text-white flex items-center justify-center font-mono text-sm font-bold mx-auto md:mx-0">
                3
              </div>
              <h3 className="text-xs font-bold text-stone-900">Choose Your Time</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Select a suitable date and time. We respect schedule commitments and arrive on the dot.
              </p>
            </div>

            {/* Step 4 */}
            <div className="space-y-3 relative text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-stone-950 text-white flex items-center justify-center font-mono text-sm font-bold mx-auto md:mx-0">
                4
              </div>
              <h3 className="text-xs font-bold text-stone-900">We Prepare & Assemble</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Our technicians lay protective covers, inspect fittings, and assemble each piece with exact care.
              </p>
            </div>

            {/* Step 5 */}
            <div className="space-y-3 relative text-center md:text-left">
              <div className="w-10 h-10 rounded-full bg-stone-950 text-white flex items-center justify-center font-mono text-sm font-bold mx-auto md:mx-0">
                5
              </div>
              <h3 className="text-xs font-bold text-stone-900">Final Quality Check</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                We test levelling alignments, lock anti-tip studs, clean wood scraps, and handover the space.
              </p>
            </div>

          </div>

          <div className="mt-12 text-center">
            <button
              onClick={onQuoteClick}
              className="inline-flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-3.5 px-6 rounded-lg transition-all shadow-md"
            >
              Start Your Quote
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 8 — ONE-YEAR AFTER-SALES SUPPORT */}
      <section id="after-sales-section" className="bg-[#FAF8F5] py-20 lg:py-24 border-y border-stone-200/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800 mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-emerald-800 block">
            Workmanship Guarantee
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-stone-900">
            Assembly Support That Continues After We Leave.
          </h2>
          <p className="text-stone-600 text-sm max-w-2xl mx-auto leading-relaxed">
            We hold ourselves to strict structural standards. If any structural issue related to our assembly workmanship occurs within one year of completion, our technicians will come back to your location and correct it completely free of charge.
          </p>

          <div className="inline-block bg-white p-6 rounded-xl border border-stone-200 shadow-sm max-w-md w-full">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-400 block mb-1">Assurance Policy</span>
            <div className="text-2xl font-bold text-stone-900">1-Year Free After-Sales Service</div>
            <p className="text-[10px] text-stone-400 mt-2 font-mono">
              * Applies strictly to assembly workmanship. Terms and safety guidelines apply.
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={onQuoteClick}
              className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3.5 px-6 rounded-lg transition-colors shadow"
            >
              Book With Confidence
            </button>
          </div>
        </div>
      </section>



      {/* SECTION 10 — REVIEWS */}
      <section id="reviews-section" className="bg-stone-50 py-20 lg:py-24 border-b border-stone-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[11px] font-mono uppercase tracking-widest font-bold text-emerald-800 flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Verified Airtasker Reviews
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 tracking-tight mt-2">
              Trusted by Customers Across Victoria
            </h2>
            <p className="text-stone-500 text-xs mt-2">
              Real feedback from customers who booked furniture assembly through Airtasker.
            </p>
          </div>

          {/* Main Responsive Grid of Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {REVIEWS_PLACEHOLDERS.map((rev) => (
              <div 
                key={rev.id} 
                className="bg-white p-8 rounded-2xl border border-stone-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  {/* Stars and Source */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Review source: Airtasker
                    </span>
                  </div>
                  
                  {/* Comment */}
                  <p className="text-stone-700 text-sm italic leading-relaxed font-medium">
                    "{rev.comment}"
                  </p>
                </div>

                {/* Reviewer and Job Info */}
                <div className="border-t border-stone-100 pt-5 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">{rev.name}</h4>
                    {rev.job && (
                      <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5">
                        Job: {rev.job}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] uppercase font-mono tracking-wider text-emerald-800 bg-emerald-50/80 px-2.5 py-1 rounded-full font-bold border border-emerald-100">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> 100% Verified
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View Airtasker Profile Button */}
          <div className="mt-12 text-center">
            <a
              href="https://www.airtasker.com/users/3ba5a2e2bc4a-p-32291309/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs py-3 px-8 rounded-lg transition-colors shadow-sm"
              aria-label="View verified profile on Airtasker (opens in a new tab)"
            >
              <span>View Verified Airtasker Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION 11 — FINAL QUOTE CTA */}
      <section id="final-cta-section" className="bg-stone-900 text-white py-20 lg:py-24 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block">
            Get Started Today
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Ready to Get Your Furniture Assembled?
          </h2>
          <p className="text-stone-300 text-sm max-w-xl mx-auto leading-relaxed">
            Send us your item screenshots, product codes, purchase links, and preferred assembly timing. We will review the details and respond with a quick, transparent fixed quote.
          </p>

          <div className="hidden sm:flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <button
              onClick={onQuoteClick}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs py-4 px-8 rounded-lg transition-colors shadow-lg"
            >
              Get a Free Quote
            </button>
            <a
              href="tel:0489220855"
              className="bg-stone-800 hover:bg-stone-700 border border-stone-700 text-white font-bold text-xs py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              Call 0489 220 855
            </a>
            <a
              href="https://wa.me/61489220855"
              target="_blank"
              rel="noreferrer referrer"
              className="bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-xs py-4 px-8 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Us
            </a>
          </div>

          <p className="text-[10px] text-stone-500 font-mono">
            * Average quote response time under 1 hour during operational hours (7 AM – 5 PM).
          </p>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-950/30 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-stone-800/20 rounded-full blur-3xl -z-10" />
      </section>

      {/* Helper trigger */}
      <span className="hidden" onClick={() => handleNavClick('home')} />

    </div>
  );
}
