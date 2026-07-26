'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, X, ImageIcon, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MultiImageUploadProps {
  previews: string[];
  isCompressing: boolean;
  disabled?: boolean;
  onImageAdd: (file: File) => Promise<void>;
  onImageRemove: (index: number) => void;
  onAnalyze: () => void;
}

export default function MultiImageUpload({
  previews,
  isCompressing,
  disabled,
  onImageAdd,
  onImageRemove,
  onAnalyze
}: MultiImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (disabled || isCompressing) return;
    for (let i = 0; i < files.length; i++) {
      await onImageAdd(files[i]);
    }
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isCompressing) return;
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const triggerFileInput = () => {
    if (!disabled && !isCompressing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Upload Zone */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        onClick={triggerFileInput}
        className={`
          relative group cursor-pointer border-2 border-dashed rounded-[32px] p-8 md:p-12
          flex flex-col items-center justify-center transition-all duration-300
          ${isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/5'}
          ${disabled || isCompressing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden" 
          accept="image/*"
          multiple
        />
        
        {isCompressing ? (
          <div className="flex flex-col items-center gap-4 py-4">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
              <Loader2 size={48} className="text-primary" />
            </motion.div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary animate-pulse text-center">
              Optimizing & WebP Converting...
            </p>
          </div>
        ) : (
          <>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
              <Upload className="text-primary" size={28} />
            </div>
            
            <h3 className="text-lg font-bold mb-1">Multi-Image Field Analysis</h3>
            <p className="text-text-muted text-center text-xs max-w-sm">
              Upload 2 or more photos from different sections of your agricultural field. Drag and drop on desktop, or select from gallery.
            </p>
            
            <div className="mt-6 flex gap-4">
              <button type="button" className="btn btn-primary btn-sm" disabled={disabled}>Choose Files</button>
              <button type="button" className="btn btn-ghost btn-sm" disabled={disabled}>
                <Camera size={16} className="mr-1" /> Take Photos
              </button>
            </div>
          </>
        )}
      </motion.div>

      {/* Uploaded Previews */}
      {previews.length > 0 && (
        <div className="card border-white/5 bg-white/5 p-6 rounded-[28px] space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold uppercase tracking-wider text-text-dim">
              Field Images ({previews.length})
            </h4>
            <span className="text-[11px] text-text-muted">
              {previews.length < 2 ? "Upload at least 2 images to run field diagnostic" : "Ready for collective analysis"}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <AnimatePresence>
              {previews.map((src, index) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="relative rounded-2xl overflow-hidden aspect-square border border-white/10 group bg-black/20"
                >
                  <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onImageRemove(index); }}
                      className="p-2 bg-danger text-white rounded-full hover:scale-110 transition-transform"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white">
                    #{index + 1}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {previews.length >= 2 && (
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-4 border-t border-white/5 flex justify-end"
            >
              <button
                type="button"
                onClick={onAnalyze}
                disabled={disabled || isCompressing}
                className="btn btn-primary w-full sm:w-auto px-8"
              >
                Run Field-Wide Analysis
              </button>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
