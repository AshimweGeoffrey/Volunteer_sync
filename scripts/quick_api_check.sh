#!/bin/bash

# Quick API Status Check
BASE_URL="http://localhost:5000/api"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "=== QUICK API STATUS CHECK ==="

# Function to test endpoint
quick_test() {
    local method="$1"
    local endpoint="$2"
    local expected="$3"
    local name="$4"
    
    local response=$(curl -s -w "%{http_code}" -X "$method" "$BASE_URL$endpoint" -o /dev/null 2>/dev/null)
    
    if [ "$response" = "$expected" ]; then
        echo -e "${GREEN}✓${NC} $name ($response)"
    elif [ "$response" = "404" ]; then
        echo -e "${YELLOW}?${NC} $name (404 - Not Found)"
    else
        echo -e "${RED}✗${NC} $name (Expected: $expected, Got: $response)"
    fi
}

# Test basic endpoints
quick_test "GET" "/health" "200" "Health Check"
quick_test "GET" "/tasks" "200" "Get Tasks (Public)"
quick_test "GET" "/organizations" "200" "Get Organizations (Public)"
quick_test "GET" "/stats/dashboard" "200" "Dashboard Stats (Public)"

# Test auth endpoints (should require data)
quick_test "POST" "/auth/login" "400" "Login Endpoint (no data)"
quick_test "POST" "/auth/register" "400" "Register Endpoint (no data)"

# Test protected endpoints (should return 401)
quick_test "GET" "/users/profile" "401" "Profile (Protected)"
quick_test "GET" "/notifications" "401" "Notifications (Protected)"

echo ""
echo "=== ENDPOINT DISCOVERY ==="

# Check what endpoints actually exist
endpoints=(
    "auth/login"
    "auth/register" 
    "auth/refresh"
    "auth/logout"
    "users/profile"
    "users"
    "users/search"
    "tasks"
    "tasks/featured"
    "tasks/search"
    "organizations"
    "notifications"
    "volunteers/registrations"
    "stats/dashboard"
)

for endpoint in "${endpoints[@]}"; do
    response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/$endpoint" -o /dev/null 2>/dev/null)
    if [ "$response" != "404" ]; then
        echo -e "${GREEN}EXISTS:${NC} /$endpoint ($response)"
    else
        echo -e "${RED}MISSING:${NC} /$endpoint"
    fi
done
