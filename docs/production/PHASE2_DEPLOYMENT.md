# Production Rights Phase 2 — Deployment

## Required environment variable

Set this in Replit Secrets before using the private admin dashboard:

```
PRODUCTION_ADMIN_EMAILS=your-admin-email@example.com
```

For multiple production administrators, use a comma-separated list:

```
PRODUCTION_ADMIN_EMAILS=person1@example.com,person2@example.com
```

Only an authenticated Replit-auth user whose email appears in this allowlist can access the Production Admin API.

## Database update

After pulling the branch or merging the PR:

```bash
npm run db:push
```

This creates the Phase 2 tables:

- `production_projects`
- `release_requests`
- `executed_releases`
- `release_audit_events`
- `chain_of_title_items`

## Verification

Run:

```bash
npm run check
npm run build
```

Then test:

1. `/production-admin`
2. Create a test production.
3. Create a test agreement/signing link.
4. Open the generated `/production-sign/:token` URL in a private browser window.
5. Sign using a test identity.
6. Download the executed PDF.
7. Return to the admin dashboard and verify that the agreement is `signed` and its chain-of-title item is `cleared`.

## Security model

- Raw signing tokens are never stored in the database; only SHA-256 hashes are stored.
- Signing links may be configured with expiration dates through the API.
- Executed documents are preserved separately from the mutable request record.
- The exact executed text is SHA-256 hashed.
- View and sign actions generate audit events.
- Executed PDFs are available only to someone holding the signing token.
- Admin APIs require authentication plus the `PRODUCTION_ADMIN_EMAILS` allowlist.

## Before production legal use

Have qualified New York production/entertainment counsel review the active agreement templates and replace `[LEGAL ENTITY NAME]` with the correct contracting entity. In particular, confirm:

- indemnity and insurance language;
- worker classification / wage obligations;
- union or guild implications;
- music publishing, master and sample ownership;
- minor performer requirements;
- privacy disclosures for signing audit metadata;
- production-specific permits and location rules.
