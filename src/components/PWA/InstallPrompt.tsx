'use client';

import React, { useState, useEffect } from 'react';
import { Download, X, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Only show if not already installed
      if (!window.matchMedia('(display-mode: standalone)').matches) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-32 left-4 right-4 z-[150] md:bottom-8 md:left-auto md:right-8 md:w-96"
        >
          <div className="bg-primary p-6 rounded-[32px] shadow-2xl flex items-center gap-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Download size={120} />
            </div>

            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center shrink-0 shadow-xl">
              <div className="w-6 h-6 bg-primary rounded-full" />
            </div>

            <div className="flex-1">
              <h4 className="text-black font-bold text-lg leading-tight">Install CropCare AI</h4>
              <p className="text-black/70 text-xs font-bold uppercase tracking-widest mt-1">Faster • Offline • Native</p>
            </div>

            <div className="flex flex-col gap-2">
              <button 
                onClick={handleInstall}
                className="bg-black text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg active:scale-95 transition-transform"
              >
                Install
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-black/50 text-[10px] font-bold uppercase text-center"
              >
                Not Now
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
