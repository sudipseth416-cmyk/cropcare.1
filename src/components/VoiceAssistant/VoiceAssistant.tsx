'use client';

import React, { useState, useEffect } from 'react';
import { Mic, X, Volume2, Globe, Command, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVoiceAssistant } from '@/hooks/useVoiceAssistant';
import { triggerHaptic } from '@/lib/native/bridge';

import { getCropCareResponse } from '@/lib/ai/gemini';

export default function VoiceAssistant() {
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    language, 
    setLanguage,
    speak 
  } = useVoiceAssistant({
    onCommand: async (text) => {
      setIsProcessing(true);
      try {
        const result = await getCropCareResponse(text);
        const reply = result.error ? result.message : result.text!;
        setAiResponse(reply);
        speak(reply, language);
      } catch (err) {
        setAiResponse("I'm sorry, I couldn't process that. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    }
  });

  const toggleAssistant = () => {
    if (!showModal) {
      setShowModal(true);
      startListening();
      triggerHaptic();
    } else {
      stopListening();
      setShowModal(false);
    }
  };

  const LANGUAGES = [
    { code: 'en-IN', label: 'English', flag: '🇮🇳' },
    { code: 'hi-IN', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'bn-IN', label: 'বাংলা', flag: '🇮🇳' },
  ];

  return (
    <>
      {/* Floating Action Button */}
      {!showModal && (
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          whileTap={{ scale: 0.9 }}
          onClick={toggleAssistant}
          className="fixed bottom-32 right-8 z-[120] w-16 h-16 bg-primary text-black rounded-full shadow-2xl flex items-center justify-center group"
        >
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20 group-hover:hidden" />
          <Mic size={32} strokeWidth={2.5} />
        </motion.button>
      )}

      {/* Fullscreen Voice Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex flex-col p-8"
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-12">
              <div className="flex gap-2">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      language === lang.code 
                        ? 'bg-primary border-primary text-black' 
                        : 'bg-white/5 border-white/10 text-text-muted'
                    }`}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => { stopListening(); setShowModal(false); }}
                className="p-3 bg-white/5 rounded-full text-white/60 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-12">
              <div className="space-y-4 max-w-sm">
                <p className="text-text-dim text-xs font-bold uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                  <Sparkles size={14} className="text-primary" /> 
                  {isListening ? 'Listening Now' : 'Assistant Ready'}
                </p>
                <h2 className="text-3xl font-bold leading-tight min-h-[4rem]">
                  {isProcessing ? (
                    <span className="text-primary animate-pulse">Thinking...</span>
                  ) : (
                    transcript || "Try saying 'Mausam kaisa hai?'"
                  )}
                </h2>
              </div>

              {/* Waveform Animation */}
              <div className="h-32 flex items-center gap-1.5">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={(isListening || isProcessing) ? {
                      height: [20, Math.random() * 80 + 20, 20],
                    } : { height: 8 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.5,
                      delay: i * 0.05
                    }}
                    className="w-1.5 bg-primary rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  />
                ))}
              </div>

              <div className="card bg-white/5 border-white/10 p-6 max-w-sm w-full">
                <p className="text-sm text-text-muted leading-relaxed">
                  {aiResponse || "I can help with crop diseases, fertilizers, and weather alerts in your local language."}
                </p>
              </div>
            </div>

            {/* Footer / Controls */}
            <div className="pb-12 flex flex-col items-center gap-6">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => isListening ? stopListening() : startListening()}
                className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                  isListening ? 'bg-danger shadow-[0_0_40px_rgba(239,68,68,0.3)]' : 'bg-primary shadow-[0_0_40px_rgba(16,185,129,0.3)]'
                }`}
              >
                {isListening ? (
                  <div className="w-8 h-8 bg-white rounded-lg animate-pulse" />
                ) : (
                  <Mic size={40} className="text-black" />
                )}
              </motion.button>
              <p className="text-text-dim text-[10px] font-bold uppercase tracking-widest">
                {isListening ? 'Tap to Stop' : 'Tap to Speak'}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
