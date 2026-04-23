#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔑 GitHub SSH Setup - Final Steps"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo -e "${GREEN}✅ SSH Key Generated Successfully!${NC}"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 1: Copy Your SSH Public Key"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${YELLOW}Copy this ENTIRE line:${NC}"
echo ""
cat ~/.ssh/id_ed25519.pub
echo ""
echo ""

read -p "Press Enter after you've copied the key..."
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 2: Add Key to GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Opening GitHub SSH settings in your browser..."
echo ""

# Try to open browser
if command -v open &> /dev/null; then
    open "https://github.com/settings/ssh/new"
elif command -v xdg-open &> /dev/null; then
    xdg-open "https://github.com/settings/ssh/new"
else
    echo "   Please open this URL manually:"
    echo -e "   ${BLUE}https://github.com/settings/ssh/new${NC}"
fi

echo ""
echo "2. In the GitHub page:"
echo "   - Title: MacBook Air (or any name)"
echo "   - Key: Paste the key you copied"
echo "   - Click 'Add SSH key'"
echo ""

read -p "Press Enter after you've added the key to GitHub..."
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 3: Configure Git Remote"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Changing remote URL to SSH..."
git remote set-url origin git@github.com:full-stack-dev-johncastrosanabria/InterviewCleanApi.git

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Remote URL updated to SSH"
else
    echo -e "${RED}✗${NC} Failed to update remote URL"
    exit 1
fi

echo ""
echo "Current remote:"
git remote -v
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 STEP 4: Test SSH Connection"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Testing connection to GitHub..."
echo ""

ssh -T git@github.com 2>&1 | grep -q "successfully authenticated"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓${NC} SSH connection successful!"
else
    echo -e "${YELLOW}⚠${NC}  SSH connection test (this is normal on first connection)"
    echo ""
    echo "When prompted 'Are you sure you want to continue connecting?'"
    echo "Type: yes"
    echo ""
fi

echo ""
read -p "Press Enter to push to GitHub..."
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 STEP 5: Pushing to GitHub"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ SUCCESS! Changes pushed to GitHub!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "View your changes at:"
    echo -e "${BLUE}https://github.com/full-stack-dev-johncastrosanabria/InterviewCleanApi${NC}"
    echo ""
else
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${RED}❌ Push Failed${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Possible issues:"
    echo "1. SSH key not added to GitHub"
    echo "2. Need to accept GitHub's host key (type 'yes' when prompted)"
    echo ""
    echo "Try manually:"
    echo "  ssh -T git@github.com"
    echo "  git push origin main"
    echo ""
    echo "See ADD_SSH_KEY_TO_GITHUB.md for detailed troubleshooting"
fi

echo ""
