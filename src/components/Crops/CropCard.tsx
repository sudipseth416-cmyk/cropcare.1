'use client';

import React from 'react';
import { Leaf, Droplets, Thermometer, FlaskConical, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Crop } from '@/lib/api/agriDb';

export default function CropCard({ crop }: { crop: Crop }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="card group cursor-pointer"
    >
      <div className="relative h-48 -mx-6 -mt-6 mb-6 overflow-hidden">
        <img 
          src={crop.image} 
          alt={crop.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent" />
        <div className="absolute bottom-4 left-6">
          <span className="badge badge-success bg-primary text-black mb-2">{crop.season[0]} Crop</span>
          <h3 className="text-2xl font-bold">{crop.name}</h3>
        </div>
      </div>

      <p className="text-text-muted text-sm line-clamp-2 mb-6">
        {crop.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-text-dim">
          <FlaskConical size={14} className="text-info" />
          <span>pH: {crop.ph.min}-{crop.ph.max}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-dim">
          <Droplets size={14} className="text-primary" />
          <span>Water: Medium</span>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 flex justify-between items-center group-hover:text-primary transition-colors">
        <span className="text-xs font-bold uppercase tracking-widest">View Details</span>
        <ChevronRight size={16} />
      </div>
    </motion.div>
  );
}
