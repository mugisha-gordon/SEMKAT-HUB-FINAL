# Migration Validation Checklist

Use this checklist to validate the migration from Supabase to Firebase.

## Pre-Migration Validation

### Environment Setup
- [ ] Firebase project created
- [ ] Firebase Authentication enabled (Email/Password, Google)
- [ ] Firestore database created
- [ ] Firebase service account key downloaded
- [ ] Environment variables configured
- [ ] Firebase CLI installed (`npm install -g firebase-tools`)
- [ ] Firebase project initialized (`firebase init`)

### Security Rules
- [ ] Firestore security rules written (`firestore.rules`)
- [ ] Security rules tested with Firebase Emulator
- [ ] Rules deployed to Firebase (`firebase deploy --only firestore:rules`)
- [ ] Indexes configured (`firestore.indexes.json`)
- [ ] Indexes deployed (`firebase deploy --only firestore:indexes`)

### Code Preparation
- [ ] Firebase SDK installed (`npm install firebase`)
- [ ] Firebase client configuration created
- [ ] Type definitions created
- [ ] Helper functions created (users.ts, agentApplications.ts)
- [ ] Code reviewed and tested locally

---

## Data Migration Validation

### Export Validation
- [ ] All user_roles exported
- [ ] All profiles exported
- [ ] All agent_applications exported
- [ ] All auth.users exported
- [ ] Export files created successfully
- [ ] Export file sizes reasonable
- [ ] No errors in export logs

### Transform Validation
- [ ] All users transformed correctly
- [ ] All timestamps converted properly
- [ ] All relationships preserved
- [ ] No data loss during transformation
- [ ] JSON files valid
- [ ] Document structure matches schema

### Import Validation
- [ ] All users imported to Firebase Auth (if applicable)
- [ ] All user documents imported to Firestore
- [ ] All agent applications imported
- [ ] Document IDs correct
- [ ] Timestamps preserved correctly
- [ ] No import errors
- [ ] Data count matches source

### Data Integrity Checks
- [ ] User count matches (Supabase vs Firestore)
- [ ] Profile count matches
- [ ] Agent application count matches
- [ ] Role assignments correct
- [ ] User-role relationships preserved
- [ ] Email addresses match
- [ ] Timestamps within expected range

---

## Authentication Validation

### User Authentication
- [ ] Email/password signup works
- [ ] Email/password signin works
- [ ] Google OAuth signin works
- [ ] Sign out works
- [ ] Session persistence works
- [ ] Auth state listener works
- [ ] Protected routes work

### User Document Creation
- [ ] User document created on signup
- [ ] Default role assigned (user)
- [ ] Profile data saved
- [ ] Timestamps set correctly

### Existing Users
- [ ] Existing users can sign in (if migrated)
- [ ] User documents exist for all auth users
- [ ] Roles correctly assigned
- [ ] Profile data accessible

---

## Functional Validation

### User Dashboard
- [ ] User profile loads correctly
- [ ] Profile data displays correctly
- [ ] No errors in console
- [ ] Loading states work

### Admin Dashboard
- [ ] Agent applications list loads
- [ ] Applications filterable by status
- [ ] Approve application works
- [ ] Reject application works
- [ ] Role assignment on approval works
- [ ] Register new agent works
- [ ] All operations work without errors

### Protected Routes
- [ ] Unauthenticated users redirected to /auth
- [ ] Admin route requires admin role
- [ ] Agent dashboard requires agent role
- [ ] Regular users cannot access admin routes

### Role Management
- [ ] User role fetched correctly
- [ ] Role displayed in UI
- [ ] Role-based access control works
- [ ] Admin can change user roles
- [ ] Role changes persist

---

## Security Validation

### Firestore Security Rules
- [ ] Users can read their own documents
- [ ] Users can update their own profiles
- [ ] Users cannot change their own roles
- [ ] Admins can read all documents
- [ ] Admins can update all documents
- [ ] Unauthenticated users cannot read/write
- [ ] Agent applications accessible only to owner or admin

### Authentication Security
- [ ] Passwords not stored in plain text
- [ ] Session tokens secure
- [ ] CSRF protection enabled
- [ ] XSS protection enabled

---

## Performance Validation

### Query Performance
- [ ] User document fetch < 200ms
- [ ] Agent applications list < 500ms
- [ ] Role check < 100ms
- [ ] No N+1 query problems

### Real-time Updates (if implemented)
- [ ] Real-time listeners work
- [ ] Updates propagate correctly
- [ ] No memory leaks
- [ ] Unsubscribe on unmount

### Network Usage
- [ ] No excessive API calls
- [ ] Batch operations used where possible
- [ ] Caching implemented (if applicable)

---

## Error Handling Validation

### Error Scenarios
- [ ] Network errors handled gracefully
- [ ] Permission errors handled
- [ ] Invalid data errors handled
- [ ] Auth errors handled
- [ ] User-friendly error messages
- [ ] Errors logged appropriately

### Edge Cases
- [ ] User document doesn't exist
- [ ] Role document missing
- [ ] Invalid user ID
- [ ] Concurrent updates
- [ ] Offline mode (if applicable)

---

## Browser Compatibility

- [ ] Chrome/Edge works
- [ ] Firefox works
- [ ] Safari works
- [ ] Mobile browsers work
- [ ] No console errors
- [ ] All features functional

---

## Production Readiness

### Monitoring
- [ ] Firebase Console monitoring set up
- [ ] Error logging configured
- [ ] Performance monitoring enabled
- [ ] Usage metrics tracked

### Backup & Recovery
- [ ] Backup strategy defined
- [ ] Recovery procedure documented
- [ ] Supabase data kept as backup (30 days)

### Documentation
- [ ] Migration documentation complete
- [ ] Code comments added
- [ ] Team briefed
- [ ] Support procedures documented

---

## Post-Migration (Week 1)

### Monitoring
- [ ] Daily error rate check
- [ ] Daily performance check
- [ ] User feedback reviewed
- [ ] Support tickets reviewed

### Issues Found
- [ ] List any issues discovered
- [ ] Resolution status
- [ ] Lessons learned documented

### User Feedback
- [ ] User satisfaction survey (if applicable)
- [ ] Common issues identified
- [ ] Improvement opportunities noted

---

## Rollback Criteria

If any of these occur, consider rollback:
- [ ] Critical data loss
- [ ] Authentication completely broken
- [ ] Security breach
- [ ] Performance degradation > 50%
- [ ] User complaints > 10% of user base
- [ ] Revenue impact significant

---

## Sign-off

- [ ] Technical Lead: _________________ Date: _______
- [ ] QA Lead: _________________ Date: _______
- [ ] Product Owner: _________________ Date: _______

---

## Notes

Use this section to document any issues, resolutions, or special considerations during migration.
