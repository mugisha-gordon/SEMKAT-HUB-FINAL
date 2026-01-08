import {
  collection,
  doc,
  getDoc,
  getDocs,
  getCountFromServer,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  Timestamp,
  type DocumentData,
} from 'firebase/firestore';
import { db } from './client';
import type { PropertyType, PropertyStatus } from '@/types/property';

export interface PropertyDocument {
  id: string;
  agentId: string; // Firebase Auth UID of the agent
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: string;
  location: {
    region: string;
    district: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  size: {
    value: number;
    unit: 'acres' | 'sqft' | 'sqm' | 'hectares';
  };
  images: string[];
  description: string;
  features: string[];
  hasTitle: boolean;
  isFeatured?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  installmentPayment?: {
    enabled: boolean;
    depositPercentage?: number;
    numberOfInstallments?: number;
    installmentAmount?: number;
    terms?: string;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreatePropertyDocument {
  agentId: string;
  title: string;
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  currency: string;
  location: {
    region: string;
    district: string;
    address: string;
    coordinates?: { lat: number; lng: number };
  };
  size: {
    value: number;
    unit: 'acres' | 'sqft' | 'sqm' | 'hectares';
  };
  images: string[];
  description: string;
  features: string[];
  hasTitle: boolean;
  isFeatured?: boolean;
  bedrooms?: number;
  bathrooms?: number;
  installmentPayment?: {
    enabled: boolean;
    depositPercentage?: number;
    numberOfInstallments?: number;
    installmentAmount?: number;
    terms?: string;
  };
}

const COLLECTION_NAME = 'properties';

/**
 * Get all properties (public - can be filtered)
 */
export async function getProperties(
  filters?: {
    type?: PropertyType;
    status?: PropertyStatus;
    agentId?: string;
    minPrice?: number;
    maxPrice?: number;
    district?: string;
    limit?: number;
  }
): Promise<PropertyDocument[]> {
  const propertiesRef = collection(db, COLLECTION_NAME);
  let q = query(propertiesRef, orderBy('createdAt', 'desc'));

  if (filters?.agentId) {
    q = query(q, where('agentId', '==', filters.agentId));
  }

  if (filters?.type) {
    q = query(q, where('type', '==', filters.type));
  }

  if (filters?.status) {
    q = query(q, where('status', '==', filters.status));
  }

  if (filters?.limit) {
    q = query(q, limit(filters.limit));
  }

  const snapshot = await getDocs(q);
  let properties = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as PropertyDocument[];

  // Client-side filtering for price and district (Firestore doesn't support range queries easily without indexes)
  if (filters?.minPrice !== undefined) {
    properties = properties.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters?.maxPrice !== undefined) {
    properties = properties.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters?.district) {
    properties = properties.filter((p) =>
      p.location.district.toLowerCase().includes(filters.district!.toLowerCase())
    );
  }

  return properties;
}

export async function getAgentPropertyCounts(agentId: string): Promise<{
  totalListings: number;
  activeListings: number;
}> {
  const propertiesRef = collection(db, COLLECTION_NAME);

  const totalQuery = query(propertiesRef, where('agentId', '==', agentId));
  const activeQuery = query(
    propertiesRef,
    where('agentId', '==', agentId),
    where('status', '==', 'available')
  );

  const [totalSnap, activeSnap] = await Promise.all([
    getCountFromServer(totalQuery),
    getCountFromServer(activeQuery),
  ]);

  return {
    totalListings: totalSnap.data().count,
    activeListings: activeSnap.data().count,
  };
}

/**
 * Get a single property by ID
 */
export async function getProperty(propertyId: string): Promise<PropertyDocument | null> {
  const propertyRef = doc(db, COLLECTION_NAME, propertyId);
  const propertySnap = await getDoc(propertyRef);

  if (!propertySnap.exists()) {
    return null;
  }

  return {
    id: propertySnap.id,
    ...propertySnap.data(),
  } as PropertyDocument;
}

/**
 * Create a new property (agent only)
 */
export async function createProperty(data: CreatePropertyDocument): Promise<string> {
  const propertiesRef = collection(db, COLLECTION_NAME);
  const propertyData = {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(propertiesRef, propertyData);
  return docRef.id;
}

/**
 * Update a property (agent who owns it, or admin)
 */
export async function updateProperty(
  propertyId: string,
  updates: Partial<CreatePropertyDocument>
): Promise<void> {
  const propertyRef = doc(db, COLLECTION_NAME, propertyId);
  await updateDoc(propertyRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Delete a property (agent who owns it, or admin)
 */
export async function deleteProperty(propertyId: string): Promise<void> {
  const propertyRef = doc(db, COLLECTION_NAME, propertyId);
  await deleteDoc(propertyRef);
}

/**
 * Delete all properties by an agent (admin only)
 */
export async function deletePropertiesByAgent(agentId: string): Promise<void> {
  const properties = await getProperties({ agentId });
  const deletePromises = properties.map((property) => deleteProperty(property.id));
  await Promise.all(deletePromises);
}
