# Update .env File for Firebase

## ⚠️ Action Required

Your `.env` file currently contains **Supabase** variables, but the application is now using **Firebase**. You need to update it manually.

## Current .env (Supabase - OLD)

Your `.env` file currently has:
```env
VITE_SUPABASE_PROJECT_ID="zpodaufdnvluvnsnhxvn"
VITE_SUPABASE_PUBLISHABLE_KEY="..."
VITE_SUPABASE_URL="https://zpodaufdnvluvnsnhxvn.supabase.co"
```

## Required .env (Firebase - NEW)

Replace the content with:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Steps to Update

### 1. Get Your Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **gear icon** (⚙️) → **Project settings**
4. Scroll to **Your apps** section
5. If no web app exists:
   - Click the **Web** icon (`</>`)
   - Register app: "semkat-hub-web"
6. Copy the config values

### 2. Update .env File

Open `.env` in your editor and replace ALL content with:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC...your_actual_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

**Replace the values** with your actual Firebase config from Step 1.

### 3. Restart Dev Server

After updating `.env`:
```bash
# Stop the server (Ctrl+C if running)
npm run dev
```

## Verification

✅ **The application is already using Firebase:**
- All code imports from `@/integrations/firebase/`
- AuthContext uses Firebase Auth
- All pages use Firebase client
- No Supabase imports in application code

✅ **You just need to:**
- Update `.env` with Firebase config (as shown above)
- Restart the dev server

## Example Firebase Config

From Firebase Console, you'll see something like:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC1234567890",
  authDomain: "my-project.firebaseapp.com",
  projectId: "my-project-id",
  storageBucket: "my-project.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

Convert to `.env` format (remove quotes, no spaces around `=`):
```env
VITE_FIREBASE_API_KEY=AIzaSyC1234567890
VITE_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-project-id
VITE_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
```

## Need Help?

See `ENV_SETUP.md` for more detailed instructions.
