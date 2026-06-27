import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Hammer, Trash2, Activity, MoveUpRight, Maximize2, 
  ShieldCheck, Shuffle, CheckCircle2, ShieldAlert, ArrowRight, MessageSquare, Info 
} from 'lucide-react';
import { Page } from '../types';
import { ADDITIONAL_SERVICES_DATA } from '../data';

interface AdditionalServicesViewProps {
  onQuoteClick: () => void;
  setCurrentPage: (page: Page) => void;
  selectedServiceId: string | null;
  setSelectedServiceId: (id: string | null) => void;
}

export default function AdditionalServicesView({ 
  onQuoteClick, 
  setCurrentPage, 
  selectedServiceId, 
  setSelectedServiceId 
}: AdditionalServicesViewProps) {
  const serviceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const mobileServiceRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const isInitialRender = useRef(true);
  const [activeHighlightId, setActiveHighlightId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const displayedServices = selectedServiceId 
    ? ADDITIONAL_SERVICES_DATA.filter(s => s.id === selectedServiceId)
    : ADDITIONAL_SERVICES_DATA;

  // Fallback to all services if ID matches something else or is invalid
  const finalServices = displayedServices.length > 0 ? displayedServices : ADDITIONAL_SERVICES_DATA;

  const handleShowAllServices = () => {
    setSelectedServiceId(null);
    setOpenId(null);
    setActiveHighlightId(null);
    window.history.replaceState({}, '', '/additional-services');
  };

  useEffect(() => {
    const shouldScrollToSelection = isInitialRender.current;
    isInitialRender.current = false;

    if (selectedServiceId) {
      const targetId = selectedServiceId;
      setActiveHighlightId(targetId);
      setOpenId(targetId);
      
      if (shouldScrollToSelection) {
        setTimeout(() => {
          const isMobile = window.matchMedia('(max-width: 767px)').matches;
          const target = isMobile
            ? mobileServiceRefs.current[targetId]
            : serviceRefs.current[targetId];
          target?.scrollIntoView({ behavior: 'smooth', block: isMobile ? 'start' : 'center' });
        }, 350);
      }

      const highlightTimer = setTimeout(() => {
        setActiveHighlightId(null);
      }, 4000);

      return () => {
        clearTimeout(highlightTimer);
      };
    }

    setOpenId(null);
    setActiveHighlightId(null);
  }, [selectedServiceId]);
  
  // Custom icons resolver
  const getIcon = (iconName: string, className: string = "w-6 h-6 text-emerald-800") => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Hammer': return <Hammer className={className} />;
      case 'Trash2': return <Trash2 className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'MoveUpRight': return <MoveUpRight className={className} />;
      case 'Maximize2': return <Maximize2 className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Shuffle': return <Shuffle className={className} />;
      case 'CheckCircle2': return <CheckCircle2 className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  return (
    <div className="pt-24 bg-stone-50 min-h-screen pb-20">
      
      {/* Editorial Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <span className="text-xs uppercase font-mono tracking-widest font-bold text-emerald-800">
          Professional Area Enhancements
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900 mt-2">
          Additional Services
        </h1>
        <p className="text-stone-500 text-sm max-w-xl mx-auto mt-4 leading-relaxed">
          Some furniture pieces require exact spatial prep or baseboards modification to stand secure, level, and sits flush against walls.
        </p>

        {/* Core Warning Badge */}
        <div className="mt-6 inline-flex items-start gap-3 bg-amber-50 border border-amber-200/60 rounded-xl p-4 max-w-2xl text-left text-xs text-amber-900 shadow-sm">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div>
            <strong className="font-bold">Please Note:</strong> Supporting services (such as skirting board removals, specialized heavy levelling, and cardboard recycling) involve custom site preparation and may involve an extra cost depending on specific layout requirements.
          </div>
        </div>

        {selectedServiceId && ADDITIONAL_SERVICES_DATA.some(s => s.id === selectedServiceId) && (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 bg-emerald-50 border border-emerald-200/60 px-5 py-3.5 rounded-2xl shadow-xs max-w-2xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 text-center">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse shrink-0"></span>
              <p className="text-xs text-stone-700 font-semibold">
                Showing specific category only: <strong className="text-emerald-950 font-bold">{ADDITIONAL_SERVICES_DATA.find(s => s.id === selectedServiceId)?.title}</strong>
              </p>
            </div>
            <button
              onClick={handleShowAllServices}
              className="text-xs font-bold text-emerald-850 hover:text-emerald-950 underline decoration-emerald-800/40 hover:decoration-emerald-950 decoration-2 underline-offset-4 shrink-0 transition-all"
            >
              Show All Supporting Services
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
              id={`additional-service-${service.id}`}
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
                  {service.description}
                </p>

                {/* Scope Lists */}
                {service.examples && service.examples.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold text-stone-900 uppercase font-mono tracking-wide">
                      Key Scope & Included Items
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
                )}

                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/61489220855?text=${encodeURIComponent(`Hi Prabh, I am looking for some help with supporting service: ${service.title}`)}`}
                    target="_blank"
                    rel="noreferrer referrer"
                    className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs py-2.5 px-5 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                    Discuss via WhatsApp
                  </a>
                </div>
              </div>

              {/* Graphic/Image Side */}
              <div className={`lg:col-span-5 relative ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-md border border-stone-200/50">
                  <img
                    src={service.imagePlaceholder || "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80"}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-mono font-bold text-stone-500 border border-stone-200/40">
                  Support Standard
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile-only Accordion Block */}
      <div className="md:hidden max-w-2xl mx-auto px-4 space-y-2 pb-4">
        {finalServices.map((service) => {
          const isOpen = openId === service.id || selectedServiceId === service.id;
          return (
            <div
              key={service.id}
              id={`mobile-additional-service-${service.id}`}
              ref={(el) => { mobileServiceRefs.current[service.id] = el; }}
              className={`bg-white rounded-xl border transition-all duration-300 overflow-hidden scroll-mt-28 ${
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
                    src={service.imagePlaceholder || "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80"}
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
                    {service.description}
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
                    <a
                      href={`https://wa.me/61489220855?text=${encodeURIComponent(`Hi Prabh, I am looking for some help with supporting service: ${service.title}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                      Discuss via WhatsApp
                    </a>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Consultation Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-8 md:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
          <div className="w-10 h-10 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2">
            <Info className="w-5 h-5" />
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Discuss Your Site Requirements</h3>
          <p className="text-xs text-stone-300 max-w-lg mx-auto leading-relaxed">
            Unsure if your baseboard needs cutting or if your plasterboard walls can support heavy mirrors? Share photographs of your space with Prabh, and we will advise you on the optimal assembly procedure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <button
              onClick={onQuoteClick}
              className="bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs py-3.5 px-6 rounded transition-colors"
            >
              Request Custom Quote
            </button>
            <a
              href="https://wa.me/61489220855?text=Hi%20Prabh,%20I%20have%20questions%20about%20room%20preparation%20and%20skirting%20boards"
              target="_blank"
              rel="noreferrer referrer"
              className="bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 font-bold text-xs py-3.5 px-6 rounded transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              WhatsApp Prabh
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
