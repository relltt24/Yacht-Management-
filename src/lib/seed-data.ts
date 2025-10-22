/**
 * Firebase Seed Data for M/Y Azure Dreams
 * 
 * This file contains TypeScript interfaces and initial seed data for all
 * subcollections under /vessels/default-vessel
 */

// ============================================================================
// Type Definitions
// ============================================================================

export type UserRole = 'Owner' | 'Captain' | 'Crew' | 'Guest' | 'Vendor';

export type MaintenanceStatus = 'Completed' | 'In Progress' | 'Scheduled';

export type ExpenseCategory = 'Fuel' | 'Provisioning' | 'Maintenance' | 'Salaries' | 'Other';

export type ExpenseStatus = 'Approved' | 'Pending' | 'Rejected';

export type DocumentType = 'pdf' | 'doc' | 'img' | 'folder';

export type EventType = 'Maintenance' | 'Guest Trip' | 'Crew Schedule' | 'Charter' | 'Dockage' | 'Interior';

export type CrewPosition = 'Chef' | 'Deckhand' | 'Stewardess' | 'First Mate';

export type JobStatus = 'Open' | 'In Progress' | 'Completed';

export type BidStatus = 'Submitted' | 'Accepted' | 'Rejected';

// ============================================================================
// Interface Definitions
// ============================================================================

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
  type: EventType;
  description: string;
  participants: string[];
  allDay: boolean;
}

export interface GuestPreference {
  id: string;
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
  requirements: string[];
  postedDate: Date;
}

export interface VendorBid {
  id: string;
  jobId: string;
  vendorName: string;
  vendorCompany: string;
  bidAmount: number;
  proposedTimeline: string;
  proposal: string;
  submittedDate: Date;
  status: BidStatus;
}

// ============================================================================
// Seed Data - Itinerary
// ============================================================================

export const itinerarySeedData: ItineraryStop[] = [
  {
    id: 'itin-001',
    location: 'Catalina Island, CA',
    arrival: new Date('2025-11-15T10:00:00'),
    departure: new Date('2025-11-18T14:00:00'),
    activities: [
      'Snorkeling at Lovers Cove',
      'Golf cart tour of Avalon',
      'Casino Point dive',
      'Sunset dinner at Descanso Beach',
      'Glass bottom boat tour'
    ],
    guests: ['John Anderson', 'Sarah Anderson', 'Emily Chen', 'Michael Roberts'],
    crew: ['Captain James Miller', 'Chef Isabella Martinez', 'Stewardess Sophie Laurent', 'Deckhand Marcus Thompson'],
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19',
    imageHint: 'Catalina Island harbor with yachts and clear blue water'
  },
  {
    id: 'itin-002',
    location: 'Santa Barbara, CA',
    arrival: new Date('2025-11-20T09:00:00'),
    departure: new Date('2025-11-22T16:00:00'),
    activities: [
      'Wine tasting in Santa Ynez Valley',
      'Downtown State Street shopping',
      'Beach volleyball at East Beach',
      'Visit Santa Barbara Mission',
      'Sunset cruise along the coast'
    ],
    guests: ['Robert Williams', 'Jennifer Williams', 'David Kim', 'Lisa Thompson'],
    crew: ['Captain James Miller', 'Chef Isabella Martinez', 'Deckhand Marcus Thompson', 'First Mate Alex Rivera'],
    imageUrl: 'https://images.unsplash.com/photo-1580837119756-563d608dd119',
    imageHint: 'Santa Barbara coastline with palm trees and mountains'
  },
  {
    id: 'itin-003',
    location: 'Cabo San Lucas, Mexico',
    arrival: new Date('2025-12-05T11:00:00'),
    departure: new Date('2025-12-12T10:00:00'),
    activities: [
      'Deep sea fishing expedition',
      'Land\'s End arch tour',
      'Scuba diving at Pelican Rock',
      'Sunset dinner at Flora Farms',
      'Golf at Cabo del Sol',
      'Beach club day at Medano Beach',
      'Whale watching excursion'
    ],
    guests: ['Thomas Anderson', 'Patricia Anderson', 'James Mitchell', 'Maria Garcia', 'Emily Chen', 'Michael Roberts'],
    crew: ['Captain James Miller', 'Chef Isabella Martinez', 'Stewardess Sophie Laurent', 'Deckhand Marcus Thompson', 'First Mate Alex Rivera'],
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
    imageHint: 'Cabo San Lucas arch rock formation with yacht'
  },
  {
    id: 'itin-004',
    location: 'Marina del Rey, CA',
    arrival: new Date('2026-01-10T08:00:00'),
    departure: new Date('2026-01-12T15:00:00'),
    activities: [
      'Venice Beach boardwalk visit',
      'Shopping at Abbot Kinney',
      'Dinner at The Waterside',
      'Marina night cruise'
    ],
    guests: ['Sarah Anderson', 'Emily Chen'],
    crew: ['Captain James Miller', 'Stewardess Sophie Laurent', 'Deckhand Marcus Thompson'],
    imageUrl: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
    imageHint: 'Marina del Rey harbor with boats at sunset'
  }
];

// ============================================================================
// Seed Data - Maintenance Records
// ============================================================================

export const maintenanceSeedData: MaintenanceRecord[] = [
  {
    id: 'maint-001',
    date: new Date('2025-09-15'),
    service: 'Engine Overhaul - Port & Starboard',
    vendor: 'Pacific Marine Services',
    cost: 45000,
    status: 'Completed',
    notes: 'Complete overhaul of both main engines. Replaced pistons, valves, and gaskets. Engines running smoothly at optimal performance.',
    rating: 5
  },
  {
    id: 'maint-002',
    date: new Date('2025-10-03'),
    service: 'HVAC System Repair - Main Salon',
    vendor: 'Marine Climate Control Inc.',
    cost: 8500,
    status: 'Completed',
    notes: 'Replaced faulty compressor and refrigerant lines. System cooling efficiently. Recommend annual inspection.',
    rating: 4
  },
  {
    id: 'maint-003',
    date: new Date('2025-10-20'),
    service: 'Navigation System Software Update',
    vendor: 'NavTech Marine Electronics',
    cost: 2400,
    status: 'Completed',
    notes: 'Updated chart plotter software to latest version. Integrated new weather overlay features. Crew training provided.',
    rating: 5
  },
  {
    id: 'maint-004',
    date: new Date('2025-11-05'),
    service: 'Hull Inspection & Anti-fouling Paint',
    vendor: 'Coastal Yacht Services',
    cost: 12000,
    status: 'In Progress',
    notes: 'Yacht currently in dry dock. Hull inspection revealed minor osmosis bubbles being treated. Anti-fouling application scheduled for completion by Nov 10.',
    rating: undefined
  },
  {
    id: 'maint-005',
    date: new Date('2025-11-25'),
    service: 'Annual Safety Equipment Certification',
    vendor: 'SafeSea Maritime Safety',
    cost: 3200,
    status: 'Scheduled',
    notes: 'Annual inspection of life rafts, EPIRBs, fire extinguishers, and flares. Includes recertification and replacement of expired items.',
    rating: undefined
  }
];

// ============================================================================
// Seed Data - Expenses
// ============================================================================

export const expenseSeedData: Expense[] = [
  {
    id: 'exp-001',
    date: new Date('2025-10-15'),
    category: 'Fuel',
    description: 'Marine diesel fuel - 2,500 gallons',
    amount: 8750,
    status: 'Approved',
    approver: 'Captain James Miller'
  },
  {
    id: 'exp-002',
    date: new Date('2025-10-18'),
    category: 'Provisioning',
    description: 'Gourmet provisions for upcoming charter - includes Wagyu beef, fresh seafood, premium wines',
    amount: 4200,
    status: 'Approved',
    approver: 'Owner - John Anderson'
  },
  {
    id: 'exp-003',
    date: new Date('2025-10-22'),
    category: 'Maintenance',
    description: 'Emergency bilge pump replacement',
    amount: 1850,
    status: 'Approved',
    approver: 'Captain James Miller'
  },
  {
    id: 'exp-004',
    date: new Date('2025-10-25'),
    category: 'Salaries',
    description: 'October crew salaries and bonuses',
    amount: 28000,
    status: 'Pending',
    approver: undefined
  },
  {
    id: 'exp-005',
    date: new Date('2025-10-28'),
    category: 'Other',
    description: 'Dockage fees - Marina del Rey (November)',
    amount: 6500,
    status: 'Pending',
    approver: undefined
  }
];

// ============================================================================
// Seed Data - Documents
// ============================================================================

export const documentsSeedData: DocumentFile[] = [
  // Safety & Compliance Folder
  {
    id: 'doc-001',
    name: 'Safety & Compliance',
    type: 'folder',
    size: '-',
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
    name: 'Coast Guard Certificate.pdf',
    type: 'pdf',
    size: '486 KB',
    lastModified: new Date('2025-08-20'),
    path: '/Safety & Compliance/',
    category: 'Certification',
    access: ['Owner', 'Captain']
  },
  {
    id: 'doc-004',
    name: 'Fire Suppression System Inspection.pdf',
    type: 'pdf',
    size: '1.1 MB',
    lastModified: new Date('2025-09-30'),
    path: '/Safety & Compliance/',
    category: 'Inspection',
    access: ['Owner', 'Captain', 'Crew']
  },
  
  // Crew Dossiers Folder
  {
    id: 'doc-005',
    name: 'Crew Dossiers',
    type: 'folder',
    size: '-',
    lastModified: new Date('2025-10-05'),
    path: '/',
    category: 'Personnel',
    access: ['Owner', 'Captain']
  },
  {
    id: 'doc-006',
    name: 'Captain Miller - Certifications.pdf',
    type: 'pdf',
    size: '3.2 MB',
    lastModified: new Date('2025-09-10'),
    path: '/Crew Dossiers/',
    category: 'Certification',
    access: ['Owner', 'Captain']
  },
  {
    id: 'doc-007',
    name: 'Chef Martinez - Resume.pdf',
    type: 'pdf',
    size: '890 KB',
    lastModified: new Date('2025-08-15'),
    path: '/Crew Dossiers/',
    category: 'Personnel',
    access: ['Owner', 'Captain']
  },
  {
    id: 'doc-008',
    name: 'Crew Medical Certificates.pdf',
    type: 'pdf',
    size: '2.8 MB',
    lastModified: new Date('2025-09-25'),
    path: '/Crew Dossiers/',
    category: 'Medical',
    access: ['Owner', 'Captain']
  },
  
  // Insurance & Registration
  {
    id: 'doc-009',
    name: 'Insurance & Registration',
    type: 'folder',
    size: '-',
    lastModified: new Date('2025-10-10'),
    path: '/',
    category: 'Legal',
    access: ['Owner', 'Captain']
  },
  {
    id: 'doc-010',
    name: 'Yacht Insurance Policy 2025.pdf',
    type: 'pdf',
    size: '4.5 MB',
    lastModified: new Date('2025-01-15'),
    path: '/Insurance & Registration/',
    category: 'Insurance',
    access: ['Owner', 'Captain']
  },
  {
    id: 'doc-011',
    name: 'Vessel Registration.pdf',
    type: 'pdf',
    size: '650 KB',
    lastModified: new Date('2024-12-10'),
    path: '/Insurance & Registration/',
    category: 'Registration',
    access: ['Owner', 'Captain']
  },
  
  // Maintenance Records
  {
    id: 'doc-012',
    name: 'Maintenance Records',
    type: 'folder',
    size: '-',
    lastModified: new Date('2025-10-20'),
    path: '/',
    category: 'Maintenance',
    access: ['Owner', 'Captain', 'Crew']
  },
  {
    id: 'doc-013',
    name: 'Engine Service History.pdf',
    type: 'pdf',
    size: '5.2 MB',
    lastModified: new Date('2025-09-15'),
    path: '/Maintenance Records/',
    category: 'Maintenance',
    access: ['Owner', 'Captain', 'Crew']
  },
  {
    id: 'doc-014',
    name: 'Annual Survey Report 2025.pdf',
    type: 'pdf',
    size: '8.7 MB',
    lastModified: new Date('2025-03-20'),
    path: '/Maintenance Records/',
    category: 'Inspection',
    access: ['Owner', 'Captain']
  }
];

// ============================================================================
// Seed Data - Calendar Events
// ============================================================================

export const calendarEventsSeedData: CalendarEvent[] = [
  // Events from itinerary
  {
    id: 'cal-001',
    title: 'Catalina Island Charter',
    start: new Date('2025-11-15T10:00:00'),
    end: new Date('2025-11-18T14:00:00'),
    type: 'Guest Trip',
    description: 'Private charter to Catalina Island with the Anderson family and guests. Includes snorkeling, dining, and island tours.',
    participants: ['John Anderson', 'Sarah Anderson', 'Emily Chen', 'Michael Roberts', 'Captain James Miller', 'Chef Isabella Martinez'],
    allDay: false
  },
  {
    id: 'cal-002',
    title: 'Santa Barbara Weekend',
    start: new Date('2025-11-20T09:00:00'),
    end: new Date('2025-11-22T16:00:00'),
    type: 'Guest Trip',
    description: 'Weekend trip to Santa Barbara featuring wine country excursion and coastal activities.',
    participants: ['Robert Williams', 'Jennifer Williams', 'David Kim', 'Lisa Thompson', 'Captain James Miller'],
    allDay: false
  },
  {
    id: 'cal-003',
    title: 'Cabo San Lucas Extended Charter',
    start: new Date('2025-12-05T11:00:00'),
    end: new Date('2025-12-12T10:00:00'),
    type: 'Charter',
    description: 'Week-long charter in Cabo with fishing, diving, and luxury amenities. Full crew on board.',
    participants: ['Thomas Anderson', 'Patricia Anderson', 'James Mitchell', 'Maria Garcia', 'Full Crew'],
    allDay: false
  },
  
  // Events from maintenance
  {
    id: 'cal-004',
    title: 'Hull Inspection & Anti-fouling',
    start: new Date('2025-11-05T08:00:00'),
    end: new Date('2025-11-10T17:00:00'),
    type: 'Maintenance',
    description: 'Yacht in dry dock for hull inspection and anti-fouling paint application by Coastal Yacht Services.',
    participants: ['Captain James Miller', 'Coastal Yacht Services'],
    allDay: true
  },
  {
    id: 'cal-005',
    title: 'Annual Safety Certification',
    start: new Date('2025-11-25T09:00:00'),
    end: new Date('2025-11-25T15:00:00'),
    type: 'Maintenance',
    description: 'Annual safety equipment inspection and certification. Life rafts, EPIRBs, fire equipment.',
    participants: ['Captain James Miller', 'SafeSea Maritime Safety'],
    allDay: false
  },
  
  // Unique calendar events
  {
    id: 'cal-006',
    title: 'Shipyard Period',
    start: new Date('2026-02-01T00:00:00'),
    end: new Date('2026-02-28T23:59:59'),
    type: 'Maintenance',
    description: 'Extended shipyard period for major refit and upgrades. Yacht out of service.',
    participants: ['Captain James Miller', 'Owner - John Anderson'],
    allDay: true
  },
  {
    id: 'cal-007',
    title: 'Owner Day Trip - Newport Beach',
    start: new Date('2025-11-28T10:00:00'),
    end: new Date('2025-11-28T18:00:00'),
    type: 'Guest Trip',
    description: 'Private day trip for owner to Newport Beach for business meetings and leisure.',
    participants: ['John Anderson', 'Sarah Anderson', 'Captain James Miller', 'Stewardess Sophie Laurent'],
    allDay: false
  },
  {
    id: 'cal-008',
    title: 'Interior Deep Clean',
    start: new Date('2025-12-15T08:00:00'),
    end: new Date('2025-12-17T17:00:00'),
    type: 'Interior',
    description: 'Comprehensive deep cleaning of all interior spaces, upholstery, and surfaces.',
    participants: ['Stewardess Sophie Laurent', 'Professional Cleaning Crew'],
    allDay: true
  },
  {
    id: 'cal-009',
    title: 'Crew Training - Safety Drills',
    start: new Date('2025-11-30T14:00:00'),
    end: new Date('2025-11-30T17:00:00'),
    type: 'Crew Schedule',
    description: 'Mandatory crew training for emergency procedures, fire drills, and man overboard scenarios.',
    participants: ['Captain James Miller', 'All Crew Members'],
    allDay: false
  },
  {
    id: 'cal-010',
    title: 'New Year\'s Eve Charter',
    start: new Date('2025-12-31T18:00:00'),
    end: new Date('2026-01-01T02:00:00'),
    type: 'Charter',
    description: 'Exclusive New Year\'s Eve celebration charter with fireworks viewing and gala dinner.',
    participants: ['Multiple Guests', 'Full Crew'],
    allDay: false
  },
  {
    id: 'cal-011',
    title: 'Monthly Dockage Fee Due',
    start: new Date('2025-12-01T00:00:00'),
    end: new Date('2025-12-01T23:59:59'),
    type: 'Dockage',
    description: 'December dockage fee payment due for Marina del Rey slip.',
    participants: ['Captain James Miller'],
    allDay: true
  }
];

// ============================================================================
// Seed Data - Guest Preferences
// ============================================================================

export const guestPreferencesSeedData: GuestPreference[] = [
  {
    id: 'John Anderson',
    dietary: 'No restrictions, enjoys fine dining and seafood',
    allergies: 'None',
    drinks: 'Prefers single malt Scotch (Macallan 18), aged red wines (Bordeaux), fresh-squeezed orange juice',
    notes: 'Enjoys early morning coffee on deck. Prefers room temperature of 68°F. Likes classical music during dinner.'
  },
  {
    id: 'Sarah Anderson',
    dietary: 'Vegetarian, prefers organic produce',
    allergies: 'Shellfish allergy (severe)',
    drinks: 'Champagne (Veuve Clicquot), white wine (Sauvignon Blanc), green tea',
    notes: 'Yoga mat in cabin. Prefers light breakfast with fresh fruit. Enjoys aromatherapy - lavender scent.'
  },
  {
    id: 'Emily Chen',
    dietary: 'Gluten-free, pescatarian',
    allergies: 'Gluten, tree nuts (almonds, walnuts)',
    drinks: 'Vodka martini (extra dry), Prosecco, sparkling water with lime',
    notes: 'Early riser - coffee ready by 6 AM. Prefers cold cabin temperature. Enjoys morning swims.'
  },
  {
    id: 'Michael Roberts',
    dietary: 'Keto diet, high protein',
    allergies: 'Lactose intolerant',
    drinks: 'Bourbon (Woodford Reserve), craft beer (IPAs), protein shakes',
    notes: 'Gym equipment requested. Prefers late breakfast around 10 AM. Enjoys fishing - bring gear.'
  },
  {
    id: 'Thomas Anderson',
    dietary: 'No restrictions, adventurous eater',
    allergies: 'Bee sting allergy - EpiPen required on board',
    drinks: 'Tequila (Clase Azul), Mexican beer, fresh coconut water',
    notes: 'Enjoys water sports. Prefers casual dining. Likes background jazz music.'
  },
  {
    id: 'Robert Williams',
    dietary: 'Low sodium diet',
    allergies: 'Peanuts',
    drinks: 'Gin and tonic, light beer, herbal teas',
    notes: 'Medical condition requires low-sodium meals. Prefers quiet environment. Early bedtime (9 PM).'
  }
];

// ============================================================================
// Seed Data - Crew Members
// ============================================================================

export const crewMembersSeedData: CrewMember[] = [
  {
    id: 'crew-001',
    name: 'Chef Isabella Martinez',
    position: 'Chef',
    rate: 650,
    rating: 5,
    bio: 'Award-winning yacht chef with 12 years of experience on luxury vessels. Specializes in Mediterranean and Asian fusion cuisine. Trained at Le Cordon Bleu Paris. Has cooked for celebrities and royal families. Expert in dietary accommodations and wine pairing.',
    imageUrl: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548',
    imageHint: 'Professional female chef in white uniform in yacht galley',
    certifications: ['Le Cordon Bleu Diploma', 'STCW Basic Safety', 'Food Safety Level 3', 'Wine Sommelier Certificate'],
    availability: [
      { start: new Date('2025-11-01'), end: new Date('2025-11-30') },
      { start: new Date('2025-12-15'), end: new Date('2026-01-15') }
    ]
  },
  {
    id: 'crew-002',
    name: 'Deckhand Marcus Thompson',
    position: 'Deckhand',
    rate: 350,
    rating: 4.5,
    bio: 'Experienced deckhand with strong maritime skills and 8 years on superyachts. Certified diver and water sports instructor. Mechanical background with expertise in tender operations. Known for positive attitude and strong work ethic.',
    imageUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857',
    imageHint: 'Young male deckhand on yacht deck with ocean background',
    certifications: ['STCW Basic Safety', 'PWC Instructor', 'PADI Divemaster', 'RYA Powerboat Level 2'],
    availability: [
      { start: new Date('2025-11-10'), end: new Date('2025-12-20') },
      { start: new Date('2026-01-05'), end: new Date('2026-02-28') }
    ]
  },
  {
    id: 'crew-003',
    name: 'Stewardess Sophie Laurent',
    position: 'Stewardess',
    rate: 450,
    rating: 5,
    bio: 'Highly skilled chief stewardess with luxury hospitality background. 10 years experience on yachts up to 200ft. Fluent in English, French, and Italian. Expert in silver service, flower arranging, and guest relations. Previously worked at 5-star hotels.',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956',
    imageHint: 'Professional stewardess in white uniform with blonde hair',
    certifications: ['STCW Basic Safety', 'Interior Crew Training', 'Wine Service Certificate', 'First Aid Certified'],
    availability: [
      { start: new Date('2025-11-01'), end: new Date('2025-12-31') },
      { start: new Date('2026-02-01'), end: new Date('2026-03-31') }
    ]
  },
  {
    id: 'crew-004',
    name: 'First Mate Alex Rivera',
    position: 'First Mate',
    rate: 550,
    rating: 4.5,
    bio: 'Experienced first mate with 15 years at sea. Navigation expert with extensive Pacific Coast knowledge. Strong leadership and crew management skills. Licensed captain working toward master\'s certification. Mechanical engineering background.',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    imageHint: 'Professional male officer in maritime uniform',
    certifications: ['USCG 100 Ton Master', 'STCW Advanced', 'Radar/ARPA Certification', 'Marine Engineering'],
    availability: [
      { start: new Date('2025-11-15'), end: new Date('2025-12-15') },
      { start: new Date('2026-01-10'), end: new Date('2026-02-10') }
    ]
  },
  {
    id: 'crew-005',
    name: 'Chef Antonio Rossi',
    position: 'Chef',
    rate: 700,
    rating: 4,
    bio: 'Italian chef specializing in authentic Mediterranean cuisine. 10 years experience on private yachts in the Mediterranean and Caribbean. Known for fresh pasta, seafood dishes, and creative presentations. Speaks Italian, English, and Spanish.',
    imageUrl: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c',
    imageHint: 'Male chef with dark hair preparing food in luxury kitchen',
    certifications: ['Italian Culinary Institute', 'STCW Basic Safety', 'Food Hygiene Level 3', 'Pastry Specialist'],
    availability: [
      { start: new Date('2025-12-01'), end: new Date('2026-01-31') }
    ]
  },
  {
    id: 'crew-006',
    name: 'Deckhand Emma Wilson',
    position: 'Deckhand',
    rate: 380,
    rating: 4.5,
    bio: 'Energetic and detail-oriented deckhand with 5 years yacht experience. Background in marine biology. Excellent with water sports and guest activities. Certified yoga instructor offering wellness sessions. Strong teamwork and communication skills.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
    imageHint: 'Young female crew member with brown hair smiling outdoors',
    certifications: ['STCW Basic Safety', 'RYA Powerboat Level 2', 'PADI Open Water', 'Yoga Instructor 200hr'],
    availability: [
      { start: new Date('2025-11-20'), end: new Date('2026-01-20') },
      { start: new Date('2026-03-01'), end: new Date('2026-04-30') }
    ]
  }
];

// ============================================================================
// Seed Data - Vendor Jobs
// ============================================================================

export const vendorJobsSeedData: VendorJob[] = [
  {
    id: 'job-001',
    title: 'Full Hull Repaint - Azure Dreams',
    description: 'Complete hull repaint required for M/Y Azure Dreams (120ft motor yacht). Current paint showing age and minor damage. Requires professional marine paint system with anti-fouling. Yacht will be in dry dock at San Diego facility. Must use Awlgrip or equivalent premium marine paint. Surface preparation, primer, multiple coats, and finishing required.',
    vessel: 'M/Y Azure Dreams',
    budget: 85000,
    deadline: new Date('2026-03-15'),
    status: 'Open',
    requirements: [
      'Licensed and insured marine painting contractor',
      'Minimum 10 years experience with yachts 100ft+',
      'Awlgrip certified applicators',
      'References from similar projects',
      'Detailed timeline and methodology',
      'Warranty on workmanship (minimum 2 years)'
    ],
    postedDate: new Date('2025-10-20')
  },
  {
    id: 'job-002',
    title: 'Teak Deck Replacement - Main Deck',
    description: 'Replace worn teak decking on main deck (approximately 800 sq ft). Remove existing teak, inspect and repair substrate if needed, install new teak planking with proper caulking. Premium Burma teak required. Must maintain classic yacht aesthetic with traditional layout.',
    vessel: 'M/Y Azure Dreams',
    budget: 62000,
    deadline: new Date('2026-02-28'),
    status: 'Open',
    requirements: [
      'Specialized teak deck installation experience',
      'Portfolio of completed yacht teak work',
      'Supply and installation of premium Burma teak',
      'Proper substrate waterproofing',
      'Professional caulking application',
      'Insurance and bonding'
    ],
    postedDate: new Date('2025-10-22')
  },
  {
    id: 'job-003',
    title: 'Electronics Upgrade Package',
    description: 'Comprehensive electronics upgrade including new radar system, updated chart plotters (dual systems), AIS integration, upgraded communication systems, and entertainment systems throughout vessel. Integration with existing systems required. Latest Garmin or Furuno equipment preferred.',
    vessel: 'M/Y Azure Dreams',
    budget: 125000,
    deadline: new Date('2026-01-31'),
    status: 'Open',
    requirements: [
      'Certified marine electronics installer',
      'Garmin and/or Furuno authorized dealer',
      'Experience with integrated yacht systems',
      'Network installation expertise',
      'Complete documentation and crew training',
      'Warranty support and service package'
    ],
    postedDate: new Date('2025-10-25')
  }
];

// ============================================================================
// Seed Data - Vendor Bids
// ============================================================================

export const vendorBidsSeedData: VendorBid[] = [
  {
    id: 'bid-001',
    jobId: 'job-001',
    vendorName: 'Michael Chen',
    vendorCompany: 'Pacific Yacht Coatings',
    bidAmount: 82000,
    proposedTimeline: '6 weeks - Surface prep (1 week), Primer application (1 week), Paint application (3 weeks), Curing and inspection (1 week)',
    proposal: 'We propose a complete Awlgrip paint system for M/Y Azure Dreams. Our team has completed 45+ yacht paint projects in the 100-200ft range. We will use Awlgrip 545 Primer system followed by Awlgrip topcoat in owner\'s choice of color. Our process includes complete surface preparation with fairing compound, multiple primer coats, and 4 coats of Awlgrip topcoat. We provide a 3-year warranty on workmanship and materials. Our team is Awlgrip certified and insured for $5M liability. Timeline includes buffer for weather delays.',
    submittedDate: new Date('2025-10-23'),
    status: 'Submitted'
  },
  {
    id: 'bid-002',
    jobId: 'job-001',
    vendorName: 'Robert Martinez',
    vendorCompany: 'Elite Marine Finishes',
    bidAmount: 89500,
    proposedTimeline: '8 weeks - includes 2-week buffer for optimal weather conditions',
    proposal: 'Elite Marine Finishes brings 25 years of superyacht painting experience. We specialize in Awlgrip applications and have painted several notable yachts in the San Diego area. Our bid includes complete hull preparation, Awlgrip HS primer system, and premium topcoat application. We offer an industry-leading 5-year warranty. Our proposal includes color consultation and testing. All work performed by certified technicians in climate-controlled environment when possible.',
    submittedDate: new Date('2025-10-24'),
    status: 'Submitted'
  },
  {
    id: 'bid-003',
    jobId: 'job-002',
    vendorName: 'James O\'Sullivan',
    vendorCompany: 'Nautical Teak Specialists',
    bidAmount: 59000,
    proposedTimeline: '4-5 weeks depending on weather - Remove old teak (3 days), Substrate inspection/repair (1 week), New teak installation (2-3 weeks), Caulking and finishing (3-4 days)',
    proposal: 'Nautical Teak Specialists has completed teak deck installations on over 100 luxury yachts. We source premium Burma teak directly from sustainable suppliers. Our installation method ensures proper water drainage and longevity. We use Sika marine caulking systems for optimal flexibility and durability. Our team will custom-fit each plank for perfect aesthetic. Includes 10-year warranty on materials and workmanship. We can work around your charter schedule with flexible installation timeline.',
    submittedDate: new Date('2025-10-26'),
    status: 'Submitted'
  },
  {
    id: 'bid-004',
    jobId: 'job-003',
    vendorName: 'Sarah Johnson',
    vendorCompany: 'Advanced Marine Electronics',
    bidAmount: 118000,
    proposedTimeline: '3 weeks - Equipment procurement (1 week), Installation (1.5 weeks), Testing and training (0.5 week)',
    proposal: 'Advanced Marine Electronics is an authorized Garmin Platinum dealer with extensive superyacht experience. Our proposal includes Garmin GMR Fantom radar system, dual GPSMAP 8617 chart plotters, AIS 800 integration, Icom M510 VHF radio system, and complete entertainment system upgrade throughout the vessel. We will integrate all systems on a dedicated network with remote monitoring capabilities. Includes complete documentation, 2-day crew training, and 5-year service warranty. Our technicians are certified and have worked on similar vessels in your size range.',
    submittedDate: new Date('2025-10-27'),
    status: 'Submitted'
  }
];

// ============================================================================
// Export All Seed Data
// ============================================================================

export const allSeedData = {
  itinerary: itinerarySeedData,
  maintenanceRecords: maintenanceSeedData,
  expenses: expenseSeedData,
  documents: documentsSeedData,
  calendarEvents: calendarEventsSeedData,
  guestPreferences: guestPreferencesSeedData,
  crewMembers: crewMembersSeedData,
  vendorJobs: vendorJobsSeedData,
  vendorBids: vendorBidsSeedData
};

export default allSeedData;
