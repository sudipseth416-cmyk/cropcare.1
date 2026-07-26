'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, Image as ImageIcon, Zap, X, Check, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateImageQuality, ImageQualityReport } from '@/lib/utils/imageValidation';

interface CameraScannerProps {
  onCapture: (file: File) => void;
  onClose?: () => void;
}

export default function CameraScanner({ onCapture, onClose }: CameraScannerProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [qualityReport, setQualityReport] = useState<ImageQualityReport | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      // Capture 1:1 square from center
      const size = Math.min(video.videoWidth, video.videoHeight);
      const startX = (video.videoWidth - size) / 2;
      const startY = (video.videoHeight - size) / 2;

      canvas.width = 600; // Compressed size for mobile
      canvas.height = 600;
      context.drawImage(video, startX, startY, size, size, 0, 0, 600, 600);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setCapturedImage(dataUrl);
      
      // Convert to file for validation
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      
      setIsProcessing(true);
      const report = await validateImageQuality(file);
      setQualityReport(report);
      setIsProcessing(false);
    }
  };

  const handleConfirm = async () => {
    if (!capturedImage) return;
    const blob = await (await fetch(capturedImage)).blob();
    const file = new File([blob], "scan.jpg", { type: "image/jpeg" });
    onCapture(file);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col overflow-hidden">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent">
        <button onClick={onClose} className="p-2 text-white/80 hover:text-white">
          <X size={24} />
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
          <Zap size={14} className="text-primary fill-primary" />
          <span className="text-[10px] font-bold text-white uppercase tracking-widest">Auto Focus ON</span>
        </div>
        <div className="w-10" />
      </div>

      {/* Camera Preview / Captured Image */}
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {!capturedImage ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            {/* Framing Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-64 h-64 border-2 border-primary/50 rounded-3xl relative">
                <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />
              </div>
              <p className="absolute bottom-1/4 text-white/60 text-xs font-bold uppercase tracking-widest text-center px-8">
                Position leaf inside the frame
              </p>
            </div>
          </>
        ) : (
          <img src={capturedImage} alt="Captured" className="w-full h-full object-contain" />
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls */}
      <div className="bg-black p-8 pb-12 flex flex-col gap-8">
        {isProcessing && (
          <div className="flex items-center justify-center gap-3 text-primary animate-pulse">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm font-bold uppercase tracking-widest">Analyzing Quality...</span>
          </div>
        )}

        {qualityReport && !qualityReport.isValid && (
          <div className="bg-danger/20 p-4 rounded-2xl border border-danger/30">
            <p className="text-xs text-danger font-bold mb-1 uppercase tracking-widest">Quality Issue</p>
            <p className="text-sm text-white/80">{qualityReport.warnings[0]}</p>
          </div>
        )}

        <div className="flex justify-between items-center px-4">
          {!capturedImage ? (
            <>
              <button className="p-4 text-white/60 hover:text-white">
                <ImageIcon size={28} />
              </button>
              <button 
                onClick={capturePhoto}
                disabled={!stream}
                className="w-20 h-20 rounded-full bg-white p-1 flex items-center justify-center active:scale-90 transition-transform"
              >
                <div className="w-full h-full rounded-full border-4 border-black/10 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-black/5" />
                </div>
              </button>
              <button className="p-4 text-white/60 hover:text-white">
                <RefreshCw size={28} />
              </button>
            </>
          ) : (
            <div className="flex w-full gap-4">
              <button 
                onClick={() => { setCapturedImage(null); setQualityReport(null); }}
                className="flex-1 py-4 bg-white/10 rounded-2xl text-white font-bold flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} /> Retake
              </button>
              <button 
                onClick={handleConfirm}
                disabled={isProcessing}
                className="flex-1 py-4 bg-primary rounded-2xl text-black font-bold flex items-center justify-center gap-2 shadow-xl shadow-primary/20"
              >
                <Check size={18} /> Use Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
