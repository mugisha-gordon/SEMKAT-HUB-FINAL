# Data Migration Scripts

This directory contains scripts to migrate data from Supabase to Firebase Firestore.

## Prerequisites

1. **Node.js** (v14 or higher)
2. **Supabase Service Role Key** - For exporting data
3. **Firebase Admin SDK Service Account** - For importing data

## Setup

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js firebase-admin
```

### 2. Configure Environment Variables

Create a `.env` file or set environment variables:

```bash
# Supabase (for export)
VITE_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_role_key

# Firebase (for import)
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account-key.json
FIREBASE_PROJECT_ID=your_firebase_project_id
```

### 3. Get Firebase Service Account Key

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate New Private Key"
3. Save the JSON file securely
4. Set `GOOGLE_APPLICATION_CREDENTIALS` to the file path

## Migration Process

### Step 1: Export Data from Supabase

```bash
node migration-scripts/export-supabase-data.js
```

This will create:
- `migration-scripts/exported-data/users.json`
- `migration-scripts/exported-data/agent_applications.json`

### Step 2: Transform Data to Firestore Format

```bash
node migration-scripts/transform-to-firestore.js
```

This will create:
- `migration-scripts/firestore-data/users.json`
- `migration-scripts/firestore-data/agent_applications.json`

### Step 3: Import Data to Firestore

```bash
node migration-scripts/import-to-firestore.js
```

**Note**: This will write data to your Firestore database. Make sure you're using the correct Firebase project!

## User Authentication Migration

The scripts above migrate user data, but **NOT authentication credentials**. You have two options:

### Option A: Export/Import Users (Password Reset Required)

1. Export user emails and metadata from Supabase Auth
2. Import users to Firebase Auth using Admin SDK
3. Users will need to reset passwords (Firebase doesn't support password migration)

### Option B: Gradual Migration (Recommended)

1. Keep both systems running
2. New users sign up via Firebase
3. Existing users migrate on next login
4. Handle password reset during migration

## Validation

After import, verify:

1. **User Count**: Check that all users were imported
2. **Role Assignment**: Verify roles are correctly assigned
3. **Profile Data**: Check that profile data is complete
4. **Agent Applications**: Verify all applications are imported
5. **Timestamps**: Verify dates are correct

## Rollback

If you need to rollback:

1. Keep Supabase data as backup (scripts don't delete source data)
2. Revert code changes
3. Update environment variables back to Supabase

## Troubleshooting

### Export Fails

- Verify SUPABASE_SERVICE_KEY has admin access
- Check network connectivity
- Verify table names match your schema

### Transform Fails

- Check that export files exist
- Verify JSON structure
- Check timestamp formats

### Import Fails

- Verify Firebase service account has Firestore write permissions
- Check that collections don't already exist (or clear them first)
- Verify batch size (500 is Firestore limit)
- Check Firebase project ID is correct

### Authentication Issues

- Users need to reset passwords (Firebase doesn't support password migration)
- Verify Firebase Auth is configured
- Check that UIDs match between Auth and Firestore

## Security Notes

- **Never commit** service account keys or service role keys to git
- Use environment variables for sensitive data
- Delete exported data files after migration
- Revoke service role keys after migration
