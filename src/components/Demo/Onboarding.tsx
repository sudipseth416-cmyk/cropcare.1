'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, CloudSun, User, Mail, MapPin, CheckCircle2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { triggerHaptic } from '@/lib/native/bridge';
import Image from 'next/image';

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const { login } = useUser();
  const [step, setStep] = useState(0);
  const [isSplash, setIsSplash] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsSplash(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const STEPS = [
    {
      title: "AI Crop Scanning",
      desc: "Instantly detect 30+ crop diseases with 95% accuracy using your phone's camera.",
      icon: <Zap className="text-primary" size={48} />,
      color: "bg-primary/20"
    },
    {
      title: "Weather Intelligence",
      desc: "Get localized weather alerts and AI-driven farming advice tailored to your land.",
      icon: <CloudSun className="text-info" size={48} />,
      color: "bg-info/20"
    },
    {
      title: "Expert Network",
      desc: "Connect with verified agricultural specialists and fellow farmers in your region.",
      icon: <ShieldCheck className="text-accent" size={48} />,
      color: "bg-accent/20"
    },
    {
      title: "Farmer Profile",
      desc: "Tell us about your farm to get personalized crop alerts and weather updates.",
      icon: <User className="text-primary" size={48} />,
      color: "bg-primary/20"
    }
  ];

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      triggerHaptic();
    } else {
      if (!formData.name || !formData.location) return;
      login(formData);
      triggerHaptic();
      onComplete();
    }
  };

  if (isSplash) {
    return (
      <motion.div 
        className="fixed inset-0 z-[1000] bg-cover bg-center flex flex-col items-center justify-center p-8"
        style={{ backgroundImage: "url('/front.avif')" }}
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-0"></div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center gap-8 relative z-10 w-full max-w-3xl"
        >
          <div className="text-center w-full">
            <h1 className="text-5xl md:text-7xl font-black font-heading tracking-[0.2em] text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] mb-4">
              CROPCARE <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-600 drop-shadow-[0_0_30px_rgba(16,185,129,0.8)]">AI</span>
            </h1>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px bg-gradient-to-r from-transparent to-primary flex-1 max-w-[100px]"></div>
              <p className="text-white text-lg font-medium tracking-[0.4em] uppercase drop-shadow-md">Smart Farming • Secure Future</p>
              <div className="h-px bg-gradient-to-l from-transparent to-primary flex-1 max-w-[100px]"></div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: 250 }}
          transition={{ delay: 0.5, duration: 1.5 }}
          className="h-1.5 bg-white/10 mt-16 rounded-full overflow-hidden relative z-10"
        >
          <motion.div 
            animate={{ x: [-250, 250] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1/2 h-full bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_20px_#10b981]"
          />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="fixed inset-0 z-[900] bg-cover bg-center flex flex-col p-8 overflow-y-auto transition-all duration-700"
      style={{ backgroundImage: `url('${step === 3 ? '/image2.jpg' : '/front.avif'}')` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md z-0"></div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8 flex flex-col items-center w-full max-w-lg"
          >
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-black font-heading text-white tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                {STEPS[step].title}
              </h2>
              <div className="h-px bg-gradient-to-r from-transparent via-primary to-transparent w-full opacity-50"></div>
              <p className="text-white text-lg md:text-xl leading-relaxed font-medium drop-shadow-md px-4">
                {STEPS[step].desc}
              </p>
            </div>

            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full space-y-4"
              >
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10" size={18} />
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="relative z-10 w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none text-white placeholder:text-white/40 transition-all shadow-lg"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10" size={18} />
                  <input
                    type="email"
                    placeholder="Email ID"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="relative z-10 w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none text-white placeholder:text-white/40 transition-all shadow-lg"
                  />
                </div>
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-primary z-10" size={18} />
                  <input
                    type="text"
                    placeholder="Farm Location (e.g. Ludhiana)"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="relative z-10 w-full bg-black/40 backdrop-blur-md border border-white/20 rounded-2xl py-4 pl-12 pr-4 focus:border-primary focus:bg-black/60 focus:ring-1 focus:ring-primary outline-none text-white placeholder:text-white/40 transition-all shadow-lg"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-2 mt-12">
          {STEPS.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`} 
            />
          ))}
        </div>
      </div>

      <div className="pb-24 pt-4 mt-8 z-20 relative">
        <button 
          onClick={handleNext}
          disabled={step === 3 && (!formData.name || !formData.location)}
          className="w-full btn btn-primary py-5 flex items-center justify-center gap-3 text-lg shadow-xl shadow-primary/20 disabled:opacity-50 transition-all"
        >
          {step < STEPS.length - 1 ? 'Continue' : 'Start Farming'} <ArrowRight size={20} />
        </button>
      </div>
    </motion.div>
  );
}
