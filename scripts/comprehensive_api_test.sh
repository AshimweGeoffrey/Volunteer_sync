#!/bin/bash

# VolunteerSync API Comprehensive Testing Script
# Tests all endpoints according to BACKEND_API_SPECIFICATION.md

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test configuration
BASE_URL="http://localhost:5000/api"
PASSED=0
FAILED=0
MISSING=0
TOKEN=""
REFRESH_TOKEN=""
USER_ID=""
TASK_ID=""
ORG_ID=""
REGISTRATION_ID=""
NOTIFICATION_ID=""

# Function to print test results
print_test() {
    local test_name="$1"
    local status="$2"
    local message="$3"
    
    case $status in
        "PASS")
            echo -e "${GREEN}✓ PASS${NC} - $test_name"
            ((PASSED++))
            ;;
        "FAIL")
            echo -e "${RED}✗ FAIL${NC} - $test_name: $message"
            ((FAILED++))
            ;;
        "MISSING")
            echo -e "${YELLOW}⚠ MISSING${NC} - $test_name: Endpoint not implemented"
            ((MISSING++))
            ;;
        "SKIP")
            echo -e "${BLUE}⊘ SKIP${NC} - $test_name: $message"
            ;;
    esac
}

# Function to extract JSON field
extract_json_field() {
    local json="$1"
    local field="$2"
    echo "$json" | grep -o "\"$field\":\"[^\"]*\"" | cut -d'"' -f4
}

# Function to check if endpoint exists
endpoint_exists() {
    local method="$1"
    local endpoint="$2"
    local response=$(curl -s -w "%{http_code}" -X "$method" "$BASE_URL$endpoint" -o /dev/null 2>/dev/null)
    [ "$response" != "404" ] && [ "$response" != "000" ]
}

# Function to test API endpoint
test_endpoint() {
    local method="$1"
    local endpoint="$2"
    local data="$3"
    local auth_header="$4"
    local expected_status="$5"
    local test_name="$6"
    
    # Build curl command
    local curl_cmd="curl -s -w \"%{http_code}\" -X $method"
    
    if [ ! -z "$auth_header" ]; then
        curl_cmd="$curl_cmd -H \"Authorization: Bearer $TOKEN\""
    fi
    
    if [ ! -z "$data" ]; then
        curl_cmd="$curl_cmd -H \"Content-Type: application/json\" -d '$data'"
    fi
    
    curl_cmd="$curl_cmd \"$BASE_URL$endpoint\""
    
    # Execute request
    local response=$(eval $curl_cmd)
    local status_code="${response: -3}"
    local body="${response%???}"
    
    # Check if endpoint exists
    if [ "$status_code" = "404" ] || [ "$status_code" = "000" ]; then
        print_test "$test_name" "MISSING"
        return 1
    fi
    
    # Check status code
    if [ "$status_code" = "$expected_status" ]; then
        print_test "$test_name" "PASS"
        echo "$body"
        return 0
    else
        print_test "$test_name" "FAIL" "Expected $expected_status, got $status_code"
        return 1
    fi
}

echo -e "${CYAN}===========================================${NC}"
echo -e "${CYAN}  VolunteerSync API Comprehensive Tests  ${NC}"
echo -e "${CYAN}===========================================${NC}"
echo ""

# Test 1: Health Check
echo -e "${PURPLE}=== HEALTH CHECK ===${NC}"
response=$(test_endpoint "GET" "/health" "" "" "200" "Health Check")
echo ""

# Test 2: Authentication Endpoints
echo -e "${PURPLE}=== AUTHENTICATION TESTS ===${NC}"

# Register new user
echo "Testing user registration..."
register_data='{
    "firstName": "Test",
    "lastName": "User",
    "email": "test_'$(date +%s)'@example.com",
    "password": "password123",
    "phoneNumber": "+250788123456"
}'

register_response=$(test_endpoint "POST" "/auth/register" "$register_data" "" "201" "User Registration")
if [ $? -eq 0 ]; then
    TOKEN=$(echo "$register_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$register_response" | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)
    USER_ID=$(echo "$register_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "Extracted token: ${TOKEN:0:20}..."
fi

# Login
echo "Testing user login..."
login_data='{
    "email": "test@example.com",
    "password": "password123"
}'

login_response=$(test_endpoint "POST" "/auth/login" "$login_data" "" "200" "User Login")
if [ $? -eq 0 ] && [ -z "$TOKEN" ]; then
    TOKEN=$(echo "$login_response" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    REFRESH_TOKEN=$(echo "$login_response" | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4)
    USER_ID=$(echo "$login_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "Extracted token from login: ${TOKEN:0:20}..."
fi

# Refresh token
if [ ! -z "$REFRESH_TOKEN" ]; then
    echo "Testing token refresh..."
    refresh_data='{"refreshToken": "'$REFRESH_TOKEN'"}'
    test_endpoint "POST" "/auth/refresh" "$refresh_data" "" "200" "Token Refresh"
fi

# Logout (requires auth)
if [ ! -z "$TOKEN" ]; then
    echo "Testing logout..."
    test_endpoint "POST" "/auth/logout" "" "auth" "200" "User Logout"
fi

echo ""

# Test 3: User Management Endpoints
echo -e "${PURPLE}=== USER MANAGEMENT TESTS ===${NC}"

if [ ! -z "$TOKEN" ]; then
    # Get current user profile
    test_endpoint "GET" "/users/profile" "" "auth" "200" "Get Current User Profile"
    
    # Update user profile
    update_profile_data='{
        "firstName": "Updated",
        "lastName": "User",
        "bio": "Updated bio",
        "age": 28,
        "gender": "Male",
        "location": "Kigali, Rwanda",
        "interests": ["Environment", "Education"],
        "availability": ["Weekends", "Evenings"],
        "skills": ["Teaching", "Project Management"]
    }'
    test_endpoint "PUT" "/users/profile" "$update_profile_data" "auth" "200" "Update User Profile"
    
    # Get all users
    test_endpoint "GET" "/users?page=1&pageSize=10" "" "auth" "200" "Get All Users"
    
    # Search users
    test_endpoint "GET" "/users/search?searchTerm=test&page=1&pageSize=10" "" "auth" "200" "Search Users"
    
    # Get user by ID
    if [ ! -z "$USER_ID" ]; then
        test_endpoint "GET" "/users/$USER_ID" "" "auth" "200" "Get User by ID"
    fi
else
    print_test "User Management Tests" "SKIP" "No valid token available"
fi

echo ""

# Test 4: Task/Project Management Endpoints
echo -e "${PURPLE}=== TASK MANAGEMENT TESTS ===${NC}"

# Get all tasks (public)
tasks_response=$(test_endpoint "GET" "/tasks?page=1&pageSize=10" "" "" "200" "Get All Tasks")
if [ $? -eq 0 ]; then
    # Try to extract a task ID for further testing
    TASK_ID=$(echo "$tasks_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Extracted task ID: $TASK_ID"
fi

# Get featured tasks
test_endpoint "GET" "/tasks/featured" "" "" "200" "Get Featured Tasks"

# Search tasks
test_endpoint "GET" "/tasks/search?searchTerm=cleanup&page=1&pageSize=10" "" "" "200" "Search Tasks"

# Get task by ID
if [ ! -z "$TASK_ID" ]; then
    test_endpoint "GET" "/tasks/$TASK_ID" "" "" "200" "Get Task by ID"
fi

# Create new task (requires auth and proper role)
if [ ! -z "$TOKEN" ]; then
    create_task_data='{
        "title": "Test Beach Cleanup",
        "description": "A test beach cleanup event",
        "startDate": "2025-06-15T09:00:00Z",
        "endDate": "2025-06-15T15:00:00Z",
        "location": {
            "street": "Test Beach",
            "city": "Kigali",
            "state": "Kigali Province",
            "zipCode": "00100",
            "country": "Rwanda",
            "latitude": -1.9706,
            "longitude": 30.1044
        },
        "maxVolunteers": 50,
        "category": 1,
        "requirements": ["Must be 16 or older"],
        "skills": ["Environmental awareness"],
        "tags": ["test", "cleanup"],
        "isUrgent": false,
        "applicationDeadline": "2025-06-10T23:59:59Z"
    }'
    
    create_response=$(test_endpoint "POST" "/tasks" "$create_task_data" "auth" "201" "Create New Task")
    if [ $? -eq 0 ]; then
        NEW_TASK_ID=$(echo "$create_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
        echo "Created task ID: $NEW_TASK_ID"
    fi
    
    # Update task (if we created one)
    if [ ! -z "$NEW_TASK_ID" ]; then
        update_task_data='{
            "title": "Updated Test Beach Cleanup",
            "description": "An updated test beach cleanup event"
        }'
        test_endpoint "PUT" "/tasks/$NEW_TASK_ID" "$update_task_data" "auth" "200" "Update Task"
    fi
    
    # Register for task
    if [ ! -z "$TASK_ID" ]; then
        register_task_data='{"applicationMessage": "I would love to participate in this project"}'
        register_task_response=$(test_endpoint "POST" "/tasks/$TASK_ID/register" "$register_task_data" "auth" "201" "Register for Task")
        if [ $? -eq 0 ]; then
            REGISTRATION_ID=$(echo "$register_task_response" | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
            echo "Registration ID: $REGISTRATION_ID"
        fi
        
        # Unregister from task
        test_endpoint "DELETE" "/tasks/$TASK_ID/register" "" "auth" "200" "Unregister from Task"
    fi
    
    # Delete task (if we created one)
    if [ ! -z "$NEW_TASK_ID" ]; then
        test_endpoint "DELETE" "/tasks/$NEW_TASK_ID" "" "auth" "200" "Delete Task"
    fi
fi

echo ""

# Test 5: Organization Management
echo -e "${PURPLE}=== ORGANIZATION MANAGEMENT TESTS ===${NC}"

# Get all organizations (public)
orgs_response=$(test_endpoint "GET" "/organizations?page=1&pageSize=10" "" "" "200" "Get All Organizations")
if [ $? -eq 0 ]; then
    ORG_ID=$(echo "$orgs_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Extracted organization ID: $ORG_ID"
fi

# Get organization by ID
if [ ! -z "$ORG_ID" ]; then
    test_endpoint "GET" "/organizations/$ORG_ID" "" "" "200" "Get Organization by ID"
fi

# Create organization (SuperAdmin only)
if [ ! -z "$TOKEN" ]; then
    create_org_data='{
        "name": "Test Green Foundation",
        "description": "A test environmental organization",
        "contactInfo": {
            "email": "contact@testgreen.org",
            "phone": "+250788123456",
            "website": "https://testgreen.org"
        },
        "address": {
            "street": "123 Test Street",
            "city": "Kigali",
            "state": "Kigali Province",
            "zipCode": "00100",
            "country": "Rwanda",
            "latitude": -1.9706,
            "longitude": 30.1044
        },
        "categories": ["Environment", "Education"]
    }'
    test_endpoint "POST" "/organizations" "$create_org_data" "auth" "201" "Create Organization"
fi

echo ""

# Test 6: Volunteer Registration Management
echo -e "${PURPLE}=== VOLUNTEER REGISTRATION MANAGEMENT ===${NC}"

if [ ! -z "$TOKEN" ]; then
    # Get all registrations (admin only)
    test_endpoint "GET" "/volunteers/registrations?page=1&pageSize=10" "" "auth" "200" "Get All Registrations"
    
    # Get registrations for specific task
    if [ ! -z "$TASK_ID" ]; then
        test_endpoint "GET" "/volunteers/tasks/$TASK_ID/registrations" "" "auth" "200" "Get Task Registrations"
    fi
    
    # Get user's registrations
    if [ ! -z "$USER_ID" ]; then
        test_endpoint "GET" "/volunteers/users/$USER_ID/registrations" "" "auth" "200" "Get User Registrations"
    fi
    
    # Approve/Reject registration (admin only)
    if [ ! -z "$REGISTRATION_ID" ]; then
        test_endpoint "POST" "/volunteers/registrations/$REGISTRATION_ID/approve" "" "auth" "200" "Approve Registration"
        
        reject_data='{"reason": "Test rejection reason"}'
        test_endpoint "POST" "/volunteers/registrations/$REGISTRATION_ID/reject" "$reject_data" "auth" "200" "Reject Registration"
    fi
fi

echo ""

# Test 7: Notification Management
echo -e "${PURPLE}=== NOTIFICATION MANAGEMENT ===${NC}"

if [ ! -z "$TOKEN" ]; then
    # Get user notifications
    notifications_response=$(test_endpoint "GET" "/notifications?page=1&pageSize=10" "" "auth" "200" "Get User Notifications")
    if [ $? -eq 0 ]; then
        NOTIFICATION_ID=$(echo "$notifications_response" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        echo "Extracted notification ID: $NOTIFICATION_ID"
    fi
    
    # Mark notification as read
    if [ ! -z "$NOTIFICATION_ID" ]; then
        test_endpoint "PUT" "/notifications/$NOTIFICATION_ID/read" "" "auth" "200" "Mark Notification as Read"
    fi
    
    # Mark all notifications as read
    test_endpoint "PUT" "/notifications/mark-all-read" "" "auth" "200" "Mark All Notifications as Read"
fi

echo ""

# Test 8: Dashboard & Statistics
echo -e "${PURPLE}=== DASHBOARD & STATISTICS ===${NC}"

# Get dashboard statistics (public)
test_endpoint "GET" "/stats/dashboard" "" "" "200" "Get Dashboard Statistics"

echo ""

# Test Summary
echo -e "${CYAN}===========================================${NC}"
echo -e "${CYAN}             TEST SUMMARY                  ${NC}"
echo -e "${CYAN}===========================================${NC}"
echo -e "${GREEN}Passed:${NC} $PASSED"
echo -e "${RED}Failed:${NC} $FAILED"
echo -e "${YELLOW}Missing:${NC} $MISSING"
echo ""

TOTAL=$((PASSED + FAILED + MISSING))
if [ $TOTAL -gt 0 ]; then
    PASS_RATE=$((PASSED * 100 / TOTAL))
    echo -e "Pass Rate: ${GREEN}$PASS_RATE%${NC}"
else
    echo -e "No tests executed"
fi

echo ""

# Implementation Priority Recommendations
echo -e "${CYAN}===========================================${NC}"
echo -e "${CYAN}      IMPLEMENTATION PRIORITIES           ${NC}"
echo -e "${CYAN}===========================================${NC}"
echo ""
echo -e "${YELLOW}HIGH PRIORITY (Core Features):${NC}"
echo "1. Authentication system (login/register/logout)"
echo "2. Task registration and management"
echo "3. User profile management"
echo "4. Dashboard statistics"
echo ""
echo -e "${YELLOW}MEDIUM PRIORITY (Enhanced Features):${NC}"
echo "5. Notification system"
echo "6. Organization management"
echo "7. Volunteer registration workflow"
echo ""
echo -e "${YELLOW}LOW PRIORITY (Admin Features):${NC}"
echo "8. Advanced search and filtering"
echo "9. Admin-only endpoints"
echo "10. File upload functionality"

# Exit with appropriate code
if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi
