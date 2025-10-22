# Firestore Migration Plan

This file describes the safe approach to migrate existing Firestore data to the new structure.

## Backup current production DB

Use the managed export facility or gcloud:
```bash
gcloud firestore export gs://YOUR_BUCKET_NAME/backup-$(date +%Y%m%d)
```

Inspect the structure of existing collections and documents.

## Create a migration script (Node) that:

1. Reads documents from existing collections
2. Transforms fields to match the new schema (orgs -> yachts -> bookings)
3. Writes transformed documents to a staging project / staging collection
4. Verifies counts and spot-check consistency

## Run migrations on a staging Firebase project first.

Promote migrated data to production after verification.

## Notes:

- Do not run bulk deletes or transformations on production without backups and a rollback plan.
- Migrations should be idempotent where possible.
