#!/bin/bash

# Test script for AI Yacht Management Backend API
# Usage: ./test-api.sh [base-url]
# Example: ./test-api.sh http://localhost:8080
#          ./test-api.sh https://your-firebase-app.web.app

BASE_URL=${1:-http://localhost:8080}

echo "🚢 Testing AI Yacht Management Backend API"
echo "Base URL: $BASE_URL"
echo "----------------------------------------"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test function
test_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    local data=$4
    
    echo -e "\n${BLUE}Testing: $description${NC}"
    echo "Endpoint: $method $endpoint"
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    # Extract status code (last line)
    http_code=$(echo "$response" | tail -n1)
    # Extract body (all but last line)
    body=$(echo "$response" | sed '$d')
    
    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        echo -e "${GREEN}✓ Success (HTTP $http_code)${NC}"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
    else
        echo -e "${RED}✗ Failed (HTTP $http_code)${NC}"
        echo "$body"
    fi
}

# Health Check
test_endpoint "GET" "/healthz" "Health Check"

# System Info
test_endpoint "GET" "/" "API Information"

# Yacht Tests
echo -e "\n${BLUE}=== YACHT MANAGEMENT ===${NC}"
test_endpoint "GET" "/api/yachts" "Get All Yachts"
test_endpoint "GET" "/api/yachts/1" "Get Yacht Details (ID: 1)"
test_endpoint "POST" "/api/yachts" "Create New Yacht" \
    '{"name":"Test Yacht","type":"Motor Yacht","length":70,"capacity":10,"status":"available"}'
test_endpoint "GET" "/api/yachts?status=available" "Filter Yachts by Status"

# Crew Tests
echo -e "\n${BLUE}=== CREW MANAGEMENT ===${NC}"
test_endpoint "GET" "/api/crew" "Get All Crew Members"
test_endpoint "GET" "/api/crew/1" "Get Crew Member (ID: 1)"
test_endpoint "POST" "/api/crew" "Create New Crew Member" \
    '{"name":"Test Captain","position":"Captain","yachtId":1,"certifications":["Master License"]}'
test_endpoint "GET" "/api/crew?yachtId=1" "Filter Crew by Yacht"

# Maintenance Tests
echo -e "\n${BLUE}=== MAINTENANCE MANAGEMENT ===${NC}"
test_endpoint "GET" "/api/maintenance" "Get All Maintenance Records"
test_endpoint "GET" "/api/maintenance/1" "Get Maintenance Record (ID: 1)"
test_endpoint "POST" "/api/maintenance" "Create Maintenance Record" \
    '{"yachtId":1,"type":"Engine Service","scheduledDate":"2025-12-01","status":"pending","notes":"Test maintenance"}'

# Booking Tests
echo -e "\n${BLUE}=== BOOKING MANAGEMENT ===${NC}"
test_endpoint "GET" "/api/bookings" "Get All Bookings"
test_endpoint "GET" "/api/bookings/1" "Get Booking (ID: 1)"
test_endpoint "POST" "/api/bookings" "Create New Booking" \
    '{"yachtId":1,"clientName":"Test Client","startDate":"2025-12-10","endDate":"2025-12-15","status":"pending"}'

# Inventory Tests
echo -e "\n${BLUE}=== INVENTORY MANAGEMENT ===${NC}"
test_endpoint "GET" "/api/inventory" "Get All Inventory Items"
test_endpoint "GET" "/api/inventory/1" "Get Inventory Item (ID: 1)"
test_endpoint "POST" "/api/inventory" "Create Inventory Item" \
    '{"yachtId":1,"item":"Test Item","quantity":50,"category":"General","unit":"pieces"}'

# Analytics Tests
echo -e "\n${BLUE}=== ANALYTICS ===${NC}"
test_endpoint "GET" "/api/analytics/dashboard" "Dashboard Analytics"
test_endpoint "GET" "/api/analytics/fleet-overview" "Fleet Overview"
test_endpoint "GET" "/api/analytics/maintenance-insights" "Maintenance Insights"
test_endpoint "GET" "/api/analytics/booking-insights" "Booking Insights"
test_endpoint "GET" "/api/analytics/crew-utilization" "Crew Utilization"
test_endpoint "GET" "/api/analytics/inventory-status" "Inventory Status"

# Summary
echo -e "\n${BLUE}========================================${NC}"
echo -e "${GREEN}✓ API Testing Complete${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo "Full API documentation: $BASE_URL/API_DOCUMENTATION.md"
echo "For more details, visit: $BASE_URL"
