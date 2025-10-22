/**
 * Firestore Data Initialization Script
 * 
 * This script initializes the Firestore database with seed data.
 * It should be run once to populate the database with initial data.
 * 
 * Usage:
 *   node src/lib/init-firestore.js
 * 
 * Make sure to set up your Firebase credentials in environment variables first.
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore';
import {
  itinerarySeedData,
  maintenanceSeedData,
  expensesSeedData,
  documentsSeedData,
  calendarEventsSeedData,
  guestPreferencesSeedData,
  crewMembersSeedData,
  vendorJobsSeedData,
  vendorBidsSeedData,
} from './seed-data.js';

// Firebase configuration
// In production, use environment variables
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Base path for all data
const VESSEL_ID = 'default-vessel';
const basePath = `vessels/${VESSEL_ID}`;

/**
 * Converts Date objects to Firestore Timestamps
 */
function convertDatesToFirestore(obj) {
  if (obj instanceof Date) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertDatesToFirestore);
  }
  if (obj !== null && typeof obj === 'object') {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertDatesToFirestore(value);
    }
    return converted;
  }
  return obj;
}

/**
 * Initialize a collection with seed data
 */
async function initializeCollection(collectionName, data, useNameAsId = false) {
  console.log(`Initializing ${collectionName}...`);
  
  try {
    if (useNameAsId) {
      // For collections like guestPreferences where document ID is the key
      for (const [docId, docData] of Object.entries(data)) {
        const docRef = doc(db, basePath, collectionName, docId);
        await setDoc(docRef, convertDatesToFirestore(docData));
        console.log(`  ✓ Added document: ${docId}`);
      }
    } else {
      // For regular collections with array data
      for (const item of data) {
        const docRef = doc(db, basePath, collectionName, item.id);
        await setDoc(docRef, convertDatesToFirestore(item));
        console.log(`  ✓ Added document: ${item.id}`);
      }
    }
    console.log(`✅ ${collectionName} initialized successfully\n`);
  } catch (error) {
    console.error(`❌ Error initializing ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Main initialization function
 */
async function initializeFirestore() {
  console.log('🚀 Starting Firestore initialization...\n');
  console.log(`Base path: ${basePath}\n`);
  
  try {
    // Create the vessel document
    const vesselRef = doc(db, 'vessels', VESSEL_ID);
    await setDoc(vesselRef, {
      name: 'M/Y Azure Dreams',
      type: 'Motor Yacht',
      length: 85,
      createdAt: new Date(),
      description: 'Luxury motor yacht - AI-powered management platform'
    });
    console.log('✅ Vessel document created\n');
    
    // Initialize all subcollections
    await initializeCollection('itinerary', itinerarySeedData);
    await initializeCollection('maintenanceRecords', maintenanceSeedData);
    await initializeCollection('expenses', expensesSeedData);
    await initializeCollection('documents', documentsSeedData);
    await initializeCollection('calendarEvents', calendarEventsSeedData);
    await initializeCollection('guestPreferences', guestPreferencesSeedData, true);
    await initializeCollection('crewMembers', crewMembersSeedData);
    await initializeCollection('vendorJobs', vendorJobsSeedData);
    await initializeCollection('vendorBids', vendorBidsSeedData);
    
    console.log('🎉 Firestore initialization completed successfully!');
    console.log('\nYour database is now populated with seed data.');
    console.log(`All data is stored under: /vessels/${VESSEL_ID}/`);
    
  } catch (error) {
    console.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization
initializeFirestore()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
