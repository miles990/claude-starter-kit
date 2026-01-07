#!/bin/bash

# Claude Starter Kit - Interactive Initializer
# Non-invasive: Only adds new files, never modifies existing ones
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/miles990/claude-starter-kit/main/init.sh | bash
#   or
#   npx claude-starter-kit init
#   or
#   skillpkg init --template=claude-starter-kit

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

# Config
REPO_URL="https://raw.githubusercontent.com/miles990/claude-starter-kit/main"
TEMPLATE_DIR=".claude-starter-kit-temp"

# Helper functions
print_header() {
    echo ""
    echo -e "${GREEN}╭───────────────────────────────────────────────╮${NC}"
    echo -e "${GREEN}│${NC}  ${BOLD}Claude Starter Kit Initializer${NC}              ${GREEN}│${NC}"
    echo -e "${GREEN}│${NC}  Non-invasive Claude Code configuration      ${GREEN}│${NC}"
    echo -e "${GREEN}╰───────────────────────────────────────────────╯${NC}"
    echo ""
}

print_step() {
    echo -e "${BLUE}[$1/$2]${NC} $3"
}

print_success() {
    echo -e "  ${GREEN}✓${NC} $1"
}

print_skip() {
    echo -e "  ${YELLOW}○${NC} $1 (already exists, skipped)"
}

print_info() {
    echo -e "  ${CYAN}ℹ${NC} $1"
}

# Check if file exists (non-invasive check)
safe_write() {
    local file=$1
    local content=$2

    if [ -f "$file" ]; then
        print_skip "$file"
        return 1
    else
        mkdir -p "$(dirname "$file")"
        echo "$content" > "$file"
        print_success "$file"
        return 0
    fi
}

# Interactive menu
select_option() {
    local prompt=$1
    shift
    local options=("$@")
    local selected=0
    local key

    # Hide cursor
    tput civis

    while true; do
        # Clear and print options
        echo -e "\n${BOLD}$prompt${NC}"
        for i in "${!options[@]}"; do
            if [ $i -eq $selected ]; then
                echo -e "  ${GREEN}●${NC} ${options[$i]}"
            else
                echo -e "  ○ ${options[$i]}"
            fi
        done

        # Read key
        read -rsn1 key

        case "$key" in
            A) # Up arrow
                ((selected--))
                [ $selected -lt 0 ] && selected=$((${#options[@]} - 1))
                ;;
            B) # Down arrow
                ((selected++))
                [ $selected -ge ${#options[@]} ] && selected=0
                ;;
            '') # Enter
                break
                ;;
        esac

        # Move cursor up to redraw
        tput cuu $((${#options[@]} + 2))
    done

    # Show cursor
    tput cnorm

    echo $selected
}

# Multi-select menu
select_multiple() {
    local prompt=$1
    shift
    local options=("$@")
    local selected=()
    local current=0
    local key

    # Initialize all as selected
    for i in "${!options[@]}"; do
        selected[$i]=1
    done

    tput civis

    while true; do
        echo -e "\n${BOLD}$prompt${NC} (Space to toggle, Enter to confirm)"
        for i in "${!options[@]}"; do
            local marker="☐"
            [ ${selected[$i]} -eq 1 ] && marker="☑"

            if [ $i -eq $current ]; then
                echo -e "  ${GREEN}▸${NC} $marker ${options[$i]}"
            else
                echo -e "    $marker ${options[$i]}"
            fi
        done

        read -rsn1 key

        case "$key" in
            A) ((current--)); [ $current -lt 0 ] && current=$((${#options[@]} - 1)) ;;
            B) ((current++)); [ $current -ge ${#options[@]} ] && current=0 ;;
            ' ') selected[$current]=$((1 - ${selected[$current]})) ;;
            '') break ;;
        esac

        tput cuu $((${#options[@]} + 2))
    done

    tput cnorm

    # Return selected indices
    local result=""
    for i in "${!selected[@]}"; do
        [ ${selected[$i]} -eq 1 ] && result="$result $i"
    done
    echo $result
}

# Main
main() {
    print_header

    # Check if already initialized
    if [ -f "skillpkg.json" ] || [ -d ".claude" ]; then
        echo -e "${YELLOW}This project already has Claude configuration.${NC}"
        echo ""
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        [[ ! $REPLY =~ ^[Yy]$ ]] && exit 0
    fi

    # Step 1: Select preset
    print_step 1 4 "Select configuration preset"

    presets=(
        "Minimal      - Just CLAUDE.md + basic rules"
        "Standard     - Memory system + self-evolving agent (Recommended)"
        "Full         - Everything including 47 software skills"
        "Custom       - Choose exactly what you need"
    )

    preset_idx=$(select_option "? Choose a preset:" "${presets[@]}")

    case $preset_idx in
        0) preset="minimal" ;;
        1) preset="standard" ;;
        2) preset="full" ;;
        3) preset="custom" ;;
    esac

    echo -e "\n  Selected: ${GREEN}${presets[$preset_idx]%% *}${NC}"

    # Step 2: Custom selection if needed
    if [ "$preset" = "custom" ]; then
        print_step 2 4 "Select components"

        components=(
            "CLAUDE.md (project entry point)"
            "Basic Rules (code quality, testing)"
            "MCP Configuration (skillpkg, context7)"
            "Memory System (.github/memory/)"
            "Self-Evolving Agent skill"
            "Software Skills (47 modules)"
        )

        selected_components=$(select_multiple "? Select components to install:" "${components[@]}")
        echo -e "\n  Selected: ${GREEN}$(echo $selected_components | wc -w | tr -d ' ') components${NC}"
    fi

    # Step 3: Domain pack (optional)
    if [ "$preset" = "full" ] || [ "$preset" = "custom" ]; then
        print_step 3 4 "Select domain focus (optional)"

        domains=(
            "None - General purpose"
            "Frontend - React, Vue, CSS"
            "Backend - Node.js, Python, APIs"
            "Full-Stack - Frontend + Backend"
            "DevOps - CI/CD, Docker, K8s"
        )

        domain_idx=$(select_option "? Add domain-specific rules?" "${domains[@]}")

        case $domain_idx in
            1) domain="frontend" ;;
            2) domain="backend" ;;
            3) domain="fullstack" ;;
            4) domain="devops" ;;
            *) domain="" ;;
        esac

        [ -n "$domain" ] && echo -e "\n  Selected: ${GREEN}${domains[$domain_idx]%% *}${NC}"
    fi

    # Step 4: Install
    print_step 4 4 "Installing configuration"
    echo ""

    # Create directories
    mkdir -p .claude/rules .claude/skills

    # Install based on preset
    case $preset in
        minimal)
            install_claude_md
            install_basic_rules
            ;;
        standard)
            install_claude_md
            install_basic_rules
            install_mcp_config
            install_memory_system
            install_skillpkg_json "self-evolving-agent"
            ;;
        full)
            install_claude_md
            install_all_rules
            install_mcp_config
            install_memory_system
            install_skillpkg_json "self-evolving-agent" "software-skills"
            ;;
        custom)
            # Install based on selected_components
            [[ $selected_components == *"0"* ]] && install_claude_md
            [[ $selected_components == *"1"* ]] && install_basic_rules
            [[ $selected_components == *"2"* ]] && install_mcp_config
            [[ $selected_components == *"3"* ]] && install_memory_system

            local skills=""
            [[ $selected_components == *"4"* ]] && skills="self-evolving-agent"
            [[ $selected_components == *"5"* ]] && skills="$skills software-skills"
            [ -n "$skills" ] && install_skillpkg_json $skills
            ;;
    esac

    # Install domain-specific rules
    [ -n "$domain" ] && install_domain_rules "$domain"

    # Update .gitignore
    update_gitignore

    # Done
    echo ""
    echo -e "${GREEN}╭───────────────────────────────────────────────╮${NC}"
    echo -e "${GREEN}│${NC}  ${BOLD}Setup Complete!${NC}                             ${GREEN}│${NC}"
    echo -e "${GREEN}╰───────────────────────────────────────────────╯${NC}"
    echo ""
    echo "Next steps:"
    echo ""
    echo -e "  1. Install skills:    ${YELLOW}skillpkg install${NC}"
    echo -e "  2. Sync to Claude:    ${YELLOW}skillpkg sync${NC}"
    echo -e "  3. Start Claude Code: ${YELLOW}claude${NC}"
    echo -e "  4. Try evolving:      ${YELLOW}/evolve [your goal]${NC}"
    echo ""
}

# Installation functions
install_claude_md() {
    safe_write "CLAUDE.md" "# $(basename $(pwd))

> Project configured with Claude Starter Kit

## Quick Reference

- \`/evolve [goal]\` - Trigger self-evolving agent
- \`/memory\` - Edit memory files
- \`skillpkg list\` - Show installed skills

## Project Structure

See @.claude/rules/ for coding standards.
See @.github/memory/index.md for project knowledge.
"
}

install_basic_rules() {
    safe_write ".claude/rules/code-quality.md" '---
paths: src/**/*.{ts,tsx,js,jsx}
---

# Code Quality Standards

- Write clean, readable code with meaningful names
- Follow DRY principle
- Keep functions small and focused
- Handle errors explicitly
'

    safe_write ".claude/rules/testing.md" '---
paths: **/*.test.{ts,tsx,js,jsx}, **/*.spec.{ts,tsx,js,jsx}
---

# Testing Standards

- Use descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Minimum 80% coverage for new code
'
}

install_all_rules() {
    install_basic_rules

    safe_write ".claude/rules/memory-management.md" '# Memory Management

## When to Create Memories

- **Learnings**: Solved a non-trivial problem
- **Failures**: Bug took >30min to solve
- **Decisions**: Architectural choices (ADR)
- **Patterns**: Reusable reasoning approaches

## Memory Workflow

1. Search before starting: `Grep pattern="keyword" path=".github/memory/"`
2. Create memory after learning
3. Update index.md
'

    safe_write ".claude/rules/evolve-workflow.md" '# Self-Evolving Workflow

## Mandatory Checkpoints

1. Before task: Search memory for related experience
2. After changes: Run build + tests
3. After milestone: Verify goal alignment

## Failure Handling

1. Diagnose failure type (A-E)
2. Record if novel
3. Try alternative strategy
4. Escalate after 3 attempts
'
}

install_mcp_config() {
    safe_write ".mcp.json" '{
  "mcpServers": {
    "skillpkg": {
      "command": "npx",
      "args": ["-y", "skillpkg-mcp-server"]
    },
    "context7": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/claude-code-mcp-context7"]
    }
  }
}'

    safe_write ".claude/settings.json" '{
  "permissions": {
    "allow": ["Bash(npm:*)", "Bash(git:*)", "Read", "Write", "Edit", "Glob", "Grep"]
  }
}'
}

install_memory_system() {
    safe_write ".github/memory/index.md" '# Project Memory Index

> Search with: `Grep pattern="keyword" path=".github/memory/"`

## Learnings
<!-- LEARNINGS_START -->
<!-- LEARNINGS_END -->

## Decisions
<!-- DECISIONS_START -->
<!-- DECISIONS_END -->

## Failures
<!-- FAILURES_START -->
<!-- FAILURES_END -->

## Patterns
<!-- PATTERNS_START -->
<!-- PATTERNS_END -->
'

    for dir in learnings decisions failures patterns strategies; do
        mkdir -p ".github/memory/$dir"
        touch ".github/memory/$dir/.gitkeep"
    done

    print_success ".github/memory/ structure"
}

install_skillpkg_json() {
    local skills=""
    for skill in "$@"; do
        if [ -n "$skills" ]; then
            skills="$skills,
"
        fi
        case $skill in
            self-evolving-agent)
                skills="$skills    \"self-evolving-agent\": {
      \"source\": \"github:miles990/self-evolving-agent\"
    }"
                ;;
            software-skills)
                skills="$skills    \"software-skills\": {
      \"source\": \"github:miles990/claude-software-skills\"
    }"
                ;;
        esac
    done

    safe_write "skillpkg.json" "{
  \"name\": \"$(basename $(pwd))\",
  \"skills\": {
$skills
  }
}"
}

install_domain_rules() {
    local domain=$1

    case $domain in
        frontend)
            safe_write ".claude/rules/frontend.md" '---
paths: src/components/**/*.{tsx,jsx}
---
# Frontend Rules
- Use functional components with hooks
- Keep components small (<200 lines)
- Use CSS modules or styled-components
'
            ;;
        backend)
            safe_write ".claude/rules/backend.md" '---
paths: src/api/**/*.ts, src/services/**/*.ts
---
# Backend Rules
- Use dependency injection
- Validate all inputs
- Return consistent error format
'
            ;;
        fullstack)
            install_domain_rules "frontend"
            install_domain_rules "backend"
            ;;
        devops)
            safe_write ".claude/rules/devops.md" '# DevOps Rules
- Use multi-stage Docker builds
- Never commit secrets
- Use environment variables for config
'
            ;;
    esac
}

update_gitignore() {
    local gitignore=".gitignore"
    local additions=(
        ""
        "# Claude Code"
        ".claude/CLAUDE.local.md"
        ".claude/skills/*"
        "!.claude/skills/.gitkeep"
        ".skillpkg/"
    )

    if [ -f "$gitignore" ]; then
        # Check if already has Claude section
        if ! grep -q "# Claude Code" "$gitignore"; then
            printf '%s\n' "${additions[@]}" >> "$gitignore"
            print_success "Updated .gitignore"
        else
            print_skip ".gitignore (Claude section exists)"
        fi
    else
        printf '%s\n' "${additions[@]}" > "$gitignore"
        print_success ".gitignore"
    fi
}

# Run
main "$@"
