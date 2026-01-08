import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from './client';

export type NotificationType = 'info' | 'success' | 'warning';

export interface NotificationDocument {
  id: string;
  title: string;
  description: string;
  type: NotificationType;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  readAt?: Timestamp;

  // Targeting
  audience: 'all' | 'user';
  userId?: string;
}

const COLLECTION_NAME = 'notifications';

export async function getNotificationsForUser(userId: string, options?: { limit?: number }): Promise<NotificationDocument[]> {
  const ref = collection(db, COLLECTION_NAME);
  const max = options?.limit ?? 50;

  const [userSnap, allSnap] = await Promise.all([
    getDocs(query(ref, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(max))),
    getDocs(query(ref, where('audience', '==', 'all'), orderBy('createdAt', 'desc'), limit(max))),
  ]);

  const byId = new Map<string, NotificationDocument>();

  for (const snap of [userSnap, allSnap]) {
    snap.docs.forEach((d) => {
      byId.set(d.id, { id: d.id, ...(d.data() as Omit<NotificationDocument, 'id'>) });
    });
  }

  return Array.from(byId.values()).sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
}

export async function getNotification(notificationId: string): Promise<NotificationDocument | null> {
  const ref = doc(db, COLLECTION_NAME, notificationId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return { id: snap.id, ...(snap.data() as Omit<NotificationDocument, 'id'>) };
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const ref = doc(db, COLLECTION_NAME, notificationId);
  await updateDoc(ref, {
    readAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}
