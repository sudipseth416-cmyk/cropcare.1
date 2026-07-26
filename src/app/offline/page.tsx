'use client';

import React from 'react';
import { WifiOff, Home, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-6 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-24 h-24 bg-danger/10 rounded-full flex items-center justify-center mb-8"
      >
        <WifiOff size={48} className="text-danger" />
      </motion.div>
      
      <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
      <p className="text-text-muted max-w-xs mb-10">
        It looks like you don't have an internet connection. Some features of CropCare require a network.
      </p>

      <div className="flex flex-col w-full max-w-xs gap-4">
        <button 
          onClick={() => window.location.reload()}
          className="btn btn-primary py-4 flex items-center justify-center gap-2"
        >
          <RefreshCcw size={18} /> Retry Connection
        </button>
        <a 
          href="/"
          className="btn btn-ghost py-4 flex items-center justify-center gap-2 border-white/10"
        >
          <Home size={18} /> Go to Home
        </a>
      </div>

      <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/5 text-left">
        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Good news</p>
        <p className="text-xs text-text-muted">
          Your previous scan history and local farm data are still accessible even without internet.
        </p>
      </div>
    </div>
  );
}
