# Quick Start Guide

Get the application running in 5 minutes!

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Firebase
1. Create project at https://console.firebase.google.com
2. Enable Authentication (Email/Password + Google)
3. Create Firestore database
4. Copy your Firebase config

### 3. Create `.env` File
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Security Rules
```bash
npm install -g firebase-tools
firebase login
firebase init  # Select Firestore, use existing project
firebase deploy --only firestore:rules
```

### 5. Create Admin User
See `ADMIN_SETUP.md` for detailed instructions.

**Quick method** (Firebase Console):
1. Go to Authentication → Add user
2. Email: `admin@semkat.com`, Password: `Admin@Semkat2024!`
3. Copy the User UID
4. Go to Firestore → Create document in `users` collection
5. Document ID = User UID
6. Add fields (see `ADMIN_SETUP.md` for structure)

### 6. Run the Application
```bash
npm run dev
```

Open http://localhost:5173 in your browser!

## ✅ Test Checklist

- [ ] Application starts without errors
- [ ] Can sign up new user
- [ ] Can log in as admin
- [ ] Admin can access `/admin` route
- [ ] Admin can register new agent
- [ ] Agent can post property
- [ ] Agent can post video
- [ ] Properties show on `/properties` page
- [ ] Videos show on `/explore` page
- [ ] Users can post videos

## 📚 Full Documentation

- `HOW_TO_RUN.md` - Complete running instructions
- `ADMIN_SETUP.md` - Admin user setup
- `MIGRATION_COMPLETE.md` - Migration status
- `FEATURE_IMPLEMENTATION_SUMMARY.md` - Feature status

---

**Need help?** Check the troubleshooting section in `HOW_TO_RUN.md`
