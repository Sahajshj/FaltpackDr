import { ShieldCheck, Users, Briefcase, Sparkles, Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { Page } from '../types';

interface AboutViewProps {
  onQuoteClick: () => void;
  setCurrentPage: (page: Page) => void;
}

export default function AboutView({ onQuoteClick, setCurrentPage }: AboutViewProps) {
  return (
    <div className="pt-24 bg-stone-50 min-h-screen pb-20">
      
      {/* Intro Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* text side */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase font-mono tracking-widest font-bold text-emerald-800">
              The Crew Behind Flatpack Doctors
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
              A Professional Team for Furniture Assembly Across Victoria
            </h1>
            <p className="text-stone-600 text-sm leading-relaxed">
              Flatpack Doctors is led by Prabh and supported by a trained team of furniture assemblers. We handle small, medium, and large assembly jobs for homes, apartments, rental properties, offices, and commercial spaces across Victoria.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              From wardrobes, beds, desks, storage units, and TV units to larger installations, we focus on careful assembly, correct alignment, stability, safety, and a clean final finish.
            </p>
            <p className="text-stone-600 text-sm leading-relaxed">
              Our goal is simple: make the booking process easy, complete every job properly, and provide reliable after-assembly support once the work is done.
            </p>

            <div className="grid grid-cols-2 gap-4 max-w-md pt-2">
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" /> Fully Insured
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-stone-800">
                <Users className="w-4 h-4 text-emerald-800 shrink-0" /> Multiple Trained Assemblers
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-stone-800">
                <Briefcase className="w-4 h-4 text-emerald-800 shrink-0" /> Small to Large Jobs
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-stone-800">
                <Sparkles className="w-4 h-4 text-emerald-800 shrink-0" /> 1-Year After-Assembly Support
              </div>
            </div>
          </div>

          {/* image side */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl border border-stone-200/50 relative">
              <img
                src="https://res.cloudinary.com/dsr5jixdd/image/upload/v1782555661/Image.jpg"
                alt="Prabh - Founder, Flatpack Doctors"
                className="w-full h-full object-cover object-[center_top]"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-x-0 bottom-0 bg-stone-900/80 backdrop-blur p-5 text-white text-center">
                <h4 className="font-bold text-xs">Prabh — Founder, Flatpack Doctors</h4>
                <p className="text-[10px] text-stone-300 font-medium mt-0.5">Leading a trained furniture assembly team across Victoria</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Core Principles Section */}
      <div className="bg-white border-y border-stone-200/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 font-bold">Standard of Excellence</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-1">Our Structural Assembly Focus</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-stone-50 rounded-xl space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wide font-mono text-emerald-800">1. Stability & Safety</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Tipping wardrobe modules or unstable shelves can pose severe hazards. We use premium studs detectors and heavy-duty anchors to fix tall units securely to drywall, plasterboard, or timber framework.
              </p>
            </div>
            <div className="p-6 bg-stone-50 rounded-xl space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wide font-mono text-emerald-800">2. Millimeter Leveling</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                Most Australian floors are not perfectly flat. We utilize specialized timber/composite shims and precision spirit levels to level storage modules before mounting, ensuring seamless soft-close glides.
              </p>
            </div>
            <div className="p-6 bg-stone-50 rounded-xl space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-wide font-mono text-emerald-800">3. Neat Workspaces</h3>
              <p className="text-[11px] text-stone-500 leading-relaxed">
                We layout cardboard covers to prevent floor scuffs during unboxing, manage screws systematically, vacuum the work zones before leaving, and bundle waste neatly for recycling.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Tag Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 text-center space-y-6">
        <h3 className="text-xl md:text-2xl font-bold text-stone-900">Are You Ready to Work with Victoria’s Assembly Specialists?</h3>
        <p className="text-xs text-stone-500 max-w-md mx-auto">
          Prabh and our multi-assembler crew handle everything from single drawer builds to commercial workspace fit-outs. Ask us for a transparent fixed quote.
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onQuoteClick}
            className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3.5 px-6 rounded transition-colors"
          >
            Get a Free Quote
          </button>
          <a
            href="tel:0489220855"
            className="bg-white border border-stone-300 text-stone-800 font-bold text-xs py-3.5 px-6 rounded transition-all flex items-center justify-center gap-1.5 hover:bg-stone-50"
          >
            <Phone className="w-4 h-4 text-emerald-800" />
            Call 0489 220 855
          </a>
        </div>
      </div>

    </div>
  );
}
