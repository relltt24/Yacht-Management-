# AI Yacht Management Backend API Documentation

## Base URL
```
https://your-firebase-deployment-url.web.app
```

## Overview
This backend provides comprehensive RESTful API endpoints for managing a yacht fleet, including yacht management, crew assignments, maintenance scheduling, bookings, inventory tracking, and AI-ready analytics.

## Response Format
All responses follow this format:
```json
{
  "success": true,
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "error": "Error message"
}
```

## Endpoints

### System

#### GET /
Get API information and available endpoints
```json
{
  "message": "AI Yacht Management Backend API",
  "version": "1.0.0",
  "endpoints": {
    "yachts": "/api/yachts",
    "crew": "/api/crew",
    "maintenance": "/api/maintenance",
    "bookings": "/api/bookings",
    "inventory": "/api/inventory",
    "analytics": "/api/analytics"
  }
}
```

#### GET /healthz
Health check endpoint for monitoring
```
Response: "ok"
```

---

## Yacht Management

### GET /api/yachts
Get all yachts with optional filtering

**Query Parameters:**
- `status` (optional): Filter by status (available, in-service, maintenance)
- `type` (optional): Filter by type (Motor Yacht, Sailing Yacht, Catamaran, etc.)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Ocean Serenity",
      "type": "Motor Yacht",
      "length": 85,
      "capacity": 12,
      "status": "available"
    }
  ]
}
```

### GET /api/yachts/:id
Get detailed information about a specific yacht including related crew, maintenance, bookings, and inventory

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Ocean Serenity",
    "type": "Motor Yacht",
    "length": 85,
    "capacity": 12,
    "status": "available",
    "crew": [...],
    "maintenance": [...],
    "bookings": [...],
    "inventory": [...]
  }
}
```

### POST /api/yachts
Create a new yacht

**Request Body:**
```json
{
  "name": "Sea Explorer",
  "type": "Catamaran",
  "length": 55,
  "capacity": 10,
  "status": "available"
}
```

**Required fields:** name, type, length, capacity

### PUT /api/yachts/:id
Update yacht information

**Request Body:** Any fields to update
```json
{
  "status": "maintenance",
  "capacity": 14
}
```

### DELETE /api/yachts/:id
Delete a yacht

---

## Crew Management

### GET /api/crew
Get all crew members with optional filtering

**Query Parameters:**
- `yachtId` (optional): Filter by yacht assignment
- `position` (optional): Filter by position

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "name": "Captain John Smith",
      "position": "Captain",
      "yachtId": 1,
      "certifications": ["Master 500 Ton"]
    }
  ]
}
```

### GET /api/crew/:id
Get single crew member details

### POST /api/crew
Create new crew member

**Request Body:**
```json
{
  "name": "John Smith",
  "position": "Captain",
  "yachtId": 1,
  "certifications": ["Master 500 Ton", "STCW"]
}
```

**Required fields:** name, position

### PUT /api/crew/:id
Update crew member information

### DELETE /api/crew/:id
Delete crew member

---

## Maintenance Management

### GET /api/maintenance
Get all maintenance records with optional filtering

**Query Parameters:**
- `yachtId` (optional): Filter by yacht
- `status` (optional): Filter by status (pending, in-progress, completed)

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "yachtId": 1,
      "type": "Engine Service",
      "scheduledDate": "2025-11-01",
      "status": "pending",
      "notes": "Regular maintenance check"
    }
  ]
}
```

### GET /api/maintenance/:id
Get single maintenance record

### POST /api/maintenance
Create new maintenance record

**Request Body:**
```json
{
  "yachtId": 1,
  "type": "Engine Service",
  "scheduledDate": "2025-11-01",
  "status": "pending",
  "notes": "Regular maintenance check"
}
```

**Required fields:** yachtId, type, scheduledDate

### PUT /api/maintenance/:id
Update maintenance record

### DELETE /api/maintenance/:id
Delete maintenance record

---

## Booking Management

### GET /api/bookings
Get all bookings with optional filtering

**Query Parameters:**
- `yachtId` (optional): Filter by yacht
- `status` (optional): Filter by status (pending, confirmed, completed, cancelled)

**Response:**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "id": 1,
      "yachtId": 1,
      "clientName": "John Doe",
      "startDate": "2025-11-15",
      "endDate": "2025-11-20",
      "status": "confirmed"
    }
  ]
}
```

### GET /api/bookings/:id
Get single booking details

### POST /api/bookings
Create new booking

**Request Body:**
```json
{
  "yachtId": 1,
  "clientName": "John Doe",
  "startDate": "2025-11-15",
  "endDate": "2025-11-20",
  "status": "pending"
}
```

**Required fields:** yachtId, clientName, startDate, endDate

### PUT /api/bookings/:id
Update booking

### DELETE /api/bookings/:id
Delete booking

---

## Inventory Management

### GET /api/inventory
Get all inventory items with optional filtering

**Query Parameters:**
- `yachtId` (optional): Filter by yacht
- `category` (optional): Filter by category (Safety, Consumables, etc.)

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "id": 1,
      "yachtId": 1,
      "item": "Life Jackets",
      "quantity": 15,
      "category": "Safety",
      "lastChecked": "2025-10-01"
    }
  ]
}
```

### GET /api/inventory/:id
Get single inventory item

### POST /api/inventory
Create new inventory item

**Request Body:**
```json
{
  "yachtId": 1,
  "item": "Life Jackets",
  "quantity": 15,
  "category": "Safety",
  "unit": "pieces",
  "lastChecked": "2025-10-01"
}
```

**Required fields:** yachtId, item, quantity

### PUT /api/inventory/:id
Update inventory item

### DELETE /api/inventory/:id
Delete inventory item

---

## AI Analytics Endpoints

### GET /api/analytics/fleet-overview
Get comprehensive fleet statistics for AI analysis

**Response:**
```json
{
  "success": true,
  "data": {
    "totalYachts": 3,
    "yachtsByStatus": {
      "available": 2,
      "maintenance": 1
    },
    "yachtsByType": {
      "Motor Yacht": 1,
      "Sailing Yacht": 2
    },
    "totalCapacity": 30,
    "averageLength": 68.33
  }
}
```

### GET /api/analytics/maintenance-insights
Get maintenance analytics for predictive maintenance AI

**Response:**
```json
{
  "success": true,
  "data": {
    "totalMaintenanceRecords": 5,
    "maintenanceByStatus": {
      "pending": 2,
      "completed": 3
    },
    "maintenanceByType": {
      "Engine Service": 2,
      "Hull Inspection": 1
    },
    "upcomingMaintenance": 2
  }
}
```

### GET /api/analytics/booking-insights
Get booking analytics for revenue optimization

**Response:**
```json
{
  "success": true,
  "data": {
    "totalBookings": 10,
    "bookingsByStatus": {
      "confirmed": 5,
      "pending": 3,
      "completed": 2
    },
    "bookingsByYacht": {
      "Ocean Serenity": 5,
      "Wind Dancer": 5
    },
    "upcomingBookings": 5
  }
}
```

### GET /api/analytics/crew-utilization
Get crew analytics for AI staffing optimization

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCrew": 15,
    "crewByPosition": {
      "Captain": 3,
      "Chef": 2,
      "Deckhand": 10
    },
    "assignedCrew": 12,
    "unassignedCrew": 3,
    "crewByYacht": {
      "Ocean Serenity": 6,
      "Wind Dancer": 6
    }
  }
}
```

### GET /api/analytics/inventory-status
Get inventory analytics for supply chain optimization

**Response:**
```json
{
  "success": true,
  "data": {
    "totalItems": 50,
    "itemsByCategory": {
      "Safety": 15,
      "Consumables": 20,
      "Equipment": 15
    },
    "lowStockItems": 5,
    "itemsByYacht": {
      "Ocean Serenity": 25,
      "Wind Dancer": 25
    }
  }
}
```

### GET /api/analytics/dashboard
Get comprehensive dashboard data for AI processing

**Response:**
```json
{
  "success": true,
  "data": {
    "fleet": {
      "total": 3,
      "available": 2,
      "inService": 0,
      "maintenance": 1
    },
    "crew": {
      "total": 15,
      "assigned": 12
    },
    "bookings": {
      "total": 10,
      "confirmed": 5,
      "pending": 3
    },
    "maintenance": {
      "total": 5,
      "pending": 2,
      "completed": 3
    },
    "inventory": {
      "total": 50,
      "lowStock": 5
    }
  }
}
```

---

## CORS Support

The API supports Cross-Origin Resource Sharing (CORS) for frontend integration:
- Allows all origins (`*`)
- Supports GET, POST, PUT, DELETE, OPTIONS methods
- Accepts standard headers including Authorization

---

## Error Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (missing required fields)
- `404` - Not Found
- `500` - Internal Server Error

---

## Data Persistence

**Current Implementation:** In-memory storage (data resets on server restart)

**For Production:** Replace in-memory storage with:
- Firebase Firestore
- PostgreSQL
- MongoDB
- Or any other database of your choice

---

## AI Integration Tips

This backend is designed to support AI applications with:

1. **Analytics Endpoints:** Pre-aggregated data perfect for ML models
2. **Structured Data:** Consistent JSON format for easy parsing
3. **Comprehensive Data:** All related entities accessible via detailed endpoints
4. **Flexible Filtering:** Query parameters for targeted data retrieval
5. **CORS Enabled:** Ready for frontend AI applications

### Suggested AI Use Cases:
- Predictive maintenance scheduling based on historical data
- Crew assignment optimization using utilization metrics
- Revenue optimization through booking pattern analysis
- Inventory forecasting using consumption patterns
- Fleet utilization optimization

---

## Example Usage

### JavaScript (Fetch API)
```javascript
// Get all yachts
const response = await fetch('https://your-api-url.com/api/yachts');
const data = await response.json();

// Create a new booking
const booking = await fetch('https://your-api-url.com/api/bookings', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    yachtId: 1,
    clientName: "Jane Smith",
    startDate: "2025-12-01",
    endDate: "2025-12-05",
    status: "pending"
  })
});
```

### Python
```python
import requests

# Get analytics dashboard
response = requests.get('https://your-api-url.com/api/analytics/dashboard')
data = response.json()

# Update yacht status
requests.put('https://your-api-url.com/api/yachts/1', 
  json={'status': 'maintenance'})
```

---

## Support
For issues or questions, please open an issue in the GitHub repository.
