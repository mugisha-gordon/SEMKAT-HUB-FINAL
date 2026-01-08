# Supabase to Firebase Migration Guide

## 📋 Overview

This repository contains a comprehensive migration plan and implementation to move from Supabase (PostgreSQL + Supabase Auth) to Firebase (Firestore + Firebase Authentication).

## 📚 Documentation Files

1. **MIGRATION_PLAN.md** - Complete migration strategy, architecture, and timeline
2. **MIGRATION_SUMMARY.md** - Quick reference guide with key changes and commands
3. **FIREBASE_MIGRATION_EXAMPLES.md** - Before/after code examples
4. **MIGRATION_VALIDATION_CHECKLIST.md** - Validation checklist for migration
5. **migration-scripts/README.md** - Data migration script instructions

## 🚀 Quick Start

### 1. Review the Migration Plan

Start by reading `MIGRATION_PLAN.md` to understand the full scope of the migration.

### 2. Set Up Firebase

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password, Google)
3. Create Firestore database
4. Download service account key
5. Configure environment variables (see below)

### 3. Install Dependencies

```bash
npm install firebase
```

### 4. Deploy Security Rules

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Initialize Firebase (if not done)
firebase init

# Deploy rules
firebase deploy --only firestore:rules

# Deploy indexes
firebase deploy --only firestore:indexes
```

### 5. Migrate Data

See `migration-scripts/README.md` for detailed instructions.

```bash
# Export from Supabase
node migration-scripts/export-supabase-data.js

# Transform to Firestore format
node migration-scripts/transform-to-firestore.js

# Import to Firestore
node migration-scripts/import-to-firestore.js
```

### 6. Update Code

Replace Supabase code with Firebase implementations:
- Use `src/context/AuthContext.firebase.tsx` as reference
- Update `src/pages/Admin.tsx` to use Firestore queries
- Update `src/pages/UserDashboard.tsx` to use Firestore queries
- Update `src/pages/Auth.tsx` for Google OAuth

## 📁 File Structure

```
.
├── MIGRATION_PLAN.md                    # Complete migration plan
├── MIGRATION_SUMMARY.md                 # Quick reference
├── FIREBASE_MIGRATION_EXAMPLES.md       # Code examples
├── MIGRATION_VALIDATION_CHECKLIST.md    # Validation checklist
├── firestore.rules                      # Firestore security rules
├── firestore.indexes.json               # Firestore indexes
├── src/
│   ├── integrations/
│   │   ├── firebase/                    # Firebase integration
│   │   │   ├── config.ts
│   │   │   ├── client.ts
│   │   │   ├── types.ts
│   │   │   ├── users.ts
│   │   │   └── agentApplications.ts
│   │   └── supabase/                    # (To be removed after migration)
│   └── context/
│       └── AuthContext.firebase.tsx     # Firebase Auth context
└── migration-scripts/                   # Data migration scripts
    ├── export-supabase-data.js
    ├── transform-to-firestore.js
    ├── import-to-firestore.js
    └── README.md
```

## 🔧 Environment Variables

### Remove (Supabase)
```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

### Add (Firebase)
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 📊 Schema Mapping

| Supabase | Firebase |
|----------|----------|
| `user_roles` table | `users.role` field + `users.roles` map |
| `profiles` table | `users.profile` object (embedded) |
| `agent_applications` table | `agentApplications` collection |

## 🔐 Security Rules

Security rules are defined in `firestore.rules`. Deploy them using:

```bash
firebase deploy --only firestore:rules
```

## ✅ Validation

Use `MIGRATION_VALIDATION_CHECKLIST.md` to validate the migration at each step.

## 🆘 Troubleshooting

Common issues and solutions are documented in:
- `MIGRATION_SUMMARY.md` (Common Issues section)
- `migration-scripts/README.md` (Troubleshooting section)

## 📖 Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)

## ⚠️ Important Notes

1. **Password Migration**: Firebase doesn't support password migration. Users will need to reset passwords or use Google OAuth.

2. **Backup**: Keep Supabase as backup for at least 30 days after migration.

3. **Testing**: Test thoroughly in staging before production deployment.

4. **Rollback**: Have a rollback plan ready (see MIGRATION_PLAN.md).

## 📝 Next Steps

1. ✅ Review migration plan
2. ✅ Set up Firebase project
3. ✅ Configure environment
4. ✅ Deploy security rules
5. ✅ Test migration scripts in staging
6. ✅ Migrate code
7. ✅ Test all features
8. ✅ Migrate data
9. ✅ Deploy to production
10. ✅ Monitor and validate

---

**Last Updated**: See git history for latest changes.
