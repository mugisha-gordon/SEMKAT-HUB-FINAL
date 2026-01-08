# Admin User Setup Instructions

## Creating the First Admin User

Since Firebase Authentication doesn't automatically create admin users, you need to manually create the first admin user. Here are the recommended approaches:

## Option 1: Create Admin User via Firebase Console (Recommended for Initial Setup)

### Step 1: Create User in Firebase Console
1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Navigate to **Authentication** → **Users**
4. Click **Add user**
5. Enter:
   - **Email**: `admin@semkat.com` (or your preferred admin email)
   - **Password**: `Admin@Semkat2024!` (use a strong password)
6. Click **Add user**
7. Copy the User UID (you'll need this)

### Step 2: Create Admin User Document in Firestore
You can do this in one of two ways:

#### Option A: Using Firebase Console
1. Go to **Firestore Database** in Firebase Console
2. Navigate to the `users` collection
3. Click **Add document**
4. Set Document ID to the User UID from Step 1
5. Add the following fields:

```json
{
  "userId": "<USER_UID>",
  "email": "admin@semkat.com",
  "role": "admin",
  "roles": {
    "admin": {
      "approvedBy": "<USER_UID>",
      "approvedAt": "<CURRENT_TIMESTAMP>"
    },
    "user": {
      "createdAt": "<CURRENT_TIMESTAMP>"
    }
  },
  "profile": {
    "fullName": "Administrator",
    "phone": null,
    "avatarUrl": null,
    "createdAt": "<CURRENT_TIMESTAMP>",
    "updatedAt": "<CURRENT_TIMESTAMP>"
  },
  "createdAt": "<CURRENT_TIMESTAMP>"
}
```

**Note**: Replace `<USER_UID>` with the actual UID, and `<CURRENT_TIMESTAMP>` with a Firestore Timestamp.

#### Option B: Using a Script (More Reliable)

The script `scripts/create-admin.cjs` is already created. Before running it:

**Step 1: Get Firebase Service Account Key**
1. Go to Firebase Console → Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the downloaded JSON file as `scripts/service-account-key.json`

**Step 2: Install firebase-admin** (if not already installed)
```bash
npm install firebase-admin
```

**Step 3: Run the script**
```bash
node scripts/create-admin.cjs
```

This will create an admin user with:
- Email: `gordonmigisha@gmail.com`
- Password: `Rukundo@2014`
- Full Name: Administrator

**Note**: The script uses `.cjs` extension because the project uses ES modules. See `scripts/SETUP_INSTRUCTIONS.md` for detailed instructions.

## Option 2: Create Admin User via Application (Temporary Development Method)

**⚠️ WARNING: Only use this for development/testing. Remove this code before production.**

1. Temporarily modify `src/context/AuthContext.tsx` to auto-create admin on first signup
2. Sign up with the admin email
3. Manually update the user document in Firestore to set `role: 'admin'`
4. Remove the temporary code

## Default Admin Credentials (After Setup)

**Email**: `admin@semkat.com`  
**Password**: `Admin@Semkat2024!`

**⚠️ IMPORTANT**: Change this password immediately after first login!

## Changing Admin Password

1. Log in as admin
2. Go to Settings page
3. Update password (if password change functionality is implemented)
4. OR: Use Firebase Console → Authentication → Users → Reset password

## Creating Additional Admins

Once you have one admin user, you can create more admins:

1. Log in as existing admin
2. Go to Admin Dashboard
3. Use "Register Agent" but manually change the role to 'admin' in Firestore
4. OR: Use the same script/process as creating the first admin

## Security Best Practices

1. **Use Strong Passwords**: Minimum 12 characters, mix of uppercase, lowercase, numbers, symbols
2. **Enable 2FA**: Set up two-factor authentication in Firebase Console
3. **Limit Admin Access**: Only create admin accounts for trusted personnel
4. **Regular Audits**: Review admin users periodically
5. **Change Default Password**: Immediately after first login
6. **Use Service Accounts Securely**: Never commit service account keys to git

## Troubleshooting

### Admin can't log in
- Verify user exists in Firebase Authentication
- Verify user document exists in Firestore `users` collection
- Verify `role` field is set to `'admin'`
- Check Firestore security rules allow admin access

### Admin role not recognized
- Check Firestore document structure matches expected format
- Verify `role` field is exactly `'admin'` (lowercase)
- Check security rules are deployed
- Clear browser cache and cookies

### Cannot access admin routes
- Verify `ProtectedRoute` component checks for admin role
- Check `AuthContext` is fetching role correctly
- Verify user document exists and role is set

## Verification Checklist

After creating the admin user:

- [ ] User exists in Firebase Authentication
- [ ] User document exists in Firestore `users` collection
- [ ] `role` field is set to `'admin'`
- [ ] Can log in with email/password
- [ ] Can access `/admin` route
- [ ] Can see agent applications
- [ ] Can register new agents
- [ ] Can delete agents (after implementation)
- [ ] Security rules allow admin operations
