# Jira Integration Setup

This repository is configured with comprehensive Jira integration to streamline project management and development workflows.

## Features

✅ **Automatic Jira ticket validation** in commit messages  
✅ **Branch naming conventions** with Jira ticket references  
✅ **GitHub Actions integration** for automatic Jira updates  
✅ **Commit message templates** with Jira ticket format  
✅ **Helper scripts** for common Jira operations  

## Quick Start

### 1. Configure Jira Settings

Edit `.jira-config.yml` and update with your Jira instance details:

```yaml
jira:
  url: "https://yourcompany.atlassian.net"
  project_key: "SCRUM"
  user_email: "your-email@company.com"
  api_token: "your-api-token"
```

### 2. Setup Integration

Run the setup script:
```bash
./jira-helper.sh setup
```

### 3. Create API Token

1. Go to [Atlassian Account Settings](https://id.atlassian.com/manage-profile/security/api-tokens)
2. Click "Create API token"
3. Copy the token and update `.jira-config.yml`

### 4. Configure GitHub Secrets (if using GitHub)

Add these repository secrets:
- `JIRA_BASE_URL` - Your Jira instance URL
- `JIRA_USER_EMAIL` - Your Jira user email
- `JIRA_API_TOKEN` - Your Jira API token

## Usage

### Creating Branches

Use the helper script to create properly named branches:
```bash
./jira-helper.sh create-branch SCRUM-123 "Add user authentication"
```

This creates a branch: `feature/SCRUM-123-add-user-authentication`

### Commit Messages

Your commit messages must include a Jira ticket reference. The git hook will validate this automatically.

**Valid examples:**
- `feat(auth): add login functionality [SCRUM-123]`
- `fix: resolve database connection issue SCRUM-456`
- `docs: update API documentation (SCRUM-789)`

**Invalid examples:**
- `add new feature` (no Jira reference)
- `update code` (no Jira reference)

### Git Commit Template

When you run `git commit`, you'll see a helpful template:

```
# <type>(<scope>): <subject> [JIRA-XXX]
#
# <body>
#
# Example:
# feat(auth): add user authentication [SCRUM-123]
# 
# Implement JWT-based authentication system for user login
# and registration functionality
#
# Closes SCRUM-123
```

### Automatic Jira Updates

The GitHub Actions workflow automatically:

1. **Comments on Jira tickets** when code is pushed
2. **Transitions tickets to "In Review"** when PRs are opened
3. **Transitions tickets to "Done"** when PRs are merged or code is pushed to main

### Branch Naming Convention

Follow this pattern for branch names:
- `feature/SCRUM-123-description`
- `bugfix/SCRUM-456-description`
- `hotfix/SCRUM-789-description`
- `chore/SCRUM-101-description`

### Bypassing Validation

If you need to bypass commit message validation (not recommended):
```bash
git commit --no-verify
```

## Files Created

- `.gitmessage` - Git commit message template
- `.jira-config.yml` - Jira integration configuration
- `.git/hooks/commit-msg` - Git hook for commit message validation
- `.github/workflows/jira-integration.yml` - GitHub Actions workflow
- `jira-helper.sh` - Helper script for Jira operations
- `JIRA_INTEGRATION.md` - This documentation

## Troubleshooting

### Commit Rejected
If your commit is rejected, ensure your commit message includes a Jira ticket reference like `SCRUM-123`.

### GitHub Actions Failing
1. Verify GitHub secrets are properly configured
2. Check that your Jira API token has proper permissions
3. Ensure the Jira project key matches your configuration

### Helper Script Issues
Make sure the script is executable:
```bash
chmod +x jira-helper.sh
```

## Customization

### Adding More Git Hooks

You can add additional git hooks in `.git/hooks/`:
- `pre-commit` - Run before commits
- `pre-push` - Run before pushes
- `post-commit` - Run after commits

### Modifying Ticket Pattern

Edit the pattern in `.git/hooks/commit-msg` to match your Jira project keys:
```bash
jira_pattern="[A-Z]+-[0-9]+"  # Matches SCRUM-123, DEV-456, etc.
```

### Custom Workflow Actions

Modify `.github/workflows/jira-integration.yml` to add custom actions like:
- Running tests when Jira tickets are updated
- Sending Slack notifications
- Creating deployment tickets

## Support

For issues with this integration:
1. Check the configuration in `.jira-config.yml`
2. Verify Jira API credentials and permissions
3. Test the helper script: `./jira-helper.sh validate-commit`
4. Check GitHub Actions logs for detailed error messages
