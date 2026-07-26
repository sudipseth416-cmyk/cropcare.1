'use client';

import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CloudSun, 
  Droplets, 
  Info, 
  Trash2,
  Filter,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { onMessageListener } from '@/lib/firebase/messaging';
import { triggerHaptic } from '@/lib/native/bridge';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'weather' | 'disease' | 'irrigation' | 'system';
  time: string;
  read: boolean;
}

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'disease' | 'weather'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      title: 'High Humidity Alert',
      body: 'Conditions are favorable for Fungal Blight in tomatoes.',
      type: 'disease',
      time: '10:30 AM',
      read: false
    },
    {
      id: '2',
      title: 'Rain Predicted',
      body: 'Heavy rain expected tomorrow. Adjust your irrigation plan.',
      type: 'weather',
      time: '09:15 AM',
      read: false
    }
  ]);

  useEffect(() => {
    const unsubscribe = onMessageListener((payload: any) => {
      if (!payload) return;
      const newNotif: Notification = {
        id: Date.now().toString(),
        title: payload.notification?.title || 'System Notification',
        body: payload.notification?.body || '',
        type: 'system',
        time: 'Just now',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
      triggerHaptic();
    });

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const filtered = notifications.filter(n => filter === 'all' || n.type === filter);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    triggerHaptic();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'weather': return <CloudSun className="text-info" size={20} />;
      case 'disease': return <AlertTriangle className="text-danger" size={20} />;
      case 'irrigation': return <Droplets className="text-primary" size={20} />;
      default: return <Info className="text-text-muted" size={20} />;
    }
  };

  return (
    <>
      <button 
        onClick={() => { setIsOpen(true); triggerHaptic(); }}
        className="relative p-2 rounded-xl bg-white/5 border border-white/5"
      >
        <Bell size={24} className="text-text-main" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-bg-dark">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[400]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 right-0 z-[500] bg-bg-card rounded-t-[40px] border-t border-white/10 flex flex-col max-h-[90vh]"
            >
              {/* Handle */}
              <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mt-4 mb-2" />

              {/* Header */}
              <div className="p-8 pb-4">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold font-heading">Alert Center</h2>
                  <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 rounded-full text-text-dim"><X size={20} /></button>
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
                  {['all', 'disease', 'weather'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f as any)}
                      className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                        filter === f ? 'bg-primary text-black' : 'bg-white/5 text-text-dim border border-white/5'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto px-6 pb-12 space-y-4">
                {filtered.length > 0 ? (
                  filtered.map((notif) => (
                    <motion.div
                      key={notif.id}
                      layout
                      drag="x"
                      dragConstraints={{ left: -100, right: 0 }}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -60) removeNotification(notif.id);
                      }}
                      className="relative group"
                    >
                      {/* Swipe Background */}
                      <div className="absolute inset-0 bg-danger rounded-[24px] flex items-center justify-end px-8 text-white">
                        <Trash2 size={24} />
                      </div>

                      {/* Notification Card */}
                      <motion.div className="relative card p-6 flex gap-5 bg-bg-card group-active:scale-[0.98] transition-transform">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center shrink-0">
                          {getIcon(notif.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-bold text-sm leading-tight">{notif.title}</h4>
                            <span className="text-[10px] text-text-dim font-bold">{notif.time}</span>
                          </div>
                          <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                            {notif.body}
                          </p>
                        </div>
                        <div className="flex items-center text-text-dim">
                          <ChevronRight size={18} />
                        </div>
                      </motion.div>
                    </motion.div>
                  ))
                ) : (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full mx-auto flex items-center justify-center text-text-dim">
                      <CheckCircle2 size={32} />
                    </div>
                    <p className="text-sm text-text-muted font-bold uppercase tracking-widest">Everything is okay!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
