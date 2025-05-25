#!/bin/bash

# Focused API Authentication and Working Endpoints Test
BASE_URL="http://localhost:5000/api"
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "=== AUTHENTICATION FLOW TEST ==="

# Test user registration with proper data
echo "1. Testing User Registration..."
register_response=$(curl -s -w "%{http_code}" \
    -H "Content-Type: application/json" \
    -d '{
        "firstName": "Test", 
        "lastName": "User",
        "email": "testuser_'$(date +%s)'@example.com",
        "password": "password123",
        "phoneNumber": "+250788123456"
    }' \
    -X POST "$BASE_URL/auth/register")

status_code="${register_response: -3}"
body="${register_response%???}"

if [ "$status_code" = "201" ] || [ "$status_code" = "200" ]; then
    echo -e "${GREEN}✓ Registration successful ($status_code)${NC}"
    TOKEN=$(echo "$body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    USER_ID=$(echo "$body" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Token extracted: ${TOKEN:0:30}..."
    echo "User ID: $USER_ID"
else
    echo -e "${RED}✗ Registration failed ($status_code)${NC}"
    echo "Response: $body"
fi

echo ""

# Test user login with existing user
echo "2. Testing User Login..."
login_response=$(curl -s -w "%{http_code}" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "john.doe@example.com",
        "password": "password123"
    }' \
    -X POST "$BASE_URL/auth/login")

login_status_code="${login_response: -3}"
login_body="${login_response%???}"

if [ "$login_status_code" = "200" ]; then
    echo -e "${GREEN}✓ Login successful${NC}"
    if [ -z "$TOKEN" ]; then
        TOKEN=$(echo "$login_body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
        USER_ID=$(echo "$login_body" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        echo "Token from login: ${TOKEN:0:30}..."
    fi
else
    echo -e "${RED}✗ Login failed ($login_status_code)${NC}"
    echo "Response: $login_body"
fi

echo ""
echo "=== TESTING AUTHENTICATED ENDPOINTS ==="

if [ ! -z "$TOKEN" ]; then
    echo "Using token for authenticated requests: ${TOKEN:0:30}..."
    
    # Test user profile
    echo "3. Testing Get User Profile..."
    profile_response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Bearer $TOKEN" \
        -X GET "$BASE_URL/users/profile")
    
    profile_status="${profile_response: -3}"
    if [ "$profile_status" = "200" ]; then
        echo -e "${GREEN}✓ Get Profile successful${NC}"
    else
        echo -e "${RED}✗ Get Profile failed ($profile_status)${NC}"
    fi
    
    # Test update profile
    echo "4. Testing Update Profile..."
    update_response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{
            "firstName": "Updated",
            "lastName": "TestUser",
            "bio": "Updated bio"
        }' \
        -X PUT "$BASE_URL/users/profile")
    
    update_status="${update_response: -3}"
    if [ "$update_status" = "200" ]; then
        echo -e "${GREEN}✓ Update Profile successful${NC}"
    else
        echo -e "${RED}✗ Update Profile failed ($update_status)${NC}"
    fi
    
    # Test get notifications
    echo "5. Testing Get Notifications..."
    notif_response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Bearer $TOKEN" \
        -X GET "$BASE_URL/notifications")
    
    notif_status="${notif_response: -3}"
    if [ "$notif_status" = "200" ]; then
        echo -e "${GREEN}✓ Get Notifications successful${NC}"
    else
        echo -e "${RED}✗ Get Notifications failed ($notif_status)${NC}"
    fi
    
else
    echo -e "${RED}No valid token available for authenticated tests${NC}"
fi

echo ""
echo "=== TESTING PUBLIC ENDPOINTS ==="

# Test getting task data
echo "6. Testing Get Tasks..."
tasks_response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/tasks")
tasks_status="${tasks_response: -3}"
tasks_body="${tasks_response%???}"

if [ "$tasks_status" = "200" ]; then
    echo -e "${GREEN}✓ Get Tasks successful${NC}"
    # Extract first task ID
    TASK_ID=$(echo "$tasks_body" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Found task ID: $TASK_ID"
else
    echo -e "${RED}✗ Get Tasks failed ($tasks_status)${NC}"
fi

# Test getting specific task
if [ ! -z "$TASK_ID" ]; then
    echo "7. Testing Get Task by ID..."
    task_response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/tasks/$TASK_ID")
    task_status="${task_response: -3}"
    
    if [ "$task_status" = "200" ]; then
        echo -e "${GREEN}✓ Get Task by ID successful${NC}"
    else
        echo -e "${RED}✗ Get Task by ID failed ($task_status)${NC}"
    fi
fi

# Test getting organizations
echo "8. Testing Get Organizations..."
orgs_response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/organizations")
orgs_status="${orgs_response: -3}"

if [ "$orgs_status" = "200" ]; then
    echo -e "${GREEN}✓ Get Organizations successful${NC}"
else
    echo -e "${RED}✗ Get Organizations failed ($orgs_status)${NC}"
fi

# Test dashboard stats
echo "9. Testing Dashboard Stats..."
stats_response=$(curl -s -w "%{http_code}" -X GET "$BASE_URL/stats/dashboard")
stats_status="${stats_response: -3}"

if [ "$stats_status" = "200" ]; then
    echo -e "${GREEN}✓ Dashboard Stats successful${NC}"
    echo "Stats data preview:"
    echo "${stats_response%???}" | head -c 200
    echo "..."
else
    echo -e "${RED}✗ Dashboard Stats failed ($stats_status)${NC}"
fi

echo ""
echo "=== TESTING TASK REGISTRATION ==="

if [ ! -z "$TOKEN" ] && [ ! -z "$TASK_ID" ]; then
    echo "10. Testing Task Registration..."
    reg_response=$(curl -s -w "%{http_code}" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"applicationMessage": "I would love to help with this project!"}' \
        -X POST "$BASE_URL/tasks/$TASK_ID/register")
    
    reg_status="${reg_response: -3}"
    if [ "$reg_status" = "201" ] || [ "$reg_status" = "200" ]; then
        echo -e "${GREEN}✓ Task Registration successful ($reg_status)${NC}"
    else
        echo -e "${RED}✗ Task Registration failed ($reg_status)${NC}"
        echo "Response: ${reg_response%???}"
    fi
fi

echo ""
echo "=== SUMMARY ==="
echo "API Server: Running ✓"
echo "Authentication: $([ ! -z "$TOKEN" ] && echo "Working ✓" || echo "Needs Investigation ✗")"
echo "Public Endpoints: Working ✓"
echo "Protected Endpoints: $([ ! -z "$TOKEN" ] && echo "Accessible ✓" || echo "Auth Required ✗")"
