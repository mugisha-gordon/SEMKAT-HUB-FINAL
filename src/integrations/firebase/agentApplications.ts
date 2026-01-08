import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { db } from './client';
import type {
  AgentApplicationDocument,
  CreateAgentApplicationDocument,
  UpdateAgentApplicationDocument,
} from './types';

const COLLECTION_NAME = 'agentApplications';

/**
 * Get all agent applications (admin only, or user's own)
 */
export async function getAgentApplications(
  userId?: string,
  status?: 'pending' | 'approved' | 'rejected',
  limitCount?: number
): Promise<AgentApplicationDocument[]> {
  const applicationsRef = collection(db, COLLECTION_NAME);
  let q = query(applicationsRef, orderBy('createdAt', 'desc'));
  
  if (userId) {
    q = query(q, where('userId', '==', userId));
  }
  
  if (status) {
    q = query(q, where('status', '==', status));
  }

  if (limitCount) {
    q = query(q, limit(limitCount));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as AgentApplicationDocument[];
}

/**
 * Get a single agent application by ID
 */
export async function getAgentApplication(
  applicationId: string
): Promise<AgentApplicationDocument | null> {
  const applicationRef = doc(db, COLLECTION_NAME, applicationId);
  const applicationSnap = await getDoc(applicationRef);
  
  if (!applicationSnap.exists()) {
    return null;
  }
  
  return {
    id: applicationSnap.id,
    ...applicationSnap.data(),
  } as AgentApplicationDocument;
}

/**
 * Create a new agent application
 */
export async function createAgentApplication(
  data: CreateAgentApplicationDocument
): Promise<string> {
  const applicationsRef = collection(db, COLLECTION_NAME);
  const applicationData = {
    ...data,
    status: 'pending' as const,
    reviewedBy: null,
    reviewedAt: null,
    notes: null,
    createdAt: Timestamp.now(),
  };
  
  const docRef = await addDoc(applicationsRef, applicationData);
  return docRef.id;
}

/**
 * Update an agent application (admin only)
 */
export async function updateAgentApplication(
  applicationId: string,
  updates: UpdateAgentApplicationDocument
): Promise<void> {
  const applicationRef = doc(db, COLLECTION_NAME, applicationId);
  
  // If status is being updated, set reviewedAt
  if (updates.status && updates.status !== 'pending') {
    updates.reviewedAt = Timestamp.now();
  }
  
  await updateDoc(applicationRef, updates as any);
}

/**
 * Approve an agent application (admin only)
 */
export async function approveAgentApplication(
  applicationId: string,
  applicationUserId: string,
  approvedBy: string,
  notes?: string
): Promise<void> {
  const applicationRef = doc(db, COLLECTION_NAME, applicationId);
  
  await updateDoc(applicationRef, {
    status: 'approved',
    reviewedBy: approvedBy,
    reviewedAt: Timestamp.now(),
    notes: notes || null,
  });
}

/**
 * Reject an agent application (admin only)
 */
export async function rejectAgentApplication(
  applicationId: string,
  approvedBy: string,
  notes?: string
): Promise<void> {
  const applicationRef = doc(db, COLLECTION_NAME, applicationId);
  
  await updateDoc(applicationRef, {
    status: 'rejected',
    reviewedBy: approvedBy,
    reviewedAt: Timestamp.now(),
    notes: notes || null,
  });
}
