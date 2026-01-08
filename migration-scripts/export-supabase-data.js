/**
 * Script to export data from Supabase PostgreSQL
 * 
 * Usage:
 *   node export-supabase-data.js
 * 
 * Requirements:
 *   - Set SUPABASE_DB_URL environment variable
 *   - Or modify the connection string below
 * 
 * Output:
 *   - users.json: User roles and profiles combined
 *   - agent_applications.json: Agent applications
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables (use dotenv if needed)
// require('dotenv').config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Service role key for admin access

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables are required');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function exportData() {
  try {
    console.log('Exporting data from Supabase...');

    // Export user_roles
    console.log('Exporting user_roles...');
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*');
    
    if (rolesError) throw rolesError;
    console.log(`  Exported ${userRoles?.length || 0} user roles`);

    // Export profiles
    console.log('Exporting profiles...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) throw profilesError;
    console.log(`  Exported ${profiles?.length || 0} profiles`);

    // Export agent_applications
    console.log('Exporting agent_applications...');
    const { data: applications, error: appsError } = await supabase
      .from('agent_applications')
      .select('*');
    
    if (appsError) throw appsError;
    console.log(`  Exported ${applications?.length || 0} agent applications`);

    // Get auth users (requires service role key)
    console.log('Exporting auth users...');
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    console.log(`  Exported ${authUsers?.users?.length || 0} auth users`);

    // Combine user data
    const usersData = (authUsers?.users || []).map(authUser => {
      const profile = profiles?.find(p => p.user_id === authUser.id);
      const roles = userRoles?.filter(r => r.user_id === authUser.id) || [];
      
      // Determine primary role (admin > agent > user)
      let primaryRole = 'user';
      if (roles.some(r => r.role === 'admin')) {
        primaryRole = 'admin';
      } else if (roles.some(r => r.role === 'agent')) {
        primaryRole = 'agent';
      }

      return {
        userId: authUser.id,
        email: authUser.email,
        authUserData: {
          created_at: authUser.created_at,
          email_confirmed_at: authUser.email_confirmed_at,
          user_metadata: authUser.user_metadata,
        },
        profile: profile || null,
        roles: roles,
        primaryRole: primaryRole,
      };
    });

    // Write to files
    const outputDir = path.join(__dirname, 'exported-data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(
      path.join(outputDir, 'users.json'),
      JSON.stringify(usersData, null, 2)
    );

    fs.writeFileSync(
      path.join(outputDir, 'agent_applications.json'),
      JSON.stringify(applications, null, 2)
    );

    console.log(`\nExport complete! Data saved to ${outputDir}/`);
    console.log(`  - users.json (${usersData.length} users)`);
    console.log(`  - agent_applications.json (${applications?.length || 0} applications)`);
  } catch (error) {
    console.error('Export failed:', error);
    process.exit(1);
  }
}

exportData();
