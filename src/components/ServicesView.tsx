import { useEffect, useRef, useState } from 'react';
import { 
  Wrench, Layers, Layout, Bed, FolderKanban, Tv, Laptop, Sun, 
  ShieldAlert, RefreshCw, Ruler, Move, Info, ArrowRight, ShieldCheck 
} from 'lucide-react';
import { Page, ServiceItem } from '../types';
import { SERVICES_DATA } from '../data';

interface ServicesViewProps {
  onQuoteClick: () => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
}

export default function ServicesView({ onQuoteClick, selectedServiceId, setSelectedServiceId }: ServicesViewProps) {
  const serviceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const displayedServices = selectedServiceId 
    ? SERVICES_DATA.filter(s => s.id === selectedServiceId)
    : SERVICES_DATA;

  // Fallback to all services if ID matches something else or is invalid
  const finalServices = displayedServices.length > 0 ? displayedServices : SERVICES_DATA;

  useEffect(() => {
    if (selectedServiceId && serviceRefs.current[selectedServiceId]) {
      const targetId = selectedServiceId;
      setActiveHighlightId(targetId);
      
      const scrollTimer = setTimeout(() => {
        serviceRefs.current[targetId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 350);

      const highlightTimer = setTimeout(() => {
        setActiveHighlightId(null);
      }, 4000);

      return () => {
        clearTimeout(scrollTimer);
        clearTimeout(highlightTimer);
      };
    }
  }, [selectedServiceId]);

  // Map icon names to Lucide elements
  const getIcon = (iconName: string, className: string = "w-6 h-6 text-emerald-800") => {
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
      default: return <Wrench className={className} />;
    }
  };

  return (
    <div className="pt-24 bg-stone-50 min-h-screen pb-20">
      
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <span className="text-xs uppercase font-mono tracking-widest font-bold text-emerald-800">
          Professional Assembly Catalog
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900 mt-2">
          General Service
        </h1>
        <p className="text-stone-500 text-sm max-w-xl mx-auto mt-4 leading-relaxed">
          From simple bedside drawers to complex multi-unit custom wardrobes, our experienced crew handles every job with systematic precision.
        </p>

        {/* Dynamic pricing note */}
        <div className="mt-6 inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-stone-200 shadow-sm max-w-lg text-left text-[11px] text-stone-600">
          <Info className="w-4 h-4 text-emerald-800 shrink-0" />
          <span>
            <strong>Service Pricing Note:</strong> Flatpack Doctors rates depend strictly on furniture size, complexity, travel distance, and any floor leveling or room preparation requirements.
          </span>
        </div>

        {selectedServiceId && SERVICES_DATA.some(s => s.id === selectedServiceId) && (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 bg-emerald-50 border border-emerald-200/60 px-5 py-3.5 rounded-2xl shadow-xs max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-center">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
              <p className="text-xs text-stone-700 font-semibold">
                Showing specific category only: <strong className="text-emerald-950 font-bold">{SERVICES_DATA.find(s => s.id === selectedServiceId)?.title}</strong>
              </p>
            </div>
            <button
              onClick={() => setSelectedServiceId(null)}
              className="text-xs font-bold text-emerald-850 hover:text-emerald-950 underline decoration-emerald-800/40 hover:decoration-emerald-950 decoration-2 underline-offset-4 shrink-0 transition-all"
            >
              Show All General Services
            </button>
          </div>
        )}
      </div>

      {/* Services List Detail Cards */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {finalServices.map((service, idx) => {
          const isEven = idx % 2 === 0;
          const isHighlighted = activeHighlightId === service.id || selectedServiceId === service.id;
          return (
            <div
              key={service.id}
              ref={(el) => { serviceRefs.current[service.id] = el; }}
              className={`bg-white rounded-2xl border p-6 md:p-10 transition-all duration-500 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center scroll-mt-28 relative ${
                isHighlighted 
                  ? 'border-emerald-600 shadow-xl ring-4 ring-emerald-600/10 scale-[1.01]' 
                  : 'border-stone-200/60 shadow-sm hover:shadow'
              }`}
            >
              {/* Text Side */}
              <div className={`lg:col-span-7 space-y-5 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${
                    isHighlighted ? 'bg-emerald-100' : 'bg-emerald-50'
                  }`}>
                    {getIcon(service.iconName, isHighlighted ? "w-6 h-6 text-emerald-900" : "w-6 h-6 text-emerald-800")}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className={`text-xl md:text-2xl font-bold tracking-tight transition-colors duration-500 ${
                        isHighlighted ? 'text-emerald-950 font-extrabold' : 'text-stone-900'
                      }`}>
                        {service.title}
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400 font-semibold block">
                      Category Code: FD-{service.id.toUpperCase()}
                    </span>
                  </div>
                </div>

                <p className="text-stone-600 text-sm leading-relaxed">
                  {service.longDescription || service.description}
                </p>

                {/* Scope Lists */}
                <div className="space-y-2.5">
                  <h4 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wide">
                    Common Items We Assemble
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 font-medium">
                    {service.examples.map((ex, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                        <span>{ex}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={onQuoteClick}
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs py-2.5 px-5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    Get a Quote for this Category
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <a
                    href="https://wa.me/61489220855?text=Hi%20Prabh,%20I%20am%20looking%20for%20some%20help%20with%20assembled%20services"
                    target="_blank"
                    rel="noreferrer referrer"
                    className="border border-stone-300 hover:bg-stone-50 text-stone-800 font-semibold text-xs py-2.5 px-5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    Discuss via WhatsApp
                  </a>
                </div>
              </div>

              {/* Graphic/Image Side */}
              <div className={`lg:col-span-5 relative ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-stone-200/50">
                  <img
                    src={service.imagePlaceholder}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono font-bold text-stone-500 border border-stone-200/40">
                  Specialist Standard
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile-only Accordion Block */}
      <div className="md:hidden max-w-2xl mx-auto px-4 space-y-2 pb-4">
        {finalServices.map((service) => {
          const isOpen = openId === service.id;
          return (
            <div
              key={service.id}
              className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden ${
                isOpen ? 'border-emerald-600 shadow-md' : 'border-stone-200'
              }`}
            >
              {/* Accordion Header — always visible */}
              <button
                onClick={() => setOpenId(isOpen ? null : service.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                {/* Thumbnail image */}
                <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-stone-100">
                  <img
                    src={service.imagePlaceholder}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Title + category code */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-stone-900 leading-tight">
                    {service.title}
                  </p>
                  <p className="text-[10px] font-mono text-stone-400 mt-0.5 uppercase tracking-wide">
                    FD-{service.id.toUpperCase()}
                  </p>
                </div>

                {/* Chevron */}
                <div className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                  <svg className="w-4 h-4 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {/* Accordion Body — visible only when open */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-stone-100 pt-3">
                  {/* Description */}
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {service.longDescription || service.description}
                  </p>

                  {/* Examples list */}
                  {service.examples && service.examples.length > 0 && (
                    <div className="space-y-1.5">
                      {service.examples.map((ex, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-stone-700 font-medium">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                          <span>{ex}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* CTA buttons */}
                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      onClick={onQuoteClick}
                      className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      Get a Quote for this Category
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    
                    <a
                      href="https://wa.me/61489220855?text=Hi%20Prabh,%20I%20am%20looking%20for%20some%20help%20with%20assembled%20services"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full border border-stone-300 text-stone-800 font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      Discuss via WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Support Box */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-stone-900 text-white p-8 rounded-2xl text-center space-y-4 shadow-xl">
          <h3 className="text-xl font-extrabold">Need Custom Multi-Unit Wardrobe Fits?</h3>
          <p className="text-xs text-stone-300 max-w-lg mx-auto">
            Large wardrobe and office configurations require systematic spacing layouts and wall levelling. Send Prabh your layout PDFs or IKEA Planner codes directly for custom quotes.
          </p>
          <div className="pt-2">
            <button
              onClick={onQuoteClick}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs py-3 px-6 rounded transition-colors"
            >
              Consult with Prabh
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
