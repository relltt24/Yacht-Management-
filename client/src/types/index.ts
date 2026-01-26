// Yacht Types
export interface Yacht {
  id: number;
  name: string;
  type: 'Motor' | 'Sailing' | 'Catamaran' | 'Mega';
  length: number;
  lengthUnit: 'ft' | 'm';
  capacity: number;
  status: 'Available' | 'Chartered' | 'Maintenance' | 'In Transit';
  location: string;
  dailyRate: number;
  weeklyRate: number;
  yearBuilt: number;
  lastService: string;
  nextService: string;
  manufacturer: string;
  model: string;
  hullMaterial: string;
  fuelCapacity: number;
  waterCapacity: number;
  cruisingSpeed: number;
  maxSpeed: number;
  amenities: string[];
  images: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Crew Types
export interface Crew {
  id: number;
  firstName: string;
  lastName: string;
  position: 'Captain' | 'First Mate' | 'Engineer' | 'Chef' | 'Steward' | 'Deckhand';
  email: string;
  phone: string;
  nationality: string;
  certifications: Certification[];
  assignedYachtId: number | null;
  status: 'Active' | 'On Leave' | 'Training' | 'Available';
  hireDate: string;
  salary: number;
  emergencyContact: EmergencyContact;
  documents: CrewDocument[];
  skills: string[];
  languages: string[];
  avatar?: string;
}

export interface Certification {
  name: string;
  issuedBy: string;
  issueDate: string;
  expiryDate: string;
  status: 'Valid' | 'Expiring Soon' | 'Expired';
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface CrewDocument {
  type: string;
  number: string;
  expiryDate: string;
}

// Maintenance Types
export interface Maintenance {
  id: number;
  yachtId: number;
  yachtName?: string;
  type: 'Routine' | 'Repair' | 'Emergency' | 'Inspection' | 'Upgrade';
  title: string;
  description: string;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Overdue';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  scheduledDate: string;
  completedDate?: string;
  estimatedCost: number;
  actualCost?: number;
  assignedTo: string;
  parts: MaintenancePart[];
  notes: string[];
  aiPrediction?: AIPrediction;
}

export interface MaintenancePart {
  name: string;
  quantity: number;
  cost: number;
}

export interface AIPrediction {
  predictedIssue: string;
  confidence: number;
  recommendedAction: string;
  urgency: 'Low' | 'Medium' | 'High';
  estimatedTimeToFailure?: string;
}

// Booking Types
export interface Booking {
  id: number;
  yachtId: number;
  yachtName?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Confirmed' | 'In Progress' | 'Completed' | 'Cancelled';
  totalAmount: number;
  depositAmount: number;
  depositPaid: boolean;
  guests: number;
  specialRequests: string;
  itinerary: ItineraryStop[];
  crewAssigned: number[];
  paymentStatus: 'Pending' | 'Partial' | 'Paid' | 'Refunded';
  createdAt: string;
}

export interface ItineraryStop {
  location: string;
  date: string;
  duration: string;
  activities: string[];
}

// Inventory Types
export interface Inventory {
  id: number;
  name: string;
  category: 'Safety' | 'Navigation' | 'Provisions' | 'Maintenance' | 'Guest Amenities' | 'Fuel & Fluids';
  quantity: number;
  unit: string;
  minQuantity: number;
  location: string;
  yachtId: number | null;
  supplier: string;
  lastRestocked: string;
  expiryDate?: string;
  cost: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'On Order';
  barcode?: string;
  notes?: string;
}

// Analytics Types
export interface DashboardAnalytics {
  fleetOverview: FleetOverview;
  revenueMetrics: RevenueMetrics;
  maintenanceMetrics: MaintenanceMetrics;
  bookingMetrics: BookingMetrics;
  crewMetrics: CrewMetrics;
  aiInsights: AIInsight[];
}

export interface FleetOverview {
  totalYachts: number;
  availableYachts: number;
  charteredYachts: number;
  inMaintenance: number;
  totalValue: number;
  averageAge: number;
}

export interface RevenueMetrics {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyGrowth: number;
  averageBookingValue: number;
  topPerformingYachts: { name: string; revenue: number }[];
  revenueByMonth: { month: string; revenue: number }[];
}

export interface MaintenanceMetrics {
  scheduledCount: number;
  overdueCount: number;
  completedThisMonth: number;
  totalCostThisYear: number;
  upcomingMaintenance: Maintenance[];
  predictedIssues: AIPrediction[];
}

export interface BookingMetrics {
  totalBookings: number;
  activeBookings: number;
  pendingBookings: number;
  occupancyRate: number;
  averageBookingDuration: number;
  bookingsByMonth: { month: string; count: number }[];
}

export interface CrewMetrics {
  totalCrew: number;
  activeCrew: number;
  averageExperience: number;
  certificationExpiring: number;
  crewByPosition: { position: string; count: number }[];
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'opportunity' | 'recommendation' | 'alert';
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  actionRequired: boolean;
  suggestedAction?: string;
  relatedEntity?: {
    type: 'yacht' | 'crew' | 'booking' | 'maintenance' | 'inventory';
    id: number;
    name: string;
  };
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter Types
export interface YachtFilters {
  status?: string;
  type?: string;
  minLength?: number;
  maxLength?: number;
  minCapacity?: number;
  location?: string;
}

export interface BookingFilters {
  status?: string;
  yachtId?: number;
  startDate?: string;
  endDate?: string;
}

export interface MaintenanceFilters {
  status?: string;
  type?: string;
  yachtId?: number;
  priority?: string;
}
