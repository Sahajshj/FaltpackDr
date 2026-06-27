import { useState, ChangeEvent, FormEvent } from 'react';
import { 
  FileText, Link, MapPin, Calendar, HelpCircle, 
  Send, CheckCircle, ArrowRight, ArrowLeft, ShieldCheck, Info, Sparkles, User, Wrench, Clock, Check, PackageOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QuoteViewProps {
  initialItems?: string;
}

export default function QuoteView({ initialItems = '' }: QuoteViewProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepErrors, setStepErrors] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    suburb: '',
    preferredDate: '',
    preferredTime: '',
    furnitureBrand: '',
    productLink: '',
    itemsToAssemble: initialItems,
    numberOfItems: 1,
    roomPrepRequired: false,
    packagingRemovalRequired: false,
    skirtingBoardRemovalRequired: false,
    floorLevelingRequired: false,
    wallFixingRequired: false,
    furniturePositioningRequired: false,
    additionalNotes: '',
    preferredContact: 'phone'
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    // Clear errors when user types
    setStepErrors(null);
  };

  const handleCheckboxToggle = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
    setStepErrors(null);
  };

  // Step Validation & Navigation
  const handleNextStep = () => {
    setStepErrors(null);
    if (currentStep === 1) {
      if (!formData.fullName.trim()) {
        setStepErrors("Please tell us your name so we can address your quote.");
        return;
      }
      if (!formData.phone.trim()) {
        setStepErrors("A phone number is required so Prabh can text your flat-rate quote.");
        return;
      }
      if (!formData.suburb.trim()) {
        setStepErrors("Please specify your suburb in Victoria to calculate travel costs.");
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.itemsToAssemble.trim()) {
        setStepErrors("Please describe the items to assemble (e.g. 3-door PAX wardrobe).");
        return;
      }
    }
    
    // Proceed to next step with scroll to top of form section
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    setStepErrors(null);
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Guard: Prevent early submissions (e.g., via Enter key in input fields)
    if (currentStep < 4) {
      handleNextStep();
      return;
    }
    
    // Final validation
    if (!formData.fullName || !formData.phone || !formData.suburb) {
      setCurrentStep(1);
      setStepErrors('Name, Phone, and Suburb fields are required.');
      return;
    }
    if (!formData.itemsToAssemble) {
      setCurrentStep(2);
      setStepErrors('Please describe the items you need assembled.');
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
          type: 'quote',
          data: formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit quote request. Please try again.');
      }

      setFormSubmitted(true);
      // Reset step and state
      setCurrentStep(1);
      setFormData({
        fullName: '',
        phone: '',
        email: '',
        suburb: '',
        preferredDate: '',
        preferredTime: '',
        furnitureBrand: '',
        productLink: '',
        itemsToAssemble: '',
        numberOfItems: 1,
        roomPrepRequired: false,
        packagingRemovalRequired: false,
        skirtingBoardRemovalRequired: false,
        floorLevelingRequired: false,
        wallFixingRequired: false,
        furniturePositioningRequired: false,
        additionalNotes: '',
        preferredContact: 'phone'
      });
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get cheer message based on the step
  const getCheerMessage = () => {
    const firstName = formData.fullName.split(' ')[0] || 'there';
    switch (currentStep) {
      case 1:
        return {
          title: "Let's kick things off! 🚀",
          text: "Prabh provides custom fixed-rate pricing. Providing your contact details guarantees direct, direct contact."
        };
      case 2:
        return {
          title: `Awesome to meet you, ${firstName}! 🛠️`,
          text: "Step 1 complete! Now, share some specs about your furniture. Website links or specific brand names help us calculate the exact rate."
        };
      case 3:
        return {
          title: "You're flying through this! ⭐",
          text: "Step 2 done! Do you need extra site prep or packing removal? Checking these ensures we arrive with the correct specialized tooling."
        };
      case 4:
        return {
          title: "Almost at the finish line! 🏁",
          text: "Just select your preferred timing window and how you'd like Prabh to send you the final quote. We're ready to dispatch!"
        };
      default:
        return { title: "", text: "" };
    }
  };

  const cheer = getCheerMessage();

  const stepsMetadata = [
    { num: 1, label: "Your Info", icon: User },
    { num: 2, label: "Furniture", icon: Wrench },
    { num: 3, label: "Extras", icon: Sparkles },
    { num: 4, label: "Schedule", icon: Clock }
  ];

  return (
    <div className="pt-24 bg-stone-50 min-h-screen pb-20">
      
      {/* Quote Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 text-center">
        <span className="text-xs uppercase font-mono tracking-widest font-bold text-emerald-800 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Fast, Transparent Rates
        </span>
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-stone-900 mt-2">
          Get a Clear Quote Before You Book
        </h1>
        <p className="text-stone-500 text-sm max-w-xl mx-auto mt-4 leading-relaxed">
          Provide your specifications in our simple 4-step custom tool, and Prabh will review and deliver a fixed-rate flat quote with zero hidden charges.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Pre-submission guide checklist */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200/50 shadow-xs space-y-5">
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wide font-mono border-b border-stone-100 pb-3">
                For a Faster Quote, Please Include:
              </h3>

              <ul className="space-y-4 text-xs text-stone-700 font-medium">
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800 shrink-0 font-bold">✓</div>
                  <div>
                    <span className="font-bold text-stone-900">Product link or brand:</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">e.g. IKEA Pax 3m sliding wardrobe, Koala King Frame.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800 shrink-0 font-bold">✓</div>
                  <div>
                    <span className="font-bold text-stone-900">Clear Item Count:</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">Specify if bedside tables or extra drawers are included.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800 shrink-0 font-bold">✓</div>
                  <div>
                    <span className="font-bold text-stone-900">Your Suburb:</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">Helps Prabh pre-calculate travel and transport.</p>
                  </div>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-5 h-5 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-800 shrink-0 font-bold">✓</div>
                  <div>
                    <span className="font-bold text-stone-900">Additional requirements:</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">Room preps, floor levellings, cardboard removal, or wall-fixing.</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Extra Trust Banner */}
            <div className="bg-emerald-800 text-stone-100 p-6 rounded-2xl space-y-3 shadow-sm">
              <PackageOpen className="w-8 h-8 text-emerald-300" />
              <h4 className="text-sm font-bold text-white">Flatpack Doctors Guarantee</h4>
              <p className="text-[11px] text-emerald-100 leading-relaxed">
                Prabh delivers pristine, sturdy alignments. Once we issue a quote, the price stays fixed. No hourly creep, no unexpected surcharges.
              </p>
            </div>
          </div>

          {/* Right Column: Direct Quote Request Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-stone-200/50 shadow-md p-6 sm:p-8 md:p-10">
            
            {formSubmitted ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 space-y-6"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-800 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-100 shadow-sm">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-2xl font-extrabold text-stone-900 tracking-tight">Quote Request Submitted!</h4>
                  <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
                    Amazing! Prabh has received your specifications. A flat-rate quote is currently being calculated and will be dispatched to your selected channel shortly.
                  </p>
                </div>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 px-8 rounded-lg transition-colors shadow-sm"
                >
                  Fill Out Another Quote
                </button>
              </motion.div>
            ) : (
              <div className="space-y-8">
                
                {/* Wizard Progress Steps Indicator */}
                <div className="border-b border-stone-100 pb-6">
                  <div className="relative flex items-center justify-between w-full max-w-xl mx-auto">
                    {/* Background Progress Bar Line */}
                    <div className="absolute left-8 right-8 top-5 h-0.5 bg-stone-100 -translate-y-1/2 z-0">
                      {/* Active progress fill */}
                      <div 
                        className="h-full bg-emerald-800 transition-all duration-300"
                        style={{ 
                          width: `${((Math.min(currentStep, 4) - 1) / (stepsMetadata.length - 1)) * 100}%` 
                        }}
                      />
                    </div>

                    {/* Step Nodes */}
                    {stepsMetadata.map((step) => {
                      const StepIcon = step.icon;
                      const isCompleted = currentStep > step.num;
                      const isActive = currentStep === step.num;
                      return (
                        <div key={step.num} className="flex flex-col items-center relative z-10 w-16">
                          <div 
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${
                              isCompleted 
                                ? 'bg-emerald-800 border-emerald-800 text-white' 
                                : isActive 
                                  ? 'bg-white border-emerald-800 text-emerald-800 ring-4 ring-emerald-50 font-bold' 
                                  : 'bg-stone-50 border-stone-200 text-stone-400'
                            }`}
                          >
                            {isCompleted ? <Check className="w-5 h-5 stroke-[3px]" /> : <StepIcon className="w-4 h-4" />}
                          </div>
                          <span 
                            className={`text-[10px] mt-2 font-mono tracking-tight font-bold hidden sm:inline text-center whitespace-nowrap ${
                              isActive ? 'text-emerald-800' : isCompleted ? 'text-stone-700' : 'text-stone-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Animated Cheer / Motivation Message Box */}
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={currentStep}
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="bg-emerald-50/75 border border-emerald-100 p-4 sm:p-5 rounded-2xl space-y-1 flex items-start gap-3"
                  >
                    <div className="text-xl shrink-0 mt-0.5">✨</div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider font-mono">
                        {cheer.title}
                      </h4>
                      <p className="text-[11px] text-emerald-800 leading-relaxed font-medium mt-0.5">
                        {cheer.text}
                      </p>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Main Wizard Forms */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Validation Error Message Box */}
                  {stepErrors && (
                    <motion.div 
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl font-medium flex items-center gap-2"
                    >
                      <Info className="w-4 h-4 text-amber-700 shrink-0" />
                      <span>{stepErrors}</span>
                    </motion.div>
                  )}

                  {/* Steps Content Containers with Animation */}
                  <div className="min-h-[220px]">
                    <AnimatePresence mode="wait">
                      
                      {/* STEP 1: CLIENT PARTICULARS */}
                      {currentStep === 1 && (
                        <motion.div
                          key="step-1"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">
                                Full Name <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="fullName"
                                required
                                value={formData.fullName}
                                onChange={handleInputChange}
                                placeholder="e.g. David Thompson"
                                className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">
                                Phone Number <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="e.g. 0489 220 855"
                                className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">Email Address</label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="e.g. david@example.com"
                                className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">
                                Suburb in VIC <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="suburb"
                                required
                                value={formData.suburb}
                                onChange={handleInputChange}
                                placeholder="e.g. Richmond, VIC"
                                className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 2: FURNITURE DETAILS */}
                      {currentStep === 2 && (
                        <motion.div
                          key="step-2"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">Brand / Retailer</label>
                              <input
                                type="text"
                                name="furnitureBrand"
                                value={formData.furnitureBrand}
                                onChange={handleInputChange}
                                placeholder="e.g. IKEA, Freedom, Koala"
                                className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">Product Web Link / URL</label>
                              <input
                                type="text"
                                name="productLink"
                                value={formData.productLink}
                                onChange={handleInputChange}
                                placeholder="e.g. ikea.com/au/en/p/..."
                                className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-3">
                              <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">
                                Items to Assemble <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="itemsToAssemble"
                                required
                                value={formData.itemsToAssemble}
                                onChange={handleInputChange}
                                placeholder="e.g. 3-door PAX, MALM gas-lift frame"
                                className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">Quantity</label>
                              <input
                                type="number"
                                name="numberOfItems"
                                min={1}
                                value={formData.numberOfItems}
                                onChange={handleInputChange}
                                className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 3: ASSISTANCE CHECKBOXES */}
                      {currentStep === 3 && (
                        <motion.div
                          key="step-3"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4"
                        >
                          <p className="text-[11px] text-stone-400 font-mono uppercase tracking-wide border-b border-stone-100 pb-2">
                            Select any required support services:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700 font-semibold select-none">
                            <div 
                              onClick={() => handleCheckboxToggle('roomPrepRequired')}
                              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                formData.roomPrepRequired 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                                  : 'bg-stone-50/50 border-stone-200 hover:bg-stone-50 text-stone-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                name="roomPrepRequired"
                                checked={formData.roomPrepRequired}
                                onChange={() => {}} // handled by click container
                                className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                              />
                              <span>Room preparation support</span>
                            </div>

                            <div 
                              onClick={() => handleCheckboxToggle('packagingRemovalRequired')}
                              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                formData.packagingRemovalRequired 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                                  : 'bg-stone-50/50 border-stone-200 hover:bg-stone-50 text-stone-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                name="packagingRemovalRequired"
                                checked={formData.packagingRemovalRequired}
                                onChange={() => {}}
                                className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                              />
                              <span>Cardboard breakdown & remove</span>
                            </div>

                            <div 
                              onClick={() => handleCheckboxToggle('skirtingBoardRemovalRequired')}
                              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                formData.skirtingBoardRemovalRequired 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                                  : 'bg-stone-50/50 border-stone-200 hover:bg-stone-50 text-stone-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                name="skirtingBoardRemovalRequired"
                                checked={formData.skirtingBoardRemovalRequired}
                                onChange={() => {}}
                                className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                              />
                              <span>Skirting board cutting/removal</span>
                            </div>

                            <div 
                              onClick={() => handleCheckboxToggle('floorLevelingRequired')}
                              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                formData.floorLevelingRequired 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                                  : 'bg-stone-50/50 border-stone-200 hover:bg-stone-50 text-stone-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                name="floorLevelingRequired"
                                checked={formData.floorLevelingRequired}
                                onChange={() => {}}
                                className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                              />
                              <span>Floor leveling (slope shims)</span>
                            </div>

                            <div 
                              onClick={() => handleCheckboxToggle('wallFixingRequired')}
                              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                formData.wallFixingRequired 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                                  : 'bg-stone-50/50 border-stone-200 hover:bg-stone-50 text-stone-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                name="wallFixingRequired"
                                checked={formData.wallFixingRequired}
                                onChange={() => {}}
                                className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                              />
                              <span>Anti-tip Wall anchoring (safe studs)</span>
                            </div>

                            <div 
                              onClick={() => handleCheckboxToggle('furniturePositioningRequired')}
                              className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                                formData.furniturePositioningRequired 
                                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
                                  : 'bg-stone-50/50 border-stone-200 hover:bg-stone-50 text-stone-800'
                              }`}
                            >
                              <input
                                type="checkbox"
                                name="furniturePositioningRequired"
                                checked={formData.furniturePositioningRequired}
                                onChange={() => {}}
                                className="rounded text-emerald-800 focus:ring-emerald-700 w-4 h-4 cursor-pointer"
                              />
                              <span>Furniture sliding & position help</span>
                            </div>
                          </div>
                        </motion.div>
                      )}

                      {/* STEP 4: SCHEDULING & SPECIAL NOTES */}
                      {currentStep === 4 && (
                        <motion.div
                          key="step-4"
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">Preferred Date</label>
                              <input
                                type="date"
                                name="preferredDate"
                                value={formData.preferredDate}
                                onChange={handleInputChange}
                                className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50 transition-colors text-stone-700"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">Preferred Window</label>
                              <select
                                name="preferredTime"
                                value={formData.preferredTime}
                                onChange={handleInputChange}
                                className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50 transition-colors text-stone-700 font-semibold"
                              >
                                <option value="">Select a slot...</option>
                                <option value="morning">Morning (7:00 AM – 12:00 PM)</option>
                                <option value="afternoon">Afternoon (12:00 PM – 5:00 PM)</option>
                                <option value="any">Flexible (Any time 7 AM–5 PM)</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">Preferred Contact Channel</label>
                              <select
                                name="preferredContact"
                                value={formData.preferredContact}
                                onChange={handleInputChange}
                                className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50 transition-colors text-stone-700 font-semibold"
                              >
                                <option value="phone">Call Phone</option>
                                <option value="whatsapp">WhatsApp Direct Chat</option>
                                <option value="email">Send Email Response</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">Photo / Spec Sheet Link (Optional)</label>
                              <input
                                type="text"
                                placeholder="Link to images or catalog specs"
                                className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-stone-700 uppercase font-mono mb-1.5">Additional Notes</label>
                            <textarea
                              name="additionalNotes"
                              rows={3}
                              value={formData.additionalNotes}
                              onChange={handleInputChange}
                              placeholder="Special instructions, elevator access, parking, floor slopes, baseboards depth, etc..."
                              className="w-full text-xs p-3.5 border border-stone-200 rounded-xl focus:outline-emerald-800 bg-stone-50/50 hover:bg-stone-50"
                            />
                          </div>
                        </motion.div>
                      )}
                      
                    </AnimatePresence>
                  </div>

                  {/* Navigation Buttons Row */}
                  <div className="flex items-center justify-between pt-6 border-t border-stone-100 gap-4">
                    {currentStep > 1 ? (
                      <button
                        key="back-btn"
                        type="button"
                        onClick={handlePrevStep}
                        className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 font-bold text-xs py-3 px-5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 transition-all cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                      </button>
                    ) : (
                      <div key="empty-back" /> // empty placeholder to preserve spacing
                    )}

                    {currentStep < 4 ? (
                      <button
                        key="next-btn"
                        type="button"
                        onClick={handleNextStep}
                        className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs py-3 px-6 rounded-xl transition-all shadow-sm ml-auto cursor-pointer"
                      >
                        <span>Next Step</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        key="submit-btn"
                        type="submit"
                        disabled={isSubmitting}
                        className={`font-bold text-xs py-3 px-8 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md ml-auto ${
                          isSubmitting 
                            ? 'bg-stone-400 text-stone-200 cursor-not-allowed'
                            : 'bg-emerald-800 hover:bg-emerald-900 text-white cursor-pointer'
                        }`}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin" />
                            Submitting Quote Request...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Quote Request
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {submitError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl font-medium">
                      {submitError}
                    </div>
                  )}

                </form>
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
