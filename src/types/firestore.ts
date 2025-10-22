/**
 * Firestore Data Model for Yacht Management Platform
 * 
 * All data is organized under a vessels collection, where each vessel has a unique ID.
 * All subsequent data is stored in subcollections under that specific vessel document.
 */

import { Timestamp } from 'firebase/firestore';

/**
 * Itinerary - Stored in /vessels/{vesselId}/itinerary/{itineraryId}
 */
export interface Itinerary {
  location: string;
  arrival: Timestamp;
  departure: Timestamp;
  activities: string[];
  guests: string[];
  crew: string[];
  imageUrl: string;
  imageHint: string; // For AI image generation
}

/**
 * Maintenance Record - Stored in /vessels/{vesselId}/maintenanceRecords/{recordId}
 */
export type MaintenanceStatus = 'Completed' | 'In Progress' | 'Scheduled';

export interface MaintenanceRecord {
  date: Timestamp;
  service: string;
  vendor: string;
  cost: number;
  status: MaintenanceStatus;
  notes: string;
  rating?: number; // Optional rating
}

/**
 * Expense - Stored in /vessels/{vesselId}/expenses/{expenseId}
 */
export type ExpenseCategory = 
  | 'Fuel'
  | 'Provisioning'
  | 'Maintenance'
  | 'Crew'
  | 'Docking'
  | 'Insurance'
  | 'Other';

export type ExpenseStatus = 'Approved' | 'Pending' | 'Rejected';

export interface Expense {
  date: Timestamp;
  category: ExpenseCategory;
  description: string;
  amount: number;
  status: ExpenseStatus;
  approver?: string; // Optional approver
}

/**
 * Document - Stored in /vessels/{vesselId}/documents/{documentId}
 */
export type DocumentType = 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx' | 'folder' | 'image' | 'other';

export type UserRole = 'Owner' | 'Captain' | 'Crew' | 'Guest' | 'Manager';

export interface Document {
  name: string;
  type: DocumentType;
  size: string; // e.g., "2.5 MB"
  lastModified: Timestamp;
  path: string; // For folder structure, e.g., "/Certificates/Insurance"
  category: string;
  access: UserRole[]; // Array of user roles with access
}

/**
 * Calendar Event - Stored in /vessels/{vesselId}/calendarEvents/{eventId}
 * Unified collection for all calendar events
 */
export type CalendarEventType = 
  | 'Maintenance'
  | 'Guest Trip'
  | 'Crew Schedule'
  | 'Interior'
  | 'Provisioning'
  | 'Docking'
  | 'Other';

export interface CalendarEvent {
  title: string;
  start: Timestamp;
  end: Timestamp;
  type: CalendarEventType;
  description: string;
  participants: string[];
  allDay: boolean;
}

/**
 * Guest Preferences - Stored in /vessels/{vesselId}/guestPreferences/{guestName}
 * Document ID should be the guest's name
 */
export interface BeveragePreferences {
  water?: string[];
  coffee?: string[];
  tea?: string[];
  spirits?: string[];
  wine?: string[];
}

export interface GuestPreferences {
  allergies: string[];
  dietaryRestrictions: string[];
  favoriteFoods: string[];
  diningStyle: string;
  beveragePreferences: BeveragePreferences;
  specialOccasions: string[];
  otherNotes: string;
}

/**
 * Crew Member - Stored in /vessels/{vesselId}/crewMembers/{crewMemberId}
 * For the freelance crew marketplace
 */
export interface DateRange {
  start: Timestamp;
  end: Timestamp;
}

export interface CrewMember {
  name: string;
  position: string; // e.g., 'Chef', 'Deckhand', 'Engineer'
  rate: number; // Daily or hourly rate
  rating: number; // Rating out of 5
  bio: string;
  imageUrl: string;
  certifications: string[];
  availability: DateRange[];
}

/**
 * Vendor Job - Stored in /vessels/{vesselId}/vendorJobs/{jobId}
 */
export interface VendorJob {
  title: string;
  vessel: string; // Vessel name or ID
  budget: number;
  deadline: Timestamp;
  description: string;
}

/**
 * Vendor Bid - Stored in /vessels/{vesselId}/vendorBids/{bidId}
 */
export type BidStatus = 'Submitted' | 'Accepted' | 'Rejected';

export interface VendorBid {
  jobId: string; // Reference to the job
  vendorId: string; // Vendor user ID
  bidAmount: number;
  estimatedHours: number;
  coverLetter: string;
  status: BidStatus;
}

/**
 * Vessel Document - Main collection /vessels/{vesselId}
 * This is the parent document that contains all subcollections
 */
export interface Vessel {
  name: string;
  type: string; // e.g., 'Motor Yacht', 'Sailing Yacht'
  length: number; // in feet or meters
  year: number;
  homePort: string;
  owner: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
