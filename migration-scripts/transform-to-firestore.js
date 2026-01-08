/**
 * Script to transform exported Supabase data to Firestore format
 * 
 * Usage:
 *   node transform-to-firestore.js
 * 
 * Input:
 *   - migration-scripts/exported-data/users.json
 *   - migration-scripts/exported-data/agent_applications.json
 * 
 * Output:
 *   - migration-scripts/firestore-data/users.json
 *   - migration-scripts/firestore-data/agent_applications.json
 */

const fs = require('fs');
const path = require('path');

function transformTimestamp(postgresTimestamp) {
  if (!postgresTimestamp) return null;
  // Convert PostgreSQL timestamp to JavaScript Date, then to ISO string
  // Firestore will convert ISO strings to Timestamps
  return new Date(postgresTimestamp).toISOString();
}

function transformUsers(usersData) {
  return usersData.map(user => {
    const roles = user.roles || [];
    const profile = user.profile || {};
    
    // Build roles map
    const rolesMap = {
      user: {
        createdAt: transformTimestamp(user.authUserData?.created_at),
      },
    };
    
    // Add admin role if exists
    const adminRole = roles.find(r => r.role === 'admin');
    if (adminRole) {
      rolesMap.admin = {
        approvedBy: adminRole.approved_by || null,
        approvedAt: transformTimestamp(adminRole.approved_at || adminRole.created_at),
      };
    }
    
    // Add agent role if exists
    const agentRole = roles.find(r => r.role === 'agent');
    if (agentRole) {
      rolesMap.agent = {
        approvedBy: agentRole.approved_by || null,
        approvedAt: transformTimestamp(agentRole.approved_at || agentRole.created_at),
      };
    }
    
    return {
      userId: user.userId,
      email: user.email,
      role: user.primaryRole,
      roles: rolesMap,
      profile: {
        fullName: profile.full_name || null,
        phone: profile.phone || null,
        avatarUrl: profile.avatar_url || null,
        createdAt: transformTimestamp(profile.created_at || user.authUserData?.created_at),
        updatedAt: transformTimestamp(profile.updated_at || profile.created_at || user.authUserData?.created_at),
      },
      createdAt: transformTimestamp(user.authUserData?.created_at),
    };
  });
}

function transformAgentApplications(applicationsData) {
  return applicationsData.map(app => ({
    userId: app.user_id,
    fullName: app.full_name,
    phone: app.phone,
    email: app.email,
    company: app.company || null,
    licenseNumber: app.license_number || null,
    experienceYears: app.experience_years || null,
    status: app.status,
    reviewedBy: app.reviewed_by || null,
    reviewedAt: transformTimestamp(app.reviewed_at),
    notes: app.notes || null,
    createdAt: transformTimestamp(app.created_at),
  }));
}

async function transformData() {
  try {
    console.log('Transforming data to Firestore format...');

    const exportedDir = path.join(__dirname, 'exported-data');
    const outputDir = path.join(__dirname, 'firestore-data');

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Read exported data
    const usersData = JSON.parse(
      fs.readFileSync(path.join(exportedDir, 'users.json'), 'utf8')
    );
    const applicationsData = JSON.parse(
      fs.readFileSync(path.join(exportedDir, 'agent_applications.json'), 'utf8')
    );

    // Transform data
    console.log('Transforming users...');
    const firestoreUsers = transformUsers(usersData);
    
    console.log('Transforming agent applications...');
    const firestoreApplications = transformAgentApplications(applicationsData);

    // Write transformed data
    fs.writeFileSync(
      path.join(outputDir, 'users.json'),
      JSON.stringify(firestoreUsers, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'agent_applications.json'),
      JSON.stringify(firestoreApplications, null, 2)
    );

    console.log(`\nTransform complete! Data saved to ${outputDir}/`);
    console.log(`  - users.json (${firestoreUsers.length} users)`);
    console.log(`  - agent_applications.json (${firestoreApplications.length} applications)`);
  } catch (error) {
    console.error('Transform failed:', error);
    process.exit(1);
  }
}

transformData();
