import { db, storage } from '@/lib/firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FieldAnalysisResult } from '@/types/fieldAnalysis';

/**
 * Uploads a file to Firebase Storage if configured, otherwise falls back to a temporary local URL.
 */
async function uploadImage(file: File): Promise<string> {
  if (!storage) {
    console.warn("Firebase Storage not configured. Falling back to Object URL.");
    return URL.createObjectURL(file);
  }

  try {
    const fileName = `fieldScans/${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${file.name}`;
    const storageRef = ref(storage, fileName);
    
    // Upload image
    const snapshot = await uploadBytes(storageRef, file);
    // Get public download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Firebase Storage Upload failed, using local fallback URL:", error);
    return URL.createObjectURL(file);
  }
}

/**
 * Saves field scan results to Firestore 'fieldScans' collection.
 * Seamlessly falls back if Firebase is not configured or fails.
 */
export async function saveFieldScan(
  analysis: Omit<FieldAnalysisResult, 'id' | 'createdAt'>, 
  images: File[]
): Promise<FieldAnalysisResult> {
  try {
    // 1. Upload all images to Storage in parallel
    const uploadPromises = images.map(file => uploadImage(file));
    const imageURLs = await Promise.all(uploadPromises);

    const newScanData = {
      ...analysis,
      imageURLs,
      createdAt: serverTimestamp ? serverTimestamp() : new Date()
    };

    if (!db) {
      console.warn("Firestore not configured. Returning local result representation.");
      return {
        ...newScanData,
        id: `local_${Date.now()}`,
        createdAt: new Date()
      } as FieldAnalysisResult;
    }

    const docRef = await addDoc(collection(db, 'fieldScans'), newScanData);
    
    return {
      ...newScanData,
      id: docRef.id,
      createdAt: new Date()
    } as FieldAnalysisResult;

  } catch (error) {
    console.error("Failed to save field scan:", error);
    // Graceful fallback so user is never blocked
    return {
      ...analysis,
      id: `fallback_${Date.now()}`,
      imageURLs: images.map(file => URL.createObjectURL(file)),
      createdAt: new Date()
    } as FieldAnalysisResult;
  }
}
