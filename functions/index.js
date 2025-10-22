const functions = require('firebase-functions');
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration for frontend integration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// In-memory data stores (replace with database in production)
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
  { id: 2, yachtId: 1, item: "Fuel", quantity: 850, unit: "gallons", category: "Consumables" }
];

// Helper function for error responses
const errorResponse = (res, status, message) => {
  res.status(status).json({ error: message });
};

// Health check
app.get("/healthz", (req, res) => res.send("ok"));

// Root endpoint
app.get("/", (req, res) => {
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

// ===== YACHT ENDPOINTS =====

// Get all yachts
app.get("/api/yachts", (req, res) => {
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
app.get("/api/yachts/:id", (req, res) => {
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
app.post("/api/yachts", (req, res) => {
  const { name, type, length, capacity, status } = req.body;
  
  if (!name || !type || !length || !capacity) {
    return errorResponse(res, 400, "Missing required fields: name, type, length, capacity");
  }
  
  const newYacht = {
    id: Math.max(...yachts.map(y => y.id), 0) + 1,
    name,
    type,
    length,
    capacity,
    status: status || "available"
  };
  
  yachts.push(newYacht);
  res.status(201).json({ success: true, data: newYacht });
});

// Update yacht
app.put("/api/yachts/:id", (req, res) => {
  const index = yachts.findIndex(y => y.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Yacht not found");
  }
  
  yachts[index] = { ...yachts[index], ...req.body, id: yachts[index].id };
  res.json({ success: true, data: yachts[index] });
});

// Delete yacht
app.delete("/api/yachts/:id", (req, res) => {
  const index = yachts.findIndex(y => y.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Yacht not found");
  }
  
  yachts.splice(index, 1);
  res.json({ success: true, message: "Yacht deleted successfully" });
});

// ===== CREW ENDPOINTS =====

// Get all crew
app.get("/api/crew", (req, res) => {
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
app.get("/api/crew/:id", (req, res) => {
  const member = crew.find(c => c.id === parseInt(req.params.id));
  if (!member) {
    return errorResponse(res, 404, "Crew member not found");
  }
  res.json({ success: true, data: member });
});

// Create new crew member
app.post("/api/crew", (req, res) => {
  const { name, position, yachtId, certifications } = req.body;
  
  if (!name || !position) {
    return errorResponse(res, 400, "Missing required fields: name, position");
  }
  
  const newMember = {
    id: Math.max(...crew.map(c => c.id), 0) + 1,
    name,
    position,
    yachtId: yachtId || null,
    certifications: certifications || []
  };
  
  crew.push(newMember);
  res.status(201).json({ success: true, data: newMember });
});

// Update crew member
app.put("/api/crew/:id", (req, res) => {
  const index = crew.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Crew member not found");
  }
  
  crew[index] = { ...crew[index], ...req.body, id: crew[index].id };
  res.json({ success: true, data: crew[index] });
});

// Delete crew member
app.delete("/api/crew/:id", (req, res) => {
  const index = crew.findIndex(c => c.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Crew member not found");
  }
  
  crew.splice(index, 1);
  res.json({ success: true, message: "Crew member deleted successfully" });
});

// ===== MAINTENANCE ENDPOINTS =====

// Get all maintenance records
app.get("/api/maintenance", (req, res) => {
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
app.get("/api/maintenance/:id", (req, res) => {
  const record = maintenance.find(m => m.id === parseInt(req.params.id));
  if (!record) {
    return errorResponse(res, 404, "Maintenance record not found");
  }
  res.json({ success: true, data: record });
});

// Create new maintenance record
app.post("/api/maintenance", (req, res) => {
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
app.put("/api/maintenance/:id", (req, res) => {
  const index = maintenance.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Maintenance record not found");
  }
  
  maintenance[index] = { ...maintenance[index], ...req.body, id: maintenance[index].id };
  res.json({ success: true, data: maintenance[index] });
});

// Delete maintenance record
app.delete("/api/maintenance/:id", (req, res) => {
  const index = maintenance.findIndex(m => m.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Maintenance record not found");
  }
  
  maintenance.splice(index, 1);
  res.json({ success: true, message: "Maintenance record deleted successfully" });
});

// ===== BOOKING ENDPOINTS =====

// Get all bookings
app.get("/api/bookings", (req, res) => {
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
app.get("/api/bookings/:id", (req, res) => {
  const booking = bookings.find(b => b.id === parseInt(req.params.id));
  if (!booking) {
    return errorResponse(res, 404, "Booking not found");
  }
  res.json({ success: true, data: booking });
});

// Create new booking
app.post("/api/bookings", (req, res) => {
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
app.put("/api/bookings/:id", (req, res) => {
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Booking not found");
  }
  
  bookings[index] = { ...bookings[index], ...req.body, id: bookings[index].id };
  res.json({ success: true, data: bookings[index] });
});

// Delete booking
app.delete("/api/bookings/:id", (req, res) => {
  const index = bookings.findIndex(b => b.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Booking not found");
  }
  
  bookings.splice(index, 1);
  res.json({ success: true, message: "Booking deleted successfully" });
});

// ===== INVENTORY ENDPOINTS =====

// Get all inventory items
app.get("/api/inventory", (req, res) => {
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
app.get("/api/inventory/:id", (req, res) => {
  const item = inventory.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return errorResponse(res, 404, "Inventory item not found");
  }
  res.json({ success: true, data: item });
});

// Create new inventory item
app.post("/api/inventory", (req, res) => {
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
app.put("/api/inventory/:id", (req, res) => {
  const index = inventory.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Inventory item not found");
  }
  
  inventory[index] = { ...inventory[index], ...req.body, id: inventory[index].id };
  res.json({ success: true, data: inventory[index] });
});

// Delete inventory item
app.delete("/api/inventory/:id", (req, res) => {
  const index = inventory.findIndex(i => i.id === parseInt(req.params.id));
  if (index === -1) {
    return errorResponse(res, 404, "Inventory item not found");
  }
  
  inventory.splice(index, 1);
  res.json({ success: true, message: "Inventory item deleted successfully" });
});

// ===== AI ANALYTICS ENDPOINTS =====

// Get fleet overview for AI analysis
app.get("/api/analytics/fleet-overview", (req, res) => {
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
app.get("/api/analytics/maintenance-insights", (req, res) => {
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
app.get("/api/analytics/booking-insights", (req, res) => {
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
app.get("/api/analytics/crew-utilization", (req, res) => {
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
app.get("/api/analytics/inventory-status", (req, res) => {
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
app.get("/api/analytics/dashboard", (req, res) => {
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

// Error handling middleware
app.use((err, req, res, next) => {
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

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);