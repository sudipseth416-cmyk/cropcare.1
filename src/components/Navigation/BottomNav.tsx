'use client';

import React from 'react';
import { 
  Home, 
  Camera, 
  BellRing, 
  Users, 
  UserCircle
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: any;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'alerts', label: 'Alerts', icon: BellRing },
  { id: 'scan', label: 'Scan', icon: Camera },
  { id: 'community', label: 'Network', icon: Users },
  { id: 'profile', label: 'Profile', icon: UserCircle },
];

export default function BottomNav({ activeTab, onTabChange }: { activeTab: string, onTabChange: (id: string) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[100] bg-bg-card/80 backdrop-blur-xl border-t border-white/5 px-4 pb-8 pt-4 md:hidden">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const isScanner = item.id === 'scan';
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 transition-all ${isScanner ? '-mt-12' : ''}`}
            >
              {isScanner ? (
                <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all ${isActive ? 'bg-primary scale-110 shadow-primary/20' : 'bg-primary/90'}`}>
                  <item.icon size={28} className={isActive ? 'text-black' : 'text-black'} strokeWidth={2.5} />
                </div>
              ) : (
                <div className={`p-2 rounded-xl transition-all ${isActive ? 'text-primary' : 'text-text-dim'}`}>
                  <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
              )}
              {!isScanner && (
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isActive ? 'text-primary' : 'text-text-dim'}`}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
