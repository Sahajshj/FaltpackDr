import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ShieldCheck, Wrench, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ScrollytellingProps {
  onQuoteClick: () => void;
}

const TOTAL_FRAMES = 164;
const MOBILE_FRAME_COUNT = 55;

// Create the frame URL array using optimized Cloudinary WebP generation
const frameUrls = Array.from({ length: TOTAL_FRAMES }, (_, i) => {
  const formattedNum = String(i + 1).padStart(3, '0');
  return `https://res.cloudinary.com/dsr5jixdd/image/upload/f_webp,q_100/ezgif-frame-${formattedNum}.jpg`;
});

const mobileFrameIndices = Array.from({ length: MOBILE_FRAME_COUNT }, (_, idx) => 
  Math.min(163, Math.round(idx * (163 / (MOBILE_FRAME_COUNT - 1))))
);

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

// Global cache for preloaded images and loading state to persist across page navigations/unmounts
const globalLoadedImages: { [key: number]: HTMLImageElement } = {};
let globalIsPreloaded = false;
let globalLoadingProgress = 0;

// Helper to determine the prioritized preloading order
const getPriorityOrder = (isMob: boolean) => {
  const framesToLoad = isMob ? mobileFrameIndices : Array.from({ length: TOTAL_FRAMES }, (_, i) => i);
  const loadedSet = new Set<number>();
  const priorityList: number[] = [];

  const add = (idx: number) => {
    if (framesToLoad.includes(idx) && !loadedSet.has(idx)) {
      loadedSet.add(idx);
      priorityList.push(idx);
    }
  };

  // 1. Frame 0
  add(0);
  // 2. Frame 163 (last frame)
  add(163);

  // 3. Every 10th frame (0, 10, 20... 160)
  for (let i = 0; i < TOTAL_FRAMES; i += 10) {
    add(i);
  }

  // 4. Every 5th frame (5, 15, 25... 155)
  for (let i = 0; i < TOTAL_FRAMES; i += 5) {
    add(i);
  }

  // 5. All remaining frames in order
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    add(i);
  }

  return priorityList;
};

export default function Scrollytelling({ onQuoteClick }: ScrollytellingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(globalLoadingProgress);
  const [isPreloaded, setIsPreloaded] = useState(globalIsPreloaded);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const loadedImagesRef = useRef<{ [key: number]: HTMLImageElement }>(globalLoadedImages);
  const lastRenderedIndexRef = useRef<number>(-1);
  const currentFrameRef = useRef<number>(0);
  const isReducedMotion = useRef(false);

  // Smooth Interpolation State Refs
  const targetFrameRef = useRef<number>(0);   // where scroll wants to go
  const displayFrameRef = useRef<number>(0);  // where canvas currently is
  const rafRef = useRef<number>(0);           // requestAnimationFrame id

  // Canvas drawing helper
  const drawFrame = (frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = loadedImagesRef.current[frameNum];
    if (img && img.complete && img.naturalWidth > 0) {
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 800;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      lastRenderedIndexRef.current = frameNum;
    }
  };

  // Lerp Animation Loop
  const startAnimationLoop = () => {
    const animate = () => {
      const current = displayFrameRef.current;
      const target = targetFrameRef.current;
      const diff = target - current;

      // Only redraw if there's a meaningful difference
      if (Math.abs(diff) > 0.5) {
        const factor = window.innerWidth < 768 ? 0.18 : 0.12;
        const next = current + diff * factor;
        displayFrameRef.current = next;
        const frameIndex = clamp(Math.round(next), 0, 163);
        drawFrame(frameIndex);
      }

      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
  };

  // Preloading priority sequence & resize listener setup
  useEffect(() => {
    isReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();
    window.addEventListener('resize', checkViewport);

    const isMob = window.innerWidth < 768;

    // Initial frame selection
    const initialFrame = isMob ? 0 : (isReducedMotion.current ? 163 : 0);
    currentFrameRef.current = initialFrame;
    targetFrameRef.current = initialFrame;
    displayFrameRef.current = initialFrame;

    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize);

    if (globalIsPreloaded) {
      setIsPreloaded(true);
      requestAnimationFrame(() => {
        drawFrame(initialFrame);
      });
      return () => {
        window.removeEventListener('resize', checkViewport);
        window.removeEventListener('resize', handleResize);
      };
    }

    const priorityList = getPriorityOrder(isMob);
    const totalToLoad = priorityList.length;
    const criticalCount = isMob ? 10 : 20;

    let loadedCount = priorityList.filter(idx => !!globalLoadedImages[idx]).length;

    // Unlock early if critical frames are ready
    if (loadedCount >= criticalCount) {
      globalIsPreloaded = true;
      setIsPreloaded(true);
    }

    // Load first frame immediately
    const firstImg = new Image();
    firstImg.src = frameUrls[initialFrame];
    firstImg.onload = () => {
      globalLoadedImages[initialFrame] = firstImg;
      loadedCount = priorityList.filter(idx => !!globalLoadedImages[idx]).length;
      globalLoadingProgress = Math.round((loadedCount / totalToLoad) * 100);
      setLoadingProgress(globalLoadingProgress);
      drawFrame(initialFrame);
      loadRemaining();
    };
    firstImg.onerror = () => {
      loadRemaining();
    };

    const loadRemaining = () => {
      priorityList.forEach((idx) => {
        if (idx === initialFrame) return;
        if (globalLoadedImages[idx]) return;

        const img = new Image();
        img.src = frameUrls[idx];
        img.onload = () => {
          globalLoadedImages[idx] = img;
          loadedCount = priorityList.filter(i => !!globalLoadedImages[i]).length;
          globalLoadingProgress = Math.round((loadedCount / totalToLoad) * 100);
          setLoadingProgress(globalLoadingProgress);

          if (idx === currentFrameRef.current) {
            drawFrame(idx);
          }

          if (loadedCount >= criticalCount && !globalIsPreloaded) {
            globalIsPreloaded = true;
            setIsPreloaded(true);
          }
        };
        img.onerror = () => {
          loadedCount = priorityList.filter(i => !!globalLoadedImages[i]).length;
          globalLoadingProgress = Math.round((loadedCount / totalToLoad) * 100);
          setLoadingProgress(globalLoadingProgress);

          if (loadedCount >= criticalCount && !globalIsPreloaded) {
            globalIsPreloaded = true;
            setIsPreloaded(true);
          }
        };
      });
    };

    return () => {
      window.removeEventListener('resize', checkViewport);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Manage Animation Loop Tick
  useEffect(() => {
    if (isPreloaded) {
      startAnimationLoop();
    }
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, [isPreloaded]);

  // Setup ScrollTrigger once preloading state transitions or isMobile changes
  useEffect(() => {
    const isReducedMotionVal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMob = window.innerWidth < 768;

    const ctx = gsap.context(() => {
      if (isMob) {
        if (isReducedMotionVal) return;
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            setScrollProgress(progress);

            // Map progress to our mobileFrameIndices subset
            const targetIndex = clamp(Math.round(progress * (mobileFrameIndices.length - 1)), 0, mobileFrameIndices.length - 1);
            const frameIndex = mobileFrameIndices[targetIndex];

            targetFrameRef.current = frameIndex;
            currentFrameRef.current = frameIndex;
          }
        });
      } else {
        if (isReducedMotionVal) return;
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress;
            setScrollProgress(progress);

            const frameIndex = clamp(Math.round(progress * 163), 0, 163);
            targetFrameRef.current = frameIndex;
            currentFrameRef.current = frameIndex;
          }
        });
      }
    }, containerRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [isPreloaded, isMobile]);

  const getActiveBeat = () => {
    const isReducedMotionVal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotionVal || isMobile) return 3; // Always show final open-box beats statically
    if (scrollProgress < 0.20) return 0;
    if (scrollProgress < 0.45) return 1;
    if (scrollProgress < 0.75) return 2;
    return 3;
  };

  const getActiveMobileBlock = () => {
    const isReducedMotionVal = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isReducedMotionVal) return 3;
    if (scrollProgress < 0.25) return 0;
    if (scrollProgress < 0.50) return 1;
    if (scrollProgress < 0.75) return 2;
    return 3;
  };

  const activeBeat = getActiveBeat();
  const activeMobileBlock = getActiveMobileBlock();
  const isReducedMotionActive = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const canvasElement = (
    <canvas 
      ref={canvasRef} 
      className="w-full h-full object-contain drop-shadow-xl z-10 transition-transform duration-300 hover:scale-[1.02]"
    />
  );

  return (
    <section 
      id="quality-standards"
      ref={containerRef}
      className="relative w-full bg-[#fcfbfa] text-stone-900 border-y border-stone-200/50 scroll-mt-20"
      style={{ height: isPreloaded ? (isMobile ? '400vh' : '250vh') : 'auto' }}
    >
      {/* Absolute Loading overlay until critical frames are loaded */}
      {!isPreloaded && (
        <div className="absolute inset-0 bg-[#fcfbfa] flex flex-col items-center justify-center min-h-[500px] py-20 px-6 z-50">
          <Loader2 className="w-12 h-12 text-emerald-800 animate-spin mb-4" />
          <h3 className="text-xl font-medium tracking-tight mb-2">Preparing the Flatpack Doctors Standard…</h3>
          <p className="text-stone-500 text-sm max-w-sm text-center mb-4">
            Loading high-precision interactive animation frames to demonstrate the Flatpack Doctors standard.
          </p>
          <div className="w-48 bg-stone-200 h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-emerald-800 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <span className="text-xs text-stone-400 mt-2">{loadingProgress}% Loaded</span>
        </div>
      )}

      {isMobile ? (
        <div 
          className="sticky left-0 w-full flex flex-col overflow-hidden bg-[#fcfbfa]"
          style={{ top: '64px', height: 'calc(100vh - 64px)' }}
        >
          {/* TOP HALF — Animation (45% of screen height) */}
          <div 
            className="h-[45vh] w-full flex items-center justify-center relative bg-[#fcfbfa] py-2 border-b border-stone-100"
            style={{ paddingTop: '12px' }}
          >
            {canvasElement}
            {/* Subtle ambient glowing background representing the box workspace */}
            <div className="absolute inset-0 bg-radial from-stone-200/30 to-transparent rounded-full scale-75 blur-2xl -z-10" />
          </div>

          {/* BOTTOM HALF — Text content (55% of screen height) */}
          <div className="h-[55vh] w-full border-t border-stone-200/50 px-6 pt-5 pb-6 flex flex-col justify-start relative select-none bg-[#fcfbfa]">
            {/* 1. Header (always visible, never changes) */}
            <div className="mb-2">
              <span className="text-xs uppercase tracking-widest font-mono text-emerald-800 font-semibold block mb-0.5">
                Craftsmanship & Care
              </span>
              <h2 className="text-xl font-bold tracking-tight text-stone-900">
                The Flatpack Doctors Standard
              </h2>
            </div>

            {/* 2. Stage indicator bar (always visible) */}
            <div className="flex gap-1.5 mb-4 w-full">
              {['Plan', 'Calibrate', 'Execute', 'Handover'].map((label, idx) => (
                <div 
                  key={label}
                  className={`flex-1 text-center py-1 rounded text-[10px] font-mono font-bold uppercase transition-all duration-300 ${
                    activeMobileBlock === idx 
                      ? 'bg-emerald-800 text-white shadow-sm' 
                      : 'bg-stone-100 text-stone-400'
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* 3. Stage text content (transitions on scroll) */}
            <div className="relative flex-1 min-h-[180px]">
              {/* Block 1 */}
              <motion.div 
                initial={false}
                animate={{
                  opacity: activeMobileBlock === 0 ? 1 : 0,
                  y: activeMobileBlock === 0 ? 0 : 12,
                  scale: activeMobileBlock === 0 ? 1 : 0.95,
                  filter: activeMobileBlock === 0 ? 'blur(0px)' : 'blur(4px)',
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-0 w-full will-change-transform"
                style={{ pointerEvents: activeMobileBlock === 0 ? 'auto' : 'none', zIndex: activeMobileBlock === 0 ? 10 : 0 }}
              >
                <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mb-2">
                  Stage 1 — Planning
                </span>
                <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-1.5 leading-snug">
                  A proper assembly starts before the first screw.
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  Every job begins with planning, the right materials, and care for your space.
                </p>
              </motion.div>

              {/* Block 2 */}
              <motion.div 
                initial={false}
                animate={{
                  opacity: activeMobileBlock === 1 ? 1 : 0,
                  y: activeMobileBlock === 1 ? 0 : 12,
                  scale: activeMobileBlock === 1 ? 1 : 0.95,
                  filter: activeMobileBlock === 1 ? 'blur(0px)' : 'blur(4px)',
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-0 w-full will-change-transform"
                style={{ pointerEvents: activeMobileBlock === 1 ? 'auto' : 'none', zIndex: activeMobileBlock === 1 ? 10 : 0 }}
              >
                <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mb-2">
                  Stage 2 — Calibration
                </span>
                <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-1.5 leading-snug">
                  The right tools. The right method.
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  We use suitable tools, correct fittings, and proper assembly steps for a clean, reliable result.
                </p>
              </motion.div>

              {/* Block 3 */}
              <motion.div 
                initial={false}
                animate={{
                  opacity: activeMobileBlock === 2 ? 1 : 0,
                  y: activeMobileBlock === 2 ? 0 : 12,
                  scale: activeMobileBlock === 2 ? 1 : 0.95,
                  filter: activeMobileBlock === 2 ? 'blur(0px)' : 'blur(4px)',
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-0 w-full will-change-transform"
                style={{ pointerEvents: activeMobileBlock === 2 ? 'auto' : 'none', zIndex: activeMobileBlock === 2 ? 10 : 0 }}
              >
                <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mb-2">
                  Stage 3 — Execution
                </span>
                <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-1.5 leading-snug">
                  Prepared for precision.
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed mb-3">
                  From wardrobes and beds to office furniture and storage, every detail is handled carefully.
                </p>
                <ul className="space-y-1.5 text-[11px] text-stone-700 font-semibold pl-1">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-800 text-base leading-none">•</span>
                    Suitable tools for each job
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-800 text-base leading-none">•</span>
                    Correct fittings and safe setup
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-800 text-base leading-none">•</span>
                    Wall fixing where suitable
                  </li>
                </ul>
              </motion.div>

              {/* Block 4 */}
              <motion.div 
                initial={false}
                animate={{
                  opacity: activeMobileBlock === 3 ? 1 : 0,
                  y: activeMobileBlock === 3 ? 0 : 12,
                  scale: activeMobileBlock === 3 ? 1 : 0.95,
                  filter: activeMobileBlock === 3 ? 'blur(0px)' : 'blur(4px)',
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 left-0 w-full will-change-transform"
                style={{ pointerEvents: activeMobileBlock === 3 ? 'auto' : 'none', zIndex: activeMobileBlock === 3 ? 10 : 0 }}
              >
                <span className="inline-flex items-center gap-1.5 bg-emerald-800 text-white font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mb-2">
                  Stage 4 — Handover
                </span>
                <h3 className="text-lg font-bold text-stone-900 tracking-tight mb-1.5 leading-snug">
                  Checked. Aligned. Ready to use.
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed mb-3">
                  We check stability, alignment, safety, and finishing before we leave.
                </p>
                <ul className="space-y-1 text-[11px] text-stone-700 font-semibold pl-1">
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-800 text-base leading-none">•</span>
                    Alignment & stability checked
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-800 text-base leading-none">•</span>
                    Work-area clean-up available
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-800 text-base leading-none">•</span>
                    1-Year Free After-Sales Support
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </div>
      ) : (
        /* Main Interactive Workspace (Pinned on Scroll) */
        <div className="sticky top-0 left-0 w-full h-screen flex flex-col md:flex-row overflow-hidden md:py-0 py-8">
            
            {/* Left Text Narrative Side */}
            <div className="w-full md:w-1/2 flex flex-col justify-center px-6 md:px-16 lg:px-24 z-10 select-none order-2 md:order-1 pt-6 md:pt-0">
              <div className="max-w-md">
                <span className="text-xs uppercase tracking-widest font-mono text-emerald-800 font-semibold block mb-2">
                  Craftsmanship & Care
                </span>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-900 mb-4">
                  The Flatpack Doctors Standard
                </h2>
                <p className="text-stone-600 mb-10 text-sm leading-relaxed">
                  Great assembly is more than putting pieces together. It starts with the right preparation, the right tools, and careful attention to every detail.
                </p>

                {/* Storytelling Beats (Dynamic Content transition) */}
                <div className="relative min-h-[220px]">
                  {/* Beat 1: closed box */}
                  <motion.div 
                    initial={false}
                    animate={{
                      opacity: activeBeat === 0 ? 1 : 0,
                      y: activeBeat === 0 ? 0 : (activeBeat > 0 ? -12 : 12),
                      scale: activeBeat === 0 ? 1 : 0.97,
                      filter: activeBeat === 0 ? 'blur(0px)' : 'blur(4px)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 120,
                      damping: 18,
                      mass: 0.8
                    }}
                    className="absolute top-0 left-0 w-full will-change-transform"
                    style={{ pointerEvents: activeBeat === 0 ? 'auto' : 'none', zIndex: activeBeat === 0 ? 10 : 0 }}
                  >
                    <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-700 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mb-3">
                      Stage 1 — Planning
                    </span>
                    <h3 className="text-2xl font-bold text-stone-900 tracking-tight mb-2">
                      A proper assembly starts before the first screw.
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed mb-4">
                      Every job begins with structured planning, measuring space clearances, laying temporary floor protectors, and caring for your walls and woodwork.
                    </p>
                  </motion.div>

                  {/* Beat 2: flaps opening */}
                  <motion.div 
                    initial={false}
                    animate={{
                      opacity: activeBeat === 1 ? 1 : 0,
                      y: activeBeat === 1 ? 0 : (activeBeat > 1 ? -12 : 12),
                      scale: activeBeat === 1 ? 1 : 0.97,
                      filter: activeBeat === 1 ? 'blur(0px)' : 'blur(4px)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 120,
                      damping: 18,
                      mass: 0.8
                    }}
                    className="absolute top-0 left-0 w-full will-change-transform"
                    style={{ pointerEvents: activeBeat === 1 ? 'auto' : 'none', zIndex: activeBeat === 1 ? 10 : 0 }}
                  >
                    <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mb-3">
                      Stage 2 — Calibration
                    </span>
                    <h3 className="text-2xl font-bold text-stone-900 tracking-tight mb-2">
                      The right tools. The right method.
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed">
                      We use suitable specialist tools (with precision torque limiting), robust replacement dowels, and strict sequence guidelines for an outstanding result that prevents hardware fatigue.
                    </p>
                  </motion.div>

                  {/* Beat 3: rising components */}
                  <motion.div 
                    initial={false}
                    animate={{
                      opacity: activeBeat === 2 ? 1 : 0,
                      y: activeBeat === 2 ? 0 : (activeBeat > 2 ? -12 : 12),
                      scale: activeBeat === 2 ? 1 : 0.97,
                      filter: activeBeat === 2 ? 'blur(0px)' : 'blur(4px)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 120,
                      damping: 18,
                      mass: 0.8
                    }}
                    className="absolute top-0 left-0 w-full will-change-transform"
                    style={{ pointerEvents: activeBeat === 2 ? 'auto' : 'none', zIndex: activeBeat === 2 ? 10 : 0 }}
                  >
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-900 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mb-3">
                      Stage 3 — Execution
                    </span>
                    <h3 className="text-2xl font-bold text-stone-900 tracking-tight mb-2">
                      Prepared for precision.
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed mb-4">
                      From expansive wardrobe layouts to custom study setups, every structural element is meticulously squared, leveled, and fitted with flawless attention.
                    </p>
                    <ul className="space-y-1.5 text-xs text-stone-700 font-medium">
                      <li className="flex items-center gap-2">
                        <Wrench className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                        Suitable tools for each specific timber type
                      </li>
                      <li className="flex items-center gap-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                        Correct brackets, hinge tensioning, and safe setups
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
                        Sturdy wall fixing to plaster or brick studs
                      </li>
                    </ul>
                  </motion.div>

                  {/* Beat 4: completed floating composition */}
                  <motion.div 
                    initial={false}
                    animate={{
                      opacity: activeBeat === 3 ? 1 : 0,
                      y: activeBeat === 3 ? 0 : (activeBeat > 3 ? -12 : 12),
                      scale: activeBeat === 3 ? 1 : 0.97,
                      filter: activeBeat === 3 ? 'blur(0px)' : 'blur(4px)',
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 120,
                      damping: 18,
                      mass: 0.8
                    }}
                    className="absolute top-0 left-0 w-full will-change-transform"
                    style={{ pointerEvents: activeBeat === 3 ? 'auto' : 'none', zIndex: activeBeat === 3 ? 10 : 0 }}
                  >
                    <span className="inline-flex items-center gap-1.5 bg-emerald-800 text-white font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded mb-3">
                      Stage 4 — Handover
                    </span>
                    <h3 className="text-2xl font-bold text-stone-900 tracking-tight mb-2">
                      Checked. Aligned. Ready to use.
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed mb-4">
                      We test vertical alignments, drawer glides, soft-close triggers, stability, and child-safe mounting. We vacuum clean the workspace and leave it looking spectacular.
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs font-semibold text-stone-800">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> Alignment Verified
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-800" /> Space Cleaned Up
                      </div>
                      <div className="flex items-center gap-1.5 col-span-2">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-800" /> 1-Year After-Sales Protection Included
                      </div>
                    </div>

                    <button 
                      onClick={onQuoteClick}
                      className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs py-2.5 px-5 rounded transition-all duration-300 shadow-sm"
                    >
                      Get a Free Quote
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                </div>

                {/* Progress Slider Indicator for Scroll Feedback */}
                {!isReducedMotion.current && (
                  <div className="mt-12 hidden md:block">
                    <div className="flex justify-between text-[10px] font-mono text-stone-400 mb-1">
                      <span>Unboxing</span>
                      <span>Component Assembly</span>
                      <span>Final Check</span>
                    </div>
                    <div className="w-full bg-stone-200 h-1 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-800 h-1 rounded-full transition-all duration-100"
                        style={{ width: `${scrollProgress * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Video / Interactive Sequence Side */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 order-1 md:order-2 h-[45vh] md:h-full relative">
              <div className="w-full h-full max-w-lg md:max-w-xl aspect-square flex items-center justify-center relative">
                {canvasElement}
                
                {/* Subtle ambient glowing background representing the box workspace */}
                <div className="absolute inset-0 bg-radial from-stone-200/40 to-transparent rounded-full scale-75 blur-3xl -z-10" />
              </div>
            </div>

          </div>
      )}
    </section>
  );
}
