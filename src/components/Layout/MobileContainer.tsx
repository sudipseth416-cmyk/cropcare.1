'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MobileContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

export default function MobileContainer({ children, title, description, action }: MobileContainerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-6"
    >
      {(title || action) && (
        <div className="flex justify-between items-end mb-2">
          <div>
            {title && <h2 className="text-2xl font-bold font-heading">{title}</h2>}
            {description && <p className="text-text-muted text-sm mt-1">{description}</p>}
          </div>
          {action}
        </div>
      )}
      <div className="space-y-6">
        {children}
      </div>
    </motion.div>
  );
}
