'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, X, ImageIcon, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { validateImageQuality, ImageQualityReport } from '@/lib/utils/imageValidation';

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  onReset: () => void;
  disabled?: boolean;
}

export default function ImageUpload({ onImageSelect, onReset, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [qualityReport, setQualityReport] = useState<ImageQualityReport | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setCurrentFile(file);
      setIsValidating(true);
      setQualityReport(null);
      
      const report = await validateImageQuality(file);
      setQualityReport(report);
      setIsValidating(false);

      if (report.isValid) {
        completeSelection(file);
      }
    }
  };

  const completeSelection = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      onImageSelect(file);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => !disabled && !isValidating && fileInputRef.current?.click()}
            className={`
              relative group cursor-pointer rounded-[32px] p-12
              flex flex-col items-center justify-center transition-all duration-500 overflow-hidden
              ${isDragging ? 'scale-[1.02]' : 'hover:scale-[1.01]'}
              ${disabled || isValidating ? 'opacity-50 cursor-not-allowed' : ''}
              bg-black/40 backdrop-blur-xl border border-white/20 shadow-[0_15px_40px_rgba(16,185,129,0.15)]
            `}
          >
            {/* Animated Cyber Border Glow */}
            <div className={`absolute inset-0 border-2 rounded-[32px] transition-colors duration-500 ${isDragging ? 'border-primary shadow-[0_0_30px_#10b981_inset]' : 'border-dashed border-white/20 group-hover:border-primary/50'}`}></div>
            
            {/* Holographic Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden" 
              accept="image/*"
            />
            
            {isValidating ? (
              <div className="flex flex-col items-center gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                  <ShieldCheck size={48} className="text-primary" />
                </motion.div>
                <p className="text-sm font-bold uppercase tracking-widest text-primary animate-pulse">Checking Image Quality...</p>
              </div>
            ) : (
              <>
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                  <Camera className="text-primary" size={32} />
                </div>
                
                <h3 className="text-xl font-bold mb-2">Capture or Upload</h3>
                <p className="text-text-muted text-center text-sm max-w-xs">
                  Drag and drop an image of the infected leaf or click to select from your gallery.
                </p>
                
                <div className="mt-8 flex gap-4">
                  <button className="btn btn-primary" disabled={disabled}>Select Photo</button>
                  <button className="btn btn-ghost" disabled={disabled}>
                    <ImageIcon size={18} /> Take Photo
                  </button>
                </div>
              </>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            className="relative rounded-[32px] overflow-hidden aspect-video group shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-primary/30"
            style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
          >
            <img src={preview} alt="Upload preview" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            
            {/* Cyberpunk Scanning Grid & Line Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.1)_1px,transparent_1px)] bg-[size:20px_20px] mix-blend-overlay opacity-30 pointer-events-none"></div>
            <motion.div 
              animate={{ y: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute top-0 left-0 right-0 h-1 bg-primary shadow-[0_0_20px_#10b981] opacity-70 pointer-events-none z-10"
            />
            
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 z-20 backdrop-blur-sm">
              <div className="bg-success/20 backdrop-blur-md px-4 py-2 rounded-full border border-success flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="text-primary" size={16} />
                <span className="text-sm font-bold text-white tracking-wider">Quality Verified</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); setPreview(null); setQualityReport(null); onReset(); }}
                className="p-4 bg-danger/80 backdrop-blur-md border border-danger text-white rounded-full hover:scale-110 transition-transform shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              >
                <X size={24} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quality Warnings */}
      <AnimatePresence>
        {qualityReport && !qualityReport.isValid && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-6 rounded-[24px] bg-danger/10 border border-danger/20"
          >
            <div className="flex items-center gap-2 text-danger font-bold mb-4 uppercase tracking-widest text-xs">
              <AlertTriangle size={16} /> Image Quality Issues Detected
            </div>
            <ul className="space-y-3">
              {qualityReport.warnings.map((warning, i) => (
                <li key={i} className="text-sm text-text-main flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-danger rounded-full mt-1.5" /> {warning}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <button 
                onClick={() => { setQualityReport(null); fileInputRef.current?.click(); }}
                className="btn btn-primary bg-danger hover:bg-red-600 text-white flex-1"
              >
                Retake Photo
              </button>
              <button 
                onClick={() => { 
                  if (currentFile) completeSelection(currentFile);
                }}
                className="btn btn-ghost border-danger/20 text-danger flex-1"
              >
                Skip & Analyze
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
