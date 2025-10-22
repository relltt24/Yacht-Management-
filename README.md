# AI Yacht Management System

A comprehensive backend system for managing yacht fleets, crew, maintenance, bookings, and inventory with AI-ready analytics endpoints.

## Features

### Core Management
- **Yacht Management**: Complete CRUD operations for yacht fleet
- **Crew Management**: Assign and track crew members across vessels
- **Maintenance Scheduling**: Track and schedule maintenance tasks
- **Booking System**: Manage yacht charters and reservations
- **Inventory Tracking**: Monitor supplies and equipment across all yachts

### AI-Ready Analytics
- **Fleet Overview**: Real-time fleet statistics and utilization
- **Maintenance Insights**: Predictive maintenance data
- **Booking Analytics**: Revenue optimization metrics
- **Crew Utilization**: Staffing optimization data
- **Inventory Status**: Supply chain analytics
- **Comprehensive Dashboard**: Unified view for AI processing

## Tech Stack

- **Runtime**: Node.js 20
- **Framework**: Express.js
- **Deployment**: Firebase App Hosting
- **API**: RESTful JSON API with CORS support

## Quick Start

### Installation

```bash
npm install
```

### Run Locally

```bash
npm start
```

The server will start on port 8080. Visit http://localhost:8080 to see available endpoints.

### Test the API

Run the comprehensive test suite:

```bash
./test-api.sh http://localhost:8080
```

Or test a deployed instance:

```bash
./test-api.sh https://your-firebase-app.web.app
```

### Deploy to Firebase

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deploy:
```bash
firebase deploy
```

## API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference including:
- All available endpoints
- Request/response formats
- Query parameters
- Example usage in JavaScript and Python

## Project Structure

```
.
├── server.js              # Main backend server
├── package.json           # Dependencies
├── firebase.json          # Firebase hosting configuration
├── apphosting.yaml        # App hosting runtime configuration
├── Index.html             # Landing page
├── API_DOCUMENTATION.md   # Complete API reference
├── DEPLOYMENT.md          # Deployment guide
├── SECURITY.md            # Security best practices
├── test-api.sh            # API testing script
└── README.md              # This file
```

## Environment Variables

- `PORT`: Server port (default: 8080)

## API Endpoints Overview

### System
- `GET /` - HTML frontend interface
- `GET /api` - API information (JSON)
- `GET /healthz` - Health check

### Management Endpoints
- `/api/yachts` - Yacht fleet management
- `/api/crew` - Crew member management
- `/api/maintenance` - Maintenance scheduling
- `/api/bookings` - Charter bookings
- `/api/inventory` - Inventory tracking

### Analytics Endpoints
- `/api/analytics/fleet-overview` - Fleet statistics
- `/api/analytics/maintenance-insights` - Maintenance metrics
- `/api/analytics/booking-insights` - Booking analytics
- `/api/analytics/crew-utilization` - Crew metrics
- `/api/analytics/inventory-status` - Inventory analytics
- `/api/analytics/dashboard` - Comprehensive dashboard

## Example Requests

### Get All Yachts
```bash
curl https://your-firebase-url.web.app/api/yachts
```

### Create a New Booking
```bash
curl -X POST https://your-firebase-url.web.app/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "yachtId": 1,
    "clientName": "John Doe",
    "startDate": "2025-12-01",
    "endDate": "2025-12-05"
  }'
```

### Get Analytics Dashboard
```bash
curl https://your-firebase-url.web.app/api/analytics/dashboard
```

## Data Models

### Yacht
```javascript
{
  id: number,
  name: string,
  type: string,
  length: number,
  capacity: number,
  status: string
}
```

### Crew Member
```javascript
{
  id: number,
  name: string,
  position: string,
  yachtId: number,
  certifications: string[]
}
```

### Maintenance Record
```javascript
{
  id: number,
  yachtId: number,
  type: string,
  scheduledDate: string,
  status: string,
  notes: string
}
```

### Booking
```javascript
{
  id: number,
  yachtId: number,
  clientName: string,
  startDate: string,
  endDate: string,
  status: string
}
```

### Inventory Item
```javascript
{
  id: number,
  yachtId: number,
  item: string,
  quantity: number,
  category: string,
  unit: string,
  lastChecked: string
}
```

## Development

### Current Implementation
The backend currently uses in-memory storage for rapid development and testing. Data persists only while the server is running.

### Production Considerations
For production deployment, consider:

1. **Database Integration**: Replace in-memory storage with:
   - Firebase Firestore (recommended for Firebase hosting)
   - PostgreSQL
   - MongoDB
   
2. **Authentication**: Add authentication middleware:
   - Firebase Auth
   - JWT tokens
   - OAuth 2.0

3. **Rate Limiting**: Implement API rate limiting

4. **Logging**: Add comprehensive logging:
   - Request logging
   - Error tracking
   - Performance monitoring

5. **Validation**: Enhanced input validation with libraries like Joi or express-validator

6. **Testing**: Add unit and integration tests

## AI Integration

This backend is specifically designed to support AI applications:

### Analytics for ML Models
All analytics endpoints provide pre-aggregated data perfect for:
- Time series forecasting
- Classification models
- Clustering analysis
- Anomaly detection

### Recommended AI Applications
1. **Predictive Maintenance**: Use maintenance history to predict future service needs
2. **Dynamic Pricing**: Optimize booking prices based on demand patterns
3. **Crew Optimization**: AI-powered crew assignment and scheduling
4. **Inventory Forecasting**: Predict supply needs based on usage patterns
5. **Fleet Utilization**: Optimize yacht deployment across locations

### Data Export
All endpoints return JSON data that can be directly consumed by:
- Python ML libraries (scikit-learn, TensorFlow, PyTorch)
- JavaScript ML libraries (TensorFlow.js, Brain.js)
- Data analysis tools (Pandas, NumPy)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue in the GitHub repository.

## Roadmap

- [ ] Database integration (Firestore)
- [ ] Authentication system
- [ ] Real-time updates with WebSockets
- [ ] Advanced filtering and search
- [ ] File upload for yacht documents
- [ ] Email notifications for bookings and maintenance
- [ ] Multi-language support
- [ ] Mobile app API endpoints
- [ ] GraphQL alternative endpoint
