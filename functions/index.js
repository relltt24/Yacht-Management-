'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialize admin SDK (safe for emulator & production)
if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();
// Note: Using permissive CORS for development/emulator.
// In production, restrict to specific domains via environment config.
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create a router for API endpoints
const apiRouter = express.Router();

// Export both for tests and future extensions
module.exports.app = app;
module.exports.apiRouter = apiRouter;

// In-memory data stores (replace with Firestore in production if needed)
let yachts = [
  { id: 1, name: "Ocean Serenity", type: "Motor Yacht", length: 85, capacity: 12, status: "available" },
  { id: 2, name: "Wind Dancer", type: "Sailing Yacht", length: 65, capacity: 8, status: "available" }
];

let crew = [
  { id: 1, name: "Captain John Smith", position: "Captain", yachtId: 1, certifications: ["Master 500 Ton"] },
  { id: 2, name: "Sarah Johnson", position: "Chef", yachtId: 1, certifications: ["Culinary Arts"] }
];

let maintenance = [
  { id: 1, yachtId: 1, type: "Engine Service", scheduledDate: "2025-11-01", status: "pending", notes: "Regular maintenance check" }
];

let bookings = [
  { id: 1, yachtId: 1, clientName: "John Doe", startDate: "2025-11-15", endDate: "2025-11-20", status: "confirmed" }
];

let inventory = [
  { id: 1, yachtId: 1, item: "Life Jackets", quantity: 15, category: "Safety", lastChecked: "2025-10-01" },
  { id: 2, yachtId: 1, item: "Fuel", quantity: 850, unit: "gallons", category: "Consumables", lastChecked: "2025-10-01" }
];

// Helper function for error responses
const errorResponse = (res, status, message) => {
  res.status(status).json({ error: message });
};

// Health check - mount directly on app (accessible at both / and /api/)
app.get("/healthz", (req, res) => res.send("ok"));
app.get("/api/healthz", (req, res) => res.send("ok"));

// API root (info)
apiRouter.get("/", (req, res) => {
  res.json({
    message: "AI Yacht Management Backend API",
    version: "1.0.0",
    endpoints: {
      yachts: "/api/yachts",
      crew: "/api/crew",
      maintenance: "/api/maintenance",
      bookings: "/api/bookings",
      inventory: "/api/inventory",
      analytics: "/api/analytics"
    }
  });
});

// Healthcheck endpoint (alternative)
apiRouter.get('/health', (req, res) => {
  res.json({
    success: true,
    data: {
      ok: true,
      ts: new Date().toISOString()
    }
  });
});

// ===== YACHT ENDPOINTS =====

// Get all yachts
apiRouter.get("/yachts", (req, res) => {
  const { status, type } = req.query;
  let filtered = yachts;
  
  if (status) {
    filtered = filtered.filter(y => y.status === status);
  }
  if (type) {
    filtered = filtered.filter(y => y.type === type);
  }
  
  res.json({ success: true, count: filtered.length, data: filtered });
});

// Get single yacht
apiRouter.get("/yachts/:id", (req, res) => {
  const yacht = yachts.find(y => y.id === parseInt(req.params.id));
  if (!yacht) {
    return errorResponse(res, 404, "Yacht not found");
  }
  
  // Include related data
  const yachtCrew = crew.filter(c => c.yachtId === yacht.id);
  const yachtMaintenance = maintenance.filter(m => m.yachtId === yacht.id);
  const yachtBookings = bookings.filter(b => b.yachtId === yacht.id);
  const yachtInventory = inventory.filter(i => i.yachtId === yacht.id);
  
  res.json({
    success: true,
    data: {
      ...yacht,
      crew: yachtCrew,
      maintenance: yachtMaintenance,
      bookings: yachtBookings,
      inventory: yachtInventory
    }
  });
});

// Create new yacht
apiRouter.post("/yachts", (req, res) => {
  const { name, type, length, capacity, status } = req.body;
  
  // Validate required fields and types
  if (!name || !type || !length || !capacity) {
    return errorResponse(res, 400, "Missing required fields: name, type, length, capacity");
  }
  
  if (typeof name !== 'string' || typeof type !== 'string') {
    return errorResponse(res, 400, "Invalid field types: name and type must be strings");
  }
  
  const lengthNum = parseInt(length, 10);
  const capacityNum = parseInt(capacity, 10);
  
  if (isNaN(lengthNum) || isNaN(capacityNum)) {
    return errorResponse(res, 400, "Invalid field types: length and capacity must be numbers");
  }
  
  const newYacht = {
    id: Math.max(...yachts.map(y => y.id), 0) + 1,
    name: String(name),
    type: String(type),
    length: lengthNum,
    capacity: capacityNum,
    status: status ? String(status) : "available"
  };
  
  yachts.push(newYacht);
  res.status(201).json({ success: true, data: newYacht });
});

// Update yacht
apiRouter.put("/yachts/:id", (req, res) => {
  const index = yachts.findIndex(y => y.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Yacht not found");
  }
  
  // Validate and sanitize update data
  const updates = {};
  if (req.body.name !== undefined) updates.name = String(req.body.name);
  if (req.body.type !== undefined) updates.type = String(req.body.type);
  if (req.body.length !== undefined) updates.length = parseInt(req.body.length, 10);
  if (req.body.capacity !== undefined) updates.capacity = parseInt(req.body.capacity, 10);
  if (req.body.status !== undefined) updates.status = String(req.body.status);
  
  yachts[index] = { ...yachts[index], ...updates, id: yachts[index].id };
  res.json({ success: true, data: yachts[index] });
});

// Delete yacht
apiRouter.delete("/yachts/:id", (req, res) => {
  const index = yachts.findIndex(y => y.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Yacht not found");
  }
  
  yachts.splice(index, 1);
  res.json({ success: true, message: "Yacht deleted successfully" });
});

// ===== CREW ENDPOINTS =====

// Get all crew
apiRouter.get("/crew", (req, res) => {
  const { yachtId, position } = req.query;
  let filtered = crew;
  
  if (yachtId) {
    filtered = filtered.filter(c => c.yachtId === parseInt(yachtId));
  }
  if (position) {
    filtered = filtered.filter(c => c.position === position);
  }
  
  res.json({ success: true, count: filtered.length, data: filtered });
});

// Get single crew member
apiRouter.get("/crew/:id", (req, res) => {
  const member = crew.find(c => c.id === parseInt(req.params.id));
  if (!member) {
    return errorResponse(res, 404, "Crew member not found");
  }
  res.json({ success: true, data: member });
});

// Create new crew member
apiRouter.post("/crew", (req, res) => {
  const { name, position, yachtId, certifications } = req.body;
  
  if (!name || !position) {
    return errorResponse(res, 400, "Missing required fields: name, position");
  }
  
  if (typeof name !== 'string' || typeof position !== 'string') {
    return errorResponse(res, 400, "Invalid field types: name and position must be strings");
  }
  
  const newMember = {
    id: Math.max(...crew.map(c => c.id), 0) + 1,
    name: String(name),
    position: String(position),
    yachtId: yachtId ? parseInt(yachtId, 10) : null,
    certifications: Array.isArray(certifications) ? certifications.map(c => String(c)) : []
  };
  
  crew.push(newMember);
  res.status(201).json({ success: true, data: newMember });
});

// Update crew member
apiRouter.put("/crew/:id", (req, res) => {
  const index = crew.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Crew member not found");
  }
  
  crew[index] = { ...crew[index], ...req.body, id: crew[index].id };
  res.json({ success: true, data: crew[index] });
});

// Delete crew member
apiRouter.delete("/crew/:id", (req, res) => {
  const index = crew.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Crew member not found");
  }
  
  crew.splice(index, 1);
  res.json({ success: true, message: "Crew member deleted successfully" });
});

// ===== MAINTENANCE ENDPOINTS =====

// Get all maintenance records
apiRouter.get("/maintenance", (req, res) => {
  const { yachtId, status } = req.query;
  let filtered = maintenance;
  
  if (yachtId) {
    filtered = filtered.filter(m => m.yachtId === parseInt(yachtId));
  }
  if (status) {
    filtered = filtered.filter(m => m.status === status);
  }
  
  res.json({ success: true, count: filtered.length, data: filtered });
});

// Get single maintenance record
apiRouter.get("/maintenance/:id", (req, res) => {
  const record = maintenance.find(m => m.id === parseInt(req.params.id));
  if (!record) {
    return errorResponse(res, 404, "Maintenance record not found");
  }
  res.json({ success: true, data: record });
});

// Create new maintenance record
apiRouter.post("/maintenance", (req, res) => {
  const { yachtId, type, scheduledDate, status, notes } = req.body;
  
  if (!yachtId || !type || !scheduledDate) {
    return errorResponse(res, 400, "Missing required fields: yachtId, type, scheduledDate");
  }
  
  const newRecord = {
    id: Math.max(...maintenance.map(m => m.id), 0) + 1,
    yachtId,
    type,
    scheduledDate,
    status: status || "pending",
    notes: notes || ""
  };
  
  maintenance.push(newRecord);
  res.status(201).json({ success: true, data: newRecord });
});

// Update maintenance record
apiRouter.put("/maintenance/:id", (req, res) => {
  const index = maintenance.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Maintenance record not found");
  }
  
  maintenance[index] = { ...maintenance[index], ...req.body, id: maintenance[index].id };
  res.json({ success: true, data: maintenance[index] });
});

// Delete maintenance record
apiRouter.delete("/maintenance/:id", (req, res) => {
  const index = maintenance.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Maintenance record not found");
  }
  
  maintenance.splice(index, 1);
  res.json({ success: true, message: "Maintenance record deleted successfully" });
});

// ===== BOOKING ENDPOINTS =====

// Get all bookings
apiRouter.get("/bookings", (req, res) => {
  const { yachtId, status } = req.query;
  let filtered = bookings;
  
  if (yachtId) {
    filtered = filtered.filter(b => b.yachtId === parseInt(yachtId));
  }
  if (status) {
    filtered = filtered.filter(b => b.status === status);
  }
  
  res.json({ success: true, count: filtered.length, data: filtered });
});

// Get single booking
apiRouter.get("/bookings/:id", (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) {
    return errorResponse(res, 404, "Booking not found");
  }
  res.json({ success: true, data: booking });
});

// Create new booking
apiRouter.post("/bookings", (req, res) => {
  const { yachtId, clientName, startDate, endDate, status } = req.body;
  
  if (!yachtId || !clientName || !startDate || !endDate) {
    return errorResponse(res, 400, "Missing required fields: yachtId, clientName, startDate, endDate");
  }
  
  const newBooking = {
    id: Math.max(...bookings.map(b => b.id), 0) + 1,
    yachtId,
    clientName,
    startDate,
    endDate,
    status: status || "pending"
  };
  
  bookings.push(newBooking);
  res.status(201).json({ success: true, data: newBooking });
});

// Update booking
apiRouter.put("/bookings/:id", (req, res) => {
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Booking not found");
  }
  
  bookings[index] = { ...bookings[index], ...req.body, id: bookings[index].id };
  res.json({ success: true, data: bookings[index] });
});

// Delete booking
apiRouter.delete("/bookings/:id", (req, res) => {
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Booking not found");
  }
  
  bookings.splice(index, 1);
  res.json({ success: true, message: "Booking deleted successfully" });
});

// ===== INVENTORY ENDPOINTS =====

// Get all inventory items
apiRouter.get("/inventory", (req, res) => {
  const { yachtId, category } = req.query;
  let filtered = inventory;
  
  if (yachtId) {
    filtered = filtered.filter(i => i.yachtId === parseInt(yachtId));
  }
  if (category) {
    filtered = filtered.filter(i => i.category === category);
  }
  
  res.json({ success: true, count: filtered.length, data: filtered });
});

// Get single inventory item
apiRouter.get("/inventory/:id", (req, res) => {
  const item = inventory.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return errorResponse(res, 404, "Inventory item not found");
  }
  res.json({ success: true, data: item });
});

// Create new inventory item
apiRouter.post("/inventory", (req, res) => {
  const { yachtId, item, quantity, category, unit, lastChecked } = req.body;
  
  if (!yachtId || !item || quantity === undefined) {
    return errorResponse(res, 400, "Missing required fields: yachtId, item, quantity");
  }
  
  const newItem = {
    id: Math.max(...inventory.map(i => i.id), 0) + 1,
    yachtId,
    item,
    quantity,
    category: category || "General",
    unit: unit || "units",
    lastChecked: lastChecked || new Date().toISOString().split('T')[0]
  };
  
  inventory.push(newItem);
  res.status(201).json({ success: true, data: newItem });
});

// Update inventory item
apiRouter.put("/inventory/:id", (req, res) => {
  const index = inventory.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Inventory item not found");
  }
  
  inventory[index] = { ...inventory[index], ...req.body, id: inventory[index].id };
  res.json({ success: true, data: inventory[index] });
});

// Delete inventory item
apiRouter.delete("/inventory/:id", (req, res) => {
  const index = inventory.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Inventory item not found");
  }
  
  inventory.splice(index, 1);
  res.json({ success: true, message: "Inventory item deleted successfully" });
});

// ===== AI ANALYTICS ENDPOINTS =====

// Get fleet overview for AI analysis
apiRouter.get("/analytics/fleet-overview", (req, res) => {
  const overview = {
    totalYachts: yachts.length,
    yachtsByStatus: yachts.reduce((acc, y) => {
      acc[y.status] = (acc[y.status] || 0) + 1;
      return acc;
    }, {}),
    yachtsByType: yachts.reduce((acc, y) => {
      acc[y.type] = (acc[y.type] || 0) + 1;
      return acc;
    }, {}),
    totalCapacity: yachts.reduce((sum, y) => sum + y.capacity, 0),
    averageLength: yachts.reduce((sum, y) => sum + y.length, 0) / yachts.length || 0
  };
  
  res.json({ success: true, data: overview });
});

// Get maintenance insights for AI predictions
apiRouter.get("/analytics/maintenance-insights", (req, res) => {
  const insights = {
    totalMaintenanceRecords: maintenance.length,
    maintenanceByStatus: maintenance.reduce((acc, m) => {
      acc[m.status] = (acc[m.status] || 0) + 1;
      return acc;
    }, {}),
    maintenanceByType: maintenance.reduce((acc, m) => {
      acc[m.type] = (acc[m.type] || 0) + 1;
      return acc;
    }, {}),
    upcomingMaintenance: maintenance.filter(m => {
      const date = new Date(m.scheduledDate);
      const today = new Date();
      const daysUntil = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
      return daysUntil >= 0 && daysUntil <= 30 && m.status === 'pending';
    }).length
  };
  
  res.json({ success: true, data: insights });
});

// Get booking analytics for revenue optimization
apiRouter.get("/analytics/booking-insights", (req, res) => {
  const insights = {
    totalBookings: bookings.length,
    bookingsByStatus: bookings.reduce((acc, b) => {
      acc[b.status] = (acc[b.status] || 0) + 1;
      return acc;
    }, {}),
    bookingsByYacht: bookings.reduce((acc, b) => {
      const yacht = yachts.find(y => y.id === b.yachtId);
      const yachtName = yacht ? yacht.name : 'Unknown';
      acc[yachtName] = (acc[yachtName] || 0) + 1;
      return acc;
    }, {}),
    upcomingBookings: bookings.filter(b => {
      const date = new Date(b.startDate);
      const today = new Date();
      return date > today && b.status === 'confirmed';
    }).length
  };
  
  res.json({ success: true, data: insights });
});

// Get crew utilization for AI staffing optimization
apiRouter.get("/analytics/crew-utilization", (req, res) => {
  const utilization = {
    totalCrew: crew.length,
    crewByPosition: crew.reduce((acc, c) => {
      acc[c.position] = (acc[c.position] || 0) + 1;
      return acc;
    }, {}),
    assignedCrew: crew.filter(c => c.yachtId !== null).length,
    unassignedCrew: crew.filter(c => c.yachtId === null).length,
    crewByYacht: crew.reduce((acc, c) => {
      if (c.yachtId) {
        const yacht = yachts.find(y => y.id === c.yachtId);
        const yachtName = yacht ? yacht.name : 'Unknown';
        acc[yachtName] = (acc[yachtName] || 0) + 1;
      }
      return acc;
    }, {})
  };
  
  res.json({ success: true, data: utilization });
});

// Get inventory status for AI supply chain optimization
apiRouter.get("/analytics/inventory-status", (req, res) => {
  const status = {
    totalItems: inventory.length,
    itemsByCategory: inventory.reduce((acc, i) => {
      acc[i.category] = (acc[i.category] || 0) + 1;
      return acc;
    }, {}),
    lowStockItems: inventory.filter(i => i.quantity < 10).length,
    itemsByYacht: inventory.reduce((acc, i) => {
      const yacht = yachts.find(y => y.id === i.yachtId);
      const yachtName = yacht ? yacht.name : 'Unknown';
      acc[yachtName] = (acc[yachtName] || 0) + 1;
      return acc;
    }, {})
  };
  
  res.json({ success: true, data: status });
});

// Comprehensive dashboard data for AI processing
apiRouter.get("/analytics/dashboard", (req, res) => {
  const dashboard = {
    fleet: {
      total: yachts.length,
      available: yachts.filter(y => y.status === 'available').length,
      inService: yachts.filter(y => y.status === 'in-service').length,
      maintenance: yachts.filter(y => y.status === 'maintenance').length
    },
    crew: {
      total: crew.length,
      assigned: crew.filter(c => c.yachtId !== null).length
    },
    bookings: {
      total: bookings.length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      pending: bookings.filter(b => b.status === 'pending').length
    },
    maintenance: {
      total: maintenance.length,
      pending: maintenance.filter(m => m.status === 'pending').length,
      completed: maintenance.filter(m => m.status === 'completed').length
    },
    inventory: {
      total: inventory.length,
      lowStock: inventory.filter(i => i.quantity < 10).length
    }
  };
  
  res.json({ success: true, data: dashboard });
});

// Mount the API router at both root and /api for compatibility
app.use('/', apiRouter);
app.use('/api', apiRouter);

// Error handling middleware
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    error: "Internal server error",
    message: err.message 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: "Endpoint not found",
    path: req.path 
  });
});

// Export the Cloud Function that Firebase will mount at runtime.
exports.api = functions.https.onRequest(app);