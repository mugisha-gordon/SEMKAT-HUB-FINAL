import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
  limit,
  Timestamp,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './client';

export interface MessageDocument {
  id: string;
  conversationId: string; // Combination of user IDs sorted alphabetically
  senderId: string; // Firebase Auth UID
  receiverId: string; // Firebase Auth UID
  content: string;
  read: boolean;
  createdAt: Timestamp;
}

export interface ConversationDocument {
  id: string;
  participantIds: string[]; // [userId, agentId] sorted
  lastMessage: string;
  lastMessageAt: Timestamp;
  lastMessageSenderId: string;
  unreadCount: { [userId: string]: number };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateMessageDocument {
  senderId: string;
  receiverId: string;
  content: string;
}

const MESSAGES_COLLECTION = 'messages';
const CONVERSATIONS_COLLECTION = 'conversations';

/**
 * Generate conversation ID from two user IDs (sorted)
 */
function getConversationId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join('_');
}

/**
 * Get or create a conversation
 */
async function getOrCreateConversation(
  userId1: string,
  userId2: string
): Promise<string> {
  const conversationId = getConversationId(userId1, userId2);
  const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  const conversationSnap = await getDoc(conversationRef);

  if (conversationSnap.exists()) {
    return conversationId;
  }

  // Create new conversation
  await setDoc(conversationRef, {
    id: conversationId,
    participantIds: [userId1, userId2].sort(),
    lastMessage: '',
    lastMessageAt: Timestamp.now(),
    lastMessageSenderId: userId1,
    unreadCount: {
      [userId1]: 0,
      [userId2]: 0,
    },
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });

  return conversationId;
}

/**
 * Send a message
 */
export async function sendMessage(
  data: CreateMessageDocument
): Promise<string> {
  const conversationId = await getOrCreateConversation(data.senderId, data.receiverId);

  // Create message
  const messagesRef = collection(db, MESSAGES_COLLECTION);
  const messageData = {
    conversationId,
    senderId: data.senderId,
    receiverId: data.receiverId,
    content: data.content,
    read: false,
    createdAt: Timestamp.now(),
  };

  const docRef = await addDoc(messagesRef, messageData);

  // Update conversation
  const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  const conversationSnap = await getDoc(conversationRef);
  const conversation = conversationSnap.data() as ConversationDocument;

  await updateDoc(conversationRef, {
    lastMessage: data.content,
    lastMessageAt: Timestamp.now(),
    lastMessageSenderId: data.senderId,
    unreadCount: {
      ...conversation.unreadCount,
      [data.receiverId]: (conversation.unreadCount[data.receiverId] || 0) + 1,
    },
    updatedAt: Timestamp.now(),
  });

  return docRef.id;
}

/**
 * Get messages for a conversation
 */
export async function getMessages(
  userId1: string,
  userId2: string,
  limitCount: number = 50
): Promise<MessageDocument[]> {
  const conversationId = getConversationId(userId1, userId2);
  const messagesRef = collection(db, MESSAGES_COLLECTION);
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .reverse() as MessageDocument[]; // Reverse to show oldest first
}

/**
 * Get conversations for a user
 */
export async function getConversations(userId: string): Promise<ConversationDocument[]> {
  const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
  const q = query(
    conversationsRef,
    where('participantIds', 'array-contains', userId),
    orderBy('lastMessageAt', 'desc')
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as ConversationDocument[];
}

/**
 * Mark messages as read
 */
export async function markMessagesAsRead(
  userId1: string,
  userId2: string,
  currentUserId: string
): Promise<void> {
  const conversationId = getConversationId(userId1, userId2);
  const messagesRef = collection(db, MESSAGES_COLLECTION);
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    where('receiverId', '==', currentUserId),
    where('read', '==', false)
  );

  const snapshot = await getDocs(q);
  const updatePromises = snapshot.docs.map((doc) =>
    updateDoc(doc.ref, { read: true })
  );

  await Promise.all(updatePromises);

  // Update conversation unread count
  const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
  const conversationSnap = await getDoc(conversationRef);
  if (conversationSnap.exists()) {
    const conversation = conversationSnap.data() as ConversationDocument;
    await updateDoc(conversationRef, {
      unreadCount: {
        ...conversation.unreadCount,
        [currentUserId]: 0,
      },
    });
  }
}

/**
 * Subscribe to messages in real-time
 */
export function subscribeToMessages(
  userId1: string,
  userId2: string,
  callback: (messages: MessageDocument[]) => void
): Unsubscribe {
  const conversationId = getConversationId(userId1, userId2);
  const messagesRef = collection(db, MESSAGES_COLLECTION);
  const q = query(
    messagesRef,
    where('conversationId', '==', conversationId),
    orderBy('createdAt', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MessageDocument[];
    callback(messages);
  });
}

/**
 * Subscribe to conversations in real-time
 */
export function subscribeToConversations(
  userId: string,
  callback: (conversations: ConversationDocument[]) => void
): Unsubscribe {
  const conversationsRef = collection(db, CONVERSATIONS_COLLECTION);
  const q = query(
    conversationsRef,
    where('participantIds', 'array-contains', userId),
    orderBy('lastMessageAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const conversations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ConversationDocument[];
    callback(conversations);
  });
}
