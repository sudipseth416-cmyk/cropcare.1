'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, MapPin, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useUser } from '@/hooks/useUser';
import { triggerHaptic } from '@/lib/native/bridge';

export default function SignInModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { login } = useUser();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    location: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) {
      setStep(step + 1);
      triggerHaptic();
      return;
    }
    
    login(formData);
    triggerHaptic();
    setStep(3); // Success state
    setTimeout(() => {
      onClose();
      window.location.reload(); // Refresh to sync weather
    }, 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/image2.jpg')" }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/20 rounded-[40px] overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)]"
          >
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold font-heading">
                    {step === 3 ? 'Welcome!' : 'Farmer Sign In'}
                  </h2>
                  <p className="text-text-muted text-xs font-medium uppercase tracking-widest mt-1">
                    {step === 1 ? 'Personal Details' : step === 2 ? 'Farm Location' : 'Profile Ready'}
                  </p>
                </div>
                <button onClick={onClose} className="p-2 bg-white/5 rounded-full text-text-dim">
                  <X size={20} />
                </button>
              </div>

              {step === 3 ? (
                <div className="py-12 flex flex-col items-center text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center text-primary"
                  >
                    <CheckCircle2 size={40} />
                  </motion.div>
                  <h3 className="text-xl font-bold">Hello, {formData.name}!</h3>
                  <p className="text-text-muted text-sm leading-relaxed">
                    Your profile is ready. We are now syncing weather alerts for <span className="text-primary font-bold">{formData.location}</span>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {step === 1 && (
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-dim uppercase tracking-wider ml-1">Full Name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                          <input
                            required
                            type="text"
                            placeholder="e.g. Rajesh Kumar"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-primary/50 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-dim uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                          <input
                            required
                            type="email"
                            placeholder="rajesh@farmer.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-primary/50 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-text-dim uppercase tracking-wider ml-1">Farm Location</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={18} />
                          <input
                            required
                            autoFocus
                            type="text"
                            placeholder="e.g. Ludhiana, Punjab"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-primary/50 focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-text-muted italic px-2">
                        We'll use this to provide precision weather alerts for your crops.
                      </p>
                    </motion.div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-primary text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary/90 active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
                  >
                    {step === 1 ? 'Next Step' : 'Complete Sign In'}
                    <ArrowRight size={20} />
                  </button>
                </form>
              )}
            </div>
            
            <div className="bg-white/5 p-4 flex justify-center gap-1.5">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i} 
                  className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-primary' : 'w-2 bg-white/10'}`} 
                />
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
