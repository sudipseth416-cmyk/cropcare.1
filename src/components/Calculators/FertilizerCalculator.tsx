'use client';

import React, { useState, useEffect } from 'react';
import { Calculator, ShoppingBag, Info, IndianRupee, Sprout, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import { calculateFertilizer, CROP_REQUIREMENTS, FertilizerResult } from '@/lib/utils/agriCalculations';

export default function FertilizerCalculator() {
  const [crop, setCrop] = useState('rice');
  const [area, setArea] = useState(1);
  const [unit, setUnit] = useState<'acre' | 'hectare'>('acre');
  const [result, setResult] = useState<FertilizerResult | null>(null);

  useEffect(() => {
    const res = calculateFertilizer(crop, area, unit);
    setResult(res);
  }, [crop, area, unit]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Section */}
      <div className="lg:col-span-5 space-y-6">
        <div className="card bg-primary/5 border-primary/20 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center">
              <Calculator className="text-black" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Fertilizer Calculator</h3>
              <p className="text-xs text-primary font-bold uppercase tracking-widest">Precision Planning</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim block mb-3">Select Crop</label>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(CROP_REQUIREMENTS).map(([id, data]) => (
                  <button
                    key={id}
                    onClick={() => setCrop(id)}
                    className={`p-4 rounded-2xl border text-sm font-bold transition-all ${
                      crop === id ? 'bg-primary border-primary text-black' : 'bg-white/5 border-white/10 text-text-muted hover:border-white/20'
                    }`}
                  >
                    {data.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim block mb-3">Land Area</label>
                <input 
                  type="number"
                  value={area}
                  onChange={(e) => setArea(Number(e.target.value))}
                  className="w-full bg-bg-card border border-white/10 rounded-2xl p-4 text-lg font-bold focus:border-primary focus:outline-none transition-all"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-dim block mb-3">Unit</label>
                <div className="flex bg-white/5 rounded-2xl p-1 border border-white/5">
                  <button 
                    onClick={() => setUnit('acre')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${unit === 'acre' ? 'bg-bg-card shadow-lg text-primary' : 'text-text-dim'}`}
                  >
                    Acre
                  </button>
                  <button 
                    onClick={() => setUnit('hectare')}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${unit === 'hectare' ? 'bg-bg-card shadow-lg text-primary' : 'text-text-dim'}`}
                  >
                    Hectare
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/5 flex gap-4 items-start">
          <Info className="text-info shrink-0" size={20} />
          <p className="text-xs text-text-muted leading-relaxed">
            *This calculation is based on standard NPK recommendations. Soil testing is recommended for more accurate results.
          </p>
        </div>
      </div>

      {/* Result Section */}
      <div className="lg:col-span-7">
        <div className="card h-full">
          {result && (
            <div className="space-y-8">
              <div className="flex justify-between items-end">
                <div>
                  <h4 className="text-sm font-bold text-text-dim uppercase tracking-widest mb-1">Total Requirement</h4>
                  <p className="text-3xl font-bold">Fertilizer Schedule</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-primary uppercase mb-1">Estimated Cost</p>
                  <p className="text-3xl font-bold flex items-center justify-end gap-1">
                    <IndianRupee size={24} /> {result.estimatedCost.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="p-6 rounded-[24px] bg-white/5 border border-white/5 text-center">
                  <p className="text-2xl font-bold text-text-main mb-1">{result.nitrogen}kg</p>
                  <p className="text-[10px] font-bold text-text-dim uppercase tracking-tighter">Nitrogen (N)</p>
                </div>
                <div className="p-6 rounded-[24px] bg-white/5 border border-white/5 text-center">
                  <p className="text-2xl font-bold text-text-main mb-1">{result.phosphorus}kg</p>
                  <p className="text-[10px] font-bold text-text-dim uppercase tracking-tighter">Phosphorus (P)</p>
                </div>
                <div className="p-6 rounded-[24px] bg-white/5 border border-white/5 text-center">
                  <p className="text-2xl font-bold text-text-main mb-1">{result.potassium}kg</p>
                  <p className="text-[10px] font-bold text-text-dim uppercase tracking-tighter">Potassium (K)</p>
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="font-bold flex items-center gap-2">
                  <ShoppingBag size={18} className="text-primary" /> Purchase List
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.products.map((prod, i) => (
                    <div key={i} className="flex justify-between items-center p-5 rounded-2xl bg-black/20 border border-white/5 group hover:border-primary/30 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                          <Layers size={18} />
                        </div>
                        <span className="font-bold">{prod.name}</span>
                      </div>
                      <span className="text-xl font-bold text-primary">{prod.quantity} {prod.unit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 flex gap-4">
                <button className="btn btn-primary flex-1">Order Fertilizer</button>
                <button className="btn btn-ghost flex-1">Save Plan</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
