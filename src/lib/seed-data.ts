/**
 * Seed Data for M/Y Azure Dreams Yacht Management Platform
 * 
 * This file contains TypeScript interfaces and initial seed data for all
 * Firestore subcollections under /vessels/default-vessel
 */

// ===== TYPE DEFINITIONS =====

export type UserRole = 'Owner' | 'Captain' | 'Crew' | 'Guest' | 'Vendor';

export type MaintenanceStatus = 'Completed' | 'In Progress' | 'Scheduled';

export type ExpenseCategory = 'Fuel' | 'Provisioning' | 'Maintenance' | 'Salaries' | 'Other';

export type ExpenseStatus = 'Approved' | 'Pending' | 'Rejected';

export type DocumentType = 'pdf' | 'doc' | 'img' | 'folder';

export type CalendarEventType = 'Maintenance' | 'Guest Trip' | 'Crew Schedule' | 'Charter' | 'Dockage' | 'Interior';

export type CrewPosition = 'Chef' | 'Deckhand' | 'Stewardess' | 'First Mate' | 'Captain' | 'Engineer';

export type JobStatus = 'Open' | 'In Progress' | 'Completed' | 'Cancelled';

export type BidStatus = 'Pending' | 'Accepted' | 'Rejected';

// ===== INTERFACES =====

export interface ItineraryStop {
  id: string;
  location: string;
  arrival: Date;
  departure: Date;
  activities: string[];
  guests: string[];
  crew: string[];
  imageUrl: string;
  imageHint: string;
}

export interface MaintenanceRecord {
  id: string;
  date: Date;
  service: string;
  vendor: string;
  cost: number;
  status: MaintenanceStatus;
  notes: string;
  rating?: number;
}

export interface Expense {
  id: string;
  date: Date;
  category: ExpenseCategory;
  description: string;
  amount: number;
  status: ExpenseStatus;
  approver?: string;
}

export interface DocumentFile {
  id: string;
  name: string;
  type: DocumentType;
  size: string;
  lastModified: Date;
  path: string;
  category: string;
  access: UserRole[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: CalendarEventType;
  description: string;
  participants: string[];
  allDay: boolean;
}

export interface GuestPreference {
  dietary: string;
  allergies: string;
  drinks: string;
  notes: string;
}

export interface CrewMember {
  id: string;
  name: string;
  position: CrewPosition;
  rate: number;
  rating: number;
  bio: string;
  imageUrl: string;
  imageHint: string;
  certifications: string[];
  availability: Array<{ start: Date; end: Date }>;
}

export interface VendorJob {
  id: string;
  title: string;
  description: string;
  vessel: string;
  budget: number;
  deadline: Date;
  status: JobStatus;
  postedDate: Date;
}

export interface VendorBid {
  id: string;
  jobId: string;
  vendorName: string;
  vendorEmail: string;
  bidAmount: number;
  proposedTimeline: string;
  message: string;
  status: BidStatus;
  submittedDate: Date;
}

// ===== SEED DATA =====

// Itinerary Seed Data - 3 Distinct Trips
export const itinerarySeedData: ItineraryStop[] = [
  {
    id: 'itinerary-001',
    location: 'Catalina Island, CA',
    arrival: new Date('2025-11-10T14:00:00'),
    departure: new Date('2025-11-13T10:00:00'),
    activities: ['Snorkeling', 'Beach BBQ', 'Casino Point Dive', 'Golf Cart Tour'],
    guests: ['Michael Thompson', 'Sarah Chen', 'David Martinez'],
    crew: ['Captain James Harrison', 'Chef Isabella Romano', 'Stewardess Emma Wilson'],
    imageUrl: '/images/catalina-island.jpg',
    imageHint: 'Beautiful Catalina Island coastline with crystal clear waters'
  },
  {
    id: 'itinerary-002',
    location: 'Santa Barbara, CA',
    arrival: new Date('2025-11-20T16:00:00'),
    departure: new Date('2025-11-23T09:00:00'),
    activities: ['Wine Tasting', 'Downtown Shopping', 'Sailing', 'Fine Dining'],
    guests: ['Jennifer Lopez', 'Robert Kim', 'Alexandra Smith'],
    crew: ['Captain James Harrison', 'Chef Isabella Romano', 'Stewardess Emma Wilson', 'Deckhand Marcus Johnson'],
    imageUrl: '/images/santa-barbara.jpg',
    imageHint: 'Santa Barbara harbor with luxury yachts and mountain backdrop'
  },
  {
    id: 'itinerary-003',
    location: 'Cabo San Lucas, Mexico',
    arrival: new Date('2025-12-15T10:00:00'),
    departure: new Date('2025-12-20T14:00:00'),
    activities: ['Deep Sea Fishing', 'El Arco Visit', 'Water Sports', 'Sunset Cruise', 'Mexican Cuisine Tour'],
    guests: ['William Anderson', 'Emily Davis', 'Thomas Brown', 'Olivia Taylor'],
    crew: ['Captain James Harrison', 'Chef Isabella Romano', 'Stewardess Emma Wilson', 'Deckhand Marcus Johnson', 'First Mate Carlos Mendez'],
    imageUrl: '/images/cabo-san-lucas.jpg',
    imageHint: 'Iconic El Arco rock formation in Cabo San Lucas at sunset'
  }
];

// Maintenance Records Seed Data - 5 Records with Varying Statuses
export const maintenanceSeedData: MaintenanceRecord[] = [
  {
    id: 'maint-001',
    date: new Date('2025-09-15'),
    service: 'Engine Overhaul - Port Engine',
    vendor: 'Pacific Marine Services',
    cost: 45000,
    status: 'Completed',
    notes: 'Complete overhaul of port engine. Replaced pistons, bearings, and seals. Performance excellent.',
    rating: 5
  },
  {
    id: 'maint-002',
    date: new Date('2025-10-05'),
    service: 'HVAC System Repair',
    vendor: 'Marine Climate Control Inc.',
    cost: 8500,
    status: 'Completed',
    notes: 'Replaced faulty compressor in main salon. System now operating at optimal efficiency.',
    rating: 4
  },
  {
    id: 'maint-003',
    date: new Date('2025-10-20'),
    service: 'Navigation System Update',
    vendor: 'NavTech Solutions',
    cost: 12000,
    status: 'In Progress',
    notes: 'Upgrading to latest Garmin system with enhanced radar and charting. Installation 70% complete.'
  },
  {
    id: 'maint-004',
    date: new Date('2025-11-08'),
    service: 'Hull Cleaning and Bottom Paint',
    vendor: 'Oceanside Yacht Services',
    cost: 18000,
    status: 'Scheduled',
    notes: 'Scheduled for haul-out. Will include full hull inspection, cleaning, and fresh antifouling paint.'
  },
  {
    id: 'maint-005',
    date: new Date('2025-11-25'),
    service: 'Annual Safety Equipment Inspection',
    vendor: 'Maritime Safety Solutions',
    cost: 3500,
    status: 'Scheduled',
    notes: 'Annual certification of all life safety equipment, fire suppression systems, and emergency gear.'
  }
];

// Wallet/Expenses Seed Data - 5 Expenses Across Different Categories
export const expensesSeedData: Expense[] = [
  {
    id: 'exp-001',
    date: new Date('2025-10-01'),
    category: 'Fuel',
    description: 'Diesel fuel - 2,500 gallons @ Marina del Rey',
    amount: 8750,
    status: 'Approved',
    approver: 'Captain James Harrison'
  },
  {
    id: 'exp-002',
    date: new Date('2025-10-15'),
    category: 'Provisioning',
    description: 'Gourmet provisions for Catalina trip - organic meats, fresh seafood, specialty wines',
    amount: 4200,
    status: 'Approved',
    approver: 'Owner Michael Thompson'
  },
  {
    id: 'exp-003',
    date: new Date('2025-10-18'),
    category: 'Maintenance',
    description: 'Emergency generator repair - replaced alternator',
    amount: 2100,
    status: 'Pending'
  },
  {
    id: 'exp-004',
    date: new Date('2025-10-22'),
    category: 'Salaries',
    description: 'October crew salaries - 5 crew members',
    amount: 28000,
    status: 'Approved',
    approver: 'Owner Michael Thompson'
  },
  {
    id: 'exp-005',
    date: new Date('2025-10-25'),
    category: 'Other',
    description: 'Marina fees and dockage - November',
    amount: 6500,
    status: 'Pending'
  }
];

// Documents Seed Data - Folder Structure with Files
export const documentsSeedData: DocumentFile[] = [
  // Safety & Compliance Folder
  {
    id: 'doc-001',
    name: 'Safety & Compliance',
    type: 'folder',
    size: '',
    lastModified: new Date('2025-10-01'),
    path: '/',
    category: 'Safety',
    access: ['Owner', 'Captain', 'Crew']
  },
  {
    id: 'doc-002',
    name: 'Safety Manual.pdf',
    type: 'pdf',
    size: '2.4 MB',
    lastModified: new Date('2025-09-15'),
    path: '/Safety & Compliance/',
    category: 'Safety',
    access: ['Owner', 'Captain', 'Crew']
  },
  {
    id: 'doc-003',
    name: 'Fire Suppression System Certificate.pdf',
    type: 'pdf',
    size: '850 KB',
    lastModified: new Date('2025-08-20'),
    path: '/Safety & Compliance/',
    category: 'Safety',
    access: ['Owner', 'Captain']
  },
  {
    id: 'doc-004',
    name: 'Coast Guard Inspection Report.pdf',
    type: 'pdf',
    size: '1.2 MB',
    lastModified: new Date('2025-07-10'),
    path: '/Safety & Compliance/',
    category: 'Safety',
    access: ['Owner', 'Captain']
  },
  // Crew Dossiers Folder
  {
    id: 'doc-005',
    name: 'Crew Dossiers',
    type: 'folder',
    size: '',
    lastModified: new Date('2025-10-10'),
    path: '/',
    category: 'Personnel',
    access: ['Owner', 'Captain']
  },
  {
    id: 'doc-006',
    name: 'Captain Harrison - Certifications.pdf',
    type: 'pdf',
    size: '1.8 MB',
    lastModified: new Date('2025-06-01'),
    path: '/Crew Dossiers/',
    category: 'Personnel',
    access: ['Owner', 'Captain']
  },
  {
    id: 'doc-007',
    name: 'Chef Romano - Resume.pdf',
    type: 'pdf',
    size: '650 KB',
    lastModified: new Date('2025-05-15'),
    path: '/Crew Dossiers/',
    category: 'Personnel',
    access: ['Owner', 'Captain']
  },
  // Insurance & Registration
  {
    id: 'doc-008',
    name: 'Insurance & Registration',
    type: 'folder',
    size: '',
    lastModified: new Date('2025-09-01'),
    path: '/',
    category: 'Legal',
    access: ['Owner', 'Captain']
  },
  {
    id: 'doc-009',
    name: 'Vessel Insurance Policy.pdf',
    type: 'pdf',
    size: '3.1 MB',
    lastModified: new Date('2025-01-15'),
    path: '/Insurance & Registration/',
    category: 'Legal',
    access: ['Owner']
  },
  {
    id: 'doc-010',
    name: 'Registration Certificate.pdf',
    type: 'pdf',
    size: '420 KB',
    lastModified: new Date('2025-01-01'),
    path: '/Insurance & Registration/',
    category: 'Legal',
    access: ['Owner', 'Captain']
  },
  // Maintenance Logs
  {
    id: 'doc-011',
    name: 'Maintenance Logs',
    type: 'folder',
    size: '',
    lastModified: new Date('2025-10-20'),
    path: '/',
    category: 'Maintenance',
    access: ['Owner', 'Captain', 'Crew']
  },
  {
    id: 'doc-012',
    name: 'Engine Service History.pdf',
    type: 'pdf',
    size: '2.7 MB',
    lastModified: new Date('2025-09-20'),
    path: '/Maintenance Logs/',
    category: 'Maintenance',
    access: ['Owner', 'Captain', 'Crew']
  }
];

// Calendar Events Seed Data - Multiple Event Types
export const calendarEventsSeedData: CalendarEvent[] = [
  {
    id: 'cal-001',
    title: 'Catalina Island Trip',
    start: new Date('2025-11-10T14:00:00'),
    end: new Date('2025-11-13T10:00:00'),
    type: 'Guest Trip',
    description: 'Weekend getaway to Catalina Island with the Thompson family',
    participants: ['Michael Thompson', 'Sarah Chen', 'David Martinez', 'Captain Harrison', 'Chef Romano', 'Stewardess Wilson'],
    allDay: false
  },
  {
    id: 'cal-002',
    title: 'Santa Barbara Charter',
    start: new Date('2025-11-20T16:00:00'),
    end: new Date('2025-11-23T09:00:00'),
    type: 'Charter',
    description: 'Charter trip to Santa Barbara - wine country tour',
    participants: ['Jennifer Lopez', 'Robert Kim', 'Alexandra Smith'],
    allDay: false
  },
  {
    id: 'cal-003',
    title: 'Hull Cleaning - Haul Out',
    start: new Date('2025-11-08T08:00:00'),
    end: new Date('2025-11-08T17:00:00'),
    type: 'Maintenance',
    description: 'Scheduled hull cleaning and bottom paint application',
    participants: ['Captain Harrison', 'Oceanside Yacht Services'],
    allDay: true
  },
  {
    id: 'cal-004',
    title: 'Cabo San Lucas Adventure',
    start: new Date('2025-12-15T10:00:00'),
    end: new Date('2025-12-20T14:00:00'),
    type: 'Guest Trip',
    description: 'Extended trip to Mexico - fishing and relaxation',
    participants: ['William Anderson', 'Emily Davis', 'Thomas Brown', 'Olivia Taylor'],
    allDay: false
  },
  {
    id: 'cal-005',
    title: 'Safety Equipment Inspection',
    start: new Date('2025-11-25T09:00:00'),
    end: new Date('2025-11-25T15:00:00'),
    type: 'Maintenance',
    description: 'Annual certification of all safety equipment',
    participants: ['Captain Harrison', 'Maritime Safety Solutions'],
    allDay: true
  },
  {
    id: 'cal-006',
    title: 'Shipyard Period - Annual Service',
    start: new Date('2026-01-05T08:00:00'),
    end: new Date('2026-01-12T17:00:00'),
    type: 'Maintenance',
    description: 'Major annual maintenance including engine service, systems check, and cosmetic updates',
    participants: ['Captain Harrison', 'First Mate Mendez'],
    allDay: true
  },
  {
    id: 'cal-007',
    title: 'Owner Day Trip - Marina del Rey',
    start: new Date('2025-11-05T10:00:00'),
    end: new Date('2025-11-05T18:00:00'),
    type: 'Guest Trip',
    description: 'Owner\'s private day cruise along the coast',
    participants: ['Michael Thompson', 'Captain Harrison', 'Chef Romano'],
    allDay: false
  },
  {
    id: 'cal-008',
    title: 'Interior Deep Clean',
    start: new Date('2025-11-14T08:00:00'),
    end: new Date('2025-11-15T17:00:00'),
    type: 'Interior',
    description: 'Complete deep cleaning and detailing of all interior spaces',
    participants: ['Stewardess Wilson', 'Interior Cleaning Crew'],
    allDay: true
  },
  {
    id: 'cal-009',
    title: 'Crew Training - Emergency Procedures',
    start: new Date('2025-11-18T13:00:00'),
    end: new Date('2025-11-18T17:00:00'),
    type: 'Crew Schedule',
    description: 'Quarterly emergency response training for all crew members',
    participants: ['Captain Harrison', 'All Crew'],
    allDay: false
  },
  {
    id: 'cal-010',
    title: 'Marina Dockage - December',
    start: new Date('2025-12-01T00:00:00'),
    end: new Date('2025-12-31T23:59:59'),
    type: 'Dockage',
    description: 'Reserved slip at Marina del Rey for December',
    participants: [],
    allDay: true
  }
];

// Guest Preferences Seed Data - 4+ Detailed Guest Profiles
export const guestPreferencesSeedData: Record<string, GuestPreference> = {
  'Michael Thompson': {
    dietary: 'Low-carb, high-protein diet. Prefers lean meats and fish.',
    allergies: 'Shellfish allergy (severe)',
    drinks: 'Macallan 18 Scotch, Opus One Cabernet, San Pellegrino sparkling water',
    notes: 'Enjoys early morning coffee service at 6 AM. Prefers gym equipment set up on deck.'
  },
  'Sarah Chen': {
    dietary: 'Vegetarian (lacto-ovo). Loves Asian fusion cuisine.',
    allergies: 'None',
    drinks: 'Veuve Clicquot Champagne, matcha lattes, fresh pressed vegetable juices',
    notes: 'Requests fresh flowers in stateroom. Prefers yoga mat setup at sunrise.'
  },
  'Jennifer Lopez': {
    dietary: 'Gluten-free, organic preferences. Mediterranean diet.',
    allergies: 'Gluten intolerance',
    drinks: 'Whispering Angel Rosé, fresh coconut water, green smoothies',
    notes: 'Likes aromatherapy in cabin - lavender essential oils. Bedtime chamomile tea service.'
  },
  'William Anderson': {
    dietary: 'No restrictions. Adventurous eater, enjoys trying new cuisines.',
    allergies: 'Peanut allergy (moderate)',
    drinks: 'Don Julio 1942 Tequila, Mexican craft beers, fresh lime margaritas',
    notes: 'Fishing enthusiast - ensure tackle is ready. Prefers spicy food options.'
  },
  'Robert Kim': {
    dietary: 'Pescatarian - fish and seafood preferred. No red meat.',
    allergies: 'Dairy sensitivity',
    drinks: 'Sapporo beer, sake (Dassai 23), oat milk lattes',
    notes: 'Early riser - requests breakfast service by 7 AM. Enjoys sushi and sashimi.'
  },
  'Alexandra Smith': {
    dietary: 'Keto diet - very low carb, high fat.',
    allergies: 'Tree nut allergy',
    drinks: 'Dry red wines (Pinot Noir), sugar-free energy drinks, black coffee',
    notes: 'Works remotely - needs strong WiFi access. Prefers quiet spaces for conference calls.'
  }
};

// Crew Marketplace Seed Data - 6 Freelance Crew Members
export const crewMembersSeedData: CrewMember[] = [
  {
    id: 'crew-001',
    name: 'Chef Marcus Dubois',
    position: 'Chef',
    rate: 650,
    rating: 4.9,
    bio: 'Award-winning yacht chef with 15 years experience. Specializes in French haute cuisine and Mediterranean flavors. Trained at Le Cordon Bleu Paris. Previously worked on M/Y Eclipse and M/Y Azzam.',
    imageUrl: '/images/crew/chef-marcus.jpg',
    imageHint: 'Professional chef in white uniform in a modern galley',
    certifications: ['STCW Basic Safety', 'Food Safety Level 3', 'Wine Sommelier'],
    availability: [
      { start: new Date('2025-11-01'), end: new Date('2025-11-30') },
      { start: new Date('2025-12-20'), end: new Date('2026-01-15') }
    ]
  },
  {
    id: 'crew-002',
    name: 'Sophia Martinez',
    position: 'Stewardess',
    rate: 450,
    rating: 4.8,
    bio: 'Experienced chief stewardess with impeccable attention to detail. 12 years in luxury yachting. Expert in fine dining service, luxury housekeeping, and guest relations. Silver service certified.',
    imageUrl: '/images/crew/sophia-martinez.jpg',
    imageHint: 'Professional stewardess in crisp white uniform',
    certifications: ['STCW Basic Safety', 'Silver Service', 'Guest Services Excellence'],
    availability: [
      { start: new Date('2025-11-15'), end: new Date('2025-12-15') }
    ]
  },
  {
    id: 'crew-003',
    name: 'Jake Thompson',
    position: 'Deckhand',
    rate: 350,
    rating: 4.7,
    bio: 'Energetic and skilled deckhand with 8 years maritime experience. Strong in tender operations, water sports instruction, and deck maintenance. PADI Divemaster and RYA Powerboat certified.',
    imageUrl: '/images/crew/jake-thompson.jpg',
    imageHint: 'Young deckhand on yacht deck with ocean in background',
    certifications: ['STCW Basic Safety', 'PADI Divemaster', 'RYA Powerboat Level 2', 'PWC Instructor'],
    availability: [
      { start: new Date('2025-11-01'), end: new Date('2025-12-31') }
    ]
  },
  {
    id: 'crew-004',
    name: 'Captain Henrik Larsen',
    position: 'Captain',
    rate: 850,
    rating: 5.0,
    bio: 'Master Mariner with 25 years commanding luxury yachts. Holds 3000GT Master license. Expertise in worldwide navigation, crew management, and owner relations. Impeccable safety record.',
    imageUrl: '/images/crew/captain-henrik.jpg',
    imageHint: 'Distinguished captain in dress whites on bridge',
    certifications: ['Master Mariner 3000GT', 'STCW Advanced', 'MCA Large Yacht', 'GMDSS'],
    availability: [
      { start: new Date('2026-01-01'), end: new Date('2026-03-31') }
    ]
  },
  {
    id: 'crew-005',
    name: 'Emma Richardson',
    position: 'First Mate',
    rate: 600,
    rating: 4.9,
    bio: 'Highly competent first officer with 10 years on superyachts. OOW 3000GT certified. Strong navigational skills, excellent with yacht systems, and experienced in crew training and watchkeeping.',
    imageUrl: '/images/crew/emma-richardson.jpg',
    imageHint: 'Professional first mate reviewing charts on bridge',
    certifications: ['OOW 3000GT', 'STCW Advanced', 'ECDIS', 'Medical Care'],
    availability: [
      { start: new Date('2025-12-01'), end: new Date('2026-02-28') }
    ]
  },
  {
    id: 'crew-006',
    name: 'Diego Santos',
    position: 'Engineer',
    rate: 700,
    rating: 4.8,
    bio: 'Chief engineer with extensive diesel and electrical systems expertise. 18 years in yachting. Specializes in MTU and CAT engines. Proactive maintenance approach minimizes downtime.',
    imageUrl: '/images/crew/diego-santos.jpg',
    imageHint: 'Engineer in engine room with tools and equipment',
    certifications: ['Chief Engineer Y3', 'STCW Advanced', 'MTU Certified', 'CAT Certified', 'Electrical Systems'],
    availability: [
      { start: new Date('2025-11-10'), end: new Date('2025-12-20') },
      { start: new Date('2026-01-05'), end: new Date('2026-02-15') }
    ]
  }
];

// Vendor Jobs Seed Data - 3 Job Opportunities
export const vendorJobsSeedData: VendorJob[] = [
  {
    id: 'job-001',
    title: 'Full Hull Repaint - Awlgrip Application',
    description: 'Complete hull repaint required for M/Y Azure Dreams (85ft motor yacht). Surface preparation, primer, and Awlgrip finish in custom navy blue. Must include waterline stripe in gold leaf. Previous Awlgrip experience required.',
    vessel: 'M/Y Azure Dreams',
    budget: 85000,
    deadline: new Date('2026-02-01'),
    status: 'Open',
    postedDate: new Date('2025-10-20')
  },
  {
    id: 'job-002',
    title: 'Teak Deck Replacement - Aft Deck Section',
    description: 'Replace weathered teak decking on aft deck (approximately 400 sq ft). Remove existing teak, prepare substrate, install new teak with modern caulking system. Premium grade teak required.',
    vessel: 'M/Y Azure Dreams',
    budget: 45000,
    deadline: new Date('2026-01-15'),
    status: 'Open',
    postedDate: new Date('2025-10-18')
  },
  {
    id: 'job-003',
    title: 'Complete Interior Soft Goods Refresh',
    description: 'Update all soft furnishings including curtains, cushions, bedding, and upholstery in main salon and master stateroom. Designer fabrics to be selected from approved samples. Custom fabrication required.',
    vessel: 'M/Y Azure Dreams',
    budget: 35000,
    deadline: new Date('2025-12-30'),
    status: 'In Progress',
    postedDate: new Date('2025-09-15')
  }
];

// Vendor Bids Seed Data - Sample Bids for Jobs
export const vendorBidsSeedData: VendorBid[] = [
  {
    id: 'bid-001',
    jobId: 'job-001',
    vendorName: 'Pacific Yacht Refinishing',
    vendorEmail: 'bids@pacificyachtrefinishing.com',
    bidAmount: 82000,
    proposedTimeline: '6 weeks - includes surface prep (2 weeks), primer (1 week), Awlgrip application (2 weeks), curing and detail (1 week)',
    message: 'We have 20+ years experience with Awlgrip applications on luxury yachts. Our team includes certified Awlgrip applicators. We can provide references from recent 80ft+ yacht projects.',
    status: 'Pending',
    submittedDate: new Date('2025-10-22')
  },
  {
    id: 'bid-002',
    jobId: 'job-001',
    vendorName: 'Elite Marine Coatings',
    vendorEmail: 'contact@elitemarinecoatings.com',
    bidAmount: 79500,
    proposedTimeline: '5 weeks - fast-track schedule available. Full warranty on workmanship and materials.',
    message: 'Premium Awlgrip specialists. We use climate-controlled spray booth ensuring perfect finish. Recent projects include M/Y Serenity and M/Y Ocean Star.',
    status: 'Pending',
    submittedDate: new Date('2025-10-23')
  },
  {
    id: 'bid-003',
    jobId: 'job-002',
    vendorName: 'Nautical Teak Works',
    vendorEmail: 'info@nauticalteakworks.com',
    bidAmount: 42000,
    proposedTimeline: '4 weeks - using premium Burmese teak with 10-year warranty',
    message: 'Specializing exclusively in yacht teak work. We source the finest teak and use modern caulking systems for longevity. Can provide multiple yacht references.',
    status: 'Pending',
    submittedDate: new Date('2025-10-21')
  },
  {
    id: 'bid-004',
    jobId: 'job-003',
    vendorName: 'Luxury Yacht Interiors',
    vendorEmail: 'design@luxuryyachtinteriors.com',
    bidAmount: 33500,
    proposedTimeline: 'Designer consultation (1 week), fabric selection and ordering (2 weeks), custom fabrication (3 weeks), installation (1 week)',
    message: 'Award-winning yacht interior specialists. We work with top fabric houses including Loro Piana and Hermès. Our team includes experienced marine upholsterers.',
    status: 'Accepted',
    submittedDate: new Date('2025-09-18')
  }
];

// Helper function to convert seed data for Firestore (converts Dates to timestamps)
export const prepareSeedDataForFirestore = <T>(data: T[]): any[] => {
  return data.map(item => {
    const firestoreItem: any = {};
    for (const [key, value] of Object.entries(item as any)) {
      if (value instanceof Date) {
        firestoreItem[key] = value;
      } else if (Array.isArray(value)) {
        firestoreItem[key] = value.map(v => 
          v instanceof Date ? v : 
          typeof v === 'object' && v !== null ? prepareSeedDataForFirestore([v])[0] : v
        );
      } else {
        firestoreItem[key] = value;
      }
    }
    return firestoreItem;
  });
};
