'use client';

import React, { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, Loader2, BookOpen } from 'lucide-react';
import { Crop, searchCrops } from '@/lib/api/agriDb';
import CropCard from './CropCard';

export default function CropSearch() {
  const [query, setQuery] = useState('');
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      const results = await searchCrops('');
      setCrops(results);
      setLoading(false);
    };
    fetchInitial();
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setLoading(true);
    const results = await searchCrops(val);
    setCrops(results);
    setLoading(false);
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative flex-1 w-full max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-dim" size={20} />
          <input 
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search for crops, diseases, or fertilizers..."
            className="w-full bg-bg-card border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-primary transition-all text-lg"
          />
        </div>
        <button className="btn btn-ghost flex items-center gap-2 h-[60px] px-8">
          <SlidersHorizontal size={20} />
          Filters
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-text-muted font-bold tracking-widest uppercase text-xs">Consulting Database...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {crops.length > 0 ? (
            crops.map(crop => (
              <CropCard key={crop.id} crop={crop} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <BookOpen size={48} className="mx-auto text-text-dim mb-4" />
              <p className="text-text-muted">No crops found matching your search.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
