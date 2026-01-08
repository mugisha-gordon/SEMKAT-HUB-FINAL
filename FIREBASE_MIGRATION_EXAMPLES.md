# Firebase Migration Code Examples

This document shows before/after code examples for the Supabase to Firebase migration.

## Table of Contents

1. [Authentication Context](#authentication-context)
2. [User Profile Queries](#user-profile-queries)
3. [Admin Operations](#admin-operations)
4. [Agent Applications](#agent-applications)
5. [Role Management](#role-management)

---

## Authentication Context

### Before (Supabase)

```typescript
// src/context/AuthContext.tsx
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<Role | null>(null);

  const fetchUserRole = async (userId: string) => {
    const { data, error } = await supabase.rpc('get_user_role', { _user_id: userId });
    if (!error && data) {
      setRole(data as Role);
    }
  };

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      if (newSession?.user) {
        fetchUserRole(newSession.user.id);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        fetchUserRole(data.session.user.id);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });
    return { error: error?.message };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };
};
```

### After (Firebase)

```typescript
// src/context/AuthContext.tsx
import { auth } from "@/integrations/firebase/client";
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser,
} from "firebase/auth";
import { createUserDocument, getUserDocument, getUserRole } from "@/integrations/firebase/users";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserRole = async (userId: string) => {
    try {
      const userRole = await getUserRole(userId);
      setRole(userRole);
    } catch (error) {
      console.error('Error fetching role:', error);
      setRole('user');
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserRole(firebaseUser.uid);
      } else {
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { error: undefined };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Create user document in Firestore
      await createUserDocument(userCredential.user.uid, email, fullName);
      return { error: undefined };
    } catch (error: any) {
      return { error: error.message };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      // Check if user document exists, create if not
      const userDoc = await getUserDocument(result.user.uid);
      if (!userDoc) {
        await createUserDocument(result.user.uid, result.user.email || '', result.user.displayName || undefined);
      }
      return { error: undefined };
    } catch (error: any) {
      return { error: error.message };
    }
  };
};
```

---

## User Profile Queries

### Before (Supabase)

```typescript
// src/pages/UserDashboard.tsx
const fetchProfile = async () => {
  if (!user) return;
  const { data } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('user_id', user.id)
    .single();
  if (data) setProfile(data);
};
```

### After (Firebase)

```typescript
// src/pages/UserDashboard.tsx
import { getUserDocument } from "@/integrations/firebase/users";

const fetchProfile = async () => {
  if (!user) return;
  const userDoc = await getUserDocument(user.uid);
  if (userDoc) {
    setProfile({ full_name: userDoc.profile.fullName });
  }
};
```

---

## Admin Operations

### Before (Supabase)

```typescript
// src/pages/Admin.tsx
const fetchApplications = async () => {
  const { data, error } = await supabase
    .from('agent_applications')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  setApplications(data || []);
};

const handleApplicationAction = async (applicationId: string, userId: string, action: 'approved' | 'rejected') => {
  // Update application status
  const { error: updateError } = await supabase
    .from('agent_applications')
    .update({ 
      status: action,
      reviewed_by: user?.id,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', applicationId);
  
  if (updateError) throw updateError;

  // If approved, add agent role
  if (action === 'approved') {
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ 
        user_id: userId, 
        role: 'agent',
        approved_by: user?.id,
        approved_at: new Date().toISOString()
      });
    
    if (roleError && !roleError.message.includes('duplicate')) {
      throw roleError;
    }
  }
};
```

### After (Firebase)

```typescript
// src/pages/Admin.tsx
import { getAgentApplications, approveAgentApplication, rejectAgentApplication } from "@/integrations/firebase/agentApplications";
import { updateUserRole } from "@/integrations/firebase/users";

const fetchApplications = async () => {
  try {
    const apps = await getAgentApplications(); // Admin can see all
    setApplications(apps);
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
};

const handleApplicationAction = async (applicationId: string, userId: string, action: 'approved' | 'rejected') => {
  try {
    if (action === 'approved') {
      // Update application status
      await approveAgentApplication(applicationId, userId, user?.uid || '');
      // Update user role
      await updateUserRole(userId, 'agent', user?.uid || '');
    } else {
      await rejectAgentApplication(applicationId, user?.uid || '');
    }
    fetchApplications();
  } catch (error) {
    console.error('Error updating application:', error);
  }
};
```

---

## Agent Applications

### Before (Supabase)

```typescript
// Create agent application
const { data, error } = await supabase
  .from('agent_applications')
  .insert({
    user_id: user.id,
    full_name: fullName,
    phone: phone,
    email: email,
    company: company,
    license_number: licenseNumber,
    experience_years: experienceYears,
  });
```

### After (Firebase)

```typescript
// Create agent application
import { createAgentApplication } from "@/integrations/firebase/agentApplications";

const applicationId = await createAgentApplication({
  userId: user.uid,
  fullName: fullName,
  phone: phone,
  email: email,
  company: company || null,
  licenseNumber: licenseNumber || null,
  experienceYears: experienceYears || null,
});
```

---

## Role Management

### Before (Supabase)

```typescript
// Get user role (RPC function)
const { data, error } = await supabase.rpc('get_user_role', { _user_id: userId });

// Check if user has role
const { data, error } = await supabase.rpc('has_role', { 
  _user_id: userId,
  _role: 'admin'
});
```

### After (Firebase)

```typescript
// Get user role
import { getUserRole } from "@/integrations/firebase/users";

const role = await getUserRole(userId);

// Check if user has role (in code)
const userDoc = await getUserDocument(userId);
const hasAdminRole = userDoc?.role === 'admin';

// Or check multiple roles
const userDoc = await getUserDocument(userId);
const hasAgentRole = userDoc?.roles?.agent !== undefined;
```

---

## Google OAuth

### Before (Supabase)

```typescript
// src/pages/Auth.tsx
const handleGoogleLogin = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/`
    }
  });
  if (error) throw error;
};
```

### After (Firebase)

```typescript
// src/pages/Auth.tsx
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/integrations/firebase/client";
import { getUserDocument, createUserDocument } from "@/integrations/firebase/users";

const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // Check if user document exists, create if not (first-time Google login)
    const userDoc = await getUserDocument(result.user.uid);
    if (!userDoc) {
      await createUserDocument(
        result.user.uid,
        result.user.email || '',
        result.user.displayName || undefined
      );
    }
  } catch (error: any) {
    throw error;
  }
};
```

---

## Real-time Listeners

### Before (Supabase)

```typescript
// Real-time subscription to applications
const subscription = supabase
  .channel('agent_applications')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'agent_applications' },
    (payload) => {
      console.log('Change received!', payload);
      fetchApplications();
    }
  )
  .subscribe();
```

### After (Firebase)

```typescript
// Real-time subscription to applications
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/integrations/firebase/client";

useEffect(() => {
  const applicationsRef = collection(db, 'agentApplications');
  const q = query(applicationsRef, orderBy('createdAt', 'desc'));
  
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const apps = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setApplications(apps);
  });

  return () => unsubscribe();
}, []);
```

---

## Error Handling Patterns

### Before (Supabase)

```typescript
const { data, error } = await supabase
  .from('profiles')
  .select('*')
  .eq('user_id', userId)
  .single();

if (error) {
  console.error('Error:', error.message);
  return;
}
```

### After (Firebase)

```typescript
try {
  const userDoc = await getUserDocument(userId);
  if (!userDoc) {
    console.error('User not found');
    return;
  }
} catch (error) {
  console.error('Error:', error);
  return;
}
```

---

## Key Differences Summary

1. **Queries**: Supabase uses SQL-like queries, Firebase uses document references
2. **Relationships**: Supabase uses JOINs, Firebase uses embedded documents or references
3. **Real-time**: Supabase uses channels, Firebase uses `onSnapshot`
4. **Functions**: Supabase RPC functions → Firebase Cloud Functions or client-side code
5. **Types**: Supabase generates types from schema, Firebase requires manual type definitions
6. **Error Handling**: Supabase returns `{ data, error }`, Firebase uses try/catch
