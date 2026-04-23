#!/bin/bash

echo "🔍 Diagnosing React Client 403 Error..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if API is running
echo "1️⃣  Checking if API is running..."
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/products | grep -q "401\|200"; then
    echo -e "${GREEN}✓${NC} API is running on http://localhost:5000"
    echo -e "   Response: $(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/products)"
else
    echo -e "${RED}✗${NC} API is NOT responding on http://localhost:5000"
    echo -e "${YELLOW}   Fix: cd ../../InterviewCleanApi.Api && dotnet run${NC}"
    exit 1
fi

echo ""
echo "2️⃣  Checking Vite configuration..."
if grep -q "proxy" vite.config.ts; then
    echo -e "${GREEN}✓${NC} Vite proxy is configured"
else
    echo -e "${RED}✗${NC} Vite proxy is NOT configured"
    exit 1
fi

echo ""
echo "3️⃣  Checking API base URL..."
if grep -q "const API_BASE_URL = ''" src/services/api.ts; then
    echo -e "${GREEN}✓${NC} API base URL is set to use proxy"
else
    echo -e "${YELLOW}⚠${NC}  API base URL is not empty"
    echo -e "${YELLOW}   Current value: $(grep "API_BASE_URL" src/services/api.ts)${NC}"
fi

echo ""
echo "4️⃣  Checking Vite cache..."
if [ -d "node_modules/.vite" ]; then
    echo -e "${YELLOW}⚠${NC}  Vite cache exists"
    echo -e "${YELLOW}   Recommendation: rm -rf node_modules/.vite${NC}"
else
    echo -e "${GREEN}✓${NC} No Vite cache"
fi

echo ""
echo "5️⃣  Testing direct API access..."
echo "   Testing: curl http://localhost:5000/api/auth/login"
response=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"123456"}' \
  -w "\n%{http_code}" | tail -n 1)

if [ "$response" = "200" ]; then
    echo -e "${GREEN}✓${NC} API login endpoint works (200 OK)"
elif [ "$response" = "400" ] || [ "$response" = "401" ]; then
    echo -e "${GREEN}✓${NC} API login endpoint responds ($response)"
else
    echo -e "${RED}✗${NC} API login endpoint returned: $response"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 Recommendations:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Clear Vite cache:"
echo "   ${YELLOW}rm -rf node_modules/.vite${NC}"
echo ""
echo "2. Restart dev server:"
echo "   ${YELLOW}npm run dev${NC}"
echo ""
echo "3. Hard refresh browser:"
echo "   ${YELLOW}Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)${NC}"
echo ""
echo "4. Test proxy:"
echo "   ${YELLOW}Open: http://localhost:5173/test-proxy.html${NC}"
echo ""
echo "5. Check terminal logs for proxy activity"
echo ""
