'use client';

import React from 'react';
import { 
  Camera, 
  CloudSun, 
  AlertTriangle, 
  History, 
  MessageCircle, 
  Mic, 
  ArrowRight,
  Droplets,
  Wind,
  Leaf,
  Shield,
  TrendingUp,
  Zap,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useWeather } from '@/hooks/useWeather';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export default function MobileDashboard({ onAction }: { onAction: (tab: string) => void }) {
  const { weather, loading: weatherLoading } = useWeather();
  const RECENT_SCANS = [
    { id: '1', crop: 'Tomato', status: 'Healthy', date: 'Today', color: 'text-success', emoji: '🍅' },
    { id: '2', crop: 'Wheat', status: 'Infected', date: 'Yesterday', color: 'text-danger', emoji: '🌾' },
    { id: '3', crop: 'Rice', status: 'Healthy', date: 'Oct 22', color: 'text-success', emoji: '🌱' },
  ];

  const STATS = [
    { label: 'Scans Today', value: '12', icon: Camera, color: 'from-primary/30 to-primary/10', border: 'border-primary/20', iconColor: 'text-primary' },
    { label: 'Crops Saved', value: '89', icon: Shield, color: 'from-info/30 to-info/10', border: 'border-info/20', iconColor: 'text-info' },
    { label: 'Accuracy', value: '95%', icon: TrendingUp, color: 'from-accent/30 to-accent/10', border: 'border-accent/20', iconColor: 'text-accent' },
  ];

  return (
    <motion.div 
      variants={stagger}
      initial="hidden"
      animate="show"
      className="space-y-7"
    >
      {/* 1. Hero Stats Row */}
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-3">
        {STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            whileTap={{ scale: 0.95 }}
            className={`relative bg-gradient-to-br ${stat.color} backdrop-blur-xl border ${stat.border} rounded-[20px] p-4 flex flex-col items-center text-center overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
            <stat.icon size={18} className={`${stat.iconColor} relative z-10 mb-2 drop-shadow-[0_0_6px_currentColor]`} />
            <span className="text-2xl font-black text-white relative z-10 tracking-tight">{stat.value}</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-white/50 relative z-10 mt-0.5">{stat.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* 2. Weather Summary Widget */}
      <motion.div variants={fadeUp}>
        <motion.div 
          whileTap={{ scale: 0.97 }}
          onClick={() => onAction('alerts')}
          className="relative bg-black/30 backdrop-blur-2xl border border-white/15 rounded-[28px] p-6 flex justify-between items-center group min-h-[130px] shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden cursor-pointer"
        >
          {/* Animated shimmer */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 4 }}
            className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-20deg] pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-info/8 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
          
          {weatherLoading ? (
             <div className="flex items-center gap-3 animate-pulse relative z-10">
               <div className="w-10 h-10 bg-white/10 rounded-2xl" />
               <div className="space-y-2">
                 <div className="w-20 h-5 bg-white/10 rounded-lg" />
                 <div className="w-28 h-3 bg-white/5 rounded" />
               </div>
             </div>
          ) : (
            <>
              <div className="space-y-1.5 relative z-10">
                <div className="flex items-center gap-2 text-primary font-bold text-[9px] uppercase tracking-[0.2em] drop-shadow-md">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_6px_#10b981]" />
                  Live Weather
                </div>
                <p className="text-4xl font-black tracking-tighter drop-shadow-lg leading-none">{weather?.main?.temp ? Math.round(weather.main.temp) : '--'}°C</p>
                <p className="text-white/60 text-xs font-medium tracking-wide">
                  {weather?.weather?.[0]?.main ? `${weather.weather[0].main} • ${weather?.name || 'Local Farm'}` : 'Updating location...'}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3 relative z-10">
                <div className="flex gap-5">
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 bg-info/15 border border-info/20 rounded-xl flex items-center justify-center">
                      <Droplets size={16} className="text-info drop-shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                    </div>
                    <span className="text-[10px] font-bold text-white/80">{weather?.main?.humidity ?? '--'}%</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="w-9 h-9 bg-accent/15 border border-accent/20 rounded-xl flex items-center justify-center">
                      <Wind size={16} className="text-accent drop-shadow-[0_0_6px_rgba(245,158,11,0.6)]" />
                    </div>
                    <span className="text-[10px] font-bold text-white/80">{weather?.wind?.speed ?? '--'}km/h</span>
                  </div>
                </div>
                <div className="bg-primary/15 backdrop-blur-md p-2.5 rounded-xl border border-primary/30 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.1)] group-hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]">
                  <ArrowRight size={14} className="text-primary group-hover:text-black transition-colors" />
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* 3. Primary Scan CTA */}
      <motion.div variants={fadeUp}>
        <motion.button
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => onAction('scan')}
          className="w-full bg-[url('/banner.png')] bg-cover bg-center rounded-[28px] p-10 flex flex-col items-center justify-center gap-4 shadow-[0_16px_48px_rgba(16,185,129,0.35)] relative overflow-hidden group border border-primary/30"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-primary/60 to-primary/30 transition-all duration-500 group-hover:via-primary/70" />
          
          {/* Rotating outer ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 border border-dashed border-white/10 rounded-full pointer-events-none z-[5]"
          />

          <motion.div 
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 bg-black/40 backdrop-blur-xl rounded-full border border-white/20 flex items-center justify-center z-10 shadow-[0_8px_24px_rgba(0,0,0,0.6)] relative"
          >
            <div className="absolute inset-[-4px] border border-primary/30 rounded-full animate-ping opacity-15" />
            <Camera size={36} className="text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]" />
          </motion.div>
          
          <div className="text-center z-10 space-y-1.5">
            <h3 className="text-2xl font-black text-white drop-shadow-[0_3px_8px_rgba(0,0,0,0.6)] tracking-wide">Scan Your Crop</h3>
            <p className="text-white/80 text-[11px] font-bold uppercase tracking-[0.25em] drop-shadow-md">Instant AI Diagnosis</p>
          </div>
        </motion.button>
      </motion.div>

      {/* 4. Urgent Alerts */}
      <motion.section variants={fadeUp} className="space-y-3">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2 px-1">
          <AlertTriangle size={14} className="text-danger drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]" /> Urgent Alerts
        </h4>
        <motion.div 
          whileTap={{ scale: 0.98 }}
          className="bg-black/30 backdrop-blur-xl border border-danger/20 p-5 rounded-[22px] flex gap-4 relative overflow-hidden shadow-[0_8px_24px_rgba(239,68,68,0.1)] group cursor-pointer"
        >
          <div className="absolute top-0 left-0 w-[3px] h-full bg-gradient-to-b from-danger via-danger to-danger/30 shadow-[0_0_12px_#ef4444]" />
          <div className="absolute inset-0 bg-gradient-to-r from-danger/5 to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
          <div className="w-12 h-12 bg-danger/15 rounded-2xl flex items-center justify-center shrink-0 border border-danger/20 relative z-10">
            <Droplets className="text-danger drop-shadow-[0_0_6px_rgba(239,68,68,0.6)]" size={22} />
          </div>
          <div className="relative z-10 flex-1">
            <h5 className="font-bold text-[15px] text-white tracking-wide">Fungal Outbreak Risk</h5>
            <p className="text-[11px] text-white/60 mt-1 leading-relaxed font-medium">High humidity expected. Apply preventive fungicide to tomato crops.</p>
          </div>
          <ArrowRight size={16} className="text-white/20 self-center relative z-10 group-hover:text-danger transition-colors" />
        </motion.div>
      </motion.section>

      {/* 5. Quick Actions */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
        {[
          { icon: MessageCircle, label: 'Ask AI Chat', desc: 'Get instant help', color: 'info' },
          { icon: Mic, label: 'Voice Guide', desc: 'Hands-free mode', color: 'primary' },
        ].map((action) => (
          <motion.button 
            key={action.label}
            whileTap={{ scale: 0.95 }}
            className={`bg-black/30 backdrop-blur-xl border border-white/10 p-5 rounded-[22px] flex flex-col items-center gap-3 hover:bg-white/5 hover:border-white/20 transition-all duration-300 shadow-lg group`}
          >
            <div className={`w-12 h-12 bg-${action.color}/15 border border-${action.color}/25 rounded-2xl flex items-center justify-center text-${action.color} shadow-[0_0_16px_rgba(16,185,129,0.15)] group-hover:scale-110 transition-transform`}>
              <action.icon size={24} />
            </div>
            <div className="text-center">
              <span className="text-sm font-bold tracking-wide text-white/90 block">{action.label}</span>
              <span className="text-[9px] text-white/40 font-medium tracking-wider uppercase">{action.desc}</span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* 6. Recent History */}
      <motion.section variants={fadeUp} className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
            <History size={14} /> Recent Scans
          </h4>
          <button className="text-[9px] font-bold text-primary uppercase tracking-widest hover:text-white transition-colors">View All</button>
        </div>
        <div className="space-y-2.5">
          {RECENT_SCANS.map((scan, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              key={scan.id} 
              className="bg-black/25 backdrop-blur-md border border-white/5 p-4 rounded-[18px] flex justify-between items-center hover:bg-white/5 hover:border-white/10 transition-all duration-300 shadow-md group cursor-pointer"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-[14px] flex items-center justify-center text-lg">
                  {scan.emoji}
                </div>
                <div>
                  <p className="text-[14px] font-bold text-white/90">{scan.crop}</p>
                  <p className="text-[10px] text-white/40 font-medium tracking-wider mt-0.5">{scan.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg ${scan.status === 'Healthy' ? 'bg-success/15 border border-success/20 text-success' : 'bg-danger/15 border border-danger/20 text-danger'}`}>
                  {scan.status}
                </span>
                <ArrowRight size={14} className="text-white/15 group-hover:text-white/40 transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* 7. Pro Tip Banner */}
      <motion.div 
        variants={fadeUp}
        className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent backdrop-blur-xl border border-primary/15 rounded-[22px] p-5 flex items-start gap-4"
      >
        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0 border border-primary/20">
          <Sparkles size={18} className="text-primary" />
        </div>
        <div>
          <p className="text-[11px] font-bold text-primary uppercase tracking-widest mb-1">Pro Tip</p>
          <p className="text-[12px] text-white/60 leading-relaxed font-medium">
            Scan leaves early morning for best results. Dew patterns help AI detect fungal infections 40% faster.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
