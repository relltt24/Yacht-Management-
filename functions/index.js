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
      data: { id: ref.id, ...snap.data() }
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

// Export the Cloud Function that Firebase will mount at runtime.
exports.api = functions.https.onRequest(app);