'use client';

import React from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  Thermometer, 
  Navigation,
  RefreshCcw,
  CloudRain
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useWeather } from '@/hooks/useWeather';
import FarmingAlerts from './FarmingAlerts';

export default function WeatherDashboard() {
  const { weather, loading, error, refresh } = useWeather();

  if (loading) {
    return (
      <div className="card h-full flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCcw className="animate-spin text-primary" size={32} />
          <p className="text-text-muted font-bold tracking-widest uppercase text-xs">Syncing Weather Station...</p>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="card h-full flex items-center justify-center text-center p-8">
        <p className="text-danger mb-4 font-bold">{error || 'Unable to load weather data'}</p>
        <button onClick={() => refresh()} className="btn btn-ghost">Try Again</button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 perspective-1000">
      {/* Current Weather Main Card */}
      <div className="lg:col-span-8">
        <motion.div 
          initial={{ rotateX: 5 }}
          whileHover={{ rotateX: 0, rotateY: -2 }}
          transition={{ duration: 0.5 }}
          className="h-full rounded-[40px] relative overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/20"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Base Background Image */}
          <div className="absolute inset-0 bg-[url('/image3.webp')] bg-cover bg-center opacity-40"></div>
          
          {/* Animated Gradient Mesh */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-info/40 via-primary/20 to-bg-dark opacity-80 backdrop-blur-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-bg-dark/90 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-12 h-full p-10 transform translate-z-20">
            <div className="flex-1">
              <div className="flex items-center gap-2 text-white/70 mb-6 drop-shadow-md">
                <Navigation size={16} className="text-info drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                <span className="font-bold uppercase tracking-[0.2em] text-xs">{weather.name}, {weather.sys.country}</span>
              </div>
              
              <div className="flex items-center gap-8 mb-10">
                <h2 className="text-8xl md:text-9xl font-black font-heading tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                  {weather?.main?.temp ? Math.round(weather.main.temp) : '--'}°
                </h2>
                <div className="space-y-1">
                  <p className="text-4xl font-black text-white drop-shadow-lg">{weather?.weather?.[0]?.main || 'Stable'}</p>
                  <p className="text-white/70 capitalize font-medium tracking-wide">{weather?.weather?.[0]?.description || 'Clear skies'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-10 border-t border-white/10">
                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner">
                  <div className="w-12 h-12 bg-info/20 text-info rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.3)] border border-info/30">
                    <Droplets size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Humidity</p>
                    <p className="font-black text-lg text-white drop-shadow-sm">{weather?.main?.humidity || '--'}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner">
                  <div className="w-12 h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-primary/30">
                    <Wind size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Wind Speed</p>
                    <p className="font-black text-lg text-white drop-shadow-sm">{weather?.wind?.speed || '--'} km/h</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 backdrop-blur-md shadow-inner">
                  <div className="w-12 h-12 bg-warning/20 text-warning rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.3)] border border-warning/30">
                    <CloudRain size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider">Rainfall</p>
                    <p className="font-black text-lg text-white drop-shadow-sm">{weather?.rain?.['1h'] || 0} mm</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full md:w-auto flex flex-col items-center justify-center group transform translate-z-50">
               <motion.div
                 animate={{ y: [0, -20, 0], rotateZ: [0, 5, -5, 0] }}
                 transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                 className="relative"
               >
                 <div className="absolute inset-0 bg-info/40 blur-[100px] rounded-full scale-150 mix-blend-screen pointer-events-none"></div>
                 <CloudSun size={160} strokeWidth={1} className="text-white drop-shadow-[0_20px_50px_rgba(255,255,255,0.4)] relative z-10" />
               </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Farming Alerts Sidebar */}
      <div className="lg:col-span-4">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[40px] h-full p-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)]">
          <FarmingAlerts weather={weather} />
          
          <div className="mt-8 p-6 rounded-[24px] bg-primary/10 border border-primary/20 text-sm text-white/90 italic leading-relaxed shadow-inner">
            "Pro Tip: High humidity detected in your region. Consider delayed evening irrigation to prevent root rot."
          </div>
        </div>
      </div>
    </div>
  );
}
