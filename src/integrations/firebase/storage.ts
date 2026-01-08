import { ref, uploadBytes, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './client';

/**
 * Upload a video file to Firebase Storage
 */
export async function uploadVideo(
  file: File,
  userId: string,
  options?: {
    onProgress?: (progress: number) => void;
  }
): Promise<{ videoUrl: string; coverUrl?: string }> {
  // Validate file type
  if (!file.type.startsWith('video/')) {
    throw new Error('File must be a video');
  }

  // Validate file size (max 100MB)
  const maxSize = 100 * 1024 * 1024; // 100MB
  if (file.size > maxSize) {
    throw new Error('Video file size must be less than 100MB');
  }

  // Generate unique filename
  const timestamp = Date.now();
  const filename = `videos/${userId}/${timestamp}_${file.name}`;
  const videoRef = ref(storage, filename);

  try {
    // Upload video
    const uploadTask = uploadBytesResumable(videoRef, file, {
      contentType: file.type || 'video/mp4',
    });

    await new Promise<void>((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = snapshot.totalBytes
            ? (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            : 0;
          options?.onProgress?.(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          options?.onProgress?.(100);
          resolve();
        }
      );
    });

    const videoUrl = await getDownloadURL(videoRef);

    // Generate thumbnail from video (first frame) - simplified for now
    // In production, you might want to use a service to extract thumbnails
    // For now, we'll just return the video URL
    return { videoUrl };
  } catch (error: any) {
    console.error('Error uploading video:', error);
    throw new Error(`Failed to upload video: ${error.message}`);
  }
}

/**
 * Upload an image file to Firebase Storage
 */
export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error('Image file size must be less than 10MB');
  }

  const imageRef = ref(storage, path);

  try {
    await uploadBytes(imageRef, file);
    const imageUrl = await getDownloadURL(imageRef);
    return imageUrl;
  } catch (error: any) {
    console.error('Error uploading image:', error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(fileUrl: string): Promise<void> {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error: any) {
    console.error('Error deleting file:', error);
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}
