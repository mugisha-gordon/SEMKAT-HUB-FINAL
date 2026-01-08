import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit,
  onSnapshot,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from './client';

export interface VideoDocument {
  id: string;
  userId: string; // Firebase Auth UID (agent or user)
  title: string;
  location: string;
  videoUrl: string;
  coverUrl?: string;
  description?: string;
  likes: number;
  comments: number;
  likedBy: string[]; // Array of user IDs who liked
  role: 'agent' | 'user';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateVideoDocument {
  userId: string;
  title: string;
  location: string;
  videoUrl: string;
  coverUrl?: string;
  description?: string;
  role: 'agent' | 'user';
}

export interface VideoCommentDocument {
  id: string;
  videoId: string;
  userId: string;
  content: string;
  createdAt: Timestamp;
}

const COLLECTION_NAME = 'videos';

/**
 * Get all videos (public feed)
 */
export async function getVideos(filters?: {
  userId?: string;
  role?: 'agent' | 'user';
  limit?: number;
}): Promise<VideoDocument[]> {
  const videosRef = collection(db, COLLECTION_NAME);
  let q = query(videosRef, orderBy('createdAt', 'desc'));

  if (filters?.userId) {
    q = query(q, where('userId', '==', filters.userId));
  }

  if (filters?.role) {
    q = query(q, where('role', '==', filters.role));
  }

  if (filters?.limit) {
    q = query(q, limit(filters.limit));
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as VideoDocument[];
}

/**
 * Add a comment to a video (stored under videos/{videoId}/comments)
 */
export async function addVideoComment(videoId: string, userId: string, content: string): Promise<string> {
  const trimmed = content.trim();
  if (!trimmed) {
    throw new Error('Comment cannot be empty');
  }

  const commentsRef = collection(db, COLLECTION_NAME, videoId, 'comments');
  const docRef = await addDoc(commentsRef, {
    userId,
    content: trimmed,
    createdAt: Timestamp.now(),
  });

  const videoRef = doc(db, COLLECTION_NAME, videoId);
  await updateDoc(videoRef, {
    comments: increment(1),
    updatedAt: Timestamp.now(),
  });

  return docRef.id;
}

/**
 * Subscribe to comments for a video
 */
export function subscribeToVideoComments(
  videoId: string,
  callback: (comments: VideoCommentDocument[]) => void
): () => void {
  const commentsRef = collection(db, COLLECTION_NAME, videoId, 'comments');
  const q = query(commentsRef, orderBy('createdAt', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      videoId,
      ...(d.data() as Omit<VideoCommentDocument, 'id' | 'videoId'>),
    })) as VideoCommentDocument[];
    callback(data);
  });
}

/**
 * Get a single video by ID
 */
export async function getVideo(videoId: string): Promise<VideoDocument | null> {
  const videoRef = doc(db, COLLECTION_NAME, videoId);
  const videoSnap = await getDoc(videoRef);

  if (!videoSnap.exists()) {
    return null;
  }

  return {
    id: videoSnap.id,
    ...videoSnap.data(),
  } as VideoDocument;
}

/**
 * Create a new video (agent or user)
 */
export async function createVideo(data: CreateVideoDocument): Promise<string> {
  const videosRef = collection(db, COLLECTION_NAME);
  const videoData = {
    ...data,
    likes: 0,
    comments: 0,
    likedBy: [],
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  const docRef = await addDoc(videosRef, videoData);
  return docRef.id;
}

/**
 * Update a video (owner or admin)
 */
export async function updateVideo(
  videoId: string,
  updates: Partial<CreateVideoDocument>
): Promise<void> {
  const videoRef = doc(db, COLLECTION_NAME, videoId);
  await updateDoc(videoRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

/**
 * Delete a video (owner or admin)
 */
export async function deleteVideo(videoId: string): Promise<void> {
  const videoRef = doc(db, COLLECTION_NAME, videoId);
  await deleteDoc(videoRef);
}

/**
 * Toggle like on a video
 */
export async function toggleVideoLike(
  videoId: string,
  userId: string
): Promise<{ liked: boolean; likes: number }> {
  const videoRef = doc(db, COLLECTION_NAME, videoId);
  const video = await getVideo(videoId);

  if (!video) {
    throw new Error('Video not found');
  }

  const likedBy = video.likedBy || [];
  const isLiked = likedBy.includes(userId);

  if (isLiked) {
    // Unlike
    const newLikedBy = likedBy.filter((id) => id !== userId);
    await updateDoc(videoRef, {
      likedBy: newLikedBy,
      likes: video.likes - 1,
      updatedAt: Timestamp.now(),
    });
    return { liked: false, likes: video.likes - 1 };
  } else {
    // Like
    const newLikedBy = [...likedBy, userId];
    await updateDoc(videoRef, {
      likedBy: newLikedBy,
      likes: video.likes + 1,
      updatedAt: Timestamp.now(),
    });
    return { liked: true, likes: video.likes + 1 };
  }
}

/**
 * Delete all videos by a user (admin only)
 */
export async function deleteVideosByUser(userId: string): Promise<void> {
  const videos = await getVideos({ userId });
  const deletePromises = videos.map((video) => deleteVideo(video.id));
  await Promise.all(deletePromises);
}
