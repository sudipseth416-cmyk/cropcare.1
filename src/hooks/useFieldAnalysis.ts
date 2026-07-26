import { useState } from 'react';
import imageCompression from 'browser-image-compression';
import { FieldAnalysisResult } from '@/types/fieldAnalysis';
import { analyzeFieldImages } from '@/lib/gemini/fieldAnalysis';
import { saveFieldScan } from '@/services/firebase/fieldScans';
import { validateImageQuality } from '@/lib/utils/imageValidation';

export function useFieldAnalysis() {
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FieldAnalysisResult | null>(null);

  const compressAndAddImage = async (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError("Please select a valid image file.");
      return;
    }

    try {
      setIsCompressing(true);
      
      // First validate quality (warns if blurry/dark, but allows proceeding or checking)
      const qualityReport = await validateImageQuality(file);
      
      // Compress options for rural/low-bandwidth usage
      const options = {
        maxSizeMB: 0.8, // Compress below 800KB
        maxWidthOrHeight: 1200, // Reasonable max resolution
        useWebWorker: true,
        fileType: 'image/webp' // Always convert to WebP
      };

      const compressedFile = await imageCompression(file, options);
      
      // Ensure it's treated as a File with correct name extension
      const renamedFile = new File(
        [compressedFile], 
        file.name.replace(/\.[^/.]+$/, "") + ".webp", 
        { type: 'image/webp' }
      );

      // Create local preview URL
      const previewUrl = URL.createObjectURL(renamedFile);

      setImages(prev => [...prev, renamedFile]);
      setPreviews(prev => [...prev, previewUrl]);
    } catch (err: any) {
      console.error("Compression failed:", err);
      setError("Failed to optimize image. Trying with original file instead.");
      // Fallback: Add original
      const previewUrl = URL.createObjectURL(file);
      setImages(prev => [...prev, file]);
      setPreviews(prev => [...prev, previewUrl]);
    } finally {
      setIsCompressing(false);
    }
  };

  const removeImage = (index: number) => {
    // Revoke object URL to prevent memory leaks
    if (previews[index]) {
      URL.revokeObjectURL(previews[index]);
    }
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const resetAnalysis = () => {
    // Revoke all previews
    previews.forEach(url => URL.revokeObjectURL(url));
    setImages([]);
    setPreviews([]);
    setResult(null);
    setError(null);
    setIsCompressing(false);
    setIsAnalyzing(false);
    setIsSaving(false);
  };

  const startFieldAnalysis = async () => {
    if (images.length < 2) {
      setError("Please upload at least 2 images for field-wide collective analysis.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // 1. Core multi-image analysis from Gemini
      const analysisResult = await analyzeFieldImages(images);

      // 2. Persist to Firebase Storage & Firestore asynchronously
      setIsSaving(true);
      try {
        const persistedResult = await saveFieldScan(analysisResult, images);
        setResult(persistedResult);
      } catch (saveErr) {
        console.error("Failed storing scans in Firebase, using offline display:", saveErr);
        setResult(analysisResult);
      } finally {
        setIsSaving(false);
      }

    } catch (err: any) {
      console.error("Analysis failed:", err);
      setError(err.message || "An error occurred during field analysis. Please check your internet connection.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    images,
    previews,
    isCompressing,
    isAnalyzing,
    isSaving,
    error,
    result,
    compressAndAddImage,
    removeImage,
    resetAnalysis,
    startFieldAnalysis,
    setError
  };
}
