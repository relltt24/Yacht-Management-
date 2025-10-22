# GitHub Copilot Instructions - AI Yacht Management System

## Project Overview

This is a Node.js backend API for managing yacht fleets, crew, maintenance, bookings, and inventory with AI-ready analytics endpoints. The application is designed for Firebase App Hosting deployment.

## Code Style and Formatting

- **Module System**: Use ES modules (`import`/`export`) syntax exclusively
- **Quotes**: Use double quotes for strings
- **Indentation**: Use 2 spaces for indentation
- **Semicolons**: Use semicolons at the end of statements
- **Variable Declarations**: Prefer `const` over `let`, avoid `var`
- **Arrow Functions**: Prefer arrow functions for callbacks and short functions
- **Async/Await**: Use async/await instead of promise chains where possible

## Framework and Libraries

- **Express.js**: Primary web framework for REST API
- **Firebase**: Used for deployment (App Hosting)
- **No Database**: Currently uses in-memory data stores (do not add database dependencies without discussion)

## API Conventions

### Response Format

All API responses should follow these patterns:

**Success responses:**
```javascript
res.json({ 
  success: true, 
  count: items.length, 
  data: items 
});
```

**Error responses:**
```javascript
const errorResponse = (res, status, message) => {
  res.status(status).json({ error: message });
};
```

### Endpoint Structure

- Health check: `/healthz` (simple text "ok")
- API root: `/` (returns API information)
- Management endpoints: `/api/{resource}` (yachts, crew, maintenance, bookings, inventory)
- Analytics endpoints: `/api/analytics/{type}`

### Query Parameters

- Support filtering via query parameters (e.g., `?status=available&type=Motor%20Yacht`)
- Use `req.query` for filters
- Filter arrays using `.filter()` method

## Security Practices

### Input Validation

- **Required Fields**: Always validate required fields in POST/PUT requests
- **ID Validation**: Parse and validate ID parameters as integers using `parseInt()`
- **Type Checking**: Validate data types before processing
- **Sanitization**: Do not trust user input, validate all incoming data

Example validation pattern:
```javascript
if (!req.body.name || !req.body.type) {
  return errorResponse(res, 400, "Name and type are required");
}
```

### CORS

- Current implementation uses wildcard CORS (`*`) for development
- For production, restrict CORS to specific domains
- Keep OPTIONS method handling for preflight requests

### Error Handling

- Never expose sensitive information in error messages
- Use generic error messages for production
- Log detailed errors server-side (when logging is implemented)
- Always return proper HTTP status codes (404, 400, 500, etc.)

### Authentication

- **Current State**: No authentication implemented
- **Future Implementation**: When adding authentication, use Firebase Auth
- Do not add authentication middleware without explicit requirements

## Data Models

Maintain consistency with existing data models:

**Yacht**: `{ id, name, type, length, capacity, status }`
**Crew**: `{ id, name, position, yachtId, certifications[] }`
**Maintenance**: `{ id, yachtId, type, scheduledDate, status, notes }`
**Booking**: `{ id, yachtId, clientName, startDate, endDate, status }`
**Inventory**: `{ id, yachtId, item, quantity, category, unit, lastChecked }`

## Testing

- Use the existing `test-api.sh` script for API testing
- Manual testing should be performed by running `npm start` and testing endpoints
- Test both success and error cases
- Verify query parameter filtering works correctly

## Documentation

- Keep API_DOCUMENTATION.md updated with any new endpoints
- Document request/response formats for all endpoints
- Include example requests using curl
- Document query parameters and their effects

## Dependencies

- **Minimal Dependencies**: Keep dependencies minimal (only express and firebase)
- **No Dev Dependencies**: Avoid adding build tools, testing frameworks, or linters unless explicitly required
- **Justification Required**: Any new dependency must have a clear justification

## Common Patterns

### CRUD Operations

Follow the established CRUD pattern:
- **GET /api/{resource}**: List all with optional filters
- **GET /api/{resource}/:id**: Get single item with related data
- **POST /api/{resource}**: Create new item
- **PUT /api/{resource}/:id**: Update existing item
- **DELETE /api/{resource}/:id**: Delete item

### ID Generation

Use simple incrementing IDs:
```javascript
const newId = Math.max(...items.map(i => i.id), 0) + 1;
```

### Array Filtering

Use functional array methods:
```javascript
const filtered = items.filter(item => item.status === status);
```

## Deployment

- **Target Platform**: Firebase App Hosting
- **Port**: Use PORT environment variable (default: 8080)
- **Build**: Simple echo command (no complex build process)
- **Configuration Files**: firebase.json and apphosting.yaml must remain compatible

## AI and Analytics

- Analytics endpoints provide pre-aggregated data for ML/AI applications
- Return comprehensive statistics with counts, averages, and distributions
- Keep analytics endpoints read-only (GET only)
- Format data for easy consumption by data analysis tools

## File Structure

Do not modify:
- `package.json`: Keep dependencies minimal
- `firebase.json`: Firebase hosting configuration
- `apphosting.yaml`: Runtime configuration
- `Index.html`: Static landing page

Main application file:
- `server.js`: All API logic (keep monolithic for simplicity)

## What NOT to Do

- ❌ Do not add database connections without discussion
- ❌ Do not add authentication middleware without explicit requirements
- ❌ Do not add complex build processes or transpilation
- ❌ Do not add testing frameworks without discussion
- ❌ Do not modify the in-memory storage pattern without discussion
- ❌ Do not add environment variables beyond PORT
- ❌ Do not add logging frameworks without discussion
- ❌ Do not change the module system from ES modules to CommonJS

## Priority Guidelines

When making changes:

1. **Maintain Simplicity**: This is a demonstration/development API - keep it simple
2. **Consistency**: Follow existing patterns and conventions
3. **Documentation**: Update documentation for any API changes
4. **Security**: Always validate input and handle errors properly
5. **Testing**: Test manually using npm start and the test script
