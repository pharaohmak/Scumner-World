#!/bin/bash
# Jira Helper Script for Git Integration
# Usage: ./jira-helper.sh [command] [options]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration file
CONFIG_FILE=".jira-config.yml"

# Help function
show_help() {
    echo -e "${BLUE}Jira Helper Script${NC}"
    echo ""
    echo "Usage: ./jira-helper.sh [command] [options]"
    echo ""
    echo "Commands:"
    echo "  setup           - Initial setup and configuration"
    echo "  create-branch   - Create a new branch with Jira ticket"
    echo "  validate-commit - Validate commit message for Jira reference"
    echo "  transition      - Transition Jira ticket status"
    echo "  comment         - Add comment to Jira ticket"
    echo "  link-pr         - Link pull request to Jira ticket"
    echo ""
    echo "Examples:"
    echo "  ./jira-helper.sh setup"
    echo "  ./jira-helper.sh create-branch SCRUM-123 'Add user authentication'"
    echo "  ./jira-helper.sh transition SCRUM-123 'In Progress'"
    echo "  ./jira-helper.sh comment SCRUM-123 'Development completed'"
}

# Setup function
setup() {
    echo -e "${BLUE}Setting up Jira integration...${NC}"
    
    if [[ ! -f "$CONFIG_FILE" ]]; then
        echo -e "${RED}Configuration file not found: $CONFIG_FILE${NC}"
        echo "Please update .jira-config.yml with your Jira details"
        return 1
    fi
    
    echo -e "${GREEN}✓ Configuration file found${NC}"
    
    # Check if git hooks are executable
    if [[ -f ".git/hooks/commit-msg" ]]; then
        chmod +x .git/hooks/commit-msg
        echo -e "${GREEN}✓ Commit hook is executable${NC}"
    fi
    
    # Set git commit template
    if [[ -f ".gitmessage" ]]; then
        git config commit.template .gitmessage
        echo -e "${GREEN}✓ Git commit template configured${NC}"
    fi
    
    echo -e "${GREEN}Setup completed successfully!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Update .jira-config.yml with your Jira instance details"
    echo "2. If using GitHub, add these secrets to your repository:"
    echo "   - JIRA_BASE_URL"
    echo "   - JIRA_USER_EMAIL"
    echo "   - JIRA_API_TOKEN"
    echo "3. Start creating branches with: ./jira-helper.sh create-branch SCRUM-XXX 'description'"
}

# Create branch function
create_branch() {
    local ticket="$1"
    local description="$2"
    
    if [[ -z "$ticket" || -z "$description" ]]; then
        echo -e "${RED}Usage: create-branch <JIRA-TICKET> <description>${NC}"
        echo "Example: create-branch SCRUM-123 'Add user authentication'"
        return 1
    fi
    
    # Sanitize description for branch name
    local branch_desc=$(echo "$description" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-\|-$//g')
    local branch_name="feature/${ticket}-${branch_desc}"
    
    echo -e "${BLUE}Creating branch: $branch_name${NC}"
    
    # Create and switch to new branch
    git checkout -b "$branch_name"
    
    echo -e "${GREEN}✓ Branch created successfully${NC}"
    echo "You can now start working on $ticket"
    echo "Remember to reference $ticket in your commit messages"
}

# Validate commit message
validate_commit() {
    local commit_msg="$1"
    local jira_pattern="[A-Z]+-[0-9]+"
    
    if [[ -z "$commit_msg" ]]; then
        commit_msg=$(git log -1 --pretty=%B)
    fi
    
    if echo "$commit_msg" | grep -E "$jira_pattern" > /dev/null; then
        local jira_ticket=$(echo "$commit_msg" | grep -oE "$jira_pattern" | head -1)
        echo -e "${GREEN}✓ Valid Jira reference found: $jira_ticket${NC}"
        return 0
    else
        echo -e "${RED}✗ No Jira ticket reference found in commit message${NC}"
        echo "Commit message: $commit_msg"
        return 1
    fi
}

# Main script logic
case "${1:-help}" in
    "setup")
        setup
        ;;
    "create-branch")
        create_branch "$2" "$3"
        ;;
    "validate-commit")
        validate_commit "$2"
        ;;
    "help"|*)
        show_help
        ;;
esac
