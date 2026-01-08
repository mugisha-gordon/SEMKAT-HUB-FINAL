# Supabase to Firebase Firestore Migration Plan

## Executive Summary

This document outlines a comprehensive migration strategy to transition from Supabase (PostgreSQL + Supabase Auth) to Firebase (Firestore + Firebase Authentication). The migration preserves all existing functionality while switching to Firebase's NoSQL document database architecture.

---

## 1. Current Supabase Architecture Audit

### 1.1 Database Schema

#### Tables Identified:

1. **`user_roles`**
   - Fields: `id` (UUID), `user_id` (UUID), `role` (enum: admin/agent/user), `created_at`, `approved_by`, `approved_at`
   - Relationships: References `auth.users(id)`
   - Constraints: UNIQUE(user_id, role)

2. **`profiles`**
   - Fields: `id` (UUID), `user_id` (UUID, UNIQUE), `full_name` (TEXT), `phone` (TEXT), `avatar_url` (TEXT), `created_at`, `updated_at`
   - Relationships: References `auth.users(id)` ON DELETE CASCADE

3. **`agent_applications`**
   - Fields: `id` (UUID), `user_id` (UUID), `full_name`, `phone`, `email`, `company`, `license_number`, `experience_years`, `status` (pending/approved/rejected), `reviewed_by`, `reviewed_at`, `notes`, `created_at`
   - Relationships: References `auth.users(id)` ON DELETE CASCADE

#### Database Functions (RPC):

1. **`get_user_role(_user_id UUID)`**
   - Returns: `app_role` (admin/agent/user)
   - Logic: Returns highest priority role (admin > agent > user)

2. **`has_role(_user_id UUID, _role app_role)`**
   - Returns: `boolean`
   - Logic: Checks if user has specific role

### 1.2 Authentication

- **Provider**: Supabase Auth
- **Methods**: Email/password, Google OAuth
- **Session Storage**: localStorage
- **Features Used**:
  - Sign up with email/password
  - Sign in with email/password
  - Google OAuth sign-in
  - Session management
  - Auth state listeners
  - User metadata (full_name in signup)

### 1.3 Storage

- **Status**: Not currently used (no `.storage` calls found)

### 1.4 Row Level Security (RLS) Policies

#### `user_roles`:
- Users can view their own roles
- Admins can view all roles
- Admins can insert/update/delete roles

#### `profiles`:
- All users can view all profiles
- Users can update their own profile
- Users can insert their own profile

#### `agent_applications`:
- Users can view their own applications
- Users can create applications
- Admins can view all applications
- Admins can update applications

### 1.5 Code Usage Patterns

**Files using Supabase:**
- `src/context/AuthContext.tsx` - Auth state, role fetching
- `src/pages/Admin.tsx` - Agent applications, user roles management
- `src/pages/UserDashboard.tsx` - Profile fetching
- `src/pages/Auth.tsx` - Google OAuth

---

## 2. Firestore Schema Design

### 2.1 Collection Structure

#### **`users` Collection**
Document ID: Firebase Auth UID

```typescript
{
  userId: string,              // Firebase Auth UID (document ID)
  email: string,
  role: 'admin' | 'agent' | 'user',  // Primary role
  roles: {                      // Multi-role support
    admin?: {
      approvedBy: string,
      approvedAt: Timestamp
    },
    agent?: {
      approvedBy: string,
      approvedAt: Timestamp
    },
    user: {
      createdAt: Timestamp
    }
  },
  profile: {
    fullName: string | null,
    phone: string | null,
    avatarUrl: string | null,
    createdAt: Timestamp,
    updatedAt: Timestamp
  },
  createdAt: Timestamp
}
```

#### **`agentApplications` Collection**
Document ID: Auto-generated

```typescript
{
  id: string,                   // Document ID
  userId: string,               // Reference to Firebase Auth UID
  fullName: string,
  phone: string,
  email: string,
  company: string | null,
  licenseNumber: string | null,
  experienceYears: number | null,
  status: 'pending' | 'approved' | 'rejected',
  reviewedBy: string | null,    // Firebase Auth UID
  reviewedAt: Timestamp | null,
  notes: string | null,
  createdAt: Timestamp
}
```

### 2.2 Design Decisions

1. **Embedded Profile**: Profile data embedded in `users` document (1:1 relationship)
2. **Role as Field + Map**: Primary `role` field for quick access, `roles` map for audit trail
3. **No Joins Required**: All user data in single document for fast reads
4. **Denormalization**: Email stored in `users` document for easier queries

---

## 3. Authentication Migration

### 3.1 Firebase Authentication Setup

**Features to Enable:**
- Email/Password authentication
- Google OAuth provider
- Email verification (optional, matching Supabase behavior)

### 3.2 User Migration Strategy

**Option A: Export/Import (Recommended for Production)**

1. Export users from Supabase Auth
2. Import to Firebase Auth using Admin SDK
3. Preserve UIDs where possible (Firebase supports custom UIDs)
4. Handle password migration (users must reset passwords, or use custom auth tokens)

**Option B: Gradual Migration (Zero Downtime)**

1. Run both systems in parallel
2. New signups go to Firebase
3. Existing users migrate on next login
4. Update passwords during migration

### 3.3 Code Changes

- Replace `@supabase/supabase-js` with `firebase/auth`
- Update AuthContext to use Firebase Auth
- Map session management to Firebase Auth persistence
- Update Google OAuth to Firebase Google provider

---

## 4. Data Migration

### 4.1 Export Process

**From Supabase:**
```sql
-- Export user_roles
SELECT * FROM public.user_roles;

-- Export profiles
SELECT * FROM public.profiles;

-- Export agent_applications
SELECT * FROM public.agent_applications;

-- Export auth.users (email, id, created_at)
SELECT id, email, created_at, raw_user_meta_data 
FROM auth.users;
```

### 4.2 Transformation Script

Create a Node.js script to:
1. Read exported CSV/JSON files
2. Transform to Firestore document structure
3. Map UUIDs to Firebase Auth UIDs
4. Convert timestamps to Firestore Timestamps
5. Combine user_roles and profiles into single `users` document

### 4.3 Import Process

Use Firebase Admin SDK to:
1. Create/update users in Firebase Auth (preserve UIDs if possible)
2. Batch write documents to Firestore
3. Set document IDs to match Firebase Auth UIDs for `users` collection
4. Handle errors and retries

---

## 5. Security Rules Migration

### 5.1 Firestore Security Rules

See `firestore.rules` file for complete rules. Key mappings:

**Supabase RLS → Firestore Rules:**

- `auth.uid() = user_id` → `request.auth != null && request.auth.uid == resource.data.userId`
- `public.has_role(auth.uid(), 'admin')` → Custom function checking `get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin'`
- `USING (true)` → `allow read: if true;` (public read)

### 5.2 Role Checking

Create helper functions in security rules:
- `isAdmin(uid)` - Checks if user has admin role
- `isOwnerOrAdmin(uid, resourceUserId)` - Checks ownership or admin status

---

## 6. Code Migration Strategy

### 6.1 Phase 1: Setup (No Breaking Changes)

1. Install Firebase SDK
2. Create Firebase client configuration
3. Create Firestore helper functions
4. Keep Supabase code intact

### 6.2 Phase 2: Parallel Running (Optional)

1. Write to both systems during migration
2. Read from Firebase, fallback to Supabase
3. Gradual feature-by-feature migration

### 6.3 Phase 3: Cutover

1. Switch all reads to Firebase
2. Remove Supabase dependencies
3. Clean up Supabase code

### 6.4 Files to Update

1. **`src/integrations/supabase/client.ts`** → `src/integrations/firebase/client.ts`
2. **`src/integrations/supabase/types.ts`** → `src/integrations/firebase/types.ts`
3. **`src/context/AuthContext.tsx`** - Replace Supabase Auth with Firebase Auth
4. **`src/pages/Admin.tsx`** - Replace Supabase queries with Firestore queries
5. **`src/pages/UserDashboard.tsx`** - Replace profile query with Firestore
6. **`src/pages/Auth.tsx`** - Replace Google OAuth with Firebase Google Auth

---

## 7. Risks and Mitigation Strategies

### 7.1 Data Loss Risk

**Risk**: Data corruption during migration  
**Mitigation**:
- Full backup before migration
- Test migration on staging environment
- Validate data after import
- Keep Supabase as backup for 30 days

### 7.2 Authentication Disruption

**Risk**: Users cannot log in  
**Mitigation**:
- Gradual migration with parallel running
- Clear communication to users
- Password reset flow ready
- Support team briefed

### 7.3 Performance Impact

**Risk**: Firestore queries slower than PostgreSQL  
**Mitigation**:
- Create composite indexes for queries
- Use proper query patterns (avoid full collection scans)
- Cache frequently accessed data
- Monitor query performance

### 7.4 Role System Complexity

**Risk**: Role checking more complex in Firestore  
**Mitigation**:
- Create helper functions in security rules
- Cache role in user document for fast access
- Use Cloud Functions for complex role logic if needed

### 7.5 Cost Considerations

**Risk**: Firestore costs higher than Supabase  
**Mitigation**:
- Estimate costs before migration
- Optimize read/write operations
- Use caching strategies
- Monitor usage with Firebase console

---

## 8. Rollback Strategy

### 8.1 Preparation

1. Keep Supabase project active for 30 days
2. Document all changes in version control
3. Create feature flags for Firebase/Supabase toggle
4. Test rollback procedure in staging

### 8.2 Rollback Procedure

1. Revert code to previous commit
2. Update environment variables to Supabase
3. Verify authentication works
4. Verify data integrity
5. Notify users if necessary

### 8.3 Data Synchronization

If rollback needed after data changes:
- Export new data from Firestore
- Transform back to PostgreSQL format
- Import to Supabase (manual process)

---

## 9. Migration Timeline

### Phase 1: Preparation (Week 1)
- [ ] Set up Firebase project
- [ ] Configure Firebase Authentication
- [ ] Create Firestore collections structure
- [ ] Write security rules
- [ ] Create migration scripts
- [ ] Test on staging environment

### Phase 2: Code Migration (Week 2)
- [ ] Install Firebase SDK
- [ ] Create Firebase client and types
- [ ] Migrate AuthContext
- [ ] Migrate Admin page
- [ ] Migrate UserDashboard
- [ ] Update Auth page
- [ ] Test all features

### Phase 3: Data Migration (Week 3)
- [ ] Export data from Supabase
- [ ] Transform data to Firestore format
- [ ] Import users to Firebase Auth
- [ ] Import data to Firestore
- [ ] Validate data integrity
- [ ] Test with production data copy

### Phase 4: Cutover (Week 4)
- [ ] Final testing
- [ ] Deploy to production
- [ ] Monitor for issues
- [ ] User acceptance testing
- [ ] Documentation update

### Phase 5: Cleanup (Week 5)
- [ ] Remove Supabase dependencies
- [ ] Clean up unused code
- [ ] Update documentation
- [ ] Archive Supabase project (after 30 days)

---

## 10. Validation Checklist

### Pre-Migration
- [ ] Firebase project created and configured
- [ ] Firestore security rules written and tested
- [ ] Migration scripts tested on staging
- [ ] Backup of Supabase data created
- [ ] Team briefed on migration plan

### Post-Migration
- [ ] All users can authenticate
- [ ] User roles correctly assigned
- [ ] Admin can manage agent applications
- [ ] User profiles accessible
- [ ] Google OAuth working
- [ ] Security rules enforce access control
- [ ] No data loss
- [ ] Performance acceptable
- [ ] Error handling working
- [ ] Logging and monitoring active

### Post-Cutover (1 week)
- [ ] No critical bugs reported
- [ ] User satisfaction maintained
- [ ] Performance metrics within expected range
- [ ] Cost within budget
- [ ] Documentation updated
- [ ] Team trained on Firebase

---

## 11. Code Examples

See accompanying files:
- `FIREBASE_MIGRATION_EXAMPLES.md` - Before/after code comparisons
- `firestore.rules` - Complete security rules
- `migration-scripts/` - Data migration scripts
- Updated source files in `src/integrations/firebase/`

---

## 12. Support and Resources

### Firebase Documentation
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

### Migration Tools
- Firebase Admin SDK for data import
- Firebase CLI for rules deployment
- Firebase Console for monitoring

---

## Appendix A: Environment Variables

### Supabase (Current)
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
```

### Firebase (New)
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Appendix B: Cost Comparison

### Supabase (Estimated)
- Free tier: 500MB database, 1GB file storage
- Pro: $25/month (8GB database, 100GB storage)

### Firebase (Estimated)
- Spark (Free): 1GB storage, 50K reads/day, 20K writes/day
- Blaze (Pay-as-you-go): $0.18/GB storage, $0.06/100K reads, $0.18/100K writes

**Note**: Calculate based on your usage patterns before migration.
