#!/bin/bash

echo "🚀 Push to GitHub Helper"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "Your changes are committed and ready to push!"
echo ""
echo "Repository: full-stack-dev-johncastrosanabria/InterviewCleanApi"
echo "Branch: main"
echo "Commits ahead: 2"
echo ""

echo -e "${YELLOW}⚠️  Authentication Required${NC}"
echo ""
echo "Choose an authentication method:"
echo ""
echo "1️⃣  GitHub CLI (Recommended - Easiest)"
echo "   - Install: brew install gh"
echo "   - Login: gh auth login"
echo "   - Push: git push origin main"
echo ""
echo "2️⃣  Personal Access Token"
echo "   - Create token at: https://github.com/settings/tokens"
echo "   - Select scope: repo (full control)"
echo "   - Use token as password when pushing"
echo ""
echo "3️⃣  SSH Key"
echo "   - Generate: ssh-keygen -t ed25519 -C \"castrosanabriajohn@gmail.com\""
echo "   - Add to GitHub: https://github.com/settings/keys"
echo "   - Change remote: git remote set-url origin git@github.com:full-stack-dev-johncastrosanabria/InterviewCleanApi.git"
echo ""

echo -e "${BLUE}📖 For detailed instructions, see: PUSH_TO_GITHUB.md${NC}"
echo ""

read -p "Do you want to try pushing now? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "Attempting to push..."
    echo ""
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Successfully pushed to GitHub!${NC}"
        echo ""
        echo "View your changes at:"
        echo "https://github.com/full-stack-dev-johncastrosanabria/InterviewCleanApi"
    else
        echo ""
        echo -e "${YELLOW}❌ Push failed - Authentication required${NC}"
        echo ""
        echo "Please follow one of the authentication methods above."
        echo "See PUSH_TO_GITHUB.md for detailed instructions."
    fi
else
    echo ""
    echo "No problem! When you're ready:"
    echo "  1. Set up authentication (see PUSH_TO_GITHUB.md)"
    echo "  2. Run: git push origin main"
fi

echo ""
