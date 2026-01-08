# Supabase to Firebase Migration - Quick Reference

## Overview

This migration moves the application from Supabase (PostgreSQL + Supabase Auth) to Firebase (Firestore + Firebase Authentication).

## Key Changes

### Database
- **Before**: PostgreSQL with tables (user_roles, profiles, agent_applications)
- **After**: Firestore with collections (users, agentApplications)
- **Schema**: Denormalized - user profile embedded in user document

### Authentication
- **Before**: Supabase Auth (`@supabase/supabase-js`)
- **After**: Firebase Auth (`firebase/auth`)
- **Methods**: Email/password, Google OAuth (same as before)

### Code Changes
- Replaced `supabase` client with `firebase` client
- Replaced SQL queries with Firestore document operations
- Replaced RPC functions with Firestore queries
- Replaced RLS policies with Firestore Security Rules

## File Structure

### New Files Created
```
src/integrations/firebase/
  ├── config.ts              # Firebase configuration
  ├── client.ts              # Firebase app, auth, firestore instances
  ├── types.ts               # TypeScript types for Firestore documents
  ├── users.ts               # User document helper functions
  └── agentApplications.ts   # Agent application helper functions

firestore.rules               # Firestore security rules
firestore.indexes.json        # Firestore composite indexes

migration-scripts/
  ├── export-supabase-data.js      # Export data from Supabase
  ├── transform-to-firestore.js    # Transform to Firestore format
  ├── import-to-firestore.js       # Import to Firestore
  └── README.md                    # Migration script instructions

MIGRATION_PLAN.md                  # Detailed migration plan
MIGRATION_VALIDATION_CHECKLIST.md  # Validation checklist
FIREBASE_MIGRATION_EXAMPLES.md     # Code examples (before/after)
```

### Files to Update
- `src/context/AuthContext.tsx` - Replace with Firebase Auth
- `src/pages/Admin.tsx` - Update to use Firestore queries
- `src/pages/UserDashboard.tsx` - Update profile queries
- `src/pages/Auth.tsx` - Update Google OAuth to Firebase
- `package.json` - Replace `@supabase/supabase-js` with `firebase`

## Environment Variables

### Remove
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

### Add
```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
```

## Migration Steps

### 1. Setup (1-2 days)
1. Create Firebase project
2. Enable Authentication (Email/Password, Google)
3. Create Firestore database
4. Install Firebase SDK: `npm install firebase`
5. Add Firebase configuration files
6. Deploy security rules: `firebase deploy --only firestore:rules`

### 2. Code Migration (3-5 days)
1. Create Firebase client and types
2. Create helper functions
3. Update AuthContext
4. Update Admin page
5. Update UserDashboard
6. Update Auth page
7. Test all features

### 3. Data Migration (1-2 days)
1. Export data from Supabase
2. Transform data to Firestore format
3. Import users to Firebase Auth (if applicable)
4. Import data to Firestore
5. Validate data integrity

### 4. Testing & Deployment (2-3 days)
1. Test all features
2. Validate security rules
3. Performance testing
4. Deploy to production
5. Monitor for issues

### 5. Cleanup (1 day)
1. Remove Supabase dependencies
2. Clean up unused code
3. Update documentation
4. Archive Supabase project (after 30 days)

## Quick Command Reference

```bash
# Install Firebase SDK
npm install firebase

# Install Firebase CLI (for deploying rules)
npm install -g firebase-tools

# Initialize Firebase project
firebase init

# Deploy security rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes

# Run migration scripts
node migration-scripts/export-supabase-data.js
node migration-scripts/transform-to-firestore.js
node migration-scripts/import-to-firestore.js
```

## Schema Mapping

| Supabase Table | Firestore Collection | Document Structure |
|---------------|---------------------|-------------------|
| user_roles + profiles | users | Embedded (profile in user doc) |
| agent_applications | agentApplications | Similar structure |

## Authentication Mapping

| Supabase Auth | Firebase Auth |
|--------------|---------------|
| `signInWithPassword()` | `signInWithEmailAndPassword()` |
| `signUp()` | `createUserWithEmailAndPassword()` |
| `signInWithOAuth()` | `signInWithPopup()` with GoogleAuthProvider |
| `signOut()` | `signOut()` |
| `onAuthStateChange()` | `onAuthStateChanged()` |
| `getSession()` | `auth.currentUser` |

## Query Mapping

| Supabase Query | Firestore Query |
|---------------|----------------|
| `.from('table').select('*')` | `getDocs(collection(db, 'collection'))` |
| `.eq('field', value)` | `where('field', '==', value)` |
| `.orderBy('field')` | `orderBy('field')` |
| `.single()` | `getDoc(doc(db, 'collection', id))` |
| `.insert()` | `addDoc()` or `setDoc()` |
| `.update()` | `updateDoc()` |
| `.rpc('function')` | Direct Firestore query or Cloud Function |

## Security Mapping

| Supabase RLS Policy | Firestore Security Rule |
|---------------------|------------------------|
| `USING (auth.uid() = user_id)` | `request.auth.uid == resource.data.userId` |
| `USING (public.has_role(auth.uid(), 'admin'))` | Helper function checking user document |
| `USING (true)` | `allow read: if true;` |

## Common Issues & Solutions

### Issue: User document not found after signup
**Solution**: Ensure `createUserDocument()` is called after `createUserWithEmailAndPassword()`

### Issue: Permission denied errors
**Solution**: Check Firestore security rules are deployed and user has correct role

### Issue: Timestamps not working
**Solution**: Use `Timestamp.fromDate()` or `serverTimestamp()` in Firestore

### Issue: Query performance slow
**Solution**: Create composite indexes in `firestore.indexes.json` and deploy

### Issue: Role not updating
**Solution**: Ensure admin permissions in security rules and `updateUserRole()` function works

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- Migration Plan: See `MIGRATION_PLAN.md`
- Code Examples: See `FIREBASE_MIGRATION_EXAMPLES.md`

## Next Steps

1. Review `MIGRATION_PLAN.md` for detailed migration strategy
2. Review `FIREBASE_MIGRATION_EXAMPLES.md` for code examples
3. Set up Firebase project and configure environment
4. Run migration scripts in staging environment
5. Test thoroughly using `MIGRATION_VALIDATION_CHECKLIST.md`
6. Deploy to production
