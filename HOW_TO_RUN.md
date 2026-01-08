# How to Run the Application

This guide will help you set up and run the Semkat Hub application locally.

## Prerequisites

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Firebase Account** - [Sign up](https://firebase.google.com/)

## Step 1: Install Dependencies

Open a terminal in the project directory and run:

```bash
npm install
```

This will install all required dependencies including:
- React and React DOM
- Firebase SDK
- UI components (shadcn/ui, Radix UI)
- Other dependencies

## Step 2: Set Up Firebase

### 2.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., "semkat-hub")
4. Follow the setup wizard
5. Enable Google Analytics (optional)

### 2.2 Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** provider
4. Enable **Google** provider (optional but recommended)
   - Add authorized domains
   - Configure OAuth consent screen if needed

### 2.3 Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (we'll update rules)
4. Select a location (choose closest to your users)
5. Click **Enable**

### 2.4 Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click the **Web** icon (`</>`)
4. Register app with a nickname (e.g., "semkat-hub-web")
5. Copy the Firebase configuration object

### 2.5 Create Environment File

Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase config values.

## Step 3: Deploy Firestore Security Rules

### 3.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 3.2 Login to Firebase

```bash
firebase login
```

### 3.3 Initialize Firebase in Project

```bash
firebase init
```

Select:
- **Firestore**: Configure security rules and indexes
- Use existing project (select your Firebase project)
- Use `firestore.rules` (already exists)
- Use `firestore.indexes.json` (already exists)

### 3.4 Deploy Rules

```bash
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Step 4: Create Admin User

Follow the instructions in `ADMIN_SETUP.md` to create your first admin user.

Quick summary:
- Option 1: Use Firebase Console (Authentication → Add user, then create user document in Firestore)
- Option 2: Use the script provided in `ADMIN_SETUP.md`

Default admin credentials (change after first login):
- **Email**: `admin@semkat.com`
- **Password**: `Admin@Semkat2024!`

## Step 5: Run the Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173` (or another port if 5173 is busy).

You should see output like:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 6: Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Available Routes

- `/` - Home page
- `/properties` - Browse all properties
- `/explore` - TikTok-style video feed
- `/agents` - View all agents
- `/favorites` - Saved properties (coming soon)
- `/notifications` - Notifications (coming soon)
- `/settings` - User settings
- `/auth` - Login/Register
- `/admin` - Admin dashboard (admin only)
- `/agent-dashboard` - Agent dashboard (agents only)
- `/dashboard` - User dashboard

## Building for Production

To create a production build:

```bash
npm run build
```

The build output will be in the `dist/` directory.

To preview the production build:

```bash
npm run preview
```

## Troubleshooting

### Port Already in Use

If port 5173 is already in use, Vite will automatically use the next available port. Check the terminal output for the actual port.

To specify a port:

```bash
npm run dev -- --port 3000
```

### Firebase Configuration Errors

- Make sure `.env` file exists in the root directory
- Verify all environment variables are set correctly
- Restart the dev server after changing `.env`
- Check browser console for specific error messages

### Authentication Not Working

- Verify Firebase Authentication is enabled
- Check that Email/Password provider is enabled
- Verify environment variables are correct
- Check browser console for errors

### Firestore Permission Errors

- Make sure security rules are deployed: `firebase deploy --only firestore:rules`
- Check that rules match your data structure
- Verify user is authenticated when trying to write data
- Check Firebase Console → Firestore → Rules for syntax errors

### Module Not Found Errors

- Run `npm install` again
- Delete `node_modules` and `package-lock.json`, then `npm install`
- Check that all files are saved

### Build Errors

- Make sure all TypeScript errors are fixed
- Check that all imports are correct
- Verify all environment variables are set
- Run `npm run lint` to check for issues

## Development Tips

1. **Hot Module Replacement**: Changes to code will automatically refresh in the browser
2. **Environment Variables**: Changes to `.env` require server restart
3. **Firebase Emulator**: For local development, consider using Firebase Emulator Suite
4. **Console Logging**: Check browser console and terminal for errors
5. **Network Tab**: Use browser DevTools Network tab to debug API calls

## Next Steps

1. ✅ Set up Firebase project
2. ✅ Configure environment variables
3. ✅ Deploy security rules
4. ✅ Create admin user
5. ✅ Run the application
6. ✅ Test authentication
7. ✅ Test property posting (as agent)
8. ✅ Test video posting
9. ✅ Test admin functions

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the terminal output
3. Verify Firebase configuration
4. Review `MIGRATION_COMPLETE.md` for migration status
5. Review `FEATURE_IMPLEMENTATION_SUMMARY.md` for feature status

---

**Happy coding! 🚀**
