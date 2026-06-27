import { useState, ChangeEvent, FormEvent } from 'react';
import { Phone, MessageSquare, Clock, MapPin, Instagram, Mail, Send, CheckCircle } from 'lucide-react';
import { Page } from '../types';

interface ContactViewProps {
  onQuoteClick: () => void;
}

export default function ContactView({ onQuoteClick }: ContactViewProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    suburb: '',
    message: ''
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please fill out your Name and Phone Number.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'contact',
          data: formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to dispatch message. Please try again.');
      }

      setFormSubmitted(true);
      // Clear state
      setFormData({ name: '', phone: '', email: '', suburb: '', message: '' });
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-24 bg-stone-50 min-h-screen pb-20">
      
      {/* Contact Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 text-center">
        <span className="text-xs uppercase font-mono tracking-widest font-bold text-emerald-800">
          Get in Touch With Us
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900 mt-2">
          Contact Flatpack Doctors
        </h1>
        <p className="text-stone-500 text-sm max-w-xl mx-auto mt-4 leading-relaxed">
          Need a quick quotation, scheduling verification, or help preparing a wardrobe installation? Speak directly with Prabh or submit details below.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Direct info rails */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-stone-200/50 shadow-sm space-y-6">
              <h3 className="text-lg font-bold text-stone-900 tracking-tight border-b border-stone-100 pb-4">
                Operational Channels
              </h3>

              <div className="space-y-4">
                {/* Phone Card */}
                <a 
                  href="tel:0489220855"
                  className="flex items-start gap-4 p-3 hover:bg-stone-50 rounded-xl transition-all border border-transparent hover:border-stone-100 group"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-all">
                    <Phone className="w-5 h-5 text-emerald-800 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide font-mono">
                      Call Prabh
                    </h4>
                    <p className="text-base font-bold text-stone-950 mt-0.5">0489 220 855</p>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5">Direct Voice / Mobile line</p>
                  </div>
                </a>

                {/* WhatsApp Card */}
                <a 
                  href="https://wa.me/61489220855"
                  target="_blank"
                  rel="noreferrer referrer"
                  className="flex items-start gap-4 p-3 hover:bg-stone-50 rounded-xl transition-all border border-transparent hover:border-stone-100 group"
                >
                  <div className="w-10 h-10 bg-[#25D366]/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-[#25D366] transition-all">
                    <MessageSquare className="w-5 h-5 text-[#25D366] group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide font-mono">
                      WhatsApp Message
                    </h4>
                    <p className="text-base font-bold text-stone-950 mt-0.5">0489 220 855</p>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5">Instant chat & links upload</p>
                  </div>
                </a>

                {/* Email Card */}
                <a 
                  href="mailto:flatpackdoctors.au@gmail.com"
                  className="flex items-start gap-4 p-3 hover:bg-stone-50 rounded-xl transition-all border border-transparent hover:border-stone-100 group"
                >
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-emerald-800 group-hover:text-white transition-all">
                    <Mail className="w-5 h-5 text-emerald-800 group-hover:text-white" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide font-mono">
                      Email Us
                    </h4>
                    <p className="text-base font-bold text-stone-950 mt-0.5 break-all">flatpackdoctors.au@gmail.com</p>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5">Booking & document inquiries</p>
                  </div>
                </a>

                {/* Hours Card */}
                <div className="flex items-start gap-4 p-3">
                  <div className="w-10 h-10 bg-stone-50 rounded-lg flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-stone-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide font-mono">
                      Operational Hours
                    </h4>
                    <p className="text-sm font-semibold text-stone-900 mt-0.5">7:00 AM – 5:00 PM</p>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5">Open Monday to Sunday, VIC</p>
                  </div>
                </div>

                {/* Address Card */}
                <div className="flex items-start gap-4 p-3">
                  <div className="w-10 h-10 bg-stone-50 rounded-lg flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-stone-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-500 uppercase tracking-wide font-mono">
                      HQ Address
                    </h4>
                    <p className="text-sm font-semibold text-stone-900 mt-0.5">467 Evans Rd, Victoria</p>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5">Headquarters & Fleet Departs</p>
                  </div>
                </div>
              </div>

              {/* Service Area Statement Banner */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-xs text-emerald-900 leading-relaxed">
                <strong>Serving Customers Across Victoria:</strong> Our mobile installation crew regularly travels to all suburbs, apartments, home estates, and regional centers in Victoria.
              </div>
            </div>

            {/* Map Placeholder container */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200/50 shadow-sm space-y-3">
              <h4 className="text-[10px] uppercase font-mono tracking-wider font-bold text-stone-400">
                Service Map Location
              </h4>
              <div className="aspect-[16/9] w-full bg-stone-100 rounded-xl overflow-hidden relative flex items-center justify-center border border-stone-200">
                {/* Visual grid representing streets */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
                {/* Simulated routes */}
                <div className="absolute w-[200px] h-0.5 bg-emerald-600/30 rotate-12 top-10 left-4" />
                <div className="absolute w-[150px] h-0.5 bg-emerald-600/30 -rotate-45 bottom-8 right-6" />
                
                <div className="z-10 text-center space-y-1.5 p-4">
                  <MapPin className="w-8 h-8 text-emerald-800 mx-auto animate-bounce" />
                  <p className="text-[11px] font-bold text-stone-800">467 Evans Rd, Victoria</p>
                  <p className="text-[10px] text-stone-400 font-mono">Mobile dispatch area highlighted</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct contact fallback form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-stone-200/50 shadow-sm">
            <h3 className="text-lg font-bold text-stone-900 tracking-tight border-b border-stone-100 pb-4 mb-6">
              Alternative Message Dispatch
            </h3>

            {formSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle className="w-12 h-12 text-emerald-800 mx-auto" />
                <h4 className="text-lg font-bold text-stone-900">Message Submitted Successfully</h4>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  Thank you! Prabh and the flatpack team will review your message details and respond within 1 hour.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs py-2 px-4 rounded"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase font-mono mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full text-xs p-3 border border-stone-200 rounded-lg focus:outline-emerald-800 bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase font-mono mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="e.g. 0489 220 855"
                      className="w-full text-xs p-3 border border-stone-200 rounded-lg focus:outline-emerald-800 bg-stone-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase font-mono mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="e.g. sarah@example.com"
                      className="w-full text-xs p-3 border border-stone-200 rounded-lg focus:outline-emerald-800 bg-stone-50"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-700 uppercase font-mono mb-1">
                      Your Suburb
                    </label>
                    <input
                      type="text"
                      name="suburb"
                      value={formData.suburb}
                      onChange={handleInputChange}
                      placeholder="e.g. Toorak, VIC"
                      className="w-full text-xs p-3 border border-stone-200 rounded-lg focus:outline-emerald-800 bg-stone-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 uppercase font-mono mb-1">
                    Your Requirements / Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us what items you need assembled, links, product codes, or other special requests..."
                    className="w-full text-xs p-3 border border-stone-200 rounded-lg focus:outline-emerald-800 bg-stone-50"
                  />
                </div>

                {submitError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg font-medium">
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow ${
                    isSubmitting 
                      ? 'bg-stone-400 text-stone-200 cursor-not-allowed'
                      : 'bg-emerald-800 hover:bg-emerald-900 text-white'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin" />
                      Dispatching Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Dispatch Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
