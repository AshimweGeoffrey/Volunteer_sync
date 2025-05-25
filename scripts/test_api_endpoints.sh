#!/bin/bash

# VolunteerSync API Endpoint Testing Script
# This script tests all implemented endpoints and identifies missing functionality

# Configuration
API_BASE_URL="http://localhost:5000"
CONTENT_TYPE="application/json"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
MISSING_TESTS=0

# Global variables for authentication
AUTH_TOKEN=""
REFRESH_TOKEN=""
USER_ID=""
TASK_ID=""
ORG_ID=""
REGISTRATION_ID=""
NOTIFICATION_ID=""

# Function to print colored output
print_status() {
    local status=$1
    local message=$2
    case $status in
        "PASS")
            echo -e "${GREEN}✓ PASS${NC}: $message"
            ((PASSED_TESTS++))
            ;;
        "FAIL")
            echo -e "${RED}✗ FAIL${NC}: $message"
            ((FAILED_TESTS++))
            ;;
        "MISSING")
            echo -e "${YELLOW}? MISSING${NC}: $message"
            ((MISSING_TESTS++))
            ;;
        "INFO")
            echo -e "${BLUE}ℹ INFO${NC}: $message"
            ;;
    esac
    ((TOTAL_TESTS++))
}

# Function to make API requests
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local auth_header=$4
    
    local curl_cmd="curl -s -w '%{http_code}' -X $method"
    
    if [ ! -z "$auth_header" ]; then
        curl_cmd="$curl_cmd -H 'Authorization: Bearer $auth_header'"
    fi
    
    curl_cmd="$curl_cmd -H 'Content-Type: $CONTENT_TYPE'"
    
    if [ ! -z "$data" ]; then
        curl_cmd="$curl_cmd -d '$data'"
    fi
    
    curl_cmd="$curl_cmd '$API_BASE_URL$endpoint'"
    
    eval $curl_cmd
}

# Function to extract data from JSON response
extract_json_field() {
    local json=$1
    local field=$2
    echo $json | grep -o "\"$field\":\"[^\"]*\"" | cut -d'"' -f4
}

# Function to test endpoint
test_endpoint() {
    local method=$1
    local endpoint=$2
    local expected_status=$3
    local description=$4
    local data=$5
    local auth_required=$6
    
    echo -e "\n${BLUE}Testing:${NC} $method $endpoint - $description"
    
    local auth_header=""
    if [ "$auth_required" = "true" ] && [ ! -z "$AUTH_TOKEN" ]; then
        auth_header=$AUTH_TOKEN
    fi
    
    local response=$(make_request $method $endpoint "$data" "$auth_header")
    local status_code=${response: -3}
    local body=${response%???}
    
    if [ "$status_code" = "$expected_status" ]; then
        print_status "PASS" "$method $endpoint returned $status_code"
        echo "Response: $body" | head -c 200
        if [ ${#body} -gt 200 ]; then echo "..."; fi
        return 0
    else
        print_status "FAIL" "$method $endpoint expected $expected_status, got $status_code"
        echo "Response: $body"
        return 1
    fi
}

# Function to test missing endpoint
test_missing_endpoint() {
    local method=$1
    local endpoint=$2
    local description=$3
    
    print_status "MISSING" "$method $endpoint - $description (Not implemented)"
}

echo "========================================"
echo "VolunteerSync API Endpoint Testing"
echo "========================================"

# Check if API server is running
echo -e "\n${BLUE}Checking API server status...${NC}"
response=$(curl -s -w '%{http_code}' "$API_BASE_URL/api/health" 2>/dev/null)
status_code=${response: -3}

if [ "$status_code" != "200" ]; then
    echo -e "${RED}❌ API server is not running on $API_BASE_URL${NC}"
    echo "Please start the server with: cd backend/src/VolunteerSync.API && dotnet run"
    exit 1
fi

echo -e "${GREEN}✅ API server is running${NC}"

echo -e "\n=========================================="
echo "AUTHENTICATION ENDPOINTS"
echo "=========================================="

# Test user registration
echo -e "\n${BLUE}Testing User Registration...${NC}"
register_data='{
    "firstName": "Test",
    "lastName": "User",
    "email": "test.user@example.com",
    "password": "TestPassword123!",
    "phoneNumber": "+1234567890"
}'

if test_endpoint "POST" "/api/auth/register" "201" "User registration" "$register_data" "false"; then
    # Extract token from registration response
    AUTH_TOKEN=$(echo $body | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo $body | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)
    USER_ID=$(echo $body | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
fi

# Test user login
echo -e "\n${BLUE}Testing User Login...${NC}"
login_data='{
    "email": "test.user@example.com",
    "password": "TestPassword123!"
}'

if test_endpoint "POST" "/api/auth/login" "200" "User login" "$login_data" "false"; then
    # Extract token from login response if registration failed
    if [ -z "$AUTH_TOKEN" ]; then
        AUTH_TOKEN=$(echo $body | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        REFRESH_TOKEN=$(echo $body | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)
        USER_ID=$(echo $body | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    fi
fi

# Test refresh token
test_missing_endpoint "POST" "/api/auth/refresh" "Refresh JWT token"

# Test logout
test_endpoint "POST" "/api/auth/logout" "200" "User logout" "" "true"

echo -e "\n=========================================="
echo "USER MANAGEMENT ENDPOINTS"
echo "=========================================="

# Test get current user profile
test_endpoint "GET" "/api/users/profile" "200" "Get current user profile" "" "true"

# Test update user profile
update_profile_data='{
    "firstName": "Updated",
    "lastName": "User",
    "phoneNumber": "+1234567890",
    "bio": "Updated bio text",
    "age": 28,
    "gender": "Male",
    "location": "Test City",
    "interests": ["Environment", "Education"],
    "availability": ["Weekends", "Evenings"],
    "skills": ["Teaching", "Project Management"]
}'

test_missing_endpoint "PUT" "/api/users/profile" "Update current user profile"

# Test get user by ID
test_missing_endpoint "GET" "/api/users/{id}" "Get user by ID"

# Test get all users
test_endpoint "GET" "/api/users" "401" "Get all users (should require auth)" "" "false"
test_endpoint "GET" "/api/users" "200" "Get all users with auth" "" "true"

# Test search users
test_missing_endpoint "GET" "/api/users/search" "Search users"

echo -e "\n=========================================="
echo "TASK/PROJECT MANAGEMENT ENDPOINTS"
echo "=========================================="

# Test get all tasks (public endpoint)
if test_endpoint "GET" "/api/tasks" "200" "Get all tasks (public)" "" "false"; then
    # Try to extract a task ID for later tests
    TASK_ID=$(echo $body | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

# Test get all tasks with pagination
test_endpoint "GET" "/api/tasks?page=1&pageSize=5" "200" "Get tasks with pagination" "" "false"

# Test get all tasks with filters
test_endpoint "GET" "/api/tasks?status=1&category=1" "200" "Get tasks with filters" "" "false"

# Test get task by ID
if [ ! -z "$TASK_ID" ]; then
    test_endpoint "GET" "/api/tasks/$TASK_ID" "200" "Get task by ID" "" "false"
else
    test_missing_endpoint "GET" "/api/tasks/{id}" "Get task by ID (no test data)"
fi

# Test create task
create_task_data='{
    "title": "Test Beach Cleanup",
    "description": "Test cleanup event",
    "startDate": "2024-06-15T09:00:00Z",
    "endDate": "2024-06-15T15:00:00Z",
    "location": {
        "street": "Ocean Beach",
        "city": "Test City",
        "state": "Test State",
        "zipCode": "00100",
        "country": "Test Country",
        "latitude": -1.9706,
        "longitude": 30.1044
    },
    "maxVolunteers": 50,
    "category": 1,
    "requirements": ["Must be 16 or older"],
    "skills": ["Environmental awareness"],
    "tags": ["beach", "cleanup"],
    "isUrgent": false,
    "applicationDeadline": "2024-06-10T23:59:59Z"
}'

test_missing_endpoint "POST" "/api/tasks" "Create new task"

# Test update task
test_missing_endpoint "PUT" "/api/tasks/{id}" "Update task"

# Test delete task
test_missing_endpoint "DELETE" "/api/tasks/{id}" "Delete task"

# Test search tasks
test_missing_endpoint "GET" "/api/tasks/search" "Search tasks"

# Test featured tasks
test_missing_endpoint "GET" "/api/tasks/featured" "Get featured/urgent tasks"

# Test register for task
register_task_data='{
    "applicationMessage": "I am excited to participate in this project"
}'

test_missing_endpoint "POST" "/api/tasks/{id}/register" "Register for a task"

# Test unregister from task
test_missing_endpoint "DELETE" "/api/tasks/{id}/register" "Unregister from a task"

echo -e "\n=========================================="
echo "VOLUNTEER REGISTRATION MANAGEMENT"
echo "=========================================="

# Test get all registrations (admin only)
test_endpoint "GET" "/api/volunteers/registrations" "200" "Get all registrations" "" "true"

# Test get registrations for specific task
test_missing_endpoint "GET" "/api/volunteers/tasks/{taskId}/registrations" "Get registrations for specific task"

# Test get user's registrations
test_missing_endpoint "GET" "/api/volunteers/users/{userId}/registrations" "Get user's registrations"

# Test approve registration
test_missing_endpoint "POST" "/api/volunteers/registrations/{id}/approve" "Approve registration"

# Test reject registration
reject_data='{"reason": "Unfortunately, we have reached the maximum number of volunteers."}'
test_missing_endpoint "POST" "/api/volunteers/registrations/{id}/reject" "Reject registration"

echo -e "\n=========================================="
echo "ORGANIZATION MANAGEMENT"
echo "=========================================="

# Test get all organizations
if test_endpoint "GET" "/api/organizations" "200" "Get all organizations" "" "false"; then
    # Try to extract an organization ID
    ORG_ID=$(echo $body | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

# Test get organization by ID
if [ ! -z "$ORG_ID" ]; then
    test_endpoint "GET" "/api/organizations/$ORG_ID" "200" "Get organization by ID" "" "false"
else
    test_missing_endpoint "GET" "/api/organizations/{id}" "Get organization by ID (no test data)"
fi

# Test create organization
create_org_data='{
    "name": "Test Green Foundation",
    "description": "Test environmental organization",
    "contactInfo": {
        "email": "contact@testgreen.org",
        "phone": "+1-555-0123",
        "website": "https://testgreen.org"
    },
    "address": {
        "street": "123 Green Street",
        "city": "Test City",
        "state": "TS",
        "zipCode": "97201",
        "country": "Test Country",
        "latitude": 45.5152,
        "longitude": -122.6784
    },
    "categories": ["Environment", "Education"]
}'

test_missing_endpoint "POST" "/api/organizations" "Create organization"

echo -e "\n=========================================="
echo "NOTIFICATION MANAGEMENT"
echo "=========================================="

# Test get user notifications
test_endpoint "GET" "/api/notifications" "200" "Get user notifications" "" "true"

# Test mark notification as read
test_missing_endpoint "PUT" "/api/notifications/{id}/read" "Mark notification as read"

# Test mark all notifications as read
test_missing_endpoint "PUT" "/api/notifications/mark-all-read" "Mark all notifications as read"

echo -e "\n=========================================="
echo "DASHBOARD & STATISTICS"
echo "=========================================="

# Test dashboard statistics
test_endpoint "GET" "/api/stats/dashboard" "200" "Get dashboard statistics" "" "false"

echo -e "\n=========================================="
echo "ADDITIONAL ENDPOINTS (Custom)"
echo "=========================================="

# Test health endpoint
test_endpoint "GET" "/api/health" "200" "Health check" "" "false"

echo -e "\n=========================================="
echo "TEST SUMMARY"
echo "=========================================="

echo -e "\n${BLUE}Test Results Summary:${NC}"
echo -e "Total Tests: $TOTAL_TESTS"
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}"
echo -e "${RED}Failed: $FAILED_TESTS${NC}"
echo -e "${YELLOW}Missing/Not Implemented: $MISSING_TESTS${NC}"

if [ $FAILED_TESTS -gt 0 ]; then
    echo -e "\n${RED}❌ Some tests failed. Please check the implementation.${NC}"
else
    echo -e "\n${GREEN}✅ All implemented endpoints are working correctly!${NC}"
fi

echo -e "\n=========================================="
echo "MISSING ENDPOINT IMPLEMENTATION GUIDE"
echo "=========================================="

echo -e "\n${YELLOW}High Priority Missing Endpoints:${NC}"
echo "1. PUT /api/users/profile - Update user profile"
echo "2. POST /api/tasks - Create new task"
echo "3. PUT /api/tasks/{id} - Update task"
echo "4. DELETE /api/tasks/{id} - Delete task"
echo "5. POST /api/tasks/{id}/register - Register for task"
echo "6. DELETE /api/tasks/{id}/register - Unregister from task"

echo -e "\n${YELLOW}Medium Priority Missing Endpoints:${NC}"
echo "7. GET /api/users/search - Search users"
echo "8. GET /api/tasks/search - Search tasks"
echo "9. GET /api/tasks/featured - Featured tasks"
echo "10. POST /api/volunteers/registrations/{id}/approve - Approve registration"
echo "11. POST /api/volunteers/registrations/{id}/reject - Reject registration"

echo -e "\n${YELLOW}Low Priority Missing Endpoints:${NC}"
echo "12. POST /api/auth/refresh - Refresh token"
echo "13. PUT /api/notifications/{id}/read - Mark notification as read"
echo "14. PUT /api/notifications/mark-all-read - Mark all as read"
echo "15. POST /api/organizations - Create organization"

echo -e "\n${BLUE}Recommendations:${NC}"
echo "1. Focus on implementing task management endpoints first"
echo "2. Add user profile update functionality"
echo "3. Implement task registration system"
echo "4. Add search functionality for better UX"
echo "5. Complete the notification system"

echo -e "\n=========================================="
echo "END OF TESTING"
echo "=========================================="
