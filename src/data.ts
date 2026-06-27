import { ServiceItem, AdditionalService, Review, GalleryProject } from './types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'ikea-assembly',
    title: 'IKEA Furniture Assembly',
    description: 'Expert assembly of all IKEA ranges including Pax wardrobes, Malm beds, Hemnes, Kallax, and Billy bookcases.',
    longDescription: 'Our team is highly experienced with the unique assembly systems of IKEA furniture. From flatpack packaging to precise leveling and wall anchoring, we ensure your IKEA pieces are structurally sound and perfectly aligned.',
    iconName: 'Wrench',
    examples: ['PAX Wardrobe Systems', 'MALM & NORDLI Beds', 'HEMNES Drawers', 'BESTÅ TV Units', 'BILLY & KALLAX Shelving'],
    imagePlaceholder: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'flatpack-assembly',
    title: 'Flat-Pack Furniture Assembly',
    description: 'Assembly of major Australian retailers including Freedom, Fantastic Furniture, Temple & Webster, and Koala.',
    longDescription: 'We assemble flatpack products from all major brands and retailers. Our team understands different joining methods, hardware types, and timber materials, delivering robust results that prevent wobbling and premature wear.',
    iconName: 'Layers',
    examples: ['Freedom Furniture', 'Temple & Webster', 'Koala Beds & Sofas', 'Fantastic Furniture', 'Amart Furniture'],
    imagePlaceholder: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wardrobe-pax',
    title: 'Wardrobe & PAX Installation',
    description: 'Precision installation, leveling, and wall anchoring for heavy wardrobe systems and PAX modules.',
    longDescription: 'Large wardrobe installations require solid preparation. We assess your floors, remove skirting boards where necessary to flush the wardrobe to the wall, build and level the modules, configure all drawers and shelves, and anchor them safely.',
    iconName: 'Layout',
    examples: ['IKEA PAX Custom Builds', 'Sliding Door Wardrobes', 'Hinged Wardrobes', 'Walk-in Closet Fitouts', 'Internal Drawers & Jewelry Trays'],
    imagePlaceholder: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'bed-assembly',
    title: 'Bed Assembly',
    description: 'Secure frame setup, gas-lift mechanisms, slats positioning, and headboard anchoring for a creak-free sleep.',
    longDescription: 'A poorly assembled bed squeaks and degrades quickly. We carefully fit frame structural beams, align heavy gas-lift or drawer storage mechanisms, tension slats correctly, and anchor headboards securely to prevent frame flexing.',
    iconName: 'Bed',
    examples: ['Gas-Lift Storage Beds', 'Upholstered Bed Frames', 'Wooden & Metal Beds', 'Bunk Beds & Loft Systems', 'Bedside Tables & Headboards'],
    imagePlaceholder: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'drawers-cabinets',
    title: 'Drawer & Storage Cabinets',
    description: 'Perfect alignment of soft-close runners, hinges, handles, and level doors for a flawless finish.',
    longDescription: 'Properly operating drawers and cabinet doors rely on sub-millimeter leveling. We micro-adjust cabinet door hinges and soft-close drawer runners to ensure they sit flush and glide effortlessly without friction.',
    iconName: 'FolderKanban',
    examples: ['Sideboards & Buffets', 'Chest of Drawers', 'Filing Cabinets', 'Shoe Storage Units', 'Pantry & Kitchen Cabinets'],
    imagePlaceholder: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tv-units',
    title: 'TV Units & Storage Cabinets',
    description: 'Positioning, cable management options, component shelf leveling, and heavy storage cabinet setup.',
    longDescription: 'TV units and media consoles are the focal point of living spaces. We assemble your entertainment unit, level its shelves, arrange cabinet doors, and organize space for cabling to keep the visual clean and uncluttered.',
    iconName: 'Tv',
    examples: ['Floating TV Benches', 'Heavy Media Consoles', 'Bookcases & Display Units', 'Glass Cabinet Doors', 'Integrated Cable Outlets'],
    imagePlaceholder: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'desk-office',
    title: 'Desk & Home Office Setup',
    description: 'Single home study desks, sit-stand electric desks, heavy meeting tables, and ergonomic chair assembly.',
    longDescription: 'Your productivity relies on a sturdy work space. We assemble study desks, set up electronic standing mechanisms safely, ensure legs are rigid, and build ergonomic office seating for long-term comfort and safety.',
    iconName: 'Laptop',
    examples: ['Electric Sit-Stand Desks', 'Corner & L-Shaped Desks', 'Office Shelving Systems', 'Ergonomic Task Chairs', 'Meeting Room Tables'],
    imagePlaceholder: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'outdoor-furniture',
    title: 'Outdoor Furniture Assembly',
    description: 'Sturdy assembly of weather-resistant dining sets, lounge chairs, barbecues, and storage chests.',
    longDescription: 'Outdoor items undergo heavy exposure. We make sure heavy-duty rust-resistant bolts are completely tightened, leveling stands are adjusted for uneven decks or patios, and storage items are fully sealed from weather elements.',
    iconName: 'Sun',
    examples: ['Patio Dining Settings', 'Outdoor Lounges & Daybeds', 'Barbecue Trolleys', 'Garden Storage Boxes', 'Sunloungers & Umbrellas'],
    imagePlaceholder: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'wall-anchoring',
    title: 'Wall Fixing & Anchoring',
    description: 'Essential anti-tip safety anchoring for tall bookcases, heavy dressers, and wardrobe units.',
    longDescription: 'Preventing furniture tipping is a critical safety measure, especially for households with children or pets. We carry specialized studs detectors and use heavy-duty anchors matched perfectly to plasterboard, brick, or timber studs.',
    iconName: 'ShieldAlert',
    examples: ['PAX Anti-Tip Fixing', 'Bookcase Stud Anchoring', 'Heavy Mirror Hanging', 'Floating Shelves Wall-Mounting', 'Safety Straps Installation'],
    imagePlaceholder: 'https://images.unsplash.com/photo-1581781870027-04212e231e96?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'disassembly-reassembly',
    title: 'Disassembly & Reassembly',
    description: 'Careful deconstruction for house moves, labeling pieces, and robust re-building at your new location.',
    longDescription: 'Moving homes? Moving flatpack in one piece often damages the fragile joint housings. We carefully disassemble your furniture, secure all dowels, screws, and hardware in labeled bags, and structurally reassemble them at the destination.',
    iconName: 'RefreshCw',
    examples: ['Moving Wardrobe Deconstruction', 'Bed Frame Breakdown', 'Fragile Joint Labeling', 'Hardware Bagging & Cataloging', 'Structural Re-strengthening'],
    imagePlaceholder: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'room-preparation',
    title: 'Room Preparation',
    description: 'Ensuring correct wall clearances, temporary floor protection, and measuring flatpack transit routes.',
    longDescription: 'Large installations require adequate space to build safely without scuffing walls or floors. We protect delicate floor boards, verify assembly clearances, and plan spatial orientations prior to unboxing.',
    iconName: 'Ruler',
    examples: ['Floor Felt Protection', 'Wall Clearance Checks', 'Route & Hallway Measurements', 'Unboxing Space Layouts', 'Baseboard Inspection'],
    imagePlaceholder: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'furniture-moving',
    title: 'Furniture Moving & Positioning',
    description: 'Placement of heavy items exactly where you want them, utilizing specialized gliders to protect floors.',
    longDescription: 'We don’t just assemble and leave. Once assembled, we help lift and slide your heavy items into their exact final positions, using protective felt sliders to safeguard timber, vinyl, or carpet floors.',
    iconName: 'Move',
    examples: ['Heavy Wardrobe Placement', 'Sideboard Positioning', 'Bed Frame Sliding', 'Felt Floor Sliders Application', 'Level Adjustments After Moving'],
    imagePlaceholder: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
  }
];

export const ADDITIONAL_SERVICES_DATA: AdditionalService[] = [
  {
    id: 'prep',
    title: 'Room preparation before assembly',
    description: 'We help prepare the floor space, lay drop sheets, and inspect clearances to prevent any damage to your floors or walls.',
    iconName: 'Sparkles',
    imagePlaceholder: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80',
    examples: [
      'Lay robust thick drop sheets for floor protection',
      'Measure physical wall and ceiling clearances',
      'Establish a safe and organized assembly staging zone'
    ]
  },
  {
    id: 'skirting',
    title: 'Skirting board removal where required',
    description: 'For wardrobe installations that need to sit fully flush against walls for a built-in look.',
    iconName: 'Hammer',
    imagePlaceholder: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    examples: [
      'Careful non-destructive baseboard extraction with specialized pry-bars',
      'Scoring of paint lines to prevent drywall or paint peeling',
      'Custom precise cutouts and notches for flush modular wardrobe alignment'
    ]
  },
  {
    id: 'packaging',
    title: 'Packaging and cardboard removal',
    description: 'Optional clean-up service where we break down all cardboard boxes and bundle them for recycling/disposal.',
    iconName: 'Trash2',
    imagePlaceholder: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=800&q=80',
    examples: [
      'Compacting and flattening of thick cardboard packaging boxes',
      'Bundling and gathering of protective internal plastics',
      'Organized staging for council or commercial recycling collections'
    ]
  },
  {
    id: 'levelling',
    title: 'Floor levelling support',
    description: 'We utilize dynamic shims and specialized adjustable legs to make sure units stand completely straight on uneven floors.',
    iconName: 'Activity',
    imagePlaceholder: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=800&q=80',
    examples: [
      'Dual-axis bubble spirit level and laser-line assessment',
      'Fitting of concealed dynamic leveler pins under wardrobe frames',
      'Structural stability inserts to protect against hardwood and carpet compression'
    ]
  },
  {
    id: 'repositioning',
    title: 'Furniture repositioning',
    description: 'Moving assembled items safely across rooms or stories using protective gliders to keep flooring immaculate.',
    iconName: 'MoveUpRight',
    imagePlaceholder: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    examples: [
      'Application of non-marking heavy-duty felt slide pads',
      'Two-person balanced carry using high-load lifting straps',
      'Room-to-room transit guarantees with zero friction on hardwood floors'
    ]
  },
  {
    id: 'alignment',
    title: 'Preparing areas for wardrobes and cabinets',
    description: 'Ensuring back wall alignment is true and checking plaster corners for seamless installations.',
    iconName: 'Maximize2',
    imagePlaceholder: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    examples: [
      'Vertical plumb level assessment on rear installation walls',
      'Verification and detection of structural wall studs and layout offsets',
      'Plasterboard angle adjustments to eliminate gaps in custom alignments'
    ]
  },
  {
    id: 'wall-fixing',
    title: 'Wall fixing and anchoring where suitable',
    description: 'Finding wall studs and securing tall cabinets to eliminate any child safety risks or wobble.',
    iconName: 'ShieldCheck',
    imagePlaceholder: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    examples: [
      'Multi-sensor stud-finder scan to locate timber and metal studs',
      'High-grade heavy-duty plasterboard anchors (Hollow Wall / Molly)',
      'Direct structural mounting using steel-reinforced anti-topple brackets'
    ]
  },
  {
    id: 'disassembly',
    title: 'Disassembly and reassembly',
    description: 'Full relocations preparation — we document and label parts for a precise secondary build.',
    iconName: 'Shuffle',
    imagePlaceholder: 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?auto=format&fit=crop&w=800&q=80',
    examples: [
      'Sequential labels on structural panels and support runners',
      'Organization of screws, dowels, and cams in labelled zip-lock bags',
      'Controlled breakdown that prevents blowouts in soft MDF joints'
    ]
  },
  {
    id: 'cleanup',
    title: 'Work-area clean-up',
    description: 'Vacuuming minor wood dust, sorting hardware leftovers, and restoring the room to perfect cleanliness.',
    iconName: 'CheckCircle2',
    imagePlaceholder: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    examples: [
      'Fine MDF wood dust vacuuming around the assembly site',
      'Collation and handover of spare original hardware parts and manuals',
      'Final wipe-down and polishing of high-gloss surfaces and mirrors'
    ]
  }
];

// REVIEWS: Real-world feedback from Prabh's public Airtasker profile.
export const REVIEWS_PLACEHOLDERS: Review[] = [
  {
    id: 'rev-1',
    name: 'Harshdeep T.',
    rating: 5,
    comment: 'Amazing, quick and efficient.',
    job: 'IKEA Songesand assembly',
    verified: true
  },
  {
    id: 'rev-2',
    name: 'IIM.',
    rating: 5,
    comment: 'They installed an IKEA PAX wardrobe with great efficiency and punctuality. Their expertise was evident as they worked swiftly and skilfully, delivering an excellent result. I highly recommend them for any furniture installation.',
    job: 'IKEA PAX wardrobe installation',
    verified: true
  }
];

export interface PopularProject {
  id: string;
  title: string;
  retailer: string;
  category: string;
  image: string;
  description: string;
  duration: string;
}

export const POPULAR_PROJECTS_DATA: PopularProject[] = [
  {
    id: 'pop-1',
    title: 'IKEA PAX Wardrobe Custom Set',
    retailer: 'IKEA',
    category: 'Wardrobes',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80',
    description: 'Triple frame system with soft-close sliding doors, integrated drawers, and internal sensor LED lighting.',
    duration: 'Est: 2.5 - 3.5 hrs'
  },
  {
    id: 'pop-2',
    title: 'Koala Cushy Sofa Bed',
    retailer: 'Koala',
    category: 'Living Room',
    image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80',
    description: 'Seamless folding multi-functional living sofa converted with robust alignment of internal steel pivot tracks.',
    duration: 'Est: 1 - 1.5 hrs'
  },
  {
    id: 'pop-3',
    title: 'IKEA MALM Bed with Drawers',
    retailer: 'IKEA',
    category: 'Bedrooms',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80',
    description: 'Heavy queen-sized storage bed frame complete with 4 under-bed rolling drawers and headboard configuration.',
    duration: 'Est: 1.5 - 2 hrs'
  },
  {
    id: 'pop-4',
    title: 'Ecosa Sit-Stand Workstation',
    retailer: 'Ecosa',
    category: 'Home Office',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=600&q=80',
    description: 'Dual-motor electronic height adjustable desk built with structural stability bars and cable routing tray.',
    duration: 'Est: 1 hr'
  },
  {
    id: 'pop-5',
    title: 'Temple & Webster Dining Set',
    retailer: 'Temple & Webster',
    category: 'Dining Room',
    image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=600&q=80',
    description: 'Solid timber dining table coupled with 6 custom bouclé upholstered chairs fitted with floor protectors.',
    duration: 'Est: 2 hrs'
  },
  {
    id: 'pop-6',
    title: 'IKEA BESTÅ Media Unit',
    retailer: 'IKEA',
    category: 'Living Room',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    description: 'Wall-anchored modular TV console with high-gloss push-to-open doors and clean glass shelf leveling.',
    duration: 'Est: 1.5 - 2 hrs'
  },
  {
    id: 'pop-7',
    title: 'Fantastic Furniture Sideboard',
    retailer: 'Fantastic Furniture',
    category: 'Storage',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
    description: 'Contemporary 3-door, 3-drawer buffet table aligned with micro-adjusted soft-close cabinet door hinges.',
    duration: 'Est: 1.5 hrs'
  },
  {
    id: 'pop-8',
    title: 'Kmart Outdoor Lounge Set',
    retailer: 'Kmart',
    category: 'Outdoor',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=600&q=80',
    description: 'Weather-resistant corner lounge setup complete with a tempered glass coffee table and outdoor storage box.',
    duration: 'Est: 2 - 2.5 hrs'
  }
];

export const GALLERY_PROJECTS: GalleryProject[] = [
  {
    id: 'gal-1',
    title: 'Custom PAX Wardrobe Installation',
    category: 'wardrobes',
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    description: 'A 4-door IKEA PAX module fitted flush against walls with custom internal lighting and glass drawers.'
  },
  {
    id: 'gal-2',
    title: 'Gas-Lift Bed & Bedroom Setup',
    category: 'bedrooms',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy king-sized gas lift storage bed assembled, with micro-aligned bedside storage units.'
  },
  {
    id: 'gal-3',
    title: 'Sit-Stand Home Office Workspace',
    category: 'office',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80',
    description: 'Electric standing desk coupled with ergonomic task seating and wire-routing custom tray setup.'
  },
  {
    id: 'gal-4',
    title: 'Living Room TV Console & Shelving',
    category: 'storage',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    description: 'Triple unit wall-anchored shelving display combined with elegant lowline TV entertainment console.'
  },
  {
    id: 'gal-5',
    title: 'Patio Dining & Rattan Lounge Set',
    category: 'outdoor',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80',
    description: 'Hardwood outdoor dining table with ten matched weather-sealed seating frames assembled on deck.'
  },
  {
    id: 'gal-6',
    title: 'Baseboard Alignment & Flushing Fit',
    category: 'before-after',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    description: 'Representative space preparation: leveling heavy storage cabinets perfectly flush on a slope.'
  }
];
