'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize admin SDK (safe for emulator & production)
if (!admin.apps.length) {
  admin.initializeApp();
}
const db = admin.firestore();

const app = express();
// Note: Using permissive CORS for development/emulator.
// In production, restrict to specific domains via environment config.
app.use(cors({ origin: true }));
app.use(express.json());

// Export the raw Express app for tests and future extensions
module.exports.app = app;

/**
 * requireAuth placeholder middleware
 * In production we will validate request.headers.authorization using Firebase Auth JWT.
 * For now it attaches null user and lets endpoints be exercised in dev/emulator.
 */
function requireAuth(req, res, next) {
  req.user = req.user || null;
  next();
}

// API root (info)
app.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      name: "Yacht-Management API",
      version: "0.1.0"
    }
  });
});

// Healthcheck endpoint (simple)
app.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      ok: true,
      ts: new Date().toISOString()
    }
  });
});

// Create a yacht under an org
app.post('/orgs/:orgId/yachts', requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    const yacht = req.body || {};
    const ref = await db.collection('orgs').doc(orgId).collection('yachts').add({
      ...yacht,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const snap = await ref.get();
    res.status(201).json({
      success: true,
      data: {
        id: ref.id,
        ...snap.data()
      }
    });
  } catch (err) {
    console.error('POST /orgs/:orgId/yachts error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List bookings for a yacht
app.get('/orgs/:orgId/yachts/:yachtId/bookings', requireAuth, async (req, res) => {
  try {
    const { orgId, yachtId } = req.params;
    const snaps = await db
      .collection('orgs')
      .doc(orgId)
      .collection('yachts')
      .doc(yachtId)
      .collection('bookings')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
    const items = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (err) {
    console.error('GET bookings error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============== WALLET ENDPOINTS ==============

// Get wallet balance and info
app.get('/orgs/:orgId/wallet', requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    const walletRef = db.collection('orgs').doc(orgId).collection('wallet').doc('info');
    const snap = await walletRef.get();
    if (!snap.exists) {
      // Initialize wallet if not exists
      const initialWallet = {
        balance: 0,
        currency: 'USD',
        stripeCustomerId: null,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };
      await walletRef.set(initialWallet);
      return res.json({ success: true, data: { id: 'info', ...initialWallet } });
    }
    res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('GET wallet error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List wallet transactions
app.get('/orgs/:orgId/wallet/transactions', requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    const snaps = await db
      .collection('orgs')
      .doc(orgId)
      .collection('wallet')
      .doc('info')
      .collection('transactions')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
    const items = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error('GET transactions error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a transaction (payment)
app.post('/orgs/:orgId/wallet/transactions', requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    const transaction = req.body || {};
    const ref = await db
      .collection('orgs')
      .doc(orgId)
      .collection('wallet')
      .doc('info')
      .collection('transactions')
      .add({
        ...transaction,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    const snap = await ref.get();
    res.status(201).json({ success: true, data: { id: ref.id, ...snap.data() } });
  } catch (err) {
    console.error('POST transaction error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// List payees
app.get('/orgs/:orgId/payees', requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    const snaps = await db
      .collection('orgs')
      .doc(orgId)
      .collection('payees')
      .orderBy('name', 'asc')
      .limit(100)
      .get();
    const items = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error('GET payees error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add payee
app.post('/orgs/:orgId/payees', requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    const payee = req.body || {};
    const ref = await db.collection('orgs').doc(orgId).collection('payees').add({
      ...payee,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const snap = await ref.get();
    res.status(201).json({ success: true, data: { id: ref.id, ...snap.data() } });
  } catch (err) {
    console.error('POST payee error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============== VENDOR ENDPOINTS ==============

// List vendors (catalog)
app.get('/vendors', requireAuth, async (req, res) => {
  try {
    const { category, search, rating } = req.query;
    let query = db.collection('vendors').orderBy('rating', 'desc');

    if (category && category !== 'All') {
      query = query.where('category', '==', category);
    }

    const snaps = await query.limit(100).get();
    let items = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

    // Client-side filter for search (Firestore doesn't support full-text search)
    if (search) {
      const searchLower = search.toLowerCase();
      items = items.filter(v =>
        v.name?.toLowerCase().includes(searchLower) ||
        v.description?.toLowerCase().includes(searchLower)
      );
    }

    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error('GET vendors error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single vendor
app.get('/vendors/:vendorId', requireAuth, async (req, res) => {
  try {
    const { vendorId } = req.params;
    const snap = await db.collection('vendors').doc(vendorId).get();
    if (!snap.exists) {
      return res.status(404).json({ error: 'Vendor not found' });
    }
    res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('GET vendor error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create vendor (for vendor registration)
app.post('/vendors', requireAuth, async (req, res) => {
  try {
    const vendor = req.body || {};
    const ref = await db.collection('vendors').add({
      ...vendor,
      rating: 0,
      reviewCount: 0,
      verified: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const snap = await ref.get();
    res.status(201).json({ success: true, data: { id: ref.id, ...snap.data() } });
  } catch (err) {
    console.error('POST vendor error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Vendor CRM - List interactions with a vendor
app.get('/orgs/:orgId/vendors/:vendorId/interactions', requireAuth, async (req, res) => {
  try {
    const { orgId, vendorId } = req.params;
    const snaps = await db
      .collection('orgs')
      .doc(orgId)
      .collection('vendorInteractions')
      .where('vendorId', '==', vendorId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();
    const items = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error('GET vendor interactions error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add interaction with vendor (CRM)
app.post('/orgs/:orgId/vendors/:vendorId/interactions', requireAuth, async (req, res) => {
  try {
    const { orgId, vendorId } = req.params;
    const interaction = req.body || {};
    const ref = await db.collection('orgs').doc(orgId).collection('vendorInteractions').add({
      ...interaction,
      vendorId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const snap = await ref.get();
    res.status(201).json({ success: true, data: { id: ref.id, ...snap.data() } });
  } catch (err) {
    console.error('POST vendor interaction error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============== BIDS ENDPOINTS ==============

// List service requests (for bids)
app.get('/orgs/:orgId/serviceRequests', requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    const { status } = req.query;
    let query = db.collection('orgs').doc(orgId).collection('serviceRequests')
      .orderBy('createdAt', 'desc');

    if (status) {
      query = query.where('status', '==', status);
    }

    const snaps = await query.limit(100).get();
    const items = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error('GET serviceRequests error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create service request
app.post('/orgs/:orgId/serviceRequests', requireAuth, async (req, res) => {
  try {
    const { orgId } = req.params;
    const request = req.body || {};
    const ref = await db.collection('orgs').doc(orgId).collection('serviceRequests').add({
      ...request,
      status: 'open',
      bidCount: 0,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    const snap = await ref.get();
    res.status(201).json({ success: true, data: { id: ref.id, ...snap.data() } });
  } catch (err) {
    console.error('POST serviceRequest error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single service request with bids
app.get('/orgs/:orgId/serviceRequests/:requestId', requireAuth, async (req, res) => {
  try {
    const { orgId, requestId } = req.params;
    const requestSnap = await db
      .collection('orgs')
      .doc(orgId)
      .collection('serviceRequests')
      .doc(requestId)
      .get();

    if (!requestSnap.exists) {
      return res.status(404).json({ error: 'Service request not found' });
    }

    // Get bids for this request
    const bidsSnap = await db
      .collection('orgs')
      .doc(orgId)
      .collection('serviceRequests')
      .doc(requestId)
      .collection('bids')
      .orderBy('amount', 'asc')
      .get();

    const bids = bidsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    res.json({
      success: true,
      data: {
        id: requestSnap.id,
        ...requestSnap.data(),
        bids
      }
    });
  } catch (err) {
    console.error('GET serviceRequest error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit bid on service request
app.post('/orgs/:orgId/serviceRequests/:requestId/bids', requireAuth, async (req, res) => {
  try {
    const { orgId, requestId } = req.params;
    const bid = req.body || {};
    const ref = await db
      .collection('orgs')
      .doc(orgId)
      .collection('serviceRequests')
      .doc(requestId)
      .collection('bids')
      .add({
        ...bid,
        status: 'pending',
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    // Update bid count on request
    await db
      .collection('orgs')
      .doc(orgId)
      .collection('serviceRequests')
      .doc(requestId)
      .update({
        bidCount: admin.firestore.FieldValue.increment(1)
      });

    const snap = await ref.get();
    res.status(201).json({ success: true, data: { id: ref.id, ...snap.data() } });
  } catch (err) {
    console.error('POST bid error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Accept/Reject bid
app.patch('/orgs/:orgId/serviceRequests/:requestId/bids/:bidId', requireAuth, async (req, res) => {
  try {
    const { orgId, requestId, bidId } = req.params;
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const bidRef = db
      .collection('orgs')
      .doc(orgId)
      .collection('serviceRequests')
      .doc(requestId)
      .collection('bids')
      .doc(bidId);

    await bidRef.update({ status, updatedAt: admin.firestore.FieldValue.serverTimestamp() });

    // If accepted, update request status and reject other bids
    if (status === 'accepted') {
      await db
        .collection('orgs')
        .doc(orgId)
        .collection('serviceRequests')
        .doc(requestId)
        .update({
          status: 'awarded',
          awardedBidId: bidId,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
    }

    const snap = await bidRef.get();
    res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('PATCH bid error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ============== ACCOUNTING ENDPOINTS ==============

// Get accounting summary for a yacht
app.get('/orgs/:orgId/yachts/:yachtId/accounting', requireAuth, async (req, res) => {
  try {
    const { orgId, yachtId } = req.params;
    const { year, month } = req.query;

    // Get transactions for the period
    let query = db
      .collection('orgs')
      .doc(orgId)
      .collection('yachts')
      .doc(yachtId)
      .collection('accounting')
      .orderBy('date', 'desc');

    const snaps = await query.limit(500).get();
    const transactions = snaps.docs.map(d => ({ id: d.id, ...d.data() }));

    // Calculate summary
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    res.json({
      success: true,
      data: {
        transactions,
        summary: {
          totalIncome: income,
          totalExpenses: expenses,
          netProfit: income - expenses
        }
      }
    });
  } catch (err) {
    console.error('GET accounting error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add accounting entry
app.post('/orgs/:orgId/yachts/:yachtId/accounting', requireAuth, async (req, res) => {
  try {
    const { orgId, yachtId } = req.params;
    const entry = req.body || {};
    const ref = await db
      .collection('orgs')
      .doc(orgId)
      .collection('yachts')
      .doc(yachtId)
      .collection('accounting')
      .add({
        ...entry,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    const snap = await ref.get();
    res.status(201).json({ success: true, data: { id: ref.id, ...snap.data() } });
  } catch (err) {
    console.error('POST accounting error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get/Update budget for a yacht
app.get('/orgs/:orgId/yachts/:yachtId/budget', requireAuth, async (req, res) => {
  try {
    const { orgId, yachtId } = req.params;
    const snap = await db
      .collection('orgs')
      .doc(orgId)
      .collection('yachts')
      .doc(yachtId)
      .collection('budget')
      .doc('current')
      .get();

    if (!snap.exists) {
      return res.json({
        success: true,
        data: { categories: [], totalBudget: 0, spent: 0 }
      });
    }

    res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('GET budget error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/orgs/:orgId/yachts/:yachtId/budget', requireAuth, async (req, res) => {
  try {
    const { orgId, yachtId } = req.params;
    const budget = req.body || {};
    const ref = db
      .collection('orgs')
      .doc(orgId)
      .collection('yachts')
      .doc(yachtId)
      .collection('budget')
      .doc('current');

    await ref.set({
      ...budget,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    const snap = await ref.get();
    res.json({ success: true, data: { id: snap.id, ...snap.data() } });
  } catch (err) {
    console.error('PUT budget error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the Cloud Function that Firebase will mount at runtime.
exports.api = functions.https.onRequest(app);