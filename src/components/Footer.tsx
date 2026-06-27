import { ShieldCheck, Instagram, MessageSquare, Phone, Clock, MapPin, Mail, PackageOpen } from 'lucide-react';
import { Page } from '../types';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
  onQuoteClick: () => void;
}

export default function Footer({ setCurrentPage, onQuoteClick }: FooterProps) {
  const handleNavClick = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-stone-900 text-stone-100 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand Col */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => handleNavClick('home')}>
              <span className="text-xl font-bold tracking-tight text-white">
                Flatpack <span className="text-emerald-400">Doctors</span>
              </span>
              <PackageOpen className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              We treat flat-pack assembly with surgical precision. Flatpack Doctors delivers sturdy, level, and secure installations with an industry-leading 1-year free support assurance across Victoria.
            </p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 bg-emerald-950 text-emerald-300 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                Fully Insured
              </span>
              <span className="inline-flex items-center gap-1 bg-stone-800 text-stone-300 font-mono text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded">
                Victoria-Wide
              </span>
            </div>
          </div>

          {/* Nav Links Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4 font-mono">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <button onClick={() => handleNavClick('home')} className="hover:text-emerald-400 transition-colors">
                  Home Overview
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('services')} className="hover:text-emerald-400 transition-colors">
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('additional-services')} className="hover:text-emerald-400 transition-colors">
                  Additional Services
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('gallery')} className="hover:text-emerald-400 transition-colors">
                  Recent Work Gallery
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setCurrentPage('reviews');
                    setTimeout(() => {
                      const el = document.getElementById('reviews');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }, 150);
                  }} 
                  className="hover:text-emerald-400 transition-colors"
                >
                  Customer Reviews
                </button>
              </li>
              <li>
                <button onClick={() => handleNavClick('about')} className="hover:text-emerald-400 transition-colors">
                  About Prabh & Team
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4 font-mono">
              Operational Details
            </h4>
            <ul className="space-y-3.5 text-xs text-stone-300">
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Business Hours</p>
                  <p className="text-stone-400">7:00 AM – 5:00 PM</p>
                  <p className="text-[10px] text-stone-500 font-mono">Monday to Sunday</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Service Area</p>
                  <p className="text-stone-400">Melbourne & Victoria-Wide</p>
                  <p className="text-stone-500 font-mono text-[10px]">Headquarters: 467 Evans Rd</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Direct CTA Col */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4 font-mono">
              Talk to Prabh
            </h4>
            <div className="space-y-3.5">
              <a
                href="mailto:flatpackdoctors.au@gmail.com"
                className="flex items-center gap-2 text-stone-200 hover:text-emerald-400 transition-colors font-semibold text-xs"
              >
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="break-all">flatpackdoctors.au@gmail.com</span>
              </a>
              <a
                href="tel:0489220855"
                className="flex items-center gap-2 text-stone-200 hover:text-emerald-400 transition-colors font-semibold text-xs"
              >
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                0489 220 855
              </a>
              <a
                href="https://wa.me/61489220855"
                target="_blank"
                rel="noreferrer referrer"
                className="flex items-center gap-2 text-stone-200 hover:text-emerald-400 transition-colors font-semibold text-xs"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                WhatsApp: Direct Message
              </a>
              <a
                href="#instagram"
                className="flex items-center gap-2 text-stone-200 hover:text-emerald-400 transition-colors font-semibold text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Instagram social placeholder link. Ready to be linked to your live account!');
                }}
              >
                <Instagram className="w-4 h-4 text-emerald-400" />
                Instagram: @flatpackdoctors
              </a>
              <button
                onClick={onQuoteClick}
                className="w-full mt-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs py-2.5 px-4 rounded transition-all shadow-sm"
              >
                Get a Free Quote
              </button>
            </div>
          </div>

        </div>

        {/* Footer Bottom Strip */}
        <div className="border-t border-stone-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-[11px] text-stone-500 space-y-4 md:space-y-0">
          <div>
            <p>© 2026 Flatpack Doctors. All rights reserved. Designed and developed for Prabh.</p>
          </div>
          <div className="flex space-x-6">
            <button 
              onClick={() => alert('Flatpack Doctors Privacy Policy. Fully compliant with Australian Privacy Principles (APP).')}
              className="hover:text-stone-300 transition-colors"
            >
              Privacy Policy
            </button>
            <button 
              onClick={() => alert('Flatpack Doctors Terms and Conditions. All jobs carry standard 1-year workmanship guarantee.')}
              className="hover:text-stone-300 transition-colors"
            >
              Terms & Conditions
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
