'use client';

import React from 'react';
import { motion } from 'framer-motion';

/**
 * 4 unique animated backgrounds for CropCare sections.
 * Each uses a different visual language to create distinct identity.
 */

/* ─── DASHBOARD: Floating Emerald Orbs + Grid ─── */
function DashboardBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dark base with subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Large floating orbs */}
      <motion.div
        animate={{ 
          x: [0, 80, -40, 0],
          y: [0, -60, 40, 0],
          scale: [1, 1.3, 0.9, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-primary/15 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ 
          x: [0, -60, 30, 0],
          y: [0, 50, -80, 0],
          scale: [1, 0.8, 1.2, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-32 -right-20 w-[350px] h-[350px] bg-info/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ 
          x: [0, 40, -20, 0],
          y: [0, -30, 60, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/3 w-[200px] h-[200px] bg-primary/10 rounded-full blur-[80px]"
      />

      {/* Floating micro particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -100 - i * 20],
            opacity: [0, 0.6, 0]
          }}
          transition={{ 
            duration: 4 + i * 1.5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: "easeOut"
          }}
          className="absolute rounded-full bg-primary/40"
          style={{
            width: 3 + i % 3,
            height: 3 + i % 3,
            left: `${15 + i * 14}%`,
            bottom: '10%',
          }}
        />
      ))}

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-bg-dark to-transparent" />
    </div>
  );
}

/* ─── SCANNER: Cyberpunk Grid + Scanning Beam ─── */
function ScannerBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Perspective grid floor */}
      <div 
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.6) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.6) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center top',
        }}
      />
      
      {/* Horizontal scanning beam */}
      <motion.div
        animate={{ y: ['-10%', '110%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_30px_10px_rgba(16,185,129,0.3)]"
      />
      
      {/* Corner brackets */}
      <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-primary/30 rounded-tl-lg" />
      <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-primary/30 rounded-tr-lg" />
      <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-primary/30 rounded-bl-lg" />
      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-primary/30 rounded-br-lg" />

      {/* Center reticle glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px]" />

      {/* Pulsing ring */}
      <motion.div
        animate={{ scale: [1, 2, 1], opacity: [0.15, 0, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border border-primary/30 rounded-full"
      />

      {/* Side data streams */}
      <div className="absolute right-4 top-20 bottom-20 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
      <div className="absolute left-4 top-20 bottom-20 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
    </div>
  );
}

/* ─── WEATHER: Aurora Borealis Waves ─── */
function WeatherBg() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Aurora wave layers */}
      <motion.div
        animate={{ 
          x: [-200, 200, -200],
          skewX: [-5, 5, -5]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-20 -left-40 w-[150%] h-[250px] bg-gradient-to-r from-info/20 via-primary/15 to-cyan-500/10 rounded-full blur-[80px] rotate-[-8deg]"
      />
      <motion.div
        animate={{ 
          x: [100, -150, 100],
          skewX: [3, -3, 3]
        }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-32 -right-40 w-[140%] h-[200px] bg-gradient-to-r from-purple-500/10 via-info/15 to-primary/10 rounded-full blur-[100px] rotate-[5deg]"
      />
      <motion.div
        animate={{ 
          x: [-100, 200, -100],
          y: [0, -20, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[40%] -left-20 w-[130%] h-[180px] bg-gradient-to-r from-teal-500/10 via-sky-400/10 to-indigo-500/5 rounded-full blur-[90px] rotate-[-3deg]"
      />

      {/* Stars / raindrops */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.1, 0.6, 0.1] }}
          transition={{ 
            duration: 2 + (i % 3),
            repeat: Infinity,
            delay: i * 0.3,
          }}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${5 + i * 8}%`,
            top: `${10 + (i * 17) % 60}%`,
          }}
        />
      ))}

      {/* Warm horizon glow */}
      <div className="absolute bottom-0 left-0 right-0 h-60 bg-gradient-to-t from-warning/5 via-transparent to-transparent" />
    </div>
  );
}

/* ─── COMMUNITY: Warm Network Constellation ─── */
function CommunityBg() {
  const nodes = [
    { x: '15%', y: '20%' }, { x: '75%', y: '15%' },
    { x: '85%', y: '55%' }, { x: '25%', y: '70%' },
    { x: '50%', y: '40%' }, { x: '60%', y: '75%' },
    { x: '40%', y: '10%' }, { x: '10%', y: '50%' },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Warm amber/orange glow patches */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-10 right-10 w-[350px] h-[350px] bg-amber-500/15 rounded-full blur-[120px]"
      />
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.12, 0.05] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-20 left-10 w-[300px] h-[300px] bg-orange-500/10 rounded-full blur-[100px]"
      />
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.06, 0.1, 0.06] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 4 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-primary/10 rounded-full blur-[80px]"
      />

      {/* Connection lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.06]" xmlns="http://www.w3.org/2000/svg">
        {nodes.map((from, i) =>
          nodes.slice(i + 1).map((to, j) => {
            const dist = Math.sqrt(
              Math.pow(parseFloat(from.x) - parseFloat(to.x), 2) +
              Math.pow(parseFloat(from.y) - parseFloat(to.y), 2)
            );
            if (dist > 50) return null;
            return (
              <line
                key={`${i}-${j}`}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke="#f59e0b"
                strokeWidth="1"
              />
            );
          })
        )}
      </svg>

      {/* Pulsing node dots */}
      {nodes.map((node, i) => (
        <motion.div
          key={i}
          animate={{ 
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.7, 0.3]
          }}
          transition={{ 
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.4,
          }}
          className="absolute w-2 h-2 bg-amber-400 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"
          style={{ left: node.x, top: node.y }}
        />
      ))}
    </div>
  );
}

/* ─── Exported Map ─── */
const SECTION_BACKGROUNDS: Record<string, React.FC> = {
  home: DashboardBg,
  scan: ScannerBg,
  alerts: WeatherBg,
  community: CommunityBg,
};

export default function SectionBackground({ activeTab }: { activeTab: string }) {
  const BgComponent = SECTION_BACKGROUNDS[activeTab];
  if (!BgComponent) return null;

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-0"
    >
      <BgComponent />
    </motion.div>
  );
}
