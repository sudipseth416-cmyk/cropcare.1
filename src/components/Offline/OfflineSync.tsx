'use client';

import React, { useState, useEffect } from 'react';
import { WifiOff, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OfflineSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 5000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    // Register Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(reg => {
        console.log('Service Worker registered', reg);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {showStatus && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`
            fixed bottom-32 left-8 z-[110] p-4 rounded-2xl shadow-2xl flex items-center gap-4 border
            ${isOnline ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-danger/10 border-danger/20 text-danger'}
          `}
        >
          {isOnline ? (
            <>
              <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Back Online</p>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">Syncing History...</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-danger/20 rounded-full flex items-center justify-center animate-pulse">
                <WifiOff size={20} />
              </div>
              <div>
                <p className="text-sm font-bold">Offline Mode</p>
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-70">Saving to local cache</p>
              </div>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
