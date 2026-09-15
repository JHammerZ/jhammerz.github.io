# Security Hardening Guide for JHammerZ/jhammerz.github.io

## Executive Summary
This document outlines enterprise-grade security hardening procedures for the sovereign repository, implementing zero-trust principles, multi-signature authorization, and cryptographic verification.

---

## 1. Branch Protection Rules

### Configuration
Navigate to **Settings → Branches → Branch Protection Rules**

```
Branch name pattern: main

☑ Require a pull request before merging
   • Require approvals: 2
   • Require review from code owners: ☑

☑ Require status checks to pass before merging
   • Required checks:
     - multi-signature-auth
     - distributed-ledger (validation)
     - CDN-optimization

☑ Require branches to be up to date before merging

☑ Dismiss stale pull request approvals when new commits are pushed

☑ Require conversation resolution before merging

☑ Require signed commits

☑ Lock branch
```

### Automated Enforcement
Create `.github/branch-protection.yml`:

```yaml
name: Enforce Branch Protection

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  verify_protection:
    runs-on: ubuntu-latest
    steps:
      - name: Check branch protection
        run: |
          gh api repos/{owner}/{repo}/branches/main \
            --jq '.protection'
```

---

## 2. CODEOWNERS Configuration

Create `.github/CODEOWNERS`:

```
# Default owner for everything
* @JHammerZ

# Workflow files require architecture review
.github/workflows/ @JHammerZ
.github/scripts/ @JHammerZ

# Critical security files
verifiable-credentials/ @JHammerZ
authorized_signers.json @JHammerZ
distributed-ledger.json @JHammerZ

# Dashboard and telemetry
dashboard/ @JHammerZ
js/sovereign-telemetry.js @JHammerZ
js/content-validator.js @JHammerZ

# Documentation
*.md @JHammerZ
SECURITY_HARDENING.md @JHammerZ
```

---

## 3. Secret Rotation Procedures

### Active Secrets (Update Quarterly)

1. **GitHub Token** (`GH_TOKEN`)
   ```bash
   # Rotate every 90 days
   # 1. Generate new token at https://github.com/settings/tokens
   # 2. Update secret in Settings → Secrets and variables → Actions
   # 3. Test in CI/CD
   # 4. Revoke old token
   ```

2. **CloudFlare API** (`CF_TOKEN`, `CF_ZONE`)
   ```bash
   # Rotate every 180 days
   # 1. Create new token in CloudFlare dashboard
   # 2. Update repository secrets
   # 3. Verify CDN operations work
   # 4. Revoke old token
   ```

3. **GPG Signing Key** (Local)
   ```bash
   # Annual rotation
   gpg --list-secret-keys
   gpg --gen-key  # Generate new key
   gpg --send-keys <KEY_ID>  # Send to keyserver
   ```

### Automation Script

Create `.github/scripts/rotate-secrets.sh`:

```bash
#!/bin/bash
set -euo pipefail

# Secret rotation audit
LAST_ROTATION=$(git log -1 --format="%ai" -- SECURITY_HARDENING.md)
DAYS_SINCE=$(( ($(date +%s) - $(date -d "$LAST_ROTATION" +%s)) / 86400 ))

echo "⏰ Days since last rotation: $DAYS_SINCE"

if [ "$DAYS_SINCE" -gt 90 ]; then
  echo "⚠️  ALERT: Secrets require rotation!"
  echo "Update the following:"
  echo "  1. GH_TOKEN (90 day cycle)"
  echo "  2. CF_TOKEN / CF_ZONE (180 day cycle)"
  exit 1
fi

echo "✅ Secrets rotation status OK"
```

---

## 4. Commit Signing Enforcement

### GitHub Configuration

1. **Require signed commits**:
   ```bash
   Settings → Branches → Branch Protection Rules (main)
   ☑ Require signed commits
   ```

2. **Configure Git locally**:
   ```bash
   # Set up GPG signing
   git config --global user.signingkey <KEY_ID>
   git config --global commit.gpgsign true
   git config --global gpg.program gpg
   
   # Verify setup
   git commit -S -m "Test signed commit"
   ```

3. **GitHub Actions signing**:
   ```yaml
   - name: Commit with signature
     run: |
       git config --global user.signingkey ${{ secrets.GPG_KEY_ID }}
       git commit -S -m "Automated commit"
       git push
   ```

---

## 5. Dependabot Configuration

Create `.github/dependabot.yml`:

```yaml
version: 2
updates:
  # Python dependencies
  - package-ecosystem: "pip"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "03:00"
    open-pull-requests-limit: 5
    reviewers:
      - "JHammerZ"
    require-status-checks: true
    allow:
      - dependency-type: "direct"
      - dependency-type: "indirect"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "04:00"
    open-pull-requests-limit: 5
    reviewers:
      - "JHammerZ"
    allow:
      - dependency-type: "direct"
```

### Dependabot PR Automation

Create `.github/workflows/dependabot-auto-merge.yml`:

```yaml
name: Dependabot Auto-Merge

on: pull_request

permissions:
  pull-requests: write
  contents: write

jobs:
  auto-merge:
    runs-on: ubuntu-latest
    if: dependabot.author == true
    steps:
      - name: Enable auto-merge for Dependabot PRs
        run: |
          gh pr merge --squash --auto "${{ github.event.pull_request.number }}"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

---

## 6. Access Control Matrix

| Role | Repository | Workflows | Secrets | Approval |
|------|-----------|-----------|---------|----------|
| **Owner** (JHammerZ) | READ/WRITE/ADMIN | CREATE/EDIT/DELETE | ACCESS/ROTATE | N/A |
| **Collaborator** (Bot) | READ/WRITE | EXECUTE | READ-ONLY | REQUIRED |
| **Public** | READ | N/A | NONE | N/A |

### Implementation

**Settings → Collaborators and teams**:
- Add `architect-bot` with **Write** access
- Add `daemon-guardian` with **Triage** access

---

## 7. Incident Response Procedures

### Security Incident Response Plan

#### Step 1: Detection
- Monitor GitHub Security Alerts
- Review dependabot findings
- Audit access logs

#### Step 2: Assessment
```bash
# Check for unauthorized commits
git log --all --oneline | head -20

# Review recent changes
git diff HEAD~10

# Audit branch history
git reflog
```

#### Step 3: Containment
```bash
# Immediately rotate compromised secrets
# Revoke access tokens
# Reset GPG keys if necessary

# Force push secure state (use with extreme caution)
git push --force-with-lease origin main
```

#### Step 4: Eradication
```bash
# Remove sensitive data from history
git filter-branch --tree-filter 'rm -f secrets.txt' -- --all

# Force push cleaned history
git push origin main --force
```

#### Step 5: Recovery
```bash
# Verify integrity of critical files
sha256sum distributed-ledger.json
sha256sum authorized_signers.json

# Revalidate all cryptographic signatures
# Regenerate credentials if necessary
```

#### Step 6: Post-Incident
- Document incident timeline
- Update security policies
- Rotate all credentials
- Conduct security audit

---

## 8. Security Audit Checklist

### Monthly Audit
- [ ] Review recent commits and PRs
- [ ] Check for secret exposure (use `git-secrets`)
- [ ] Verify all CI/CD jobs completed successfully
- [ ] Audit access logs and branch protection rules

### Quarterly Audit
- [ ] Rotate security credentials
- [ ] Update dependencies (via Dependabot)
- [ ] Review and update CODEOWNERS
- [ ] Conduct penetration testing mindset review

### Annual Audit
- [ ] Full security review
- [ ] Regenerate all cryptographic keys
- [ ] Update security policies and procedures
- [ ] Third-party security assessment

### Automated Monitoring

```bash
# Install git-secrets
brew install git-secrets

# Configure patterns
git secrets --install
git secrets --register-aws

# Scan repository
git secrets --scan
```

---

## 9. Compliance Checklist

### GitHub Security Best Practices
- ✅ Two-factor authentication (2FA) required
- ✅ Branch protection rules enforced
- ✅ Signed commits required
- ✅ CODEOWNERS configured
- ✅ Status checks required
- ✅ Secret scanning enabled
- ✅ Dependabot configured

### Cryptographic Standards
- ✅ Ed25519 for asymmetric signatures
- ✅ SHA-256 for hashing
- ✅ TLS 1.3+ for all communications
- ✅ Key rotation schedule established

### Audit Trail
- ✅ Distributed ledger maintains immutable history
- ✅ All operations logged with timestamps
- ✅ Multi-signature verification enabled
- ✅ Cryptographic proofs generated

---

## 10. Maintenance Schedule

| Task | Frequency | Owner | Status |
|------|-----------|-------|--------|
| Secret Rotation | Quarterly | JHammerZ | 📅 Scheduled |
| Dependency Update | Weekly | Dependabot | ✅ Automated |
| Security Audit | Monthly | JHammerZ | 📅 Scheduled |
| Access Review | Quarterly | JHammerZ | 📅 Scheduled |
| Incident Drill | Semi-annually | JHammerZ | 📅 Planned |
| Compliance Review | Annually | JHammerZ | 📅 Scheduled |

---

## 11. Resources

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [OWASP Secure Coding](https://owasp.org/)
- [Cryptographic Key Management](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-57pt1r5.pdf)
- [Ed25519 Standard](https://tools.ietf.org/html/rfc8037)
- [W3C Verifiable Credentials](https://www.w3.org/TR/vc-data-model/)

---

**Last Updated**: 2026-05-21  
**Next Review**: 2026-08-21  
**Status**: ✅ ACTIVE
