'use client';

import React from 'react';

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={`bg-white/5 animate-pulse rounded-2xl ${className}`} />
);

export function WeatherSkeleton() {
  return (
    <div className="card h-full p-8 space-y-6">
      <div className="flex justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-12" />
      </div>
      <div className="flex gap-8 items-center">
        <Skeleton className="h-20 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/5">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    </div>
  );
}

export function PostSkeleton() {
  return (
    <div className="card p-6 mb-6 space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-48 w-full -mx-6" />
    </div>
  );
}
