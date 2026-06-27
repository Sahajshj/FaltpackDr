import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ChevronLeft, ChevronRight, Info, MessageSquare, Sparkles 
} from 'lucide-react';

interface Project {
  id: string;
  publicId: string;
  category: 'wardrobes' | 'storage' | 'bedroom' | 'other';
  categoryLabel: string;
  caption: string;
  isLandscape?: boolean;
}

const GALLERY_PROJECTS: Project[] = [
  // Wardrobes (12 images)
  { id: 'w1', publicId: 'Wardrobe1', category: 'wardrobes', categoryLabel: 'Wardrobe', caption: 'Wardrobe Installation — Project 01' },
  { id: 'w2', publicId: 'Wardrobe2', category: 'wardrobes', categoryLabel: 'Wardrobe', caption: 'Wardrobe Installation — Project 02' },
  { id: 'w3', publicId: 'Wardrobe3', category: 'wardrobes', categoryLabel: 'Wardrobe', caption: 'Wardrobe Installation — Project 03' },
  { id: 'w4', publicId: 'Wardrobe4', category: 'wardrobes', categoryLabel: 'Wardrobe', caption: 'Wardrobe Installation — Project 04' },
  { id: 'w5', publicId: 'Wardrobe5', category: 'wardrobes', categoryLabel: 'Wardrobe', caption: 'Wardrobe Installation — Project 05' },
  { id: 'w6', publicId: 'Wardrobe6', category: 'wardrobes', categoryLabel: 'Wardrobe', caption: 'Wardrobe Installation — Project 06' },
  { id: 'w7', publicId: 'Wardrobe7', category: 'wardrobes', categoryLabel: 'Wardrobe', caption: 'Wardrobe Installation — Project 07' },
  { id: 'w8', publicId: 'Wardrobe8', category: 'wardrobes', categoryLabel: 'Wardrobe', caption: 'Wardrobe Installation — Project 08' },
  { id: 'w9', publicId: 'Wardrobe9', category: 'wardrobes', categoryLabel: 'Wardrobe', caption: 'Wardrobe Installation — Project 09' },
  { id: 'w10', publicId: 'Wardrobe10', category: 'wardrobes', categoryLabel: 'Wardrobe', caption: 'Wardrobe Installation — Project 10' },
  { id: 'w11', publicId: 'Wardrobe11', category: 'wardrobes', categoryLabel: 'Wardrobe', caption: 'Wardrobe Installation — Project 11' },
  { id: 'w12', publicId: 'Wardrobe12', category: 'wardrobes', categoryLabel: 'Wardrobe', caption: 'Wardrobe Installation — Project 12' },

  // Storage & Cabinets (6 images)
  { id: 'sc1', publicId: 'SC1', category: 'storage', categoryLabel: 'Storage & Cabinet', caption: 'Storage & Cabinet Assembly — Project 01', isLandscape: true },
  { id: 'sc2', publicId: 'SC2', category: 'storage', categoryLabel: 'Storage & Cabinet', caption: 'Storage & Cabinet Assembly — Project 02' },
  { id: 'sc3', publicId: 'SC3', category: 'storage', categoryLabel: 'Storage & Cabinet', caption: 'Storage & Cabinet Assembly — Project 03' },
  { id: 'sc4', publicId: 'SC4', category: 'storage', categoryLabel: 'Storage & Cabinet', caption: 'Storage & Cabinet Assembly — Project 04', isLandscape: true },
  { id: 'sc5', publicId: 'SC5', category: 'storage', categoryLabel: 'Storage & Cabinet', caption: 'Storage & Cabinet Assembly — Project 05' },
  { id: 'sc6', publicId: 'SC6', category: 'storage', categoryLabel: 'Storage & Cabinet', caption: 'Storage & Cabinet Assembly — Project 06' },

  // Bedroom Furniture (5 images)
  { id: 'b1', publicId: 'Bed1', category: 'bedroom', categoryLabel: 'Bedroom Furniture', caption: 'Bedroom Furniture Assembly — Project 01', isLandscape: true },
  { id: 'b2', publicId: 'Bed2', category: 'bedroom', categoryLabel: 'Bedroom Furniture', caption: 'Bedroom Furniture Assembly — Project 02' },
  { id: 'b3', publicId: 'Bed3', category: 'bedroom', categoryLabel: 'Bedroom Furniture', caption: 'Bedroom Furniture Assembly — Project 03' },
  { id: 'b4', publicId: 'Bed4', category: 'bedroom', categoryLabel: 'Bedroom Furniture', caption: 'Bedroom Furniture Assembly — Project 04', isLandscape: true },
  { id: 'b5', publicId: 'Bed5', category: 'bedroom', categoryLabel: 'Bedroom Furniture', caption: 'Bedroom Furniture Assembly — Project 05' },

  // Other Furniture (1 image)
  { id: 'of1', publicId: 'v1782558804/OF1.webp', category: 'other', categoryLabel: 'Other Furniture Assembly', caption: 'Other Furniture Assembly', isLandscape: true }
];

interface GalleryViewProps {
  onQuoteClick: () => void;
}

// Customized loading-aware image component to prevent empty blank spots
function GalleryImage({ 
  src, 
  alt, 
  className, 
  lazy 
}: { 
  src: string; 
  alt: string; 
  className: string; 
  lazy: boolean; 
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full bg-stone-100">
      {!isLoaded && (
        <div className="absolute inset-0 bg-stone-200 animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-emerald-800/20 border-t-emerald-800 animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
        loading={lazy ? "lazy" : "eager"}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}

export default function GalleryView({ onQuoteClick }: GalleryViewProps) {
  const [activeFilter, setActiveFilter] = useState<'wardrobes' | 'storage' | 'bedroom' | 'other'>('wardrobes');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const filters = [
    { label: 'Wardrobes', value: 'wardrobes' as const },
    { label: 'Storage & Cabinets', value: 'storage' as const },
    { label: 'Bedroom Furniture', value: 'bedroom' as const },
    { label: 'Other Furniture', value: 'other' as const }
  ];

  // Filter projects based on active selection
  const filteredProjects = GALLERY_PROJECTS.filter((project) => project.category === activeFilter);

  // Lightbox navigation logic
  const handlePrev = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => 
      prev === null ? null : (prev === 0 ? filteredProjects.length - 1 : prev - 1)
    );
  };

  const handleNext = () => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => 
      prev === null ? null : (prev === filteredProjects.length - 1 ? 0 : prev + 1)
    );
  };

  // Keyboard controls for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'Escape') {
        setLightboxIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxIndex, filteredProjects]);

  // Touch swipe detection for mobile swiping
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
    touchEndX.current = null;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (diffX > minSwipeDistance) {
      // Swiped left, show next
      handleNext();
    } else if (diffX < -minSwipeDistance) {
      // Swiped right, show previous
      handlePrev();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const getImageUrl = (publicId: string) => {
    return `https://res.cloudinary.com/dsr5jixdd/image/upload/f_auto,q_auto/${publicId}`;
  };

  return (
    <div className="pt-24 bg-stone-50 min-h-screen pb-20">
      
      {/* Gallery Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <span className="text-xs uppercase font-mono tracking-widest font-bold text-emerald-800 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Handcrafted Execution
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900 mt-2">
          Recent Assembly Projects
        </h1>
        <p className="text-stone-500 text-sm max-w-xl mx-auto mt-4 leading-relaxed">
          A selection of completed furniture assembly projects across Victoria.
        </p>
      </div>

      {/* Filter Tabs Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="flex flex-wrap justify-center gap-2 border-b border-stone-200 pb-6">
          {filters.map((filter) => (
            <button
              id={`filter-tab-${filter.value}`}
              key={filter.value}
              onClick={() => {
                setActiveFilter(filter.value);
                setLightboxIndex(null); // Reset lightbox on filter change
              }}
              className={`text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-lg transition-all ${
                activeFilter === filter.value
                  ? 'bg-emerald-800 text-white shadow'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Project Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProjects.map((project, index) => {
            const isLandscape = project.isLandscape;
            // Lazy load images that are below index 6 (first viewport has index 0-5)
            const isLazy = index >= 6;

            return (
              <div 
                id={`gallery-project-card-${project.id}`}
                key={project.id} 
                className={`group bg-white rounded-2xl overflow-hidden border border-stone-200/60 shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer relative ${
                  isLandscape ? 'col-span-2 lg:col-span-1' : 'col-span-1'
                }`}
                onClick={() => setLightboxIndex(index)}
              >
                {/* Image Wrapper */}
                <div className={`w-full bg-stone-100 relative overflow-hidden ${
                  isLandscape 
                    ? 'aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3]' 
                    : 'aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4]'
                }`}>
                  <GalleryImage
                    src={getImageUrl(project.publicId)}
                    alt={project.caption}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                    lazy={isLazy}
                  />

                  {/* Elegant Gradient Dark Caption Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-3 sm:p-4 text-left flex flex-col justify-end">
                    <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
                      {project.categoryLabel}
                    </span>
                    <h3 className="text-white text-xs font-bold tracking-tight mt-0.5 leading-snug">
                      {project.caption}
                    </h3>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox Overlay */}
      {lightboxIndex !== null && (
        <div 
          id="gallery-lightbox"
          className="fixed inset-0 bg-stone-950/98 backdrop-blur-md z-50 flex flex-col justify-between"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar with counter & close */}
          <div className="p-4 md:p-6 flex items-center justify-between text-stone-300">
            <span className="text-xs font-mono font-bold">
              PROJECT {lightboxIndex + 1} OF {filteredProjects.length}
            </span>
            <button
              id="lightbox-close-button"
              onClick={() => setLightboxIndex(null)}
              className="p-2 text-stone-300 hover:text-white bg-stone-900/65 hover:bg-stone-800 rounded-full transition-colors"
              aria-label="Close Lightbox"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Core Content Area */}
          <div className="flex-1 flex items-center justify-between px-4 md:px-12 relative max-w-7xl mx-auto w-full">
            
            {/* Prev Trigger (Hidden on single image or first mobile) */}
            <button
              id="lightbox-prev-button"
              onClick={handlePrev}
              className="absolute left-4 md:left-6 p-3 text-stone-300 hover:text-white bg-stone-900/65 hover:bg-stone-800 rounded-full transition-all shrink-0 z-10"
              aria-label="Previous Image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Displaying Image with absolute proportions (contain) */}
            <div className="w-full h-full flex items-center justify-center py-2 px-2 md:px-12 select-none">
              <img
                src={getImageUrl(filteredProjects[lightboxIndex].publicId)}
                alt={filteredProjects[lightboxIndex].caption}
                className="max-w-full max-h-[75vh] md:max-h-[80vh] object-contain rounded-lg shadow-2xl transition-all duration-300"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Next Trigger */}
            <button
              id="lightbox-next-button"
              onClick={handleNext}
              className="absolute right-4 md:right-6 p-3 text-stone-300 hover:text-white bg-stone-900/65 hover:bg-stone-800 rounded-full transition-all shrink-0 z-10"
              aria-label="Next Image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Bar with Caption info */}
          <div className="p-6 md:p-8 bg-stone-900/90 text-center border-t border-stone-800/50">
            <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 uppercase block mb-1">
              {filteredProjects[lightboxIndex].categoryLabel}
            </span>
            <h2 className="text-white text-sm md:text-base font-bold tracking-tight">
              {filteredProjects[lightboxIndex].caption}
            </h2>
            <p className="text-stone-400 text-xs mt-1 max-w-md mx-auto hidden md:block">
              Completed locally in Victoria. Use the left/right arrow keys or swipe to navigate projects.
            </p>
          </div>
        </div>
      )}

      {/* Custom Booking CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center space-y-4">
        <h3 className="text-xl font-bold text-stone-900 tracking-tight">Ready to Get Started?</h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Send us your layout designs, cabinet plans, or assembly instruction sheets. Prabh and the team will analyze your custom requirements and prepare a fixed-price proposal.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onQuoteClick}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 px-6 rounded transition-colors shadow-sm"
          >
            Get a Free Assembly Quote
          </button>
          <a
            href="https://wa.me/61489220855?text=Hi%20Prabh,%20I%20saw%20your%2520completed%20projects%20on%20the%20Gallery%20and%20would%20like%20to%20discuss%20an%20assembly"
            target="_blank"
            rel="noreferrer referrer"
            className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-350 font-bold text-xs py-3 px-6 rounded transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <MessageSquare className="w-4 h-4 text-emerald-800" />
            Discuss via WhatsApp
          </a>
        </div>
      </div>

    </div>
  );
}
