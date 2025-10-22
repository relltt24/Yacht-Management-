#!/bin/bash
# Comprehensive API Test Suite for AI Yacht Management Backend
# Tests all endpoints to verify functionality

set -e

BASE_URL="${1:-http://localhost:8080}"

echo "🧪 AI Yacht Management Backend - Comprehensive Test Suite"
echo "=========================================================="
echo "Testing API at: $BASE_URL"
echo ""

# Start local server if testing localhost
if [[ "$BASE_URL" == "http://localhost:8080" ]]; then
    echo "Starting local server..."
    npm start &
    SERVER_PID=$!
    sleep 3
    echo "Server started (PID: $SERVER_PID)"
    echo ""
fi

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Function to test endpoint
test_endpoint() {
    local name="$1"
    local method="$2"
    local endpoint="$3"
    local data="$4"
    local expected_status="${5:-200}"
    
    echo -n "Testing: $name ... "
    
    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X "$method" "$BASE_URL$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    fi
    
    status_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$status_code" -eq "$expected_status" ]; then
        echo -e "${GREEN}✓ PASSED${NC} (Status: $status_code)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        return 0
    else
        echo -e "${RED}✗ FAILED${NC} (Expected: $expected_status, Got: $status_code)"
        echo "Response: $body"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        return 1
    fi
}

echo "=== System Endpoints ==="
test_endpoint "Health Check" "GET" "/healthz"
test_endpoint "Root API Info" "GET" "/"
echo ""

echo "=== Yacht Endpoints ==="
test_endpoint "Get All Yachts" "GET" "/api/yachts"
test_endpoint "Get Single Yacht" "GET" "/api/yachts/1"
test_endpoint "Filter Yachts by Status" "GET" "/api/yachts?status=available"
test_endpoint "Filter Yachts by Type" "GET" "/api/yachts?type=Motor%20Yacht"
test_endpoint "Create New Yacht" "POST" "/api/yachts" \
    '{"name":"Test Yacht","type":"Motor Yacht","length":80,"capacity":12}' 201
test_endpoint "Update Yacht" "PUT" "/api/yachts/1" \
    '{"status":"maintenance"}'
test_endpoint "Get Non-existent Yacht" "GET" "/api/yachts/999" "" 404
echo ""

echo "=== Crew Endpoints ==="
test_endpoint "Get All Crew" "GET" "/api/crew"
test_endpoint "Get Single Crew Member" "GET" "/api/crew/1"
test_endpoint "Filter Crew by Yacht" "GET" "/api/crew?yachtId=1"
test_endpoint "Filter Crew by Position" "GET" "/api/crew?position=Captain"
test_endpoint "Create New Crew Member" "POST" "/api/crew" \
    '{"name":"Test Captain","position":"Captain","certifications":["License"]}' 201
test_endpoint "Update Crew Member" "PUT" "/api/crew/1" \
    '{"position":"Senior Captain"}'
test_endpoint "Get Non-existent Crew" "GET" "/api/crew/999" "" 404
echo ""

echo "=== Maintenance Endpoints ==="
test_endpoint "Get All Maintenance" "GET" "/api/maintenance"
test_endpoint "Get Single Maintenance" "GET" "/api/maintenance/1"
test_endpoint "Filter Maintenance by Yacht" "GET" "/api/maintenance?yachtId=1"
test_endpoint "Filter Maintenance by Status" "GET" "/api/maintenance?status=pending"
test_endpoint "Create Maintenance Record" "POST" "/api/maintenance" \
    '{"yachtId":1,"type":"Engine Check","scheduledDate":"2025-12-01"}' 201
test_endpoint "Update Maintenance" "PUT" "/api/maintenance/1" \
    '{"status":"completed"}'
test_endpoint "Get Non-existent Maintenance" "GET" "/api/maintenance/999" "" 404
echo ""

echo "=== Booking Endpoints ==="
test_endpoint "Get All Bookings" "GET" "/api/bookings"
test_endpoint "Get Single Booking" "GET" "/api/bookings/1"
test_endpoint "Filter Bookings by Yacht" "GET" "/api/bookings?yachtId=1"
test_endpoint "Filter Bookings by Status" "GET" "/api/bookings?status=confirmed"
test_endpoint "Create New Booking" "POST" "/api/bookings" \
    '{"yachtId":1,"clientName":"Test Client","startDate":"2025-12-01","endDate":"2025-12-05"}' 201
test_endpoint "Update Booking" "PUT" "/api/bookings/1" \
    '{"status":"completed"}'
test_endpoint "Get Non-existent Booking" "GET" "/api/bookings/999" "" 404
echo ""

echo "=== Inventory Endpoints ==="
test_endpoint "Get All Inventory" "GET" "/api/inventory"
test_endpoint "Get Single Inventory Item" "GET" "/api/inventory/1"
test_endpoint "Filter Inventory by Yacht" "GET" "/api/inventory?yachtId=1"
test_endpoint "Filter Inventory by Category" "GET" "/api/inventory?category=Safety"
test_endpoint "Create Inventory Item" "POST" "/api/inventory" \
    '{"yachtId":1,"item":"Test Item","quantity":5,"category":"Test"}' 201
test_endpoint "Update Inventory" "PUT" "/api/inventory/1" \
    '{"quantity":20}'
test_endpoint "Get Non-existent Inventory" "GET" "/api/inventory/999" "" 404
echo ""

echo "=== Analytics Endpoints ==="
test_endpoint "Fleet Overview" "GET" "/api/analytics/fleet-overview"
test_endpoint "Maintenance Insights" "GET" "/api/analytics/maintenance-insights"
test_endpoint "Booking Insights" "GET" "/api/analytics/booking-insights"
test_endpoint "Crew Utilization" "GET" "/api/analytics/crew-utilization"
test_endpoint "Inventory Status" "GET" "/api/analytics/inventory-status"
test_endpoint "Dashboard Analytics" "GET" "/api/analytics/dashboard"
echo ""

echo "=== Error Handling ==="
test_endpoint "Invalid Endpoint" "GET" "/api/invalid" "" 404
test_endpoint "Create Yacht - Missing Fields" "POST" "/api/yachts" \
    '{"name":"Incomplete"}' 400
test_endpoint "Create Crew - Missing Fields" "POST" "/api/crew" \
    '{"name":"Incomplete"}' 400
test_endpoint "Create Maintenance - Missing Fields" "POST" "/api/maintenance" \
    '{"yachtId":1}' 400
test_endpoint "Create Booking - Missing Fields" "POST" "/api/bookings" \
    '{"yachtId":1}' 400
test_endpoint "Create Inventory - Missing Fields" "POST" "/api/inventory" \
    '{"yachtId":1}' 400
echo ""

# Clean up
if [[ "$BASE_URL" == "http://localhost:8080" ]]; then
    echo "Stopping local server..."
    kill $SERVER_PID 2>/dev/null
    wait $SERVER_PID 2>/dev/null || true
    echo "Server stopped"
    echo ""
fi

# Summary
echo "=========================================================="
echo "Test Summary:"
echo -e "${GREEN}Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Failed: $TESTS_FAILED${NC}"
echo "Total: $((TESTS_PASSED + TESTS_FAILED))"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed!${NC}"
    exit 1
fi
