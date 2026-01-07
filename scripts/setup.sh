#!/bin/bash

# Claude Starter Kit - Setup Script
# Uses skillpkg for professional skill management
#
# Usage:
#   ./scripts/setup.sh              # Full setup
#   ./scripts/setup.sh --skip-npm   # Skip npm install

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${GREEN}╭───────────────────────────────────────────╮${NC}"
echo -e "${GREEN}│${NC}  Claude Starter Kit Setup                 ${GREEN}│${NC}"
echo -e "${GREEN}╰───────────────────────────────────────────╯${NC}"
echo ""

# Parse arguments
SKIP_NPM=false
while [[ $# -gt 0 ]]; do
    case $1 in
        --skip-npm) SKIP_NPM=true; shift ;;
        *) shift ;;
    esac
done

# Step 1: Check prerequisites
echo -e "${BLUE}[1/4] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is required${NC}"
    echo "Install from: https://nodejs.org/"
    exit 1
fi

if ! command -v git &> /dev/null; then
    echo -e "${RED}Error: Git is required${NC}"
    exit 1
fi

echo -e "  ${GREEN}✓${NC} Node.js $(node -v)"
echo -e "  ${GREEN}✓${NC} Git $(git --version | cut -d' ' -f3)"
echo ""

# Step 2: Install skillpkg globally (optional)
if [ "$SKIP_NPM" = false ]; then
    echo -e "${BLUE}[2/4] Installing skillpkg...${NC}"

    if command -v skillpkg &> /dev/null; then
        echo -e "  ${GREEN}✓${NC} skillpkg already installed"
    else
        echo "  Installing skillpkg globally..."
        npm install -g skillpkg-cli 2>/dev/null || {
            echo -e "  ${YELLOW}Note: Global install failed, will use npx${NC}"
        }
    fi
    echo ""
fi

# Step 3: Initialize skillpkg
echo -e "${BLUE}[3/4] Setting up skills...${NC}"

if command -v skillpkg &> /dev/null; then
    # Use global skillpkg
    skillpkg install
else
    # Use npx
    npx skillpkg-cli install
fi

echo ""

# Step 4: Sync to Claude Code
echo -e "${BLUE}[4/4] Syncing to Claude Code...${NC}"

if command -v skillpkg &> /dev/null; then
    skillpkg sync
else
    npx skillpkg-cli sync
fi

echo ""

# Done
echo -e "${GREEN}╭───────────────────────────────────────────╮${NC}"
echo -e "${GREEN}│${NC}  Setup Complete!                          ${GREEN}│${NC}"
echo -e "${GREEN}╰───────────────────────────────────────────╯${NC}"
echo ""
echo "Next steps:"
echo "  1. Open this project in Claude Code: ${YELLOW}claude${NC}"
echo "  2. Try the self-evolving agent: ${YELLOW}/evolve [goal]${NC}"
echo "  3. Edit memory files: ${YELLOW}/memory${NC}"
echo ""
echo "Skill management with skillpkg:"
echo "  ${YELLOW}skillpkg search <query>${NC}     # Find skills"
echo "  ${YELLOW}skillpkg install <source>${NC}  # Install skill"
echo "  ${YELLOW}skillpkg list${NC}              # Show installed"
echo "  ${YELLOW}skillpkg sync${NC}              # Sync to platforms"
