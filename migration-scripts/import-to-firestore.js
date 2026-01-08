/**
 * Script to import transformed data to Firebase Firestore
 * 
 * Usage:
 *   node import-to-firestore.js
 * 
 * Requirements:
 *   - Set GOOGLE_APPLICATION_CREDENTIALS environment variable to service account JSON path
 *   - Or set FIREBASE_PROJECT_ID and use Application Default Credentials
 * 
 * Input:
 *   - migration-scripts/firestore-data/users.json
 *   - migration-scripts/firestore-data/agent_applications.json
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  
  if (serviceAccountPath && fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    // Use Application Default Credentials (for Cloud environments)
    admin.initializeApp({
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }
}

const db = admin.firestore();

function parseTimestamp(isoString) {
  if (!isoString) return null;
  return admin.firestore.Timestamp.fromDate(new Date(isoString));
}

function parseDocument(data) {
  // Recursively convert ISO timestamp strings to Firestore Timestamps
  if (Array.isArray(data)) {
    return data.map(parseDocument);
  } else if (data && typeof data === 'object') {
    const parsed = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
        // Looks like an ISO timestamp
        parsed[key] = parseTimestamp(value);
      } else if (value && typeof value === 'object') {
        parsed[key] = parseDocument(value);
      } else {
        parsed[key] = value;
      }
    }
    return parsed;
  }
  return data;
}

async function importUsers() {
  const dataDir = path.join(__dirname, 'firestore-data');
  const usersData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'users.json'), 'utf8')
  );

  console.log(`Importing ${usersData.length} users...`);
  
  const batch = db.batch();
  let count = 0;
  const BATCH_SIZE = 500; // Firestore batch limit

  for (const user of usersData) {
    const userRef = db.collection('users').doc(user.userId);
    const parsedUser = parseDocument(user);
    batch.set(userRef, parsedUser);
    count++;

    // Firestore batches are limited to 500 operations
    if (count >= BATCH_SIZE) {
      await batch.commit();
      console.log(`  Imported ${count} users...`);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
    console.log(`  Imported ${count} users...`);
  }

  console.log(`✓ Imported ${usersData.length} users`);
}

async function importAgentApplications() {
  const dataDir = path.join(__dirname, 'firestore-data');
  const applicationsData = JSON.parse(
    fs.readFileSync(path.join(dataDir, 'agent_applications.json'), 'utf8')
  );

  console.log(`Importing ${applicationsData.length} agent applications...`);
  
  const batch = db.batch();
  let count = 0;
  const BATCH_SIZE = 500;

  for (const app of applicationsData) {
    const appRef = db.collection('agentApplications').doc(); // Auto-generate ID
    const parsedApp = parseDocument(app);
    batch.set(appRef, parsedApp);
    count++;

    if (count >= BATCH_SIZE) {
      await batch.commit();
      console.log(`  Imported ${count} applications...`);
      count = 0;
    }
  }

  if (count > 0) {
    await batch.commit();
    console.log(`  Imported ${count} applications...`);
  }

  console.log(`✓ Imported ${applicationsData.length} agent applications`);
}

async function importData() {
  try {
    console.log('Starting Firestore import...\n');

    await importUsers();
    console.log('');
    await importAgentApplications();

    console.log('\n✓ Import complete!');
    console.log('\nNext steps:');
    console.log('  1. Verify data in Firebase Console');
    console.log('  2. Test authentication and data access');
    console.log('  3. Deploy Firestore security rules: firebase deploy --only firestore:rules');
  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importData();
