# Environment Variables Setup

## Firebase Configuration

The application uses Firebase (not Supabase). You need to configure the following environment variables in your `.env` file:

### Required Variables

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## How to Get Your Firebase Config Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the **gear icon** (⚙️) → **Project settings**
4. Scroll down to **Your apps** section
5. If you don't have a web app yet:
   - Click the **Web** icon (`</>`)
   - Register your app with a nickname (e.g., "semkat-hub-web")
   - The config will be displayed
6. Copy the config values to your `.env` file

### Example Firebase Config (from Firebase Console)

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "my-project.firebaseapp.com",
  projectId: "my-project-id",
  storageBucket: "my-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

Convert to `.env` format:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...
VITE_FIREBASE_AUTH_DOMAIN=my-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=my-project-id
VITE_FIREBASE_STORAGE_BUCKET=my-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Verification

After setting up your `.env` file:

1. **Restart your dev server** (if running):
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

2. **Check the browser console** for any Firebase initialization errors

3. **Try logging in** - if you see Firebase auth errors, check your config values

## Migration from Supabase

If you're migrating from Supabase, note that:
- ✅ All Supabase variables have been removed/replaced
- ✅ The app now uses Firebase exclusively
- ✅ Old Supabase integration files remain in `src/integrations/supabase/` but are **not used**
- ✅ All application code uses Firebase (`src/integrations/firebase/`)

## Security Notes

⚠️ **Never commit your `.env` file to version control!**

The `.env` file is already in `.gitignore`. Your actual Firebase config values should remain private.

Use `.env.example` as a template for other developers (with placeholder values).
