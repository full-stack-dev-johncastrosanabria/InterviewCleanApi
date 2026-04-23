#!/bin/bash

# React Client Setup Verification Script

echo "🔍 Verifying React Client Setup..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from clients/react-client/${NC}"
    exit 1
fi

echo "📁 Checking file structure..."

# Check critical files
files=(
    "index.html"
    "vite.config.ts"
    "src/main.tsx"
    "src/App.tsx"
    "src/styles/globals.css"
    "src/services/api.ts"
    "src/hooks/useAuth.ts"
    "src/hooks/useProducts.ts"
)

all_files_exist=true
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file ${RED}(MISSING)${NC}"
        all_files_exist=false
    fi
done

echo ""
echo "🔧 Checking configurations..."

# Check index.html for correct script tag
if grep -q 'src="/src/main.tsx"' index.html; then
    echo -e "${GREEN}✓${NC} index.html loads main.tsx correctly"
else
    echo -e "${RED}✗${NC} index.html has wrong script tag"
    echo -e "${YELLOW}  Fix: Change to <script type=\"module\" src=\"/src/main.tsx\"></script>${NC}"
fi

# Check vite.config.ts for proxy
if grep -q "proxy" vite.config.ts; then
    echo -e "${GREEN}✓${NC} Vite proxy configured"
else
    echo -e "${RED}✗${NC} Vite proxy not configured"
fi

# Check API base URL
if grep -q "const API_BASE_URL = ''" src/services/api.ts; then
    echo -e "${GREEN}✓${NC} API base URL set to use proxy"
else
    echo -e "${YELLOW}⚠${NC}  API base URL might not use proxy"
fi

echo ""
echo "📦 Checking dependencies..."

if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules exists"
else
    echo -e "${YELLOW}⚠${NC}  node_modules not found. Run: npm install"
fi

# Check if key packages are installed
if [ -d "node_modules/react" ]; then
    echo -e "${GREEN}✓${NC} React installed"
else
    echo -e "${RED}✗${NC} React not installed"
fi

if [ -d "node_modules/@tanstack/react-query" ]; then
    echo -e "${GREEN}✓${NC} TanStack Query installed"
else
    echo -e "${RED}✗${NC} TanStack Query not installed"
fi

echo ""
echo "🌐 Checking API connectivity..."

# Check if API is running
if curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/api/products | grep -q "401\|200"; then
    echo -e "${GREEN}✓${NC} API is running on http://localhost:5000"
else
    echo -e "${YELLOW}⚠${NC}  API not responding on http://localhost:5000"
    echo -e "${YELLOW}  Start API: cd ../../InterviewCleanApi.Api && dotnet run${NC}"
fi

echo ""
echo "📊 Summary:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ "$all_files_exist" = true ]; then
    echo -e "${GREEN}✓ All critical files present${NC}"
    echo -e "${GREEN}✓ Ready to start development server${NC}"
    echo ""
    echo "🚀 To start the app:"
    echo "   npm run dev"
    echo ""
    echo "Then open: http://localhost:5173"
else
    echo -e "${RED}✗ Some files are missing${NC}"
    echo -e "${YELLOW}  Check the output above for details${NC}"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
